import { MessageError } from "./result";

export const errorMapped = {
    kafka: (error?: Error) => new MessageError("002", "Kafka error", error),
    unknown: (error?: Error) => new MessageError("003", "Internal error", error),
}