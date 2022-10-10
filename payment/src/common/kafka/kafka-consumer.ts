import { Kafka } from "kafkajs";
import { Span } from "nestjs-otel";

export abstract class KafkaConsumer {

    constructor(
        protected groupid: string,
        protected topic: string) { }

    @Span("KafkaConsumer_init")
    async init(): Promise<any> {

        const kafka = new Kafka({
            brokers: [process.env.KAFKA_BROKER],
            clientId: 'payment-consumer',
        });

        const consumer = kafka.consumer({ groupId: this.groupid });
        if (consumer) {
            await consumer.connect();
            await consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                   
                    const traceId = message.headers["trace_id"]?.toString();
                    const spanId = message.headers["span_id"]?.toString();

                    this.do(JSON.parse(message.value.toString()), traceId, spanId);
                },
            });
        } else {
            throw new Error(`consumer not initiated`);
        }
    }

    abstract do(message: any, traceId: string, spanId: string): Promise<void>;
}