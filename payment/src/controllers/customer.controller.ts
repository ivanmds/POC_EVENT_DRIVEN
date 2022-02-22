import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PixPayment } from "src/domain/entities/pix-payment.entity";
import { PixPaymentRepository } from "src/domain/repositories/pix-payment.repository";
import { PaymentTypeDto } from "src/dtos/payment-type.dto";
import { PixPaymentDto } from "src/dtos/pix-payment.dto";


@ApiTags("customers")
@Controller("api/v1/customers")
export class CustomerController {

    constructor(private pixRepository: PixPaymentRepository) { }


    @Get(":documentNumber/transactions")
    public async GetPixPayment(@Param('documentNumber') documentNumber: string): Promise<PixPaymentDto[]> {

        const pixPayments = await this.pixRepository.getByDocumentNumber(documentNumber);
        if (pixPayments?.length > 0) {
            const dtos = [];
            pixPayments.forEach(pixPayment => {
                const dto = this.parseToPixPaymentDto(pixPayment);
                dtos.push(dto);
            });

            return dtos;
        }

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