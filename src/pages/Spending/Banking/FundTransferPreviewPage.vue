<template>
    <div>
        <div class="preview-page">
            <div>
                <p class="preview-page__title">Source</p>
                <div class="split">
                    <p class="preview-page__text">{{ sourceAccount.displayName }}</p>
                    <p class="preview-page__text">{{ transferAmount | amountWithCurrency }}</p>
                </div>
                <p class="preview-page__text">
                    Previous Balance: {{ sourceAccount.accountBalance | amountWithCurrency }}
                </p>
                <p class="preview-page__text">New Balance: {{ newBalance.source | amountWithCurrency }}</p>
            </div>
            <div>
                <p class="preview-page__title bottom">Destination</p>
                <div class="split">
                    <p class="preview-page__text">{{ destinationAccount.displayName }}</p>
                    <p class="preview-page__text">{{ transferAmount | amountWithCurrency }}</p>
                </div>
                <p class="preview-page__text">
                    Previous Balance: {{ destinationAccount.accountBalance | amountWithCurrency }}
                </p>
                <p class="preview-page__text">New Balance: {{ newBalance.destination | amountWithCurrency }}</p>
            </div>
            <div class="preview-page__notes">
                <BaseDateFieldWithBorderAndFloatingLabel
                    floatingLabelText="Transfer Date"
                    :value="transactionDate"
                    :errors="fundTransferError.transactionDate"
                    @input="handleTransactionDateField"
                />
            </div>

            <div class="preview-page__notes">
                <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="transferNotes" />
            </div>

            <BlockErrorMessage :message="error" />

            <div class="preview-page__footer">
                <BasePrimaryButton
                    buttonText="Transfer"
                    :overRideButtonClass="true"
                    className="preview-page__transfer-btn"
                    :status="transferRequestStatus"
                    :disabled="buttonShouldBeDisabled"
                    @button-clicked="processTransferRequest"
                />
            </div>
        </div>
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Status } from '@/types';
import { BankAccount, MoneyObject, BankRequest, FundTransferPayload } from '@/pages/Spending/Banking/types';

import BankModule from '@/store/modules/bank';
import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

const bank = namespace('bank');
let bankModule: BankModule;

const defaultBankAccount: BankAccount = {
    bankAccountKey: '',
    bankName: '',
    displayName: '',
    accountName: '',
    accountNumber: '',
    accountBalance: {
        currencyKey: 0,
        amount: 0,
    },
};

const moneyObject: MoneyObject = {
    currencyKey: 0,
    amount: 0,
};

@Component
export default class MobileFundTransferPreviewPage extends Mixins(BankingMixin) {
    @Prop({ default: () => defaultBankAccount }) readonly sourceAccount!: BankAccount;
    @Prop({ default: () => defaultBankAccount }) readonly destinationAccount!: BankAccount;
    @Prop({ default: () => moneyObject }) readonly transferAmount!: MoneyObject;
    @Prop({ default: 0 }) readonly componentKey!: number;

    private transferNotes = '';
    private transactionDate = '';

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'mobile-transfer-request-notification',
        position: 'b-toaster-top-center',
    };

    @bank.State
    public bankRequest!: BankRequest;

    @bank.State
    public error!: string;

    get buttonShouldBeDisabled() {
        return this.formHasError(this.fundTransferError) || this.transferRequestStatus === 'LOADING';
    }

    get transferRequestStatus() {
        return this.bankRequest.transferFund;
    }

    get newBalance() {
        const { amount } = this.transferAmount;
        return {
            source: {
                currencyKey: this.sourceAccount.accountBalance.currencyKey,
                amount: Number(this.sourceAccount.accountBalance.amount) - Number(amount),
            },
            destination: {
                currencyKey: this.destinationAccount.accountBalance.currencyKey,
                amount: Number(this.destinationAccount.accountBalance.amount) + Number(amount),
            },
        };
    }

    private handleTransactionDateField(transactionDate: string) {
        this.transactionDate = transactionDate;

        this.validateTransferDate(transactionDate);
    }

    private processTransferRequest() {
        if (!this.validateTransferDate(this.transactionDate)) return;

        const payload = this.generatePayload();
        this.transferFund(payload);
    }

    private generatePayload(): FundTransferPayload {
        const sourceAccountKey = this.sourceAccount.bankAccountKey;
        const destinationAccountKey = this.destinationAccount.bankAccountKey;
        const { transferAmount, transferNotes, transactionDate } = this;
        const payload = {
            sourceAccountKey,
            transferAmount,
            destinationAccountKey,
            transactionDate,
            notes: transferNotes,
        };
        return payload;
    }

    private async transferFund(fundTransferDetails: FundTransferPayload) {
        await bankModule.transferFunds(fundTransferDetails);
        if (this.transferRequestStatus === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Funds transfered successfully',
            });
            this.emitSuccessEvent();
            return;
        }
    }

    private emitSuccessEvent() {
        setTimeout(() => {
            this.$emit('fund-transfer-successful');
        }, 1500);
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/fund-transfer-preview-page';
</style>
