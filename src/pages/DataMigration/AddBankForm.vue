<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleAdditionOfBank"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked', skipText)"
        :buttonText="bottonText"
        :SkipText="skipText"
    >
        <div class="setup__right-side-heading">
            <h1 class="setup-add-entity__add-bank-heading">{{ modalTitle }}</h1>
            <div class="setup__select-container">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Bank Name"
                    defaultOptionText="--Select Bank--"
                    keyProperty="name"
                    textProperty="name"
                    valueProperty="name"
                    errorLabelClass="setup__modal-error-label-text"
                    :options="nigerianBanks"
                    v-model="bankAccount.bankName"
                    :errors="errors.bankName"
                    @input="validateBankName"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Account Number"
                    type="number"
                    v-model="bankAccount.accountNumber"
                    :errors="errors.accountNumber"
                    @input="validateAccountNumber"
                    errorLabelClass="setup__modal-error-label-text"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Account Name"
                    v-model="bankAccount.accountName"
                    :errors="errors.accountName"
                    @input="validateAccountName"
                    errorLabelClass="setup__modal-error-label-text"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    v-model="bankAccount.accountBalance.currencyKey"
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
                <BaseInputFieldWithBorderAndFloatingLabel
                    :floatingLabelText="labelCurrencyText"
                    :value="convertFigureToCurrency(bankAccount.accountBalance.amount)"
                    @input="formatAndValidateAccountBalance"
                    :errors="errors.accountBalance"
                    errorLabelClass="setup__modal-error-label-text"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Display Name"
                    v-model="bankAccount.displayName"
                    :errors="errors.displayName"
                    @input="handleDisplayName"
                    errorLabelClass="setup__modal-error-label-text"
                />
                <!-- <div class="setup__modal-buttons-container">
                    <BaseButton
                        buttonText="Delete"
                        className="setup__delete-button"
                        :overRideButtonClass="true"
                        v-if="isEditing"
                        @button-clicked="handleDeletionOfBank(indexOfBankAccountObjectToBeEdited)"
                    />
                    <BasePrimaryButton
                        buttonText="Save"
                        className="setup__save-button"
                        @button-clicked="handleAdditionOfBank"
                        :disabled="atLeastOneErrorExists(errors)"
                    />
                </div> -->
            </div>
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { BankAccount, CurrencyKeyListData } from '@/pages/DataMigration/types';

import deepCloneFunction from '@/utils/deepCloneFunction';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';
import CurrencyMixin from '@/mixins/currency';

import { isEmpty } from '@/utils/formValidator';
import nigerianBanks from '@/utils/nigerianBanks';

