export interface KafkaMessage {
   getKey(): string;
   getName(): string;
}