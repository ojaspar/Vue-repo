<template>
    <b-container fluid class="donor-transactions">
        <MobileHeader :customerName="selectedDonationSchemeName" />

        <div class="donor-transactions__top-section">
            <Loader size="2" v-if="schemeDonationsAreStillLoading" />
            <TransactionStatsCards v-else :firstStats="firstCardStats" />
        </div>

        <b-row class="donor-transactions__button-container">
            <BasePrimaryButton
                buttonText="Add Donation"
                :overRideButtonClass="true"
                className="donor-transactions__button"
                @button-clicked="goToNewDonationPage"
            />
        </b-row>

        <!-- Search, Dates, Add New Expense-->
        <TransactionMidSection
            :searchStringValue="donationSearchString"
            searchInputPlaceholder="Search"
            buttonName="Add Donation"
            @search-input-changed="updateDonationsSearchString"
            @button-clicked="goToNewDonationPage"
            @from-date-filter-has-changed="setFromDateFilter"
            @to-date-filter-has-changed="setToDateFilter"
        />

        <div class="donor-transactions__table">
            <Loader size="3" v-if="schemeDonationsAreStillLoading" />

            <transition name="fade" mode="out-in" appear v-else>
                <TransactionTable :transactions="donationsToBeDisplayed" :searchMatchFound="searchMatchFound" />
            </transition>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TransactionTable from '@/pages/Donations/DonationSchemes/DonationSchemeDonationsTable.vue';

import { VueExtension, TransactionStatsCard, Status } from '@/types';
import {
    defaultDonationScheme,
    DonationRequestStatus,
    RedemptionTypeOption,
    DonationScheme,
    SchemeDonation,
} from '@/pages/Donations/types';

import DonationModule from '@/store/modules/donation';

import SessionStorageService from '@/services/sessionStorage';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component({ components: { TransactionTable } })
export default class DonationSchemeDonations extends Vue {
    private selectedScheme: DonationScheme = { ...defaultDonationScheme };

    private donationSearchString = '';

    private fromDate = '';

    private toDate = '';

    public $root!: VueExtension;

    public $options!: {
        filters: {
            amountWithCurrency: Function;
        };
    };

    get firstCardStats(): TransactionStatsCard {
        return {
            firstCardHeader: 'Total Donations',
            firstCardBody: this.totalDonations,
            secondCardHeader: 'Outstanding Pledges',
            secondCardBody: this.totalOutstandingPledges,
        };
    }

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private schemeDonations!: Array<SchemeDonation>;

    get schemeDonationsAreStillLoading(): boolean {
        return this.donationRequestStatus.getSchemeDonations === Status.LOADING;
    }

    get totalDonations(): string {
        //TODO this would have to be computed in some other way. A donation could have been made in different currencies, we cannot just lump everything together here
        const totalTransactions = this.schemeDonations.reduce(
            (previousAmount: number, currenctTransaction: SchemeDonation) =>
                previousAmount + currenctTransaction.currentAmount.amount,
            0,
        );

        if (totalTransactions > 0) {
            return this.$options.filters.amountWithCurrency({
                amount: totalTransactions,
                currencyKey: this.schemeDonations[0].currentAmount.currencyKey,
            });
        }

        return '0';
    }

    get totalOutstandingPledges(): string {
        //TODO we would need to add the status of a pledge, if it has been redeemed or not, if not, we will be taking values that have been redeemed as outstanding

        const totalTransactions = this.schemeDonations
            .filter((transaction: SchemeDonation) => transaction.redemptionType === RedemptionTypeOption.PLEDGE)
            .reduce(
                (previousAmount: number, currenctTransaction: SchemeDonation) =>
                    previousAmount + currenctTransaction.currentAmount.amount,
                0,
            );

        if (totalTransactions > 0) {
            return this.$options.filters.amountWithCurrency({
                amount: totalTransactions,
                currencyKey: this.schemeDonations[0].currentAmount.currencyKey,
            });
        }

        return '0';
    }

    get donationSearchStringIsEmpty() {
        return this.donationSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.donationSearchStringIsEmpty) return true;
        if (!this.donationSearchStringIsEmpty && this.schemeDonations.length < 1) return true;
        return this.schemeDonations.length > 0 && this.donationsToBeDisplayed.length > 0;
    }

    get datesSelected() {
        return this.fromDate !== '' || this.toDate !== '';
    }

    get dateFilteredDonations(): SchemeDonation[] {
        return this.schemeDonations.filter(transaction => {
            if (this.fromDate && !this.toDate) {
                return new Date(transaction.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(transaction.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(transaction.transactionDate) >= new Date(this.fromDate) &&
                    new Date(transaction.transactionDate) <= new Date(this.toDate)
                );
            }
            return transaction;
        });
    }

    get donationListToFilter(): SchemeDonation[] {
        if (this.datesSelected) {
            return this.dateFilteredDonations;
        }
        return this.schemeDonations;
    }

    get donationsToBeDisplayed(): SchemeDonation[] {
        if (this.donationSearchStringIsEmpty && !this.datesSelected) {
            return this.schemeDonations;
        }
        if (this.donationSearchStringIsEmpty && this.datesSelected) {
            return this.dateFilteredDonations;
        }

        //search all transactions' details for a match
        return this.donationListToFilter.filter(transaction => {
            const values = Object.values(transaction);
            return values.find(value => value.toLowerCase().includes(this.donationSearchString.toLowerCase()));
        });
    }

    get selectedDonationSchemeName(): string {
        return this.selectedScheme.name;
    }

    private updateDonationsSearchString(searchString: string) {
        this.donationSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private goToNewDonationPage() {
        this.$router.push({ name: 'NewDonation' });
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private async fetchDonations() {
        let selectedDonationScheme = SessionStorageService.getItem('donation-scheme');
        selectedDonationScheme = JSON.parse(selectedDonationScheme);

        if (!selectedDonationScheme) {
            this.$router.push({ name: 'DonationSchemes' });
            return;
        }

        const { donationSchemeKey } = selectedDonationScheme;
        this.selectedScheme = selectedDonationScheme;

        await donationsModule.getSchemeDonations(donationSchemeKey);
        SessionStorageService.removeItem('donation-scheme');
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Donor Transactions');
    }

    created() {
        donationsModule = getModule(DonationModule, this.$store);

        this.fetchDonations();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donation-transactions.scss';
</style>
