import { Kafka } from "kafkajs";


export abstract class KafkaConsumer {

    constructor(
        protected groupid: string,
        protected topic: string) { }

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
                    console.log({
                        topic,
                        partition,
                        offset: message.offset,
                        value: message.value.toString(),
                    });

                    this.do(JSON.parse(message.value.toString()));
                },
            });
        } else {
            throw new Error(`consumer not initiated`);
        }
    }

    abstract do(message: any): Promise<void>;
}