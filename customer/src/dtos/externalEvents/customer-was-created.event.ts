import { CustomerStatusTypeDto } from "../types/customer-status-type.dto";

export class CustomerWasCreatedEvent {
    public id: string;
    public name: string;
    public motherName: string;
    public birthDate: Date;
    public status: CustomerStatusTypeDto;
}