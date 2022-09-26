<template>
    <b-container>
        <!-- Bank Name -->
        <b-row>
            <b-col class="bank-form__input">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Bank Name"
                    defaultOptionText="--Select Bank--"
                    keyProperty="name"
                    textProperty="name"
                    valueProperty="name"
                    className="bank-form__select-input"
                    :options="nigerianBanks"
                    v-model="bankDetails.bankName"
                    :errors="bankFormError.bankName"
                    @input="validateBankName(bankDetails.bankName)"
                />
            </b-col>
        </b-row>
        <!-- Account Number -->
        <b-row>
            <b-col class="bank-form__input">
                <BaseInputFieldWithBorderAndFloatingLabel
                    type="number"
                    floatingLabelText="Account Number"
                    v-model="bankDetails.accountNumber"
                    :errors="bankFormError.accountNumber"
                    @input="validateAccountNumber(bankDetails.accountNumber)"
                />
            </b-col>
        </b-row>

        <b-row>
            <!-- Account Balance -->
            <b-col class="bank-form__split-field--left" md="6" cols="12">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Balance"
                    className="bank-form__form-input"
                    :value="formattedAccountBalance"
                    :disabled="disableAccountBalance"
                    :errors="bankFormError.accountBalance"
                    @input="formatAndValidateBalance"
                />
            </b-col>

            <!-- Currency -->
            <b-col class="bank-form__split-field--right" md="6" cols="12">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Currency"
                    defaultOptionText="--Select Currency--"
                    keyProperty="currencyKey"
                    valueProperty="currencyKey"
                    className="bank-form__select-input"
                    :isCurrency="true"
                    :options="availableCurrencies"
                    v-model="bankDetails.accountBalance.currencyKey"
                    :disabled="disableCurrency"
                    :errors="bankFormError.currency"
                    @input="validateSelectedCurrency"
                />
            </b-col>
        </b-row>

        <!-- Display Name -->
        <b-row>
            <b-col class="bank-form__input">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Display Name"
                    :errors="bankFormError.displayName"
                    :value="accountDisplayName"
                    @input="handleDisplayName"
                />
            </b-col>
        </b-row>

        <!-- Source of Fund -->
        <b-row v-if="sourceOfFundInputShouldShow">
            <b-col class="bank-form__input">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Source Of Funds"
                    defaultOptionText="-- Select --"
                    className="bank-form__select-input"
                    keyProperty="paymentAccountKey"
                    valueProperty="paymentAccountKey"
                    textProperty="displayNameWithBalance"
                    :options="sourcesOfFund"
                    v-model="bankDetails.sourcePaymentAccountKey"
                    :errors="bankFormError.sourceOfFund"
                    @input="checkToValidateFundSourceAccount"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="bank-form__input">
                <BaseDateFieldWithBorderAndFloatingLabel
                    floatingLabelText="Account Opening Date"
                    :value="bankDetails.transactionDate"
                    :errors="bankFormError.transactionDate"
                    @input="handleTransactionDateField"
                />
            </b-col>
        </b-row>

        <b-row class="bank-form__footer">
            <BasePrimaryButton
                buttonText="Save"
                className="bank-form__save-btn"
                :status="bankRequestStatus"
                :disabled="buttonIsDisabled"
                @button-clicked="handleBankForm"
            />
        </b-row>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Status, PaymentAccount, MoneyObject } from '@/types';
import { BankAccount, BankDetails, BankRequest } from '@/pages/Spending/Banking/types';

import BankModule from '@/store/modules/bank';

import BankingMixin from '@/pages/Spending/Banking/BankingMixin';
import CurrencyMixins from '@/mixins/currency';

import nigerianBanks from '@/utils/nigerianBanks';

const bank = namespace('bank');
let bankModule: BankModule;

const defaultBankDetails: BankDetails = {
    bankAccountKey: '',
    bankName: '',
    accountNumber: '',
    displayName: '',
    accountBalance: { currencyKey: '', amount: 0 },
    sourcePaymentAccountKey: '',
    transactionDate: '',
};

@Component
export default class AddCustomerForm extends Mixins(BankingMixin, CurrencyMixins) {
    @Prop({ default: false }) readonly bankDetailsAreBeingEdited!: boolean;
    @Prop({ default: () => defaultBankDetails }) readonly bankToBeEdited!: BankDetails;

    private bankDetails = { ...defaultBankDetails };

    private manualDisplayName = '';
    private manualEntryActivated = false;

