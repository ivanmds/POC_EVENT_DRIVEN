import { Span } from "nestjs-otel";
import { BaseEvent } from "./events/base.event";

export abstract class AggregateRoot {

    private uncommittedEvents: Array<BaseEvent>;

    constructor() {
        this.uncommittedEvents = new Array<BaseEvent>();
        this.created = Date.nowUtc();
    }

    id: string;
    created: Date;
    updated: Date;
    version: number = 0;

    set setAggregateId(aggregateId: string) {
        this.id = aggregateId;
    }

    protected abstract apply(event: BaseEvent);

    clearUncommittedEvents = () => this.uncommittedEvents = new Array<BaseEvent>();

    getUncommittedEvents = (): BaseEvent[] => this.uncommittedEvents;

    @Span("AggregateRoot_applyEvent")
    applyEvent(event: BaseEvent) {
        this.apply(event);
        this.version = event.aggregateVersion;
        this.updated = event.created;
    }

    protected upVersion = () => this.version++;

    @Span("AggregateRoot_raiseEvent")
    protected raiseEvent<TEvent extends BaseEvent>(event: TEvent) {
        this.upVersion();
        event.aggregateVersion = this.version;
        event.aggregateId = this.id;

        this.uncommittedEvents.push(event);
        this.applyEvent(event);
    }
}