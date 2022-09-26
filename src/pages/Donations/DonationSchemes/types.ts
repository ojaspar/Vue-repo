import { MoneyObject } from '@/pages/Spending/Banking/types';

export interface DonationScheme {
    name: string;
    financialTarget: MoneyObject;
    targeDate: string;
    type: string;
    description: string;
}

export interface DonationSchemeDetails {
    productKey: string;
    name: string;
    currentAmount: MoneyObject;
    totalAmount: MoneyObject;
    financialTarget: MoneyObject;
    targetDate: string;
    type: string;
    description: string;
    lastTransactionType: string;
    lastTransactionDate: string;
}
