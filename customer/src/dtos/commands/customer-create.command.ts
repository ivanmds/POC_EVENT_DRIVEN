import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDefined, IsString } from "class-validator";

export class CustomerCreateCommand {
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    name: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    documentNumber: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    motherName: string;

    @ApiProperty()
    @IsDate()
    @IsDefined()
    birthDate: Date;
}