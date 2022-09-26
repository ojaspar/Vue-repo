<template>
    <div>
        <div class="donations-module-entity__desktop-table">
            <b-row class="donations-module-entity__heading">
                <b-col>Date</b-col>
                <b-col>Donor</b-col>
                <b-col>Form of Donation</b-col>
                <b-col>Description</b-col>
                <b-col>Value</b-col>
                <b-col>Purpose</b-col>
            </b-row>

            <div v-if="donatedItemsAreAvailable">
                <b-row class="donations-module-entity__content" v-for="(item, index) in donatedItems" :key="index">
                    <font-awesome-icon
                        icon="ellipsis-h"
                        class="pointer"
                        title="More options"
                        @click="toggleShowOptions(index)"
                    /><b-col
                        cols="1"
                        class="donations-module-entity__more-options"
                        v-if="showOptions(index)"
                        tabindex="0"
                        @blur="closeOptions"
                    >
                        <p class="pointer donations-module-entity__content-action" @click.stop="addItemValue(item)">
                            <font-awesome-icon icon="plus" class="donations-module-entity__content-action--icon" />

                            Add Item Value
                        </p>

                        <p class="pointer donations-module-entity__content-action" @click="editItem(item)">
                            <img
                                class="donations-module-entity__content-action--icon"
                                src="@/assets/img/pencil.svg"
                                alt="Edit icon"
                            />
                            Edit Item
                        </p>

                        <p class="pointer donations-module-entity__content-action">
                            <img
                                class="donations-module-entity__content-action--icon"
                                src="@/assets/img/trash-black.svg"
                                alt="Delete Icon"
                            />
                            Delete Item
                        </p>
                    </b-col>

                    <b-col class="pl-3">
                        {{ item.transactionDate | monthDateYearFormat }}
                    </b-col>
                    <b-col>
                        {{ item.donorName || `(Donor not provided)` }}
                    </b-col>
                    <b-col>
                        {{ item.donationForm }}
                    </b-col>
                    <b-col>
                        {{ item.description || '-' }}
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ formattedAmount(item.amount) }}</p>
                    </b-col>
                    <b-col>
                        {{ item.usage || randomStatus }}
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgress" cols="12" class="donations-module-entity__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donations-module-entity__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="donations-module-entity__medium-table">
            <div v-if="donatedItemsAreAvailable">
                <b-row class="mobile-table pointer" v-for="(item, index) in donatedItems" :key="index">
                    <b-col class="mobile-table__content" @click="toggleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ item.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="item.donorName">{{ item.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <p class="mobile-content__text">
                                {{ item.donationForm | formOfDonation }}
                            </p>
                            <p class="mobile-content__text" v-if="item.description">
                                {{ item.description }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p class="mobile-content__text" v-if="shouldShowAmount(item.amount)">
                                        {{ formattedAmount(item.amount) }}
                                        <span class="dark-grey ml-3" v-if="shouldShowDueDate(item.redemptionType)">
                                            <i>Due {{ item.pledgeDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>

                                    <p class="mt-4 mb-0 txt--primary item-controls">
                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="addItemValue(item)"
                                        >
                                            <font-awesome-icon icon="plus" class="table-icon" />
                                            Add Item Value</span
                                        >

                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="editDonation(item.donationKey)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />Edit
                                            Item</span
                                        >

                                        <span class="mr-4 pointer mobile-content__text">
                                            <font-awesome-icon icon="times" class="table-icon" />
                                            Delete</span
                                        >
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon :icon="cardDetailsIcon(index)" class="card-icon" />
                            </p>

                            <span>
                                <p
                                    :class="[
                                        statusClass(item.usage || randomStatus),
                                        'align-right',
                                        'm-t',
                                        'mobile-content__dark-grey',
                                    ]"
                                >
                                    Purpose - {{ item.usage || randomStatus }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgress" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="donations-module-entity__mobile-table">
            <div v-if="donatedItemsAreAvailable">
                <b-row class="mobile-table" v-for="(item, index) in donatedItems" :key="index">
                    <b-col class="mobile-table__content" @click="toggleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ item.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="item.donorName">{{ item.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <p class="mobile-content__text">
                                {{ item.donationForm | formOfDonation }}
                            </p>
                            <p class="mobile-content__text" v-if="item.description">
                                {{ item.description }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p class="mobile-content__text">
                                        {{ formattedAmount(item.amount) }}
                                        <span class="dark-grey ml-2" v-if="shouldShowDueDate(item.redemptionType)">
                                            Due {{ item.pledgeDueDate | monthDateYearFormat }}
                                        </span>
                                    </p>

                                    <p class="mt-4 mb-0 txt--primary item-controls">
                                        <span
                                            class="pointer mobile-content__text action-button"
                                            @click.stop="addItemValue(item)"
                                        >
                                            <font-awesome-icon icon="plus" class="table-icon" />Add Item Value</span
                                        >
                                        <span
                                            class="pointer mobile-content__text action-button"
                                            @click.stop="editDonation(item.donationKey)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />Edit
                                            Item</span
                                        >
                                        <span class="pointer mobile-content__text action-button">
                                            <font-awesome-icon icon="times" class="table-icon" />
                                            Delete Item</span
                                        >
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon :icon="cardDetailsIcon(index)" class="card-icon" />
                            </p>

                            <span>
                                <p :class="[statusClass(item.usage || randomStatus), 'align-right', 'm-t']">
                                    {{ item.usage || randomStatus }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestInProgress" cols="12" class="mobile-table__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="mobile-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { MoneyObject, VueExtension } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

import { Donation, DonationList } from '@/pages/Donations/types';

@Component({
    filters: {
        formOfDonation(donationForm: string): string {
            return `${donationForm} Donation`;
        },
    },
})
export default class DonatedItemsTable extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: () => Array<DonationList>() }) readonly donations!: Array<DonationList>;
    @Prop({ default: '' }) readonly searchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    private selectedTableContentIndex = '';
    private functionalCurrency = '';

    public $root!: VueExtension;

    get showRecentDonors(): boolean {
        return this.searchString.length === 0;
    }

    get donatedItems(): Array<DonationList> {
        return this.donations.filter((item: DonationList) =>
            item.donationScheme.toLowerCase().match(this.searchString.toLowerCase()),
        );
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Pledges';
    }

    get donatedItemsAreAvailable(): boolean {
        return this.donations.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.donatedItemsAreAvailable) {
            return 'There are no pledges available';
        }
        return '';
    }

    get requestInProgress() {
        return this.status === 'LOADING';
    }

    //TODO remove temp function when the real pledges endpoint is ready
    get randomStatus(): string {
        const statuses: Array<string> = ['For Sale', 'Undecided', 'For Use'];
        const randomIndex = Math.floor(Math.random() * Math.floor(statuses.length - 1));

        return statuses[randomIndex];
    }

    private showOptions(index: string): boolean {
        return this.selectedTableContentIndex === index;
    }

    public closeOptions() {
        this.selectedTableContentIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.selectedTableContentIndex === index) {
            this.closeOptions();
            return;
        }
        this.selectedTableContentIndex = index;
    }

    private shouldShowAmount(amount: MoneyObject): boolean {
        if (!amount) return false;

        if (!amount.amount) return false;

        return amount.amount > 0;
    }

    private formattedAmount(amount: MoneyObject): string {
        if (!amount) return '';

        return this.$options.filters.amountWithCurrency(amount);
    }

    private shouldShowDueDate(donationStatus: string): boolean {
        return donationStatus.toLowerCase() === 'pledge';
    }

    private cardDetailsIcon(cardIndexNumber: string) {
        return this.selectedTableContentIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private showDonationDetails(cardIndexNumber: string) {
        return this.selectedTableContentIndex === cardIndexNumber;
    }

    private showDonationItemsNames(cardIndexNumber: string) {
        return this.selectedTableContentIndex !== cardIndexNumber;
    }

    private caretShouldShow(cardIndexNumber: string): boolean {
        return this.cardDetailsIcon(cardIndexNumber) === 'chevron-up';
    }

    private toggleDetailsCard(cardIndexNumber: string) {
        if (this.selectedTableContentIndex === cardIndexNumber) {
            this.closeOptions();
            return;
        }
        this.selectedTableContentIndex = cardIndexNumber;
    }

    private getFunctionalCurrency() {
        const accessToken = SessionStorageService.decodeToken();
        const { currencyKey } = accessToken;
        this.functionalCurrency = this.getCurrencySymbolFromCurrencyKey(currencyKey);
    }

    private goToNewDonationPage() {
        this.$router.push({ name: 'NewDonation' });
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private editItem(pledge: DonationList) {
        this.$emit('edit-existing-pledge', pledge);
    }

    private statusClass(plegdeStatus = 'Pending') {
        const baseClass = 'pledge-status';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statuses: Array<any> = [
            ['Pending', `${baseClass}__pending`],
            ['Ongoing', `${baseClass}__ongoing`],
            ['Redeemed', `${baseClass}__redeemed`],
        ];
        const statusMap = new Map(statuses);

        return statusMap.get(plegdeStatus);
    }

    private addItemValue(donatedItem: Donation) {
        this.$emit('add-item-value', donatedItem);
    }

    mounted() {
        this.getFunctionalCurrency();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/module-entity-table';
@import 'src/styles/pages/donations/dashboard/donations-table';

.pledge-status {
    &__pending,
    &__ongoing,
    &__redeemed {
        font-size: 14px;
    }

    &__pending {
        color: $notification-red;
    }

    &__ongoing {
        color: $primary-yellow;
    }

    &__redeemed {
        color: $primary-green;
    }
}

.item-controls {
    display: flex;
    flex-wrap: wrap;
}

.action-button {
    margin-right: 25px;
    margin-bottom: 7px;
}
</style>
