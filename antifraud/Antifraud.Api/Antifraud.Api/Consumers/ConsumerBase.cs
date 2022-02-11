using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Antifraud.Api.Consumers
{
    public abstract class ConsumerBase<TMessage> : BackgroundService
    {
        private IConsumer<string, string> consumer;
        private readonly IServiceProvider services;
        private readonly string topicName;

        public ConsumerBase(IServiceProvider services, string topicName)
        {
            this.services = services;
            this.topicName = topicName;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var conf = new ConsumerConfig
            {
                GroupId = "antifraud-consumers",
                BootstrapServers = "localhost:9092",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            consumer = new ConsumerBuilder<string, string>(conf).Build();
            consumer.Subscribe(topicName);
            await base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = services.CreateScope();
                await Task.Run(async () =>
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var result = consumer.Consume(stoppingToken);
                        
                        var msgBody = result.Message.Value;
                        var @event = JsonConvert.DeserializeObject<TMessage>(msgBody);
                        await Consume(@event);
                    }
                });
            }
            catch (Exception ex)
            {
            }
        }

        public override void Dispose()
        {
            consumer?.Close();
            base.Dispose();
        }

        public abstract Task Consume(TMessage message);
    }

    public class Notification<TMessage>
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public Timestamp Timestamp { get; set; }
        public TMessage Data { get; set; }
    }
}