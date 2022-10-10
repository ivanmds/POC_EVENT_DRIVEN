using Antifraud.Kafka;
using Antifraud.Mapping;
using Antifraud.Repositories;
using Antifraud.ExternalContracts;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Antifraud.Consumers
{
    public class CustomerWasCreatedCunsumer : IConsumer<CustomerWasCreated>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly ActivitySource _activitySource;
        private readonly ILogger<CustomerWasCreatedCunsumer> _logger;

        public CustomerWasCreatedCunsumer(ICustomerRepository customerRepository, IMapper mapper, ActivitySource activitySource, ILogger<CustomerWasCreatedCunsumer> logger)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _activitySource = activitySource;
            _logger = logger;
        }

        public void Consume(CustomerWasCreated message, string parrentSpanId = null, string parentTraceId = null)
        {
            using var activity = _activitySource.StartActivity("CustomerWasCreatedCunsumer.Consume", ActivityKind.Consumer, default(ActivityContext));
            var customer = _mapper.Map(message);
            _customerRepository.InsertOne(customer);
            _logger.LogInformation($"customer document {message.DocumentNumber} was saved.");
        }
    }
}
