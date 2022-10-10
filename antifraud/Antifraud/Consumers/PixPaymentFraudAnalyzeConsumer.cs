using Antifraud.AnalysisResults;
using Antifraud.Commands;
using Antifraud.Kafka;
using Antifraud.Repositories;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using Antifraud.Domain.Services;

namespace Antifraud.Consumers
{
    public class PixPaymentFraudAnalyzeConsumer : IConsumer<PixPaymentFraudAnalyzeCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IKafkaProducer _kafkaProducer;
        private readonly ActivitySource _activitySource;
        private readonly Counter<int> _counter;
        private readonly AntifraudService _antifraudService;

        public PixPaymentFraudAnalyzeConsumer(ICustomerRepository customerRepository, IKafkaProducer kafkaProducer, ActivitySource activitySource, Counter<int> counter)
        {
            _customerRepository = customerRepository;
            _kafkaProducer = kafkaProducer;
            _activitySource = activitySource;
            _counter = counter;
            _antifraudService = new AntifraudService(_activitySource);
        }

        public void Consume(PixPaymentFraudAnalyzeCommand message, string parentSpanId = null, string parentTraceId = null)
        {
            try
            {

                var parentContext = new ActivityContext(
                    ActivityTraceId.CreateFromString(parentTraceId),
                    ActivitySpanId.CreateFromString(parentSpanId),
                    ActivityTraceFlags.Recorded);

                _counter.Add(1);
                using var activity = _activitySource.StartActivity("PixPaymentFraudAnalyzeConsumer.Consume", ActivityKind.Consumer, parentContext);

                var customer = _customerRepository.GetByDocumentNumber(message.Debit.DocumentNumber);
                var result = _antifraudService.PixTransactionAnalysis(customer);

                var analysis = new PixPaymentAnalysis() { TransactionCode = message.TransactionCode, Result = result };
                _kafkaProducer.Publish("pix_payment_fraud_analyse_response", analysis);
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
    }
}
