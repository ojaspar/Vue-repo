<template>
    <b-container fluid class="donations-dashboard">
        <div class="donations-dashboard__content">
            <!-- Dashboard Cards -->
            <b-row>
                <DashboardStats
                    :firstStat="firstStat"
                    :secondStat="secondStat"
                    :thirdStat="thirdStat"
                    :useDefaultStatsContainer="false"
                    statsContainerClass="donations-dashboard__stats"
                    :overRideTitleCLass="true"
                    titleCLass="donations-dashboard__card-title"
                    :extraContainerCLass="cardContainerClass"
                    :firstCardColumnSize="firstCardColumnSize"
                    :secondCardColumnSize="secondCardColumnSize"
                >
                    <template v-slot:first-meta>
                        <p class="meta">
                            <span class="ml-1 txt--bold">{{ firstStat.meta }}</span>
                            {{ donationsInwords(Number(firstStat.meta)) }}
                        </p>
                    </template>
                </DashboardStats>
            </b-row>

            <!-- Redemption Types Filter -->
            <DashboardStatusFilter :filterList="redemptionTypes" @filter-status-changed="updateDonationStatusFilter">
                <template v-slot:buttons>
                    <div class="donations-dashboard__filter-buttons">
                        <DownloadCsv :data="donationsExportData" name="donations.csv">
                            <BaseSecondaryButton buttonText="Export to csv" class="mr-2 w-100" />
                        </DownloadCsv>

                        <BasePrimaryButton
                            buttonText="New Donation"
                            :overRideButtonClass="true"
                            className="new-donation-btn donations-dashboard__filter-buttons--add-donation"
                            @button-clicked="goToNewDonationPage"
                        />
                    </div>
                </template>
            </DashboardStatusFilter>

            <!-- Search, Dates, Add New Donations-->
            <DashboardMidSection
                :searchStringValue="donationsSearchString"
                searchInputPlaceholder="Search for donations/donors"
                :exportData="donationsExportData"
                @search-input-changed="updateDonationsSearchString"
                @add-new-donation="goToNewDonationPage"
                @from-date-filter-has-changed="setFromDateFilter"
                @to-date-filter-has-changed="setToDateFilter"
            />

            <!-- Donations Table -->
            <b-row>
                <b-col class="donations-dashboard__table">
                    <transition name="fade" mode="out-in" appear>
                        <DonationsTable
                            :donationsList="donationsToBeDisplayed"
                            :searchMatchFound="searchMatchFound"
                            :status="donationRequestStatus.getDonations"
                        />
                    </transition>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonationModule from '@/store/modules/donation';

import DashboardStats from '@/pages/Dashboard/DashboardStat.vue';
import DashboardMidSection from '@/pages/Donations/DashboardMidSection.vue';
import DonationsTable from '@/pages/Donations/DonationsTable.vue';

import {
    DonationDashboardCards,
    DonationDashboardStats,
    DonationExport,
    DonationList,
    DonationRequestStatus,
} from '@/pages/Donations/types';

import {
    Status,
    DashboardStat,
    DashboardCardContainerClass,
    DashboardCardColumnSize,
    VueExtension,
    DashboardFilterList,
} from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixin from '@/mixins/currency';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component({
    components: {
        DashboardStats,
        DashboardMidSection,
        DonationsTable,
    },
})
export default class DonationsDashboard extends Mixins(UtilityMixins, CurrencyMixin) {
    public $root!: VueExtension;

    private donationDashboardCards: DonationDashboardCards = {
        functionalCurrencySymbol: '',
        currentMonth: '',
        totalDonationsAmountInCurrentMonth: {
            currencyKey: 566,
            amount: 0,
        },
        countOfInstantDonationsInCurrentMonth: 0,
        totalPledgeAmount: {
            currencyKey: 566,
            amount: 0,
        },
        countOfPledgeDonationsInCurrentMonth: 0,
    };

    private redemptionTypes: DashboardFilterList[] = [
        { key: 'all-donations', name: 'All Donations' },
        { key: 'instant-donations', name: 'Instant Donations' },
        { key: 'pledges', name: 'Pledges' },
    ];

    private fromDate = '';

    private toDate = '';

    private donationsSearchString = '';

    private donationStausFilter = 'all-donations';

    @donations.State
    private error!: string;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private donations!: DonationList[];

    @donations.State
    private donationDashboardStats!: DonationDashboardStats[];

    get firstStat(): DashboardStat {
        const {
            totalDonationsAmountInCurrentMonth,
            countOfInstantDonationsInCurrentMonth,
        } = this.donationDashboardCards;
        return {
            header: `donations in ${this.currentMonthInWords}`,
            body: this.$options.filters.amountWithCurrency(totalDonationsAmountInCurrentMonth),
            isMonetaryValue: false,
            meta: countOfInstantDonationsInCurrentMonth,
            status: Status.NORMAL,
            icon: require('@/assets/img/expense-payable.svg'),
        };
    }

