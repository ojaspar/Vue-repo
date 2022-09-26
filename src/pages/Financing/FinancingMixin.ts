import { Component, Mixins } from 'vue-property-decorator';

import { InputValidation } from '@/types';
import { isEmail, isEmpty, isPhoneNumber, resetFormFields } from '@/utils/formValidator';
import { AddCapitalForm, AddShareholderForm, FormOfCapitalOptions } from '@/pages/Financing/Capital/types';

import UtilityMixins from '@/mixins/Utility';

const shareholderForm: InputValidation = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
};

const addCapitalForm: InputValidation = {
    paymentAccountKey: '',
    itemTypeKey: '',
    description: '',
    quantity: '',
    transactionDate: '',
    formOfCapitalKey: '',
    shareHolderKey: '',
};

@Component
export default class FinancingMixin extends Mixins(UtilityMixins) {
    public shareholderFormError = { ...shareholderForm };
    public addCapitalFormError = { ...addCapitalForm };

    get shareholderFormIsValidated(): boolean {
        return !this.formHasError(this.shareholderFormError);
    }

    get addCapitalFormIsValidated(): boolean {
        return !this.formHasError(this.addCapitalFormError);
    }
    // General Validation functions
    public validateNameField(name: string, error: InputValidation) {
        if (isEmpty(name)) {
            error['name'] = 'Please provide a name';
            return;
        }

        if (name.length > 100) {
            error['name'] = 'Please keep this between 1-25 characters';
            return;
        }

        error['name'] = '';
        return;
    }

    public validateRequiredAmountField(amount: number, error: InputValidation, field: string) {
        if (isNaN(amount) || !amount) {
            error[field] = 'This is a required field';
            return;
        }

        if (amount <= 0) {
            error[field] = 'This must be greater than 0';
            return;
        }

        error[field] = '';
    }

    public validateOptionalAmountField(amount: number, error: InputValidation, field: string) {
        if (isNaN(amount) || amount < 0) {
            error[field] = 'Please provide a valid number';
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

    public validateFreeTextField(field: string | number, value: string, error: InputValidation) {
        if (value.toString().length > 200) {
            error[field] = 'A maximum of 200 characters is allowed';
            return;
        }

        error[field] = '';
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public resetFormFields(form: object) {
        resetFormFields(form);
    }

    // Shareholder section
    public validateShareholderName(name: string) {
        this.validateNameField(name, this.shareholderFormError);
    }

    public validateShareholderPhoneNumber(phoneNumber: string) {
        if (isEmpty(phoneNumber)) {
            this.shareholderFormError['phoneNumber'] = 'Please provide a phone number';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.shareholderFormError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }

        this.shareholderFormError['phoneNumber'] = '';
        return;
    }

    public validateShareholderEmail(email: string) {
        if (isEmpty(email)) {
            this.shareholderFormError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.shareholderFormError['email'] = 'Please provide a valid email address';
            return;
        }

        this.shareholderFormError['email'] = '';
        return;
    }

    public validateShareholderForm(shareholderForm: AddShareholderForm) {
        const { name, emailAddress, phoneNumber } = shareholderForm;

        this.validateShareholderName(name);
        this.validateShareholderPhoneNumber(phoneNumber);
        this.validateShareholderEmail(emailAddress);
    }

    public validateCapitalDescriptionField(description: string) {
        this.validateIfRequiredStringFieldIsEmpty('description', description, this.addCapitalFormError);

        if (isEmpty(this.addCapitalFormError.description))
            this.validateFreeTextField('description', description, this.addCapitalFormError);
    }

    public validateTransactionDateField(transactionDate: string) {
        this.validateIfRequiredStringFieldIsEmpty('transactionDate', transactionDate, this.addCapitalFormError);

        if (!isEmpty(this.addCapitalFormError.transactionDate)) return;

        if (this.isDateAfterToday(transactionDate)) {
            this.addCapitalFormError.transactionDate = `The maximum you can pick here is today's date`;
            return;
        }

        this.addCapitalFormError.transactionDate = '';
    }

    public validatePaymentAccountField(paymentAccountKey: string) {
        this.validateIfRequiredStringFieldIsEmpty('paymentAccountKey', paymentAccountKey, this.addCapitalFormError);
    }

    public validateShareholderKeyField(shareHolderKey: string) {
        this.validateIfRequiredStringFieldIsEmpty('shareHolderKey', shareHolderKey, this.addCapitalFormError);
    }

    public validateItemQuantityField(quantity: string | number) {
        this.validateRequiredAmountField(Number(quantity), this.addCapitalFormError, 'quantity');
    }

    public validateAddCapitalForm(addCapitalForm: AddCapitalForm, formOfCapital: string) {
        const {
            itemTypeKey,
            itemDescription,
            serviceDescription,
            itemValue,
            serviceValue,
            contributionValue,
            paymentAccountKey = '',
            transactionDate,
            shareHolderKey,
            quantity = '',
        } = addCapitalForm;

        this.validateShareholderKeyField(shareHolderKey);

        if (formOfCapital === FormOfCapitalOptions.ITEM) {
            this.validateCapitalDescriptionField(itemDescription);
            this.validateRequiredAmountField(itemValue.amount, this.addCapitalFormError, 'amount');
            this.validateIfRequiredStringFieldIsEmpty('itemTypeKey', itemTypeKey || '', this.addCapitalFormError);
            this.validateItemQuantityField(quantity);
        }
        if (formOfCapital === FormOfCapitalOptions.SERVICE) {
            this.validateCapitalDescriptionField(serviceDescription);
            this.validateRequiredAmountField(serviceValue.amount, this.addCapitalFormError, 'amount');
        }

        if (formOfCapital === FormOfCapitalOptions.FINANCIAL) {
            this.validateRequiredAmountField(contributionValue.amount, this.addCapitalFormError, 'amount');
            this.validatePaymentAccountField(paymentAccountKey);
        }

        this.validateTransactionDateField(transactionDate);
    }
}
