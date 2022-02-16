import { Injectable } from "@nestjs/common";
import { errorMapped } from "src/common/error-mapped";
import { Result } from "src/common/result";
import { CustomerDto } from "src/dtos/customer.dto";
import { BaseRepository } from "./base.repository";

@Injectable()
export class CustomerShapshotRepository extends BaseRepository {

    constructor() {
        super("customer", "customerSnapshot");
    }

    async insertOne(customer: CustomerDto): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            await collection.insertOne(customer);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.saveCustomerError(error));
        }
    }

    async replaceOne(customer: CustomerDto): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            await collection.replaceOne({ id: customer.id }, customer);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.saveCustomerError(error));
        }
    }

    async get(documentNumber: string): Promise<CustomerDto[]> {
        const collection = this.database.collection(this.collectionName);
        return await collection.find<CustomerDto>({ documentNumber: documentNumber }).toArray();
    }
}