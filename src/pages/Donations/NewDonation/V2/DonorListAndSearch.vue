<template>
    <b-container fluid class="p-0 donor-list__wrapper">
        <!--Donor Search-->
        <b-row class="donor-list__top-section" tabindex="-1" ref="donorList">
            <div class="donor-list__top-section--left">
                <BaseInputField
                    placeholder="Enter Donor Name (Optional)"
                    inputContainerClass="donor-list__search"
                    className="donor-list__search--input"
                    v-model="searchString"
                    @focus="showDonors"
                    @blur="hideDonors"
                />
            </div>
            <div class="donor-list__top-section--right">
                <span class="donor-list__search--icon-container">
                    <font-awesome-icon icon="search" class="donor-list__search--icon" />
                </span>
                <span class="donor-list__add-donor-btn" @click="showDonorModal">Add Donor</span>
            </div>
        </b-row>

        <!--Donor List-->
        <b-row class="donor-list__donors--container" v-if="showDonorList" @mousedown="preventBlurFromHappening">
            <div v-if="donorsAreAvailable" cols="12" class="donor-list__donors">
                <AvatarAndResource
                    v-for="(donor, index) in donorsToBeDisplayed"
                    :key="index"
                    :resourceName="donor.fullName"
                    :showChevronIcon="false"
                    :itemKey="donor.donorKey"
                    expandedItemKey=""
                    @resource-selected="handleDonorSelection(donor)"
                >
                    <template>
                        <span v-if="donor.lastInteractionDate">
                            Donated {{ donor.lastInteractionDate | monthDateYearFormat }}
                        </span>
                    </template>
                </AvatarAndResource>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="donor-list__donors--loader">
                <Loader size="3" />
            </div>

            <div v-show="contentIsEmpty" cols="12" class="donor-list__donors--empty">
                <span v-html="noContentMessage"></span>
            </div>
        </b-row>

        <!--Add New Donor-->
        <AddDonorModal :searchedDonor="searchString" @new-donor-added="handleNewDonorCreation" />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { defaultDonor, Donor } from '@/pages/Donations/types';
import { Status } from '@/types';

import AddDonorModal from '@/pages/Donations/Donors/AddOrEditDonorModal.vue';

import UtilityMixins from '@/mixins/Utility';

@Component({
    components: {
        AddDonorModal,
    },
})
export default class DonorListAndSearch extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly donors!: Donor[];
    @Prop({ default: Status.NORMAL }) readonly requestStatus!: Status;
    @Prop({ default: false }) readonly resetFormInput!: boolean;
    @Prop({ default: () => ({ ...defaultDonor }) }) readonly preselectedDonor!: Donor;

    private searchString = '';

    private showDonorList = false;

    public $refs!: {
        donorList: HTMLFormElement;
    };

    get requestIsLoading() {
        return this.requestStatus === Status.LOADING;
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString === '';
    }

    get contentIsEmpty() {
        return !this.requestIsLoading && this.noContentMessage != '';
    }

    get searchMatchFound(): boolean {
        if (this.searchString.length == 0) return true;
        if (this.searchString.length > 0 && this.donors.length < 1) return true;
        return this.donorsToBeDisplayed.length > 0;
    }

    get donorsAreAvailable(): boolean {
        return this.donors.length > 0;
    }

    get donorsToBeDisplayed(): Donor[] {
        if (this.searchStringIsEmpty) return this.donors;

        return this.donors.filter(donor => donor.fullName.toLowerCase().match(this.searchString.toLowerCase()));
    }

    get noContentMessage() {
        if (!this.searchMatchFound) {
            return `<p>No match found</p>`;
        }
        if (!this.donorsAreAvailable) {
            return `<p>Looks like you haven't added any donor yet.</p>
                        <p>Click the 'Add Donor' link above to add a donor</p>`;
        }
        return '';
    }

    @Watch('resetFormInput')
    resetFormInputValue(resetFormInput: boolean) {
        if (resetFormInput) {
            this.searchString = '';
        }
    }

    @Watch('preselectedDonor.fullName')
    setFormValue(donorName: string) {
        this.searchString = donorName;
    }

    private showDonorModal() {
        this.$bvModal.show('add-or-edit-donor-modal');
    }

    private hideDonorModal() {
        this.$bvModal.hide('add-or-edit-donor-modal');
    }

    private handleNewDonorCreation(donor: Donor) {
        this.handleDonorSelection(donor);
        this.dismissModal();
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideDonorModal();
        }, 1000);
    }

    private showDonors() {
        this.showDonorList = true;
    }

    private hideDonors() {
        this.showDonorList = false;
        //this.searchString = '';
    }

    private handleDonorSelection(donor: Donor) {
        this.$emit('donor-selected', donor);
        this.searchString = donor.fullName;
        this.$refs.donorList.focus();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/new-donation/donor-list-and-search.scss';
</style>
