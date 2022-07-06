using Confluent.Kafka;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Antifraud.Kafka
{
    public class ConsumerBackgroundMessageKey : BackgroundService
    {
        private IConsumer<string, string> _consumer;
        private readonly IServiceProvider _services;

        public ConsumerBackgroundMessageKey(IServiceProvider services)
        {
            _services = services;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            var conf = new ConsumerConfig
            {
                GroupId = "test_group",
                BootstrapServers = "localhost:9092",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = true
            };

            _consumer = new ConsumerBuilder<string, string>(conf).Build();
            _consumer.Subscribe("test.messageKey");
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
                        var messageValue = result.Message.Value;
                        var messageKey = result.Message.Key;

                        Console.WriteLine($"messageKey sended {messageKey} with message {messageValue} it's in partiion {result.Partition.Value}");
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