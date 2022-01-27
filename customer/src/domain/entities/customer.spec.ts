import exp from "constants";
import { ValueFaker } from "src/common/fakers/value.faker";
import { CustomerStatusType } from "../types/customer-status.type";
import { Customer } from "./customer.entity";

describe('Customer', () => {

    const faker = new ValueFaker();

    describe('create', () => {

        it('customer should be created', () => {
            const name = faker.getString();
            const motherName = faker.getString();
            const birthDate = faker.getDate();

            const customer = Customer.create(
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
    });
});