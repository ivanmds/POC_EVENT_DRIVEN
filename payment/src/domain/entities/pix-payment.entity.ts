import { PaymentType } from "./payment.type";
import { AccountVO } from "./account.vo";

export class PixPayment {
    id: string;
    transactionCode: string;
    debit: AccountVO;
    credit: AccountVO;
    amount: number;
    status: PaymentType[];
    created: Date;
    updated: Date;
}
