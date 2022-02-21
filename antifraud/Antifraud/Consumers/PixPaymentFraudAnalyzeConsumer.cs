using Antifraud.AnalysisResults;
using Antifraud.Commands;
using Antifraud.Kafka;
using Antifraud.Repositories;

namespace Antifraud.Consumers
{
    public class PixPaymentFraudAnalyzeConsumer : IConsumer<PixPaymentFraudAnalyzeCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IKafkaProducer _kafkaProducer;

        public PixPaymentFraudAnalyzeConsumer(ICustomerRepository customerRepository, IKafkaProducer kafkaProducer)
        {
            _customerRepository = customerRepository;
            _kafkaProducer = kafkaProducer;
        }

        public void Consume(PixPaymentFraudAnalyzeCommand message)
        {
            try
            {
                var customer = _customerRepository.GetByDocumentNumber(message.Debit.DocumentNumber);
                var result = customer is null ? AnalysisResult.CustomerError : AnalysisResult.Approved;
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
