import { ContactType } from "../types/contact.type";

export class Contact {

    constructor(
        public value: string, 
        public type: ContactType) { }
}

