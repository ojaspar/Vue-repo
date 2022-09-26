import { MoneyObject } from '@/types';

export interface FinanceLoan {
    lender: string;
    principal: string;
    installment: string;
    dueDate: string;
}

export interface FinanceShareholder {
    shareHolderKey: string;
    shareHoldername: string;
    totalAmount: MoneyObject;
}

export interface FinanceDasbhboardCard {
    totalOutstandingLoan: MoneyObject;
    totalCapitalAmount: MoneyObject;
    nextRepaymentAmount: MoneyObject;
    nextRepaymentDate: string;
    shareholderCount: number;
}

export const defaultDashboardCard: FinanceDasbhboardCard = {
    totalOutstandingLoan: { currencyKey: 0, amount: 0 },
    totalCapitalAmount: { currencyKey: 0, amount: 0 },
    nextRepaymentAmount: { currencyKey: 0, amount: 0 },
    nextRepaymentDate: '',
    shareholderCount: 0,
};
