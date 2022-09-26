// import { MoneyObject } from '@/types';
// import { TransactionStatsCard } from '@/types';

import { Status } from '@/types';

export interface EmployeeBioData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    stateOfResidence: string;
    maritalStatus: string;
    nextOfKin: string;
    nextOfKinRelationship: string;
    nextOfKinPhoneNumber: string;
    nextOfKinAddress: string;
    notes: string;
}

export interface PaymentStructure {
    name: string;
    amount: number;
}

export interface AllowanceData {
    name: string;
    amount: number;
    query: string;
}

export const defaultEmployeeBioData: EmployeeBioData = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    stateOfResidence: '',
    maritalStatus: '',
    nextOfKin: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: '',
    nextOfKinPhoneNumber: '',
    notes: '',
};
export interface GuarantorData {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    note: string;
    file: any;
}

export interface PayStructureAndSalaryNegotiation {
    name: string;
    id: number;
}

export const defaultGuarantorData: GuarantorData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    note: '',
    file: '',
};
export interface EmployeeSalary {
    paymentStructure: string;
    salaryNegotiationPattern: string;
    salary: string;
}

export const defaultEmployeeSalary: EmployeeSalary = {
    paymentStructure: '',
    salaryNegotiationPattern: '',
    salary: '',
};

export interface PayrollRequestStatus {
    getStates: string;
    calculateTaxAmountForPayment: Status;
    calculatePensionAmountForPayment: Status;
}

export interface TaxAmount {
    taxType: string;
    paymentAmount: number;
}

export enum PaymentTypes {
    SALARY = 'salary',
    COMMISSION = 'commission',
}

export enum TaxTypes {
    PAYE = 'Paye',
    WITHOLDING = 'INCLUSIVE',
}
