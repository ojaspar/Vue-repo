<template>
    <b-container fluid class="donations-page">
        <div class="donations-page__content">
            <ManagementModuleTopSection
                :searchStringValue="searchString"
                buttonText="Add Donor"
                @add-new-module-entity="showDonorModal"
                @search-string-changed="updateSearchString"
            />

            <b-row>
                <b-col class="donations-page__table">
                    <DonorsTable
                        :donors="donorsToBeDisplayed"
                        :searchString="searchString"
                        :searchMatchFound="searchMatchFound"
                        :status="donationRequestStatus.getDonors"
                        @edit-existing-donor="handleDonorEditing"
                    />
                </b-col>
            </b-row>
        </div>

        <AddOrEditDonorModal
            :searchedDonor="searchString"
            :donorIsToBeEdited="donorIsToBeEdited"
            :selectedDonorForEditing="selectedDonorForEditing"
            @reset-conditions-for-donor-editing="resetConditionsForDonorEditing"
            @new-donor-added="handleDonorSuccessEvent"
            @existing-donor-updated="handleDonorSuccessEvent"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonorsTable from '@/pages/Donations/Donors/DonorsTable.vue';
import AddOrEditDonorModal from '@/pages/Donations/Donors/AddOrEditDonorModal.vue';
import UtilityMixins from '@/mixins/Utility';
import DonationModule from '@/store/modules/donation';

import { Donor, defaultDonor, DonationRequestStatus } from '@/pages/Donations/types';

const donation = namespace('donation');
let donationModule: DonationModule;

@Component({
    components: {
        DonorsTable,
        AddOrEditDonorModal,
    },
})
export default class DonorsIndex extends Mixins(UtilityMixins) {
    private searchString = '';
    private donorIsToBeEdited = false;
    private selectedDonorForEditing = { ...defaultDonor };

    @donation.State
    private donationRequestStatus!: DonationRequestStatus;

    @donation.State
    private donors!: Array<Donor>;

    get donorsToBeDisplayed(): Donor[] {
        if (this.searchString.length < 1) return this.donors;
        return this.donors.filter(donor => {
            const values = Object.values(donor);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get searchMatchFound() {
        if (this.searchString.length == 0) return true;
        if (this.searchString.length > 0 && this.donors.length < 1) return true;
        return this.donors.length > 0 && this.donorsToBeDisplayed.length > 0;
    }

    private showDonorModal() {
        this.$bvModal.show('add-or-edit-donor-modal');
    }

    private hideDonorModal() {
        this.$bvModal.hide('add-or-edit-donor-modal');
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideDonorModal();
        }, 1000);
    }

    private handleDonorSuccessEvent() {
        this.getAllDonors();
        this.dismissModal();
        this.searchString = '';
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private handleDonorEditing(selectedDonor: Donor) {
        this.donorIsToBeEdited = true;
        this.selectedDonorForEditing = Object.assign(this.selectedDonorForEditing, selectedDonor);
        this.showDonorModal();
    }

    private resetConditionsForDonorEditing() {
        this.donorIsToBeEdited = false;
        this.selectedDonorForEditing = { ...defaultDonor };
    }

    private async getAllDonors() {
        await donationModule.getDonors();
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Mange Donors');
    }

    mounted() {
        donationModule = getModule(DonationModule, this.$store);
        this.getAllDonors();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donors/index.scss';
</style>
