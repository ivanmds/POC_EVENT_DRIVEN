namespace Antifraud.Kafka
{
    public class KafkaConsumerConfig
    {
        public string GroupId { get; set; }
        public string ConnectionString { get; set; }
        public string TopicName { get; set; }
        public string EventName { get; set; }
    }

    public class KafkaConsumerConfigAnalysis
    {
        public string GroupId { get; set; }
        public string ConnectionString { get; set; }
        public string TopicName { get; set; }
        public string EventName { get; set; }
    }
}
