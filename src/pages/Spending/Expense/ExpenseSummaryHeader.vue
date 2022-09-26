<template>
    <div class="expense-summary-page__table-header">
        <div v-if="isFullExpenseSummaryPage" class="expense-summary-page__table-heading--icon"></div>
        <div
            :class="[
                isFullExpenseSummaryPage
                    ? 'expense-summary-page__table-heading--number'
                    : 'expense-summary-page__table-heading--number-truncated',
            ]"
        >
            #
        </div>

        <div
            :class="[
                isFullExpenseSummaryPage
                    ? 'expense-summary-page__table-heading--item'
                    : 'expense-summary-page__table-heading--item-truncated',
            ]"
        >
            Item
        </div>

        <div
            :class="[
                isFullExpenseSummaryPage
                    ? 'expense-summary-page__table-heading--costing'
                    : 'expense-summary-page__table-heading--costing-truncated',
            ]"
        >
            Cost
        </div>

        <div
            :class="[
                isFullExpenseSummaryPage
                    ? 'expense-summary-page__table-heading--amount-due'
                    : 'expense-summary-page__table-heading--amount-due--truncated',
            ]"
        >
            Amount Due
        </div>

        <div class="expense-summary-page__table-heading--payment" v-if="isFullExpenseSummaryPage">
            Payment
        </div>

        <div class="expense-summary-page__table-heading--vendor" v-if="isFullExpenseSummaryPage">
            Vendor
        </div>

        <div class="expense-summary-page__table-heading--status" v-if="isFullExpenseSummaryPage">
            Status
        </div>
        <div class="expense-summary-page__table-heading--edit-icon" v-if="isFullExpenseSummaryPage"></div>
        <div class="expense-summary-page__table-heading--delete-icon" v-if="isFullExpenseSummaryPage"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class ExpenseSummaryHeader extends Vue {
    @Prop({ default: false }) readonly isFullExpenseSummaryPage!: boolean;
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-summary-header.scss';
</style>
