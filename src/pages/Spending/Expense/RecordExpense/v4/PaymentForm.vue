<template>
    <div class="expense-payment-form">
        <div class="expense-payment-form__header">
            <span class="expense-payment-form__header--title">Payment</span>
        </div>
        <div class="expense-payment-form__body">
            <p class="expense-payment-form__vendor">
                {{ vendorName }} |
                <span class="expense-payment-form__vendor--button" @click="$emit('change-vendor')"> Change</span>
            </p>

            <p class="expense-payment-form__net-amount">{{ netAmount }}</p>

            <div class="expense-payment-form__row">
                <div class="expense-payment-form__col--left">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Paid From"
                        defaultOptionText="-- Select Account --"
                        className="quick-expense-index__split-input"
                        keyProperty="paymentAccountKey"
                        valueProperty="paymentAccountKey"
                        textProperty="displayNameWithBalance"
                        :options="updatedPaymentAccounts"
                        :errors="paymentError.paymentAccount"
                        v-model="payment.accountPaidFrom"
                        @input="handlePaymentAccountChange"
                    />
                </div>

                <div class="expense-payment-form__col--right">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        v-if="!userIsOnDesktop"
                        class="w-100"
                        :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Amount Paid', functionalCurrency)"
                        :disabled="disableAmountPaidField"
                        :value="unformattedAmountPaid"
                        :errors="paymentError.amountPaid"
                        @input="formatAndValidateAmount"
                    />
                    <BaseInputFieldWithBorderAndFloatingLabel
                        v-else
                        class="w-100"
                        :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Amount Paid', functionalCurrency)"
                        :disabled="disableAmountPaidField"
                        :value="formattedAmountPaid"
                        :errors="paymentError.amountPaid"
                        @input="formatAndValidateAmount"
                    />
                    <p v-if="enablePartPayment" class="expense-payment-form__part-payment-link">
                        <span class="pointer" @click="enableAmountPaidField">Enter part payment</span>
                    </p>
                </div>
            </div>

            <transition-group name="slide-up-fade" mode="out-in">
                <div v-if="showBalanceDueAndDate" class="expense-payment-form__row" key="balance-due">
                    <div class="expense-payment-form__col--left">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            class="w-100"
                            floatingLabelText="Balance"
                            :disabled="true"
                            :value="balanceWithCurrency"
                        />
                    </div>

                    <div class="expense-payment-form__col--right" key="balance-due-date">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            class="w-100"
                            floatingLabelText="Balance Due Date"
                            :disableDatesTo="transactionDate"
                            :errors="paymentError.balanceDueDate"
                            v-model="payment.balanceDueDate"
                            @input="validateBalanceDate"
                        />
                    </div>
                </div>
            </transition-group>

            <!-- No Vendor Error on Mobile -->
            <div v-if="!vendorSelected" class="expense-payment-form__no-vendor">
                Kindly select a Vendor to enable part payment
            </div>

            <b-row class="expense-payment-form__footer">
                <GeneralFormError :message="generalFormError" class="expense-payment-form__footer--error" />
                <BasePrimaryButton
                    v-if="hasItems"
                    buttonText="Submit"
                    :status="expenseRequestStatus.createExpense"
                    :disabled="disableFormButton"
                    @button-clicked="handlePaymentForm"
                />
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { PaymentAccount, Status, Vendor, defaultVendor } from '@/types';
import { SelectedItemsTotalAmount, ExpensePaymentDetails } from '@/pages/Spending/Expense/RecordExpense/v4/types';
import { ExpenseRequestStatus } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import Validations from '@/pages/Spending/Expense/RecordExpense/v4/Validations';

import BankModule from '@/store/modules/bank';
import ExpenseModule from '@/store/modules/expense';

const expenses = namespace('expense');
const bank = namespace('bank');

let bankModule: BankModule;
let expenseModule: ExpenseModule;

