import { KafkaMessage } from "src/common/kafka/kafka.message";
import { AddressDto } from "../address.dto";
import { CustomerStatusTypeDto } from "../types/customer-status-type.dto";

export class CustomerWasUpdatedEvent implements KafkaMessage {
    
    public id: string;
    public name: string;
    public motherName: string;
    public birthDate: Date;
    public status: CustomerStatusTypeDto;

    public address: AddressDto;

    getKey(): string {
        return this.id;
    }

    getName(): string {
       return CustomerWasUpdatedEvent.externalEventName;
    }

    static externalEventName : string = 'CUSTOMER_WAS_CREATED';
}