using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;

namespace Antifraud.Api.Kafka
{
    public static class KafkaExtension
    {
        private static Dictionary<string, ConsumerConfiguration> dictConsumers = new Dictionary<string, ConsumerConfiguration>();

        public static void AddConsumer<TMessage, TConsumer>(this IServiceCollection services, KafkaConsumerConfig config)
        {
            var consumerType = typeof(TConsumer);
            var messageType = typeof(TMessage);
            dictConsumers.Add(config.EventName, new ConsumerConfiguration { Consumer = consumerType, Message = messageType });

            var kafKaDictConsumer = new KafkaDictConsumers(dictConsumers);
            services.AddSingleton(kafKaDictConsumer);
            services.AddSingleton(config);

            services.AddSingleton(consumerType);
            services.AddHostedService<ConsumerBackground>();
        }
    }
}
