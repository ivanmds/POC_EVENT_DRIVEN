import { BaseEvent } from "src/common/events/base.event";
export class CustomerWasCreatedEvent extends BaseEvent {
    
    eventName: string = CustomerWasCreatedEvent.getEventName();

    public name: string;
    public motherName: string;
    public birthDate: Date;

    static getEventName = () => "CUSTOMER_WAS_CREATED";
}