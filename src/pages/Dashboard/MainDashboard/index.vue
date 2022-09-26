<template>
    <div class="main-dashboard">
        <div v-if="showMainLoader" class="main-dashboard__loader">
            <Loader size="3" />
        </div>

        <template v-else>
            <template v-if="isMigrated">
                <div class="main-dashboard__content">
                    <div class="main-dashboard__content--center">
                        <div class="main-dashboard__top">
                            <div class="main-dashboard__top--header">
                                {{ greetings }},
                                <span class="main-dashboard__top--name">{{ userDetails.firstName }}</span>
                            </div>

                            <p class="mb-0" v-if="!noTransaction">
                                Your business is doing great, keep up the good work.
                            </p>
                            <p class="mb-0" v-if="!noTransaction">Mzuri is here to assist at any point</p>

                            <div
                                v-if="userIsOnMobile && noTransaction"
                                class="main-dashboard__not-migrated--welcome-msg--text"
                            >
                                It’s easy to get started with Mzuri: We’ll walk you through recording your first sales &
                                expenses below.
                            </div>
                            <div
                                v-if="!userIsOnMobile && noTransaction"
                                class="main-dashboard__not-migrated--welcome-msg--text"
                            >
                                It’s easy to get started with Mzuri:
                                <span
                                    class="main-dashboard__not-migrated--welcome-msg--link-text"
                                    @click="$router.push({ name: 'AddBank' })"
                                >
                                    Add a Bank Account
                                </span>
                                and then start telling us what money has come in and out of that account. We’ll walk you
                                through recording your first sales & expenses below.
                            </div>
                        </div>

                        <div class="main-dashboard__business-info">
                            <PeriodicRangeTab
                                :tabs="periodicTabs"
                                :defaultActiveTab="activeTab"
                                @periodic-tab-changed="setActiveTab"
                            />

                            <div class="main-dashboard__business-stats">
                                <BusinessStatsCard :businessStat="businessStats.sales" />
                                <BusinessStatsCard :businessStat="businessStats.expenses" />
                            </div>

                            <div class="main-dashboard__chart">
                                <div class="main-dashboard__chart--header">
                                    <div>Total Sales / Total Expenses {{ chartDataRange }}</div>
                                    <div class="main-dashboard__chart--keys">
                                        <span>
                                            <font-awesome-icon
                                                icon="circle"
                                                class="main-dashboard__chart--sale-chart-key"
                                            />
                                            <span class="main-dashboard__chart--key-text"> Sales</span>
                                        </span>
                                        <span>
                                            <font-awesome-icon
                                                icon="circle"
                                                class="main-dashboard__chart--expense-chart-key"
                                            />
                                            <span class="main-dashboard__chart--key-text"> Expenses</span>
                                        </span>
                                    </div>
                                </div>
                                <BarChart :chartData="chartData" />
                            </div>
                        </div>
                    </div>

                    <div class="main-dashboard__content--right">
                        <BusinessLog :logDetails="businessLog" />

                        <div class="main-dashboard__quote-section">
                            <div class="my-auto">
                                <q>
                                    To be successful, you have to have your heart in your business, and your business in
                                    your heart.
                                </q>
                                <p class="text-right m-0">-Thomas Watson Sr.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="main-dashboard-transactions" v-if="userIsOnDesktop">
                    <header class="main-dashboard-transactions__header">
                        <p>
                            Recent Sales
                        </p>

                        <u class="pointer">
                            <p @click="goToRoute('Sales')">View All</p>
                        </u>
                    </header>

                    <article
                        :class="[
                            'main-dashboard-transactions__table',
                            salesHistoryIsEmpty && 'main-dashboard-transactions__table--empty',
                        ]"
                    >
                        <Loader class="mt-5" size="3" :isInline="false" v-if="salesHistoryIsBeingFetched" />

                        <p class="main-dashboard-transactions__table--no-content" v-else-if="salesHistoryIsEmpty">
                            No Recent Sales
                        </p>

                        <SalesHistory v-else :sales="salesHistory" />
                    </article>
                </section>

                <section class="main-dashboard-transactions" v-if="userIsOnDesktop">
                    <header class="main-dashboard-transactions__header">
                        <p>
                            Recent Expenses
                        </p>

                        <u class="pointer">
                            <p @click="goToRoute('Expenses')">View All</p>
                        </u>
                    </header>

                    <article
                        :class="[
                            'main-dashboard-transactions__table',
                            expenseHistoryIsEmpty && 'main-dashboard-transactions__table--empty',
                        ]"
                    >
                        <Loader class="mt-5" size="3" :isInline="false" v-if="expenseHistoryIsBeingFetched" />

                        <p class="main-dashboard-transactions__table--no-content" v-else-if="expenseHistoryIsEmpty">
                            No Recent Sales
                        </p>

                        <ExpenseHistory :expenses="expenseHistory" v-else />
                    </article>
                </section>
            </template>

            <div v-else class="main-dashboard__not-migrated">
                <div class="main-dashboard__not-migrated--top">
                    <div class="main-dashboard__not-migrated--welcome-msg">
                        <div class="main-dashboard__top--header">
                            {{ greetings }},
                            <span class="main-dashboard__top--name">{{ userDetails.firstName }}</span>
                        </div>
                        <div v-if="userIsOnMobile" class="main-dashboard__not-migrated--welcome-msg--text">
                            It’s easy to get started with Mzuri: We’ll walk you through recording your first sales &
                            expenses below.
                        </div>
                        <div v-else class="main-dashboard__not-migrated--welcome-msg--text">
                            It’s easy to get started with Mzuri:
                            <span
                                class="main-dashboard__not-migrated--welcome-msg--link-text"
                                @click="$router.push({ name: 'AddBank' })"
                            >
                                Add a Bank Account
                            </span>
                            and then start telling us what money has come in and out of that account. We’ll walk you
                            through recording your first sales & expenses below.
                        </div>
                    </div>

                    <div class="main-dashboard__not-migrated--quote-section">
                        <q>
                            To be successful, you have to have your heart in your business, and your business in your
                            heart.
                        </q>
                        <p class="text-right">-Thomas Watson Sr.</p>
                    </div>
                </div>

                <div class="main-dashboard__quick-links">
                    <div class="main-dashboard__quick-links--left">
                        <div class="main-dashboard__quick-links--header">Quick Links</div>
                        <div
                            class="main-dashboard__quick-links--link"
                            v-for="(link, index) in quickLinks.left"
                            :key="index"
                            @click="$router.push({ name: link.route })"
                        >
                            <span>
                                <p class="mb-1">{{ link.title }}</p>
                                <p class="main-dashboard__quick-links--description">{{ link.description }}</p>
                            </span>
                            <span>
                                <img src="@/assets/img/blue-arrow-right.svg" alt="" />
                            </span>
                        </div>
                    </div>
                    <div class="main-dashboard__quick-links--right">
                        <div
                            class="main-dashboard__quick-links--link"
                            v-for="(link, index) in quickLinks.right"
                            :key="index"
                            @click="$router.push({ name: link.route })"
                        >
                            <span>
                                <p class="mb-1">{{ link.title }}</p>
                                <p class="main-dashboard__quick-links--description">{{ link.description }}</p>
                            </span>
                            <span>
                                <img src="@/assets/img/blue-arrow-right.svg" alt="" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import BusinessStatsCard, { BusinessStats } from '@/pages/Dashboard/MainDashboard/BusinessStatCard.vue';
