<template>
    <div class="dashboard-container">
        <div
            class="dashboard-container__no-transaction-notification"
            v-if="!businessMigrationStatusIsLoading && !isMigrated"
        >
            <p class="dashboard-container__no-transaction-notification__text">
                Kindly ensure your opening balances are accurate and complete before initiating the first transaction
            </p>
            <router-link class="linkify dashboard-container__no-transaction-notification__text" to="/data-migration"
                >Update Now</router-link
            >
        </div>

        <div class="main-header">
            <TopBarFeed :authenticatedUser="authenticatedUserFromToken" />
        </div>

        <BusinessPerformace
            @getBusinessPerformanceStats="fetchBusinessPerformanceStats"
            :arrayOfWeekDays="weekDays"
            :arrayOfMonths="months"
        />

        <div class="main-overview">
            <DashboardStats
                :firstStat="firstStat"
                :secondStat="secondStat"
                :thirdStat="thirdStat"
                :useDefaultStatsContainer="false"
                statsContainerClass="main-dashboard__stats"
                :overRideTitleCLass="true"
                titleCLass="main-dashboard__card-title"
                :extraContainerCLass="cardContainerClass"
                :firstCardColumnSize="firstCardColumnSize"
                :secondCardColumnSize="secondCardColumnSize"
            >
                <template v-slot:first-meta>
                    <p class="meta d-none">
                        Total Transactions:
                        <span class="ml-1 txt--bold">{{ firstStat.meta }}</span>
                    </p>
                </template>
                <template v-slot:second-meta>
                    <p class="meta">
                        Paid:
                        <span class="ml-1">{{ secondStat.meta }}</span>
                    </p>
                </template>
                <template v-slot:third-meta>
                    <p class="meta d-none">
                        <span class="ml-1 txt--bold">₦ {{ thirdStat.meta | formatMoney }}</span>
                        Debt +
                        <span class="ml-1 txt--bold">₦ {{ thirdStat.meta | formatMoney }}</span>
                        Outstanding Orders
                    </p>
                </template>
            </DashboardStats>
        </div>

        <div class="main-cards">
            <div class="card">
                <div class="dashboard-graph">
                    <BarChart :chartdata="chartdata" :options="options" v-if="chartDataIsNowAvailable" />
                </div>
            </div>
            <div class="card main-dashboard__outstanding-orders-section">
                <Jobs :jobs="outstandingCustomers" />
            </div>
        </div>

        <div class="main-dashboard__footer-mobile" v-if="$root.isMobileScreenSize">
            <p class="main-dashboard__footer-text">Powered By</p>
            <MzuriLogo className="main-dashboard__footer-mzuri-logo-container" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import TopBarFeed from '@/pages/Dashboard/TopBarFeed.vue';
import DashboardStats from '@/pages/Dashboard/DashboardStat.vue';
import Jobs from '@/pages/Dashboard/Jobs.vue';
import BusinessPerformace from '@/pages/Dashboard/BusinessPerformance.vue';
import BarChart from '@/components/ui/BarChart.vue';

import SessionStorageService from '@/services/sessionStorage';

import DashboardModule from '@/store/modules/dashboard';
import SalesModule from '@/store/modules/sale';
import BusinessModule from '@/store/modules/business';

import UtilityMixins from '@/mixins/Utility';

import {
    Status,
    DashboardStat,
    ensurePossiblyNullValueReturnsNumber,
    DashboardCardContainerClass,
    DashboardCardColumnSize,
    Token,
    BusinessRequestStatus,
    tokenDefaultValue,
} from '@/types';
import {
    DashboardSales,
    DashboardExpense,
    OutstandingOrders,
    DashboardRequestStatus,
    BarChartData,
    OutstandingCustomer,
} from '@/pages/Dashboard/types';
import { SalesTableDetails } from '@/pages/Sales/types';

import { ChartTooltipItem } from 'chart.js';
import CurrencyMixins from '@/mixins/currency';

const dashboard = namespace('dashboard');
const sales = namespace('sale');
const business = namespace('business');

let dashboardModule: DashboardModule;
let salesModule: SalesModule;
let businessModule: BusinessModule;

@Component({
    components: {
        TopBarFeed,
        DashboardStats,
        Jobs,
        BusinessPerformace,
        BarChart,
    },
})
export default class Dashboard extends Mixins(UtilityMixins, CurrencyMixins) {
    private authenticatedUserFromToken: Token = tokenDefaultValue;

