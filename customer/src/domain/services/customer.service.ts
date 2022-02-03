import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { Customer } from "../entities/customer.entity";
import { ResultData } from "src/common/result";
import { Injectable } from "@nestjs/common";
import { CustomerEventStoreRepository } from "../repositories/customer-event-store.repository";
import { errorMapped } from "src/common/error-mapped";

@Injectable()
export class CustomerService {

    constructor(
        private eventStore: CustomerEventStoreRepository) { }

    async create(command: CustomerCreateCommand): Promise<ResultData<Customer>> {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const result = await this.eventStore.save(customer);
        if(result.isFail()) {
            return ResultData.fail3(errorMapped.saveCustomerError());
        }

        return ResultData.okWithData(customer);
    }
}