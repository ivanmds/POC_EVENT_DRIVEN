import { AggregateRoot } from "src/common/entities/aggregate-root";
import { BaseEvent } from "src/common/events/base.event";
import { Address } from "../valueObjects/address.vo";
import { Contact } from "../valueObjects/contact.vo";

export class Customer extends AggregateRoot {
    
    private _name: string;
    private _birthDate: Date;
    private _contacts: Contact[];
    private _address: Address;
    
    
    protected apply(event: BaseEvent) {
        throw new Error("Method not implemented.");
    }


}