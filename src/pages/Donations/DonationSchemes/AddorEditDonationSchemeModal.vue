<template>
    <b-container>
        <b-modal
            id="add-or-edit-donation-scheme-modal"
            no-close-on-backdrop
            @show="checkFormMode"
            @hide="resetFormMode"
        >
            <template v-slot:modal-header>
                <div class="add-donation-modal__heading">
                    <h2 class="add-donation-modal__heading--text ">{{ modalTitle }}</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>
            <AddOrEditDonationSchemeForm
                :searchedDonationSchemeName="searchedDonation"
                :donationIsEditing="donationIsToBeEdited"
                :donationSchemeToBeEdited="selectedDonationForEditing"
                @new-donation-scheme-added="$emit('new-donation-scheme-added')"
                @existing-donation-scheme-updated="$emit('existing-donation-scheme-updated')"
            />
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import AddOrEditDonationSchemeForm from '@/pages/Donations/DonationSchemes/AddEditDonationScheme.vue';

import { DonationSchemeDetails } from '@/pages/Donations/DonationSchemes/types';

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
    targetDate: '2021-01-16',
    type: '',
    description: '',
    lastTransactionType: '',
    lastTransactionDate: '2020-01-16',
};

@Component({
    components: {
        AddOrEditDonationSchemeForm,
    },
})
export default class AddorEditDonationSchemeModal extends Vue {
    @Prop({ default: '' }) readonly searchedDonation!: string;
    @Prop({ default: false }) readonly donationIsToBeEdited!: boolean;
    @Prop({ default: () => defaultDonationScheme }) readonly selectedDonationForEditing!: DonationSchemeDetails;

    private modalTitle = 'New Donation Scheme';

    private hideModal() {
        this.$bvModal.hide('add-or-edit-donation-scheme-modal');
    }

    private checkFormMode() {
        this.$nextTick(() => {
            if (this.donationIsToBeEdited) {
                this.modalTitle = 'Edit Donation Scheme';
            }
        });
    }

    private resetFormMode() {
        this.modalTitle = 'Add Donation Scheme';
        this.$emit('reset-conditions-for-donation-editing');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/schemes/add-or-edit-donation-scheme-modal';
</style>
