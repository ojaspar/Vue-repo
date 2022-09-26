<template>
    <div class="sale-payment-form">
        <div class="sale-payment-form__header">
            <span class="sale-payment-form__header--title">Payment</span>
        </div>
        <div class="sale-payment-form__body">
            <p class="sale-payment-form__customer">
                {{ customerName }} |
                <span class="sale-payment-form__customer--button" @click="$emit('change-customer')"> Change</span>
            </p>

            <p class="sale-payment-form__net-amount">{{ netAmount }}</p>

            <div class="sale-payment-form__row" v-if="!isEstimate">
                <div class="sale-payment-form__col--left">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Paid To"
                        defaultOptionText="-- Select Account --"
                        className="quick-sale-index__split-input"
                        keyProperty="paymentAccountKey"
                        valueProperty="paymentAccountKey"
                        textProperty="displayNameWithBalance"
                        :options="updatedPaymentAccounts"
                        :errors="paymentError.paymentAccount"
                        :disabled="transactionIsBeingEdited"
                        v-model="payment.paymentAccountKey"
                        @input="validatePaymentAccount"
                    />
                </div>

                <div class="sale-payment-form__col--right">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        v-if="!userIsOnDesktop"
                        class="w-100"
                        :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Amount Paid', selectedCurrencyKey)"
                        :disabled="disableAmountPaidField"
                        :value="unformattedAmountPaid"
                        :errors="paymentError.amountPaid"
                        @input="formatAndValidateAmount"
                    />
                    <BaseInputFieldWithBorderAndFloatingLabel
                        v-else
                        class="w-100"
                        :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Amount Paid', selectedCurrencyKey)"
                        :disabled="disableAmountPaidField"
                        :value="formattedAmountPaid"
                        :errors="paymentError.amountPaid"
                        @input="formatAndValidateAmount"
                    />
                    <p v-if="enablePartPayment" class="sale-payment-form__part-payment-link">
                        <span class="pointer" @click="enableAmountPaidField">Enter part payment</span>
                    </p>
                </div>
            </div>

            <transition-group name="slide-up-fade" mode="out-in" v-if="!isEstimate">
                <div v-if="showBalanceDueAndDate" class="sale-payment-form__row" key="balance-due">
                    <div class="sale-payment-form__col--left">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            class="w-100"
                            floatingLabelText="Balance"
                            :disabled="true"
                            :value="balanceWithCurrency"
                        />
                    </div>

                    <div class="sale-payment-form__col--right" key="balance-due-date">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            :disabled="transactionIsBeingEdited"
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

            <!-- No Customer Error on Mobile -->
            <div v-if="!customerSelected" class="sale-payment-form__no-customer">
                Kindly select a Customer to enable part payment
            </div>

            <b-row class="sale-payment-form__footer">
                <GeneralFormError :message="generalFormError" class="sale-payment-form__footer--error" />
                <div class="w-100 d-flex justify-content-center">
                    <BasePrimaryButton
                        :buttonText="submitButtonText"
                        :status="submitStatus"
                        :disabled="disableFormButton"
                        @button-clicked="handlePaymentForm"
                    />
                </div>

                <div class="mt-4" v-if="showSecondaryButton">
                    <BaseSecondaryButton
                        buttonText="Generate Invoice"
                        :status="generateInvoiceStatus"
                        :disabled="disableFormButton"
                        @button-clicked="handleGenerateInvoice"
                    />
                </div>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { PaymentAccount, SaleRequestStatus, Status } from '@/types';
import { SelectedItemsTotalAmount, PaymentDetails } from '@/pages/Sales/RecordSale/v4/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SalesValidations from '@/pages/Sales/RecordSale/v4/validations';

import SalesModule from '@/store/modules/sale';
import { SaleCustomer, defaultCustomer } from '@/pages/Sales/types';

const sales = namespace('sale');

let salesModule: SalesModule;

