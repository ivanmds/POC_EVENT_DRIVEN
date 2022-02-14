namespace Antifraud.Api.Kafka
{
    public interface IConsumer<TMessage>
    {
        void Consume(TMessage message);
    }
}
