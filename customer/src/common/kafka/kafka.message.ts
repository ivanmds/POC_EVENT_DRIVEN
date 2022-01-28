export interface KafkaMessage {
    getEntityId(): string;
    getCompanyKey(): string;
    getName(): string;
    getTimestamp(): Date;
    getCorrelationId(): string;
}

export class Notification {
    entityId: string;
    companyKey: string;
    name: string;
    timestamp: Date;
    correlationId: string;
    data: any;
}