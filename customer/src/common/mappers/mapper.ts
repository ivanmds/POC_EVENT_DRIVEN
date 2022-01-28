import { Customer } from "src/domain/entities/customer.entity";
import { CustomerDto } from "src/dtos/customer.dto";
export class Mapper {

    public static keyCustomerToCustomerDto = "CustomerToCustomerDto";

    public map(mapKey: string, source: any) : any {
        switch (mapKey) {
            case Mapper.keyCustomerToCustomerDto:
                return this.mapCustomerToCustomerDto(source);
            default:
                throw Error('Event name not found');
        }
    }

    private mapCustomerToCustomerDto(customer: Customer): CustomerDto {
        const dto = new CustomerDto();
        dto.id = customer.id;
        dto.name = customer.getName;
        dto.motherName = customer.getMotherName;
        dto.birthDate = customer.getBirthDate;

        return dto;
    }
}