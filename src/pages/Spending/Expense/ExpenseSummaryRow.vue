<template>
    <div class="expense-summary-page__row">
        <div class="expense-summary-page__table-body">
            <div v-if="isFullExpenseSummaryPage" class="expense-summary-page__table-heading--icon"></div>
            <div
                :class="[
                    isFullExpenseSummaryPage
                        ? 'expense-summary-page__table-heading--number'
                        : 'expense-summary-page__table-heading--number-truncated',
                    '',
                ]"
            >
                {{ index + 1 }}
            </div>

            <div
                :class="[
                    isFullExpenseSummaryPage
                        ? 'expense-summary-page__table-heading--item'
                        : 'expense-summary-page__table-heading--item-truncated',
                ]"
            >
                {{ selectedItem.itemName }}
            </div>

            <div
                :class="[
                    isFullExpenseSummaryPage
                        ? 'expense-summary-page__table-heading--costing'
                        : 'expense-summary-page__table-heading--costing-truncated',
                ]"
                v-if="selectedItem.isMeasurable || selectedItem.quantity > 1"
            >
                {{ selectedItem.quantity }} x {{ selectedItem.expenseCurrency }}
                {{ selectedItem.unitCost | formatMoney }} /
                {{ getUnitDisplay(selectedItem.isMeasurable, selectedItem.quantity, selectedItem.measurementUnit) }}
            </div>

            <div
                :class="[
                    isFullExpenseSummaryPage
                        ? 'expense-summary-page__table-heading--costing'
                        : 'expense-summary-page__table-heading--costing-truncated',
                ]"
                v-else
            >
                {{ selectedItem.expenseCurrency }} {{ selectedItem.unitCost | formatMoney }}
            </div>

            <div
                :class="[
                    isFullExpenseSummaryPage
                        ? 'expense-summary-page__table-heading--amount-due'
                        : 'expense-summary-page__table-heading--amount-due-truncated',
                ]"
            >
                {{ selectedItem.expenseCurrency }} {{ selectedItem.netCost | formatMoney }}
            </div>

            <div class="expense-summary-page__table-heading--payment" v-if="isFullExpenseSummaryPage">
                <div class="expense-summary-page__table-heading__payment-amount">
                    {{ selectedItem.expenseCurrency }} {{ selectedItem.amountPaid | formatMoney }} (Cash)
                </div>
                <div class="expense-summary-page__table-heading__balance-due-amount" v-if="selectedItem.balance">
                    {{ selectedItem.expenseCurrency }} {{ selectedItem.balance | formatMoney }} Balance Due
                </div>
            </div>

            <div class="expense-summary-page__table-heading--vendor" v-if="isFullExpenseSummaryPage">
                {{ selectedItem.vendorName }}
            </div>

            <div class="expense-summary-page__table-heading--status" v-if="isFullExpenseSummaryPage">
                <p class="expense-summary-page__table-heading__status-text">Completed</p>
            </div>

            <div
                class="expense-summary-page__table-heading--edit-icon pointer"
                v-if="isFullExpenseSummaryPage"
                @click="$emit('edit-expense-item', index)"
            >
                <img src="@/assets/img/pencil.svg" class="expense-summary-page__edit-icon" />
            </div>

            <div
                class="expense-summary-page__table-heading--delete-icon pointer"
                v-if="isFullExpenseSummaryPage"
                @click="handleDeleteModal"
            >
                <img src="@/assets/img/trash-black-2.svg" class="expense-summary-page__delete-icon" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { ExpenseSummary } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';

const expenseSummaryDefault = {
    itemName: '',
    unitCost: 0,
    isMeasurable: false,
    quantity: 0,
    withholdingTax: 0,
    amountPaid: 0,
    bankName: '',
    vendorName: '',
    measurementUnit: '',
};

@Component
export default class ExpenseSummaryRow extends Mixins(UtilityMixins) {
    @Prop({ default: false }) readonly isFullExpenseSummaryPage!: boolean;
    @Prop({ default: expenseSummaryDefault }) readonly selectedItem!: ExpenseSummary;
    @Prop({ default: 0 }) readonly index!: number;

    private getUnitDisplay(isMeasurable: boolean, quantity: number, measurementUnit: string) {
        if (isMeasurable) return measurementUnit;

        if (quantity > 1) return measurementUnit;

        return '';
    }

    private handleDeleteModal() {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Remove Item',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.deleteExpenseItem();
            })
            .catch(err => err);
    }

    private deleteExpenseItem() {
        // show modal to tell user to confirm their action
        this.$emit('delete-expense-item', this.index);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-summary-row.scss';
</style>
