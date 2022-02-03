import { CustomerAddressBase } from "./customer-address-base.event";

export class CustomerAddressWasUpdated extends CustomerAddressBase {
    eventName: string = CustomerAddressWasUpdated.getEventName();
    static getEventName = () => "CUSTOMER_ADDRESS_WAS_UPDATED";
}