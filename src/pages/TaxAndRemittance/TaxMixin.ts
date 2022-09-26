import { Component, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import { InputValidation, UploadedFile } from '@/types';
import { isEmpty, isEmail, isPhoneNumber } from '@/utils/formValidator';

import UtilityMixin from '@/mixins/Utility';
import {
    TaxContactDetails,
    TaxLiability,
    TaxLiabilityTransaction,
    TaxProfileRegistrationForm,
    TaxRequestStatus,
    TaxType,
} from '@/pages/TaxAndRemittance/types';

import TaxModule from '@/store/modules/tax';
import GeneralModule from '@/store/modules/general';
import ExpenseModule from '@/store/modules/expense';

const taxContactBioForm: TaxContactDetails = {
    phoneNumber: '',
    email: '',
    operatingAddress: '',
};

const taxProfileRegistrationForm: TaxProfileRegistrationForm = {
    cacForm101: '',
    cacForm102: '',
    cacForm103: '',
    taxIdentity: '',
    taxProfileType: '',
    taxStationKey: '',
    taxStationStateKey: '',
};

const tax = namespace('tax');
const general = namespace('general');
let taxModule: TaxModule;
let generalModule: GeneralModule;
let expenseModule: ExpenseModule;

@Component
export default class TaxMixin extends Mixins(UtilityMixin) {
    public taxContactBioFormError = { ...taxContactBioForm };
    public taxProfileRegistrationFormError = { ...taxProfileRegistrationForm };

    @tax.State
    public taxLiabilities!: Array<TaxLiability>;

    @tax.State
    public taxRequestStatus!: TaxRequestStatus;

    @tax.State
    public error!: string;

    @general.State
    public uploadedFile!: UploadedFile;

    @tax.State
    public taxTypes!: Array<TaxType>;

    @tax.State
    public taxLiabilityTransactions!: Array<TaxLiabilityTransaction>;

    get taxContactFormHasErrors(): boolean {
        return Object.values(this.taxContactBioFormError).some(field => field.length);
    }

    get taxProfileFormHasErrors(): boolean {
        return Object.values(this.taxProfileRegistrationFormError).some(field => field.length);
    }

    get taxModule() {
        return taxModule;
    }

    get generalModule() {
        return generalModule;
    }

    get expenseModule() {
        return expenseModule;
    }

    get sortedTaxTypes(): Array<TaxType> {
        // map and get all the ones with isCommon, sort them

        const commonTaxTypes: Array<TaxType> = this.taxTypes.filter((taxType: TaxType) => taxType.isCommon);
        const uncommonTaxTypes: Array<TaxType> = this.taxTypes.filter((taxType: TaxType) => !taxType.isCommon);

        return commonTaxTypes
            .sort((itemA: TaxType, itemB: TaxType) => {
                if (itemA.isCommon) {
                    return -1;
                }

                if (itemB.isCommon) {
                    return 1;
                }

                return 0;
            })
            .concat(
                uncommonTaxTypes.sort((itemA: TaxType, itemB: TaxType) => {
                    if (itemA.name < itemB.name) {
                        return -1;
                    }

                    if (itemA.name > itemB.name) {
                        return 1;
                    }

                    return 0;
                }),
            );
    }

    public validateEmptyStringField(field: string, value: string, error: InputValidation) {
        if (isEmpty(value)) {
            error[field] = 'This is a required field';
            return;
        }

        if (value.length > 25) {
            error[field] = 'Please keep this between 1-25 characters';
            return;
        }

        error[field] = '';
        return;
    }

    public validateIfRequiredStringFieldIsEmpty(
        field: string,
        value: string,
        error: InputValidation,
        errorMessage = '',
    ) {
        if (isEmpty(value)) {
            error[field] = errorMessage.length > 0 ? errorMessage : 'This is a required field';
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

    public validateEmailAddress(email: string) {
        this.validateIfRequiredStringFieldIsEmpty('email', email, this.taxContactBioFormError);

        const { email: emailError } = this.taxContactBioFormError;
        if (!isEmpty(emailError)) return;

        if (!isEmail(email)) {
            this.taxContactBioFormError['email'] = 'Please provide a valid email address';
            return;
        }
        this.taxContactBioFormError['email'] = '';
    }

    public validatePhoneNumber(phoneNumber: string) {
        this.validateIfRequiredStringFieldIsEmpty('phoneNumber', phoneNumber, this.taxContactBioFormError);

        const { phoneNumber: phoneNumberError } = this.taxContactBioFormError;
        if (!isEmpty(phoneNumberError)) return;

        if (!isPhoneNumber(phoneNumber)) {
            this.taxContactBioFormError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }
        this.taxContactBioFormError['phoneNumber'] = '';
    }

    public validateBusinessAddress(operatingAddress: string) {
        this.validateIfRequiredStringFieldIsEmpty('operatingAddress', operatingAddress, this.taxContactBioFormError);

        const { operatingAddress: operatingAddressError } = this.taxContactBioFormError;
        if (!isEmpty(operatingAddressError)) return;

        this.validateFreeTextField('operatingAddress', operatingAddress, this.taxContactBioFormError);
    }

    public validateTaxContactDetailsForm({ email, operatingAddress, phoneNumber }: TaxContactDetails) {
        this.validateEmailAddress(email);
        this.validatePhoneNumber(phoneNumber);
        this.validateBusinessAddress(operatingAddress);
    }

    public validateTaxProfileState(taxStationStateKey: string) {
        this.validateIfRequiredStringFieldIsEmpty(
            'taxStationStateKey',
            taxStationStateKey,
            this.taxProfileRegistrationFormError,
        );
    }

    public validateTaxStationKey(taxStationKey: string) {
        this.validateIfRequiredStringFieldIsEmpty('taxStationKey', taxStationKey, this.taxProfileRegistrationFormError);
    }

    public validateTaxIdentity(taxIdentity: string) {
        this.validateIfRequiredStringFieldIsEmpty('taxIdentity', taxIdentity, this.taxProfileRegistrationFormError);
    }

    public validateTaxFormOne(cacForm101: string) {
        this.validateIfRequiredStringFieldIsEmpty(
            'cacForm101',
            cacForm101,
            this.taxProfileRegistrationFormError,
            'Please upload your Form 101',
        );
    }

    public validateTaxFormTwo(cacForm102: string) {
        this.validateIfRequiredStringFieldIsEmpty(
            'cacForm102',
            cacForm102,
            this.taxProfileRegistrationFormError,
            'Please upload your Form 102',
        );
    }

    public validateTaxFormThree(cacForm103: string) {
        this.validateIfRequiredStringFieldIsEmpty(
            'cacForm103',
            cacForm103,
            this.taxProfileRegistrationFormError,
            'Please upload your Form 103',
        );
    }

    public validateTaxProfileRegistrationForm(form: TaxProfileRegistrationForm) {
        this.validateTaxProfileState(form.taxStationStateKey);
        this.validateTaxStationKey(form.taxStationKey);
        this.validateTaxIdentity(form.taxIdentity);
        this.validateTaxFormOne(form.cacForm101);
        this.validateTaxFormTwo(form.cacForm102);
        this.validateTaxFormThree(form.cacForm103);
    }

    created() {
        taxModule = getModule(TaxModule, this.$store);
        generalModule = getModule(GeneralModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);
    }
}
