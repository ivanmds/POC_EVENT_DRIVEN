using Antifraud.Api.Kafka;

namespace Antifraud.Api.Consumers
{
    public class CustomerWasCreatedCunsumer : IConsumer<CustomerWasCreated>
    {
        public void Consume(CustomerWasCreated message)
        {
            
        }
    }
}
