<template>
    <b-container fluid class="expense-dashboard">
        <div class="expense-dashboard__content">
            <!-- Dashboard Cards -->
            <b-row class="expense-dashboard__cards">
                <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index" />
            </b-row>

            <b-row class="expense-dashboard__transactions">
                <p>Transaction History</p>

                <p class="expense-dashboard__transactions--export">
                    <DownloadCsv class="d-flex" :data="expenseExport" :name="expenseExportName">
                        <img src="@/assets/img/black-download-icon.svg" class="mr-2" />Export
                    </DownloadCsv>
                </p>
            </b-row>

            <section class="general-module-dashboard__content-area">
                <!-- Search, Dates, Add New Expense -->
                <DashboardMidSection
                    class="mt-0"
                    :searchStringValue="expenseSearchString"
                    :activeStatus="expenseStatusFilter"
                    :statusOptions="expenseStatusOptions"
                    :fromDate="fromDate"
                    :toDate="toDate"
                    @search-input-changed="updateExpenseSearchString"
                    @from-date-filter-has-changed="setFromDateFilter"
                    @status-filter-changed="handleEpenseStatusFilterChange"
                    @to-date-filter-has-changed="setToDateFilter"
                    @apply-filters="applyFilters"
                />

                <!-- Expense Table -->
                <b-row>
                    <b-col class="general-module-dashboard__table">
                        <transition name="fade" mode="out-in" appear>
                            <ExpenseTable
                                :expenses="expensesToBeDisplayed"
                                :searchMatchFound="searchMatchFound"
                                :status="expenseRequestStatus.getAllExpenses"
                            />
                        </transition>
                    </b-col>
                </b-row>
            </section>

            <div class="general-module-dashboard__pagination-container">
                <b-pagination
                    size="lg"
                    v-if="expensesAreAvailable"
                    v-model="currentPage"
                    :total-rows="totalNumberOfRows"
                    :per-page="perPage"
                />
            </div>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DashboardMidSection from '@/components/ui/ModulesDashboard/DashboardMidSection.vue';
import ExpenseTable from '@/pages/Spending/Expense/ExpenseTable.vue';

import ExpenseModule from '@/store/modules/expense';

import {
    Status,
    DashboardStat,
    DashboardCardContainerClass,
    DashboardCardColumnSize,
    VueExtension,
    DashboardStatusOption,
    Filters,
    DashboardCardItem,
} from '@/types';
import {
    ExpenseTableList,
    ExpenseDashboardCards,
    ExpenseRequestStatus,
    ExpenseTableExport,
    PaginatedExpenses,
} from '@/pages/Spending/Expense/types';

import UtilityMixin from '@/mixins/Utility';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component({
    components: {
        DashboardMidSection,
        ExpenseTable,
    },
})
export default class ExpenseDashboard extends Mixins(UtilityMixin) {
    @expenses.State
    private dasboardCardRequest!: Status;

    @expenses.State
    private expenseDashbardCards!: ExpenseDashboardCards;

    @expenses.State
    private expenses!: PaginatedExpenses;

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    public $root!: VueExtension;

    private expenseStatusFilter = 'all-expenses';

    private expenseSearchString = '';

    private fromDate = '';
    private toDate = '';
    private currentPage = 1;
    private perPage = 10;

    private expenseStatusOptions: Array<DashboardStatusOption> = [
        { key: 'all-expenses', name: 'All Expenses' },
        { key: 'draft', name: 'Draft' },
        { key: 'pending-deliveries', name: 'Pending Deliveries' },
        { key: 'pending-payments', name: 'Pending Payments' },
        { key: 'completed', name: 'Completed' },
        { key: 'cancelled', name: 'Cancelled' },
    ];

    get dashboardStats(): Array<DashboardCardItem> {
        const {
            expensesInCurrentMonth,
            countOfExpensesInCurrentMonth,
            unpaidExpenses,
            countOfUnpaidExpenses,
            countOfPendingDeliveries,
        } = this.expenseDashbardCards;

        return [
            {
                title: `Expenses in ${this.currentMonthInWords}`,
                midSection: this.$options.filters.amountWithCurrency(expensesInCurrentMonth),
                icon: require('@/assets/img/wallet-blue.svg'),
                meta: { title: 'Total Transaction', value: String(countOfExpensesInCurrentMonth) },
                cssClass: 'expense-dashboard__cards--expenses',
            },
            {
                title: 'Unpaid Expenses',
                midSection: this.$options.filters.amountWithCurrency(unpaidExpenses),
                icon: require('@/assets/img/coins.svg'),
                meta: { title: 'Total Transactions', value: String(countOfUnpaidExpenses) },
                cssClass: 'expense-dashboard__cards--unpaid',
            },
            {
                title: 'Pending Deliveries',
                midSection: this.$options.filters.amountWithCurrency({
                    amount: countOfPendingDeliveries,
                    currencyKey: 0,
                }),
                icon: require('@/assets/img/delivery-truck.svg'),
                meta: { title: '', value: '' },
                cssClass: 'expense-dashboard__cards--pending',
            },
        ];
    }

