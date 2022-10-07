using System;
using System.Diagnostics;
using Confluent.Kafka;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Antifraud.Kafka
{
    public class KafkaProducer : IKafkaProducer
    {
        private static string kafkaConnection = Environment.GetEnvironmentVariable("KAFKA_BROKER") ?? "localhost:9092";

        private readonly ActivitySource _activitySource;

        public KafkaProducer(ActivitySource activitySource)
        {
            _activitySource = activitySource;
        }

        public void Publish(string topicName, object message)
        {
            using var activity = _activitySource.StartActivity("KafkaProducer.Publish", ActivityKind.Internal);
            var config = new ProducerConfig
            {
                BootstrapServers = kafkaConnection,
                ClientId = "antifraud-fraud-analysis"
            };

            using (var producer = new ProducerBuilder<Null, string>(config).Build())
            {
                var jsonSerializerSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };
                jsonSerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());

                var json = JsonConvert.SerializeObject(message, jsonSerializerSettings);

                var result = producer.ProduceAsync(topicName, new Message<Null, string> { Value = json }).Result;
                if(result.Status != PersistenceStatus.Persisted)
                {
                    producer.ProduceAsync(topicName, new Message<Null, string> { Value = json }).Wait();
                }
            }
        }
    }

    public interface IKafkaProducer
    {
        void Publish(string topicName, object message);
    }
}
