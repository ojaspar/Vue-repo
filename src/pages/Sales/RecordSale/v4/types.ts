import { MoneyObject } from '@/types';
import { Product, initialStateOfProduct } from '@/pages/Sales/types';

export interface SaleItemDetails {
    name: string;
    unitPrice: MoneyObject;
    quantity: number;
    discount: number;
    measurementType: string;
    measurementTypeKey: string;
    quantitySupplied: number;
    notes: string;
    transactionDate: string;
    supplyDueDate: string;
}

export const defaultItemDetails: SaleItemDetails = {
    name: '',
    unitPrice: { amount: 0, currencyKey: 0 },
    quantity: 1,
    discount: 0,
    measurementType: 'Unit',
    measurementTypeKey: 'Unit',
    quantitySupplied: 1,
    notes: '',
    transactionDate: '',
    supplyDueDate: '',
};

export interface SelectedItemDetails {
    selectedProduct: Product;
    saleItemDetails: SaleItemDetails;
}

export const defaultSelectedItems: SelectedItemDetails = {
    selectedProduct: { ...initialStateOfProduct },
    saleItemDetails: { ...defaultItemDetails },
};
export interface SelectedItemsTotalAmount {
    subTotal: number;
    totalExclVAT: number;
    whtAmount: number;
    vatAmount: number;
    netAmount: number;
}

export const defaultItemsTotalAmount: SelectedItemsTotalAmount = {
    subTotal: 0,
    totalExclVAT: 0,
    whtAmount: 0,
    vatAmount: 0,
    netAmount: 0,
};
export interface ItemTaxOptions {
    isInclusiveVAT: boolean;
    addVat: boolean;
    deductWht: boolean;
    whtIsTenPercent: boolean;
}

export const defaultTaxOptions: ItemTaxOptions = {
    isInclusiveVAT: false,
    addVat: true,
    deductWht: false,
    whtIsTenPercent: true,
};

export interface PaymentDetails {
    paymentAccountKey: string;
    amountPaid: MoneyObject;
    transactionDate: string;
    balanceDueDate: string;
    hasPartialPayment: boolean;
}

export const defaultPaymentDetails: PaymentDetails = {
    paymentAccountKey: '',
    amountPaid: { amount: 0, currencyKey: 0 },
    transactionDate: '',
    balanceDueDate: '',
    hasPartialPayment: false,
};
