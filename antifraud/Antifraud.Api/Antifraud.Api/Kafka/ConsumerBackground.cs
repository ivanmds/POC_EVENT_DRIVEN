using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Antifraud.Api.Kafka
{
    public class ConsumerBackground : BackgroundService
    {
        private IConsumer<string, string> _consumer;
        private readonly KafkaConsumerConfig _config;
        private readonly IServiceProvider _services;
        private readonly KafkaDictConsumers _kafkaDictConsumers;

        public ConsumerBackground(IServiceProvider services, KafkaDictConsumers kafkaDictConsumers, KafkaConsumerConfig config)
        {
            _services = services;
            _kafkaDictConsumers = kafkaDictConsumers;
            _config = config;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var conf = new ConsumerConfig
            {
                GroupId = _config.GroupId,
                BootstrapServers = _config.ConnectionString,
                AutoOffsetReset = AutoOffsetReset.Earliest
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
                        var types = _kafkaDictConsumers.GetConsumerType(eventName);
                        var consumer = scope.ServiceProvider.GetService(types.Consumer);

                        var @event = JsonConvert.DeserializeObject(msgBody, types.Message);

                        var methodConsume = types.Consumer.GetMethod("Consume");
                        
                        methodConsume.Invoke(consumer, new[] { @event });
                    }
                });
            }
            catch (Exception ex)
            {
            }
        }

        public override void Dispose()
        {
            _consumer?.Close();
            base.Dispose();
        }
    }
}