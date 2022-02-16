using Antifraud.Kafka;
using Antifraud.Mapping;
using Antifraud.Repositories;

namespace Antifraud.Consumers
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
