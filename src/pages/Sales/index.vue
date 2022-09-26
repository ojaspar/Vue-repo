<template>
    <b-container fluid class="sales-dashboard">
        <div class="sales-dashboard__content">
            <!-- Dashboard Cards -->
            <b-row class="sales-dashboard__cards">
                <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index" />
            </b-row>

            <b-row class="sales-dashboard__transactions">
                <p>Transaction History</p>
                <p name="sales.csv" class="sales-dashboard__transactions--export">
                    <DownloadCsv class="d-flex" :data="salesExportData" name="sales.csv">
                        <img src="@/assets/img/black-download-icon.svg" class="mr-2" />Export
                    </DownloadCsv>
                </p>
            </b-row>

            <section class="general-module-dashboard__content-area">
                <!-- Search, Dates, Add New Estimate, Add New Sale -->
                <DashboardMidSection
                    class="mt-0"
                    :searchStringValue="salesSearchString"
                    :activeStatus="salesStatusFilter"
                    :statusOptions="salesStatusOptions"
                    :fromDate="fromDate"
                    :toDate="toDate"
                    @search-input-changed="updateSalesSearchString"
                    @from-date-filter-has-changed="setFromDateFilter"
                    @to-date-filter-has-changed="setToDateFilter"
                    @status-filter-changed="handleSalesStatusFilterChange"
                    @apply-filters="applyFilters"
                />

                <!-- Sales Table -->
                <b-row>
                    <Loader size="3" v-if="salesListIsBeingFetched" :isInline="false" />

                    <b-col class="general-module-dashboard__table" v-else>
                        <transition name="fade" mode="out-in" appear>
                            <SalesTable :sales="salesToBeDisplayed" />
                        </transition>
                    </b-col>
                </b-row>
            </section>

            <div class="general-module-dashboard__pagination-container">
                <b-pagination
                    size="lg"
                    v-if="totalNumberOfRows"
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
import SalesTable from '@/pages/Sales/SalesTable.vue';

import SalesModule from '@/store/modules/sale';

import { Status, DashboardCardItem, VueExtension, DashboardStatusOption, Filters, SaleRequestStatus } from '@/types';
import { PaginatedSales, SaleDashboardCards, SalesTableDetails } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixin from '@/mixins/currency';

const sales = namespace('sale');
let salesModule: SalesModule;

@Component({
    components: {
        DashboardMidSection,
        SalesTable,
    },
})
export default class SalesDashboard extends Mixins(UtilityMixins, CurrencyMixin) {
    public $root!: VueExtension;

    @sales.State
    private salesDashboardCards!: SaleDashboardCards;

    @sales.State
    private paginatedSales!: PaginatedSales;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    @sales.State
    private salesDashboardRequest!: Status;

    @sales.Action
    public getSalesDashboardCardsInfo!: () => SaleDashboardCards;

    @sales.Action
    public getSalesList!: () => PaginatedSales;

    private salesStatusFilter = 'all-sales';

    private fromDate = '';

    private toDate = '';

    private salesSearchString = '';

    private salesStatusOptions: Array<DashboardStatusOption> = [
        { key: 'all-sales', name: 'All Sales' },
        { key: 'draft', name: 'Draft' },
        { key: 'estimates', name: 'Estimates' },
        { key: 'pending-supply', name: 'Pending Supply' },
        { key: 'pending-payments', name: 'Pending Payment' },
        { key: 'completed', name: 'Completed' },
        { key: 'cancelled', name: 'Cancelled' },
    ];

    private currentPage = 1;
    private perPage = 8;

    get outstandingOrderCount(): string {
        return this.convertFigureToCurrency(this.salesDashboardCards.outStandingOrderCount);
    }

    get unpaidOutstandingOrders() {
        const { amount, currencyKey } = this.salesDashboardCards.unpaidOutStandingOrders;
        return { amount: Number(amount), currencyKey };
    }

    get outstandingOrderCountString() {
        return (
            this.outstandingOrderCount + ' Customer' + (this.salesDashboardCards.outStandingOrderCount !== 1 ? 's' : '')
        );
    }

    get salesListIsBeingFetched(): boolean {
        return this.salesRequestStatus.getSales === Status.LOADING;
    }

    // get totalOutstandingOrders() {
    //     const { prepaidOutStandingOrders, unpaidOutStandingOrders } = this.salesDashboardCards;
    //     const totalOutstandingOrders = Number(prepaidOutStandingOrders.amount) + Number(unpaidOutStandingOrders.amount);
    //     return { currencyKey: prepaidOutStandingOrders.currencyKey, amount: totalOutstandingOrders };
    // }

