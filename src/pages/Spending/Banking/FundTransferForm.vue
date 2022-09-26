<template>
    <b-container class="p-0">
        <div class="fund-transfer-form">
            <b-row class="fund-transfer-form__split-field">
                <!-- Source -->
                <b-col class="fund-transfer-form__split-field--left" sm="6" cols="12">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Source"
                        className="fund-transfer-form__select-input"
                        defaultOptionText="Select Source"
                        keyProperty="bankAccountKey"
                        valueProperty="bankAccountKey"
                        textProperty="displayName"
                        :options="paymentAccounts"
                        v-model="transferForm.sourceAccountKey"
                        :errors="fundTransferError.sourceAccount"
                        @input="validateTransferSource"
                    />
                </b-col>

                <!-- Destination -->
                <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12" v-if="!isMobileScreen">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Destination"
                        className="fund-transfer-form__select-input"
                        defaultOptionText="Select Destination"
                        keyProperty="bankAccountKey"
                        valueProperty="bankAccountKey"
                        textProperty="displayName"
                        :options="paymentAccounts"
                        v-model="transferForm.destinationAccountKey"
                        :errors="fundTransferError.destinationAccount"
                        @input="validateTransferDestination"
                    />
                </b-col>
            </b-row>

            <b-row class="fund-transfer-form__split-field" sm="6" cols="12">
                <!-- Transfer Source Current Balance -->
                <b-col class="fund-transfer-form__split-field--left">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :readOnly="true"
                        :disabled="true"
                        floatingLabelText="Current Balance"
                        className="fund-transfer-form__form-input"
                        :value="convertFigureToCurrency(sourceAccount.balance)"
                    />
                </b-col>

                <!-- Destination Account Current Balance -->
                <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12" v-if="!isMobileScreen">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :readOnly="true"
                        :disabled="true"
                        floatingLabelText="Current Balance"
                        className="fund-transfer-form__form-input"
                        :value="convertFigureToCurrency(destinationAccount.balance)"
                    />
                </b-col>
            </b-row>

            <b-row class="fund-transfer-form__split-field">
                <!-- Outgoing Transfer Amount -->
                <b-col class="fund-transfer-form__split-field--left" sm="6" cols="12">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Transfer Amount"
                        className="fund-transfer-form__form-input"
                        :value="convertFigureToCurrency(transferForm.sourceAmount.amount)"
                        @input="formatAndValidatTransferAmount"
                        :errors="fundTransferError.transferAmount"
                    />
                </b-col>

                <!-- Incoming Transfer Amount -->
                <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12" v-if="!isMobileScreen">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :readOnly="true"
                        :disabled="true"
                        floatingLabelText="Receiving Amount"
                        className="fund-transfer-form__form-input"
                        :value="convertFigureToCurrency(destinationAccount.transferAmount)"
                    />
                </b-col>
            </b-row>

            <b-row class="fund-transfer-form__split-field" sm="6" cols="12" v-if="!isMobileScreen">
                <!-- New Balance -->
                <b-col class="fund-transfer-form__split-field--left">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :readOnly="true"
                        :disabled="true"
                        floatingLabelText="Balance after transfer"
                        className="fund-transfer-form__form-input"
                        :value="sourceAccountNewBalance"
                    />
                </b-col>

                <!-- New Balance -->
                <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12" v-if="!isMobileScreen">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :readOnly="true"
                        :disabled="true"
                        floatingLabelText="Balance after transfer"
                        className="fund-transfer-form__form-input"
                        :value="convertFigureToCurrency(destinationAccount.newBalance)"
                    />
                </b-col>
            </b-row>

            <b-row v-if="!isMobileScreen">
                <b-col class="fund-transfer-form__field--row">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        floatingLabelText="Transfer Date"
                        :value="transferForm.transactionDate"
                        :errors="fundTransferError.transactionDate"
                        @input="handleTransactionDateField"
                    />
                </b-col>
            </b-row>

            <!-- Note -->
            <b-row class="fund-transfer-form__field--row" v-if="!isMobileScreen">
                <b-col class="fund-transfer-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="transferForm.notes" />
                </b-col>
            </b-row>

            <!-- Displayed only on xs screens for mobile flow -->
            <div v-if="isMobileScreen">
                <b-row class="fund-transfer-form__split-field">
                    <!-- Destination -->
                    <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12">
                        <BaseSelectWithBorderAndFloatingLabel
                            floatingLabelText="Destination"
                            className="fund-transfer-form__select-input"
                            defaultOptionText="Select Destination"
                            keyProperty="bankAccountKey"
                            valueProperty="bankAccountKey"
                            textProperty="displayName"
                            :options="paymentAccounts"
                            v-model="transferForm.destinationAccountKey"
                            :errors="fundTransferError.destinationAccount"
                            @input="validateTransferDestination"
                        />
                    </b-col>
                </b-row>

                <b-row class="fund-transfer-form__split-field" sm="6" cols="12">
                    <!-- Destination Account Current Balance -->
                    <b-col class="fund-transfer-form__split-field--right" sm="6" cols="12">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            :readOnly="true"
                            :disabled="true"
                            floatingLabelText="Current Balance"
                            className="fund-transfer-form__form-input"
                            :value="convertFigureToCurrency(destinationAccount.balance)"
                        />
                    </b-col>
                </b-row>
            </div>

            <BlockErrorMessage :message="error" />

            <b-row class="fund-transfer-form__footer">
                <BasePrimaryButton
                    :buttonText="trasferFormButtonText"
                    :status="transferRequestStatus"
                    :disabled="buttonShouldBeDisabled"
                    @button-clicked="handleTransferForm"
                />
            </b-row>
        </div>

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
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Status } from '@/types';
import {
    BankAccount,
    BankRequest,
    DestinationAccountStatus,
    FundTransferDetails,
    FundTransferPayload,
    SourceAccountStatus,
} from '@/pages/Spending/Banking/types';

