import { BaseEvent } from "src/common/entities/events/base.event";
import { Contact } from "src/domain/valueObjects/contact.vo";

export class CustomerContactWasAdded extends BaseEvent {
    eventName: string = CustomerContactWasAdded.getEventName();
    contact: Contact;
    static getEventName = () => "CUSTOMER_CONTACT_WAS_ADDED";
}