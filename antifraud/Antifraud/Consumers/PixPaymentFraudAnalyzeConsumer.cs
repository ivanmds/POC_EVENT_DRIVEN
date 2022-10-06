using Antifraud.AnalysisResults;
using Antifraud.Commands;
using Antifraud.Kafka;
using Antifraud.Repositories;
using Antifraud.ExternalContracts;
using System.Diagnostics;

namespace Antifraud.Consumers
{
    public class PixPaymentFraudAnalyzeConsumer : IConsumer<PixPaymentFraudAnalyzeCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IKafkaProducer _kafkaProducer;
        private readonly ActivitySource _activitySource;

        public PixPaymentFraudAnalyzeConsumer(ICustomerRepository customerRepository, IKafkaProducer kafkaProducer, ActivitySource activitySource)
        {
            _customerRepository = customerRepository;
            _kafkaProducer = kafkaProducer;
            _activitySource = activitySource;
        }

        public void Consume(PixPaymentFraudAnalyzeCommand message)
        {
            try
            {
                var activity = _activitySource.StartActivity("PixPaymentFraudAnalyzeConsumer.Consume");
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