const business = namespace('business');
import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddBankForm extends Mixins(UtilityMixins, CurrencyMixin, ValidationMixin) {
    @Prop({ required: true }) readonly bankAccountToBeEdited!: BankAccount;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: 0 }) readonly indexOfBankAccountObjectToBeEdited!: number;
    @Prop() readonly skipText!: string;

    @business.State
    public currencyKeyList!: Array<CurrencyKeyListData>;

    get modalTitle(): string {
        return (this.isEditing ? 'Edit' : 'Add') + ' Bank Account';
    }

    get bottonText(): string {
        return this.isEditing ? 'Update' : 'Add Bank Account';
    }

    private formattedBalance = '0';
    private closeBackdropOnModal = false;
    public errors = {
        bankName: '',
        accountNumber: '',
        accountName: '',
        currency: '',
        accountBalance: '',
        displayName: '',
    };

    private shouldComputeDisplayName = true;

    private initialStateOfBankAccount: BankAccount = {
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountBalance: {
            currencyKey: '',
            amount: 0,
        },
        displayName: '',
    };

    private bankAccount = deepCloneFunction(this.initialStateOfBankAccount);
    private accountBalanceStr = '';
    private nigerianBanks = nigerianBanks;

    get labelCurrencyText() {
        return `Balance ${this.conditionForSelectingACurrencyInParenthesis}`;
    }

    public validateBankName() {
        this.validateEmptyField('bankName', this.bankAccount.bankName, this.errors, 'Please enter a bank name');
    }

    public validateAccountNumber() {
        this.validateEmptyField(
            'accountNumber',
            this.bankAccount.accountNumber,
            this.errors,
            'Please enter an account number',
        );
        if (isEmpty(this.errors.accountNumber)) {
            if (this.bankAccount.accountNumber.length > 10) {
                this.errors.accountNumber = 'Invalid account number, 10 digits only allowed';
            } else {
                this.errors.accountNumber = '';
            }
        }
    }

    public validateAccountName() {
        this.validateEmptyField(
            'accountName',
            this.bankAccount.accountName,
            this.errors,
            'Please enter an account name',
        );
    }

    public validateDisplayName() {
        this.validateEmptyField(
            'displayName',
            this.bankAccount.displayName,
            this.errors,
            'Please enter a display name',
        );
    }

    public formatAndValidateAccountBalance(accountBalance: string | number) {
        const inputToNumber = this.convertFormattedFiguresToNumber(accountBalance.toString());

        if (isNaN(inputToNumber)) {
            this.errors.accountBalance = 'Please a valid Number';
        } else {
            this.bankAccount.accountBalance = Object.assign({}, this.bankAccount.accountBalance, {
                ...this.bankAccount.accountBalance,
                amount: inputToNumber,
            });
            this.accountBalanceStr = this.validateTextFieldUsedForAFormattedNumber(accountBalance, inputToNumber);

            this.$nextTick(() => {
                this.validateAccountBalance();
            });
        }
    }

    public handleHideModal() {
        this.$emit('hide-add-bank-modal');
    }

    public validateAccountBalance() {
        this.validateEmptyField(
            'accountBalance',
            this.accountBalanceStr,
            this.errors,
            'Please enter an account balance',
        );
    }

    public generateInitialBankAccountDisplayName() {
        // return a combination of the first name of the bank and the account number as the display name
        // the display name can be edited by the user
        let firstNameOfBankName = '';
        const arrayOfBankNames = this.bankAccount.bankName.split(' ');
        firstNameOfBankName = arrayOfBankNames[0];
        this.bankAccount.displayName = `${firstNameOfBankName} - ${this.bankAccount.accountNumber}`;
    }

    public setShouldComputeDisplayName(value: boolean) {
        this.shouldComputeDisplayName = value;
    }

    public clearBankAccountModal() {
        // the deep clone function is used because this.bankAccount has a nested object with property accountBalance
        this.bankAccount = deepCloneFunction(this.initialStateOfBankAccount);
    }

    public handleDisplayName() {
        this.setShouldComputeDisplayName(false);
        this.validateDisplayName();
    }

    public validateBankModal() {
        this.validateBankName();
        this.validateAccountNumber();
        this.validateCurrency();
        this.validateDisplayName();
        this.validateAccountBalance();
        this.validateAccountName();
    }

    public handleAdditionOfBank() {
        const payload = {
            ...this.bankAccount,
            currencySymbol: Number(this.selectedCurrencyObject.currencySymbol),
        };

        this.validateBankModal();
        if (!this.atLeastOneErrorExists(this.errors)) {
            if (this.isEditing) {
                this.$emit('edit-bank-list', {
                    ...payload,
                    accountBalance: {
                        ...payload.accountBalance,
                        currencyKey: Number(payload.accountBalance.currencyKey),
                    },
                });
            } else {
                this.$emit('added-bank-list', {
                    ...payload,
                    accountBalance: {
                        ...payload.accountBalance,
                        currencyKey: Number(payload.accountBalance.currencyKey),
                    },
                });
            }
        }
    }

    public handleDeletionOfBank(index: number) {
        this.$emit('delete-bank-from-list', index);
    }

    @Watch('bankAccount.bankName')
    bankNameHasChanged() {
        if (this.shouldComputeDisplayName && !this.isEditing) {
            // only generate an initial bank account display name if there is no need
            // to compute display name i.e when display name has been edited AND when
            // the object is being edited. While it is being edited, show the display name
            // the user chose
            this.generateInitialBankAccountDisplayName();
        }
    }

    @Watch('bankAccount.accountNumber')
    bankAccountNumberHasChanged() {
        if (this.shouldComputeDisplayName && !this.isEditing) {
            // only generate an initial bank account display name if there is no need
            // to compute display name i.e when display name has been edited AND when
            // the object is being edited. While it is being edited, show the display name
            // the user chose
            this.generateInitialBankAccountDisplayName();
        }
    }

    mounted() {
        // this.$bvModal.show(this.id);
        this.bankAccount.accountBalance.currencyKey = Number(this.homeCurrencyKey); // set the currency key to the home currency key when the modal loads
        this.handleCurrencyChange(this.homeCurrencyKey.toString());
        if (this.isEditing) {
            // when the modal mounts, clone the bankAccount object
            this.bankAccount = deepCloneFunction(this.bankAccountToBeEdited); // a deep clone is used becuase it has a nested object in it
            this.accountBalanceStr = this.bankAccount.accountBalance.amount.toString(); // set accountBalanceStr to accountBalance amount
            // and turn it to a string for easier validation (negation of an empty string is falsy in JS)
            // with the accountBalance property
            this.$nextTick(() => {
                // when the DOM has updated fetch the selectedCurrencyObject using the currency key of the account balance to be edited
                // this is done because at this point the selectedCurrencyObject will be a default value since the modal has remounted
                this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(
                    this.bankAccountToBeEdited.accountBalance.currencyKey.toString(),
                );
            });
        }
    }

    @Watch('bankAccount', { deep: true, immediate: true })
    bankAccountValueHasChanged() {
        this.closeBackdropOnModal = this.areAnyFieldsInFormFilled(this.bankAccount);
    }
    @Watch('isEditing', { deep: true, immediate: true })
    getCurrentEditingState() {
        !this.isEditing
            ? (this.bankAccount = deepCloneFunction(this.initialStateOfBankAccount))
            : (this.bankAccount = deepCloneFunction(this.bankAccountToBeEdited));
    }
}
</script>

<style lang="scss">
// @include data-migration-add-entity-modal;
</style>
