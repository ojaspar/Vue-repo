import { MoneyObject } from '@/pages/Sales/types';

export interface BankAccount {
    bankName: string;
    accountNumber: string;
    accountName: string;
    accountBalance: MoneyObject;
    displayName: string;
}

export interface BankAccountList {
    bankName: string;
    accountNumber: string;
    formattedBalance: MoneyObject;
    accountName: string;
    accountBalance: MoneyObject;
    displayName: string;
    currencySymbol: string;
}

export interface Debtor {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    debtorType: string;
    amountOwed: MoneyObject;
    expectedPaymentDate: string;
}

export interface DebtorList {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    debtorType: string;
    amountOwed: MoneyObject;
    expectedPaymentDate: string;
    currencySymbol: string;
    formattedAmountOwed: string;
}

export interface Creditor {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    creditorType: string;
    amountOwed: MoneyObject;
    expectedPaymentDate: string;
}

export interface CreditorList {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    creditorType: string;
    amountOwed: MoneyObject;
    expectedPaymentDate: string;
    currencySymbol: string;
    formattedAmountOwed: string;
}

export interface Asset {
    assetName: string;
    description: string;
    assetTypeKey: string;
    currentValue: MoneyObject;
    usefulMonthLife: string;
    assetTypeText: string;
}

export interface AssetList {
    assetName: string;
    description: string;
    assetTypeKey: string;
    assetTypeText: string;
    currentValue: MoneyObject;
    usefulMonthLife: string;
    currencySymbol: string;
    unformattedAssetCurrentValue: string;
}

export interface BusinessMigrationData {
    cashBalance: MoneyObject;
    totalYearSales: MoneyObject;
    totalYearExpenses: MoneyObject;
    financialYearStartMonth: string | number;
    financialYearMonthName: string;
    creditorList: Array<Creditor>;
    debtorList: Array<Debtor>;
    bankAccountList: Array<BankAccount>;
    assetList: Array<Asset>;
}

export interface BankAccountDetails {
    index: number;
    bankAccount: BankAccount;
}

export interface BankAccountInput {
    bankName: string;
    accountNumber: string;
    accountName: string;
    accountBalance: MoneyObject;
    displayName: string;
    amountString: string;
}

export interface CreditorDetails {
    index: number;
    creditor: Creditor;
}

export interface DebtorDetails {
    index: number;
    debtor: Debtor;
}

export interface AssetDetails {
    index: number;
    asset: Asset;
}

export interface AssetTypeData {
    key: string;
    name: string;
}

export interface CurrencyKeyListData {
    currencyKey: string | number;
}
