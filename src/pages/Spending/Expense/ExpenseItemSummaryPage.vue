<template>
    <div>
        <!-- Desktop screen -->
        <div v-if="$root.isLargeScreenSize" class="expense-summary-page__section--xl">
            <div class="expense-summary-page__table">
                <ExpenseSummaryHeader :isFullExpenseSummaryPage="isFullExpenseSummaryPage" />
                <div class="expense-summary-page__row-container">
                    <ExpenseSummaryRow
                        :isFullExpenseSummaryPage="isFullExpenseSummaryPage"
                        v-for="(selectedItem, index) in selectedExpenseItems"
                        :key="index"
                        :index="index"
                        :selectedItem="selectedItem"
                        @edit-expense-item="$emit('edit-expense-item', index)"
                        @delete-expense-item="$emit('delete-expense-item', index)"
                    />
                </div>
                <BaseButton
                    buttonText="Add Another Item"
                    class="expense-summary-page__add-new-item-btn expense-summary-page__add-new-item-btn--xl"
                    @button-clicked="$emit('show-expense-selection-page')"
                    :overRideButtonClass="true"
                    v-if="isFullExpenseSummaryPage && !previousExpenseIsBeingEdited"
                >
                    <CircularPlusSign />
                </BaseButton>
            </div>

            <div class="expense-summary-page__total-section--xl">
                <div class="expense-summary-page__total-amount-section--xl">
                    <span>Total:</span>
                    <span class="expense-summary-page__text--pull-right"
                        >{{ expenseCurrencySymbol }} {{ totalOfExpenseItems | formatMoney }}</span
                    >
                </div>
                <div class="expense-summary-page__amount-paid-amount-section--xl">
                    <span>Amount Paid:</span>
                    <span class="expense-summary-page__text--pull-right">
                        {{ expenseCurrencySymbol }}
                        {{ amountPaidOfExpenseItems | formatMoney }}</span
                    >
                </div>
                <div class="expense-summary-page__balance-amount-section--xl">
                    <span>Balance:</span>
                    <span class="expense-summary-page__text--pull-right">
                        {{ expenseCurrencySymbol }}
                        {{ balanceOfExpenseItems | formatMoney }}</span
                    >
                </div>
            </div>

            <div class="d-flex justify-content-center" v-if="selectedExpenseItemsIsNotEmpty">
                <BaseButton
                    buttonText="Proceed"
                    class="expense-summary-page__view-summary-btn"
                    @button-clicked="viewExpenseSummary"
                    :overRideButtonClass="true"
                    v-if="!isFullExpenseSummaryPage"
                />
                <BaseButton
                    buttonText="Submit"
                    class="expense-summary-page__submit-btn"
                    :overRideButtonClass="true"
                    @button-clicked="submitExpenses"
                    :status="requestStatus"
                    v-if="isFullExpenseSummaryPage"
                />
            </div>
        </div>

        <!-- Mobile screen -->
        <div v-else>
            <ExpenseItemSummaryPageRowMobileAndMedium
                v-for="(expenseItem, index) in selectedExpenseItems"
                :key="index"
                :index="index"
                :expenseItem="expenseItem"
                :indexOfItemBeingShown="indexOfItemBeingShown"
                @show-full-details="setIndexOfItemBeingShown"
                @edit-expense-item="$emit('edit-expense-item', index)"
                @delete-expense-item="$emit('delete-expense-item', index)"
            />
            <BaseButton
                buttonText="Add Another Item"
                class="expense-summary-page__add-new-item-btn"
                :overRideButtonClass="true"
                v-if="!previousExpenseIsBeingEdited"
                @button-clicked="addAnotherExpense"
            >
                <CircularPlusSign />
            </BaseButton>

            <div class="expense-summary-page__total-balance-section">
                <p class="expense-summary-page__total-section">
                    <span class="expense-summary-page__total-text">Total:</span
                    ><span class="expense-summary-page__total-amount-text">
                        {{ expenseCurrencySymbol }} {{ totalOfExpenseItems | formatMoney }}</span
                    >
                </p>
                <p class="expense-summary-page__amount-paid-section">
                    <span class="expense-summary-page__amount-paid-text">Amount Paid: </span
                    ><span class="expense-summary-page__amount-paid-amount-text">
                        {{ expenseCurrencySymbol }} {{ amountPaidOfExpenseItems | formatMoney }}</span
                    >
                </p>
                <p class="expense-summary-page__balance-section">
                    <span class="expense-summary-page__total-balance-text">Balance:</span
                    ><span class="expense-summary-page__total-balance-amount-text">
                        {{ expenseCurrencySymbol }} {{ balanceOfExpenseItems | formatMoney }}</span
                    >
                </p>
            </div>
            <div class="d-flex justify-content-center">
                <BaseButton
                    buttonText="Submit"
                    class="expense-summary-page__submit-btn"
                    :overRideButtonClass="true"
                    @button-clicked="submitExpenses"
                    :status="requestStatus"
                >
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import ExpenseItemSummaryPageRowMobileAndMedium from '@/pages/Spending/Expense/ExpenseItemSummaryPageRowMobileAndMedium.vue';
import ExpenseSummaryHeader from '@/pages/Spending/Expense/ExpenseSummaryHeader.vue';
import ExpenseSummaryRow from '@/pages/Spending/Expense/ExpenseSummaryRow.vue';

