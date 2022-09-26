<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-donations-table">
            <b-row class="donations-table__heading">
                <b-col class="pl-0">Date</b-col>
                <b-col>Donors</b-col>
                <b-col cols="3">Donation Schemes</b-col>
                <b-col>Value</b-col>
                <b-col>Type</b-col>
            </b-row>
            <div v-if="donationsAreAvailable">
                <b-row class="donations-table__content" v-for="(donation, index) in donationsList" :key="index">
                    <font-awesome-icon icon="ellipsis-h" class="pointer mr-3" @click="toggleTableOptions(index)" />
                    <b-col
                        cols="1"
                        tabindex="-1"
                        class="donations-table__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeTableOptions"
                    >
                        <p
                            class="pointer d-flex donations-table__content-action"
                            @click="editDonation(donation.donationKey)"
                        >
                            <img class="mr-3" src="@/assets/img/pencil.svg" alt="Edit Donation" />
                            Edit Donation
                        </p>
                        <p
                            class="pointer d-flex donations-table__content-action"
                            @click="duplicateDonation(donation.donationKey)"
                        >
                            <img class="mr-3" src="@/assets/img/copy.svg" alt="Duplicate Donation" />
                            Duplicate Donation
                        </p>
                        <p class="pointer d-flex donations-table__content-action">
                            <img class="mr-3" src="@/assets/img/trash-black.svg" alt="Cancel Donation" />
                            Cancel Donation
                        </p>
                    </b-col>

                    <b-col class="pl-0">
                        <p class="content-text m-0">{{ donation.transactionDate | monthDateYearFormat }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0" v-if="donation.donorName">{{ donation.donorName }}</p>
                        <p class="content-text dark-grey m-0" v-else><i>(Donor not included)</i></p>
                    </b-col>
                    <b-col cols="3">
                        <p class="content-text m-0">{{ donation.donationScheme }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0" v-if="donation.amount">
                            {{ donation.amount | amountWithCurrency }}
                        </p>
                    </b-col>
                    <b-col>
                        <p :class="[donationTypeClass(donation.redemptionType), 'm-0']">
                            {{ donation.redemptionType | uppercaseFirst }}
                            <span v-if="donation.redemptionType === instantDonation">Donation</span>
                        </p>
                        <p
                            class="content-text__meta--date dark-grey "
                            v-if="shouldShowDueDate(donation.redemptionType)"
                        >
                            Due <i> {{ donation.pledgeDueDate | monthDateYearFormat }} </i>
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="donations-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donations-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="medium-donations-table">
            <div v-if="donationsAreAvailable">
                <b-row class="mobile-table" v-for="(donation, index) in donationsList" :key="index">
                    <b-col class="mobile-table__content" @click="toggleSaleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ donation.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="donation.donorName">{{ donation.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <p class="mobile-content__text" v-show="showDonationItemsNames(index)">
                                {{ donation.donationScheme }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p :class="donationTypeClass(donation.redemptionType)">
                                        {{ donation.redemptionType }}
                                        <span class="dark-grey ml-3" v-if="shouldShowDueDate(donation.redemptionType)">
                                            <i>(Due {{ donation.pledgeDueDate | monthDateYearFormat }})</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">{{ donation.donationScheme }}</p>
                                    <p class="mt-3 mb-0">
                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="editDonation(donation.donationKey)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />
                                            Edit Donation
                                        </span>

                                        <span
                                            class="mr-5 pointer mobile-content__text"
                                            @click.stop="duplicateDonation(donation.donationKey)"
                                        >
                                            <font-awesome-icon icon="clone" title="Duplicate" class="table-icon mr-2" />
                                            Duplicate
                                        </span>

                                        <!-- <font-awesome-icon icon="plus-circle" class="table-icon" />
                                        <span class="mr-4 pointer mobile-content__text">Add Payment</span> -->

                                        <!-- <font-awesome-icon icon="times-circle" class="table-icon" />
                                        <span class="mr-4 pointer mobile-content__text">Cancel</span> -->
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon :icon="cardDetailsIcon(index)" class="card-icon" />
                            </p>

                            <span v-show="!showDonationDetails(index)">
                                <p class="mobile-content__text align-right" v-if="donation.amount">
                                    {{ donation.amount | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__text align-right" v-else>
                                    {{ '-' }}
                                </p>
                                <p :class="[donationTypeClass(donation.redemptionType), 'align-right']">
                                    {{ donation.redemptionType }}
                                </p>
                            </span>

                            <span v-show="showDonationDetails(index)">
                                <p class="mobile-content__text align-right mt-0" v-if="donation.amount">
                                    {{ donation.amount | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__text align-right mt-0" v-else>
                                    {{ '-' }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="small-donations-table">
            <div v-if="donationsAreAvailable">
                <b-row class="mobile-table" v-for="(donation, index) in donationsList" :key="index">
                    <b-col class="mobile-table__content" @click="toggleSaleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ donation.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="donation.donorName">{{ donation.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <span v-show="showDonationItemsNames(index)">
                                <p class="mobile-content__text">
                                    <span v-if="donation.amount">
                                        {{ donation.amount | amountWithCurrency }}
                                    </span>
                                    <span class="dark-grey ml-2" v-if="shouldShowDueDate(donation.redemptionType)">
                                        (Due {{ donation.pledgeDueDate | monthDateYearFormat }})
                                    </span>
                                </p>

                                <p class="mobile-content__text">
                                    {{ donation.donationScheme }}
                                </p>
                            </span>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p :class="donationTypeClass(donation.redemptionType)">
                                        {{ donation.redemptionType }}
                                        <span class="dark-grey ml-3" v-if="shouldShowDueDate(donation.redemptionType)">
                                            <i>(Due {{ donation.pledgeDueDate | monthDateYearFormat }})</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ donation.donationScheme }}
                                    </p>
                                    <p class="mt-3 mb-0">
                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="editDonation(donation.donationKey)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />
                                            Edit Donation
                                        </span>

                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="duplicateDonation(donation.donationKey)"
                                        >
                                            <font-awesome-icon icon="clone" title="Duplicate" class="table-icon mr-2" />
                                            Duplicate
                                        </span>
                                        <!-- <font-awesome-icon icon="plus-circle" class="table-icon" />
                                        <span class="mr-4 pointer mobile-content__text">Add Payment</span>
                                        <font-awesome-icon icon="times-circle" class="table-icon" />
                                        <span class="mr-4 pointer mobile-content__text">Cancel</span> -->
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon :icon="cardDetailsIcon(index)" class="card-icon" />
                            </p>

                            <span v-show="!showDonationDetails(index)">
                                <p :class="[donationTypeClass(donation.redemptionType), 'align-right', 'm-t']">
                                    {{ donation.redemptionType }}
                                </p>
                            </span>

                            <span v-show="showDonationDetails(index)">
                                <p class="mobile-content__text align-right mt-0" v-if="donation.amount">
                                    {{ donation.amount | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__text align-right mt-0" v-else>
                                    {{ '-' }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgess" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import { VueExtension } from '@//types';
import { DonationList, RedemptionTypeOption } from '@/pages/Donations/types';

import UtilityMixins from '@/mixins/Utility';

const defaultDonation: DonationList = {
    donationKey: '',
    transactionDate: '',
    donorName: '',
    donationScheme: '',
    amount: { currencyKey: 0, amount: 0 },
    pledgeDueDate: '',
    redemptionType: RedemptionTypeOption.INSTANT,
};

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class DonationsTable extends Mixins(UtilityMixins) {
    @Prop({ default: defaultDonation }) readonly donationsList!: DonationList[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;

    @Ref() readonly tableOptions!: HTMLFormElement;

    public $root!: VueExtension;

    private selectedTableOptionsIndex = '';

    private selectedCardIndex = '';

    get donationsAreAvailable(): boolean {
        return this.donationsList.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.donationsAreAvailable) {
            return 'There are no donations available';
        }
        return '';
    }

    get requestInProgess() {
        return this.status === 'LOADING';
    }

    get instantDonation(): RedemptionTypeOption {
        return RedemptionTypeOption.INSTANT;
    }

    private redemptionTypesOption(redemptionType: RedemptionTypeOption): RedemptionTypeOption {
        return redemptionType === RedemptionTypeOption.PLEDGE
            ? RedemptionTypeOption.PLEDGE
            : RedemptionTypeOption.INSTANT;
    }

    private donationTypeClass(status: string) {
        const baseClass = `content-text__`;

        if (status.toLowerCase().match('pledge')) {
            return `${baseClass}partial`;
        }
        return `${baseClass}completed`;
    }

    private shouldShowDueDate(donationStatus: string): boolean {
        return donationStatus.toLowerCase() === 'pledge';
    }

    private cardDetailsIcon(cardIndexNumber: string | number) {
        return this.selectedCardIndex === cardIndexNumber.toString() ? 'chevron-up' : 'chevron-down';
    }

    private showDonationDetails(cardIndexNumber: string | number) {
        return this.selectedCardIndex === this.stringValue(cardIndexNumber);
    }

    private showDonationItemsNames(cardIndexNumber: string | number) {
        return this.selectedCardIndex !== this.stringValue(this.stringValue(cardIndexNumber));
    }

    private caretShouldShow(cardIndexNumber: string | number): boolean {
        const cardIndexToString = this.stringValue(cardIndexNumber);
        return this.cardDetailsIcon(cardIndexToString) === 'chevron-up';
    }

    private showOptions(index: string): boolean {
        return this.selectedCardIndex === index;
    }

    public closeCardDetails() {
        this.selectedCardIndex = '';
    }

    private toggleSaleDetailsCard(cardIndexNumber: string | number) {
        const cardIndexToString = this.stringValue(cardIndexNumber);
        if (this.selectedCardIndex === cardIndexToString) {
            this.closeCardDetails();
            return;
        }
        this.selectedCardIndex = cardIndexToString;
    }

    public isSelectedOption(index: string | number) {
        return this.selectedTableOptionsIndex === this.stringValue(index);
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeTableOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public stringValue(value: number | string): string {
        return value.toString();
    }

    public toggleTableOptions(index: string | number) {
        const stringIndex = index.toString();
        if (this.isSelectedOption(index.toString())) {
            this.closeTableOptions();
            return;
        }
        this.setSelectedOption(stringIndex);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private editDonation(donationKey: string) {
        this.$router.push({
            name: 'EditDonation',
            params: {
                donationKey,
            },
        });
    }

    private duplicateDonation(donationKey: string) {
        this.$router.push({
            name: 'DuplicateDonation',
            params: {
                donationKey,
            },
        });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/dashboard/donations-table';
</style>