@Component
export default class PaymentForm extends Mixins(UtilityMixins, CurrencyMixins, SalesValidations) {
    @Prop({ required: true }) readonly selectedCurrencyKey!: number;
    @Prop({ required: true }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: '' }) readonly action!: string;
    @Prop({ required: false }) readonly isEstimate!: boolean;
    @Prop({ default: false }) readonly isEstimateConversion!: boolean;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;

    private formattedAmountPaid = '';
    private unformattedAmountPaid = '';
    private disableAmountPaidField = true;
    private defaultPaymentState: PaymentDetails = {
        paymentAccountKey: '',
        amountPaid: { amount: 0, currencyKey: this.selectedCurrencyKey },
        transactionDate: this.transactionDate,
        balanceDueDate: '',
        hasPartialPayment: false,
    };
    private payment: PaymentDetails = { ...this.defaultPaymentState };

    @sales.State
    public salesRequestStatus!: SaleRequestStatus;

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    @sales.State
    private previousStateOfPaymentForm!: PaymentDetails;

    get transactionIsBeingEdited(): boolean {
        return this.action === 'edit';
    }

    get submitButtonText(): string {
        return this.isEstimate ? 'Generate Quotation' : 'Submit';
    }

    get showSecondaryButton(): boolean {
        if (this.isEstimate) return false;

        return this.customerSelected;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get customerName() {
        return this.selectedCustomer.name || 'Unnamed Customer';
    }

    get customerSelected() {
        return this.selectedCustomer.name.length > 0;
    }

    get balanceAmount(): number {
        const amountPaid = this.payment.amountPaid;
        const totalAmount = this.totalAmount.netAmount;
        const balance = totalAmount - amountPaid.amount;
        if (amountPaid.amount > totalAmount) return 0;
        // if (this.amountInputFieldHasError) return 0;
        return balance;
    }

    get netAmount() {
        const amount = this.totalAmount.netAmount;
        const currencyKey = Number(this.selectedCurrencyKey);
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    get balanceWithCurrency(): string {
        const currencyKey = Number(this.selectedCurrencyKey);
        const balance = this.balanceAmount;
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount: balance });
    }

    get amountInputFieldHasError(): boolean {
        const amountInputError = this.paymentError.amountPaid;
        return this.hasError(amountInputError);
    }

    get showBalanceDueAndDate() {
        return this.payment.amountPaid.amount < this.totalAmount.netAmount;
    }

    get disableFormButton() {
        return (
            !this.paymentFormIsValidated ||
            this.salesRequestStatus.createSale === Status.LOADING ||
            this.salesRequestStatus.updateSale === Status.LOADING ||
            this.salesRequestStatus.recordEstimate === Status.LOADING ||
            this.salesRequestStatus.updateEstimate === Status.LOADING ||
            this.salesRequestStatus.generatePdf === Status.LOADING
        );
    }

    get submitStatus(): Status {
        if (this.salesRequestStatus.generatePdf === Status.LOADING) return Status.LOADING;

        const isEdit = this.action == 'edit';

        if (this.isEstimate) {
            if (isEdit) return this.salesRequestStatus.updateEstimate;
            else return this.salesRequestStatus.recordEstimate;
        }

        if (isEdit) return this.salesRequestStatus.updateSale;

        return this.salesRequestStatus.createSale;
    }

    get generateInvoiceStatus(): Status {
        if (this.salesRequestStatus.generatePdf === Status.LOADING) return Status.LOADING;
        return this.salesRequestStatus.createSale;
    }

    get enablePartPayment() {
        return !this.transactionIsBeingEdited && this.disableAmountPaidField && this.customerSelected;
    }

    private formatAndValidateAmount(amountPaid: string) {
        this.unformattedAmountPaid = amountPaid;
        const amount = this.convertFormattedFiguresToNumber(amountPaid);
        if (this.validateAmountPaid(String(amount), this.totalAmount.netAmount)) {
            this.formattedAmountPaid = this.convertFigureToCurrency(amount);
            const currencyKey = Number(this.selectedCurrencyKey);

            this.$set(this.payment, 'amountPaid', { amount, currencyKey });

            if (this.paymentError['balanceDueDate']) this.validateBalanceDate();
            return;
        }

        if (amount) this.formattedAmountPaid = this.convertFigureToCurrency(amount);
        else this.formattedAmountPaid = amountPaid;
    }

    private validateBalanceDate() {
        this.validateBalanceDueDate(this.balanceAmount, this.payment.balanceDueDate, this.transactionDate);
    }

    private handleGenerateInvoice() {
        if (this.payment.paymentAccountKey || this.payment.hasPartialPayment) {
            this.validatePaymentForm(this.payment, this.totalAmount.netAmount);
            if (!this.paymentFormIsValidated) return;

            this.$emit('generate-invoice', this.payment);
            return;
        }

        this.$emit('generate-no-payment-invoice');
    }

    private handlePaymentForm() {
        if (this.isEstimate) {
            this.$emit('generate-estimate');
            return;
        }

        this.validatePaymentForm(this.payment, this.totalAmount.netAmount);
        if (!this.paymentFormIsValidated) return;
        this.processSaleSubmission();
    }

    private resetBalanceDueDate() {
        this.payment.balanceDueDate = '';
    }

    private setAmountPaidField(amountPaid = 0) {
        if (!amountPaid) {
            const amount = this.totalAmount.netAmount;
            this.payment.amountPaid = { amount, currencyKey: this.selectedCurrencyKey };
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
        this.payment = {
            ...this.previousStateOfPaymentForm,
            transactionDate: this.transactionDate,
        };

        const amountPaid = this.payment.amountPaid.amount;

        if (this.action == 'edit') {
            this.disableAmountPaidField = true;

            if (amountPaid < this.totalAmount.netAmount) {
                if (amountPaid) this.formattedAmountPaid = this.convertFigureToCurrency(amountPaid);
                else this.formattedAmountPaid = '';
            }
            return;
        }

        if (!this.customerSelected || !this.payment.hasPartialPayment) {
            this.setAmountPaidField();
            return;
        }

        this.setAmountPaidField(amountPaid);
        this.disableAmountPaidField = false;
    }

    private processSaleSubmission() {
        this.$emit('process-sale-submission', this.payment);
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
        salesModule.setPaymentFormState(this.payment);
    }

    mounted() {
        salesModule = getModule(SalesModule, this.$store);
        this.prefillFormWithInitialData();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/payment-form';
</style>
