import { AggregateRoot } from "src/common/entities/aggregate-root";
import { BaseEvent } from "src/common/entities/events/base.event";
import { CustomerStatusType } from "../types/customer-status.type";
import { Address } from "../valueObjects/address.vo";
import { Contact } from "../valueObjects/contact.vo";
import { CustomerWasCreated } from "./events/custumer-was-created.event";
import { v4 as uuidv4 } from 'uuid';
import { CustomerAddressWasAdded } from "./events/customer-address-was-added.event";
import { CustomerAddressWasUpdated } from "./events/customer-address-was-updated.event";
import { CustomerAddressBase } from "./events/customer-address-base.event";
import { CustomerContactWasAdded } from "./events/customer-contact-was-added.event";
export class Customer extends AggregateRoot {

    private _name: string;
    private _motherName: string;
    private _birthDate: Date;
    private _contacts: Contact[] = null;
    private _address: Address = null;
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
        if (event.eventName === CustomerWasCreated.getEventName()) {
            this.applyCustomerWasCreatedEvent(event as CustomerWasCreated);
        } else if (event.eventName === CustomerAddressWasAdded.getEventName() ||
                   event.eventName === CustomerAddressWasUpdated.getEventName()) {
            this.applyCustomerAddressEvent(event as CustomerAddressBase);
        } else if (event.eventName === CustomerContactWasAdded.getEventName()) {
            this.applyCustomerContactWasAdded(event as CustomerContactWasAdded);
        }
    }

    public static create(
        name: string,
        motherName: string,
        birthDate: Date
    ): Customer {

        const customerWasCreated = new CustomerWasCreated();
        customerWasCreated.name = name;
        customerWasCreated.motherName = motherName;
        customerWasCreated.birthDate = birthDate;

        const customer = new Customer();
        customer.setAggregateId = uuidv4();
        customer.raiseEvent(customerWasCreated);

        return customer;
    }

    private applyCustomerWasCreatedEvent(event: CustomerWasCreated) {

        this._name = event.name;
        this._motherName = event.motherName;
        this._birthDate = event.birthDate;
        this.setAggregateId = event.aggregateId;
        this.created = event.created;
        this.setStatus();
    }

    public setAddress(address: Address) {
        const event = this._address == null ? new CustomerAddressWasAdded() : new CustomerAddressWasUpdated();
        event.address = address;
        this.raiseEvent(event);
    }

    private applyCustomerAddressEvent(event: CustomerAddressBase) {
        this._address = event.address;
        this.setStatus();
    }

    public addContact(contact: Contact) {
        const event = new CustomerContactWasAdded();
        event.contact =  contact;
        this.raiseEvent(event);
    }

    private applyCustomerContactWasAdded(event: CustomerContactWasAdded) {
        if(this._contacts == null) {
            this._contacts = [];
        }

        this._contacts.push(event.contact);
        this.setStatus();
    }

    private setStatus() {
        if(this._contacts == null && this._address == null) {
            this._status = CustomerStatusType.Simple;
        } else if(this._contacts != null && this._address != null) {
            this._status = CustomerStatusType.Complete;
        } else {
            this._status = CustomerStatusType.Partial;
        }
    }
}