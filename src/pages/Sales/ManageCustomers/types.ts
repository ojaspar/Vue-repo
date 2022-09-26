import { MoneyObject } from '@/types';
import { TransactionStatsCard } from '@/types';

export interface CustomerDetails {
    customerKey: string;
    email: string;
    address: string;
    notes: string;
    financialYearStartDate: string;
    lastInteraction: string;
    lastInteractionDate: string;
    lastSaleKey: string;
    name: string;
    phoneNumber: string;
    totalBalanceDue: MoneyObject;
    totalFinancialYearSale: MoneyObject;
    totalPrepayment: MoneyObject;
}

export const defauldCustomerDetails: CustomerDetails = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
    lastInteractionDate: '',
    customerKey: '',
    totalPrepayment: { amount: 0, currencyKey: '' },
    financialYearStartDate: '',
    lastInteraction: '',
    lastSaleKey: '',
    totalBalanceDue: { currencyKey: '', amount: 0 },
    totalFinancialYearSale: { amount: 0, currencyKey: '' },
};

export interface CustomerBioData {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    notes: string;
}

export interface CustomerTransaction {
    transactionDate: string;
    products: string[];
    totalAmount: MoneyObject;
    balanceDue: MoneyObject;
    transactionStatus: string;
    supplyDueDate: string;
}

export const defaultStats: TransactionStatsCard = {
    firstCardHeader: '',
    firstCardBody: '',
    secondCardHeader: '',
    secondCardBody: '',
};
