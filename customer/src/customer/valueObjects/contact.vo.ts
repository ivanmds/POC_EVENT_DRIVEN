import { ContactType } from "../types/contact.type";

export class Contact {

    constructor(
        private value: string, 
        private type: ContactType) { }

    public get getValue() { return this.value; }
    public get getType() { return this.type; }
}