    get dashboardStats(): Array<DashboardCardItem> {
        const {
            currentMonthSales,
            currentMonthSalesCount,
            customerDebt,
            expectedInflowCount,
        } = this.salesDashboardCards;

        const expectedInflow = Number(customerDebt.amount) + Number(this.unpaidOutstandingOrders.amount);

        const { salesDashboardRequestIsStillLoading } = this;

        return [
            {
                title: `Sales in ${this.currentMonthInWords}`,
                midSection: salesDashboardRequestIsStillLoading
                    ? '-'
                    : this.$options.filters.amountWithCurrency({
                          amount: Number(currentMonthSales.amount),
                          currencyKey: currentMonthSales.currencyKey,
                      }),
                icon: require('@/assets/img/tax-payments.svg'),
                meta: {
                    title: 'Total Transaction',
                    value: salesDashboardRequestIsStillLoading ? '-' : String(currentMonthSalesCount),
                },
                cssClass: 'sales-dashboard__cards--sales',
            },
            {
                title: 'Oustanding Orders',
                midSection: salesDashboardRequestIsStillLoading
                    ? '-'
                    : this.$options.filters.amountWithCurrency(this.unpaidOutstandingOrders),
                icon: require('@/assets/img/tax-payable.svg'),
                meta: {
                    title: 'Total Transactions',
                    value: salesDashboardRequestIsStillLoading ? '-' : this.outstandingOrderCount,
                },
                cssClass: 'sales-dashboard__cards--orders',
            },
            {
                title: 'Expected Inflow',
                midSection: salesDashboardRequestIsStillLoading
                    ? '-'
                    : this.$options.filters.amountWithCurrency({
                          amount: expectedInflow,
                          currencyKey: customerDebt.currencyKey,
                      }),
                icon: require('@/assets/img/tax-credits.svg'),
                meta: {
                    title: 'Total Transactions',
                    value: salesDashboardRequestIsStillLoading ? '-' : expectedInflowCount.toString(),
                },
                cssClass: 'sales-dashboard__cards--inflow',
            },
        ];
    }

    get salesSearchStringIsEmpty(): boolean {
        return this.salesSearchString === '';
    }

    get salesToBeDisplayed(): SalesTableDetails[] {
        const searchString = this.getLowerCase(this.salesSearchString);
        return this.getDateFilteredSales.filter((saleDetails: SalesTableDetails) => {
            if (this.firstWordOfSalesStatusFilterInLowercase === 'all') {
                // if there is a supply filter of 'all-sales'
                return this.checkForAllSalesStatusFilter(saleDetails, searchString);
            } else {
                // if there is a supply filter other than 'all'
                return this.checkForOtherStatusFilters(saleDetails, searchString);
            }
        });
    }

