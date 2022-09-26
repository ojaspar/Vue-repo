<template>
    <div class="select-donor">
        <div v-if="!isDonorCompulsory" class="select-donor__proceed-without-donor-section">
            <h2
                @click="$emit('proceed-without-donor-text-clicked')"
                class="select-donor__proceed-without-donor-text pointer"
            >
                Proceed Without Donor Name
            </h2>
            <img class="select-donor__proceed-without-donor-icon" src="@/assets/img/info-icon-white.svg" />
        </div>
        <ListSearchAndAddBar
            buttonText="Add New"
            placeholder="Search for Donor"
            @search-input-changed="updateSearchString"
            @add-new-resource="addNewDonor"
        />

        <div class="select-donor__loader" v-if="getDonorsRequestIsLoading">
            <Loader size="4" />
        </div>

        <template v-else>
            <template v-if="atLeastOneDonorExists">
                <!-- recent donors -->
                <template v-if="showrecentDonors">
                    <p class="select-donor__headline">Recent Donors</p>
                    <div :class="avatarContainerClass">
                        <AvatarAndResource
                            v-for="donor in recentDonors"
                            :item="donor"
                            :key="donor.donorKey"
                            @resource-selected="donorSelectedForDonation"
                            :resource-name="donor.fullName"
                        >
                            <span class="select-donor__item--amount" key="amount" v-if="donor.lastInteraction">{{
                                donor.lastInteraction
                            }}</span>
                            <span class="ml-1 select-donor__item--date" key="date" v-if="donor.lastInteractionDate">
                                <span class="select-donor__interaction-text--italic">{{
                                    donor.lastInteractionDate | humanReadableDateTime
                                }}</span>
                            </span>
                            <!-- drop-down content -->
                            <template v-slot:drop-down>
                                <p
                                    class="select-donor__phone-email-text"
                                    key="phoneEmail"
                                    v-if="donor.phoneNumber && donor.emailAddress"
                                >
                                    {{ donor.phoneNumber }}, {{ donor.emailAddress }}
                                </p>

                                <div class="d-flex avatar-and-resource__actions-container">
                                    <p
                                        class="select-donor__select mr-3 avatar-and-resource__action"
                                        @click.stop="donorSelectedForDonation(donor)"
                                    >
                                        <img
                                            src="@/assets/img/select-resource.svg"
                                            class="select-donor__select--icon mr-2"
                                        />Select Donor
                                    </p>

                                    <p @click.stop="editDonor(donor)" v-if="false">
                                        <img
                                            src="@/assets/img/pencil.svg"
                                            class="select-donor__edit-expanded-details-icon"
                                        />
                                        <span class="select-donor__edit-expanded-details-text">Edit Details</span>
                                    </p>
                                </div>
                            </template>
                        </AvatarAndResource>
                    </div>
                </template>

                <!-- All donors -->
                <p class="select-donor__headline">{{ headlineText }}</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="donor in donorListToBePickedFrom"
                        :item="donor"
                        :key="donor.donorKey"
                        :resource-name="donor.fullName"
                        @resource-selected="donorSelectedForDonation"
                    >
                        <span class="select-donor__item--amount" key="amount" v-if="donor.lastInteraction">{{
                            donor.lastInteraction
                        }}</span>
                        <span class="ml-1 select-donor__item--date" key="date" v-if="donor.lastInteractionDate">
                            <span class="select-donor__interaction-text--italic">{{
                                donor.lastInteractionDate | humanReadableDateTime
                            }}</span>
                        </span>
                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <p
                                class="select-donor__phone-email-text"
                                key="phoneEmail"
                                v-if="donor.phoneNumber && donor.emailAddress"
                            >
                                {{ donor.phoneNumber }}, {{ donor.emailAddress }}
                            </p>

                            <div class="d-flex avatar-and-resource__actions-container">
                                <p
                                    class="select-donor__select mr-3 avatar-and-resource__action"
                                    @click.stop="donorSelectedForDonation(donor)"
                                >
                                    <img
                                        src="@/assets/img/select-resource.svg"
                                        class="select-donor__select--icon mr-2"
                                    />Select Donor
                                </p>

                                <p @click.stop="editDonor(donor)" v-if="false">
                                    <img
                                        src="@/assets/img/pencil.svg"
                                        class="select-donor__edit-expanded-details-icon"
                                    />
                                    <span class="select-donor__edit-expanded-details-text">Edit Details</span>
                                </p>
                            </div>
                        </template>
                    </AvatarAndResource>
                </div>
                <div class="select-donor__no-item-found" v-if="noSearchMatchFound">
                    <p>Looks like you haven't added this donor to your list</p>
                    <p>Click the Add New link above to add this Donor</p>
                </div>
            </template>

            <!-- All donors -->
            <p class="select-donor__headline">{{ headlineText }}</p>
            <div :class="avatarContainerClass">
                <AvatarAndResource
                    v-for="donor in donorListToBePickedFrom"
                    :item="donor"
                    :key="donor.donorKey"
                    :resource-name="donor.fullName"
                    @resource-selected="donorSelectedForDonation"
                >
                    <span class="select-donor__item--amount" key="amount"></span>
                    <i class="select-donor__item--date" key="date" v-if="donor.lastActivity"
                        ><span class="select-donor__interaction-text--italic">{{ donor.lastActivity }}</span
                        >, <span>{{ donor.lastActivityDate | humanReadableDateTime }}</span></i
                    >
                    <!-- drop-down content -->
                    <template v-slot:drop-down>
                        <p class="select-donor__phone-email-text" key="phoneEmail">
                            {{ donor.phoneNumber }}, {{ donor.emailAddress }}
                        </p>

                        <div class="d-flex avatar-and-resource__actions-container">
                            <p
                                class="select-donor__select mr-3 avatar-and-resource__action"
                                @click.stop="donorSelectedForDonation(donor)"
                            >
                                <img
                                    src="@/assets/img/select-resource.svg"
                                    class="select-donor__select--icon mr-2"
                                />Select Donor
                            </p>

                            <!-- <p @click.stop="editDonor(donor)">
                                <img src="@/assets/img/pencil.svg" class="select-donor__edit-expanded-details-icon" />
                                <span class="select-donor__edit-expanded-details-text">Edit Details</span>
                            </p> -->
                        </div>
                    </template>
                </AvatarAndResource>
            </div>

            <div class="select-donor__no-item-found" v-if="donorListIsEmpty">
                <p>Looks like you haven't added any donor to your list</p>
                <p>Click the Add New link above to add a Donor</p>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonationModule from '@/store/modules/donation';

