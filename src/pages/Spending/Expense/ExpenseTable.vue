<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-sized-table" v-if="userIsOnDesktop">
            <b-row class="expense-table__heading">
                <b-col class="pl-0">Date / ID</b-col>
                <b-col>Transaction</b-col>
                <b-col cols="4">Items</b-col>
                <b-col>Amount</b-col>
                <b-col>Delivery Status</b-col>
            </b-row>

            <div v-if="expensesAreAvailable">
                <b-row
                    class="expense-table__content pointer"
                    v-for="(expense, index) in expenses"
                    :key="index"
                    @click="manageExpense(expense.expenseItemKey, expense.expenseType)"
                >
                    <font-awesome-icon
                        v-if="false"
                        icon="ellipsis-h"
                        class="pointer mr-3 ml-3"
                        title="More options"
                        @mousedown="preventBlurFromHappening"
                        @click="toggleShowOptions(index)"
                    />
                    <b-col
                        cols="1"
                        class="expense-table__more-options"
                        tabindex="-1"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p
                            class="pointer d-flex expense-table__content-action"
                            :class="disabledOrNot(expense.expenseType)"
                            @click.stop="editInitialTransaction(expense.expenseItemKey, expense.expenseType)"
                        >
                            <img class="mr-4" src="@/assets/img/pencil.svg" alt="Edit icon" />Edit Transaction
                        </p>
                        <!-- <p class="pointer d-flex expense-table__content-action">
                            <img class="mr-4" src="@/assets/img/sidebar/financing-inactive.svg" alt="Add Payment" /> Add
                            Payment
                        </p> -->
                        <p class="pointer d-flex expense-table__content-action">
                            <img class="mr-4" src="@/assets/img/trash-black.svg" alt="Delete Icon" /> Cancel
                        </p>
                        <p
                            class="pointer d-flex expense-table__content-action"
                            :class="disabledOrNot(expense.expenseType)"
                            @click.stop="duplicateTransaction(expense.expenseItemKey, expense.expenseType)"
                        >
                            <img class="mr-4" src="@/assets/img/copy.svg" alt="Copy Icon" />Duplicate
                        </p>
                    </b-col>

                    <b-col class="pl-0">
                        <p class="content-text m-0">
                            {{ expense.transactionDate | monthDateYearFormat }}
                        </p>
                    </b-col>

                    <b-col>
                        <p class="content-text m-0" v-if="expense.expenseType">{{ expense.expenseType }}</p>
                        <p class="content-text__meta">{{ expense.vendorName }}</p>
                    </b-col>

                    <b-col cols="4">
                        <p class="content-text m-0">
                            {{ expense.name }}
                        </p>
                        <p v-if="expense.notes" class="content-text m-0">{{ expense.notes }}</p>
                    </b-col>

                    <b-col>
                        <p class="content-text m-0">{{ expense.totalCost | amountWithCurrency }}</p>
                        <p class="content-text__meta txt-red" v-show="expense.balance.amount !== 0">
                            {{ expense.balance | amountWithCurrency }} <i>Balance Due</i>
                        </p>
                    </b-col>

                    <b-col>
                        <p
                            :class="[expenseDeliveryClass(expense.deliveryStatus), 'm-0']"
                            v-if="!isSalary(expense.expenseType)"
                        >
                            {{ expense.deliveryStatus }}
                        </p>
                        <p class="content-text__meta--date dark-grey" v-if="!isCompletedStatus(expense.deliveryStatus)">
                            {{ expense.deliveryDueDate | monthDateYearFormat }}
                        </p>
                        <p :class="[expenseDeliveryClass('Completed'), 'm-0']" v-if="isSalary(expense.expenseType)">
                            Completed
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="expense-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="expense-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="medium-sized-table" v-if="userIsOnTablet">
            <div v-if="expensesAreAvailable">
                <b-row
                    class="mobile-table"
                    v-for="(expense, index) in expenses"
                    :key="index"
                    @click="manageExpense(expense.expenseItemKey, expense.expenseType)"
                >
                    <b-col class="mobile-table__content">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ expense.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text">
                                <span class="dark-grey" v-if="expense.expenseType">
                                    {{ expense.expenseType }}
                                </span>
                                <span class="txt--primary">{{ vendorDisplay(expense.vendorName) }}</span>
                            </p>
                            <p class="mobile-content__text" v-if="!showExpenseDetails(index)">
                                {{ expense.name }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showExpenseDetails(index)">
                                    <p
                                        :class="expenseDeliveryClass(expense.deliveryStatus)"
                                        v-if="!isSalary(expense.expenseType)"
                                    >
                                        {{ `${expense.deliveryStatus} Delivery` }}
                                        <span class="dark-grey ml-3" v-if="!isCompletedStatus(expense.deliveryStatus)">
                                            <i>Due {{ expense.deliveryDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ expense.name }} <br />
                                        {{ expense.notes }}
                                    </p>
                                    <p class="mt-3 mb-0" v-if="!isSalary(expense.expenseType)">
                                        <span class="mr-5 pointer mobile-content__text">
                                            <font-awesome-icon
                                                icon="plus-circle"
                                                title="Add Payment"
                                                class="table-icon"
                                            />
                                            Add Payment
                                        </span>

                                        <span
                                            class="mr-5 pointer mobile-content__text"
                                            :class="disabledOrNot(expense.expenseType)"
                                            @click.stop="
                                                editInitialTransaction(expense.expenseItemKey, expense.expenseType)
                                            "
                                        >
                                            <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                            Edit
                                        </span>

                                        <span
                                            class="mr-5 pointer mobile-content__text"
                                            :class="disabledOrNot(expense.expenseType)"
                                            @click.stop="
                                                duplicateTransaction(expense.expenseItemKey, expense.expenseType)
                                            "
                                        >
                                            <font-awesome-icon icon="clone" title="Duplicate" class="table-icon" />
                                            Duplicate
                                        </span>

                                        <span class="mr-5 pointer mobile-content__text">
                                            <font-awesome-icon icon="times-circle" title="Cancel" class="table-icon" />
                                            Cancel
                                        </span>
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon
                                    :icon="expenseCardDetailsIcon(index)"
                                    title="Edit"
                                    class="card-icon"
                                />
                            </p>

                            <span v-show="!showExpenseDetails(index)">
                                <p class="mobile-content__text align-right">
                                    {{ expense.totalCost | amountWithCurrency }}
                                    <span class="mobile-content__balance ml-2" v-if="expense.balance.amount !== 0">
                                        ( {{ expense.balance | amountWithCurrency }} Balance)
                                    </span>
                                </p>
                                <p
                                    :class="[expenseDeliveryClass(expense.deliveryStatus), 'align-right']"
                                    v-if="!isSalary(expense.expenseType)"
                                >
                                    {{ `${expense.deliveryStatus} Delivery` }}
                                </p>
                            </span>

                            <span v-show="showExpenseDetails(index)">
                                <p class="mobile-content__text align-right mt-0">
                                    {{ expense.totalCost | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__balance ml-2" v-if="expense.balance.amount !== 0">
                                    {{ expense.balance | amountWithCurrency }} Balance
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div v-if="userIsOnMobile">
            <div v-if="expensesAreAvailable">
                <b-row
                    class="mobile-table"
                    v-for="(expense, index) in expenses"
                    :key="index"
                    @click="manageExpense(expense.expenseItemKey, expense.expenseType)"
                >
                    <b-col class="mobile-table__content">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ expense.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text">
                                <span class="dark-grey" v-if="expense.expenseType">
                                    {{ expense.expenseType }}
                                </span>
                                <span class="txt--primary">{{ vendorDisplay(expense.vendorName) }}</span>
                            </p>
                            <span v-show="!showExpenseDetails(index)">
                                <p class="mobile-content__text" v-if="!showExpenseDetails(index)">{{ expense.name }}</p>
                            </span>
                            <transition name="slide-up-fade">
                                <span v-show="showExpenseDetails(index)">
                                    <p
                                        :class="expenseDeliveryClass(expense.deliveryStatus)"
                                        v-if="!isSalary(expense.expenseType)"
                                    >
                                        {{ `${expense.deliveryStatus} Delivery` }}
                                        <span class="dark-grey ml-3" v-if="!isCompletedStatus(expense.deliveryStatus)">
                                            <i>Due {{ expense.deliveryDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ expense.name }} <br />
                                        {{ expense.notes }}
                                    </p>
                                    <p class="mt-3 mb-0" v-if="!isSalary(expense.expenseType)">
                                        <span class="mr-5 pointer mobile-content__text">
                                            <font-awesome-icon
                                                icon="plus-circle"
                                                title="Add Payment"
                                                class="table-icon"
                                            />
                                            Add Payment
                                        </span>

                                        <span
                                            class="mr-5 pointer mobile-content__text"
                                            :class="disabledOrNot(expense.expenseType)"
                                            @click.stop="
                                                editInitialTransaction(expense.expenseItemKey, expense.expenseType)
                                            "
                                        >
                                            <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                            Edit
                                        </span>
                                    </p>
                                    <p class="mt-3 mb-0" v-if="!isSalary(expense.expenseType)">
                                        <span
                                            class="mr-5 pointer mobile-content__text"
                                            :class="disabledOrNot(expense.expenseType)"
                                            @click.stop="
                                                duplicateTransaction(expense.expenseItemKey, expense.expenseType)
                                            "
                                        >
                                            <font-awesome-icon icon="clone" title="Duplicate" class="table-icon" />
                                            Duplicate
                                        </span>

                                        <span class="mr-5 pointer mobile-content__text">
                                            <font-awesome-icon icon="times-circle" title="Cancel" class="table-icon" />
                                            Cancel
                                        </span>
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon
                                    :icon="expenseCardDetailsIcon(index)"
                                    title="Edit"
                                    class="card-icon"
                                />
                            </p>

                            <span v-show="!showExpenseDetails(index)">
                                <p
                                    v-if="!isSalary(expense.expenseType)"
                                    :class="[expenseDeliveryClass(expense.deliveryStatus), 'align-right', 'mt-2']"
                                >
                                    {{ `${expense.deliveryStatus} Delivery` }}
                                </p>
                                <p class="mobile-content__text align-right mt-0">
                                    {{ expense.totalCost | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__balance ml-2" v-if="expense.balance.amount !== 0">
                                    ( {{ expense.balance | amountWithCurrency }} Balance)
                                </p>
                            </span>

                            <span v-show="showExpenseDetails(index)">
                                <p class="mobile-content__text align-right mt-0">
                                    {{ expense.totalCost | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__balance align-right" v-if="expense.balance.amount !== 0">
                                    <span class="dark-grey">Balance:</span> {{ expense.balance | amountWithCurrency }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Ref } from 'vue-property-decorator';

import { ExpenseTableList } from '@/pages/Spending/Expense/types';
import { VueExtension } from '@/types';

import UtilityMixin from '@/mixins/Utility';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class ExpenseTable extends Mixins(UtilityMixin) {
    @Prop({ default: () => [] }) readonly expenses!: ExpenseTableList[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;

    @Ref() readonly tableOptions!: HTMLFormElement;

    public $root!: VueExtension;

    private selectedTableOptionsIndex = '';

    private selectedExpenseCardIndex = '';

    get expensesAreAvailable(): boolean {
        return this.expenses.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.expensesAreAvailable) {
            return 'There are no expenses available';
        }
        return '';
    }

    get requestInProgess() {
        return this.status === 'LOADING';
    }

    private disabledOrNot(expenseType: string): string {
        if (!this.isSalary(expenseType)) return '';

        return 'txt-disabled';
    }

    private isSalary(expenseType: string): boolean {
        return expenseType == 'Salary and Commission';
    }

    private vendorDisplay(vendorName: string): string {
        if (vendorName) return '(' + vendorName + ')';

        return '';
    }

    private expenseDeliveryClass(deliveryStatus: string) {
        if (deliveryStatus === 'Pending') {
            return 'content-text__pending';
        }
        if (deliveryStatus === 'Partial') {
            return 'content-text__partial';
        }
        return 'content-text__completed';
    }

    private isCompletedStatus(deliveryStatus: string): boolean {
        return deliveryStatus === 'Completed';
    }

    private expenseCardDetailsIcon(cardIndexNumber: string) {
        return this.selectedExpenseCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private showExpenseDetails(cardIndexNumber: string) {
        return this.selectedExpenseCardIndex === cardIndexNumber;
    }

    private caretShouldShow(cardIndexNumber: string): boolean {
        return this.expenseCardDetailsIcon(cardIndexNumber) === 'chevron-up';
    }

    private toggleExpenseDetailsCard(cardIndexNumber: string) {
        if (this.selectedExpenseCardIndex === cardIndexNumber) {
            this.selectedExpenseCardIndex = '';
            return;
        }
        this.selectedExpenseCardIndex = cardIndexNumber;
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private manageExpense(expenseKey: string, expenseType: string) {
        if (this.isSalary(expenseType))
            this.$router.push({
                name: 'ManageSalary',
                params: {
                    expenseKey,
                },
            });
        else
            this.$router.push({
                name: 'ManageExpense',
                params: {
                    expenseKey,
                },
            });
    }

    private duplicateTransaction(expenseKey: string, expenseType: string) {
        if (this.isSalary(expenseType)) {
            // this.$router.push({
            //     name: 'Duplicate-Salary',
            //     params: {
            //         expenseKey,
            //     },
            // });
        } else
            this.$router.push({
                name: 'Duplicate-Expense',
                params: {
                    expenseKey,
                },
            });
    }

    private editInitialTransaction(expenseKey: string, expenseType: string) {
        if (this.isSalary(expenseType)) {
            // this.$router.push({
            //     name: 'Edit-Previous-Salary',
            //     params: {
            //         expenseKey,
            //     },
            // });
        }

        // this.$router.push({
        //     name: 'Edit-Previous-Expense',
        //     params: {
        //         expenseKey,
        //     },
        // });
        else
            this.$router.push({
                name: 'ManageExpense',
                params: {
                    expenseKey,
                },
            });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-table';
</style>
