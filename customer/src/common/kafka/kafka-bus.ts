import { Message } from "kafkajs";
import { errorMapped } from "../error-mapped";
import { Result } from "../result";
import { KafkaConnection } from "./kafka.connection";
import { KafkaMessage, Notification } from "./kafka.message";

export class KafkaBus {

    constructor(public kafka: KafkaConnection) { }

    async publishMessage(message: KafkaMessage, topic: string): Promise<Result> {

        try {

            const key = message.getEntityId();
            const notification = this.getNotification(message);
            var messageJson = JSON.stringify(notification);

            const producer = this.kafka.getConnection().producer();
            await producer.connect()
            await producer.send({
                topic: topic,
                messages: [{
                    key: key,
                    value: messageJson
                }],
            });
            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }


    async publishMessages(messages: KafkaMessage[], topic: string): Promise<Result> {

        try {
            const kafkaMessages = new Array<Message>();

            messages.forEach(message => {
                const key = message.getEntityId();
                const notification = this.getNotification(message);
                var messageJson = JSON.stringify(notification);
                const kafkaMessage = {
                    key: key,
                    value: messageJson
                };
                kafkaMessages.push(kafkaMessage);
            });

            const producer = this.kafka.getConnection().producer();
            await producer.connect()
            await producer.send({
                topic: topic,
                messages: kafkaMessages,
            });

            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }

    private getNotification(message: KafkaMessage): Notification {
        const notification = new Notification();

        notification.companyKey = message.getCompanyKey();
        notification.correlationId = message.getCorrelationId();
        notification.entityId = message.getEntityId();
        notification.name = message.getName();
        notification.timestamp = message.getTimestamp();
        notification.data = message;
        return notification;
    }
}