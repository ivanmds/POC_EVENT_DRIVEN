import { Customer } from "src/domain/entities/customer.entity";
import { ContactType } from "src/domain/types/contact.type";
import { Address } from "src/domain/valueObjects/address.vo";
import { Contact } from "src/domain/valueObjects/contact.vo";
import { AddressDto } from "src/dtos/address.dto";
import { ContactDto } from "src/dtos/contact.dto";
import { CustomerDto } from "src/dtos/customer.dto";
import { CustomerWasCreatedEvent } from "src/dtos/externalEvents/customer-was-created.event";
import { CustomerWasUpdatedEvent } from "src/dtos/externalEvents/customer-was-updated.event";
import { ContactTypeDto } from "src/dtos/types/contact-type.dto";
import { CustomerStatusTypeDto } from "src/dtos/types/customer-status-type.dto";
export class Mapper {

    public static customerToCustomerDto = "customerToCustomerDto";
    public static customerToCustomerWasCreated = "customerToCustomerWasCreated";
    public static customerToCustomerWasUpdated = "customerToCustomerWasUpdated";
    public static addressDtoToAddress = "addressDtoToAddress";
    public static contactDtoToContact = "contactDtoToContact";

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
            case Mapper.contactDtoToContact:
                return this.mapContactDtoToContact(source);
            default:
                throw Error('Event name not found');
        }
    }

    private mapCustomerToCustomerDto(customer: Customer): CustomerDto {
        const dto = new CustomerDto();
        dto.id = customer.id;
        dto.documentNumber = customer.getDocumentNumber;
        dto.name = customer.getName;
        dto.motherName = customer.getMotherName;
        dto.birthDate = new Date(customer.getBirthDate);
        if(typeof customer.getStatus === typeof '') {
            dto.status = CustomerStatusTypeDto[customer.getStatus.toString()];
        } else {
            dto.status = CustomerStatusTypeDto[CustomerStatusTypeDto[customer.getStatus]];
        }
        dto.version = customer.version;
        dto.created = customer.created;
        dto.updated = customer.updated;

        if (customer.getAddress != null) {
            dto.address = this.mapAddressToAddressDto(customer.getAddress);
        }

        if (customer.getContacts != null) {
            dto.contacts = this.mapContactsToContactsDto(customer.getContacts);
        }

        return dto;
    }

    private mapCustomerToCustomerWasCreated(customer: Customer): CustomerWasCreatedEvent {
        const event = new CustomerWasCreatedEvent();
        event.id = customer.id;
        event.documentNumber = customer.getDocumentNumber;
        event.name = customer.getName;
        event.motherName = customer.getMotherName;
        event.birthDate = { seconds: (new Date(customer.getBirthDate).getTime() / 1000) };
        event.created = { seconds: (customer.created.getTime() / 1000) };
        event.status = CustomerStatusTypeDto[customer.getStatus.toString()];

        return event;
    }

    private mapCustomerToCustomerWasUpdated(customer: Customer): CustomerWasUpdatedEvent {
        const event = new CustomerWasUpdatedEvent();
        event.id = customer.id;
        event.documentNumber = customer.getDocumentNumber;
        event.name = customer.getName;
        event.birthDate = { seconds: (new Date(customer.getBirthDate).getTime() / 1000) };
        event.motherName = customer.getMotherName;
        event.status = CustomerStatusTypeDto[customer.getStatus.toString()];
        event.created = { seconds: (new Date(customer.created).getTime() / 1000) };
        event.updated = { seconds: (new Date(customer.updated).getTime() / 1000) };

        if (customer.getAddress != null) {
            event.address = this.mapAddressToAddressDto(customer.getAddress);
        }

        if (customer.getContacts != null) {
            event.contacts = customer.getContacts;
        }

        return event;
    }

    private mapAddressDtoToAddress(dto: AddressDto): Address {
        return new Address(
            dto.street,
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
        dto.street = address.street;
        dto.city = address.city;
        dto.complement = address.complement;
        dto.neighborhood = address.neighborhood;
        dto.number = address.number;
        dto.state = address.state;
        dto.zipCode = address.zipCode;
        return dto;
    }

    private mapContactDtoToContact(dto: ContactDto): Contact {
        return new Contact(
            dto.value,
            ContactType[dto.type.toString()]
        );
    }

    private mapContactToContactDto(contact: Contact): ContactDto {
        const dto = new ContactDto();
        dto.value = contact.value;
        dto.type = ContactTypeDto[contact.type.toString()];
        return dto;
    }

    private mapContactsToContactsDto(contacts: Contact[]): ContactDto[] {
        const dtos: ContactDto[] = [];

        contacts.forEach((contact) => {
            dtos.push(this.mapContactToContactDto(contact));
        });

        return dtos;
    }
}