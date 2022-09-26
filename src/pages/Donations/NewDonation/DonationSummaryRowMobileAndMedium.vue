<template>
    <div class="donation-summary-page__card-container pointer" @click="toggleFullDetailsVisibility">
        <!-- Donation Scheme Name and Icon -->
        <b-row class="donation-summary-page__mobile">
            <b-col class="donation-summary-page__mobile--donation-name">{{ donationSummary.schemeName }}</b-col>
            <b-col class="donation-summary-page__mobile--dropdown-icon"
                ><font-awesome-icon :icon="dropdownIcon" aria-hidden="true"
            /></b-col>
        </b-row>

        <!-- Donation Amount -->
        <b-row class="donation-summary-page__mobile">
            <b-col v-if="donationSummary.amount.amount"> {{ donationSummary.amount | amountWithCurrency }} </b-col>
            <b-col
                class="donation-summary-page__table-heading__type-text donation-summary-page__mobile--type-text"
                :class="redemptionTypeClass"
                >{{ donationSummary.redemptionType }}</b-col
            >
        </b-row>

        <transition-group name="slide-up-fade">
            <template v-if="showFullDetails">
                <!-- Discount -->
                <b-row class="donation-summary-page__mobile text--black" key="scheme">
                    <b-col cols="12" class="donation-summary-page__table-heading--item">{{
                        donationSummary.schemeName
                    }}</b-col>
                </b-row>

                <!-- Notes and Files -->
                <b-row class="donation-summary-page__mobile text--grey" key="description">
                    <b-col cols="12" class="donation-summary-page__table-heading--item"
                        >Description: {{ donationSummary.description }}</b-col
                    >
                </b-row>

                <!-- Edit and Delete Icons -->
                <b-row key="icons" class="donation-summary-page__mobile--icons-section">
                    <b-col
                        class="donation-summary-page__mobile--edit"
                        @click.stop="$parent.$emit('edit-donation-summary-item', index)"
                    >
                        <img
                            src="@/assets/img/pencil.svg"
                            class="donation-summary-page__mobile--edit-icon"
                        />Edit</b-col
                    >
                    <b-col class="donation-summary-page__mobile--delete" @click.stop="handleDeleteModal">
                        <img
                            src="@/assets/img/cancel-icon.svg"
                            class="donation-summary-page__mobile--delete-icon"
                        />Delete</b-col
                    >
                </b-row>
            </template>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { DonationSummary } from '@/pages/Donations/types';

@Component
export default class DonationSummaryRowMobileAndMedium extends Vue {
    @Prop({ default: '' }) readonly clickedSummaryIndex!: number;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: () => ({}) }) readonly donationSummary!: DonationSummary;

    get redemptionTypeClass(): string {
        const { redemptionType } = this.donationSummary;
        const baseClass = 'donation-summary-page__table-heading__type-text';

        if (redemptionType.toLowerCase().match(/instant/)) {
            return `${baseClass}--instant`;
        }

        return `${baseClass}--pledge`;
    }

    get showFullDetails(): boolean {
        return this.index === this.clickedSummaryIndex;
    }

    get dropdownIcon(): string {
        return this.showFullDetails ? 'chevron-up' : 'chevron-down';
    }

    private toggleFullDetailsVisibility() {
        this.$emit('toggle-visibility', this.index);
    }

    private handleDeleteModal() {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Remove Item',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.deleteDonationItem();
            })
            .catch(err => err);
    }

    private deleteDonationItem() {
        // show modal to tell user to confirm their action
        this.$parent.$emit('delete-donation-summary-item', this.index);
    }
}
</script>

<style></style>
