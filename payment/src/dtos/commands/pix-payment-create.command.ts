import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";
import { AccountDto } from "../account.dto";

export class PixPaymentCreateCommand {

    @ApiProperty()
    @IsDefined()
    debit: AccountDto;

    @ApiProperty()
    @IsDefined()
    credit: AccountDto;

    @ApiProperty()
    @IsDefined()
    amount: number;
}