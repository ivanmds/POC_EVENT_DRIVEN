import { KafkaMessage } from "src/common/kafka/kafka.message";
import { CustomerWasCreated, google, CustomerStatusType } from "./customer-was-created";

export class CustomerWasCreatedEvent implements KafkaMessage, CustomerWasCreated {
    
    public id: string;
    public documentNumber: string;
    public name: string;
    public motherName: string;
    public birthDate: google.protobuf.Timestamp;
    public created: google.protobuf.Timestamp;
    public status: CustomerStatusType;

    getKey(): string {
        return this.id;
    }

    getName(): string {
        return CustomerWasCreatedEvent.externalEventName;
    }

    static externalEventName : string = 'CUSTOMER_WAS_CREATED';
}