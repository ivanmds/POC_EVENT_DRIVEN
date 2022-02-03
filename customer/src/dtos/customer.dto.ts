import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "./address.dto";
import { ContactDto } from "./contact.dto";
import { CustomerStatusTypeDto } from "./types/customer-status-type.dto";

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
    status: CustomerStatusTypeDto;

    @ApiProperty()
    version: number;

    @ApiProperty()
    created: Date;

    @ApiProperty()
    updated: Date;

    @ApiProperty()
    address: AddressDto;

    @ApiProperty()
    contacts: ContactDto[];
}