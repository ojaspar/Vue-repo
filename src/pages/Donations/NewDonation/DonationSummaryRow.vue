<template>
    <div class="donation-summary-page__row">
        <div class="donation-summary-page__table-body">
            <div class="donation-summary-page__table-heading--icon" v-if="isFullSummaryPage">
                <img src="@/assets/img/drag-icon.svg" class="donation-summary-page__drag-icon" />
            </div>
            <div
                :class="[
                    isFullSummaryPage
                        ? 'donation-summary-page__table-heading--number'
                        : 'donation-summary-page__table-heading--number-truncated',
                    '',
                ]"
            >
                {{ index + 1 }}
            </div>

            <!-- Donation Scheme Name -->
            <div
                :class="[
                    isFullSummaryPage
                        ? 'donation-summary-page__table-heading--item'
                        : 'donation-summary-page__table-heading--item-truncated',
                ]"
            >
                {{ donationSummary.schemeName }}
            </div>

            <!-- Donation Form -->
            <div
                :class="[
                    isFullSummaryPage
                        ? 'donation-summary-page__table-heading--form'
                        : 'donation-summary-page__table-heading--form-truncated',
                ]"
            >
                {{ donationSummary.donationForm }}
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
                {{ donationSummary.description || '-' }}
            </div>

            <!-- Value -->
            <template v-if="isFullSummaryPage">
                <div
                    v-if="donationSummary.amount.amount"
                    :class="[
                        isFullSummaryPage
                            ? 'donation-summary-page__table-heading--value'
                            : 'donation-summary-page__table-heading--value-truncated',
                    ]"
                >
                    {{ donationSummary.amount | amountWithCurrency }}
                </div>
                <div
                    v-else
                    :class="[
                        isFullSummaryPage
                            ? 'donation-summary-page__table-heading--value'
                            : 'donation-summary-page__table-heading--value-truncated',
                    ]"
                >
                    -
                </div>
            </template>

            <!-- Type -->
            <div
                v-if="userSelectedInstantDonation"
                :class="[
                    isFullSummaryPage
                        ? 'donation-summary-page__table-heading--type'
                        : 'donation-summary-page__table-heading--type-truncated',
                ]"
            >
                <p :class="redemptionTypeClass">
                    {{ donationSummary.redemptionType }}
                </p>
            </div>

            <div
                v-else
                :class="[
                    isFullSummaryPage
                        ? 'donation-summary-page__table-heading--type'
                        : 'donation-summary-page__table-heading--type-truncated',
                ]"
            >
                <div class="d-flex flex-column">
                    <p class="m-0" :class="redemptionTypeClass">
                        {{ donationSummary.redemptionType }}
                    </p>
                    <p class="m-0 donation-summary-page__table-heading--italics">
                        Due: {{ donationSummary.pledgeDueDate | monthDateYearFormat }}
                    </p>
                </div>
            </div>

            <div class="donation-summary-page__table-heading__icons" v-if="isFullSummaryPage">
                <div class="donation-summary-page__table-heading--attachment-icon" v-if="false">
                    <img src="@/assets/img/attachment.svg" class="donation-summary-page__attachment-icon" />
                </div>

                <div class="donation-summary-page__table-heading--edit-icon pointer" @click="editDonationItem">
                    <img src="@/assets/img/pencil.svg" class="donation-summary-page__edit-icon" />
                </div>

                <div class="donation-summary-page__table-heading--delete-icon pointer" @click="handleDeleteModal">
                    <img src="@/assets/img/trash-black-2.svg" class="donation-summary-page__delete-icon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { DonationSummary, RedemptionTypeOption, FormOfDonation } from '@/pages/Donations/types';

@Component
export default class DonationSummaryRow extends Vue {
    @Prop({ default: false }) readonly isFullSummaryPage!: boolean;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({
        default: () => ({
            schemeName: 'Offering',
            redemptionType: RedemptionTypeOption.PLEDGE,
            amount: { amount: 9000, currencyKey: 566 },
            description: 'Lorem Ipsum',
            donationForm: FormOfDonation.ITEM,
            pledgeDueDate: '2020-10-20',
        }),
    })
    readonly donationSummary!: DonationSummary;

    get redemptionTypeClass(): string {
        const { redemptionType } = this.donationSummary;
        const baseClass = 'donation-summary-page__table-heading__type-text';

        if (redemptionType.toLowerCase().match(/instant/)) {
            return `${baseClass}--instant`;
        }

        return `${baseClass}--pledge`;
    }

    get userSelectedInstantDonation(): boolean {
        return this.donationSummary.redemptionType === RedemptionTypeOption.INSTANT;
    }

    get userSelectedItemDonationForm(): boolean {
        return this.donationSummary.donationForm === FormOfDonation.ITEM;
    }

    private editDonationItem() {
        this.$parent.$emit('edit-donation-summary-item', this.index);
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

<style lang="scss"></style>