    private nigerianBanks = nigerianBanks;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'bank-request-notification',
        position: 'b-toaster-top-center',
    };

    private formattedAccountBalance = '';

    private sourceOfFundInputShouldShow = false;

    @bank.State
    public bankRequest!: BankRequest;

    @bank.State
    private paymentAccounts!: Array<BankAccount>;

    @bank.State
    private paymentAccountDetails!: BankDetails;

    @bank.State
    private updatedAccount!: BankDetails;

    @bank.State
    public error!: string;

    @bank.Action
    public getPaymentAccounts!: () => Array<BankAccount>;

    get buttonIsDisabled() {
        return this.errorExistsInBankForm || this.bankRequestStatus === 'LOADING';
    }

    get bankRequestStatus() {
        return this.bankDetailsAreBeingEdited ? this.updateBankRequestStatus : this.newBankRequestStatus;
    }

    get newBankRequestStatus() {
        return this.bankRequest.addBankAccount;
    }

    get updateBankRequestStatus() {
        return this.bankRequest.updateBankAccount;
    }

    get disableAccountBalance(): boolean {
        return this.bankDetailsAreBeingEdited;
    }

    get disableCurrency(): boolean {
        return this.bankDetailsAreBeingEdited ? Number(this.bankToBeEdited.accountBalance.amount) > 0 : false;
    }

    get accountDisplayName(): string {
        if (this.manualEntryActivated) return this.manualDisplayName;
        if (this.manualDisplayName) return this.manualDisplayName;

        const { bankName, accountNumber } = this.bankDetails;

        return this.getDefaultDisplayName(bankName, accountNumber);
    }

    get defaultDisplayName(): string {
        if (this.bankDetails.bankName === '' || this.bankDetails.accountNumber === '') return '';

        return `${this.bankDetails.bankName} - ${this.bankDetails.accountNumber}`;
    }

    get sourcesOfFund(): PaymentAccount[] {
        const { accountBalance } = this.bankDetails;
        const fundSources = this.updatedPaymentAccounts.filter(account => {
            return account.currencyKey == Number(accountBalance.currencyKey);
        });

        if (!this.bankDetailsAreBeingEdited) return fundSources;

        const bankBeingEdited = this.bankToBeEdited.bankAccountKey;
        return fundSources.filter(source => {
            return source.paymentAccountKey !== bankBeingEdited;
        });
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get errorExistsInBankForm() {
        return this.formHasError(this.bankFormError);
    }

    private getDefaultDisplayName(bankName: string, accountNumber: string) {
        if (bankName === '' || accountNumber === '') return '';

        return `${bankName} - ${accountNumber}`;
    }

    private handleDisplayName(newName: string) {
        this.manualDisplayName = newName;
        this.manualEntryActivated = true;
        this.validateDisplayName(newName);
    }

    private handleBankForm() {
        this.validateBankForm(this.bankDetails);
        this.checkToValidateFundSourceAccount();

        if (!this.errorExistsInBankForm) this.processBankRequest();
    }

    private processBankRequest() {
        const payload = this.generatePayload();

        this.validateTransferDate(payload.transactionDate ?? '');
        if (this.formHasError(this.fundTransferError)) return;

        if (!this.bankDetailsAreBeingEdited) {
            this.addNewBankAccount(payload);
            return;
        }
        this.updateBankDetails(payload);
    }

    private formatAndValidateBalance(accountBalance: string) {
        const balanceAmount = this.convertFormattedFiguresToNumber(accountBalance);

        if (this.validateBalanceAmount(accountBalance)) {
            this.bankDetails.accountBalance.amount = balanceAmount;

            this.formattedAccountBalance = this.convertFigureToCurrency(balanceAmount);

            this.$nextTick(() => {
                this.checkToValidateFundSourceAccount();
            });
        } else {
            if (balanceAmount) this.formattedAccountBalance = this.convertFigureToCurrency(balanceAmount);
            else this.formattedAccountBalance = accountBalance;
        }
    }

    private checkToValidateFundSourceAccount() {
        if (this.bankDetailsAreBeingEdited) return;

        const { accountBalance, sourcePaymentAccountKey } = this.bankDetails;
        const sourceAccountBalance = this.getBalanceOfSelectedAccount(this.paymentAccounts, sourcePaymentAccountKey);
        if (accountBalance.amount > 0) {
            this.validateSourceOfFund(
                sourcePaymentAccountKey,
                Number(accountBalance.amount),
                sourceAccountBalance,
                this.sourcesOfFund,
            );
            return;
        }
        this.$nextTick(() => {
            this.bankFormError['sourceOfFund'] = '';
        });
    }

    private validateSelectedCurrency() {
        const { accountBalance } = this.bankDetails;
        this.validateAccountCurrency(accountBalance.currencyKey.toString());
        this.bankDetails.sourcePaymentAccountKey = '';
        this.checkToValidateFundSourceAccount();
    }

    private handleTransactionDateField(transactionDate: string) {
        this.bankDetails.transactionDate = transactionDate;

        this.validateTransactionDate(transactionDate);
    }

    private generatePayload() {
        const { bankName, accountNumber, accountBalance, sourcePaymentAccountKey, transactionDate } = this.bankDetails;
        const { bankAccountKey } = this.bankToBeEdited;
        const payload = {
            bankAccountKey,
            bankName,
            accountNumber,
            displayName: this.accountDisplayName,
            accountBalance: { currencyKey: Number(accountBalance.currencyKey), amount: accountBalance.amount },
            sourcePaymentAccountKey,
            transactionDate,
        };
        return payload;
    }

    private async addNewBankAccount(bankDetails: BankDetails) {
        await bankModule.createBankAccount(bankDetails);
        if (this.bankRequestStatus === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Bank account added successfully',
            });
            this.resetForm;
            this.emitSuccessEvent();
        }
        if (this.bankRequestStatus === Status.ERROR) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: this.error,
            });
        }
    }

    private async updateBankDetails(bankDetails: BankDetails) {
        await bankModule.updateBankAccount(bankDetails);
        if (this.bankRequestStatus === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Bank account updated successfully',
            });
            this.resetForm;

            this.emitSuccessEvent(bankDetails);
        }
        if (this.bankRequestStatus === Status.ERROR) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: this.error,
            });
        }
    }

    private emitSuccessEvent(bankDetails?: BankDetails) {
        setTimeout(() => {
            if (this.bankDetailsAreBeingEdited) {
                // this.$emit('bank-updated', this.updatedAccount);
                this.$emit('bank-updated', bankDetails);
                return;
            }
            this.$emit('bank-added');
        }, 500);
    }

    private updateBankForm() {
        if (this.bankDetailsAreBeingEdited) {
            this.setBankToBeEdited();
            return;
        }
        this.resetForm();
    }

    private setBankToBeEdited() {
        this.bankDetails = Object.assign(this.bankDetails, this.bankToBeEdited);
        this.formattedAccountBalance = this.convertFigureToCurrency(this.bankToBeEdited.accountBalance.amount);
        const { displayName, bankName, accountNumber } = this.bankToBeEdited;
        if (displayName !== this.getDefaultDisplayName(bankName, accountNumber)) {
            this.manualDisplayName = displayName;
            this.manualEntryActivated = true;
        }
    }

    private resetForm() {
        this.bankDetails = Object.assign(this.bankDetails, defaultBankDetails);
        this.bankDetails.accountBalance.currencyKey = this.defaultCurrency.currencyKey;
    }

    private getAccountBalance(balance: any) {
        return balance.amount;
    }

    private resetSourceOfFundAccount() {
        this.bankDetails.sourcePaymentAccountKey = '';
    }

    private async getAllAccounts() {
        await bankModule.getPaymentAccounts();
    }

    @Watch('formattedAccountBalance')
    checkToShowFundSourceInput() {
        const balanceAmount = this.convertFormattedFiguresToNumber(this.formattedAccountBalance);

        if (balanceAmount > 0 && !this.bankDetailsAreBeingEdited) {
            this.sourceOfFundInputShouldShow = true;
            return;
        }

        this.sourceOfFundInputShouldShow = false;
    }

    @Watch('bankDetails.bankName')
    @Watch('bankDetails.accountNumber')
    setAutomaticInput() {
        this.manualEntryActivated = false;
    }

    @Watch('bankDetails.accountBalance', { deep: true })
    handleAccountBalanceChange(accountBalance: MoneyObject) {
        if (accountBalance.amount < 1) this.resetSourceOfFundAccount();
    }

    //Close add bank modal on backdrop only when the form content is empty
    @Watch('bankDetails', { immediate: true, deep: true })
    checkBankDetails() {
        const bankDetails = Object.values(this.bankDetails);
        let balance = 0;
        let otherDetailsAreEmpty = true;
        bankDetails.forEach(detail => {
            if (typeof detail == 'object') {
                balance = this.getAccountBalance(detail);
                return;
            }
            if (detail !== '') {
                otherDetailsAreEmpty = false;
            }
        });
        if (balance > 0 || !otherDetailsAreEmpty) {
            this.$emit('close-bank-modal-on-backdrop', false);
            return;
        }
        this.$emit('close-bank-modal-on-backdrop', true);
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        this.getAllAccounts();
        this.updateBankForm();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/new-bank-form';
</style>
