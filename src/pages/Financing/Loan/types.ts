import { MoneyObject } from '@/types';
export interface Loan {
    loanKey: string;
    lenderName: string;
    totalPrincipal: MoneyObject;
    paymentAccountKey: string;
    totalInterest: MoneyObject;
    loanDate: string;
    firstRepaymentDate: string;
    tenor: number;
}

export const defaultLoan: Loan = {
    loanKey: '',
    lenderName: '',
    totalPrincipal: { currencyKey: 0, amount: 0 },
    paymentAccountKey: '',
    totalInterest: { currencyKey: 0, amount: 0 },
    loanDate: '',
    firstRepaymentDate: '',
    tenor: 1,
};

export interface LoanDetails {
    loanKey: string;
    lenderName: string;
    totalPrincipal: MoneyObject;
    totalInterest: MoneyObject;
    nextRepaymentDate: string;
}
export interface PaymentSchedule {
    transactionDate: string;
    principalPortion: MoneyObject;
    interestPortion: MoneyObject;
}

export interface LoanRepaymentHistory {
    paymentDate: string;
    amountPaid: MoneyObject;
    paidFrom: string;
}

export const defaultLoanRepaymentHistory: LoanRepaymentHistory = {
    paymentDate: '',
    amountPaid: { currencyKey: 0, amount: 0 },
    paidFrom: '',
};

export interface LoanCardDetails {
    lender: string;
    principal: MoneyObject;
    interest: MoneyObject;
    loanDate: string;
    amountOutstanding: MoneyObject;
    nextRepaymentDate: string;
}

export const defaultLoanCardDetails: LoanCardDetails = {
    lender: '',
    principal: { currencyKey: 0, amount: 0 },
    interest: { currencyKey: 0, amount: 0 },
    loanDate: '',
    amountOutstanding: { currencyKey: 0, amount: 0 },
    nextRepaymentDate: '',
};

export interface LoanRepayment {
    loanKey: string;
    paymentDate: string;
    amountPaid: MoneyObject;
    paymentAccountKey: string;
}

export const defaultLoanRepayment: LoanRepayment = {
    loanKey: '',
    paymentDate: '',
    amountPaid: { currencyKey: 0, amount: 0 },
    paymentAccountKey: '',
};
