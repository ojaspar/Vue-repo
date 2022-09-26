import { Component, Mixins } from 'vue-property-decorator';

import UtilityMixin from '@/mixins/Utility';

import { hasError, isEmpty } from '@/utils/formValidator';

import { InputValidation } from '@/types';
import { AddSalesPayment } from '@/pages/Sales/ManageSales/types';

const updatePaymentForm: InputValidation = {
    amountPaid: '',
    paymentAccountKey: '',
    dateReceived: '',
};

@Component
export default class SalesValidationMixin extends Mixins(UtilityMixin) {
    public updatePaymentFormError = { ...updatePaymentForm };

    get updatePaymentFormIsValidated(): boolean {
        return !this.formHasError(this.updatePaymentFormError);
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public validateRequiredAmountField(amount: number, error: InputValidation, field: string) {
        if (isNaN(amount)) {
            error[field] = 'Please enter a valid amount';
            return;
        }

        if (amount <= 0) {
            error[field] = 'This must be greater than 0';
            return;
        }

        error[field] = '';
    }

    public validateIfRequiredStringFieldIsEmpty(field: string, value: string, error: InputValidation) {
        if (isEmpty(value)) {
            error[field] = 'This is a required field';
            return;
        }

        error[field] = '';
        return;
    }

    public validateAmountPaid(amountPaid: number, balance: number) {
        this.validateRequiredAmountField(amountPaid, this.updatePaymentFormError, 'amountPaid');

        if (hasError(this.updatePaymentFormError.amountPaid)) return;

        if (amountPaid > balance) {
            this.updatePaymentFormError['amountPaid'] = `Amount cannot be greater than ${Number(
                balance,
            ).toLocaleString()}`;
            return;
        }

        this.updatePaymentFormError['amountPaid'] = '';
    }

    public validatePaymentAccountKey(paymentAccountKey: string) {
        this.validateIfRequiredStringFieldIsEmpty('paymentAccountKey', paymentAccountKey, this.updatePaymentFormError);
    }

    public validateDateReceived(dateReceived: string) {
        this.validateIfRequiredStringFieldIsEmpty('dateReceived', dateReceived, this.updatePaymentFormError);
    }

    public validateUpdatePaymentForm(
        { amountPaid, dateReceived, paymentAccountKey }: AddSalesPayment,
        balance: number,
    ) {
        this.validateAmountPaid(amountPaid.amount, balance);
        this.validatePaymentAccountKey(paymentAccountKey);
        this.validateDateReceived(dateReceived);
    }
}
