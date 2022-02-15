﻿using Antifraud.Api.Kafka;
using Antifraud.Api.Mapping;
using Antifraud.Api.Repositories;

namespace Antifraud.Api.Consumers
{
    public class CustomerWasCreatedCunsumer : IConsumer<CustomerWasCreated>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;

        public CustomerWasCreatedCunsumer(ICustomerRepository customerRepository, IMapper mapper)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
        }


        public void Consume(CustomerWasCreated message)
        {
            var customer = _mapper.Map(message);
            _customerRepository.InsertOne(customer);
        }
    }
}