import BusinessLog from '@/pages/Dashboard/MainDashboard/BusinessLog.vue';
import BarChart from '@/pages/Dashboard/MainDashboard/BarChart.vue';
import SalesHistory from '@/pages/Sales/SalesTable.vue';
import ExpenseHistory from '@/pages/Spending/Expense/ExpenseTable.vue';

import { User, BusinessRequestStatus, Status } from '@/types';
import {
    DashboardSales,
    DashboardExpense,
    DashboardRequestStatus,
    BarChartData,
    DashboardCreditSales,
    DashboardCreditPurchases,
    DashboardLoanDebts,
} from '@/pages/Dashboard/types';

import { ExpenseRequestStatus, ExpenseTableList, PaginatedExpenses } from '@/pages/Spending/Expense/types';
import { PaginatedSales, SalesTableDetails } from '@/pages/Sales/types';
import { SaleRequestStatus } from '@/types';

import SessionStorageService from '@/services/sessionStorage';
import DashboardModule from '@/store/modules/dashboard';
import BusinessModule from '@/store/modules/business';
import ExpenseModule from '@/store/modules/expense';
import SalesModule from '@/store/modules/sale';

import UtilityMixins from '@/mixins/Utility';

interface WeeklyRange {
    startDate: Date;
    endDate: Date;
}

const dashboard = namespace('dashboard');
const business = namespace('business');
const expense = namespace('expense');
const sales = namespace('sale');

let dashboardModule: DashboardModule;
let businessModule: BusinessModule;
let salesModule: SalesModule;
let expenseModule: ExpenseModule;

