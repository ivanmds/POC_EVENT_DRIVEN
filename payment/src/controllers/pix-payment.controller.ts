import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/common/base.controller";
import { PixPayment } from "src/domain/entities/pix-payment.entity";
import { PixPaymentRepository } from "src/domain/repositories/pix-payment.repository";
import { PixPaymentService } from "src/domain/services/pix-payment.service";
import { PixPaymentCreateCommand } from "src/dtos/commands/pix-payment-create.command";
import { PixPaymentWasAcceptedEvent } from "src/dtos/externalEvents/pix-payment-was-accepted.event";
import { PaymentTypeDto } from "src/dtos/payment-type.dto";
import { PixPaymentDto } from "src/dtos/pix-payment.dto";
import { Span, TraceService } from "nestjs-otel";
import { Tracing } from "src/common/otlp/trancing";


@ApiTags("pix-payment")
@Controller("api/v1/pix-payment")
export class PixPaymentController extends BaseController {

    private counterPaymentGot: any;
    private counterPaymentCreated: any;
    

    constructor(private pixService: PixPaymentService,
                private pixRepository: PixPaymentRepository,
                private readonly traceService: TraceService,
                tracing: Tracing) {
        super();

        const meter = tracing.getMeter("payment_controller");
        this.counterPaymentGot = meter.createCounter('payment_got');
        this.counterPaymentCreated = meter.createCounter('payment_created');
    }

    @Post()
    @HttpCode(202)
    @Span("PixPaymentController_Post")
    public async CreatePixPayment(@Body() command: PixPaymentCreateCommand): Promise<PixPaymentWasAcceptedEvent> {
        const span = this.traceService.getSpan();
        span.setAttribute("documentNumber", command.debit.documentNumber);

        this.counterPaymentCreated.add(1);
        return await this.pixService.createPixPayment(command);
    }

    @Get(":id")
    @Span("PixPaymentController_Get")
    public async GetPixPayment(@Param('id') id: string): Promise<PixPaymentDto> {
        this.counterPaymentGot.add(1);
        const pixPayment = await this.pixRepository.getById(id);
        return this.parseToPixPaymentDto(pixPayment);

    }

    public parseToPixPaymentDto(pixPayment: PixPayment) : PixPaymentDto {
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