import { Component, Mixins } from 'vue-property-decorator';

import { InputValidation } from '@/types';
import {
    Donation,
    DonationScheme,
    DonationSchemeType,
    Donor,
    FormOfDonation,
    RedemptionTypeOption,
} from '@/pages/Donations/types';
import { isEmpty, isEmail, isPhoneNumber, resetFormFields } from '@/utils/formValidator';

import UtilityMixin from '@/mixins/Utility';

const donorForm: InputValidation = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
};

const donationSchemeForm: InputValidation = {
    donationSchemeKey: '',
    name: '',
    description: '',
    lastDonationDate: '',
    financialTarget: '',
    type: '',
    targetDate: '',
};

const addDonationForm: InputValidation = {
    donationForm: '',
    redemptionType: '',
    amount: '',
    paymentAccountKey: '',
    pledgeDueDate: '',
    itemType: '',
    description: '',
    donationItemTypeKey: '',
    transactionDate: '',
    quantity: '',
};

const pledgeRedemptionForm: InputValidation = {
    amountToBeRedeemed: '',
    pledgeDueDate: '',
    quantityRedeemed: '',
    paymentAccountKey: '',
};

@Component
export default class DonationMixin extends Mixins(UtilityMixin) {
    //add donor form validation
    public donorFormError = { ...donorForm };
    public donationSchemeFormError = { ...donationSchemeForm };
    public addDonationFormError = { ...addDonationForm };
    public pledgeRedemptionFormError = { ...pledgeRedemptionForm };

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

    public validateFreeTextField(field: string | number, value: string, error: InputValidation, maxLength = 200) {
        if (value.toString().length > maxLength) {
            error[field] = `A maximum of ${maxLength} characters is allowed`;
            return;
        }

        error[field] = '';
    }

