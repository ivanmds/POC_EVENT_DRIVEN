using System;
using System.Threading.Tasks;

namespace Antifraud.Api.Consumers
{
    public class CustomerWasCreatedCunsumer : ConsumerBase<CustomerWasCreated>
    {
        public CustomerWasCreatedCunsumer(IServiceProvider services)
            : base(services, "customer_external_events") { }

        public override async Task Consume(Notification<CustomerWasCreated> notification)
        {
           
        }
    }
}
