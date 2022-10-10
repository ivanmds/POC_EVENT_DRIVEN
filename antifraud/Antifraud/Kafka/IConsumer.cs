namespace Antifraud.Kafka
{
    public interface IConsumer<TMessage>
    {
        void Consume(TMessage message, string parentSpanId = null, string parentTraceId = null);
    }
}
