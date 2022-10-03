import { Db, MongoClient } from "mongodb";
import { Span } from "nestjs-otel";

export abstract class BaseRepository {
    
    protected mongoClient: MongoClient;
    protected database: Db;

    constructor(protected dbName: string, protected collectionName: string) {
        this.mongoClient = new MongoClient(process.env.MONGO_CONNECTION_STRING);
        this.loadClient();
    }

    @Span("BaseRepository_loadClient")
    private async loadClient() {
        await this.mongoClient.connect();
        this.database = this.mongoClient.db(this.dbName);
    }
}