import { Controller, Get, NotFoundException, Param, Headers } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PixPayment } from "src/domain/entities/pix-payment.entity";
import { PixPaymentRepository } from "src/domain/repositories/pix-payment.repository";
import { PaymentTypeDto } from "src/dtos/payment-type.dto";
import { PixPaymentDto } from "src/dtos/pix-payment.dto";
import { Span, TraceService } from 'nestjs-otel';


@ApiTags("customers")
@Controller("api/v1/customers")
export class CustomerController {

    constructor(private pixRepository: PixPaymentRepository, private readonly traceService: TraceService,) { }


    @Get(":documentNumber/transactions")
    @Span("CustomerController_Get")
    public async GetPixPayment(@Param('documentNumber') documentNumber: string, @Headers() headers): Promise<PixPaymentDto[]> {

        const traceparent = headers["traceparent"] as string;
        const span = this.traceService.getSpan();
       //obs: pesquisar forma correta pra atualizar o contexto com a parentSpanId
        if (traceparent) {
            const context = span.spanContext();

            const traceparentSplitted = traceparent.split("-")
            context.traceId = traceparentSplitted[1];
            context.spanId = traceparentSplitted[2];
        }
        const span2 = this.traceService.startSpan("CustomerController_Get2");

        const pixPayments = await this.pixRepository.getByDocumentNumber(documentNumber);
        if (pixPayments?.length > 0) {
            const dtos = [];
            pixPayments.forEach(pixPayment => {
                const dto = this.parseToPixPaymentDto(pixPayment);
                dtos.push(dto);
            });

            span2.end();
            span.end();
            return dtos;
        }

        span2.end();
        span.end();

        throw new NotFoundException(); 
    }


    public parseToPixPaymentDto(pixPayment: PixPayment): PixPaymentDto {
        var dto = new PixPaymentDto();
        dto.amount = pixPayment.amount;
        dto.created = pixPayment.created;
        dto.updated = pixPayment.updated;
        dto.debit = pixPayment.debit;
        dto.credit = pixPayment.credit;
        dto.transactionCode = pixPayment.transactionCode;
        dto.status = [];
        pixPayment.status.forEach(s => {
            dto.status.push(PaymentTypeDto[s.toString()]);
        });

        return dto;
    }
}