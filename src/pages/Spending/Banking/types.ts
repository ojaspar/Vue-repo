import { Status } from '@/types';

export interface BankAccount {
    bankAccountKey: string;
    bankName: string;
    displayName: string;
    accountName: string;
    accountNumber: string;
    accountBalance: MoneyObject;
    sourcePaymentAccountKey?: string;
    transactionDate?: string;
}

export interface BankDetails {
    bankAccountKey?: string;
    bankName: string;
    accountNumber: string;
    accountBalance: MoneyObject;
    displayName: string;
    sourcePaymentAccountKey: string;
    transactionDate?: string;
}

export interface BankRequest {
    addBankAccount: Status;
    updateBankAccount: Status;
    getPaymentAccounts: Status;
    transferFund: Status;
    getTransactions: Status;
    getAccountDetails: Status;
}

export interface FundTransferDetails {
    sourceAccountKey: string;
    sourceAmount: MoneyObject;
    destinationAccountKey: string;
    destinationAmount: MoneyObject;
    notes: string;
    transactionDate: string;
}
export interface SourceAccountStatus {
    balance: string | number;
    newBalance: string | number;
}

export interface MoneyObject {
    currencyKey: string | number;
    amount: string | number;
}

export interface DestinationAccountStatus {
    balance: string | number;
    transferAmount: number;
    newBalance: number;
}

export interface FundTransferPayload {
    sourceAccountKey: string;
    transferAmount: MoneyObject;
    destinationAccountKey: string;
    notes: string;
}

export interface AccountTransaction {
    transactionDate: string;
    transactionType: string;
    transactionDetail: string;
    amount: MoneyObject;
    paymentAccountKey: string;
}

export enum AccountOptions {
    CLOSURE = 'account-closure',
    OVERDRAFT = 'account-overdraft',
}

export interface NigerianBank {
    name: string;
    code: string | null;
    slug: string;
    ussd: {
        code: string | null;
    };
}
