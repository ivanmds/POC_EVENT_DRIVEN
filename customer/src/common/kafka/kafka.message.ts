export class Notification {
   key: string;
   name: string;
   timestamp: Date;
   data: string;
}

export interface KafkaMessage {
   getKey(): string;
   getName(): string;
}