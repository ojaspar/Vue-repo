import { MoneyObject } from '@/types';
import { ExpenseItemType, expenseItemTypeInitialState } from '@/pages/Spending/Expense/types';

export interface ExpenseItemDetails {
    name: string;
    description: string;
    amount: MoneyObject;
    quantity: number;
    measurementType: string;
    measurementTypeKey: string;
    quantityReceived: number;
    donationSchemeKey: string;
    notes: string;
    transactionDate: string;
    supplyDueDate: string;
}

export const defaultItemDetails: ExpenseItemDetails = {
    name: '',
    description: '',
    amount: { amount: 0, currencyKey: 0 },
    quantity: 1,
    measurementType: 'Unit',
    measurementTypeKey: 'Unit',
    quantityReceived: 0,
    donationSchemeKey: '',
    notes: '',
    transactionDate: '',
    supplyDueDate: '',
};

export interface SelectedItemDetails {
    selectedExpenseItem: ExpenseItemType;
    expenseItemDetails: ExpenseItemDetails;
}

export const defaultSelectedItems: SelectedItemDetails = {
    selectedExpenseItem: { ...expenseItemTypeInitialState },
    expenseItemDetails: { ...defaultItemDetails },
};
export interface SelectedItemsTotalAmount {
    subTotal: number;
    whtAmount: number;
    netAmount: number;
}

export const defaultItemsTotalAmount: SelectedItemsTotalAmount = {
    subTotal: 0,
    whtAmount: 0,
    netAmount: 0,
};
export interface ItemTaxOptions {
    addVat: boolean;
    deductWht: boolean;
    whtIsTenPercent: boolean;
}

export const defaultTaxOptions: ItemTaxOptions = {
    addVat: false,
    deductWht: false,
    whtIsTenPercent: true,
};

export interface ExpensePaymentDetails {
    accountPaidFrom: string;
    amountPaid: MoneyObject;
    transactionDate: string;
    balanceDueDate: string;
    hasPartialPayment: boolean;
}

export const defaultPaymentDetails: ExpensePaymentDetails = {
    accountPaidFrom: '',
    amountPaid: { amount: 0, currencyKey: 0 },
    transactionDate: '',
    balanceDueDate: '',
    hasPartialPayment: false,
};
