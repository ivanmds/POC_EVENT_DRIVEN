using Antifraud.Kafka;
using Antifraud.Mapping;
using Antifraud.Repositories;
using Antifraud.ExternalContracts;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Antifraud.Consumers
{
    public class CustomerWasUpdatedCunsumer : IConsumer<CustomerWasUpdated>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly ActivitySource _activitySource;
        private readonly ILogger<CustomerWasUpdatedCunsumer> _logger;

        public CustomerWasUpdatedCunsumer(ICustomerRepository customerRepository, IMapper mapper, ActivitySource activitySource, ILogger<CustomerWasUpdatedCunsumer> logger)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _activitySource = activitySource;
            _logger = logger;
        }

        public void Consume(CustomerWasUpdated message, string parrentSpanId = null, string parentTraceId = null)
        {
            using var activity = _activitySource.StartActivity("CustomerWasUpdatedCunsumer.Consume", ActivityKind.Consumer, default(ActivityContext));
            var customer = _mapper.Map(message);
            _customerRepository.ReplaceOne(customer);
            _logger.LogInformation($"Customer document {message.DocumentNumber} was updated.");
        }
    }
}
