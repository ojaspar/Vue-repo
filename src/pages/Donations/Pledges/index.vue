<template>
    <b-container fluid class="donations-page">
        <div class="donations-page__content">
            <!-- Redemption Types Filter -->
            <DashboardStatusFilter :filterList="formsOfDonation" @filter-status-changed="updatePledgeTypeFilter">
                <template v-slot:buttons>
                    <div class="dashboard-filter__filter-buttons">
                        <DownloadCsv :data="pledgesExportData" name="donations.csv">
                            <BaseSecondaryButton buttonText="Export to csv" class="mr-2 w-100" />
                        </DownloadCsv>

                        <BasePrimaryButton
                            buttonText="New Donation"
                            @button-clicked="goToNewDonationPage"
                            class="dashboard-filter__filter-buttons--add-donation"
                        />
                    </div>
                </template>
            </DashboardStatusFilter>

            <!-- Search, Dates, Add New Donations-->
            <DashboardMidSection
                :searchStringValue="pledgesSearchString"
                :exportData="pledgesExportData"
                searchInputPlaceholder="Search"
                @search-input-changed="updatePledgesSearchString"
                @add-new-donation="goToNewDonationPage"
                @from-date-filter-has-changed="setFromDateFilter"
                @to-date-filter-has-changed="setToDateFilter"
            />

            <b-row>
                <b-col class="p-0">
                    <transition name="fade" mode="out-in" appear>
                        <PledgesTable
                            :pledges="pledgesToBeDisplayed"
                            :searchString="pledgesSearchString"
                            :searchMatchFound="searchMatchFound"
                            :status="pledgeDonationsRequestStatus"
                            @redeem-pledge="handlePledgeRedemption"
                        />
                    </transition>
                </b-col>
            </b-row>
        </div>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="$emit('hide-modal')">
            <RedeemPledge :pledge="selectedPledge" @pledge-redeemed="$emit('hide-modal')" />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import PledgesTable from '@/pages/Donations/Pledges/PledgesTable.vue';
import DashboardMidSection from '@/pages/Donations/DashboardMidSection.vue';
import RedeemPledge from '@/pages/Donations/Pledges/RedeemPledge.vue';

import UtilityMixins from '@/mixins/Utility';
import DonationModule from '@/store/modules/donation';

import {
    DonationRequestStatus,
    Donation,
    defaultPledge,
    FormOfDonation,
    DonationExport,
    Pledge,
} from '@/pages/Donations/types';
import { DashboardFilterList, MoneyObject } from '@/types';

const donation = namespace('donation');
let donationModule: DonationModule;

@Component({
    components: {
        PledgesTable,
        DashboardMidSection,
        RedeemPledge,
    },
})
export default class Pledges extends Mixins(UtilityMixins) {
    private pledgeIsBeingRedeemed = false;
    private selectedPledge: Pledge = { ...defaultPledge };

    private formsOfDonation: DashboardFilterList[] = [
        { key: 'all-pledges', name: 'All Pledges' },
        { key: 'financial', name: FormOfDonation.FINANCIAL },
        { key: 'item', name: FormOfDonation.ITEM },
        { key: 'service', name: FormOfDonation.SERVICE },
    ];

    private fromDate = '';
    private toDate = '';
    private pledgesSearchString = '';
    private formOfDonationFilter = 'all-pledges';

    @donation.State
    private donationRequestStatus!: DonationRequestStatus;

    @donation.State
    private pledges!: Array<Pledge>;

    get modalId(): string {
        return 'redeem-pledge-modal';
    }

    get modalTitle(): string {
        return 'Pledge Redemption';
    }

    get pledgesSearchStringIsEmpty() {
        return this.pledgesSearchString.length == 0;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get pledgeListToFilter(): Pledge[] {
        if (this.datesNotSelected) {
            return this.donationFormFilteredPledges;
        }

        return this.dateFilteredPledges;
    }

    get pledgesToBeDisplayed(): Pledge[] {
        if (this.pledgesSearchStringIsEmpty && this.datesNotSelected) {
            return this.donationFormFilteredPledges;
        }

        return this.pledgeListToFilter;

        // filter(donation => {
        //     const values = Object.values(donation);
        //     return values.find(value => {
        //         if ((typeof value).toString() !== 'string') return;
        //         return value.toLowerCase().includes(this.pledgesSearchString.toLowerCase());
        //     });
        // });
    }

    get donationFormFilteredPledges(): Pledge[] {
        if (this.formOfDonationFilter === 'all-pledges') {
            return this.pledges;
        }

        return this.pledges.filter((donation: Pledge) =>
            donation.donationForm.toLowerCase().match(this.formOfDonationFilter.toLowerCase()),
        );
    }

    get dateFilteredPledges(): Pledge[] {
        return this.donationFormFilteredPledges.filter(pledge => {
            if (this.fromDate && !this.toDate) {
                return new Date(pledge.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(pledge.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(pledge.transactionDate) >= new Date(this.fromDate) &&
                    new Date(pledge.transactionDate) <= new Date(this.toDate)
                );
            }
            return pledge;
        });
    }

    get searchMatchFound() {
        if (this.pledgesSearchString.length == 0) return true;
        if (this.pledgesSearchString.length > 0 && this.pledges.length < 1) return true;
        return this.pledges.length > 0 && this.pledgesToBeDisplayed.length > 0;
    }

    get pledgeDonationsRequestStatus(): string {
        return this.donationRequestStatus.getDonations;
    }

    get pledgesExportData(): DonationExport[] {
        return this.pledgesToBeDisplayed.map((donation: Pledge) => ({
            ...donation,
            amount: this.formattedAmount(donation.pledgeValue),
            transactionDate: this.$options.filters.monthDateYearFormat(donation.transactionDate),
            pledgeDueDate: donation.pledgeDueDate
                ? this.$options.filters.monthDateYearFormat(donation.pledgeDueDate || '')
                : '',
        }));
    }

    private formattedAmount(amount: MoneyObject): string {
        if (!amount) return '';

        return this.$options.filters.amountWithCurrency(amount);
    }

    private dismissModal() {
        setTimeout(() => {
            this.cancelModal(this.modalId);
        }, 1000);
    }

    private updateSearchString(searchString: string) {
        this.pledgesSearchString = searchString;
    }

    private handlePledgeRedemption(pledge: Donation) {
        this.pledgeIsBeingRedeemed = true;
        this.selectedPledge = Object.assign(this.selectedPledge, pledge);
        this.displayModal(this.modalId);
    }

    private resetConditionsForDonorEditing() {
        this.pledgeIsBeingRedeemed = false;
        this.selectedPledge = { ...defaultPledge };
        this.cancelModal(this.modalId);
    }

    private updatePledgeTypeFilter(pledgeStatus: string) {
        this.formOfDonationFilter = pledgeStatus;
    }

    private updatePledgesSearchString(searchString: string) {
        this.pledgesSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private async getAllPledgeDonations() {
        await donationModule.getPledges();
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Manage Pledges');
    }

    private goToNewDonationPage() {
        this.$router.push({ name: 'NewDonation' });
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    mounted() {
        donationModule = getModule(DonationModule, this.$store);

        this.getAllPledgeDonations();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donors/index.scss';
</style>
