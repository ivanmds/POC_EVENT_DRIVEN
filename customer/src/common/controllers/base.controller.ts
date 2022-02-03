import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { errorMapped } from "../error-mapped";
import { MessageError } from "../result";

export abstract class BaseController {

    protected httpCodeByError(errors: MessageError[]) {
        errors.forEach(error => {

            switch (error.code) {
                case errorMapped.notFound().code:
                    throw new NotFoundException(error);
                case errorMapped.saveCustomerError().code:
                        throw new InternalServerErrorException(error);
                case errorMapped.kafka().code:
                    throw new InternalServerErrorException(error);
                case errorMapped.unknown().code:
                    throw new InternalServerErrorException(error);
                default:
                    console.log("Error not mapped");
                    break;
            }
        });
    }
}