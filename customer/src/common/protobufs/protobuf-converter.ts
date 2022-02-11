import { Injectable } from "@nestjs/common";
import { CustomerWasCreatedEvent } from "src/dtos/externalEvents/customer-was-created.event";
import { KafkaMessage } from "../kafka/kafka.message";
const protobuf = require("protobufjs");

@Injectable()
export class ProtobufConverter  {


    public async getBuf(message: KafkaMessage): Promise<any> {
        const file = this.getPathByMessage(message.getName());
        const root = await protobuf.load(file);

        const event = root.lookupType('CustomerWasCreated');
        const buf = event.encode(message).finish();
        return buf;
    }



    private getPathByMessage(messageName: string): string {
        switch(messageName) {
            case CustomerWasCreatedEvent.externalEventName: 
                return "..//protos/customer/customer-was-created.proto"
        }
    }

}
