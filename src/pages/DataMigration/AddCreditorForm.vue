<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleAdditionOfCreditor"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked', skipText)"
        :buttonText="bottonText"
        :SkipText="skipText"
    >
        <div class="setup__right-side-heading">
            <h1 class="setup-add-entity__add-bank-heading">{{ headerText }}</h1>
            <BaseInputFieldWithBorderAndFloatingLabel
                floatingLabelText="Name"
                v-model="creditor.name"
                :errors="errors.name"
                @input="validateCreditorName"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                type="tel"
                floatingLabelText="Phone Number"
                v-model="creditor.phoneNumber"
                :errors="errors.phoneNumber"
                @input="validateCreditorNumber"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                floatingLabelText="Email Address (optional)"
                v-model="creditor.emailAddress"
                :errors="errors.email"
                @input="validateCreditorEmail"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Address (optional)" v-model="creditor.address" />
            <BaseSelectWithBorderAndFloatingLabel
                v-model="creditor.creditorType"
                floatingLabelText="Creditor Type"
                defaultOptionText="-- Select Creditor Type --"
                :options="creditorType"
                :errors="errors.creditorType"
                @change="handleCreditorTypeSelection"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseInputFieldWithBorderAndFloatingLabel
                :floatingLabelText="labelCurrencyText"
                :value="convertFigureToCurrency(creditor.amountOwed.amount)"
                :errors="errors.amountOwed"
                @input="formatAndValidateAmountOwed"
                errorLabelClass="setup__modal-error-label-text"
            />
            <BaseSelectWithBorderAndFloatingLabel
                v-model="creditor.amountOwed.currencyKey"
                floatingLabelText="Currency"
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
                v-model="creditor.expectedPaymentDate"
                @change="validateCreditorPaymentDate"
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

import { Creditor, CurrencyKeyListData } from '@/pages/DataMigration/types';
import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

const business = namespace('business');

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddCreditorForm extends Mixins(UtilityMixins, CurrencyMixin, ValidationMixin) {
    @Prop({ required: true }) readonly creditorToBeEdited!: Creditor;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop() readonly skipText!: string;

    // @Prop({ default: 0 }) readonly indexOfCreditorObjectToBeEdited!: number;

    @business.State
    public currencyKeyList!: Array<CurrencyKeyListData>;

    get modalTitle(): string {
        return (this.isEditing ? 'Edit' : 'Add') + ' Existing Creditor';
    }

    private headerText = 'Add Creditor';
    private formattedAmountOwed = '0';
    private creditorType = ['Customer', 'Vendor', 'Government', 'Staff', 'Others'];
    private amountOwedStr = '';
    private initialStateOfCreditor: Creditor = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        creditorType: '',
        amountOwed: {
            currencyKey: this.homeCurrencyKey,
            amount: 0,
        },
        expectedPaymentDate: '',
    };

    private creditor = { ...this.initialStateOfCreditor };

    private closeBackdropOnModal = false;

    get bottonText(): string {
        return this.isEditing ? 'Update' : 'Add Creditor';
    }

    public errors = {
        name: '',
        currency: '',
        phoneNumber: '',
        email: '',
        address: '',
        creditorType: '',
        amountOwed: '',
        expectedPaymentDate: '',
    };

    get labelCurrencyText() {
        return `Amount Owed ${this.conditionForSelectingACurrencyInParenthesis}`;
    }

    public handleCreditorTypeSelection(value: string) {
        this.creditor.creditorType = value;
        this.validateCreditorType();
    }

    public validateCreditorName() {
        this.validateEmptyField('name', this.creditor.name, this.errors, "Please enter the creditor's name");
    }

    public validateCreditorNumber() {
        this.validatePhoneNumber(this.creditor.phoneNumber, this.errors);
    }

    public validateCreditorEmail() {
        this.validateEmail(this.creditor.emailAddress, this.errors, true);
    }

    public validateCreditorType() {
        this.validateEmptyField(
            'creditorType',
            this.creditor.creditorType,
            this.errors,
            'Please enter the creditor type',
        );
    }

    public validateAmountOwed() {
        this.validateEmptyField(
            'amountOwed',
            this.amountOwedStr, // the amountOwedStr variable is used after the validation of a text field with a converted number
            this.errors,
            'Please enter an amount',
        );
    }

    public validateCreditorPaymentDate() {
        if (!this.creditor.expectedPaymentDate) {
            this.errors.expectedPaymentDate = 'Please enter a date';
            return;
        }
        this.errors.expectedPaymentDate = '';
    }

    public validateAddCreditorModal() {
        this.validateCreditorName();
        this.validateCreditorNumber();
        this.validateCreditorType();
        this.validateCurrency();
        this.validateAmountOwed();
        this.validateCreditorPaymentDate();
    }

    public formatAndValidateAmountOwed(amountOwed: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(amountOwed.toString());
        if (isNaN(inputToNumber)) {
            this.errors.amountOwed = 'Please a valid Number';
        } else {
            this.creditor = Object.assign({}, this.creditor, {
                ...this.creditor,
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

    public handleDeletionOfCreditor(indexOfCreditorToBeEdited: number) {
        this.$emit('delete-creditor-from-list', indexOfCreditorToBeEdited);
    }

    public handleAdditionOfCreditor() {
        const payload = {
            ...this.creditor,
        };

        this.validateAddCreditorModal();
        if (!this.atLeastOneErrorExists(this.errors)) {
            if (this.isEditing) {
                this.$emit('edited-creditor', {
                    ...payload,
                    amountOwed: { ...payload.amountOwed, currencyKey: Number(payload.amountOwed.currencyKey) },
                });
            } else {
                this.$emit('added-creditor', {
                    ...payload,
                    amountOwed: { ...payload.amountOwed, currencyKey: Number(payload.amountOwed.currencyKey) },
                });
            }
        }
    }

    public clearAddCreditorModal() {
        this.creditor = { ...this.initialStateOfCreditor };
        this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(this.homeCurrencyKey.toString());
        this.creditor.amountOwed.currencyKey = this.homeCurrencyKey;
    }

    public hideCreditorModal() {
        this.$emit('hide-add-creditor-modal');
    }

    mounted() {
        if (this.isEditing) {
            const { expectedPaymentDate } = this.creditorToBeEdited;
            const transformedDate = this.formatDateToFitCalendarFormat(new Date(expectedPaymentDate).toISOString());
            this.creditor = { ...this.creditorToBeEdited, expectedPaymentDate: transformedDate };

            // set amountOwedStr to amountOwed amount when loading the modal for editing
            // and turn it to a string for easier validation (negation of an empty string is falsy in JS)
            this.amountOwedStr = this.creditor.amountOwed.amount.toString();
            this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(
                this.creditor.amountOwed.currencyKey.toString(),
            );
            this.headerText = 'Edit Creditor';
        } else {
            // clear the modal every time the add creditor button is clicked
            this.clearAddCreditorModal();
        }
    }

    @Watch('creditor', { deep: true, immediate: true })
    creditorValueHasChanged() {
        this.closeBackdropOnModal = this.areAnyFieldsInFormFilled(this.creditor);
    }
    @Watch('isEditing', { deep: true, immediate: true })
    getCurrentEditingState() {
        !this.isEditing
            ? (this.creditor = { ...this.initialStateOfCreditor })
            : (this.creditor = this.creditorToBeEdited);
    }
}
</script>

<style></style>
