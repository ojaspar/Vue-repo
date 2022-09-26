import { Component, Mixins } from 'vue-property-decorator';

import UtilityMixin from '@/mixins/Utility';

import { isEmpty, isValidNumberInput, formHasError } from '@/utils/formValidator';
import { Loan, LoanRepayment } from '@/pages/Financing/Loan/types';

const loanFormError = {
    lender: '',
    principal: '',
    paymentAccount: '',
    interest: '',
    transactionDate: '',
    repaymentDate: '',
    tenor: '',
};

const loanRepaymentError = {
    paymentDate: '',
    amountPaid: '',
    paymentAccount: '',
};

@Component
export default class LoanMixin extends Mixins(UtilityMixin) {
    public generalFormError = '';

    public loanFormError = { ...loanFormError };

    public setGeneralError(errorMessage: string) {
        this.generalFormError = errorMessage;
    }

    private clearGeneralError() {
        this.generalFormError = '';
    }

    //Loan Form Validation

    public validateLoanLender(lender: string) {
        if (isEmpty(lender)) {
            this.loanFormError['lender'] = 'This is required';
            this.setGeneralError(`Please provide lender's name`);
            return;
        }
        if (lender.length > 50) {
            this.loanFormError['lender'] = 'Maximum characters exceeded';
            this.setGeneralError(`Lender's name should be between 1-50 characters`);
            return;
        }
        this.loanFormError['lender'] = '';
        this.clearGeneralError();
        return;
    }

