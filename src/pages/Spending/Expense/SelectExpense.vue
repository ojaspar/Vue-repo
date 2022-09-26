<template>
    <div class="select-expense">
        <ListSearchAndAddBar
            buttonText="New Item"
            @search-input-changed="updateSearchString"
            @add-new-resource="showAddNewExpenseForm"
        />

        <div class="select-expense__loader" v-if="getExpenseItemTypeRequestIsLoading">
            <Loader size="4" />
        </div>
        <template v-else>
            <template v-if="atLeastOneExpenseItemTypeExists">
                <!-- recent expenses -->
                <template v-if="showRecentExpenses">
                    <p class="select-expense__headline">Recent Expenses</p>
                    <div :class="avatarContainerClass">
                        <AvatarAndResource
                            v-for="expenseItemType in recentExpenseItems"
                            :item="expenseItemType"
                            :key="expenseItemType.expenseItemTypeKey"
                            :resourceName="expenseItemType.name"
                            :itemKey="expenseItemType.expenseItemTypeKey"
                            :expandedItemKey="expandedItem['recent']"
                            @full-details-toggled="toggleFullDetail(expenseItemType.expenseItemTypeKey, 'recent')"
                            @resource-selected="showAddExpensePage(expenseItemType)"
                        >
                            <template v-if="hasAmount(expenseItemType.lastTransactionAmount)">
                                <span class="select-expense__item--amount" key="amount">{{
                                    expenseItemType.lastTransactionAmount | amountWithCurrency
                                }}</span>

                                <i
                                    v-if="expenseItemType.lastTransactionDate"
                                    class="select-expense__item--date"
                                    key="date"
                                >
                                    {{ new Date(expenseItemType.lastTransactionDate) | humanReadableDateTime }}</i
                                >
                            </template>
                            <!-- drop-down content -->
                            <template v-slot:drop-down>
                                <div class="d-flex flex-column">
                                    <span
                                        class="select-expense__item--amount"
                                        key="amount"
                                        v-if="hasAmount(expenseItemType.lastTransactionAmount)"
                                        >{{ expenseItemType.lastTransactionAmount | amountWithCurrency }}</span
                                    >
                                    <span class="select-expense__info" v-if="expenseItemType.notes">{{
                                        expenseItemType.notes
                                    }}</span>
                                    <span
                                        class="select-expense__info"
                                        v-if="hasAmount(expenseItemType.totalFinancialYearAmount)"
                                        >{{ expenseItemType.totalFinancialYearAmount | amountWithCurrency }}</span
                                    >
                                    <div class="select-expense__button-row avatar-and-resource__actions-container">
                                        <p
                                            class="avatar-and-resource__action select-expense__select mr-4"
                                            @click.stop="showAddExpensePage(expenseItemType)"
                                        >
                                            <img
                                                src="@/assets/img/select-resource.svg"
                                                class="select-expense__edit--icon"
                                            />Select Item
                                        </p>
                                        <p
                                            class="avatar-and-resource__action select-expense__edit"
                                            @click.stop="handleEditExpense(expenseItemType)"
                                        >
                                            <img src="@/assets/img/pencil.svg" class="select-expense__edit--icon" />Edit
                                            Details
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </AvatarAndResource>
                    </div>
                </template>

                <!-- All expenses -->
                <p class="select-expense__headline">{{ headlineText }}</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="expenseItemType in expenseListToBePickedFrom"
                        :item="expenseItemType"
                        :resourceName="expenseItemType.name"
                        :key="expenseItemType.expenseItemTypeKey"
                        :itemKey="expenseItemType.expenseItemTypeKey"
                        :expandedItemKey="expandedItem['all']"
                        @full-details-toggled="toggleFullDetail(expenseItemType.expenseItemTypeKey, 'all')"
                        @resource-selected="showAddExpensePage(expenseItemType)"
                    >
                        <template v-if="hasAmount(expenseItemType.lastTransactionAmount)">
                            <span class="select-expense__item--amount" key="amount">{{
                                expenseItemType.lastTransactionAmount | amountWithCurrency
                            }}</span>

                            <i v-if="expenseItemType.lastTransactionDate" class="select-expense__item--date" key="date">
                                {{ new Date(expenseItemType.lastTransactionDate) | humanReadableDateTime }}</i
                            >
                        </template>
                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <div class="d-flex flex-column">
                                <span
                                    class="select-expense__item--amount"
                                    key="amount"
                                    v-if="hasAmount(expenseItemType.lastTransactionAmount)"
                                    >{{ expenseItemType.lastTransactionAmount | amountWithCurrency }}</span
                                >
                                <span class="select-expense__info" v-if="expenseItemType.notes">{{
                                    expenseItemType.notes
                                }}</span>
                                <span
                                    class="select-expense__info"
                                    v-if="hasAmount(expenseItemType.totalFinancialYearAmount)"
                                    >{{ expenseItemType.totalFinancialYearAmount | amountWithCurrency }}</span
                                >
                                <div class="select-expense__button-row avatar-and-resource__actions-container">
                                    <p
                                        class="avatar-and-resource__action select-expense__select mr-4"
                                        @click.stop="showAddExpensePage(expenseItemType)"
                                    >
                                        <img
                                            src="@/assets/img/select-resource.svg"
                                            class="select-expense__edit--icon"
                                        />Select Item
                                    </p>
                                    <p
                                        class="avatar-and-resource__action select-expense__edit"
                                        @click.stop="handleEditExpense(expenseItemType)"
                                    >
                                        <img src="@/assets/img/pencil.svg" class="select-expense__edit--icon" />Edit
                                        Details
                                    </p>
                                </div>
                            </div>
                        </template>
                    </AvatarAndResource>

                    <div class="select-expense__no-item-found" v-if="noMatchFound">
                        <p>Looks like you haven't added this item to your list</p>
                        <p>Click the New Item link above to add this item</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="select-expense__no-item-found">
                    <p>Looks like you haven't added any item to your list</p>
                    <p>Click the New Item link above to add an item</p>
                </div>
            </template>
        </template>

        <EditExpenseItem
            v-if="editMode"
            :name="selectedExpense.name"
            :description="selectedExpense.description"
            :expenseItemTypeKey="selectedExpense.expenseItemTypeKey"
            :editMode="editMode"
            @close-edit-modal="setEditMode"
            @show-error-notification="showErrorNotification"
            @show-success-notification="showSuccessNotification"
        />

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import EditExpenseItem from '@/pages/Spending/Expense/EditExpenseItem.vue';

