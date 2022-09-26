<template>
    <keep-alive>
        <component
            :is="componentList[0]"
            :itemName="itemName"
            :unitCost="unitCost"
            :isMeasurable="isMeasurable"
            :quantity="quantity"
            :withholdingTaxPercentage="withholdingTaxPercentage"
            :amountPaid="amountPaid"
            :bankDetails="bankDetails"
            :vendorName="vendorName"
            :balance="balance"
            :netCost="netCost"
            :withholdingTaxType="withholdingTaxType"
            :withholdingAmount="withholdingAmount"
            :expenseCurrency="expenseCurrency"
            :measurementUnit="measurementUnit"
            :exchangeRate="exchangeRate"
            :indexOfCurrentComponent="indexOfCurrentComponent"
            :quantityReceived="quantityReceived"
            @show-vendor-selection-page="goToVendorSelectionPage"
            @show-expense-selection-page="goToExpenseSelectionPage"
            @show-add-expense-page="goToAddExpensePage"
            @remove-selected-vendor="removeSelectedVendor"
        />
    </keep-alive>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import ExpenseItemSummaryCardPw from '@/pages/Spending/Expense/ExpenseItemSummaryCardPwm.vue';

import dynamicComponentMixin from '@/mixins/dynamicComponents.ts';

import { BankDetails } from '@/pages/Spending/Expense/types';

@Component({
    components: {
        ExpenseItemSummaryCardPw,
    },
})
export default class ExpenseItemSummaryIndex extends Mixins(dynamicComponentMixin) {
    public activeComponentIndex = 0;
    private componentList = [ExpenseItemSummaryCardPw];

    @Prop({ required: true }) itemName!: string;
    @Prop({ required: true }) unitCost!: number;
    @Prop({ required: true }) isMeasurable!: boolean;
    @Prop({ required: true }) quantity!: number;
    @Prop({ required: true }) withholdingTaxPercentage!: 0;
    @Prop({ required: true }) amountPaid!: number;
    @Prop({ required: true }) balance!: number;
    @Prop({ required: true }) netCost!: number;
    @Prop({ required: true }) withholdingAmount!: number;
    @Prop({ required: true }) withholdingTaxType!: string;
    @Prop({ required: true }) bankDetails!: BankDetails;
    @Prop({ required: true }) vendorName!: string;
    @Prop({ required: true }) measurementUnit!: string;
    @Prop({ required: true }) expenseCurrency!: string;
    @Prop({ required: true }) exchangeRate!: string;
    @Prop({ required: true }) indexOfCurrentComponent!: number;
    @Prop({ required: true }) quantityReceived!: number;

    private goToVendorSelectionPage() {
        this.$emit('show-vendor-selection-page');
    }

    private goToExpenseSelectionPage() {
        this.$emit('show-expense-selection-page');
    }

    private removeSelectedVendor() {
        this.$emit('remove-selected-vendor');
    }
    private goToAddExpensePage() {
        this.$emit('show-add-expense-page');
    }
}
</script>

<style lang="scss"></style>
