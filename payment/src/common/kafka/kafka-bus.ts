import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { errorMapped } from "../error-mapped";
import { Result } from "../result";
import { KafkaMessage } from "./kafka.message";
import { Span } from "nestjs-otel";

@Injectable()
export class KafkaBus {

    @Span("KafkaBus_publishMessage")
    async publishMessage(topicName: string, event: KafkaMessage): Promise<Result> {

        try {

            const key = event.getKey();
            const eventName = event.getName();

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer',
            });

            const producer = kafka.producer();
            await producer.connect()
            await producer.send({
                topic: topicName,
                messages: [{
                    key: key,
                    value: JSON.stringify(event),
                    headers: { event_name: eventName }
                }],
            });
            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }

    @Span("KafkaBus_publishMessageAny")
    async publishMessageAny(topicName: string, key: string, message: any): Promise<Result> {

        try {

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer',
            });

            const producer = kafka.producer();
            await producer.connect()
            await producer.send({
                topic: topicName,
                messages: [{
                    key: key,
                    value: JSON.stringify(message),
                    headers: { event_name: topicName }
                }],
            });
            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }
}