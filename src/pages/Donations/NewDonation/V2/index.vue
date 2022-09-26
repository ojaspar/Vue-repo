<template>
    <b-container fluid class="p-0 add-donation-page">
        <SuccessPage v-if="donationMadeSuccessfully" successText="Your Donation was recorded successfully">
            <BaseButton
                buttonText="Donations History"
                :overRideButtonClass="true"
                @button-clicked="goToDonationsDashboard"
                className="success-page__btn success-page__btn--receipt success-page__btn--white"
            />
            <BasePrimaryButton
                buttonText="New Donation"
                @button-clicked="startFreshDonation"
                className="success-page__btn success-page__btn--blue"
            />
        </SuccessPage>

        <b-row class="new-donation" v-else>
            <!-- Add Donation Form Section -->
            <AddDonation :action="action" />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import AddDonation from '@/pages/Donations/NewDonation/V2/AddDonationForm.vue';

import UtilityMixins from '@/mixins/Utility';

@Component({
    components: { AddDonation },
})
export default class NewDonation extends Mixins(UtilityMixins) {
    @Prop({ default: false }) action!: string;

    get pageTitle(): string {
        if (this.action === 'edit') return 'Edit Donation';

        return 'New Donation';
    }

    private donationMadeSuccessfully = false;

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private startFreshDonation() {
        this.donationMadeSuccessfully = false;
    }

    private showSuccessNotification() {
        this.donationMadeSuccessfully = true;
    }

    mounted() {
        this.$parent.$emit('update-page-title', this.pageTitle);
    }
}
</script>
