<template>
    <b-container fluid class="donation-schemes">
        <div class="donation-schemes__content">
            <ManagementModuleTopSection
                :searchStringValue="searchString"
                buttonText="New Scheme"
                @add-new-module-entity="showDonationSchemeModal"
                @search-string-changed="updateSearchString"
            />

            <b-row>
                <b-col class="donation-schemes__table">
                    <DonationSchemesTable
                        :donationSchemes="donationSchemesToBeDisplayed"
                        :searchString="searchString"
                        :searchMatchFound="searchMatchFound"
                        :status="donationRequestStatus.getDonationSchemes"
                        @edit-existing-donation="handleDonationEditing"
                    />
                </b-col>
            </b-row>
        </div>

        <AddorEditDonationSchemeModal
            :searchedDonation="searchString"
            :donationIsToBeEdited="donationIsToBeEdited"
            :selectedDonationForEditing="selectedDonationForEditing"
            @reset-conditions-for-donation-editing="resetConditionsForDonationEditing"
            @new-donation-scheme-added="handleDonationSuccessEvent"
            @existing-donation-scheme-updated="handleDonationSuccessEvent"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonationModule from '@/store/modules/donation';
import DonationSchemesTable from '@/pages/Donations/DonationSchemes/DonationsSchemeTable.vue';
import AddorEditDonationSchemeModal from '@/pages/Donations/DonationSchemes/AddorEditDonationSchemeModal.vue';

import UtilityMixins from '@/mixins/Utility';

import { DonationSchemeDetails } from '@/pages/Donations/DonationSchemes/types';
import { DonationRequestStatus, DonationScheme } from '@/pages/Donations/types';

const donations = namespace('donation');
let donationsModule: DonationModule;

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
        DonationSchemesTable,
        AddorEditDonationSchemeModal,
    },
})
export default class DonationSchemes extends Mixins(UtilityMixins) {
    private searchString = '';
    private donationIsToBeEdited = false;
    private selectedDonationForEditing = { ...defaultDonationScheme };

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private donationSchemes!: Array<DonationScheme>;

    get donationSchemesToBeDisplayed(): DonationScheme[] {
        if (this.searchString.length < 1) return this.donationSchemes;
        return this.donationSchemes.filter(scheme => {
            const values = Object.values(scheme);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get searchMatchFound() {
        if (this.searchString.length == 0) return true;
        if (this.searchString.length > 0 && this.donationSchemes.length < 1) return true;
        return this.donationSchemes.length > 0 && this.donationSchemesToBeDisplayed.length > 0;
    }

    private showDonationSchemeModal() {
        this.$bvModal.show('add-or-edit-donation-scheme-modal');
    }

    private hideDonationSchemeModal() {
        this.$bvModal.hide('add-or-edit-donation-scheme-modal');
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideDonationSchemeModal();
        }, 1000);
    }

    private handleDonationSuccessEvent() {
        this.searchString = '';
        this.$nextTick(() => {
            this.dismissModal();
        });
        this.getDonationSchemes();
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private handleDonationEditing(selectedDonation: DonationSchemeDetails) {
        this.donationIsToBeEdited = true;
        this.selectedDonationForEditing = Object.assign(this.selectedDonationForEditing, selectedDonation);
        this.showDonationSchemeModal();
    }

    private resetConditionsForDonationEditing() {
        this.donationIsToBeEdited = false;
        this.selectedDonationForEditing = { ...defaultDonationScheme };
    }

    private async getDonationSchemes() {
        await donationsModule.getDonationSchemes();
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Donation Schemes');
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);
        this.getDonationSchemes();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/schemes/index.scss';
</style>
