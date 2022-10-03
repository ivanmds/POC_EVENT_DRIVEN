import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";
import { Span } from "nestjs-otel";
import { errorMapped } from "../error-mapped";
import { Result } from "../result";
import { KafkaMessage } from "./kafka.message";

@Injectable()
export class KafkaBus implements OnModuleInit {
    
    private producer: Producer;

    @Span("KafkaBus_publishMessage")
    async publishMessage(topicName: string, event: KafkaMessage): Promise<Result> {

        try {
            const key = event.getKey();
            const eventName = event.getName();
            
            await this.producer.send({
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


    @Span("KafkaBus_init")
    private async init() : Promise<void> {

        const kafka = new Kafka({
            brokers: [process.env.KAFKA_BROKER],
            clientId: 'api-customer',
        });

        this.producer = kafka.producer();
        await this.producer.connect();
    }

    async onModuleInit() {
      this.init();
    }
}