@Component
export default class PaymentForm extends Mixins(UtilityMixins, CurrencyMixins, Validations) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly selectedItemCount!: number;
    @Prop({ required: true }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: '' }) readonly action!: string;
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;

    private formattedAmountPaid = '';
    private unformattedAmountPaid = '';
    private disableAmountPaidField = true;
    private defaultPaymentState: ExpensePaymentDetails = {
        accountPaidFrom: '',
        amountPaid: { amount: 0, currencyKey: this.functionalCurrency },
        transactionDate: this.transactionDate,
        balanceDueDate: '',
        hasPartialPayment: false,
    };
    private payment: ExpensePaymentDetails = { ...this.defaultPaymentState };

    @bank.State
    private paymentAccounts!: Array<PaymentAccount>;

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    private previousStateOfPaymentForm!: ExpensePaymentDetails;

    get hasItems(): boolean {
        return this.selectedItemCount > 0;
    }

    get hasMultipleItems(): boolean {
        return this.selectedItemCount > 1;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get vendorName() {
        return this.selectedVendor.name || 'Unnamed Vendor';
    }

    get vendorSelected() {
        return this.selectedVendor.name.length > 0;
    }

    get balanceAmount(): number {
        const amountPaid = this.payment.amountPaid;
        const totalAmount = this.totalAmount.netAmount;
        const balance = totalAmount - amountPaid.amount;
        if (amountPaid.amount > totalAmount) return 0;
        if (this.amountInputFieldHasError) return 0;
        return balance;
    }

    get netAmount() {
        const amount = this.totalAmount.netAmount;
        const currencyKey = Number(this.functionalCurrency);
        return this.$options.filters.amountWithCurrency({ currencyKey, amount });
    }

    get balanceWithCurrency(): string {
        const currencyKey = Number(this.functionalCurrency);
        const balance = this.balanceAmount;
        return this.$options.filters.amountWithCurrency({ currencyKey, amount: balance });
    }

    get amountInputFieldHasError(): boolean {
        const amountInputError = this.paymentError.amountPaid;
        return this.hasError(amountInputError);
    }

    get showBalanceDueAndDate() {
        return this.balanceAmount > 0;
    }

    get disableFormButton() {
        return !this.paymentFormIsValidated || this.expenseRequestStatus.createExpense === Status.LOADING;
    }

    get enablePartPayment() {
        return this.disableAmountPaidField && this.vendorSelected && !this.hasMultipleItems;
    }

    private handlePaymentAccountChange(paymentAccountKey: string) {
        this.validatePaymentAccount(paymentAccountKey);

        this.payment.amountPaid.currencyKey = this.functionalCurrency;
    }

    private formatAndValidateAmount(amountPaid: string) {
        this.unformattedAmountPaid = amountPaid;
        const amount = this.convertFormattedFiguresToNumber(amountPaid);
        if (this.validateAmountPaid(String(amount))) {
            this.formattedAmountPaid = this.convertFigureToCurrency(amount);

            // const currencyKey = this.functionalCurrency;
            // this.$set(this.payment, 'amountPaid', { amount, currencyKey });

            this.payment.amountPaid.amount = amount;

            this.clearBalanceDueDateError();
            return;
        }
        this.formattedAmountPaid = '';
        this.payment.amountPaid.amount = 0;
    }

    private validateBalanceDate() {
        this.validateBalanceDueDate(this.balanceAmount, this.payment.balanceDueDate, this.transactionDate);
    }

    private handlePaymentForm() {
        this.validateaymentForn(this.payment, this.balanceAmount);
        if (!this.paymentFormIsValidated) return;
        this.processExpenseSubission();
    }

    private resetBalanceDueDate() {
        this.payment.balanceDueDate = '';
    }

    private setAmountPaidField(amountPaid = 0) {
        if (!amountPaid) {
            const amount = this.totalAmount.netAmount;
            this.payment.amountPaid = { amount, currencyKey: this.functionalCurrency };
            this.formattedAmountPaid = this.convertFigureToCurrency(amount);
            return;
        }
        this.formattedAmountPaid = this.convertFigureToCurrency(amountPaid);
    }

    private enableAmountPaidField() {
        this.disableAmountPaidField = false;
        this.payment.amountPaid.amount = 0;
        this.payment.hasPartialPayment = true;
        this.formattedAmountPaid = '';
    }

    private checkTransactionDates(transactionDate: string) {
        const { balanceDueDate } = this.payment;
        if (new Date(balanceDueDate) < new Date(transactionDate)) {
            this.resetBalanceDueDate();
        }
    }

    private prefillFormWithInitialData() {
        this.payment = this.previousStateOfPaymentForm;

        const amountPaid = this.payment.amountPaid.amount;

        if (this.action == 'edit') {
            if (amountPaid < this.totalAmount.netAmount) {
                this.disableAmountPaidField = false;

                if (amountPaid) this.formattedAmountPaid = this.convertFigureToCurrency(amountPaid);
                else this.formattedAmountPaid = '';
            }
            return;
        }

        if (!this.vendorSelected || !this.payment.hasPartialPayment) {
            this.setAmountPaidField();
            return;
        }

        this.setAmountPaidField(amountPaid);
        this.disableAmountPaidField = false;
    }

    private processExpenseSubission() {
        this.$emit('process-expense-submission', this.payment);
    }

    private assignModules() {
        bankModule = getModule(BankModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);
    }

    private async getPaymentAccounts() {
        await bankModule.getPaymentAccounts();
    }

    @Watch('transactionDate')
    dateChaned(transactionDate: string) {
        this.checkTransactionDates(transactionDate);
    }

    @Watch('totalAmount', { immediate: true, deep: true })
    updateAmountPaid() {
        if (this.disableAmountPaidField) {
            this.setAmountPaidField();
        }
    }

    @Watch('payment', { deep: true })
    savePaymentDetails() {
        expenseModule.setPaymentFormState(this.payment);
    }

    mounted() {
        this.assignModules();
        this.getPaymentAccounts();
        this.prefillFormWithInitialData();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/payment-form';
</style>
