<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleAdditionOfDebtor"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked', skipText)"
        :buttonText="buttonText"
        :SkipText="skipText"
    >
        <div class="setup__right-side-heading">
            <h1 class="setup-add-entity__add-bank-heading">{{ headerText }}</h1>

            <BaseInputFieldWithBorderAndFloatingLabel
                floatingLabelText="Name"
                v-model="debtor.name"
                :errors="errors.name"
                @input="validateDebtorName"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                type="tel"
                floatingLabelText="Phone Number"
                v-model="debtor.phoneNumber"
                :errors="errors.phoneNumber"
                @input="validateDebtorNumber"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                floatingLabelText="Email Address (optional)"
                v-model="debtor.emailAddress"
                :errors="errors.email"
                @input="validateDebtorEmail"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Address (optional)" v-model="debtor.address" />
            <BaseSelectWithBorderAndFloatingLabel
                floatingLabelText="Debtor Type"
                v-model="debtor.debtorType"
                defaultOptionText="-- Select Debtor Type --"
                :options="debtorType"
                :errors="errors.debtorType"
                @change="handleDebtorTypeSelection"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                :floatingLabelText="labelCurrencyText"
                :value="convertFigureToCurrency(debtor.amountOwed.amount)"
                :errors="errors.amountOwed"
                @input="formatAndValidateAmountOwed"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseSelectWithBorderAndFloatingLabel
                floatingLabelText="Currency"
                v-model="debtor.amountOwed.currencyKey"
                defaultOptionText="-- Select Currency --"
                name="currencyName"
                :options="getCurrencyObjectArrayFromListOfCurrency(currencyKeyList)"
                keyProperty="currencyKey"
                valueProperty="currencyKey"
                textProperty="currencyName"
                :isCurrency="true"
                @input="handleCurrencyChange"
                :errors="errors.currency"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseDateFieldWithBorderAndFloatingLabel
                floatingLabelText="Expected Payment Date"
                v-model="debtor.expectedPaymentDate"
                @change="validateDebtorPaymentDate"
                :errors="errors.expectedPaymentDate"
                errorLabelClass="setup__modal-error-label-text"
            />
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';
import CurrencyMixin from '@/mixins/currency';
import { Debtor, CurrencyKeyListData } from '@/pages/DataMigration/types';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

