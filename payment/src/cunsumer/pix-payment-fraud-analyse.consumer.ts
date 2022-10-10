import { KafkaConsumer } from "src/common/kafka/kafka-consumer";
import { PaymentType } from "src/domain/entities/payment.type";
import { PixPaymentRepository } from "src/domain/repositories/pix-payment.repository";
import { Span, TraceService } from "nestjs-otel"

export class PixPaymentFraudAnalyseConsumer extends KafkaConsumer {

    constructor(
        private repository: PixPaymentRepository,
        private readonly traceService: TraceService) {
        super('payment-fraud', process.env.TOPIC_FRAUD_ANALYZE_RESPONSE);
    }

    @Span("PixPaymentFraudAnalyseConsumer_do")
    async do(message: any, traceId: string, spanId: string): Promise<void> {
        
        const span = this.traceService.getSpan();
        const context = span.spanContext();
        context.traceId = traceId;
        context.spanId = spanId;


        const span2 = this.traceService.startSpan("PixPaymentFraudAnalyseConsumer_Consume");
        const pixPayment = await this.repository.getById(message.transactionCode);
        console.log(message);

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

        span2.end();
        span.end();
    }
}