<template>
    <div class="select-donation">
        <ListSearchAndAddBar
            buttonText="Add New"
            placeholder="Search for Donation"
            @search-input-changed="updateSearchString"
            @add-new-resource="addNewDonationScheme"
        />

        <div class="select-donation__loader" v-if="getDonationSchemesRequestIsLoading">
            <Loader size="4" />
        </div>

        <template v-else>
            <!-- recent donation schemes -->
            <template v-if="showRecentDonationSchemes">
                <p class="select-donation__headline">Recent Donations</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="donationScheme in recentDonationSchemes"
                        :item="donationScheme"
                        :key="donationScheme.donationSchemeKey"
                        :resource-name="donationScheme.name"
                        @resource-selected="donationSchemeSelected(donationScheme)"
                    >
                        <span class="select-donation__item--amount" key="amount"></span>
                        <i class="select-donation__item--date" key="date" v-if="donationScheme.lastTransactionDate"
                            ><span>{{ donationScheme.currentAmount | amountWithCurrency }}</span>
                            <span class="select-donation__interaction-text ml-2">{{
                                donationScheme.lastTransactionDate | humanReadableDateTime
                            }}</span></i
                        >
                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <div class="d-flex avatar-and-resource__actions-container">
                                <p
                                    class="select-donation__select mr-3 avatar-and-resource__action"
                                    @click.stop="donationSchemeSelected(donationScheme)"
                                >
                                    <img
                                        src="@/assets/img/select-resource.svg"
                                        class="select-donation__select--icon mr-1"
                                    />Select Donation
                                </p>

                                <!-- <p @click.stop="editDonationScheme(donationScheme)">
                                    <img
                                        src="@/assets/img/pencil.svg"
                                        class="select-donation__edit-expanded-details-icon"
                                    />
                                    <span class="select-donation__edit-expanded-details-text">Edit Details</span>
                                </p> -->
                            </div>
                        </template>
                    </AvatarAndResource>
                </div>
            </template>

            <!-- All donation schemes -->
            <p class="select-donation__headline">{{ headlineText }}</p>
            <div :class="avatarContainerClass">
                <AvatarAndResource
                    v-for="donationScheme in donationSchemesToBePickedFrom"
                    :item="donationScheme"
                    :key="donationScheme.donationSchemeKey"
                    :resource-name="donationScheme.name"
                    @resource-selected="donationSchemeSelected(donationScheme)"
                >
                    <span class="select-donation__item--amount" key="amount"></span>
                    <i class="select-donation__item--date" key="date" v-if="donationScheme.lastTransactionDate"
                        ><span>{{ donationScheme.currentAmount | amountWithCurrency }}</span>
                        <span class="select-donation__interaction-text ml-2">{{
                            donationScheme.lastTransactionDate | humanReadableDateTime
                        }}</span></i
                    >
                    <!-- drop-down content -->
                    <template v-slot:drop-down>
                        <div class="d-flex avatar-and-resource__actions-container">
                            <p
                                class="select-donation__select mr-3 avatar-and-resource__action"
                                @click.stop="donationSchemeSelected(donationScheme)"
                            >
                                <img
                                    src="@/assets/img/select-resource.svg"
                                    class="select-donation__select--icon mr-1"
                                />Select Donation
                            </p>

                            <!-- <p @click.stop="editDonationScheme(donationScheme)">
                                <img
                                    src="@/assets/img/pencil.svg"
                                    class="select-donation__edit-expanded-details-icon"
                                />
                                <span class="select-donation__edit-expanded-details-text">Edit Details</span>
                            </p> -->
                        </div>
                    </template>
                </AvatarAndResource>
            </div>

            <div class="select-donation__no-item-found" v-if="donationSchemeListIsEmpty">
                <p>Looks like you haven't added any donation scheme to your list</p>
                <p>Click the Add New link above to add a Donation scheme</p>
            </div>
            <div class="select-donation__no-item-found" v-else-if="noSearchMatchFound">
                <p>Looks like you haven't added this donation scheme to your list</p>
                <p>Click the Add New link above to add this Donation scheme</p>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonationModule from '@/store/modules/donation';

import { DonationRequestStatus, DonationScheme } from '@/pages/Donations/types';
import { Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component
export default class SelectDonationScheme extends Mixins(UtilityMixins) {
    private searchString = '';
    private inputVariable = [];

    @donations.State
    private donationSchemes!: Array<DonationScheme>;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    get showRecentDonationSchemes(): boolean {
        return this.searchString.length === 0;
    }

    get recentDonationSchemes(): Array<DonationScheme> {
        return this.donationSchemes.slice(0, 2);
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Donations';
    }

    get donationSchemesToBePickedFrom(): Array<DonationScheme> {
        return this.donationSchemes.filter((donationScheme: DonationScheme) =>
            donationScheme.name.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get donationSchemeListIsEmpty(): boolean {
        return this.donationSchemesToBePickedFrom.length === 0 && this.searchString.length === 0;
    }

    get noSearchMatchFound(): boolean {
        return this.donationSchemesToBePickedFrom.length === 0 && this.searchString.length > 0;
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    get getDonationSchemesRequestIsLoading(): boolean {
        return this.donationRequestStatus.getDonationSchemes === Status.LOADING;
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private donationSchemeSelected(selectedDonationScheme: DonationScheme) {
        this.$emit('donation-scheme-selected', selectedDonationScheme);
    }

    private addNewDonationScheme() {
        this.$emit('add-new-donation-scheme', this.searchString);
    }

    private editDonationScheme(donationSchemeForEdit: DonationScheme) {
        this.$emit('edit-donation-scheme', donationSchemeForEdit);
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);
        donationsModule.getDonationSchemes();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/schemes/select-donation-scheme';
</style>
