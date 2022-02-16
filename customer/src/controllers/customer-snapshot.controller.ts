import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomerShapshotRepository } from "src/domain/repositories/customer-snapshot.repository";
import { CustomerDto } from "src/dtos/customer.dto";

@ApiTags("snapshot")
@Controller("api/v1/snapshot-customers")
export class CustomerSnapshotController {
    
    constructor(private customerSnapshotRepository: CustomerShapshotRepository) {}


    @Get(":documentNumber")
    async getByDocument(@Param('documentNumber') documentNumber: string): Promise<CustomerDto[]> {

        const customers = await this.customerSnapshotRepository.get(documentNumber);
        if(customers?.length == 0)  {
            throw new NotFoundException();
        }

        return customers;
    }
}