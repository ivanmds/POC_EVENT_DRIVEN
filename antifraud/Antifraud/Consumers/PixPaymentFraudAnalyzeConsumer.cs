using Antifraud.AnalysisResults;
using Antifraud.Commands;
using Antifraud.Kafka;
using Antifraud.Repositories;
using System.Threading.Tasks;

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
                Task.Delay(3000);
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
