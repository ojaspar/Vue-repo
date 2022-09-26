import { MoneyObject, Status } from '@/types';

export const defaultTaxContactDetails: TaxContactDetails = {
    email: '',
    operatingAddress: '',
    phoneNumber: '',
};

export interface TaxRequestStatus {
    getTaxContactDetails: Status;
    updateTaxContactDetails: Status;
    getTaxProfiles: Status;
    getTaxStates: Status;
    getTaxStations: Status;
    createTaxProfile: Status;
    fetchTaxLiabilities: Status;
    remitTax: Status;
    getTaxTypes: Status;
    getTaxLiabilityTransactions: Status;
}

export enum TaxStationJurisdiction {
    FEDERAL = 'Federal',
    STATE = 'State',
    NONE = '',
}

export enum TaxPeriodDuration {
    ANNUALLY = 'Annually',
    MONTHLY = 'Monthly',
}

export enum TaxTypes {
    CIT = 'CIT',
    WHT = 'WHT',
    PAYE = 'PAYE',
    VAT = 'VAT',
}

export enum TaxJurisdiction {
    FIRS = 'FIRS',
    SIRS = 'SIRS',
}

export const defaultTaxRegistrationProfile: TaxProfileRegistrationForm = {
    taxStationKey: '',
    taxStationStateKey: '',
    taxProfileType: TaxStationJurisdiction.FEDERAL,
    taxIdentity: '',
    cacForm101: '',
    cacForm102: '',
    cacForm103: '',
};

export const defaultTaxProfile: TaxProfile = {
    taxProfileKey: '',
    taxStation: {
        stationKey: '',
        name: '',
        stateKey: '',
    },
    taxProfileType: TaxStationJurisdiction.FEDERAL,
    taxIdentity: '',
    cacForm101: '',
    cacForm102: '',
    cacForm103: '',
};

export interface TaxLiability {
    period: string;
    taxType: TaxTypes;
    jurisdiction: TaxJurisdiction;
    taxPayable: MoneyObject;
    filingDeadline: string;
    taxLiabilitySumKey: string;
    transactionType: string;
    amountPaid: MoneyObject;
    balance: MoneyObject;
}

export const taxLiabilityStub: TaxLiability = {
    period: '',
    taxType: TaxTypes.CIT,
    jurisdiction: TaxJurisdiction.FIRS,
    taxPayable: { amount: 0, currencyKey: 0 },
    taxLiabilitySumKey: '',
    amountPaid: { amount: 0, currencyKey: 0 },
    balance: { amount: 0, currencyKey: 0 },
    filingDeadline: '',
    transactionType: '',
};

export interface RemitTaxForm {
    amountPaid: MoneyObject;
    paymentAccountKey: string;
    transactionDate: string;
    paymentReceipt?: string;
    filingDocument?: string;
    period?: string;
    taxTypeKey?: string;
}

export interface TaxContactDetails {
    email: string;
    phoneNumber: string;
    operatingAddress: string;
}

export interface TaxProfile {
    taxProfileKey: string;
    taxStation: {
        stationKey: string;
        name: string;
        stateKey: string;
    };
    taxProfileType: TaxStationJurisdiction;
    taxIdentity: string;
    cacForm101: string;
    cacForm102: string;
    cacForm103: string;
    status?: string;
}

export interface TaxProfileRegistrationForm {
    taxStationStateKey: string;
    taxStationKey: string;
    taxProfileType: TaxStationJurisdiction | string;
    taxIdentity: string;
    cacForm101: string;
    cacForm102: string;
    cacForm103: string;
}

export interface TaxProfileRegistrationPayload {
    taxStationKey: string;
    taxProfileType: TaxStationJurisdiction | string;
    taxProfileKey: string;
    taxIdentity: string;
    cacForm101: string;
    cacForm102: string;
    cacForm103: string;
}

export interface TaxStation {
    key: string;
    name: string;
}

export type TaxProfileUpload = {
    cacForm101: string;
    cacForm102: string;
    cacForm103: string;
};

export type UploadedCacForm = {
    fileTag: keyof TaxProfileRegistrationForm;
    fileUrl: string;
};

export enum CACForms {
    empty = '',
    cacForm101 = 'cacForm101',
    cacForm102 = 'cacForm102',
    cacForm103 = 'cacForm103',
}

export interface TaxLiabilityRemittanceForm {
    amountPaid: MoneyObject;
    paymentAccountKey: string;
    taxLiabilitySumKey?: string;
    transactionDate: string;
    period?: string;
    taxTypeKey?: string;
}

export interface TaxRemittanceDocument {
    paymentReceipt: string;
    filingDocument: string;
}

export type UploadedTaxRemittanceForms = {
    fileTag: keyof RemitTaxForm;
    fileUrl: string;
};

export enum TaxRemittanceDocuments {
    empty = '',
    paymentReceipt = 'paymentReceipt',
    filingDocument = 'filingDocument',
}

export interface TaxType {
    name: string;
    taxTypeKey: string;
    isCommon: boolean;
    frequency: string;
}

export interface TaxLiabilityTransaction {
    person: string;
    transactionDetail: string;
    transactionDate: string;
    tax: MoneyObject;
    totalAmount: MoneyObject;
    taxType: string;
}

export interface TaxLiabilityPaymentDocument {
    title: string;
    link: string;
}

export interface TaxLiabilityPayment {
    transactionDate: string;
    amountPaid: MoneyObject;
    documents: Array<TaxLiabilityPaymentDocument>;
}