    get getDateFilteredSales(): Array<SalesTableDetails> {
        return this.paginatedSales.items.filter(sale => {
            if (this.fromDate && !this.toDate) {
                return new Date(sale.transactionDate) > new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(sale.transactionDate) < new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(sale.transactionDate) > new Date(this.fromDate) &&
                    new Date(sale.transactionDate) < new Date(this.toDate)
                );
            }

            return sale;
        });
    }

    get fromDateInUkFormat() {
        return this.formatDateToFitUKFormat(this.fromDate);
    }

    get toDateInUkFormat() {
        return this.formatDateToFitUKFormat(this.toDate);
    }

    get firstWordOfSalesStatusFilterInLowercase(): string {
        // remove the dashes (-) from the salesStatusFilter, select the first word from the array && make it lower case
        return this.getLowerCase(this.salesStatusFilter.split('-')[0]);
    }

    get salesExportData() {
        return this.salesToBeDisplayed.map((sale: SalesTableDetails) => ({
            totalAmount: this.$options.filters.amountWithCurrency(sale.totalAmount),
            salesReferenceNumber: sale.salesReferenceNumber,
            transactionDate: this.$options.filters.localDate(sale.transactionDate),
            customerName: sale.customerName,
            balanceOwed: this.$options.filters.amountWithCurrency(sale.balanceOwed),
            transactionStatus: sale.transactionStatus,
            items: sale.itemArray,
            supplyDueDate: this.$options.filters.localDate(sale.supplyDueDate),
        }));
    }

    get totalNumberOfRows(): number {
        return this.paginatedSales.total;
    }

    get salesDashboardRequestIsStillLoading(): boolean {
        return this.salesDashboardRequest === Status.LOADING;
    }

    private getCurrencySymbol(currencyKey: string | number): string {
        const currencySymbol = this.getCurrencySymbolFromCurrencyKey(currencyKey.toString());
        if (!currencySymbol) return '';
        return currencySymbol;
    }

    private checkForAllSalesStatusFilter(sale: SalesTableDetails, searchString: string) {
        if (searchString) {
            // if there is a search string and the supply filter status is 'all',
            // then filter the search based on the search input alone
            return this.chooseSaleToBeDisplayFromSearchInput(sale, searchString);
        } else {
            // if there is no search string, return everything
            return this.paginatedSales.items;
        }
    }

    private checkForOtherStatusFilters(sale: SalesTableDetails, searchString: string) {
        if (!searchString) {
            // if there is no search string, filter the search based on only the supply status
            return this.supplyStatusMatchesStatusFilter(sale);
        } else {
            // if there is a search string, filter the search based on the supply status AND supply sstatus
            return (
                this.chooseSaleToBeDisplayFromSearchInput(sale, searchString) &&
                this.supplyStatusMatchesStatusFilter(sale)
            );
        }
    }

    private getLowerCase(inputString: string): string {
        if (inputString) {
            return inputString.toLowerCase();
        }

        return '';
    }

    private chooseSaleToBeDisplayFromSearchInput(sale: SalesTableDetails, searchString: string): SalesTableDetails {
        const values = Object.values(sale);
        return values.find(value => {
            if (typeof value !== 'string') return;
            return value.toLowerCase().includes(searchString.toLowerCase());
        });
    }

    private applyFilters({ category, fromDate, toDate }: Filters) {
        let salesStatusToUse = 'all-sales';
        if (category) salesStatusToUse = category;

        this.salesStatusFilter = salesStatusToUse;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    private supplyStatusMatchesStatusFilter(sale: SalesTableDetails): boolean {
        // return this.getLowerCase(sale.transactionStatus) === this.firstWordOfSalesStatusFilterInLowercase;

        switch (this.salesStatusFilter) {
            case 'estimates':
                return this.getLowerCase(sale.transactionStatus) === 'estimate';

            case 'pending-supply':
                return (
                    (this.getLowerCase(sale.transactionStatus) === 'no supply' ||
                        this.getLowerCase(sale.transactionStatus) === 'partial supply') &&
                    sale.customerName.length !== 0
                );

            case 'pending-payments':
                return Number(sale.balanceOwed.amount) > 0;

            case 'completed':
                return sale.balanceOwed.amount === 0 && this.getLowerCase(sale.transactionStatus) === 'supplied';

            default:
                return false;
        }
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private productExistsInArray(sale: SalesTableDetails, searchString: string): Array<string> {
        return sale.itemArray.filter(item => this.getLowerCase(item).match(searchString));
    }

    private updateSalesSearchString(searchString: string) {
        this.salesSearchString = searchString;
    }

    private updateSalesStatusFilter(status: string) {
        this.salesStatusFilter = status;
    }

    private handleSalesStatusFilterChange(selectedStatus: string) {
        this.updateSalesStatusFilter(selectedStatus);
        this.updateSalesSearchString('');
        this.$router.push({ query: { tab: selectedStatus } });
    }

    private goToAddNewEstimatePage() {
        this.$router.push({ name: 'PriceQuotation' });
    }

    private goToAddNewSalePage() {
        this.$router.push({ name: 'RecordSale' });
    }

    private routeToExpensePage() {
        this.$router.push({ name: 'RecordExpenses' });
    }

    private async getDashboardCards() {
        await salesModule.getSalesDashboardCardsInfo();
    }

    private async getSaleList() {
        await salesModule.getSales({ page: this.currentPage, limit: this.perPage });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Sales Dashboard');
    }

    private preselectStatusTab() {
        const queryStatus = this.$route.query.tab;
        if (!queryStatus) return;

        this.salesStatusFilter = queryStatus.toString() || 'all-sales';
    }

    @Watch('currentPage')
    fetchSalesForCurrentPage() {
        this.getSaleList();
    }

    mounted() {
        salesModule = getModule(SalesModule, this.$store);

        this.getDashboardCards();
        this.getSaleList();
        this.emitMobilePageTitle();

        this.preselectStatusTab();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/general-module-dashboard';
@import 'src/styles/pages/sales/sales-dashboard';
</style>
