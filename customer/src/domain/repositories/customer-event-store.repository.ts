import { Result } from "src/common/result";
import { Customer } from "../entities/customer.entity";
import { BaseRepository } from "./base.repository";
import { EventData } from "./data/event.data";
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerEventStoreRepository extends BaseRepository {

    constructor() {
        super('customerEvents');
    }

    async save(customer: Customer): Promise<Result> {

        const events = customer.getUncommittedEvents();
        const eventsData = new Array();

        events.forEach((event) => {
            const eventData = new EventData();
            eventData.id = uuidv4();
            eventData.created = event.created;
            eventData.aggregatedId = event.aggregateId;
            eventData.version = event.aggregateVersion;
            eventData.name = event.eventName;
            eventData.data = JSON.stringify(event);
            eventsData.push(eventData);
        });
        
        this.insertMany(eventsData);
        return Result.ok();
    }
}