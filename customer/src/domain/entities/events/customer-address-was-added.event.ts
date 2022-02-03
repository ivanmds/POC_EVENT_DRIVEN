import { CustomerAddressBase } from "./customer-address-base.event";

export class CustomerAddressWasAdded extends CustomerAddressBase {
    eventName: string = CustomerAddressWasAdded.getEventName();
    static getEventName = () => "CUSTOMER_ADDRESS_WAS_ADDED";
}