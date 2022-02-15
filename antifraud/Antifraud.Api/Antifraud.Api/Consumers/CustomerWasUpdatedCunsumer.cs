using Antifraud.Api.Kafka;
using Antifraud.Api.Mapping;
using Antifraud.Api.Repositories;

namespace Antifraud.Api.Consumers
{
    public class CustomerWasUpdatedCunsumer : IConsumer<CustomerWasUpdated>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;

        public CustomerWasUpdatedCunsumer(ICustomerRepository customerRepository, IMapper mapper)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
        }

        public void Consume(CustomerWasUpdated message)
        {
            var customer = _mapper.Map(message);
            _customerRepository.ReplaceOne(customer);
        }
    }
}
