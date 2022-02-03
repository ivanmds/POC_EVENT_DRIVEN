import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { Customer } from "../entities/customer.entity";
import { ResultData } from "src/common/result";
import { Injectable } from "@nestjs/common";
import { CustomerEventStoreRepository } from "../repositories/customer-event-store.repository";
import { errorMapped } from "src/common/error-mapped";
import { KafkaBus } from "src/common/kafka/kafka-bus";
import { AddressDto } from "src/dtos/address.dto";
import { Mapper } from "src/common/mappers/mapper";

@Injectable()
export class CustomerService {

    constructor(
        private eventStore: CustomerEventStoreRepository,
        private bus: KafkaBus,
        private mapper: Mapper) { }

    async create(command: CustomerCreateCommand): Promise<ResultData<Customer>> {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const result = await this.eventStore.save(customer);
        if (result.isFail()) {
            return ResultData.fail3(errorMapped.saveCustomerError());
        }

        customer.clearUncommittedEvents();

        const externalEvent = this.mapper.map(Mapper.customerToCustomerWasCreated, customer);

        const kafkaResult = await this.bus.publishMessages(
            process.env.TOPIC_EXTERNAL_EVENTS,
            externalEvent
        );

        if (kafkaResult.isFail()) {
            return ResultData.fail4(kafkaResult.getErrors());
        }

        return ResultData.okWithData(customer);
    }

    async setAddress(aggregateId: string, address: AddressDto) {
        const customer = this.eventStore.get(aggregateId);
    }
}