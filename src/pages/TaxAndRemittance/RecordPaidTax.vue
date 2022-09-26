<template>
    <b-container fluid class="tax-page">
        <b-row class="tax-page-container">
            <SuccessPage :successText="successText" v-if="showSuccessPage">
                <b-row class="tax-page-container__success-page-buttons">
                    <b-col sm="12" md="6">
                        <BasePrimaryButton
                            @button-clicked="recordAnotherPayment"
                            buttonText="New Tax Payment"
                            :overRideButtonClass="true"
                        />
                    </b-col>

                    <b-col>
                        <BasePrimaryButton
                            @button-clicked="viewTaxLiabilities"
                            buttonText="View Liabilities"
                            :overRideButtonClass="true"
                        />
                    </b-col>
                </b-row>
            </SuccessPage>

            <template v-else>
                <b-row>
                    <b-col>
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultSelectField="true"
                            defaultOptionText="Select Tax Type"
                            floatingLabelText="Tax Type"
                            textProperty="name"
                            keyProperty="taxTypeKey"
                            valueProperty="taxTypeKey"
                            :options="sortedTaxTypes"
                            @input="handleTaxTypeSelection"
                        />
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <BaseDateFieldWithBorderAndFloatingLabel
                            placeholder="Payment Period"
                            floatingLabelText="Payment Period"
                            v-model="form.period"
                            :minimum-view="minimumDatePeriod.minimumView"
                            :format="minimumDatePeriod.format"
                            :disabled="taxTypeHasNotBeenSelectedYet"
                        />
                    </b-col>
                </b-row>

                <b-row>
                    <b-col sm="12" md="6">
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultSelectField="true"
                            defaultOptionText="-- Select Account --"
                            floatingLabelText="Paid From"
                            keyProperty="paymentAccountKey"
                            valueProperty="paymentAccountKey"
                            textProperty="displayNameWithBalance"
                            :options="updatedPaymentAccounts"
                            :disabled="taxTypeHasNotBeenSelectedYet"
                            v-model="form.paymentAccountKey"
                        />
                    </b-col>
                    <b-col>
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Amount Paid"
                            :value="convertFigureToCurrency(form.amountPaid.amount)"
                            @input="handleAmountInput"
                            :disabled="taxTypeHasNotBeenSelectedYet"
                        />
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <BaseDateFieldWithBorderAndFloatingLabel
                            placeholder="Transaction Date"
                            floatingLabelText="Transaction Date"
                            v-model="form.transactionDate"
                            :disabled="taxTypeHasNotBeenSelectedYet"
                        />
                    </b-col>
                </b-row>

                <BlockErrorMessage :message="error" />

                <BasePrimaryButton
                    buttonText="Submit"
                    className="tax-page-container__submit-button"
                    @button-clicked="remitTaxAmountPaid"
                    :status="taxRequestStatus.remitTax"
                />
            </template>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { RemitTaxForm, TaxLiabilityRemittanceForm, TaxPeriodDuration, TaxType } from '@/pages/TaxAndRemittance/types';
import { PaymentAccount, Status } from '@/types';

import ExpenseModule from '@/store/modules/expense';

import UtilityMixins from '@/mixins/Utility';
import TaxMixin from './TaxMixin';
import CurrencyMixins from '@/mixins/currency';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component
export default class RecordPaidTax extends Mixins(UtilityMixins, CurrencyMixins, TaxMixin) {
    @expenses.State
    private paymentAccounts!: PaymentAccount[];

    private taxTypeIsAnnual = false;
    private form: RemitTaxForm = {
        period: '',
        amountPaid: { currencyKey: 0, amount: 0 },
        transactionDate: '',
        taxTypeKey: '',
        paymentAccountKey: '',
    };
    private showSuccessPage = false;
    private selectedTaxType: TaxType = {} as TaxType;

    // get annualTaxPeriods(): Array<number> {
    //     const years = [];
    //     const currentYear = new Date().getFullYear();
    //     const defaultYear = 2020; // this value would probably be in an environment variable
    //     const yearDifference = currentYear - defaultYear;

    //     if (!yearDifference) return [2020];

    //     for (let i = 0; i <= yearDifference; i++) {
    //         years.push(currentYear - i);
    //     }

    //     return years;
    // }

    get taxTypeHasNotBeenSelectedYet(): boolean {
        return this.form.taxTypeKey === '';
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get minimumDatePeriod(): { minimumView: string; format: string } {
        return this.taxTypeIsAnnual
            ? { minimumView: 'year', format: 'yyyy' }
            : { minimumView: 'month', format: 'MMMM yyyy' };
    }

    get taxWasRemittedSuccessfully(): boolean {
        return this.taxRequestStatus.remitTax === Status.SUCCESS;
    }

    get successText(): string {
        return `${this.$options.filters.amountWithCurrency(this.form.amountPaid)} - ${
            this.selectedTaxType.name
        } payment has been recorded successfully`;
    }

    private async getPaymentAccounts() {
        await expenseModule.getPaymentAccounts();
    }

    private async getAllTaxTypes() {
        await this.taxModule.getTaxypes();
    }

    private handleAmountInput(amountInput: string) {
        const parsedAmount = this.convertFormattedCurrencyToNumber(amountInput);
        this.form.amountPaid.amount = parsedAmount;
    }

    private handleTaxTypeSelection(taxTypeKey: string) {
        this.form.taxTypeKey = taxTypeKey;

        const selectedTaxType = this.taxTypes.find((taxType: TaxType) => taxType.taxTypeKey === taxTypeKey);

        if (!selectedTaxType) return;

        this.selectedTaxType = selectedTaxType;

        if (selectedTaxType.frequency === TaxPeriodDuration.ANNUALLY) {
            this.taxTypeIsAnnual = true;
            return;
        }

        this.taxTypeIsAnnual = false;
    }

    private setCurrencyKey() {
        this.form.amountPaid.currencyKey = this.homeCurrencyKey;
    }

    private recordAnotherPayment() {
        this.form = {
            period: '',
            amountPaid: { currencyKey: 0, amount: 0 },
            transactionDate: '',
            taxTypeKey: '',
            paymentAccountKey: '',
        };

        this.setCurrencyKey();

        this.showSuccessPage = false;
    }

    private async remitTaxAmountPaid() {
        const { amountPaid, paymentAccountKey, transactionDate, period = '', taxTypeKey } = this.form;

        const selectedTaxPeriod = new Date(period);
        const year = selectedTaxPeriod.getFullYear();
        const month = selectedTaxPeriod.getMonth();

        const monthAndYear = `${this.monthsOfTheYear[month]}, ${year}`;

        const taxPeriod = this.taxTypeIsAnnual ? year.toString() : monthAndYear;

        const taxRemittance: TaxLiabilityRemittanceForm = {
            amountPaid,
            paymentAccountKey,
            transactionDate,
            period: taxPeriod,
            taxTypeKey,
        };

        await this.taxModule.remitTax(taxRemittance);

        if (this.taxWasRemittedSuccessfully) {
            this.showSuccessPage = true;
        }
    }

    private viewTaxLiabilities() {
        this.$router.push({ name: 'ViewTaxLiabilities' });
    }

    created() {
        expenseModule = getModule(ExpenseModule, this.$store);

        this.getPaymentAccounts();
        this.getAllTaxTypes();

        this.setCurrencyKey();

        this.$parent.$emit('update-page-title', 'Record Paid Tax');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/tax/tax-page';
</style>
