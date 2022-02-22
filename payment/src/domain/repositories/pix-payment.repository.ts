import { Injectable } from "@nestjs/common";
import { PixPayment } from "../entities/pix-payment.entity";
import { BaseRepository } from "./base.repository";

@Injectable()
export class PixPaymentRepository extends BaseRepository {

    constructor() {
        super("payment", "pixPayment");
    }


    public async create(pixPayment: PixPayment): Promise<void> {
        const collection = this.database.collection(this.collectionName);
        await collection.insertOne(pixPayment);
    }

    public async getById(id: string): Promise<PixPayment> {
        const collection = this.database.collection(this.collectionName);
        return collection.findOne<PixPayment>({ id: id });
    }

    public async getByDocumentNumber(documentNumber: string): Promise<PixPayment[]> {
        const collection = this.database.collection(this.collectionName);
        return collection.find<PixPayment>({ 'debit.documentNumber': documentNumber }).toArray();
    }

    public async update(pixPayment: PixPayment): Promise<void> {
        const collection = this.database.collection(this.collectionName);
        await collection.replaceOne({ id: pixPayment.id }, pixPayment);
    }
}