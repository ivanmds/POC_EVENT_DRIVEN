import { OnModuleInit } from "@nestjs/common";
import { Kafka } from "kafkajs";
import { environment } from "../environment";

export class KafkaConnection implements OnModuleInit {

    private kafka: Kafka = null;

    getConnection(): Kafka {
        return this.kafka;
    }

    onModuleInit() {
        this.kafka = new Kafka(environment.kafkaConfig);
    }
}