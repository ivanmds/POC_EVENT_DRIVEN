import { KafkaMessage } from "src/common/kafka/kafka.message";
import { AddressDto } from "../address.dto";
import { CustomerWasUpdated, google, CustomerStatusType, Contract } from "./customer-was-updated";

export class CustomerWasUpdatedEvent implements KafkaMessage, CustomerWasUpdated {
    
    public id: string;
    public documentNumber: string;
    public name: string;
    public motherName: string;
    public birthDate: google.protobuf.Timestamp;
    public status: CustomerStatusType;
    public created: google.protobuf.Timestamp;
    public updated: google.protobuf.Timestamp;

    public address: AddressDto;
    public contacts: Contract[];

    getKey(): string {
        return this.id;
    }

    getName(): string {
       return CustomerWasUpdatedEvent.externalEventName;
    }

    static externalEventName : string = 'CUSTOMER_WAS_UPDATED';
}