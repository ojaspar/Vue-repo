<template>
    <b-container class="expense-item" fluid>
        <b-row class="align-items-center">
            <b-col class="d-flex align-items-center" cols="4">
                <BaseCheckbox className="mr-4" id="checkItem" />
                <div class="expense-item__products d-flex flex-column">
                    <span>{{ expense.names | truncate }}</span>
                    <span class="txt--primary txt--bold">{{ expense.itemCount | itemMetaData }}</span>
                </div>
            </b-col>

            <b-col cols="3"
                ><span class="expense-item__amount d-flex flex-column">
                    <span>₦{{ expense.totalCost | formatMoney }}</span>
                    <span
                        v-text="paymentStatus({ amountPaid: expense.amountPaid, amount: expense.totalCost })"
                        :class="{
                            pending: expense.amountPaid !== expense.totalCost,
                            paid: expense.amountPaid === expense.totalCost,
                        }"
                        class="amount"
                    ></span>
                </span>
            </b-col>

            <b-col>
                <span class="expense-item__date">{{ expense.transactionDate | localDate }}</span>
            </b-col>

            <b-col>
                <font-awesome-icon icon="ellipsis-h" @click="toggleShowOptions" class="pointer"></font-awesome-icon>
                <div
                    class="dashboard-actions"
                    v-if="showOptions"
                    @blur="closeOptions"
                    tabindex="0"
                    ref="dashboardActions"
                >
                    <div class="dashboard-actions__anchor"></div>
                    <p
                        class="pointer d-flex dashboard-actions__action"
                        @click="handleRoute('Edit-Expense', expense.expenseKey)"
                    >
                        <img class="mr-4" src="@/assets/img/pencil.svg" alt="Edit icon" />Edit
                    </p>
                    <p class="pointer d-flex dashboard-actions__action">
                        <img class="mr-4" src="@/assets/img/trash-black.svg" alt="Delete Icon" />Delete
                    </p>
                    <p
                        class="pointer d-flex dashboard-actions__action"
                        @click="handleRoute('Add-Expense-Payment', expense.expenseKey)"
                    >
                        <img class="mr-4" src="@/assets/img/copy.svg" alt="Add Payment" />Add Payment
                    </p>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Expense } from '@/pages/Spending/Expense/types';

const expense: Expense = {
    expenseKey: '',
    transactionDate: '',
    names: [],
    totalCost: 0,
    amountPaid: 0,
    itemCount: 0,
    balance: 0,
};

@Component({
    filters: {
        truncate(items: string[]): string {
            const itemNames = items.join(', ').substring(0, 25);

            if (itemNames.length >= 25) {
                return `${itemNames}...`;
            }
            return itemNames;
        },

        itemMetaData(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class ExpenseItem extends Vue {
    private showOptions = false;

    public $refs!: {
        dashboardActions: HTMLFormElement;
    };

    public $options!: {
        filters: {
            formatMoney: Function;
        };
    };

    @Prop({ required: true, default: expense }) readonly expense!: Expense;

    private paymentStatus({ amount, amountPaid }: { amountPaid: number; amount: number }): string {
        if (amountPaid === 0) {
            return 'Waiting for Payment';
        }

        if (amountPaid === amount) {
            return 'Paid';
        }

        const { formatMoney } = this.$options.filters;
        return `₦${formatMoney(amount - amountPaid)} Balance`;
    }

    private toggleShowOptions() {
        this.showOptions = !this.showOptions;
        this.$nextTick(() => this.$refs.dashboardActions.focus());
    }

    private closeOptions() {
        this.showOptions = false;
    }

    private handleRoute(routeName: string, expenseKey: string) {
        this.$router.push({ name: routeName, params: { expenseKey } });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-item';
</style>
