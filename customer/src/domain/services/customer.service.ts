import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { KafkaBus } from "src/common/kafka/kafka-bus";
import { Customer } from "../entities/customer.entity";
import { ResultData } from "src/common/result";
import { CustomerDto } from "src/dtos/customer.dto";
import { Mapper } from "src/common/mappers/mapper";

export class CustomerService {

    constructor(
        private bus: KafkaBus,
        private mapper: Mapper) { }

    async create(command: CustomerCreateCommand): Promise<ResultData<CustomerDto>> {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const kafkaResult = await this.bus.publishMessages(customer.getUncommittedEvents());

        if (kafkaResult.isSuccess() == false) {
            return ResultData.fail4(kafkaResult.getErrors());
        }

        customer.clearUncommittedEvents();
        const customerDto = this.mapper.map(Mapper.keyCustomerToCustomerDto, customer);

        return ResultData.okWithData(customerDto);
    }
}