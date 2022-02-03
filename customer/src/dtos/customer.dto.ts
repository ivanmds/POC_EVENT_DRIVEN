import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "./address.dto";

export class CustomerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    motherName: string;

    @ApiProperty()
    birthDate: Date;

    @ApiProperty()
    address: AddressDto;
}