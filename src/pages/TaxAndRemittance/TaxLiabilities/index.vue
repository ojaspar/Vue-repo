<template>
    <b-container fluid class="tax-liabilities">
        <div class="tax-liabilties__content">
            <!-- Tax Liabilities Types Filter -->
            <!-- <DashboardStatusFilter
                :filterList="taxTypes"
                @filter-status-changed="changeTaxTypeFilter"
                v-if="liabilitiesDetailsAreNotBeingShown"
            >
                <template v-slot:buttons>
                    <div class="dashboard-filter__filter-buttons">
                        <DownloadCsv :data="taxLiabilitiesExportData" name="tax-liabilities.csv">
                            <BaseSecondaryButton buttonText="Export to csv" class="mr-2 w-100" />
                        </DownloadCsv>
                    </div>
                </template>
            </DashboardStatusFilter> -->

            <!-- Search, Dates -->
            <!-- <DashboardMidSection
                :searchStringValue="liabilitiesSearchString"
                :exportData="taxLiabilitiesExportData"
                searchInputPlaceholder="Search"
                @search-input-changed="updateSearchString"
                @from-date-filter-has-changed="setFromDateFilter"
                @to-date-filter-has-changed="setToDateFilter"
            /> -->

            <section class="tax-liabilities__cards">
                <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index" />
            </section>

            <LiabilitiesTable
                :liabilities="liabilitiesToBeDisplayed"
                :searchString="liabilitiesSearchString"
                :searchMatchFound="searchMatchFound"
                :status="liabilitiesRequestStatus"
                :taxType="selectedTaxLiability.taxType"
                @show-liability-details="showLiabilityDetails"
            />
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import LiabilitiesTable from '@/pages/TaxAndRemittance/TaxLiabilities/LiabilitiesTable.vue';

import { DashboardCardItem, DashboardFilterList, MoneyObject } from '@/types';
import { TaxLiability, taxLiabilityStub, TaxTypes } from '@/pages/TaxAndRemittance/types';

import UtilityMixins from '@/mixins/Utility';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import TaxMixin from '@/pages/TaxAndRemittance/TaxMixin';

@Component({
    components: {
        LiabilitiesTable,
    },
})
export default class TaxLiabilities extends Mixins(UtilityMixins, DynamicComponentMixin, TaxMixin) {
    private taxTypeFilter: DashboardFilterList[] = [
        { key: 'all', name: 'All' },
        { key: 'cit', name: TaxTypes.CIT },
        { key: 'vat', name: TaxTypes.VAT },
        { key: 'wht', name: TaxTypes.WHT },
        { key: 'paye', name: TaxTypes.PAYE },
    ];

    private fromDate = '';
    private toDate = '';
    private liabilitiesSearchString = '';
    private activeTaxTypeFilter = 'all';
    private selectedTaxLiability: TaxLiability = { ...taxLiabilityStub };

    get pageTitle(): string {
        if (this.activeComponentIndex === 0) {
            return 'View Liabilties';
        }

        const { taxType, period } = this.selectedTaxLiability;
        const formattedPeriod = this.$options.filters.abbreviateMonth(period);

        return `${taxType} - ${formattedPeriod}`;
    }

    get modalId(): string {
        return 'modal';
    }

    get modalTitle(): string {
        return 'Tax Liability';
    }

