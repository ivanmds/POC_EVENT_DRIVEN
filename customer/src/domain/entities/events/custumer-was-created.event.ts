import { BaseEvent } from "src/common/events/base.event";
export class CustomerWasCreated extends BaseEvent {
    
    eventName: string = CustomerWasCreated.getEventName();

    public name: string;
    public motherName: string;
    public birthDate: Date;

    static getEventName = () => "CUSTOMER_WAS_CREATED";
}