import { ApiProperty } from "@nestjs/swagger";
import { KafkaMessage } from "src/common/kafka/kafka.message";

export class PixPaymentWasAcceptedEvent implements KafkaMessage {
    
    @ApiProperty()
    transactionCode: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    created: Date;

    
    getKey(): string {
        return this.transactionCode;
    }

    getName(): string {
        return PixPaymentWasAcceptedEvent.externalEventName;
    }

    static externalEventName : string = 'PIX_PAYMENT_WAS_ACCEPTED';
}