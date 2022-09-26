import { MoneyObject } from '@/types';

export interface UpdateSupplyForm {
    supply: string;
    supplyDate: string;
    outstandingSupplyDueDate: string;
}

export interface AddSalesPayment {
    saleKey: string;
    amountPaid: MoneyObject;
    paymentAccountKey: string;
    dateReceived: string;
}
