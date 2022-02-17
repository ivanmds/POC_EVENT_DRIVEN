import { Injectable } from "@nestjs/common";
import { PixPaymentCreateCommand } from "src/dtos/commands/pix-payment-create.command";
import { AccountVO } from "../entities/account.vo";
import { PixPayment } from "../entities/pix-payment.entity";
import { PixPaymentRepository } from "../repositories/pix-payment.repository";
import * as moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { PaymentType } from "../entities/payment.type";

@Injectable()
export class PixPaymentService {

    constructor(private repository: PixPaymentRepository) { }


    public async createPixPayment(command: PixPaymentCreateCommand) : Promise<void> {
        const pixPayment = this.getPixPayment(command);
        await this.repository.create(pixPayment);
    }


    private getPixPayment(command: PixPaymentCreateCommand): PixPayment {
        const pixPayment = new PixPayment();
        
        pixPayment.debit = new AccountVO();
        pixPayment.debit.documentNumber = command.debit.documentNumber;
        pixPayment.debit.key = command.debit.key;
        
        pixPayment.credit = new AccountVO();
        pixPayment.credit.documentNumber = command.credit.documentNumber;
        pixPayment.credit.key = command.credit.key;

        pixPayment.amount = command.amount;
        pixPayment.created = moment().utc().toDate();
        const id = uuidv4();
        pixPayment.id = id;
        pixPayment.transactionCode = id.split("-")[0];

        pixPayment.status = [];
        pixPayment.status.push(PaymentType.Accepted);

        return pixPayment;
    }
}