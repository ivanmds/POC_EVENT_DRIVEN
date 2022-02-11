export interface CustomerWasCreated {
    id?: string;
    name?: string;
    motherName?: string;
    birthDate?: google.protobuf.Timestamp;
    created?: google.protobuf.Timestamp;
    status?: CustomerStatusType;
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

