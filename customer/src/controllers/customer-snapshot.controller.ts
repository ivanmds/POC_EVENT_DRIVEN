import { Controller, Get, NotFoundException, Param, Headers } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomerShapshotRepository } from "src/domain/repositories/customer-snapshot.repository";
import { CustomerDto } from "src/dtos/customer.dto";
import { Span, TraceService } from "nestjs-otel";
import { Tracing } from "src/common/otlp/tracing";

@ApiTags("snapshot")
@Controller("api/v1/snapshot-customers")
export class CustomerSnapshotController {

    private counterCustomerGot: any;

    constructor(
        private customerSnapshotRepository: CustomerShapshotRepository,
        private readonly traceService: TraceService,
        tracing: Tracing) {
        const meter = tracing.getMeter("customer_snapshot_controller");
        this.counterCustomerGot = meter.createCounter('customer_shapshot_got');
    }


    @Span("CustomerSnapshotController_getByDocument")
    @Get(":documentNumber")
    async getByDocument(@Param('documentNumber') documentNumber: string, @Headers() headers): Promise<CustomerDto[]> {

        const traceparent = headers["traceparent"] as string;
        const span = this.traceService.getSpan();
       //obs: pesquisar forma correta pra atualizar o contexto com a parentSpanId
        if (traceparent) {
            const context = span.spanContext();

            const traceparentSplitted = traceparent.split("-")
            context.traceId = traceparentSplitted[1];
            context.spanId = traceparentSplitted[2];
        }


        const span2 = this.traceService.startSpan('CustomerSnapshotController_getByDocument_2');

        this.counterCustomerGot.add(1);
        const customers = await this.customerSnapshotRepository.get(documentNumber);
        if (customers?.length == 0) {
            throw new NotFoundException();
        }

        span2.end();
        span.end();
        return customers;
    }
}