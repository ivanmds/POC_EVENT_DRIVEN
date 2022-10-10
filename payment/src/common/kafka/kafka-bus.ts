import { Injectable } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { errorMapped } from "../error-mapped";
import { Result } from "../result";
import { KafkaMessage } from "./kafka.message";
import { Span, TraceService } from "nestjs-otel";
import { Console } from "console";

@Injectable()
export class KafkaBus {


    constructor(private readonly traceService: TraceService) { }

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
            const currentSpan = this.traceService.getSpan();

            const kafka = new Kafka({
                brokers: [process.env.KAFKA_BROKER],
                clientId: 'api-customer',
            });

            const spanId = currentSpan["_spanContext"]["spanId"];
            const traceId = currentSpan["_spanContext"]["traceId"];

            const producer = kafka.producer();
            await producer.connect()
            await producer.send({
                topic: topicName,
                messages: [{
                    key: key,
                    value: JSON.stringify(message),
                    headers: { event_name: topicName, span_id: spanId, trace_id: traceId }
                }],
            });

            return Result.ok();
        } catch (err) {
            return Result.fail2(errorMapped.kafka(err));
        }
    }
}