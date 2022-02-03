import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { BaseController } from "src/common/controllers/base.controller";
import { Mapper } from "src/common/mappers/mapper";
import { MessageError } from "src/common/result";
import { CustomerService } from "src/domain/services/customer.service";
import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { CustomerPutAddressCommand } from "src/dtos/commands/customer-put-address.command";
import { CustomerDto } from "src/dtos/customer.dto";

@Controller("api/v1/customers")
export class CustomerController extends BaseController {

    constructor(
        private customerService: CustomerService,
        private mapper: Mapper) {
        super();
    }

    @Post()
    @ApiResponse({ status: 500, type: MessageError, isArray: true })
    async post(@Body() command: CustomerCreateCommand): Promise<CustomerDto> {
        const result = await this.customerService.create(command);

        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);;
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }

    @Put(':customerId/address')
    @ApiResponse({ status: 500, type: MessageError, isArray: true })
    async putAddress(@Param('customerId') customerId: string, @Body() command: CustomerPutAddressCommand) {
        const result = await this.customerService.setAddress(customerId, command);
        
        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);;
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }
}