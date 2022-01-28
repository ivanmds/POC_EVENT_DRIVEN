import { CustomerCreateCommand } from "src/commands/customer-create.command";
import { KafkaBus } from "src/common/kafka/kafka-bus";
import { Customer } from "../entities/customer.entity";

export class CustomerService {

    constructor(private bus: KafkaBus) {

    }

    async create(command: CustomerCreateCommand) {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const kafkaResult = await this.bus.publishMessages(customer.getUncommittedEvents());
        
        if(kafkaResult.isSuccess()) {
            customer.clearUncommittedEvents();
        }
    }
}