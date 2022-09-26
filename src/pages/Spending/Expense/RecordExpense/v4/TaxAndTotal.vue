<template>
    <div class="tax-total">
        <!-- Sub Total Amount -->
        <div class="tax-total__total--sub">
            <span>Sub Total</span>
            <span>
                {{ subTotal }}
            </span>
        </div>

        <!-- VAT Addition -->
        <div class="tax-total__checkbox tax-total__checkbox--bottom-space d-none">
            <BaseCheckbox
                inputContainerClass="tax-total__checkbox--input"
                labelText="Add VAT"
                labelClass="tax-total__checkbox--label"
                id="vat-addition"
                @change="toggleVatAddition"
                v-model="taxOptions.addVat"
            />
            <span class="tax-total__checkbox--amount">
                {{ wWhtAmount }}
            </span>
        </div>

        <!-- WHT Deduction -->
        <div>
            <div class="tax-total__checkbox">
                <BaseCheckbox
                    inputContainerClass="tax-total__checkbox--input"
                    labelText="Deduct Withholding Tax"
                    labelClass="tax-total__checkbox--label"
                    id="wht-deduction"
                    :disabled="disableTaxOptions"
                    @change="toggleWhtDeduction"
                    v-model="taxOptions.deductWht"
                />

                <span class="tax-total__checkbox--amount">
                    {{ wWhtAmount }}
                </span>
            </div>

            <!-- No Vendor Error on Mobile -->
            <div v-if="showSelectVendorHint" class="tax-total__no-vendor">
                Kindly select a Vendor to deduct WHT
            </div>
        </div>

        <!-- Net Amount -->
        <div class="tax-total__total--net">
            <span>Net Amount</span>
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
} from '@/pages/Spending/Expense/RecordExpense/v4/types';

import UtilityMixins from '@/mixins/Utility';

@Component
export default class TaxAndTotal extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ default: () => defaultItemsTotalAmount }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: false }) readonly updateTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;
    @Prop({ default: false }) readonly disableTaxOptions!: boolean;

    private taxOptions: ItemTaxOptions = { ...defaultTaxOptions };

    get showSelectVendorHint(): boolean {
        return this.disableTaxOptions && this.userIsOnMobile;
    }

    get subTotal(): string {
        const amount = this.totalAmount.subTotal;
        const currencyKey = Number(this.functionalCurrency);
        return this.$options.filters.amountWithCurrency({ currencyKey, amount });
    }

    get netAmount() {
        const amount = this.totalAmount.netAmount;
        const currencyKey = Number(this.functionalCurrency);
        return this.$options.filters.amountWithCurrency({ currencyKey, amount });
    }

    get wWhtAmount() {
        const amount = this.totalAmount.whtAmount;
        const currencyKey = Number(this.functionalCurrency);
        if (!this.taxOptions.deductWht) return '--';
        return this.$options.filters.amountWithCurrency({ currencyKey, amount });
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
@import 'src/styles/pages/spending/expenses/record-expense/v4/tax-total';
</style>
