using System;
using System.Collections.Generic;

namespace Antifraud.Kafka
{
    public class KafkaDictConsumers
    {
        private Dictionary<string, ConsumerConfiguration> ConsumerConfigurations { get; set; }

        public KafkaDictConsumers(Dictionary<string, ConsumerConfiguration> configurations)
        {
            this.ConsumerConfigurations = configurations;
        }

        public ConsumerConfiguration GetConsumerType(string eventName)
        {
            return ConsumerConfigurations.GetValueOrDefault(eventName);
        }
    }

    public class ConsumerConfiguration
    {
        public Type Consumer { get; set; }
        public Type Message { get; set; }
        public KafkaConsumerConfig Config { get; set; }
        public KafkaConsumerConfigAnalysis ConfigAnalysis { get; set; }
    }
}