import { Donor, DonationRequestStatus } from '@/pages/Donations/types';
import UtilityMixins from '@/mixins/Utility';
import { Status } from '@/types';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component
export default class SelectDonor extends Mixins(UtilityMixins) {
    private searchString = '';
    private inputVariable = [];

    @Prop({ required: true }) readonly isDonorCompulsory!: boolean;

    @donations.State
    private donors!: Array<Donor>;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    get showrecentDonors(): boolean {
        return this.searchString.length === 0;
    }

    get recentDonors(): Array<Donor> {
        return this.donors.slice(0, 2);
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Donors';
    }

    get donorListToBePickedFrom(): Array<Donor> {
        return this.donors.filter((donor: Donor) =>
            donor.fullName.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get donorListIsEmpty(): boolean {
        return this.donorListToBePickedFrom.length === 0 && this.searchString.length === 0;
    }

    get noSearchMatchFound(): boolean {
        return this.donorListToBePickedFrom.length === 0 && this.searchString.length > 0;
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    get getDonorsRequestIsLoading(): boolean {
        return this.donationRequestStatus.getDonors === Status.LOADING;
    }

    get atLeastOneDonorExists(): boolean {
        return this.donors.length > 0;
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private donorSelectedForDonation(selectedDonor: Donor) {
        this.$emit('donor-selected', selectedDonor);
    }

    private addNewDonor() {
        this.$emit('add-new-donor', this.searchString);
    }

    private editDonor(donorForEdit: Donor) {
        this.$emit('edit-donor', donorForEdit);
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);
        donationsModule.getDonors();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donors/select-donor';
</style>
