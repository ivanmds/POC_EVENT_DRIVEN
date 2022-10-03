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
            try
            {
                var conf = new ConsumerConfig
                {
                    GroupId = "core.invoice.group.id",
                    BootstrapServers = "b-3.acsprd-msk.tvk9yu.c13.kafka.us-east-1.amazonaws.com:9092,b-1.acsprd-msk.tvk9yu.c13.kafka.us-east-1.amazonaws.com:9092,b-2.acsprd-msk.tvk9yu.c13.kafka.us-east-1.amazonaws.com:9092",

                    AutoOffsetReset = AutoOffsetReset.Earliest,
                    EnableAutoCommit = true
                };


                _consumer = new ConsumerBuilder<string, string>(conf).Build();

                _consumer.Subscribe("bankly.event.boleto");
                await base.StartAsync(cancellationToken);

               
            }
            catch (Exception ex)
            {
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = _services.CreateScope();
                _consumer.Assign(new TopicPartitionOffset("bankly.event.boleto", 0, 195033));

                //_consumer.Seek(new TopicPartitionOffset("bankly.event.boleto", 0, 195033));
                await Task.Run(async () =>
                {
                    while (!stoppingToken.IsCancellationRequested)
                    {
                        var result = _consumer.Consume(stoppingToken);
                        var messageValue = result.Message.Value;
                        var messageKey = result.Message.Key;
                        _consumer.Commit(result);

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