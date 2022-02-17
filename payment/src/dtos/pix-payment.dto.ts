import { ApiProperty } from "@nestjs/swagger";
import { AccountDto } from "./account.dto";
import { PaymentTypeDto } from "./payment-type.dto";

export class PixPaymentDto {

    @ApiProperty()
    transactionCode: string;

    @ApiProperty()
    debit: AccountDto;

    @ApiProperty()
    credit: AccountDto;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    status: PaymentTypeDto[];

    @ApiProperty()
    created: Date;

    @ApiProperty()
    updated: Date;
}