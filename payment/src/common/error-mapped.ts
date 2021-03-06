import { MessageError } from "./result";

export const errorMapped = {
    kafka: (error?: Error) => new MessageError("002", "Kafka error", error),
    unknown: (error?: Error) => new MessageError("003", "Internal error", error),
    saveCustomerError: (error?: Error) => new MessageError("004", "Error when try save transaction.", error),
    notFound: (error?: Error) => new MessageError("005", "Data not found", error),
}