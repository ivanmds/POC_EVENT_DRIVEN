import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { KafkaBus } from "src/common/kafka/kafka-bus";
import { Customer } from "../entities/customer.entity";
import { ResultData } from "src/common/result";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerService {

    constructor(
        private bus: KafkaBus) { }

    async create(command: CustomerCreateCommand): Promise<ResultData<Customer>> {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const kafkaResult = await this.bus.publishMessages(customer.getUncommittedEvents());

        if (kafkaResult.isSuccess() == false) {
            return ResultData.fail4(kafkaResult.getErrors());
        }

        customer.clearUncommittedEvents();
        return ResultData.okWithData(customer);
    }
}