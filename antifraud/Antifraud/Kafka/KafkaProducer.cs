using Confluent.Kafka;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Antifraud.Kafka
{
    public class KafkaProducer : IKafkaProducer
    {
        public void Publish(string topicName, object message)
        {
            var config = new ProducerConfig
            {
                BootstrapServers = "localhost:9092",
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
