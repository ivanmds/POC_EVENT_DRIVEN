using System;
using System.Collections.Generic;

namespace Antifraud.Api.Kafka
{
    public class KafkaDictConsumers
    {
        private Dictionary<string, Types> DictConsumers { get; set; }

        public KafkaDictConsumers(Dictionary<string, Types> dictConsumers)
        {
            this.DictConsumers = dictConsumers;
        }

        public Types GetConsumerType(string eventName)
        {
            return DictConsumers.GetValueOrDefault(eventName);
        }
    }

    public class Types
    {
        public Type Consumer { get; set; }
        public Type Message { get; set; }
    }
}
