import { Injectable } from "@nestjs/common";
import { Span } from "nestjs-otel";
import { errorMapped } from "src/common/error-mapped";
import { Result } from "src/common/result";
import { CustomerDto } from "src/dtos/customer.dto";
import { BaseRepository } from "./base.repository";

@Injectable()
export class CustomerShapshotRepository extends BaseRepository {

    constructor() {
        super("customer", "customerSnapshot");
    }

    @Span("CustomerShapshotRepository_insertOne")
    async insertOne(customer: CustomerDto): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            await collection.insertOne(customer);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.saveCustomerError(error));
        }
    }

    @Span("CustomerShapshotRepository_replaceOne")
    async replaceOne(customer: CustomerDto): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            await collection.replaceOne({ id: customer.id }, customer);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.saveCustomerError(error));
        }
    }

    @Span("CustomerShapshotRepository_get")
    async get(documentNumber: string): Promise<CustomerDto[]> {
        const collection = this.database.collection(this.collectionName);
        return await collection.find<CustomerDto>({ documentNumber: documentNumber }).toArray();
    }
}