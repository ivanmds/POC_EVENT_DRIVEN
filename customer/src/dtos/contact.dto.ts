import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsString } from "class-validator";
import { ContactTypeDto } from "./types/contact-type.dto";

export class ContactDto {

    @ApiProperty()
    @IsString()
    @IsDefined()
    value: string;

    @ApiProperty({ enum: ContactTypeDto, enumName: 'ContactTypeDto' })
    @IsDefined()
    @IsEnum(ContactTypeDto)
    type: ContactTypeDto;
}