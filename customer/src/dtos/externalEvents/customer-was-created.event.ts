import { KafkaMessage } from "src/common/kafka/kafka.message";
import { CustomerStatusTypeDto } from "../types/customer-status-type.dto";

export class CustomerWasCreatedEvent implements KafkaMessage {
    
    public id: string;
    public name: string;
    public motherName: string;
    public birthDate: Date;
    public created: Date;
    public status: CustomerStatusTypeDto;

    getKey(): string {
        return this.id;
    }

    getName(): string {
        return CustomerWasCreatedEvent.externalEventName;
    }

    static externalEventName : string = 'CUSTOMER_WAS_CREATED';
}