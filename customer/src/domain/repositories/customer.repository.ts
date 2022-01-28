import { Mapper } from "src/common/mappers/mapper";
import { ResultData } from "src/common/result";
import { Customer } from "../entities/customer.entity";

export class CustomerRepository {

    constructor(private mapper: Mapper) {

    }

    async save(customer: Customer) : Promise<ResultData<Customer>> {



        return null;
    }
}