import { ApiProperty } from "@nestjs/swagger";
import { AccountDto } from "./account.dto";

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
    status: string[];

    @ApiProperty()
    created: Date;

    @ApiProperty()
    updated: Date;
}