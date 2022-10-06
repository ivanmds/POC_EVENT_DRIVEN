using Antifraud.Kafka;
using Antifraud.Mapping;
using Antifraud.Repositories;
using Antifraud.ExternalContracts;
using System.Diagnostics;

namespace Antifraud.Consumers
{
    public class CustomerWasUpdatedCunsumer : IConsumer<CustomerWasUpdated>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly ActivitySource _activitySource;

        public CustomerWasUpdatedCunsumer(ICustomerRepository customerRepository, IMapper mapper, ActivitySource activitySource)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _activitySource = activitySource;
        }

        public void Consume(CustomerWasUpdated message)
        {
            var activity = _activitySource.StartActivity("CustomerWasUpdatedCunsumer.Consume");
            var customer = _mapper.Map(message);
            _customerRepository.ReplaceOne(customer);
        }
    }
}
