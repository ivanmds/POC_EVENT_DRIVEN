import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class AddressDto {

    @ApiProperty()
    @IsString()
    @IsDefined()
    street: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    number: string;

    @ApiProperty()
    @IsString()
    @IsDefined()
    neighborhood: string;
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    zipCode: string;
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    city: string;
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    state: string;
    
    @ApiProperty()
    @IsString()
    @IsDefined()
    complement: string;
}