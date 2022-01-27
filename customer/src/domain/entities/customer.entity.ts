import { AggregateRoot } from "src/common/entities/aggregate-root";
import { BaseEvent } from "src/common/events/base.event";
import { CustomerStatusType } from "../types/customer-status.type";
import { Address } from "../valueObjects/address.vo";
import { Contact } from "../valueObjects/contact.vo";
import { CustomerWasCreatedEvent } from "./events/custumer-was-created.event";
import { v4 as uuidv4 } from 'uuid';
export class Customer extends AggregateRoot {

    private _name: string;
    private _motherName: string;
    private _birthDate: Date;
    private _contacts: Contact[];
    private _address: Address;
    private _status: CustomerStatusType

    public get getName() {
        return this._name;
    }

    public get getMotherName() {
        return this._motherName;
    }

    public get getBirthDate() {
        return this._birthDate;
    }

    public get getContacts() {
        return this._contacts;
    }

    public get getAddress() {
        return this._address;
    }

    public get getStatus() {
        return this._status;
    }

    protected apply(event: BaseEvent) {
        if (event.eventName === CustomerWasCreatedEvent.getEventName()) {
            this.applyCustomerWasCreatedEvent(event as CustomerWasCreatedEvent);
        }
    }

    private applyCustomerWasCreatedEvent(event: CustomerWasCreatedEvent) {
        this._name = event.name;
        this._motherName = event.motherName;
        this._birthDate = event.birthDate;
        this._status = event.status;
    }

    static create(
        name: string,
        motherName: string,
        birthDate: Date
    ): Customer {

        const customerWasCreated = new CustomerWasCreatedEvent();
        customerWasCreated.name = name;
        customerWasCreated.motherName = motherName;
        customerWasCreated.birthDate = birthDate;

        const customer = new Customer();
        customer.setAggregateId = uuidv4();
        customer.raiseEvent(customerWasCreated);

        return customer;
    }
}