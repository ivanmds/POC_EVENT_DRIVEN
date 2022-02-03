import { Customer } from "src/domain/entities/customer.entity";
import { Address } from "src/domain/valueObjects/address.vo";
import { AddressDto } from "src/dtos/address.dto";
import { CustomerDto } from "src/dtos/customer.dto";
import { CustomerWasCreatedEvent } from "src/dtos/externalEvents/customer-was-created.event";
import { CustomerWasUpdatedEvent } from "src/dtos/externalEvents/customer-was-updated.event";
import { CustomerStatusTypeDto } from "src/dtos/types/customer-status-type.dto";
export class Mapper {

    public static customerToCustomerDto = "customerToCustomerDto";
    public static customerToCustomerWasCreated = "customerToCustomerWasCreated";
    public static customerToCustomerWasUpdated = "customerToCustomerWasUpdated";
    public static addressDtoToAddress = "addressDtoToAddress";

    public map(mapKey: string, source: any): any {
        switch (mapKey) {
            case Mapper.customerToCustomerDto:
                return this.mapCustomerToCustomerDto(source);
            case Mapper.customerToCustomerWasCreated:
                return this.mapCustomerToCustomerWasCreated(source);
            case Mapper.customerToCustomerWasUpdated:
                return this.mapCustomerToCustomerWasUpdated(source);
            case Mapper.addressDtoToAddress:
                return this.mapAddressDtoToAddress(source);
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

    private mapCustomerToCustomerWasUpdated(customer: Customer): CustomerWasUpdatedEvent {
        const event = new CustomerWasUpdatedEvent();
        event.id = customer.id;
        event.name = customer.getName;
        event.birthDate = customer.getBirthDate;
        event.motherName = customer.getMotherName;
        event.status = CustomerStatusTypeDto[customer.getStatus.toString()];
        event.address = this.mapAddressToAddressDto(customer.getAddress);

        return event;
    }

    private mapAddressDtoToAddress(dto: AddressDto): Address {
        return new Address(
            dto.address,
            dto.number,
            dto.neighborhood,
            dto.zipCode,
            dto.city,
            dto.state,
            dto.complement
        );
    }


    private mapAddressToAddressDto(address: Address): AddressDto {
        const dto = new AddressDto();
        dto.address = address.getAddress;
        dto.city = address.getCity;
        dto.complement = address.getComplement;
        dto.neighborhood = address.getNeighborhood;
        dto.number = address.getNumber;
        dto.state = address.getState;
        dto.zipCode = address.getZipCode;
        return dto;
    }
}