    private tab = 'today';

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

    @dashboard.State
    public outstandingCustomers!: Array<OutstandingCustomer>;

    @dashboard.Action
    public getExpense!: () => DashboardExpense;

    @dashboard.Action
    public getSales!: () => DashboardSales;

    @dashboard.Action
    public getOutstandingOrders!: () => OutstandingOrders;

    @dashboard.Action
    public getExpenseBarChartFigures!: () => Array<BarChartData>;

    @sales.State
    private salesList!: SalesTableDetails[];

    @business.State
    public isMigrated!: boolean;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    get firstStat(): DashboardStat {
        return {
            header: 'total income',
            body: this.totalSalesAmountString,
            isMonetaryValue: false,
            meta: `${this.sales.totalAmountPaid}`,
            status: this.dashboardRequestStatus.getSales,
            icon: '',
        };
    }
    get secondStat(): DashboardStat {
        return {
            header: 'total expenses',
            body: this.totalExpenseAmountString,
            isMonetaryValue: false,
            meta: this.totalExpenseAmountPaidString,
            status: this.dashboardRequestStatus.getExpense,
            icon: '',
        };
    }
    get thirdStat(): DashboardStat {
        return {
            header: 'outstanding orders',
            body: this.outstandingOrderCountString,
            isMonetaryValue: false,
            meta: '',
            icon: '',
            status: this.dashboardRequestStatus.getOutstandingOrders,
        };
    }

    get cardContainerClass(): DashboardCardContainerClass {
        return {
            firstCard: 'main-dashboard__card-container--payable',
            secondCard: 'main-dashboard__card-container--next-delivery',
            thirdCard: 'main-dashboard__card-container--pending-delivery',
        };
    }

    get outstandingOrderCountString() {
        const count = this.sales.outstandingOrderCount;
        const countStr = count > 0 ? this.convertFigureToCurrency(count) : '0';
        return countStr + ' Customer' + (count !== 1 ? 's' : '');
    }

    get totalSalesAmountString() {
        return this.$options.filters.amountWithCurrency({
            amount: this.sales.totalSalesAmount,
            currencyKey: this.defaultCurrency.currencyKey,
        });
    }

    get totalExpenseAmountString() {
        return this.$options.filters.amountWithCurrency({
            amount: this.expense.totalExpenseAmount,
            currencyKey: this.defaultCurrency.currencyKey,
        });
    }

    get totalExpenseAmountPaidString() {
        return this.$options.filters.amountWithCurrency({
            amount: this.expense.totalAmountPaid,
            currencyKey: this.defaultCurrency.currencyKey,
        });
    }

    get firstCardColumnSize(): DashboardCardColumnSize {
        return { xl: '', lg: '', md: '12', sm: '12', xs: '12' };
    }

    get secondCardColumnSize(): DashboardCardColumnSize {
        return { xl: '', lg: '', md: '12', sm: '12', xs: '12' };
    }

    get thirdCardColumnSize(): DashboardCardColumnSize {
        return { xl: '', lg: '', md: '12', sm: '12', xs: '12' };
    }

    get chartDataIsNowAvailable(): boolean {
        const { getSales, getExpense } = this.dashboardRequestStatus;
        return getSales !== Status.LOADING && getExpense !== Status.LOADING;
    }

    get graphData(): { expense: Array<string>; sale: Array<string> } {
        const barChartExpenseDataAmountArray = this.barChartExpenseData.map(data => data.totalAmount.toPrecision(2));
        const barChartSaleDataAmountArray = this.barChartSaleData.map(data => data.totalAmount.toPrecision(2));

        return {
            expense: barChartExpenseDataAmountArray,
            sale: barChartSaleDataAmountArray,
        };
    }