import BankModule from '@/store/modules/bank';
import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

const bank = namespace('bank');
let bankModule: BankModule;

const defaultTransferForm: FundTransferDetails = {
    sourceAccountKey: '',
    sourceAmount: { currencyKey: '', amount: 0 },
    destinationAccountKey: '',
    destinationAmount: { currencyKey: '', amount: 0 },
    notes: '',
    transactionDate: '',
};

@Component
export default class FundTransferForm extends Mixins(BankingMixin) {
    @Prop({ default: false }) readonly isMobileScreen!: boolean;
    @Prop({ default: false }) readonly isSourceAccountSelected!: boolean;
    @Prop({ default: '' }) readonly selectedSourceAccount!: string;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'fund-transfer-request-notification',
        position: 'b-toaster-top-center',
    };

    private transferForm: FundTransferDetails = { ...defaultTransferForm };

    @bank.State
    public bankRequest!: BankRequest;

    @bank.State
    public paymentAccounts!: BankAccount[];

    @bank.State
    public error!: string;

    @bank.Action
    public getPaymentAccounts!: () => Array<BankAccount>;

    get buttonShouldBeDisabled() {
        return !this.fundTranserFormIsValidated || this.transferRequestStatus === 'LOADING';
    }

    get trasferFormButtonText() {
        return this.isMobileScreen ? 'Next' : 'Submit';
    }

    get sourceAccount(): SourceAccountStatus {
        const { sourceAccountKey, sourceAmount } = this.transferForm;
        if (sourceAccountKey == '') {
            return {
                balance: '0',
                newBalance: '0',
            };
        }
        const currentBalance = this.getBalanceOfSelectedAccount(this.paymentAccounts, sourceAccountKey);
        const balance = currentBalance == 0 ? '0' : currentBalance;
        const newBalance = currentBalance - Number(sourceAmount.amount);

        return {
            balance,
            newBalance: newBalance < 0 ? '0' : newBalance,
        };
    }

    get destinationAccount(): DestinationAccountStatus {
        const { destinationAccountKey, sourceAmount } = this.transferForm;
        if (destinationAccountKey === '') {
            return {
                balance: 0,
                transferAmount: 0,
                newBalance: 0,
            };
        }
        const currentBalance = this.getBalanceOfSelectedAccount(this.paymentAccounts, destinationAccountKey);
        const balance = currentBalance == 0 ? '0' : currentBalance;
        return {
            balance,
            transferAmount: Number(sourceAmount.amount),
            newBalance: currentBalance + Number(sourceAmount.amount),
        };
    }

    get sourceAccountNewBalance(): string | number {
        const { newBalance } = this.sourceAccount;
        const { sourceAmount } = this.transferForm;
        const sourceAmountInNumber = this.convertFormattedFiguresToNumber(sourceAmount.toString());
        if (
            this.accountBalanceIsInsufficient(Number(this.sourceAccount.balance), sourceAmountInNumber) ||
            this.accountBalanceIsEqualToTransferAmount(Number(this.sourceAccount.balance), sourceAmountInNumber)
        )
            return '0';
        return this.convertFigureToCurrency(newBalance);
    }

    get transferRequestStatus() {
        return this.bankRequest.transferFund;
    }

    get errorExistsInTransferForm() {
        this.validateFundTranserForm(this.transferForm, Number(this.sourceAccount.balance));
        return this.formHasError(this.fundTransferError);
    }

    private handleTransferForm() {
        this.validateFundTranserForm(this.transferForm, Number(this.sourceAccount.balance));
        this.$nextTick(() => {
            if (this.errorExistsInTransferForm) return;
            if (this.isMobileScreen) {
                this.goToPreviewPage();
                return;
            }
            this.processTransferRequest();
        });
    }

    private formatAndValidatTransferAmount(transferAmount: string) {
        this.checkTransferSourceAccount();
        const amountInNumber = this.convertFormattedFiguresToNumber(transferAmount);
        const { currencyKey } = this.transferForm.sourceAmount;
        this.$set(this.transferForm, 'sourceAmount', { currencyKey, amount: amountInNumber });
        this.validateTransferAmount(amountInNumber, Number(this.sourceAccount.balance));
    }

    private getCurrencyKeyOfSelectedAccount(selectedAccountKey: string): number {
        const bankAccount = this.getAccountDetails(this.paymentAccounts, selectedAccountKey);
        const { currencyKey } = bankAccount.accountBalance;
        return Number(currencyKey);
    }

    private getCurencyKeyOfSourceAccount() {
        const currencyKey = this.getCurrencyKeyOfSelectedAccount(this.transferForm.sourceAccountKey);
        return currencyKey;
    }

    private checkTransferSourceAccount() {
        if (this.transferForm.sourceAccountKey === '') {
            this.fundTransferError['sourceAccount'] = 'please select transfer source first';
            this.$nextTick(() => {
                this.transferForm.sourceAmount.amount = 0;
            });
            return;
        }
    }

    private validateTransferSource() {
        const { sourceAccountKey, destinationAccountKey } = this.transferForm;
        this.validateSourceAccount(sourceAccountKey, destinationAccountKey);
        if (destinationAccountKey != '') {
            this.validateDestinationAccount(destinationAccountKey, sourceAccountKey);
        }
    }

    private validateTransferDestination() {
        const { sourceAccountKey, destinationAccountKey } = this.transferForm;
        this.validateDestinationAccount(destinationAccountKey, sourceAccountKey);
        if (sourceAccountKey != '') {
            this.validateSourceAccount(sourceAccountKey, destinationAccountKey);
        }
    }

    private handleTransactionDateField(transactionDate: string) {
        this.transferForm.transactionDate = transactionDate;

        this.validateTransferDate(transactionDate);
    }

    private processTransferRequest() {
        const payload: FundTransferPayload = this.generatePayload();
        this.transferFunds(payload);
    }

    private generatePayload(): FundTransferPayload {
        const { sourceAccountKey, sourceAmount, destinationAccountKey, notes, transactionDate } = this.transferForm;
        const currencyKey = this.getCurencyKeyOfSourceAccount();
        const payload = {
            sourceAccountKey,
            transferAmount: { currencyKey: currencyKey, amount: Number(sourceAmount.amount) },
            destinationAccountKey,
            transactionDate,
            notes,
        };
        return payload;
    }

    private goToPreviewPage() {
        const { sourceAccountKey, sourceAmount, destinationAccountKey } = this.transferForm;
        const sourceAccountDetails = this.getAccountDetails(this.paymentAccounts, sourceAccountKey);
        const destinationAccountDetails = this.getAccountDetails(this.paymentAccounts, destinationAccountKey);
        const currenkeyOfTransferAmount = this.getCurencyKeyOfSourceAccount();
        this.$set(sourceAmount, 'currencyKey', currenkeyOfTransferAmount);

        this.$emit('go-to-preview-page', sourceAccountDetails, destinationAccountDetails, sourceAmount);
    }

    private async transferFunds(fundTransferDetails: FundTransferPayload) {
        await bankModule.transferFunds(fundTransferDetails);
        if (this.transferRequestStatus === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Funds transfered successfully',
            });
            this.emitSuccessEvent();
        }
    }

    private emitSuccessEvent() {
        this.$emit('fund-transfer-completed');
    }

    private checkForPreSelectedSourceAccount() {
        if (this.isSourceAccountSelected) {
            this.$set(this.transferForm, 'sourceAccountKey', this.selectedSourceAccount);
        }
    }

    private async getAllAccounts() {
        await bankModule.getPaymentAccounts();
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        this.getAllAccounts();
        this.checkForPreSelectedSourceAccount();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/fund-transfer-form';
</style>
