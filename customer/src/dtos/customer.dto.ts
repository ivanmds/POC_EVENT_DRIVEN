import { ApiProperty } from "@nestjs/swagger";

export class CustomerDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    motherName: string;

    @ApiProperty()
    birthDate: Date;
}