    get expenseSearchStringIsEmpty() {
        return this.expenseSearchString === '';
    }

    get searchMatchFound() {
        if (this.expenseSearchStringIsEmpty) return true;
        if (!this.expenseSearchStringIsEmpty && this.expenses.items.length < 1) return true;
        return this.expenses.items.length > 0 && this.expensesToBeDisplayed.length > 0;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get dateFilteredExpenses(): ExpenseTableList[] {
        return this.statusFilteredExpenses.filter(expense => {
            if (this.fromDate && !this.toDate) {
                return new Date(expense.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(expense.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(expense.transactionDate) >= new Date(this.fromDate) &&
                    new Date(expense.transactionDate) <= new Date(this.toDate)
                );
            }
            return expense;
        });
    }

    get statusFilteredExpenses(): ExpenseTableList[] {
        if (this.expenseStatusFilter === 'draft' || this.expenseStatusFilter === 'cancelled') {
            return [];
        }
        if (this.expenseStatusFilter === 'pending-deliveries') {
            return this.expenses.items.filter((expense: ExpenseTableList) => {
                return this.getLowerCase(expense.deliveryStatus).includes('pending');
            });
        }
        if (this.expenseStatusFilter === 'pending-payments') {
            return this.expenses.items.filter((expense: ExpenseTableList) => {
                return expense.balance.amount > 0;
            });
        }
        if (this.expenseStatusFilter === 'completed') {
            return this.expenses.items.filter((expense: ExpenseTableList) => {
                return this.getLowerCase(expense.deliveryStatus).includes('completed');
            });
        }
        return this.expenses.items;
    }

    get expensesToFilter(): ExpenseTableList[] {
        if (this.datesNotSelected) {
            return this.statusFilteredExpenses;
        }
        return this.dateFilteredExpenses;
    }

    get expensesToBeDisplayed(): ExpenseTableList[] {
        if (this.expenseSearchStringIsEmpty && this.datesNotSelected) {
            return this.statusFilteredExpenses;
        }
        return this.filterExpenseBySearchString;
    }

    get expensesAreAvailable(): boolean {
        return this.expensesToBeDisplayed.length > 0;
    }

    get filterExpenseBySearchString(): ExpenseTableList[] {
        return this.expensesToFilter.filter(expense => {
            const values = Object.values(expense);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.expenseSearchString.toLowerCase());
            });
        });
    }

    get expenseExport(): ExpenseTableExport[] {
        return this.expensesToBeDisplayed.map((expense: ExpenseTableList) => ({
            name: expense.name,
            transactionDate: this.$options.filters.monthDateYearFormat(expense.transactionDate),
            totalCost: this.$options.filters.amountWithCurrency(expense.totalCost),
            balance: this.$options.filters.amountWithCurrency(expense.balance),
            deliveryDueDate: this.$options.filters.monthDateYearFormat(expense.deliveryDueDate),
            expenseType: expense.expenseType,
            vendorName: expense.vendorName,
            deliveryStatus: expense.deliveryStatus,
        }));
    }

    get expenseExportName(): string {
        return `expenses-${new Date().getDay()}-${this.currentMonth}-${this.currentYear}.csv`;
    }

    get totalNumberOfRows(): number {
        return this.expenses.total;
    }

    private getLowerCase(inputString: string): string {
        if (inputString) {
            return inputString.toLowerCase();
        }

        return '';
    }

    private updateExpenseSearchString(searchString: string) {
        this.expenseSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private applyFilters({ category, fromDate, toDate }: Filters) {
        let expenseStatusToUse = 'all-expenses';
        if (category) expenseStatusToUse = category;

        this.expenseStatusFilter = expenseStatusToUse;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    private updateExpenseStatusFilter(status: string) {
        this.expenseStatusFilter = status;
    }

    private handleEpenseStatusFilterChange(selectedStatus: string) {
        this.updateExpenseStatusFilter(selectedStatus);
        this.updateExpenseSearchString('');
    }

    private goToExpensePage() {
        this.$router.push({ name: 'RecordExpense' });
    }

    private async getDashboardCardsInfo() {
        await expenseModule.getExpenseDashboardCardsInfo();
    }

    private async getExpenses() {
        await expenseModule.getAllExpenses({ limit: this.perPage, page: this.currentPage });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Expense Dashboard');
    }

    private goToRecordExpensePage() {
        this.$router.push({ name: 'RecordExpense' });
    }

    @Watch('currentPage')
    fetchSalesForCurrentPage() {
        this.getExpenses();
    }

    mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);

        this.getDashboardCardsInfo();
        this.getExpenses();

        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/general-module-dashboard';
@import 'src/styles/pages/spending/expenses/expense-dashboard';
</style>
