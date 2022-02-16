namespace Antifraud.Kafka
{
    public interface IConsumer<TMessage>
    {
        void Consume(TMessage message);
    }
}
