import { Customer } from "src/domain/entities/customer.entity";
import { CustomerDto } from "src/dtos/customer.dto";
import { CustomerWasCreatedEvent } from "src/dtos/externalEvents/customer-was-created.event";
import { CustomerStatusTypeDto } from "src/dtos/types/customer-status-type.dto";
export class Mapper {

    public static customerToCustomerDto = "CustomerToCustomerDto";
    public static customerToCustomerWasCreated = "CustomerToCustomerWasCreated";

    public map(mapKey: string, source: any) : any {
        switch (mapKey) {
            case Mapper.customerToCustomerDto:
                return this.mapCustomerToCustomerDto(source);
            case Mapper.customerToCustomerWasCreated:
                return this.mapCustomerToCustomerWasCreated(source);
            default:
                throw Error('Event name not found');
        }
    }

    private mapCustomerToCustomerDto(customer: Customer): CustomerDto {
        const dto = new CustomerDto();
        dto.id = customer.id;
        dto.name = customer.getName;
        dto.motherName = customer.getMotherName;
        dto.birthDate = customer.getBirthDate;

        return dto;
    }

    private mapCustomerToCustomerWasCreated(customer: Customer): CustomerWasCreatedEvent {
        const event = new CustomerWasCreatedEvent();
        event.id = customer.id;
        event.name = customer.getName;
        event.birthDate = customer.getBirthDate;
        event.motherName = customer.getMotherName;
        event.status = CustomerStatusTypeDto[customer.getStatus.toString()];

        return event;
    }
}