import { Injectable } from "@nestjs/common";
import { KafkaConsumer } from "src/common/kafka/kafka-consumer";
import { Mapper } from "src/common/mappers/mapper";
import { CustomerShapshotRepository } from "src/domain/repositories/customer-snapshot.repository";
import { CustomerService } from "src/domain/services/customer.service";
import { CustomerStatusType } from "src/domain/types/customer-status.type";

@Injectable()
export class CustomerCreateOrUpdateConsumer extends KafkaConsumer {

    constructor(
        private customerService: CustomerService,
        private customerSnapshotRepository: CustomerShapshotRepository,
        private mapper: Mapper) {
        super('customer-snapshot', 'customer_external_events');
    }


    async do(message: any): Promise<void> {
        const id = message.id;
        const result = await this.customerService.get(id);

        if (result.isSuccess()) {
            const customer = result.getData();
            if (customer) {
                if (customer.getStatus == CustomerStatusType.Simple) {
                    const customerDto = this.mapper.map(Mapper.customerToCustomerDto, customer);
                    await this.customerSnapshotRepository.insertOne(customerDto);

                } else {
                    const customerDto = this.mapper.map(Mapper.customerToCustomerDto, customer);
                    await this.customerSnapshotRepository.replaceOne(customerDto);
                }
            }
        }
    }
}