@Component({ components: { BusinessStatsCard, BusinessLog, BarChart, SalesHistory, ExpenseHistory } })
export default class MainDashboardIndex extends Mixins(UtilityMixins) {
    private userDetails: User = {} as User;

    private activeTab = 'today';

    private weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    private months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    private weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];

    private periodicTabs = [
        { name: 'today', displayText: 'Today' },
        { name: 'week', displayText: 'Week' },
        { name: 'month', displayText: 'Month' },
    ];

    @dashboard.State
    public dashboardRequestStatus!: DashboardRequestStatus;

    @dashboard.State
    public error!: string;

    @dashboard.State
    public sales!: DashboardSales;

    @dashboard.State
    public expense!: DashboardExpense;

    @dashboard.State
    public onlySales!: number;

    @dashboard.State
    public onlyExpense!: number;

    @dashboard.State
    public barChartExpenseData!: Array<BarChartData>;

    @dashboard.State
    public barChartSaleData!: Array<BarChartData>;

    @business.State
    public isMigrated!: boolean;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    @dashboard.State
    public dashboardCreditSales!: DashboardCreditSales;

    @dashboard.State
    public dashboardCreditPurchases!: DashboardCreditPurchases;

    @dashboard.State
    public dashboardLoanDebts!: DashboardLoanDebts;

    @sales.State
    private paginatedSales!: PaginatedSales;

    @expense.State
    private expenses!: PaginatedExpenses;

    @expense.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    get noTransaction(): boolean {
        if (this.paginatedSales.items.length > 0) return false;
        if (this.expenses.items.length > 0) return false;

        return true;
    }

    get businessStats(): { sales: BusinessStats; expenses: BusinessStats } {
        const { totalSalesAmount, totalAmountPaid, totalBalance } = this.sales;
        const {
            totalExpenseAmount,
            totalAmountPaid: totalExpenseAmountPaid,
            totalBalance: totalExpenseBalance,
        } = this.expense;

        const sales = {
            name: 'Sales',
            total: this.salesStatsAreBeingFetched ? '-' : this.$options.filters.amountWithCurrency(totalSalesAmount),
            cash: totalAmountPaid,
            credit: totalBalance,
            icon: require('@/assets/img/carts.svg'),
            class: 'main-dashboard__business-stats--first-card',
        };
        const expenses = {
            name: 'Expenses',
            total: this.expenseStatsAreBeingFetched
                ? '-'
                : this.$options.filters.amountWithCurrency(totalExpenseAmount),
            cash: totalExpenseAmountPaid,
            credit: totalExpenseBalance,
            icon: require('@/assets/img/wallet-orange.svg'),
            class: 'main-dashboard__business-stats--second-card',
        };
        return { sales, expenses };
    }

    get businessLog() {
        const { notDue, pastDue } = this.dashboardCreditSales;
        const { pastDue: pastDueCredits, maturing: maturingCredit } = this.dashboardCreditPurchases;
        const { maturingLoan, pastDueLoan } = this.dashboardLoanDebts;

        return {
            expectedInflow: {
                pastDue,
                notDue,
            },
            debts: {
                maturingLoans: maturingLoan,
                pastDueLoans: pastDueLoan,
            },
            credit: {
                maturingCredit,
                pastDueCredits,
            },
        };
    }

    get labelBasedOnTabSelected() {
        let labels;
        if (this.activeTab === 'today') {
            const currentDayIndex = new Date().getDay();
            const weekDaysOnorAfterCurrentDay = this.weekDays.slice(0, currentDayIndex + 1).reverse();
            const weekDaysBeforeCurrentDay = this.weekDays.slice(currentDayIndex + 1).reverse();
            weekDaysOnorAfterCurrentDay[0] = 'Today';
            const weekDaysRelevantToBarChartLabel = weekDaysOnorAfterCurrentDay.concat(weekDaysBeforeCurrentDay);
            const lastSixDays = weekDaysRelevantToBarChartLabel.slice(0, 6).reverse();
            labels = lastSixDays;
        }
        if (this.activeTab === 'month') {
            const currentMonthIndex = new Date().getMonth();
            const monthssOnorAfterCurrentMonth = this.months.slice(0, currentMonthIndex + 1).reverse();
            const monthsBeforeCurrentMonth = this.months.slice(currentMonthIndex + 1).reverse();
            const monthsRelevantToBarChartLabel = monthssOnorAfterCurrentMonth.concat(monthsBeforeCurrentMonth);
            labels = monthsRelevantToBarChartLabel.slice(0, 6).reverse(); // get six months
        }
        if (this.activeTab === 'week') {
            labels = this.generateWeeklyDateRange();
        }
        return labels;
    }

    get chartAmountArray(): { expenses: Array<number>; sales: Array<number> } {
        const barChartExpenseDataAmountArray = this.barChartExpenseData.map(data =>
            Number(data.totalAmount.toPrecision(2)),
        );
        const barChartSaleDataAmountArray = this.barChartSaleData.map(data => Number(data.totalAmount.toPrecision(2)));

        return {
            expenses: barChartExpenseDataAmountArray,
            sales: barChartSaleDataAmountArray,
        };
    }

    get chartData() {
        return {
            labels: this.labelBasedOnTabSelected,
            sales: this.chartAmountArray.sales.reverse(),
            expenses: this.chartAmountArray.expenses.reverse(),
            currencyKey: Number(this.userDetails.currencyKey),
        };
    }

    get chartDataRange(): string {
        const { activeTab } = this;
        if (activeTab === 'week') {
            return '(Last 6 weeks)';
        }
        if (activeTab === 'month') {
            return '(Last 6 months)';
        }
        return '(Last 6 days)';
    }

    get quickLinks() {
        const left = [
            {
                title: 'Migrate Existing Data',
                description: 'Start by adding your existing business data',
                route: 'DataMigration',
            },
            { title: 'Create a product', description: 'Add the products you want to sell', route: 'Products' },
            {
                title: 'Add a Bank Accont',
                description: 'Add the bank accounts that you keep money in ',
                route: 'AddBank',
            },
            { title: 'Record a Sale', description: 'Record what you have sold', route: 'RecordSale' },
        ];
        const right = [
            { title: 'Record an Expense', description: 'Record what you have spent money on', route: 'RecordExpense' },
            { title: 'Add a Vendor', description: 'Add vendors you buy from', route: 'Vendors' },
            { title: 'Add Capital', description: 'Add your business capital', route: 'AddCapital' },
            { title: 'Record Loan', description: 'Record loans you have taken ', route: 'AddLoan' },
        ];

        return { left, right };
    }

    get greetings() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }

    get atLeastOneRequestIsLoading() {
        const { dashboardRequestStatus, businessRequestStatus } = this;
        return (
            dashboardRequestStatus.getExpense === Status.LOADING ||
            dashboardRequestStatus.getSales === Status.LOADING ||
            businessRequestStatus.getDataMigrationStatus === Status.LOADING
        );
    }

    get salesStatsAreBeingFetched(): boolean {
        return this.dashboardRequestStatus.getSales === Status.LOADING;
    }

    get expenseStatsAreBeingFetched(): boolean {
        return this.dashboardRequestStatus.getExpense === Status.LOADING;
    }

    get showMainLoader() {
        const { tab } = this.$route.query;
        return !tab && this.atLeastOneRequestIsLoading;
    }

    get salesHistory(): Array<SalesTableDetails> {
        return this.paginatedSales.items;
    }

    get expenseHistory(): Array<ExpenseTableList> {
        return this.expenses.items;
    }

    get expenseHistoryIsBeingFetched(): boolean {
        return this.expenseRequestStatus.getAllExpenses === Status.LOADING;
    }

    get salesHistoryIsBeingFetched(): boolean {
        return this.salesRequestStatus.getSales === Status.LOADING;
    }

    get salesHistoryIsEmpty(): boolean {
        return this.salesHistory.length === 0;
    }

    get expenseHistoryIsEmpty(): boolean {
        return this.expenseHistory.length === 0;
    }

    private setActiveTab(selectedTab: string) {
        if (this.activeTab === selectedTab) return;
        this.activeTab = selectedTab;
    }

    private getPeriodicBusinessData() {
        const currentDate = new Date();
        const { activeTab } = this;
        let startDate;
        let endDate;
        if (activeTab === 'week') {
            const currentDay = this.weekDays[currentDate.getDay()];
            startDate = new Date(currentDate.setDate(currentDate.getDate() - this.weekDays.indexOf(currentDay)));
            endDate = new Date(currentDate.setDate(startDate.getDate() + 6));
            startDate = this.cleanDate(startDate);
            endDate = this.cleanDate(endDate);
            this.fetchSalesAndExpenses(startDate, endDate);
            return;
        }
        if (activeTab === 'month') {
            startDate = new Date(currentDate.setDate(1));
            startDate = this.cleanDate(startDate);
            this.fetchSalesAndExpenses(startDate, '');
            return;
        }
        startDate = this.cleanDate(currentDate);
        this.fetchSalesAndExpenses(startDate, '');
    }

    private cleanDate(date: Date) {
        return date.toISOString().replace(/T.*/, '');
    }

    private generateWeeklyDateRange() {
        const currentDate = new Date();
        if (currentDate.getDate() === 0) {
            return this.datesForNewWeek(currentDate);
        }
        return this.datesForCurrentWeek(currentDate);
    }

    private datesForNewWeek(date: Date) {
        const startDate = new Date(date);
        const endDate = new Date(date.setDate(date.getDate() + 6));
        const previousWeeks = this.getPreviousWeeks(5, startDate);
        previousWeeks.unshift({ startDate, endDate });
        return this.formatPreviousWeeks(previousWeeks);
    }

    private datesForCurrentWeek(date: Date) {
        const currentDate = new Date(date);
        const currentDay = this.weekDays[date.getDay()];
        const startDate = new Date(date.setDate(currentDate.getDate() - this.weekDays.indexOf(currentDay)));
        const endDate = new Date(date.setDate(startDate.getDate() + 6));
        const previousWeeks = this.getPreviousWeeks(5, startDate);
        previousWeeks.unshift({ startDate, endDate });
        return this.formatPreviousWeeks(previousWeeks);
    }

    private getPreviousWeek(date: Date) {
        const startDate = this.addDays(date, -7);
        const endDate = this.addDays(startDate, 6);
        return { startDate, endDate };
    }

    private getPreviousWeeks(weekLenght: number, currentDate: Date) {
        const previousWeeks = [];
        previousWeeks.push(this.getPreviousWeek(currentDate));
        while (previousWeeks.length < weekLenght) {
            const currentWeek: Date = previousWeeks[previousWeeks.length - 1].startDate;
            previousWeeks.push(this.getPreviousWeek(currentWeek));
        }
        return previousWeeks;
    }

    private formatDateRange(weekRange: WeeklyRange): string {
        const { startDate, endDate } = weekRange;
        let startingMonth = this.months[startDate.getMonth()];
        let endingMonth = this.months[endDate.getMonth()];
        startingMonth = startingMonth.substr(0, 3);
        endingMonth = endingMonth.substr(0, 3);
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        return `${startingMonth} ${startDay} - ${endingMonth} ${endDay}`;
    }

    private formatPreviousWeeks(weekRange: WeeklyRange[]) {
        const weeklyRange: string[] = [];
        weekRange.forEach((week: WeeklyRange) => {
            weeklyRange.push(this.formatDateRange(week));
        });
        return weeklyRange.reverse();
    }

    private getUserDetails() {
        const accessToken = SessionStorageService.decodeToken();
        this.userDetails = accessToken;
    }

    private checkRouteQuery() {
        const { tab } = this.$route.query;
        if (typeof tab === 'string') {
            this.activeTab = tab;
        }
    }

    private fetchSalesAndExpenses(startDate: string, endDate: string) {
        Promise.all([
            dashboardModule.getSales({ dates: { starts: startDate, ends: endDate }, tab: this.activeTab }),
            dashboardModule.getExpense({ dates: { starts: startDate, ends: endDate }, tab: this.activeTab }),
        ]);
    }

    private goToRoute(routeName: string) {
        this.$router.push({ name: routeName });
    }

    private getSalesHistory() {
        salesModule.getSales({ limit: 5, page: 1 });
    }

    private getExpenseHistory() {
        expenseModule.getAllExpenses({ limit: 5, page: 1 });
    }

    private getExpectedInflowAndObligations() {
        Promise.all([dashboardModule.getDashboardCreditSales(), dashboardModule.getDashboardCreditPurchases()]);
    }

    private getDashboardLoanDebtsValues() {
        dashboardModule.getDashboardLoanDebts();
    }

    private assignModules() {
        dashboardModule = getModule(DashboardModule, this.$store);
        businessModule = getModule(BusinessModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);
        salesModule = getModule(SalesModule, this.$store);

        businessModule.getBusinessMigrationStatus();
    }

    @Watch('activeTab')
    hanndleTabChange(activeTab: string) {
        this.getPeriodicBusinessData();
        this.$router.push({ name: 'Dashboard', query: { tab: activeTab } });
    }

    created() {
        this.assignModules();
        this.checkRouteQuery();
    }

    mounted() {
        this.getUserDetails();
        this.getPeriodicBusinessData();
        this.getExpectedInflowAndObligations();

        this.getDashboardLoanDebtsValues();

        this.getSalesHistory();
        this.getExpenseHistory();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/main/index';
</style>