    get liabilitiesSearchStringIsEmpty() {
        return this.liabilitiesSearchString.length == 0;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get liabilitiesToFilter(): TaxLiability[] {
        if (this.datesNotSelected) {
            return this.taxTypeFilteredLiabilities;
        }

        return this.dateFilteredLiabilities;
    }

    get liabilitiesToBeDisplayed(): TaxLiability[] {
        if (this.liabilitiesSearchStringIsEmpty && this.datesNotSelected) {
            return this.taxTypeFilteredLiabilities;
        }

        return this.liabilitiesToFilter;
    }

    get taxTypeFilteredLiabilities(): TaxLiability[] {
        if (this.activeTaxTypeFilter === 'all') {
            return this.taxLiabilities;
        }

        return this.taxLiabilities.filter((liability: TaxLiability) =>
            liability.taxType.toLowerCase().match(this.activeTaxTypeFilter.toLowerCase()),
        );
    }

    get dateFilteredLiabilities(): TaxLiability[] {
        return this.taxTypeFilteredLiabilities.filter(liability => {
            if (this.fromDate && !this.toDate) {
                return new Date(liability.filingDeadline) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(liability.filingDeadline) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(liability.filingDeadline) >= new Date(this.fromDate) &&
                    new Date(liability.filingDeadline) <= new Date(this.toDate)
                );
            }
            return liability;
        });
    }

    get searchMatchFound() {
        if (this.liabilitiesSearchString.length == 0) return true;
        if (this.liabilitiesSearchString.length > 0 && this.taxLiabilities.length < 1) return true;
        return this.taxLiabilities.length > 0 && this.liabilitiesToBeDisplayed.length > 0;
    }

    get liabilitiesRequestStatus(): string {
        return this.taxRequestStatus.fetchTaxLiabilities;
    }

    get taxLiabilitiesExportData(): [] {
        return [];

        // return this.liabilitiesToBeDisplayed.map((donation: Pledge) => ({
        //     ...donation,
        //     amount: this.formattedAmount(donation.pledgeValue),
        //     transactionDate: this.$options.filters.monthDateYearFormat(donation.transactionDate),
        //     pledgeDueDate: donation.pledgeDueDate
        //         ? this.$options.filters.monthDateYearFormat(donation.pledgeDueDate || '')
        //         : '',
        // }));
    }

    get liabilitiesDetailsAreNotBeingShown(): boolean {
        return this.activeComponentIndex === 0;
    }

    get totalLiabilities(): MoneyObject {
        return {
            amount: this.taxLiabilities.reduce(
                (total: number, currentLiability: TaxLiability) => total + currentLiability.taxPayable.amount,
                0,
            ),
            currencyKey: 566,
        };
    }

    get dashboardStats(): Array<DashboardCardItem> {
        const currentMonth = this.monthsOfTheYear[this.currentMonth];
        return [
            {
                title: 'Total Payable',
                midSection: this.$options.filters.amountWithCurrency(this.totalLiabilities),
                icon: require('@/assets/img/tax-payable.svg'),
                meta: { title: 'Total Transactions', value: '0' },
                cssClass: 'tax-liabilities__card',
            },
            {
                title: 'Tax Credits',
                midSection: this.$options.filters.amountWithCurrency({ amount: 0, currencyKey: 566 }),
                icon: require('@/assets/img/tax-credits.svg'),
                meta: { title: 'Total Transactions', value: '0' },
                cssClass: 'tax-liabilities__card',
            },
            {
                title: `${currentMonth} Payments`,
                midSection: this.$options.filters.amountWithCurrency({ amount: 0, currencyKey: 566 }),
                icon: require('@/assets/img/tax-payments.svg'),
                meta: { title: 'Payments', value: '0' },
                cssClass: 'tax-liabilities__card',
            },
        ];
    }

    private updateSearchString(searchString: string) {
        this.liabilitiesSearchString = searchString;
    }

    private changeTaxTypeFilter(taxTypeFilter: string) {
        this.activeTaxTypeFilter = taxTypeFilter;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private showLiabilityDetails(taxLiability: TaxLiability) {
        this.selectedTaxLiability = taxLiability;

        this.handleNextSection();
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Tax Liabiities');
    }

    private async fetchTaxLiabilities() {
        await this.taxModule.getTaxLiabilities();
    }

    mounted() {
        this.emitMobilePageTitle();

        this.fetchTaxLiabilities();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/tax/tax-liabilities';
</style>
