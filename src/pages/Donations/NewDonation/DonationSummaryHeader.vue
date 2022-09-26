<template>
    <div class="donation-summary-page__table-header">
        <div v-if="isFullSummaryPage" class="donation-summary-page__table-heading--icon"></div>
        <div
            :class="[
                isFullSummaryPage
                    ? 'donation-summary-page__table-heading--number'
                    : 'donation-summary-page__table-heading--number-truncated',
            ]"
        >
            #
        </div>

        <!-- Donation Scheme -->
        <div
            :class="[
                isFullSummaryPage
                    ? 'donation-summary-page__table-heading--item'
                    : 'donation-summary-page__table-heading--item-truncated',
            ]"
        >
            Donation Scheme
        </div>

        <!-- Form -->
        <div
            :class="[
                isFullSummaryPage
                    ? 'donation-summary-page__table-heading--form'
                    : 'donation-summary-page__table-heading--form-truncated',
            ]"
        >
            Form
        </div>

        <!-- Description -->
        <div
            v-if="isFullSummaryPage"
            :class="[
                isFullSummaryPage
                    ? 'donation-summary-page__table-heading--description'
                    : 'donation-summary-page__table-heading--description-truncated',
            ]"
        >
            Description
        </div>

        <!-- Value -->

        <div class="donation-summary-page__table-heading--value" v-if="isFullSummaryPage">
            Value
        </div>

        <div
            :class="[
                isFullSummaryPage
                    ? 'donation-summary-page__table-heading--type'
                    : 'donation-summary-page__table-heading--type-truncated',
            ]"
        >
            Type
        </div>
        <div class="donation-summary-page__table-heading--attachment-icon" v-if="isFullSummaryPage"></div>
        <div class="donation-summary-page__table-heading--edit-icon" v-if="isFullSummaryPage"></div>
        <div class="donation-summary-page__table-heading--delete-icon" v-if="isFullSummaryPage"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class DonationSummaryHeader extends Vue {
    @Prop({ default: false }) readonly isFullSummaryPage!: boolean;
}
</script>
