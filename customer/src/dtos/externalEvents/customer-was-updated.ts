export interface CustomerWasUpdated {
    id?: string;
    documentNumber?: string;
    name?: string;
    motherName?: string;
    birthDate?: google.protobuf.Timestamp;
    created?: google.protobuf.Timestamp;
    status?: CustomerStatusType;
    updated?: google.protobuf.Timestamp;
    address?: Address;
    contacts?: Contract[];
}
export interface Address {
    street?: string;
    number?: string;
    neighborhood?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    complement?: string;
}
export interface Contract {
    value?: string;
    type?: ContactType;
}
export enum ContactType {
    Email = 0,
    Phone = 1,
}
export enum CustomerStatusType {
    None = 0,
    Simple = 1,
    Partial = 2,
    Complete = 3,
}
export namespace google {
    export namespace protobuf {
        export interface Timestamp {
            seconds?: number;
            nanos?: number;
        }
    }
}