    get labelBasedOnTabSelected(): Array<string> {
        let label: Array<string> = [];
        if (this.tab === 'today') {
            const currentDayIndex = new Date().getDay();
            const weekDaysOnorAfterCurrentDay = this.weekDays.slice(0, currentDayIndex + 1).reverse();
            const weekDaysBeforeCurrentDay = this.weekDays.slice(currentDayIndex + 1).reverse();
            const weekDaysRelevantToBarChartLabel = weekDaysOnorAfterCurrentDay.concat(weekDaysBeforeCurrentDay);
            label = weekDaysRelevantToBarChartLabel.slice(0, 6).reverse(); // get six week days
        }
        if (this.tab === 'month' || this.tab === 'year') {
            const currentMonthIndex = new Date().getMonth();
            const monthssOnorAfterCurrentMonth = this.months.slice(0, currentMonthIndex + 1).reverse();
            const monthsBeforeCurrentMonth = this.months.slice(currentMonthIndex + 1).reverse();
            const monthsRelevantToBarChartLabel = monthssOnorAfterCurrentMonth.concat(monthsBeforeCurrentMonth);
            label = monthsRelevantToBarChartLabel.slice(0, 6).reverse(); // get six months
        }
        if (this.tab === 'week') {
            const weeksRelevantToBarChartLabel = this.weeks;
            label = weeksRelevantToBarChartLabel.slice(0, 6); // get six weeks
        }
        return label;
    }

    get dataSets(): object {
        const {
            graphData: { expense, sale },
        } = this;
        return [
            {
                label: 'Sales',
                backgroundColor: '#4AA8FF',
                barPercentage: 0.8,
                categoryPercentage: 0.5,
                data: sale.reverse(), // reverse sale array data because data coming from the backend starts from the latest day/week/month
            },
            {
                label: 'Expenses',
                backgroundColor: '#CDCDCD',
                barPercentage: 0.8,
                categoryPercentage: 0.5,
                data: expense.reverse(), // reverse expense array data because data coming from the backend starts from the latest day/week/month
            },
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get chartdata(): any {
        return {
            labels: this.labelBasedOnTabSelected,
            datasets: this.dataSets,
        };
    }

    get options(): object {
        return {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Sales/Expense Distribution',
                position: 'bottom',
                padding: 30,
                fontSize: 15,
                fontFamily: 'Lato',
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: (tooltipItems: ChartTooltipItem) => {
                        return `₦${this.formatAmountThatCannotBeFiltered(
                            ensurePossiblyNullValueReturnsNumber(tooltipItems.yLabel),
                        )}`;
                    },
                },
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: (value: string) => {
                                return `₦${this.formatAmountThatCannotBeFiltered(value)}`;
                            },
                        },
                    },
                ],
            },
        };
    }

    get businessMigrationStatusIsLoading(): boolean {
        return this.businessRequestStatus.getDataMigrationStatus === Status.LOADING;
    }

    private fetchBusinessPerformanceStats(startingDate: string, endingDate: string) {
        Promise.all([
            dashboardModule.getOutstandingOrders(),
            dashboardModule.getExpense({ dates: { starts: startingDate, ends: endingDate }, tab: this.tab }),
            dashboardModule.getSales({ dates: { starts: startingDate, ends: endingDate }, tab: this.tab }),
        ]);
    }

    private fetchOnlySalesAndExpense(startingDate: string, endingDate: string) {
        Promise.all([
            dashboardModule.getOnlyExpense({ dates: { starts: startingDate, ends: endingDate }, tab: this.tab }),
            dashboardModule.getOnlySales({ dates: { starts: startingDate, ends: endingDate }, tab: this.tab }),
        ]);
    }

    get conditionsForNoTransactionNotificationToShow() {
        // this implementation is temporary
        return this.onlyExpense + this.onlySales === 0;
    }

    async created() {
        if (typeof this.$route.query.tab === 'string') {
            this.tab = this.$route.query.tab;
        }

        this.authenticatedUserFromToken = SessionStorageService.decodeToken();

        dashboardModule = getModule(DashboardModule, this.$store);

        // everything below this line is to fetch the business performance over a year, so that the hacky computed property
        // conditionsForNoTransactionNotificationToShow above works - this is for demonstration
        const currentYear = new Date().getFullYear(); // remove after a more permanent way to determine transactions have been done is implemented
        const startingDate = `${currentYear}-01-01`;
        const endingDate = '';
        this.fetchOnlySalesAndExpense(startingDate, endingDate);

        salesModule = getModule(SalesModule, this.$store);
        businessModule = getModule(BusinessModule, this.$store);

        await Promise.all([salesModule.getSales({ page: 1, limit: 10 }), businessModule.getBusinessMigrationStatus()]);
    }

    @Watch('$route.query.tab')
    queryTabChanged(newValue: string) {
        this.tab = newValue;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/dashboard';
</style>
