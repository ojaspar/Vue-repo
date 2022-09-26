<template>
    <div class="tax-total">
        <!-- Sub Total Amount -->
        <div class="tax-total__total--sub">
            <span>Sub Total</span>
            <span>
                {{ subTotal }}
            </span>
        </div>

        <!-- Total Excl. VAT -->
        <div class="tax-total__total-excl-vat" v-if="showTotalExclVAT">
            <span class="tax-total__total-excl-vat--label">
                Total Excl. VAT
            </span>
            <span class="tax-total__total-excl-vat--amount">
                {{ totalExclVAT }}
            </span>
        </div>

        <!-- VAT Addition -->
        <div class="tax-total__checkbox">
            <BaseCheckbox
                inputContainerClass="tax-total__checkbox--input"
                labelText="Add VAT"
                labelClass="tax-total__checkbox--label"
                id="vat-addition"
                @change="toggleVatAddition"
                v-model="taxOptions.addVat"
            />
            <span class="tax-total__checkbox--amount">
                {{ vatAmount }}
            </span>
        </div>

        <!-- WHT Deduction -->
        <div v-if="!isEstimate" class="d-none">
            <div class="tax-total__checkbox tax-total__checkbox--top-space">
                <BaseCheckbox
                    inputContainerClass="tax-total__checkbox--input"
                    labelText="Deduct Withholding Tax"
                    labelClass="tax-total__checkbox--label"
                    id="wht-deduction"
                    :disabled="disableWHTOption"
                    @change="toggleWhtDeduction"
                    v-model="taxOptions.deductWht"
                />

                <span class="tax-total__checkbox--amount">
                    {{ whtAmount }}
                </span>
            </div>

            <!-- No Customer Error on Mobile -->
            <div v-if="showSelectCustomerHint" class="tax-total__no-customer">
                Kindly select a Customer to enter deducted WHT
            </div>
        </div>

        <!-- Net Amount -->
        <div class="tax-total__total--net">
            <span>Total Amount</span>
            <span>
                {{ netAmount }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import {
    ItemTaxOptions,
    defaultTaxOptions,
    SelectedItemsTotalAmount,
    defaultItemsTotalAmount,
} from '@/pages/Sales/RecordSale/v4/types';

import UtilityMixins from '@/mixins/Utility';
import SalesMixin from '../../SalesMixin';

@Component
export default class TaxAndTotal extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly selectedCurrencyKey!: number;
    @Prop({ default: () => defaultItemsTotalAmount }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: false }) readonly updateTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;
    @Prop({ required: false }) readonly isEstimate!: boolean;
    @Prop({ required: true }) readonly customerSelected!: boolean;

    private taxOptions: ItemTaxOptions = { ...defaultTaxOptions };

    get disableWHTOption(): boolean {
        return this.isEstimate || !this.customerSelected;
    }

    get showSelectCustomerHint(): boolean {
        return !this.isEstimate && !this.customerSelected && this.userIsOnMobile;
    }

    get subTotal(): string {
        const amount = this.totalAmount.subTotal;
        const currencyKey = Number(this.selectedCurrencyKey);
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    get netAmount() {
        const amount = this.totalAmount.netAmount;
        const currencyKey = Number(this.selectedCurrencyKey);
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    get vatAmount() {
        const amount = this.totalAmount.vatAmount;
        const currencyKey = Number(this.selectedCurrencyKey);
        if (!this.taxOptions.addVat) return '--';
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    get showTotalExclVAT(): boolean {
        return this.taxOptions.isInclusiveVAT;
    }

    get totalExclVAT() {
        const amount = this.totalAmount.totalExclVAT;
        const currencyKey = Number(this.selectedCurrencyKey);
        if (!this.taxOptions.addVat) return '--';
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    get whtAmount() {
        const amount = this.totalAmount.whtAmount;
        const currencyKey = Number(this.selectedCurrencyKey);
        if (!this.taxOptions.deductWht) return '--';
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    private toggleVatAddition() {
        this.taxOptions.addVat = !this.taxOptions.addVat;
        this.emitItemsTaxOptions();
    }

    private toggleWhtDeduction() {
        this.taxOptions.deductWht = !this.taxOptions.deductWht;
        this.emitItemsTaxOptions();
    }

    private setWhtPercentage(isTenPercent: boolean) {
        this.taxOptions.whtIsTenPercent = isTenPercent;
        this.emitItemsTaxOptions();
    }

    private updateItemsTaxOptions() {
        this.taxOptions = this.selectedItemsTaxOptions;
    }

    private emitItemsTaxOptions() {
        this.$emit('update-tax-options', this.taxOptions);
    }

    @Watch('updateTaxOptions', { immediate: true })
    checkToUpdateTaxOptions(updateTaxOptions: boolean) {
        if (!updateTaxOptions) return;
        this.updateItemsTaxOptions();
    }

    @Watch('disableTaxOptions', { immediate: true })
    checkToDisableTaxOptions(disableTaxOptions: boolean) {
        if (disableTaxOptions) {
            this.taxOptions.deductWht = false;
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/tax-total';
</style>
