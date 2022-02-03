import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { errorMapped } from "../error-mapped";
import { Result } from "../result";
import { KafkaMessage, Notification } from "./kafka.message";

@Injectable()
export class KafkaBus {

    async publishMessage(topicName: string, event: KafkaMessage): Promise<Result> {

        try {
            const key = event.getKey();
            const kafkaMessage = new Notification();
            kafkaMessage.key = key;
            kafkaMessage.name = event.getName();
            kafkaMessage.data = JSON.stringify(event);

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer'
            });
            const producer = kafka.producer();
            await producer.connect()
            await producer.send({
                topic: topicName,
                messages: [{
                    key: key,
                    value: JSON.stringify(kafkaMessage)
                }],
            });
            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }
}