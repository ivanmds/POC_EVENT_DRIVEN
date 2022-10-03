import { errorMapped } from 'src/common/error-mapped';
import { BaseEvent } from 'src/common/entities/events/base.event';
import { Result, ResultData } from 'src/common/result';
import { BaseRepository } from './base.repository';
import { Span } from 'nestjs-otel';

export abstract class EventStoreBaseRepository extends BaseRepository {

    constructor(protected collectionName: string) {
        super("customer", collectionName)
    }

    @Span("EventStoreBaseRepository_insertOne")
    protected async insertOne<TEvent extends BaseEvent>(event: TEvent): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            collection.insertOne(event);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.unknown(error));
        }
    }

    @Span("EventStoreBaseRepository_insertMany")
    protected async insertMany<TEvent extends BaseEvent>(events: TEvent[]): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            collection.insertMany(events);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.unknown(error));
        }
    }

    @Span("EventStoreBaseRepository_getAllEvents")
    protected async getAllEvents(aggregateId: string, version?: number): Promise<ResultData<BaseEvent[]>> {
        try {

            if(version == null) {
                version = Number.MAX_VALUE;
            }

            const collection = this.database.collection(this.collectionName);
            
            var events = await collection.find<BaseEvent>({ aggregateId: aggregateId, aggregateVersion: { $lte: version }}).toArray();
          
            if (events?.length == 0) {
                return ResultData.fail3(errorMapped.notFound());
            }

            return ResultData.okWithData(events);
        } catch (error) {
            return ResultData.fail3(errorMapped.unknown(error));
        }
    }
}