import { ExpenseSummary } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

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

@Component({
    components: {
        ExpenseItemSummaryPageRowMobileAndMedium,
        ExpenseSummaryHeader,
        ExpenseSummaryRow,
    },
})
export default class ExpenseItemSummaryPage extends Mixins(UtilityMixins, CurrencyMixins) {
    private indexOfItemBeingShown = '';

    @Prop({ default: expenseSummaryDefault }) readonly selectedExpenseItems!: Array<ExpenseSummary>;
    @Prop({ default: false }) readonly isFullExpenseSummaryPage!: boolean;
    @Prop({ default: false }) previousExpenseIsBeingEdited!: boolean;
    @Prop({ required: true }) readonly requestStatus!: string;

    get expenseCurrencySymbol() {
        if (this.selectedExpenseItems.length > 0) return this.selectedExpenseItems[0].expenseCurrency;

        return this.defaultCurrency.currencySymbol;
    }

    get totalOfExpenseItems() {
        return this.selectedExpenseItems.reduce(
            (previousValue: number, expenseItem: ExpenseSummary) => previousValue + expenseItem.netCost,
            0,
        );
    }

    get balanceOfExpenseItems() {
        return this.selectedExpenseItems.reduce((previousValue: number, expenseItem: ExpenseSummary) => {
            return previousValue + expenseItem.balance;
        }, 0);
    }

    get amountPaidOfExpenseItems() {
        return this.selectedExpenseItems.reduce((previousValue: number, expenseItem: ExpenseSummary) => {
            return previousValue + expenseItem.amountPaid;
        }, 0);
    }

    get selectedExpenseItemsIsNotEmpty(): boolean {
        return this.selectedExpenseItems.length > 0;
    }

    @Watch('currentWindowWidth')
    handlePageResize() {
        if (this.userIsOnDesktop) {
            this.$emit('resize-page-for-desktop');
        } else {
            this.$emit('resize-page-for-mobile');
        }
    }

    private addAnotherExpense() {
        this.$emit('show-expense-selection-page');
    }

    private viewExpenseSummary() {
        this.$emit('show-expense-summary-page');
    }

    private submitExpenses() {
        this.$emit('submit-expenses');
    }

    private setIndexOfItemBeingShown(indexToShow: number) {
        if (!this.indexOfItemBeingShown || indexToShow !== Number(this.indexOfItemBeingShown)) {
            this.indexOfItemBeingShown = indexToShow.toString();
            return;
        }

        this.indexOfItemBeingShown = '';
        return;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-summary-page';
</style>