    public validatePrincipalAmount(principal: string): boolean {
        if (isEmpty(principal)) {
            this.loanFormError['principal'] = 'This is required';
            this.setGeneralError(`Please provide loan principal amount`);
            return false;
        }
        if (!isValidNumberInput(principal)) {
            this.loanFormError['principal'] = 'Invalid amount';
            this.setGeneralError(`Please provide loan principal amount in figures`);
            return false;
        }

        const principalAmount = this.convertFormattedFiguresToNumber(principal);
        if (principalAmount < 1) {
            this.loanFormError['principal'] = 'Invalid amount';
            this.setGeneralError(`Please provide loan principal amount in figures`);
            return false;
        }

        this.loanFormError['principal'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateInterestAmount(interest: string): boolean {
        if (isEmpty(interest)) {
            this.loanFormError['interest'] = 'This is required';
            this.setGeneralError(`Please provide loan interest amount`);
            return false;
        }
        if (!isValidNumberInput(interest)) {
            this.loanFormError['interest'] = 'Invalid amount';
            this.setGeneralError(`Please provide loan interest amount in figures`);
            return false;
        }

        const interestAmount = this.convertFormattedFiguresToNumber(interest);
        if (interestAmount < 1) {
            this.loanFormError['interest'] = 'Invalid amount';
            this.setGeneralError(`Please provide loan interest amount in figures`);
            return false;
        }

        this.loanFormError['interest'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateLoanPaymentAccount(PaymentAccount: string) {
        if (isEmpty(PaymentAccount)) {
            this.loanFormError['paymentAccount'] = 'This is required';
            this.setGeneralError(`Please select loan recipient account`);
            return;
        }
        this.loanFormError['paymentAccount'] = '';
        this.clearGeneralError();
        return;
    }

    public validateLoanTransactionDate(transactionDate: string, firstRepaymentDate: string) {
        if (isEmpty(transactionDate)) {
            this.loanFormError['transactionDate'] = 'This is required';
            this.setGeneralError(`Please provide the date this loan was received`);
            return;
        }
        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.loanFormError['transactionDate'] = 'Invalid date';
            this.setGeneralError(`Please provide a date not later than today`);
            return;
        }
        if (!isEmpty(firstRepaymentDate)) {
            this.validateLoanRepaymentDate(firstRepaymentDate, transactionDate);
            return;
        }
        this.loanFormError['transactionDate'] = '';
        this.clearGeneralError();
        return;
    }

    //used to validate repaymentDates in both add-loan-form and loan-repayment-form
    public validateLoanRepaymentDate(repaymentDate: string, transactionDate: string, formName = 'loanForm') {
        let inputFieldError,
            generalError = '';

        if (isEmpty(repaymentDate)) {
            inputFieldError = 'This is required';
            generalError =
                formName == 'loanForm'
                    ? 'Please provide first repayment date for this loan'
                    : 'Please provide repayment date';
            this.setFormDateError(formName, inputFieldError, generalError);
            return;
        }
        if (new Date(repaymentDate) < new Date(transactionDate)) {
            inputFieldError = 'Invalid date';
            generalError =
                formName == 'loanForm'
                    ? 'First repayment date can not be before the loan date'
                    : 'Payment date can not be before the loan date';
            this.setFormDateError(formName, inputFieldError, generalError);
            return;
        }

        if (formName == 'repaymentForm' && !this.isDateOnOrBeforeToday(repaymentDate)) {
            inputFieldError = 'Invalid date';
            generalError = 'Please provide a date not later than today';
            this.setFormDateError(formName, inputFieldError, generalError);
        }

        this.clearFormDateError();
        this.clearGeneralError();
        return;
    }

    private setFormDateError(formName: string, inputFieldError: string, generalError: string) {
        if (formName == 'loanForm') {
            this.$nextTick(() => {
                this.loanFormError['repaymentDate'] = inputFieldError;
                this.setGeneralError(generalError);
            });
            return;
        }

        if (formName == 'repaymentForm') {
            this.$nextTick(() => {
                this.loanRepaymentError['paymentDate'] = inputFieldError;
                this.setGeneralError(generalError);
            });
            return;
        }
    }

    private clearFormDateError() {
        this.loanFormError['transactionDate'] = '';
        this.loanFormError['repaymentDate'] = '';
        this.loanRepaymentError['paymentDate'] = '';
    }

    public validateLoanTenor(tenor: string) {
        if (isEmpty(tenor)) {
            this.loanFormError['tenor'] = 'Invalid tenor';
            this.setGeneralError(`Please provide loan tenor in figures`);
            return false;
        }
        if (Number(tenor) < 0) {
            this.loanFormError['tenor'] = 'Invalid tenor';
            return false;
        }
        this.loanFormError['tenor'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateLoanForm(loanForm: Loan) {
        const {
            lenderName,
            totalPrincipal,
            paymentAccountKey,
            totalInterest,
            loanDate,
            firstRepaymentDate,
            tenor,
        } = loanForm;
        this.validateLoanLender(lenderName);
        this.validatePrincipalAmount(totalPrincipal.amount.toString());
        this.validateLoanPaymentAccount(paymentAccountKey);
        this.validateInterestAmount(totalInterest.amount.toString());
        this.validateLoanTransactionDate(loanDate, firstRepaymentDate);
        this.validateLoanRepaymentDate(firstRepaymentDate, loanDate);
        this.validateLoanTenor(tenor.toString());
    }

    public get loanFormIsValidated(): boolean {
        return !formHasError(this.loanFormError);
    }

    //Loan Repayment Form Validation
    public loanRepaymentError = { ...loanRepaymentError };

    public validateLoanRepaymentAmount(amountPaid: string): boolean {
        if (isEmpty(amountPaid)) {
            this.loanRepaymentError['amountPaid'] = 'This is required';
            this.setGeneralError(`Please the amount paid`);
            return false;
        }
        if (!isValidNumberInput(amountPaid)) {
            this.loanRepaymentError['amountPaid'] = 'Invalid amount';
            this.setGeneralError(`Please provide amount paid in figures`);
            return false;
        }

        const principalAmount = this.convertFormattedFiguresToNumber(amountPaid);
        if (principalAmount < 1) {
            this.loanRepaymentError['amountPaid'] = 'Invalid amount';
            this.setGeneralError(`Please provide amount paid in figures`);
            return false;
        }

        this.loanRepaymentError['amountPaid'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateLoanRepaymentAccount(PaymentAccount: string) {
        if (isEmpty(PaymentAccount)) {
            this.loanRepaymentError['paymentAccount'] = 'This is required';
            this.setGeneralError(`Please select the payment account`);
            return;
        }
        this.loanRepaymentError['paymentAccount'] = '';
        this.clearGeneralError();
        return;
    }

    public validateLoanRepaymentForm(loanRepaymentForm: LoanRepayment) {
        const { paymentDate, amountPaid, paymentAccountKey } = loanRepaymentForm;
        this.validateLoanRepaymentDate(paymentDate, '', 'repaymentForm');
        this.validateLoanRepaymentAmount(String(amountPaid.amount));
        this.validateLoanRepaymentAccount(paymentAccountKey);
    }

    public get loanRepaymentFormIsValidated(): boolean {
        return !formHasError(this.loanRepaymentError);
    }
}
