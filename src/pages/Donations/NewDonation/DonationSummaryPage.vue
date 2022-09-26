<template>
    <div>
        <div class="donation-summary-page__section--xl">
            <!-- Desktop screen -->
            <template v-if="userIsOnDesktop">
                <div class="donation-summary-page__table">
                    <DonationSummaryHeader :isFullSummaryPage="isFullSummaryPage" />
                    <div class="donation-summary-page__row-container">
                        <DonationSummaryRow
                            v-for="(donationSummary, index) in donationSummaries"
                            :isFullSummaryPage="isFullSummaryPage"
                            :donationSummary="donationSummary"
                            :key="index"
                            :index="index"
                        />
                    </div>
                    <BaseButton
                        buttonText="Add Another Donation"
                        class="donation-summary-page__add-new-item-btn donation-summary-page__add-new-item-btn--xl"
                        @button-clicked="$emit('add-another-donation-button-clicked')"
                        :overRideButtonClass="true"
                        v-if="isFullSummaryPage"
                    >
                        <CircularPlusSign />
                    </BaseButton>
                </div>
            </template>

            <!-- Donation Summary Form Mobile-->
            <template v-else>
                <!-- Mobile screen -->
                <DonationSummaryRowMobileAndMedium
                    v-for="(donationSummary, index) in donationSummaries"
                    :donationSummary="donationSummary"
                    :key="index"
                    :index="index"
                    :clickedSummaryIndex="clickedSummaryIndex"
                    @toggle-visibility="handleDonationSummaryVisibility"
                />
                <BaseButton
                    buttonText="Add Another Donation"
                    class="donation-summary-page__add-new-item-btn"
                    :overRideButtonClass="true"
                    @button-clicked="$emit('add-another-donation-button-clicked')"
                >
                    <CircularPlusSign />
                </BaseButton>

                <div>
                    <b-row class="donation-summary-page__mobile--summary-section">
                        <b-col
                            ><BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Total', homeCurrencyKey)"
                                disabled="true"
                                :value="convertFigureToCurrency(totalValue.amount)"
                        /></b-col>
                        <b-col v-if="totalPledge.amount"
                            ><BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="
                                    wrapFloatingLabelTextWithCurrencySymbol('Total Pledge', homeCurrencyKey)
                                "
                                disabled="true"
                                :value="convertFigureToCurrency(totalPledge.amount)"
                        /></b-col>
                    </b-row>

                    <b-row>
                        <BaseButton
                            buttonText="Submit"
                            class="donation-summary-page__submit-btn ml-auto mr-auto"
                            :overRideButtonClass="true"
                            :status="donationsCreationStatus"
                            @button-clicked="handleDonationsSubmission"
                        />
                    </b-row>
                </div>
            </template>

            <template v-if="donationSummariesIsNotEmpty && isFullSummaryPage">
                <div class="donation-summary-page__total-section--xl d-flex justify-content-between">
                    <div class="donation-summary-page__total-estimate-section">
                        <span>Total Value: </span>
                        <span class="donation-summary-page__text--pull-right">{{
                            totalValue | amountWithCurrency
                        }}</span>
                    </div>
                    <div class="donation-summary-page__total-estimate-section">
                        <span>Total Pledge: </span>
                        <span class="donation-summary-page__text--pull-right">{{
                            totalPledge | amountWithCurrency
                        }}</span>
                    </div>
                </div>
            </template>

            <div class="d-flex w-50 mr-auto ml-auto justify-content-center" v-if="donationSummariesIsNotEmpty">
                <BaseButton
                    v-if="desktopUserIsNotViewingFullSummary"
                    buttonText="Proceed"
                    class="donation-summary-page__view-summary-btn"
                    @button-clicked="$emit('show-full-donation-summary-page')"
                    :overRideButtonClass="true"
                />

                <BaseButton
                    buttonText="Submit"
                    class="donation-summary-page__submit-btn"
                    v-if="isFullSummaryPage"
                    :overRideButtonClass="true"
                    :status="donationsCreationStatus"
                    @button-clicked="handleDonationsSubmission"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import ProductSummaryRowMobileAndMedium from '@/pages/Sales/ProductSummaryRowMobileAndMedium.vue';
import ProductSummaryRow from '@/pages/Sales/ProductSummaryRow.vue';
import DonationSummaryHeader from '@/pages/Donations/NewDonation/DonationSummaryHeader.vue';
import DonationSummaryRow from '@/pages/Donations/NewDonation/DonationSummaryRow.vue';
import DonationSummaryRowMobileAndMedium from '@/pages/Donations/NewDonation/DonationSummaryRowMobileAndMedium.vue';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import { DonationSummary, RedemptionTypeOption } from '../types';
import { MoneyObject, Status } from '@/types';

@Component({
    components: {
        ProductSummaryRowMobileAndMedium,
        DonationSummaryHeader,
        ProductSummaryRow,
        DonationSummaryRow,
        DonationSummaryRowMobileAndMedium,
    },
})
export default class DonationSummaryPage extends Mixins(UtilityMixins, CurrencyMixins) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private clickedSummaryIndex: any = '';
    @Prop({ default: () => Array<DonationSummary>() }) readonly donationSummaries!: Array<DonationSummary>;
    @Prop({ default: false }) readonly isFullSummaryPage!: boolean;
    @Prop({ default: Status.NORMAL }) readonly donationsCreationStatus!: Status;

    get donationSummariesIsNotEmpty(): boolean {
        return this.donationSummaries.length > 0;
    }

    get desktopUserIsNotViewingFullSummary(): boolean {
        return this.userIsOnDesktop && !this.isFullSummaryPage;
    }

    get totalValue(): MoneyObject {
        return {
            amount: this.donationSummaries.reduce(
                (previousAmount: number, donationSummary: DonationSummary) =>
                    donationSummary.amount.amount + previousAmount,
                0,
            ),
            currencyKey: this.homeCurrencyKey,
        };
    }

    get totalPledge(): MoneyObject {
        return {
            amount: this.donationSummaries
                .filter(
                    (donationSummary: DonationSummary) =>
                        donationSummary.redemptionType === RedemptionTypeOption.PLEDGE,
                )
                .reduce(
                    (previousAmount: number, donationSummary: DonationSummary) =>
                        donationSummary.amount.amount + previousAmount,
                    0,
                ),
            currencyKey: this.homeCurrencyKey,
        };
    }

    private handleDonationSummaryVisibility(indexOfClickedDonationSummary: number) {
        if (parseInt(this.clickedSummaryIndex) === null) {
            this.clickedSummaryIndex = indexOfClickedDonationSummary;
            return;
        }

        if (this.clickedSummaryIndex === indexOfClickedDonationSummary) {
            this.clickedSummaryIndex = '';
            return;
        }

        this.clickedSummaryIndex = indexOfClickedDonationSummary;
    }

    private handleDonationsSubmission() {
        this.$emit('submit-all-donations');
    }

    private editDonation(index: number) {
        this.$emit('edit-donation-summary-item', index);
    }

    private deleteDonation(index: number) {
        this.$emit('delete-donation-summary-item', index);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donation-summary';
</style>
