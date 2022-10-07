using Antifraud.AnalysisResults;
using Antifraud.Commands;
using Antifraud.Kafka;
using Antifraud.Repositories;
using Antifraud.ExternalContracts;
using System.Diagnostics;
using System.Diagnostics.Metrics;

namespace Antifraud.Consumers
{
    public class PixPaymentFraudAnalyzeConsumer : IConsumer<PixPaymentFraudAnalyzeCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IKafkaProducer _kafkaProducer;
        private readonly ActivitySource _activitySource;
        private readonly Counter<int> _counter;

        public PixPaymentFraudAnalyzeConsumer(ICustomerRepository customerRepository, IKafkaProducer kafkaProducer, ActivitySource activitySource, Counter<int> counter)
        {
            _customerRepository = customerRepository;
            _kafkaProducer = kafkaProducer;
            _activitySource = activitySource;
            _counter = counter;
        }

        public void Consume(PixPaymentFraudAnalyzeCommand message)
        {
            try
            {
                _counter.Add(1);
                using var activity = _activitySource.StartActivity("PixPaymentFraudAnalyzeConsumer.Consume", ActivityKind.Consumer, default(ActivityContext));
                var customer = _customerRepository.GetByDocumentNumber(message.Debit.DocumentNumber);
                var result = customer is null ? AnalysisResult.CustomerError : customer.Status == CustomerStatusType.Simple ? AnalysisResult.Disapproved : AnalysisResult.Approved;
                
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
