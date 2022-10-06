import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomerShapshotRepository } from "src/domain/repositories/customer-snapshot.repository";
import { CustomerDto } from "src/dtos/customer.dto";
import { Span } from "nestjs-otel";
import { Tracing } from "src/common/otlp/tracing";

@ApiTags("snapshot")
@Controller("api/v1/snapshot-customers")
export class CustomerSnapshotController {
    
    private counterCustomerGot: any;

    constructor(private customerSnapshotRepository: CustomerShapshotRepository, tracing: Tracing) {
        const meter = tracing.getMeter("customer_snapshot_controller");
        this.counterCustomerGot = meter.createCounter('customer_shapshot_got');
    }


    @Span("CustomerSnapshotController_getByDocument")
    @Get(":documentNumber")
    async getByDocument(@Param('documentNumber') documentNumber: string): Promise<CustomerDto[]> {

        this.counterCustomerGot.add(1);
        const customers = await this.customerSnapshotRepository.get(documentNumber);
        if(customers?.length == 0)  {
            throw new NotFoundException();
        }

        return customers;
    }
}