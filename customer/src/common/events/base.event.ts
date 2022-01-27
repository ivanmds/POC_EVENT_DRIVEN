import "..//..//common//extensions//date.extension";
export abstract class BaseEvent {

    constructor() {
        this.created = Date.nowUtc();
    }

    aggregateId: string;
    aggregateVersion: number;
    created: Date;

    abstract eventName: string;
}