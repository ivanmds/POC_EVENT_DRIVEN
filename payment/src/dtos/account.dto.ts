import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class AccountDto {

    @ApiProperty()
    @IsString()
    @IsDefined()
    documentNumber: string;
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    key: string;
}