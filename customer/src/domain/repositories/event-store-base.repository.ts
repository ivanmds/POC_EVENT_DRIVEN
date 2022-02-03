import { Db, MongoClient } from 'mongodb';
import { errorMapped } from 'src/common/error-mapped';
import { BaseEvent } from 'src/common/entities/events/base.event';
import { Result, ResultData } from 'src/common/result';

export abstract class EventStoreBaseRepository {

    protected mongoClient: MongoClient;
    protected dbName = 'poc_eda';
    protected database: Db;


    constructor(protected collectionName: string) {
        this.mongoClient = new MongoClient(process.env.MONGO_CONNECTION_STRING);
        this.loadClient();
    }

    private async loadClient() {
        await this.mongoClient.connect();
        this.database = this.mongoClient.db(this.dbName);
    }

    protected async insertOne<TEvent extends BaseEvent>(event: TEvent): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            collection.insertOne(event);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.unknown(error));
        }
    }

    protected async insertMany<TEvent extends BaseEvent>(events: TEvent[]): Promise<Result> {
        try {
            const collection = this.database.collection(this.collectionName);
            collection.insertMany(events);
            return Result.ok();
        } catch (error) {
            return Result.fail2(errorMapped.unknown(error));
        }
    }

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