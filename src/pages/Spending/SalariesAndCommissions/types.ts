import { MoneyObject, Status } from '@/types';

export interface Staff {
    staffName: string;
    lastAmountPaid: MoneyObject;
    lastDatePaid: string;
    staffPaymentKey: string;
    phoneNumber: string;
}

export enum PaymentTypes {
    SALARY = 'salary',
    COMMISSION = 'commission',
}

export enum TaxTypes {
    PAYE = 'Paye',
    WITHOLDING = 'INCLUSIVE',
}

export interface StaffPaymentRequest {
    paymentType: PaymentTypes;
    payTax: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    paymentPeriod: string;
    paymentAmount: MoneyObject;
    deduction: MoneyObject;
    note: string;
    staffPaymentKey: string;
    paymentAccountKey: string;
    transactionDate: string;
}

export interface PayAndCommissionRequest {
    paymentType: PaymentTypes;
    payTax: string;
    fullname: string;
    phoneNumber: string;
    paymentPeriod: string;
    paymentAmount: MoneyObject;
    deduction: MoneyObject;
    note: string;
    staffPaymentKey: string;
    paymentAccountKey: string;
    transactionDate: string;
    netPay: MoneyObject;
    firstName?: string;
    lastName?: string;
}

export enum SalariesAndCommissionsHeader {
    selectStaff = 'Select Staff',
    addNewStaff = 'Add New Staff',
    payAnotherStaff = 'Pay Another Staff',
    addPaymentForSelectedStaff = 'Add Payment',
    editPaymentForSelectedStaff = 'Edit Payment',
    paymentSummary = 'Payment Summary',
}

export interface SalariesAndCommissionRequestStatus {
    getStaffListForPayment: Status;
    addStaffForPayment: Status;
    calculateTaxAmountForPayment: Status;
    paySalaryCommission: Status;
}
export interface TaxAmount {
    taxType: string;
    paymentAmount: number;
}

export interface SalaryAndCommissionRequest {
    staffPayments: Array<ExistingStaffPayment>;
    newStaffList: Array<StaffPaymentRequest>;
}

export interface PaymentAndCommissionRequest {
    staffPayments: Array<ExistingStaffPaymentAndCommission>;
    newStaffList: Array<PayAndCommissionRequest>;
}

export interface ExistingStaffPayment {
    staffPaymentKey: string;
    staffPaymentType: PaymentTypes;
    paymentAmount: MoneyObject;
    deduction: MoneyObject;
    note: string;
    payTax: string;
    paymentPeriod: string;
    paymentAccountKey: string;
    transactionDate: string;
}

export interface ExistingStaffPaymentAndCommission {
    staffPaymentKey: string;
    staffPaymentType: PaymentTypes;
    paymentAmount: MoneyObject;
    deduction: MoneyObject;
    note: string;
    payTax: string;
    paymentPeriod: string;
    paymentAccountKey: string;
    transactionDate: string;
    netPay: MoneyObject;
}

export enum StaffPaymentRecordState {
    createStaffWithPayment = 'NEW',
    addPaymentForExistingStaff = 'EXISTING',
    editPaymentDraft = 'EDIT',
}

export const defaultStaffPaymentState: StaffPaymentRequest = {
    paymentType: PaymentTypes.SALARY,
    payTax: 'No',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    paymentPeriod: '',
    paymentAmount: { amount: 0, currencyKey: 0 },
    deduction: { amount: 0, currencyKey: 0 },
    staffPaymentKey: '',
    note: '',
    paymentAccountKey: '',
    transactionDate: '',
};

export const defaultPayAndCommissionRequest: PayAndCommissionRequest = {
    paymentType: PaymentTypes.SALARY,
    payTax: 'No',
    fullname: '',
    phoneNumber: '',
    paymentPeriod: '',
    paymentAmount: { amount: 0, currencyKey: 566 },
    deduction: { amount: 0, currencyKey: 566 },
    staffPaymentKey: '',
    note: '',
    paymentAccountKey: '',
    transactionDate: '',
    netPay: { amount: 0, currencyKey: 566 },
};

export enum PaymentTypeOption {
    SALARY = 'Salary',
    COMMISSION = 'Commission',
}
