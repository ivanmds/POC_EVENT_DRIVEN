import { BaseEvent } from "src/common/events/base.event";
import { CustomerStatusType } from "src/customer/types/customer-status.type";

export class CustomerWasCreatedEvent extends BaseEvent {
    
    eventName: string = CustomerWasCreatedEvent.getEventName();

    public name: string;
    public motherName: string;
    public birthDate: Date;
    public status = CustomerStatusType.Simple;

    static getEventName = () => "CUSTOMER_WAS_CREATED";
}