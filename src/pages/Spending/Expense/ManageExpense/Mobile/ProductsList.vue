<template>
    <div>
        <div
            v-if="expenseRequestStatus.getExpenseDetails === 'LOADING'"
            class="manage-expense-index__loader-container mt-5 text-center"
        >
            <Loader size="4" />
        </div>
        <div v-else v-for="(item, index) in [expenseDetails]" :key="index">
            <ShowResourceOnClick>
                <template v-slot:content-on-same-level-as-dropdown-icon>
                    <div class="manage-expense-index__name-section">
                        <span class="manage-expense-index__text--black">{{
                            expenseName(item.expenseItemType.name)
                        }}</span>
                        <span class="manage-expense-index__text--grey ml-2" v-if="!isSalary"
                            >x {{ item.quantity }}</span
                        >
                        <p
                            class="manage-expense-index__delivery-status ml-2"
                            :class="deliveryStatus(item).cssClass"
                        ></p>
                    </div>
                </template>

                <template v-slot:extra-content-in-top-section>
                    <b-row class="manage-expense-index__supply-status-section">
                        <b-col class="manage-expense-index__text--black">
                            {{ expenseCost(item) }}
                            <template v-if="item.measurementType.name"> / {{ item.measurementType.name }} </template>
                        </b-col>

                        <b-col v-if="false" :class="deliveryStatus(item).cssClass" class="mr-4">{{
                            deliveryStatus(item).deliveryStatus
                        }}</b-col>
                    </b-row>
                </template>

                <template v-slot:drop-down-content>
                    <!-- Subtotal -->
                    <b-row key="amount">
                        <b-col cols="12" class="manage-expense-index__text--black">
                            <span class="manage-expense-index__text--black">Amount: </span>
                            {{ totalExcludingVat(item) | amountWithCurrency }}
                        </b-col></b-row
                    >

                    <!-- Vat section -->
                    <b-row key="vat">
                        <b-col cols="12" class="manage-expense-index__text--black">
                            {{ totalExcludingVat(item) | amountWithCurrency }}
                            <span class="manage-expense-index__text--grey"> Excl.</span> +
                            {{ item.withholdingTaxAmount | amountWithCurrency }}
                            <span class="manage-expense-index__text--grey">VAT</span>
                        </b-col></b-row
                    >

                    <!-- Total section and VAT type -->
                    <b-row key="total">
                        <b-col
                            ><div class="manage-expense-index__text--black manage-expense-index__dropdown-total">
                                Total: {{ item.totalCost | amountWithCurrency }}
                            </div>
                        </b-col>
                    </b-row>

                    <!-- Notes and Files -->
                    <b-row key="notes">
                        <b-col cols="12" class="manage-expense-index__text--grey manage-expense-index__notes-text"
                            >Notes: {{ item.notes }}</b-col
                        >
                        <!-- <b-col
                            v-if="itemStillHasOutstandingSupply(product)"
                            class="manage-expense-index__supply-text"
                            @click.stop="handleUpdateSupplyClick(product)"
                            ><img src="@/assets/img/update-icon-blue.svg" />Update Supply</b-col
                        > -->
                        <b-col cols="12" v-if="false">File: ...</b-col>
                    </b-row>
                </template>
            </ShowResourceOnClick>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';
import CurrencyMixins from '@/mixins/currency';

import { ProductInProductDetailsForm } from '@/pages/Sales/types';
import { ExpenseDetails } from '@/pages/Spending/Expense/types';
import { MoneyObject } from '@/types';

@Component
export default class ItemsList extends Mixins(ExpenseMixin, CurrencyMixins) {
    @Prop({ default: 'general' }) expenseType!: string;

    private itemStillHasOutstandingSupply({ quantitySupplied, quantity }: ProductInProductDetailsForm): boolean {
        return quantity > quantitySupplied;
    }

    private totalExcludingVat({ totalCost, unitCost, withholdingTaxAmount }: ExpenseDetails): MoneyObject {
        const totalExcludingVat = totalCost.amount - withholdingTaxAmount.amount;

        return {
            amount: totalExcludingVat,
            currencyKey: unitCost.currencyKey,
        };
    }

    get isSalary(): boolean {
        return this.expenseType == 'salary';
    }

    private expenseName(name: string): string {
        if (name) return name;

        if (this.isSalary) return 'Salary or Commission';

        return '';
    }

    private unitCostText(unitCost: MoneyObject): string {
        return this.$options.filters.amountWithCurrency(unitCost);
    }

    private expenseCost(expense: ExpenseDetails): string {
        if (this.isSalary) return this.unitCostText(expense.unitCost);

        return `${expense.quantity} x ${this.unitCostText(expense.unitCost)}`;
    }

    private handleUpdateSupplyClick(product: ProductInProductDetailsForm) {
        this.$parent.$emit('update-supply', product);
    }
}
</script>

<style lang="scss">
.manage-expense-index {
    background: $primary-white;

    &__mid-section-items-list {
        border-bottom: 1px solid $faint-grey;
        padding: 10px 0;
    }
    &__mid-section-align-items {
        display: flex;
        align-items: center;
    }
    &__supply-status-section {
        margin-top: 8px;
    }
    &__dropdown-total {
        margin-top: 15px;
        display: inline-block;
        border-top: 1px solid $faint-grey;
        border-bottom: 1px solid $faint-grey;
    }
    &__notes-text {
        margin-top: 15px;
    }
    &__supply-text {
        font-style: italic;
        font-size: 12px;
        color: $primary-color;
        margin-top: 13px;
    }

    &__delivery-status {
        width: 10px;
        height: 10px;

        border-radius: 50%;
        margin-bottom: 0;
        margin-left: 5px;

        background: currentColor;
    }

    &__name-section {
        display: flex;
        align-items: center;
    }
}
</style>