    public validateDonationDate(field: string, dateValue: string, error: InputValidation) {
        if (isEmpty(dateValue)) {
            error[field] = 'This is a required field';
            return;
        }

        // date must be equal to or greater than today
        const dateIsTodayOrLater = this.isDateOnOrAfterToday(dateValue);

        if (!dateIsTodayOrLater) {
            error[field] = `This cannot not be less than today's date`;
            return;
        }

        error[field] = '';
        return;
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public resetFormFields(form: object) {
        resetFormFields(form);
    }

    // Donor section
    public validateDonorName(name: string) {
        this.validateNameField(name, this.donorFormError);
    }

    public validateDonorPhoneNumber(phoneNumber: string) {
        if (isEmpty(phoneNumber)) {
            this.donorFormError['phoneNumber'] = 'Please provide a phone number';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.donorFormError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }

        this.donorFormError['phoneNumber'] = '';
        return;
    }

    public validateDonorEmail(email: string) {
        if (isEmpty(email)) {
            this.donorFormError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.donorFormError['email'] = 'Please provide a valid email address';
            return;
        }

        this.donorFormError['email'] = '';
        return;
    }

    public validateDonorForm(donorForm: Donor) {
        const { fullName, emailAddress, phoneNumber } = donorForm;

        this.validateDonorName(fullName);
        this.validateDonorPhoneNumber(phoneNumber);
        this.validateDonorEmail(emailAddress);
    }

    get donorFormIsValidated(): boolean {
        return !this.formHasError(this.donorFormError);
    }

    // Donation Scheme section
    get donationSchemeFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.donationSchemeFormError);
    }

    public validateDonationSchemeName(name: string) {
        this.validateNameField(name, this.donationSchemeFormError);
    }

    public validateDonationSchemeFinancialTarget(amount: number) {
        this.validateRequiredAmountField(amount, this.donationSchemeFormError, 'financialTarget');
    }

    public validateDonationTargetDate(targetDate: string) {
        this.validateDonationDate('targetDate', targetDate, this.donationSchemeFormError);
    }

    public validateDonationSchemeType(donationSchemeType: string) {
        this.validateIfRequiredStringFieldIsEmpty('type', donationSchemeType.toString(), this.donationSchemeFormError);
        return;
    }

    public validateDonationSchemeDescription(donationSchemeDescription: string) {
        this.validateFreeTextField('description', donationSchemeDescription, this.donationSchemeFormError);
        return;
    }

    public validateDonationSchemeForm(donationSchemeForm: DonationScheme) {
        const { name, financialTarget, targetDate, type, description } = donationSchemeForm;

        this.validateDonationSchemeName(name);

        if (type === DonationSchemeType.PROJECT_SPECIFIC) {
            this.validateDonationSchemeFinancialTarget(financialTarget.amount);
            this.validateDonationTargetDate(targetDate);
        }

        this.validateDonationSchemeType(type);
        this.validateDonationSchemeDescription(description);
    }

    // Add Donation Form

    public isNonNegativeNumber(value: string | number) {
        if (value) {
            return Number(value) >= 0;
        }

        return false;
    }

    public isValidAmount(amountInput: string): boolean {
        if (!amountInput) {
            this.addDonationFormError['amount'] = '';
            return true;
        }

        const amountPaidNum = this.convertFormattedFiguresToNumber(amountInput);

        if (!this.isNonNegativeNumber(amountPaidNum)) {
            this.addDonationFormError['amount'] = 'Invalid';
            return false;
        }

        this.addDonationFormError['amount'] = '';
        return true;
    }

    public get addDonationFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addDonationFormError);
    }

    public validateDonationAmountForFinancialDonation(amount: number) {
        this.validateRequiredAmountField(amount, this.addDonationFormError, 'amount');
    }

    public validateDonationAmountForOtherDonations(amount: number) {
        this.validateOptionalAmountField(amount, this.addDonationFormError, 'amount');
    }

    public validateDonationDescription(description: string, donationForm: FormOfDonation) {
        if (description) {
            this.validateFreeTextField('description', description, this.addDonationFormError);
            return;
        }

        if (donationForm !== FormOfDonation.FINANCIAL) {
            this.validateIfRequiredStringFieldIsEmpty('description', description, this.addDonationFormError);
        }
    }

    public validateDonationItemTypeKey(donationItemTypeKey: string) {
        if (isEmpty(donationItemTypeKey)) {
            this.addDonationFormError['donationItemTypeKey'] = 'Please, select an item from the list';

            return;
        }

        this.addDonationFormError['donationItemTypeKey'] = '';
    }

    public validatePledgeDueDate(pledgeDueDate: string) {
        this.validateDonationDate('pledgeDueDate', pledgeDueDate, this.addDonationFormError);
    }

    public validateTransactionDate(transactionDate: string) {
        if (isEmpty(transactionDate)) {
            this.addDonationFormError['transactionDate'] = 'This is a required field';
            return;
        }

        this.addDonationFormError['transactionDate'] = '';
    }

    public conditionsForInvalidQuantityInput(quantity: number) {
        return (
            !this.isWholeNumber(quantity.toString()) ||
            !this.isNonNegativeNumber(quantity) ||
            !this.isValueNonZero(quantity)
        );
    }

    public isWholeNumber(value: string) {
        return Number(value) === parseInt(value, 10);
    }

    public isValueNonZero(value: string | number) {
        return Number(value) > 0;
    }

    public validateQuantity(quantity: string): boolean {
        const qtyNum = this.convertFormattedFiguresToNumber(quantity);

        if (this.conditionsForInvalidQuantityInput(qtyNum)) {
            this.addDonationFormError['quantity'] = 'Invalid';
            return false;
        }

        this.addDonationFormError['quantity'] = '';
        return true;
    }

    public validateAddDonationForm(addDonationForm: Donation) {
        const {
            donationForm,
            amount,
            description,
            donationItemTypeKey,
            paymentAccountKey,
            donationSchemeKey,
            redemptionType,
            pledgeDueDate,
            transactionDate,
            quantity,
        } = addDonationForm;

        this.validateIfRequiredStringFieldIsEmpty('donationSchemeKey', donationSchemeKey, this.addDonationFormError);

        if (donationForm === FormOfDonation.FINANCIAL) {
            this.validateDonationAmountForFinancialDonation(amount.amount);

            if (redemptionType == RedemptionTypeOption.INSTANT) {
                this.validateIfRequiredStringFieldIsEmpty(
                    'paymentAccountKey',
                    paymentAccountKey || '',
                    this.addDonationFormError,
                );
            }
        } else {
            this.validateDonationAmountForOtherDonations(amount.amount);
        }

        if (donationForm === FormOfDonation.ITEM) {
            this.validateDonationItemTypeKey(donationItemTypeKey);
            this.validateQuantity(quantity || '');
        }

        if (redemptionType === RedemptionTypeOption.PLEDGE) {
            this.validatePledgeDueDate(pledgeDueDate || '');
        }

        this.validateDonationDescription(description || '', donationForm);
        this.validateTransactionDate(transactionDate);
    }

    // pledge redemption

    public validateQuantityRedeemed(quantityRedeemed: number, quantityPledged: number) {
        if (quantityRedeemed === 0) {
            this.pledgeRedemptionFormError.quantityRedeemed = `Please provide a valid quantity`;
            return false;
        }

        if (quantityRedeemed > quantityPledged) {
            this.pledgeRedemptionFormError.quantityRedeemed = `This cannot be greater than ${quantityPledged}`;
            return false;
        }

        this.pledgeRedemptionFormError.quantityRedeemed = '';
        return true;
    }

    public hasError(field: string): boolean {
        if (field && field.trim().length > 0) {
            return true;
        }
        return false;
    }
}
