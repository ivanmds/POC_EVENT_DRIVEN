import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { BaseController } from "src/common/controllers/base.controller";
import { Mapper } from "src/common/mappers/mapper";
import { Tracing } from "src/common/otlp/tracing";
import { MessageError } from "src/common/result";
import { CustomerService } from "src/domain/services/customer.service";
import { CustomerCreateCommand } from "src/dtos/commands/customer-create.command";
import { CustomerPutAddressCommand } from "src/dtos/commands/customer-put-address.command";
import { CustomerPutContactCommand } from "src/dtos/commands/customer-put-contact.command";
import { CustomerDto } from "src/dtos/customer.dto";
import { Span } from "nestjs-otel/lib/tracing/decorators/span";


@ApiTags("customers")
@Controller("api/v1/customers")
export class CustomerController extends BaseController {

    private counterCustomerGot: any;
    private counterCustomerCreated: any;
    private counterCustomerUpdate: any;

    constructor(
        private customerService: CustomerService,
        private mapper: Mapper,
        tracing: Tracing) {
        super();

        const meter = tracing.getMeter("customer_controller");
        this.counterCustomerGot = meter.createCounter('customer_got');
        this.counterCustomerCreated = meter.createCounter('customer_created');
        this.counterCustomerUpdate = meter.createCounter('customer_updated');
    }

    @Get(":customerId")
    @ApiQuery({ name: "version", type: String, required: false })
    @Span("CustomerController_Get")
    async get(@Param('customerId') customerId: string, @Query('version') version?: string): Promise<CustomerDto> {

        this.counterCustomerGot.add(1);
        const versionParsed = version == null ? null : parseInt(version);
        const result = await this.customerService.get(customerId, versionParsed);

        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }

    @Post()
    @ApiResponse({ status: 500, type: MessageError, isArray: true })
    async post(@Body() command: CustomerCreateCommand): Promise<CustomerDto> {
        const result = await this.customerService.create(command);

        this.counterCustomerCreated.add(1);
        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }

    @Patch(':customerId/address')
    @ApiResponse({ status: 500, type: MessageError, isArray: true })
    async putAddress(@Param('customerId') customerId: string, @Body() command: CustomerPutAddressCommand) {
        const result = await this.customerService.setAddress(customerId, command);

        this.counterCustomerUpdate.add(1);
        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }

    @Patch(':customerId/contact')
    @ApiResponse({ status: 500, type: MessageError, isArray: true })
    async putContact(@Param('customerId') customerId: string, @Body() command: CustomerPutContactCommand) {
        const result = await this.customerService.addContact(customerId, command);

        this.counterCustomerUpdate.add(1);
        if (result.isSuccess()) {
            const customer = result.getData();
            return this.mapper.map(Mapper.customerToCustomerDto, customer);
        }
        else {
            this.httpCodeByError(result.getErrors());
        }
    }
}