const business = namespace('business');

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddDebtorForm extends Mixins(UtilityMixins, CurrencyMixin, ValidationMixin) {
    // @Prop({ required: true }) readonly id!: string;
    @Prop({ required: true }) readonly debtorToBeEdited!: Debtor;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: 0 }) readonly indexOfDebtorObjectToBeEdited!: number;
    @Prop() readonly skipText!: string;
    @business.State
    public currencyKeyList!: Array<CurrencyKeyListData>;

    get modalTitle(): string {
        return (this.isEditing ? 'Edit' : 'Add') + ' Existing Debtor';
    }

    private formattedAmountOwed = '0';
    private debtorType = ['Customer', 'Vendor', 'Government', 'Staff', 'Others'];
    private amountOwedStr = '';
    private initialStateOfDebtor: Debtor = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        debtorType: '',
        amountOwed: {
            currencyKey: this.homeCurrencyKey,
            amount: 0,
        },
        expectedPaymentDate: '',
    };

    private debtor = { ...this.initialStateOfDebtor };
    private closeBackdropOnModal = false;

    get buttonText(): string {
        return this.isEditing ? 'Update' : 'Add Debtor';
    }

    public errors = {
        name: '',
        currency: '',
        phoneNumber: '',
        email: '',
        address: '',
        debtorType: '',
        amountOwed: '',
        expectedPaymentDate: '',
    };

    get labelCurrencyText() {
        return `Amount Owed ${this.conditionForSelectingACurrencyInParenthesis}`;
    }

    public handleDebtorTypeSelection(value: string) {
        this.debtor.debtorType = value;
        this.validateDebtorType();
    }

    public validateDebtorName() {
        this.validateEmptyField('name', this.debtor.name, this.errors, "Please enter the debtor's name");
    }

    public validateDebtorNumber() {
        this.validatePhoneNumber(this.debtor.phoneNumber, this.errors);
    }

    public validateDebtorEmail() {
        this.validateEmail(this.debtor.emailAddress, this.errors, true);
    }

    public validateDebtorType() {
        this.validateEmptyField('debtorType', this.debtor.debtorType, this.errors, 'Please enter the debtor type');
    }

    public validateAmountOwed() {
        this.validateEmptyField('amountOwed', this.amountOwedStr, this.errors, 'Please enter an amount');
    }

    public validateDebtorPaymentDate() {
        if (!this.debtor.expectedPaymentDate) {
            this.errors.expectedPaymentDate = 'Please enter a date';
            return;
        }
        this.errors.expectedPaymentDate = '';
    }

    public validateAddDebtorModal() {
        this.validateDebtorName();
        this.validateDebtorNumber();
        this.validateDebtorType();
        this.validateCurrency();
        this.validateAmountOwed();
        this.validateDebtorPaymentDate();
    }

    public formatAndValidateAmountOwed(amountOwed: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(amountOwed.toString());
        if (isNaN(inputToNumber)) {
            this.errors.amountOwed = 'Please a valid Number';
        } else {
            this.debtor = Object.assign({}, this.debtor, {
                ...this.debtor,
                amountOwed: {
                    currencyKey: Number(this.selectedCurrencyObject.currencyKey),
                    amount: inputToNumber,
                },
            });
            this.amountOwedStr = this.validateTextFieldUsedForAFormattedNumber(amountOwed, inputToNumber);
            this.$nextTick(() => {
                this.validateAmountOwed();
            });
        }
    }

    public handleDeletionOfDebtor(indexOfDebtorObjectToBeEdited: number) {
        this.$emit('delete-debtor-from-list', indexOfDebtorObjectToBeEdited);
    }

    public handleAdditionOfDebtor() {
        const payload = {
            ...this.debtor,
        };

        this.validateAddDebtorModal();

        if (!this.atLeastOneErrorExists(this.errors)) {
            if (this.isEditing) {
                this.$emit('edited-debtor', {
                    ...payload,
                    amountOwed: {
                        ...payload.amountOwed,
                        currencyKey: Number(payload.amountOwed.currencyKey),
                    },
                });
            } else {
                this.$emit('added-debtor', {
                    ...payload,
                    amountOwed: {
                        ...payload.amountOwed,
                        currencyKey: Number(payload.amountOwed.currencyKey),
                    },
                });
            }
        }
    }

    public clearAddDebtorModal() {
        this.debtor = { ...this.initialStateOfDebtor };
        this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(this.homeCurrencyKey.toString());
        this.debtor.amountOwed.currencyKey = this.homeCurrencyKey;
    }
    get headerText(): string {
        return this.isEditing ? 'Edit Debtor' : 'Add Debtor';
    }

    mounted() {
        if (this.isEditing) {
            const { expectedPaymentDate } = this.debtorToBeEdited;
            const transformedDate = this.formatDateToFitCalendarFormat(new Date(expectedPaymentDate).toISOString());

            this.debtor = {
                ...this.debtorToBeEdited,
                expectedPaymentDate: transformedDate,
            };
            // set amountOwedStr to amountOwed amount when loading the modal for editing
            // and turn it to a string for easier validation (negation of an empty string is falsy in JS)
            this.amountOwedStr = this.debtor.amountOwed.amount.toString();
            this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(
                this.debtor.amountOwed.currencyKey.toString(),
            );
        } else {
            // clear the modal every time the add debtor button is clicked
            this.clearAddDebtorModal();
        }
    }

    @Watch('debtor', { deep: true, immediate: true })
    debtorValueHasChanged() {
        this.closeBackdropOnModal = this.areAnyFieldsInFormFilled(this.debtor);
    }
    @Watch('isEditing', { deep: true, immediate: true })
    getCurrentEditingState() {
        !this.isEditing ? (this.debtor = { ...this.initialStateOfDebtor }) : (this.debtor = this.debtorToBeEdited);
    }
}
</script>

<style></style>
