<template>
    <div>
        <div class="donations-module-entity__desktop-medium-table">
            <b-row class="donations-module-entity__heading">
                <b-col class="pl-3">Name</b-col>
                <b-col>Donation</b-col>
                <b-col>E-mail/Phone</b-col>
                <b-col>Address/Notes</b-col>
            </b-row>

            <div v-if="donorsAreAvailable">
                <b-row class="donations-module-entity__content" v-for="(donor, index) in donors" :key="index">
                    <font-awesome-icon
                        icon="ellipsis-h"
                        class="pointer"
                        title="More options"
                        @click="toggleShowOptions(index)"
                        @mousedown="preventBlurFromHappening"
                    /><b-col
                        cols="1"
                        tabindex="-1"
                        class="donations-module-entity__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p
                            class="pointer d-flex donations-module-entity__content-action pl-4"
                            @click="editDonor(donor)"
                        >
                            Edit Donor
                        </p>
                        <p
                            class="pointer d-flex donations-module-entity__content-action pl-4"
                            @click.stop="viewDonorDonations(donor)"
                        >
                            View Donations
                        </p>
                        <p
                            class="pointer d-flex donations-module-entity__content-action pl-4"
                            @click="goToNewDonationPage(donor)"
                        >
                            New Donation
                        </p>
                    </b-col>

                    <b-col class="pl-3">
                        {{ donor.fullName }}
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ functionalCurrency }}{{ donor.totalDonation.amount | formatAmount }}</p>
                        <p
                            class="donations-module-entity__content--pledge m-0"
                            v-if="donorHasPledged(donor.totalPledge.amount)"
                        >
                            {{ donor.totalPledge | amountWithCurrency }}
                            <span>Pledged</span>
                        </p>
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ donor.emailAddress }}</p>
                        <p class="m-0">{{ donor.phoneNumber }}</p>
                    </b-col>
                    <b-col>
                        <p class="donations-module-entity__content--ml" v-if="contentIsEmpty(donor)">-</p>
                        <span v-else>
                            <p class="m-0">{{ donor.address }}</p>
                            <p class="m-0">{{ donor.notes }}</p>
                        </span>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="donations-module-entity__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donations-module-entity__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
        <div class="donations-module-entity__mobile-table">
            <template v-if="donorsAreAvailable">
                <div class="recent-entities" v-if="showRecentDonors">
                    <p class="recent-entities__heading">Recent Donors</p>
                    <MobileDonorsTable
                        :donors="recentDonorsToBeDisplayed"
                        :functionalCurrency="functionalCurrency"
                        @edit-existing-donor="editDonor"
                        @goto-add-new-donation-page="goToNewDonationPage"
                        @view-donor-transactions="viewDonorDonations"
                    />
                </div>
                <div class="all-entities">
                    <p class="all-entities__heading">{{ headlineText }}</p>
                    <MobileDonorsTable
                        :donors="donorsToBeDisplayed"
                        :functionalCurrency="functionalCurrency"
                        @edit-existing-donor="editDonor"
                        @goto-add-new-donation-page="goToNewDonationPage"
                        @view-donor-transactions="viewDonorDonations"
                    />
                </div>
            </template>
            <div v-else-if="requestIsLoading" cols="12" class="donations-module-entity__content--loader">
                <Loader size="4" />
            </div>
            <div v-else cols="12" class="donations-module-entity__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import MobileDonorsTable from '@/pages/Donations/Donors/MobileDonorsTable.vue';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

import { Donor, defaultDonor } from '@/pages/Donations/types';

@Component({
    components: {
        MobileDonorsTable,
    },
})
export default class DonorsTable extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: () => defaultDonor }) readonly donors!: Array<Donor>;
    @Prop({ default: '' }) readonly searchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    private functionalCurrency = '';

    get recentDonorsToBeDisplayed(): Donor[] {
        const recentDonors = this.sortByInteractionDate(this.donors.slice(), 'lastInteractionDate');
        return recentDonors.slice(0, 2);
    }

    get showRecentDonors(): boolean {
        return this.searchString.length === 0;
    }

    get donorsToBeDisplayed(): Array<Donor> {
        return this.donors.filter((donor: Donor) =>
            donor.fullName.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Donors';
    }

    get donorsAreAvailable(): boolean {
        return this.donors.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.donorsAreAvailable) {
            return 'There are no donors available';
        }
        return '';
    }

    get requestIsLoading() {
        return this.status === 'LOADING';
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }

        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private contentIsEmpty(donor: Donor): boolean {
        const { address, notes } = donor;
        return address == '' && notes == '';
    }

    private getFunctionalCurrency() {
        const accessToken = SessionStorageService.decodeToken();
        const { currencyKey } = accessToken;
        this.functionalCurrency = this.getCurrencySymbolFromCurrencyKey(currencyKey);
    }

    private goToNewDonationPage(donor: Donor) {
        SessionStorageService.setItem('donor', JSON.stringify(donor));
        this.$router.push({ name: 'NewDonation' });
    }

    private viewDonorDonations(donor: Donor) {
        SessionStorageService.setItem('donor', JSON.stringify(donor));
        this.$router.push({ name: 'DonorDonations' });
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private paymentStatusClass(paymentStatus: string): string {
        return paymentStatus === 'Prepayment' ? 'prepayment' : 'balance';
    }

    private activityTextClass(activity: string): string {
        return activity === 'Pending Supply' ? 'activity-text__pending' : 'activity-text__others';
    }

    private editDonor(donor: Donor) {
        this.$emit('edit-existing-donor', donor);
    }

    private donorHasPledged(pledgeAmount: number) {
        return pledgeAmount > 0;
    }

    mounted() {
        this.getFunctionalCurrency();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/module-entity-table';
</style>
