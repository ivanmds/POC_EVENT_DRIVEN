using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Antifraud.Kafka
{
    public class ConsumerBackground : BackgroundService
    {
        private IConsumer<string, string> _consumer;
        private readonly KafkaConsumerConfig _config;
        private readonly IServiceProvider _services;
        private readonly KafkaDictConsumers _kafkaDictConsumers;

        private readonly ILogger<ConsumerBackground> _logger;

        public ConsumerBackground(IServiceProvider services, KafkaDictConsumers kafkaDictConsumers, KafkaConsumerConfig config, ILogger<ConsumerBackground> logger)
        {
            _services = services;
            _kafkaDictConsumers = kafkaDictConsumers;
            _config = config;
            _logger = logger;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var conf = new ConsumerConfig
            {
                GroupId = _config.GroupId,
                BootstrapServers = _config.ConnectionString,
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = true
            };

            _consumer = new ConsumerBuilder<string, string>(conf).Build();
            _consumer.Subscribe(_config.TopicName);
            await base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = _services.CreateScope();
                await Task.Run(async () =>
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var result = _consumer.Consume(stoppingToken);

                        var eventName = Encoding.Default.GetString(result.Message.Headers[0].GetValueBytes());

                        var msgBody = result.Message.Value;


                        var spanIdBuffer = result.Message.Headers.FirstOrDefault(p => p.Key == "span_id")?.GetValueBytes();
                        string spanId = null;
                        if (spanIdBuffer != null)
                        {
                            spanId = Encoding.Default.GetString(spanIdBuffer);
                        }

                        var traceIdBuffer = result.Message.Headers.FirstOrDefault(p => p.Key == "trace_id")?.GetValueBytes();
                        string traceId = null;
                        if (spanIdBuffer != null)
                        {
                            traceId = Encoding.Default.GetString(traceIdBuffer);
                        }

                        var types = _kafkaDictConsumers.GetConsumerType(eventName);
                        var consumer = scope.ServiceProvider.GetService(types.Consumer);

                        var @event = JsonConvert.DeserializeObject(msgBody, types.Message);

                        var methodConsume = types.Consumer.GetMethod("Consume");
                        
                        methodConsume.Invoke(consumer, new[] { @event, spanId, traceId });
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message, ex);
            }
        }

        public override void Dispose()
        {
            _consumer?.Close();
            base.Dispose();
        }
    }
}