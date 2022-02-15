import { ValueFaker } from "src/common/fakers/value.faker";
import { CustomerStatusType } from "../types/customer-status.type";
import { Address } from "../valueObjects/address.vo";
import { Customer } from "./customer.entity";
import { CustomerAddressWasAdded } from "./events/customer-address-was-added.event";
import { CustomerAddressWasUpdated } from "./events/customer-address-was-updated.event";

describe('Customer', () => {

    const faker = new ValueFaker();

    describe('create', () => {

        it('customer should be created', () => {
            const documentNumber = faker.getString();
            const name = faker.getString();
            const motherName = faker.getString();
            const birthDate = faker.getDate();

            const customer = Customer.create(
                documentNumber,
                name,
                motherName,
                birthDate
            );

            expect(customer.id).not.toBeNull();
            expect(customer.getName).toEqual(name);
            expect(customer.getMotherName).toEqual(motherName);
            expect(customer.getBirthDate).toEqual(birthDate);
            expect(customer.getStatus).toEqual(CustomerStatusType.Simple);
        });

        it('customer should be add address', () => {
            const documentNumber = faker.getString();
            const name = faker.getString();
            const motherName = faker.getString();
            const birthDate = faker.getDate();
            const any = faker.getString();
            const address = new Address(any, any, any, any, any, any, any);

            const customer = Customer.create(
                documentNumber,
                name,
                motherName,
                birthDate
            );
            customer.clearUncommittedEvents();

            customer.setAddress(address);
            const event = customer.getUncommittedEvents()[0];
            expect(event.eventName).toEqual(CustomerAddressWasAdded.getEventName());
            expect(customer.getStatus).toEqual(CustomerStatusType.Partial);
        });

        it('customer should be updated', () => {
            const documentNumber = faker.getString();
            const name = faker.getString();
            const motherName = faker.getString();
            const birthDate = faker.getDate();
            const any = faker.getString();
            const address = new Address(any, any, any, any, any, any, any);

            const customer = Customer.create(
                documentNumber,
                name,
                motherName,
                birthDate
            );

            customer.setAddress(address);
            customer.clearUncommittedEvents();

            customer.setAddress(address);
            const event = customer.getUncommittedEvents()[0];
            expect(event.eventName).toEqual(CustomerAddressWasUpdated.getEventName());
            expect(customer.getStatus).toEqual(CustomerStatusType.Partial);
        });
    });
});