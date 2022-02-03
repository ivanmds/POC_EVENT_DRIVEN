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

    public async create(command: CustomerCreateCommand): Promise<ResultData<Customer>> {

        const customer = Customer.create(command.name, command.motherName, command.birthDate);

        const result = await this.eventStore.save(customer);
        if (result.isFail()) {
            return ResultData.fail3(errorMapped.saveCustomerError());
        }

        customer.clearUncommittedEvents();

        const externalEvent = this.mapper.map(Mapper.customerToCustomerWasCreated, customer);

        const kafkaResult = await this.bus.publishMessage(
            process.env.TOPIC_EXTERNAL_EVENTS,
            externalEvent
        );

        if (kafkaResult.isFail()) {
            return ResultData.fail4(kafkaResult.getErrors());
        }

        return ResultData.okWithData(customer);
    }

    public async setAddress(aggregateId: string, addressDto: AddressDto): Promise<ResultData<Customer>> {
        const result = await this.eventStore.get(aggregateId);

        if(result.isFail()) {
            return result;
        }

        const customer = result.getData();
        const address = this.mapper.map(Mapper.addressDtoToAddress, addressDto);
        customer.setAddress(address);

        const saveResult = await this.eventStore.save(customer);
        if (saveResult.isFail()) {
            return ResultData.fail3(errorMapped.saveCustomerError());
        }

        
        const externalEvent = this.mapper.map(Mapper.customerToCustomerWasUpdated, customer);

        const kafkaResult = await this.bus.publishMessage(
            process.env.TOPIC_EXTERNAL_EVENTS,
            externalEvent
        );

        if (kafkaResult.isFail()) {
            return ResultData.fail4(kafkaResult.getErrors());
        }

        return ResultData.okWithData(customer);
    }
}