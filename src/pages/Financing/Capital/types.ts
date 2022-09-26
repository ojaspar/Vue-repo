import { MoneyObject, Status } from '@/types';

export enum FormOfCapitalOptions {
    FINANCIAL = 'Financial',
    ITEM = 'Item',
    SERVICE = 'Service',
    NONE = '',
}

export const defaultShareholder: Shareholder = {
    phoneNumber: '',
    emailAddress: '',
    address: '',
    notes: '',
    shareHolderKey: '',
    shareHoldername: '',
    lastInteraction: '',
    lastInteractionDate: '',
    totalAmount: { amount: 0, currencyKey: 0 },
};

export const addCapitalFormStub: AddCapitalForm = {
    contributionValue: { amount: 0, currencyKey: 0 },
    paymentAccountKey: '',
    description: '',
    shareHolderKey: '',
    transactionDate: '',
    formOfCapitalKey: 'ba71a2bc-3b9c-11eb-aeb0-db8871b6334e', //default to financial
    itemTypeKey: '',
    itemDescription: '',
    itemValue: { amount: 0, currencyKey: 0 },
    serviceDescription: '',
    serviceValue: { amount: 0, currencyKey: 0 },
    quantity: 1,
};

export interface Shareholder {
    shareHolderKey?: string;
    shareHoldername: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    notes: string;
    lastInteraction?: string | null;
    lastInteractionDate?: string | null;
    totalAmount: MoneyObject;
}
export interface AddShareholderForm {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    notes: string;
}

export interface AddCapitalForm {
    contributionValue: MoneyObject;
    paymentAccountKey?: string;
    description?: string;
    shareHolderKey: string;
    transactionDate: string;
    formOfCapitalKey: string;
    itemTypeKey?: string;
    itemDescription: string;
    serviceDescription: string;
    itemValue: MoneyObject;
    serviceValue: MoneyObject;
    quantity?: number | string;
}

export interface FinancingRequestStatus {
    getAllShareholders: Status;
    createShareholder: Status;
    getDashboardCardDetails: Status;
    addCapital: Status;
    getFormsOfCapital: Status;
    addLoan: Status;
    addLoanRepayment: Status;
    getAllLoans: Status;
    getLoanDetails: Status;
    getLoanDetailsCard: Status;
    getLoanRepayments: Status;
    getShareholderDetails: Status;
    updateShareholderDetails: Status;
    getCapitalItemTypes: Status;
}

export interface FormOfCapital {
    name: string;
    formOfCapitalKey: string;
}

export interface UpdateShareholderRequest {
    shareholderKey: string;
    shareholder: AddShareholderForm;
}

export interface CapitalItemType {
    key: string;
    name: string;
}

export interface UpdatedShareholder {
    name: string;
    emailAddress: string;
    address: string;
    notes: string;
    phoneNumber: string;
}
