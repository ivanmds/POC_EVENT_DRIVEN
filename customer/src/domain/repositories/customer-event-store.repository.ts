import { Result, ResultData } from "src/common/result";
import { Customer } from "../entities/customer.entity";
import { EventStoreBaseRepository } from "./event-store-base.repository";
import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";

@Injectable()
export class CustomerEventStoreRepository extends EventStoreBaseRepository {

    constructor() {
        super('customerEvents');
    }

    @Span("CustomerEventStoreRepository_save")
    async save(customer: Customer): Promise<Result> {

        const events = customer.getUncommittedEvents();
        this.insertMany(events);
        return Result.ok();
    }

    @Span("CustomerEventStoreRepository_get")
    async get(aggregateId: string, version?: number): Promise<ResultData<Customer>> {

        const result = await this.getAllEvents(aggregateId, version);
        const customer = new Customer();
        
        if(result.isFail()) {
            return ResultData.fail4(result.getErrors());
        }
        
        const events = result.getData();
        events.forEach((event) => {
            customer.applyEvent(event);
        });

        return ResultData.okWithData(customer);
    }
}