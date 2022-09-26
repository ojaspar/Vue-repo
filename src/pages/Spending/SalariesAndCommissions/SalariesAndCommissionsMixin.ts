/*eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins } from 'vue-property-decorator';

import ValidationMixin from '@/mixins/validation';
import UtilityMixin from '@/mixins/Utility';

import { isEmpty, isPhoneNumber, isValidName } from '@/utils/formValidator';

import { InputValidation } from '@/types';
import { PayAndCommissionRequest, StaffPaymentRequest } from '@/pages/Spending/SalariesAndCommissions/types';

const paymentAndCommission: InputValidation = {
    paymentType: '',
    payTax: '',
    fullname: '',
    phoneNumber: '',
    paymentPeriod: '',
    paymentAmount: '',
    deduction: '',
    note: '',
    paymentAccount: '',
    transactionDate: '',
};

@Component
export default class SalariesAndCommissionsMixin extends Mixins(ValidationMixin, UtilityMixin) {
    public paymentAndCommisionError = { ...paymentAndCommission };

    get addStaffPaymentFormHasError(): boolean {
        return this.formHasError(this.paymentAndCommisionError);
    }

    get paymentAndCommissionFormHasError(): boolean {
        return this.formHasError(this.paymentAndCommisionError);
    }

    public validateStaffFirstName(firstName: string): void {
        if (isEmpty(firstName)) {
            this.paymentAndCommisionError['firstName'] = 'This field is required';
            return;
        }

        if (firstName.length > 20) {
            this.paymentAndCommisionError['firstName'] = 'The maximum number of characters is 20';
            return;
        }

        this.paymentAndCommisionError['firstName'] = '';
        return;
    }

    validatesStaffFullName = (fullName: string) => {
        if (isEmpty(fullName.trim())) {
            this.paymentAndCommisionError['fullname'] = 'Full Name is required';
            return this.paymentAndCommisionError['fullname'];
        }
        if (!isValidName(fullName.trim())) {
            this.paymentAndCommisionError['fullname'] = 'Please provide a valid name';
            return this.paymentAndCommisionError['fullname'];
        }
        if (fullName.trim().split(' ').length > 2) {
            this.paymentAndCommisionError['fullname'] = 'maximum of 2 names allowed';
            return this.paymentAndCommisionError['fullname'];
        }
        if (fullName.trim().split(' ').length < 2) {
            this.paymentAndCommisionError['fullname'] = 'maximum of 2 names needed';
            return this.paymentAndCommisionError['fullname'];
        }
        this.paymentAndCommisionError['fullname'] = '';
        return this.paymentAndCommisionError['fullname'];
    };

    public validateStaffLastName(lastName: string): void {
        if (isEmpty(lastName)) {
            this.paymentAndCommisionError['lastName'] = 'This field is required';
            return;
        }

        if (lastName.length > 20) {
            this.paymentAndCommisionError['lastName'] = 'The maximum number of characters is 20';
            return;
        }

        this.paymentAndCommisionError['lastName'] = '';
        return;
    }

    public validateStaffPhoneNumber(phoneNumber: string): void {
        if (isEmpty(phoneNumber)) {
            this.paymentAndCommisionError['phoneNumber'] = 'This field is required';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.paymentAndCommisionError['phoneNumber'] = 'Please enter a valid phone number';
            return;
        }

        this.paymentAndCommisionError['phoneNumber'] = '';
    }

    public validatePaymentAmount(paymentAmount: number): void {
        if (isEmpty(paymentAmount.toString())) {
            this.paymentAndCommisionError['paymentAmount'] = 'This field is required';
            return;
        }
        if (Number(paymentAmount) < 1) {
            this.paymentAndCommisionError['paymentAmount'] = 'Invalid';
            return;
        }

        this.paymentAndCommisionError['paymentAmount'] = '';
    }

    public validateStaffDeduction(deduction: number, amountPaid: number): void {
        this.paymentAndCommisionError['deduction'] = '';
        if (Number(deduction) > Number(amountPaid) || Number(deduction) === Number(amountPaid)) {
            this.paymentAndCommisionError['deduction'] = 'deduction should be lesser than amount';
            return;
        }

        this.paymentAndCommisionError['deduction'] = '';
        return;
    }

    public validateStaffNotes(notes: string): void {
        this.paymentAndCommisionError['notes'] = '';
        if (isEmpty(notes)) return;

        if (notes.length > 200) {
            this.paymentAndCommisionError['notes'] = 'Please keep this at 200 characters or less';
            return;
        }
        return;
    }
    // public validateEmptyInput

    public validateTransactionDate(transactionDate: string): void {
        if (isEmpty(transactionDate)) {
            this.paymentAndCommisionError['transactionDate'] = 'Please select a date';
            return;
        }

        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.paymentAndCommisionError['transactionDate'] = 'Date must be on or before today';
            return;
        }

        this.paymentAndCommisionError['transactionDate'] = '';
        return;
    }

    public setSalaryCommissionError(field: string, value: string) {
        this.paymentAndCommisionError[field] = value;
    }

    public validateInput(input: string, field: string) {
        if (isEmpty(input)) {
            this.paymentAndCommisionError[field] = 'This field is required';
            return;
        }
        this.paymentAndCommisionError[field] = '';
        return;
    }

    public validatePayAndCommission(paymentAndCommisionErrorForm: PayAndCommissionRequest) {
        const {
            fullname,
            paymentType,
            transactionDate,
            deduction,
            phoneNumber,
            paymentAmount,
            paymentPeriod,
        } = paymentAndCommisionErrorForm;
        this.validatesStaffFullName(fullname);
        this.validateStaffPhoneNumber(phoneNumber);
        this.validatePaymentAmount(paymentAmount.amount);
        this.validateStaffDeduction(deduction.amount, paymentAmount.amount);
        this.validateTransactionDate(transactionDate);
        this.validateInput(paymentPeriod, 'paymentPeriod');
        this.validateInput(paymentType, 'paymentType');
    }

    public validateAllStaffPaymentFields(paymentAndCommisionErrorForm: StaffPaymentRequest): void {
        const {
            firstName,
            lastName,
            phoneNumber,
            paymentAmount,
            deduction,
            note,
            transactionDate,
        } = paymentAndCommisionErrorForm;

        this.validateStaffFirstName(firstName);
        this.validateStaffLastName(lastName);
        this.validateStaffPhoneNumber(phoneNumber);
        this.validatePaymentAmount(paymentAmount.amount);
        this.validateStaffDeduction(deduction.amount, paymentAmount.amount);
        this.validateStaffNotes(note);
        this.validateTransactionDate(transactionDate);
    }
}