import ExpenseModule from '@/store/modules/expense';

import { ExpenseItemType, ExpenseRequestStatus } from '@/pages/Spending/Expense/types';
import UtilityMixins from '@/mixins/Utility';
import { Status } from '@/types';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component({
    components: {
        EditExpenseItem,
    },
})
export default class SelectExpense extends Mixins(UtilityMixins) {
    private searchString = '';
    private editMode = false;
    private selectedExpense: ExpenseItemType = {
        name: '',
        expenseItemTypeKey: '',
        lastTransactionDate: '',
        totalFinancialYearAmount: { currencyKey: 0, amount: 0 },
        notes: '',
        lastTransactionAmount: { amount: 0, currencyKey: 0 },
        isMeasurable: false,
        description: '',
        financialYearStartDate: '',
    };
    private expandedItem: any = {
        recent: '',
        all: '',
    };

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'edit-expense-toaster',
        position: 'b-toaster-top-right',
    };

    @expenses.State
    private expenseItemTypes!: Array<ExpenseItemType>;

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.Action
    private getExpenseItemTypes!: () => Array<ExpenseItemType>;

    get recentExpenseItems(): Array<ExpenseItemType> {
        const recentExpenseItems = this.sortByInteractionDate(this.expenseItemTypes, 'lastTransactionDate');
        return recentExpenseItems.slice(0, 2);
    }

    get showRecentExpenses(): boolean {
        return this.searchString.length === 0;
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Expenses';
    }

    get getExpenseItemTypeRequestIsLoading(): boolean {
        return this.expenseRequestStatus.getExpenseItemsTypes === Status.LOADING;
    }

    get atLeastOneExpenseItemTypeExists(): boolean {
        return this.expenseItemTypes.length > 0;
    }

    get noMatchFound(): boolean {
        return this.expenseListToBePickedFrom.length === 0;
    }

    get expenseListToBePickedFrom(): Array<ExpenseItemType> {
        const allExpenseItems = this.sortArrayByName(this.expenseItemTypes.slice());
        return allExpenseItems.filter((expenseItemType: ExpenseItemType) =>
            expenseItemType.name.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    private hasAmount(amount: any) {
        if (!amount) return false;

        if (!amount.amount) return false;

        return true;
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private showAddNewExpenseForm() {
        this.$emit('show-add-new-expense-item-form', this.searchString);
    }

    private showAddExpensePage(selectedExpenseItem: ExpenseItemType) {
        this.$emit('show-new-expense-form', selectedExpenseItem);
    }

    private handleEditExpense(expenseItemType: ExpenseItemType) {
        this.selectedExpense = expenseItemType;
        this.setEditMode(true);
    }

    private setEditMode(editMode: boolean) {
        this.editMode = editMode;
    }

    private toggleFullDetail(toggledItemKey: string, listType: string) {
        const { all, recent } = this.expandedItem;

        if (listType === 'all') {
            if (all === toggledItemKey) {
                this.expandedItem.all = '';
                return;
            }

            this.expandedItem.all = toggledItemKey;
            this.expandedItem.recent = '';
            return;
        }

        if (recent === toggledItemKey) {
            this.expandedItem.recent = '';
            return;
        }

        this.expandedItem.recent = toggledItemKey;
        this.expandedItem.all = '';
        return;
    }

    private showSuccessNotification(message = 'Operation successful') {
        this.showToaster({
            ...this.toaster,
            type: 'success',
            title: 'Success!',
            message,
        });
    }

    private showErrorNotification(message = 'Operation Failed!') {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message,
        });
    }

    mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);
        expenseModule.getExpenseItemTypes();
    }
}
</script>
