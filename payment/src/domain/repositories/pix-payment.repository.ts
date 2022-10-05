import { Injectable } from "@nestjs/common";
import { PixPayment } from "../entities/pix-payment.entity";
import { BaseRepository } from "./base.repository";
import { Span } from 'nestjs-otel';

@Injectable()
export class PixPaymentRepository extends BaseRepository {

    constructor() {
        super("payment", "pixPayment");
    }


    public async create(pixPayment: PixPayment): Promise<void> {
        const collection = this.database.collection(this.collectionName);
        await collection.insertOne(pixPayment);
    }

    @Span("PixPaymentRepository_getById")
    public async getById(id: string): Promise<PixPayment> {
        const collection = this.database.collection(this.collectionName);
        return collection.findOne<PixPayment>({ id: id });
    }

    @Span("PixPaymentRepository_getByDocumentNumber")
    public async getByDocumentNumber(documentNumber: string): Promise<PixPayment[]> {
        const collection = this.database.collection(this.collectionName);
        return collection.find<PixPayment>({ 'debit.documentNumber': documentNumber }).toArray();
    }

    @Span("PixPaymentRepository_update")
    public async update(pixPayment: PixPayment): Promise<void> {
        const collection = this.database.collection(this.collectionName);
        await collection.replaceOne({ id: pixPayment.id }, pixPayment);
    }
}