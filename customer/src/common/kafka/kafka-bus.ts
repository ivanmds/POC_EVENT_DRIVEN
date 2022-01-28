import { Injectable } from "@nestjs/common";
import { Kafka, Message } from "kafkajs";
import { environment } from "../environment";
import { errorMapped } from "../error-mapped";
import { BaseEvent } from "../events/base.event";
import { Result } from "../result";
import { KafkaMessage } from "./kafka.message";

@Injectable()
export class KafkaBus {

    async publishMessage(event: BaseEvent): Promise<Result> {

        try {
            const key = event.aggregateId;
            const kafkaMessage = new KafkaMessage();
            kafkaMessage.key = key;
            kafkaMessage.name = event.eventName;
            kafkaMessage.timestamp = event.created;
            kafkaMessage.data = JSON.stringify(event);

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer'
            });
            const producer = kafka.producer();
            await producer.connect()
            await producer.send({
                topic: environment.topics.customer_events,
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


    async publishMessages(messages: BaseEvent[]): Promise<Result> {

        try {
            const kafkaMessages = new Array<Message>();

            messages.forEach(event => {
                const key = event.aggregateId;
                const kafkaMessage = new KafkaMessage();
                kafkaMessage.key = key;
                kafkaMessage.name = event.eventName;
                kafkaMessage.timestamp = event.created;
                kafkaMessage.data = JSON.stringify(event);

                kafkaMessages.push({
                    key: key,
                    value: JSON.stringify(kafkaMessage)
                });
            });

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer'
            });
            const producer = kafka.producer();
            await producer.connect()
            const result = await producer.send({
                topic: environment.topics.customer_events,
                messages: kafkaMessages,
            });

            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }
}