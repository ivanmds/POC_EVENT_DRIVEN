import { InternalServerErrorException } from "@nestjs/common";
import { errorMapped } from "../error-mapped";
import { MessageError } from "../result";

export abstract class BaseController {

    protected httpCodeByError(errors: MessageError[]) {
        errors.forEach(error => {

            switch (error.code) {
                case errorMapped.kafka().code:
                    throw new InternalServerErrorException(errorMapped.kafka());
                case errorMapped.unknown().code:
                    throw new InternalServerErrorException(errorMapped.unknown());
                default:
                    console.log("Error not mapped");
                    break;
            }
        });
    }
}