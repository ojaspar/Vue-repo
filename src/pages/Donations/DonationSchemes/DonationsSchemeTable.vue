<template>
    <div>
        <div class="donations-module-entity__desktop-medium-table">
            <b-row class="donations-module-entity__heading">
                <b-col class="pl-3">Name</b-col>
                <b-col cols="4" v-if="$root.isMediumScreenSize">Current Amount</b-col>
                <b-col v-else>Current Amount</b-col>
                <b-col cols="4" v-if="$root.isMediumScreenSize">Total Amount</b-col>
                <b-col v-else>Total Amount</b-col>
                <b-col>Description</b-col>
            </b-row>

            <div v-if="donationSchemesAreAvailable">
                <b-row
                    class="donations-module-entity__content"
                    v-for="(donation, index) in donationSchemes"
                    :key="index"
                >
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
                            @click="editDonationScheme(donation)"
                        >
                            Edit Scheme
                        </p>
                        <p
                            class="pointer d-flex donations-module-entity__content-action pl-4"
                            @click="goToNewDonationPage(donation)"
                        >
                            New Donation
                        </p>
                        <p
                            class="pointer d-flex donations-module-entity__content-action pl-4"
                            @click="viewSchemeDonations(donation)"
                        >
                            View Donations
                        </p>
                    </b-col>

                    <b-col class="pl-3" v-if="$root.isMediumScreenSize">
                        {{ donation.name }}
                        <p class="dark--grey">{{ `(${donation.type})` }}</p>
                    </b-col>
                    <b-col class="pl-3" v-else>
                        {{ donation.name }}
                        <span class="dark--grey ml-2">{{ `(${donation.type})` }}</span>
                    </b-col>
                    <b-col cols="4" v-if="$root.isMediumScreenSize">
                        <p class="m-0">
                            {{ functionalCurrencySymbol }}{{ donation.currentAmount.amount | formatAmount }}
                        </p>
                        <p class="dark--grey">({{ donation.targetDate.toString() | monthDateYearFormat }})</p>
                    </b-col>
                    <b-col v-else>
                        <p class="m-0">
                            <span>
                                {{ functionalCurrencySymbol }}{{ donation.currentAmount.amount | formatAmount }}
                            </span>
                            <span class="dark--grey ml-2">
                                ({{ donation.targetDate.toString() | monthDateYearFormat }})
                            </span>
                        </p>
                    </b-col>
                    <b-col cols="4" v-if="$root.isMediumScreenSize">
                        <p class="m-0">
                            {{ functionalCurrencySymbol }}{{ donation.totalAmount.amount | formatAmount }}
                        </p>
                        <p class="dark--grey">
                            ({{ amountInPercentage(donation.totalAmount.amount, donation.financialTarget.amount) }} of
                            {{ functionalCurrencySymbol }}{{ donation.financialTarget.amount | formatAmount }})
                        </p>
                    </b-col>
                    <b-col v-else>
                        <p class="m-0">
                            <span>{{ functionalCurrencySymbol }}{{ donation.totalAmount.amount | formatAmount }}</span>
                            <span class="dark--grey ml-2">
                                ({{
                                    amountInPercentage(donation.totalAmount.amount, donation.financialTarget.amount)
                                }}
                                of {{ functionalCurrencySymbol }}{{ donation.financialTarget.amount | formatAmount }})
                            </span>
                        </p>
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ donation.description || '-' }}</p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="donations-module-entity__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donations-module-entity__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>

        <div class="donations-module-entity__mobile-table">
            <template v-if="donationSchemesAreAvailable">
                <div class="recent-entities" v-if="showRecentDonationSchemes">
                    <p class="recent-entities__heading">Recent Donation Schemes</p>
                    <MobileDonationSchemes
                        :donationSchemes="recentDonationSchemes"
                        :currencySymbol="functionalCurrencySymbol"
                        @edit-existing-donation="editDonationScheme"
                        @goto-add-new-donation-page="goToNewDonationPage"
                        @view-scheme-donations="viewSchemeDonations"
                    />
                </div>
                <div class="all-entities">
                    <p class="all-entities__heading">{{ headlineText }}</p>
                    <MobileDonationSchemes
                        :donationSchemes="donationSchemes"
                        :currencySymbol="functionalCurrencySymbol"
                        @edit-existing-donation="editDonationScheme"
                        @goto-add-new-donation-page="goToNewDonationPage"
                        @view-scheme-donations="viewSchemeDonations"
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

import { VueExtension } from '@/types';

import MobileDonationSchemes from '@/pages/Donations/DonationSchemes/MobileDonationSchemes.vue';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixin from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

import { DonationSchemeDetails } from '@/pages/Donations/DonationSchemes/types';
import { DonationScheme } from '@/pages/Donations/types';

const defaultDonationScheme: DonationSchemeDetails = {
    productKey: '',
    name: '',
    currentAmount: {
        currencyKey: '',
        amount: '',
    },
    totalAmount: {
        currencyKey: '',
        amount: '',
    },
    financialTarget: {
        currencyKey: '',
        amount: '',
    },
    targetDate: new Date().toString(),
    type: '',
    description: '',
    lastTransactionType: '',
    lastTransactionDate: '',
};

@Component({
    components: {
        MobileDonationSchemes,
    },
})
export default class DonationSchemesTable extends Mixins(UtilityMixins, CurrencyMixin) {
    @Prop({ default: () => defaultDonationScheme }) readonly donationSchemes!: Array<DonationSchemeDetails>;
    @Prop({ default: '' }) readonly searchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    public $root!: VueExtension;

    private selectedTableOptionsIndex = '';

    private functionalCurrencySymbol = '';

    get showRecentDonationSchemes(): boolean {
        return this.searchString.length === 0;
    }

    get allDonations(): DonationSchemeDetails[] {
        return this.sortArrayByName(this.donationSchemes.slice());
    }

    get recentDonationSchemes(): DonationSchemeDetails[] {
        const recentSchemes = this.sortByInteractionDate(this.allDonations, 'lastTransactionDate');
        return recentSchemes.slice(0, 2);
    }

    get allDonationSchemes(): Array<DonationSchemeDetails> {
        return this.allDonations.filter((scheme: DonationSchemeDetails) =>
            scheme.name.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Donation Schemes';
    }

    get donationSchemesAreAvailable(): boolean {
        return this.donationSchemes.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.donationSchemesAreAvailable) {
            return 'There are no donation schemes available';
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

    private viewSchemeDonations(donationScheme: DonationScheme) {
        SessionStorageService.setItem('donation-scheme', JSON.stringify(donationScheme));

        this.$router.push({ name: 'DonationSchemeDonations' });
    }

    private goToNewDonationPage(donationScheme: DonationScheme) {
        SessionStorageService.setItem('donation-scheme', JSON.stringify(donationScheme));
        this.$router.push({ name: 'NewDonation' });
    }

    private paymentStatusClass(paymentStatus: string): string {
        return paymentStatus === 'Prepayment' ? 'prepayment' : 'balance';
    }

    private activityTextClass(activity: string): string {
        return activity === 'Pending Supply' ? 'activity-text__pending' : 'activity-text__others';
    }

    private editDonationScheme(donation: DonationSchemeDetails) {
        this.$emit('edit-existing-donation', donation);
    }

    private getFunctionalCurrencySymbol() {
        const accessToken = SessionStorageService.decodeToken();
        const { currencyKey } = accessToken;
        this.functionalCurrencySymbol = this.getCurrencySymbolFromCurrencyKey(currencyKey);
    }

    mounted() {
        this.getFunctionalCurrencySymbol();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/module-entity-table';
</style>
