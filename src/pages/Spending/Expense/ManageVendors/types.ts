import { MoneyObject } from '@/types';

export interface VendorDetails {
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    activity: string;
    lastActivityDate: string;
    amount: string;
    paymentStatus: string;
}

export interface MobileVendorDetails {
    name: string;
    email: string;
    phoneNumber: string;
    lastActivityDate: string;
    pendingBalanceAmount: string;
    note: string;
}

export interface VendorTransaction {
    transactionDate: string;
    itemName: string;
    totalAmountExclusiveOfTax: MoneyObject;
    balance: MoneyObject;
    supplyStatus: string;
    supplyDueDate: string;
    expenseType: string;
}
