import { MoneyObject } from '@/types';

export interface ProductDetails {
    name: string;
    lastSale: string;
    description: string;
    variation: string;
}

export interface ProductTransaction {
    transactionDate: string;
    salesReferenceNumber: string;
    customerName: string;
    products: string[];
    totalAmount: MoneyObject;
    balanceDue: MoneyObject;
    supplyDueDate: string;
    transactionStatus: string;
    saleKey: string;
}
