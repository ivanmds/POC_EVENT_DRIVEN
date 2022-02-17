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
}