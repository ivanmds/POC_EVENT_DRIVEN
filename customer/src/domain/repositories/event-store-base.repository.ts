import { Db, MongoClient } from 'mongodb';
import { BaseData } from './data/base.data';

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

    protected async insertOne<TData extends BaseData>(data: TData):  Promise<boolean> {
        const collection = this.database.collection(this.collectionName);
        collection.insertOne(data);
        return true;
    }

    protected async insertMany<TData extends BaseData>(data: TData[]):  Promise<boolean> {
        const collection = this.database.collection(this.collectionName);
        collection.insertMany(data);
        return true;
    }

    protected async getAll(aggregatedId: string): Promise<BaseData[]> {
        const collection = this.database.collection(this.collectionName);
        const filteredDocs = await collection.find({ aggregateId: aggregatedId }).toArray();
        console.log(filteredDocs);
        return null;
    }
}