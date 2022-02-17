import { Db, MongoClient } from "mongodb";

export abstract class BaseRepository {
    
    protected mongoClient: MongoClient;
    protected database: Db;

    constructor(protected dbName: string, protected collectionName: string) {
        this.mongoClient = new MongoClient('mongodb://user:pwd@localhost:27017/admin');
        this.loadClient();
    }

    private async loadClient() {
        await this.mongoClient.connect();
        this.database = this.mongoClient.db(this.dbName);
    }
}