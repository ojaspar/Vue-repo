<template>
    <b-container fluid class="donor-transactions">
        <MobileHeader :customerName="selectedDonorName" />

        <div class="donor-transactions__top-section">
            <Loader size="2" v-if="donorDonationsAreStillLoading" />
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
            :searchStringValue="transactionsSearchString"
            searchInputPlaceholder="Search"
            buttonName="Add Donation"
            @search-input-changed="updateTransactionsSearchString"
            @button-clicked="goToNewDonationPage"
            @from-date-filter-has-changed="setFromDateFilter"
            @to-date-filter-has-changed="setToDateFilter"
        />

        <div class="donor-transactions__table">
            <Loader size="3" v-if="donorDonationsAreStillLoading" />

            <transition name="fade" mode="out-in" appear v-else>
                <TransactionTable :transactions="transactionsToBeDispslayed" :searchMatchFound="searchMatchFound" />
            </transition>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TransactionTable from '@/pages/Donations/Donors/DonorTransactionTable.vue';

import { VueExtension, TransactionStatsCard, Status } from '@/types';
import {
    defaultDonor,
    DonationRequestStatus,
    Donor,
    DonorDonation,
    RedemptionTypeOption,
} from '@/pages/Donations/types';

import DonationModule from '@/store/modules/donation';

import SessionStorageService from '@/services/sessionStorage';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component({ components: { TransactionTable } })
export default class DonorDonations extends Vue {
    private selectedDonor: Donor = {
        ...defaultDonor,
    };

    private transactionsSearchString = '';

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
    private donorDonations!: Array<DonorDonation>;

    get donorDonationsAreStillLoading(): boolean {
        return this.donationRequestStatus.getDonorDonations === Status.LOADING;
    }

    get totalDonations(): string {
        //TODO this would have to be computed in some other way. A donor could have made donations in different currencies, we cannot just lump everything together here
        const totalTransactions = this.donorDonations.reduce(
            (previousAmount: number, currenctTransaction: DonorDonation) =>
                previousAmount + currenctTransaction.amount.amount,
            0,
        );

        if (totalTransactions > 0) {
            return this.$options.filters.amountWithCurrency({
                amount: totalTransactions,
                currencyKey: this.donorDonations[0].amount.currencyKey,
            });
        }

        return '0';
    }

    get totalOutstandingPledges(): string {
        //TODO we would need to add the status of a pledge, if it has been redeemed or not, if not, we will be taking values that have been redeemed as outstanding

        const totalTransactions = this.donorDonations
            .filter((transaction: DonorDonation) => transaction.redemptionType === RedemptionTypeOption.PLEDGE)
            .reduce(
                (previousAmount: number, currenctTransaction: DonorDonation) =>
                    previousAmount + currenctTransaction.amount.amount,
                0,
            );

        if (totalTransactions > 0) {
            return this.$options.filters.amountWithCurrency({
                amount: totalTransactions,
                currencyKey: this.donorDonations[0].amount.currencyKey,
            });
        }

        return '0';
    }

    get transactionsSearchStringIsEmpty() {
        return this.transactionsSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.transactionsSearchStringIsEmpty) return true;
        if (!this.transactionsSearchStringIsEmpty && this.donorDonations.length < 1) return true;
        return this.donorDonations.length > 0 && this.transactionsToBeDispslayed.length > 0;
    }

    get datesSelected() {
        return this.fromDate !== '' || this.toDate !== '';
    }

    get dateFilteredTransactions(): DonorDonation[] {
        return this.donorDonations.filter(transaction => {
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

    get transactionListToFilter(): DonorDonation[] {
        if (this.datesSelected) {
            return this.dateFilteredTransactions;
        }
        return this.donorDonations;
    }

    get transactionsToBeDispslayed(): DonorDonation[] {
        if (this.transactionsSearchStringIsEmpty && !this.datesSelected) {
            return this.donorDonations;
        }
        if (this.transactionsSearchStringIsEmpty && this.datesSelected) {
            return this.dateFilteredTransactions;
        }

        //search all transactions' details for a match
        return this.transactionListToFilter.filter(transaction => {
            const values = Object.values(transaction);
            return values.find(value => value.toLowerCase().includes(this.transactionsSearchString.toLowerCase()));
        });
    }

    get selectedDonorName(): string {
        return this.selectedDonor.fullName;
    }

    private updateTransactionsSearchString(searchString: string) {
        this.transactionsSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private goToNewDonationPage() {
        SessionStorageService.setItem('donor', JSON.stringify(this.selectedDonor));
        this.$router.push({ name: 'NewDonation' });
    }

    private async fetchTransactons() {
        let selectedDonor = SessionStorageService.getItem('donor');
        selectedDonor = JSON.parse(selectedDonor);
        if (!selectedDonor) {
            this.$router.push({ name: 'Donors' });
            return;
        }

        this.selectedDonor = selectedDonor;
        const { donorKey } = selectedDonor;
        await donationsModule.getDonorDonations(donorKey);
        SessionStorageService.removeItem('donor');
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Donor Transactions');
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private goToDonorsDashboard() {
        this.$router.push({ name: 'Donors' });
    }

    created() {
        donationsModule = getModule(DonationModule, this.$store);

        this.fetchTransactons();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donation-transactions';
</style>
