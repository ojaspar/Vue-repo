<template>
    <b-container fluid>
        <b-row class="ms-tablet-plus-index__mid-section-table-header">
            <b-col cols="1">
                #
            </b-col>
            <b-col cols="3">
                Item
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'">
                Costing
            </b-col>

            <b-col cols="2">
                Total
            </b-col>

            <b-col>
                Delivery Status
            </b-col>
        </b-row>
        <div v-if="expenseRequestStatus.getExpenseDetails === 'LOADING'" class="ms-tablet-plus-index__loader-container">
            <Loader size="4" />
        </div>
        <b-row
            v-else
            class="ms-tablet-plus-index__mid-section-table-body"
            v-for="(item, index) in [expenseDetails]"
            :key="index"
        >
            <b-col cols="1">
                {{ index + 1 }}
            </b-col>

            <b-col cols="3">
                {{ expenseName(item.expenseItemType.name) }}
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'">
                {{ expenseCost(item) }}
                <template v-if="item.measurementType.name">
                    /
                    {{ item.measurementType.name }}
                </template>
            </b-col>

            <b-col cols="2">{{ item.totalCost | amountWithCurrency }} </b-col>

            <b-col class="d-flex align-items-start">
                <span :class="deliveryStatus(item).cssClass" class="mr-4">{{
                    deliveryStatus(item).deliveryStatus
                }}</span>
                <span
                    class="pointer"
                    v-if="itemStillHasOutstandingDelivery(item)"
                    @click="$parent.$emit('update-supply', item)"
                    ><img src="@/assets/img/refresh-update.svg"
                /></span>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

import { ExpenseDetails, ManageExpenseTransactionItem } from '@/pages/Spending/Expense/types';
import { MoneyObject } from '@/types';

@Component
export default class ExpenseItemListTable extends Mixins(UtilityMixins, ExpenseMixin) {
    @Prop({ default: 'general' }) expenseType!: string;

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

    public totalAmount(item: ManageExpenseTransactionItem): MoneyObject {
        const {
            unitCost: { amount, currencyKey },
            quantity,
        } = item;
        const total = amount * quantity;

        return {
            amount: total,
            currencyKey,
        };
    }
}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__supply-status {
        &--red {
            color: $notification-red;
        }
        &--yellow {
            color: $primary-yellow;
        }
        &--green {
            color: $primary-green;
        }
    }
    &__loader-container {
        margin: 10px auto;
        text-align: center;
    }
    &__update-section {
        display: flex;
        align-items: center;
        font-style: italic;
        font-size: 12px;
        color: $primary-color;
    }
    &__update-text {
        margin-left: 4px;
        cursor: pointer;
    }
    &__table-text {
        &--grey {
            color: $dark-grey-1;
            font-size: 14px;
        }
    }
}
</style>
