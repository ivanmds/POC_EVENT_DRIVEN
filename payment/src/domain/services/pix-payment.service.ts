import { Injectable } from "@nestjs/common";
import { PixPaymentCreateCommand } from "src/dtos/commands/pix-payment-create.command";
import { AccountVO } from "../entities/account.vo";
import { PixPayment } from "../entities/pix-payment.entity";
import { PixPaymentRepository } from "../repositories/pix-payment.repository";
import * as moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { PaymentType } from "../entities/payment.type";
import { PixPaymentWasAcceptedEvent } from "src/dtos/externalEvents/pix-payment-was-accepted.event";
import { KafkaBus } from "src/common/kafka/kafka-bus";

@Injectable()
export class PixPaymentService {

    constructor(private repository: PixPaymentRepository, private bus: KafkaBus) { }


    public async createPixPayment(command: PixPaymentCreateCommand) : Promise<PixPaymentWasAcceptedEvent> {
        const pixPayment = this.getPixPayment(command);
        await this.repository.create(pixPayment);

        const eventExtenal = new PixPaymentWasAcceptedEvent();

        eventExtenal.transactionCode = pixPayment.transactionCode;
        eventExtenal.created = pixPayment.created;
        eventExtenal.status = PaymentType[pixPayment.status[0].toString()];

        await this.bus.publishMessageAny(process.env.TOPIC_FRAUD_ANALYZE_REQUEST, pixPayment.id, pixPayment);

        return eventExtenal;
    }

    public async setPixPaymentFraudApproval(id: string, analyse: boolean): Promise<void> {
        const pixPayment = await this.repository.getById(id);
        const status = analyse ? PaymentType.Approved : PaymentType.Disapproved;
        pixPayment.status.push(status);
        
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
        pixPayment.transactionCode = id;

        pixPayment.status = [];
        pixPayment.status.push(PaymentType.Accepted);

        return pixPayment;
    }
}