    get secondStat(): DashboardStat {
        const { currentMonthInWords, donationDashboardCards } = this;
        return {
            header: `pledges in ${currentMonthInWords}`,
            body: donationDashboardCards.countOfPledgeDonationsInCurrentMonth,
            isMonetaryValue: true,
            meta: '',
            status: Status.NORMAL,
            icon: require('@/assets/img/expense-due-date.svg'),
        };
    }

    get thirdStat(): DashboardStat {
        const { totalPledgeAmount } = this.donationDashboardCards;
        return {
            header: 'total outstanding Pledges',
            body: this.$options.filters.amountWithCurrency(totalPledgeAmount),
            isMonetaryValue: false,
            meta: ``,
            status: Status.NORMAL,
            icon: require('@/assets/img/payables.svg'),
        };
    }

    get cardContainerClass(): DashboardCardContainerClass {
        return {
            firstCard: 'donations-dashboard__card-container--donations',
            secondCard: 'donations-dashboard__card-container--donations-count',
            thirdCard: 'donations-dashboard__card-container--pledges',
        };
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

    get instantDonationsCount(): number {
        const instantDonations = this.donations.filter(donation => {
            return donation.redemptionType.toLowerCase().match('instant');
        });
        return instantDonations.length;
    }

    get totalOustandingPledges(): number {
        return this.donations.reduce((previousAmount: number, donation: DonationList) => {
            if (donation.redemptionType.toLowerCase() !== 'pledge' || !donation.amount) return previousAmount;
            return previousAmount + donation.amount.amount;
        }, 0);
    }

    get totalInstantDonations(): number {
        return this.donations.reduce((previousAmount: number, donation: DonationList) => {
            if (donation.redemptionType.toLowerCase() !== 'instant') return previousAmount;
            return previousAmount + donation.amount.amount;
        }, 0);
    }

    get donationsSearchStringIsEmpty() {
        return this.donationsSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.donationsSearchStringIsEmpty) return true;
        if (!this.donationsSearchStringIsEmpty && this.donations.length < 1) return true;
        return this.donations.length > 0 && this.donationsToBeDisplayed.length > 0;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get dateFilteredDonations(): DonationList[] {
        return this.statusFilteredDonations.filter(donation => {
            if (this.fromDate && !this.toDate) {
                return new Date(donation.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(donation.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(donation.transactionDate) >= new Date(this.fromDate) &&
                    new Date(donation.transactionDate) <= new Date(this.toDate)
                );
            }
            return donation;
        });
    }

    get statusFilteredDonations(): DonationList[] {
        if (this.donationStausFilter === 'instant-donations') {
            return this.donations.filter(donation => {
                return donation.redemptionType.toLowerCase().match('instant');
            });
        }
        if (this.donationStausFilter === 'pledges') {
            return this.donations.filter(donation => {
                return donation.redemptionType.toLowerCase().match('pledge');
            });
        }
        return this.donations;
    }

    get donationsListToFilter(): DonationList[] {
        if (this.datesNotSelected) {
            return this.statusFilteredDonations;
        }
        return this.dateFilteredDonations;
    }

    get donationsExportData(): DonationExport[] {
        return this.donationsToBeDisplayed.map((donation: DonationList) => ({
            ...donation,
            amount: donation.amount ? this.$options.filters.amountWithCurrency(donation.amount) : '',
            transactionDate: this.$options.filters.monthDateYearFormat(donation.transactionDate),
            pledgeDueDate: donation.pledgeDueDate
                ? this.$options.filters.monthDateYearFormat(donation.pledgeDueDate)
                : '',
        }));
    }

    get donationsToBeDisplayed(): DonationList[] {
        if (this.donationsSearchStringIsEmpty && this.datesNotSelected) {
            return this.statusFilteredDonations;
        }

        //search all donations' details for a match
        return this.donationsListToFilter.filter(donation => {
            const values = Object.values(donation);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.donationsSearchString.toLowerCase());
            });
        });
    }

    private getCurrencySymbol(currencyKey: string | number): string {
        const currencySymbol = this.getCurrencySymbolFromCurrencyKey(currencyKey.toString());
        if (!currencySymbol) return '';
        return currencySymbol;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private updateDonationsSearchString(searchString: string) {
        this.donationsSearchString = searchString;
    }

    private updateDonationStatusFilter(donationStatus: string) {
        this.donationStausFilter = donationStatus;
    }

    private donationsInwords(donationCount: number): string {
        return donationCount > 1 ? 'Instant Donations' : 'Instant Donation';
    }

    private goToNewDonationPage() {
        this.$router.push({ name: 'NewDonation' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Donations Dashboard');
    }

    private async makePreliminaryRequests() {
        await Promise.all([donationsModule.getDonationDashboardStats(), donationsModule.getDonations()]);

        this.donationDashboardCards = Object.assign(this.donationDashboardCards, {
            ...this.donationDashboardCards,
            ...this.donationDashboardStats,
        });
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);

        this.makePreliminaryRequests();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/dashboard/index.scss';
</style>
