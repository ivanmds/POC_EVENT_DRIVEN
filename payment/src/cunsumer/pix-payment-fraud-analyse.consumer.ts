import { KafkaConsumer } from "src/common/kafka/kafka-consumer";
import { PaymentType } from "src/domain/entities/payment.type";
import { PixPaymentRepository } from "src/domain/repositories/pix-payment.repository";
import { Span } from "nestjs-otel"

export class PixPaymentFraudAnalyseConsumer extends KafkaConsumer {

    constructor(
        private repository: PixPaymentRepository) {
        super('payment-fraud', process.env.TOPIC_FRAUD_ANALYZE_RESPONSE);
    }

    @Span("PixPaymentFraudAnalyseConsumer_do")
    async do(message: any): Promise<void> {
        
        const pixPayment = await this.repository.getById(message.transactionCode);
        if (pixPayment) {

            if (message.result == PaymentType[PaymentType.Approved.toString()]) {
                pixPayment.status.push(PaymentType.Approved);
            } else if (message.result == PaymentType[PaymentType.Disapproved.toString()]) {
                pixPayment.status.push(PaymentType.Disapproved);
            } else if (message.result == PaymentType[PaymentType.CustomerError.toString()]) {
                pixPayment.status.push(PaymentType.CustomerError);
            }

            await this.repository.update(pixPayment);
        }
    }
}