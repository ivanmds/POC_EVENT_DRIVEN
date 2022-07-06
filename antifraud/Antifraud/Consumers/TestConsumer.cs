using System;
using Antifraud.Kafka;

namespace Antifraud.Consumers
{
    public class TestConsumer : IConsumer<string>
    {
        public void Consume(string message)
        {
            Console.WriteLine(message);
        }
    }
}
