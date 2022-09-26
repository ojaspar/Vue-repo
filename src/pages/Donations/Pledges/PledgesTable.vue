<template>
    <div>
        <div class="donations-module-entity__desktop-table">
            <b-row class="donations-module-entity__heading">
                <b-col>Date</b-col>
                <b-col>Donor</b-col>
                <b-col>Form of Donation</b-col>
                <b-col>Description</b-col>
                <b-col>Value</b-col>
                <b-col>Due Date</b-col>
                <b-col>Status</b-col>
            </b-row>

            <div v-if="pledgesAreAvailable">
                <b-row class="donations-module-entity__content" v-for="(pledge, index) in pledges" :key="index">
                    <font-awesome-icon
                        icon="ellipsis-h"
                        class="pointer"
                        title="More options"
                        @click="toggleTableOptions(index)"
                    /><b-col
                        cols="1"
                        tabindex="-1"
                        class="donations-module-entity__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeTableOptions"
                    >
                        <p class="pointer d-flex donations-module-entity__content-action" @click="editPledge(pledge)">
                            <img
                                class="donations-module-entity__content-action--icon"
                                src="@/assets/img/pencil.svg"
                                alt="Edit icon"
                            />
                            Edit Pledge
                        </p>
                        <p
                            class="pointer d-flex donations-module-entity__content-action"
                            @click.stop="redeemPledge(pledge)"
                        >
                            <img
                                class="donations-module-entity__content-action--icon"
                                src="@/assets/img/refresh.svg"
                                alt="Redeem icon"
                            />
                            Redeem Pledge
                        </p>
                        <p class="pointer d-flex donations-module-entity__content-action">
                            <img
                                class="donations-module-entity__content-action--icon"
                                src="@/assets/img/trash-black.svg"
                                alt="Delete Icon"
                            />
                            Cancel Pledge
                        </p>
                    </b-col>

                    <b-col class="pl-3">
                        {{ pledge.transactionDate | monthDateYearFormat }}
                    </b-col>
                    <b-col>
                        {{ pledge.donorName || `(Donor not provided)` }}
                    </b-col>
                    <b-col>
                        {{ pledge.donationForm }}
                    </b-col>
                    <b-col>
                        {{ pledge.description || '-' }}
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ formattedAmount(pledge.amount) }}</p>
                    </b-col>
                    <b-col>
                        {{ pledge.pledgeDueDate | monthDateYearFormat }}
                    </b-col>
                    <b-col :class="statusClass(pledge.status || '')">
                        {{ pledge.status || '' }}
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
            <div v-if="pledgesAreAvailable">
                <b-row class="mobile-table pointer" v-for="(pledge, index) in pledges" :key="index">
                    <b-col class="mobile-table__content" @click="toggleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ pledge.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="pledge.donorName">{{ pledge.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <p class="mobile-content__text">
                                {{ pledge.donationForm | formOfDonation }}
                            </p>
                            <p class="mobile-content__text" v-if="pledge.description">
                                {{ pledge.description }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p class="mobile-content__text" v-if="hasAmount(pledge.amount)">
                                        {{ formattedAmount(pledge.amount) }}
                                        <span class="dark-grey ml-3" v-if="shouldShowDueDate(pledge.redemptionType)">
                                            <i>Due {{ pledge.pledgeDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>

                                    <p class="mt-4 mb-0 txt--primary item-controls">
                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="editPledge(pledge)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />Edit
                                            Pledge</span
                                        >
                                        <span
                                            class="mr-4 pointer mobile-content__text"
                                            @click.stop="redeemPledge(pledge)"
                                        >
                                            <font-awesome-icon icon="gift" class="table-icon" />
                                            Redeem pledge</span
                                        >

                                        <span class="mr-4 pointer mobile-content__text">
                                            <font-awesome-icon icon="times" class="table-icon" />
                                            Cancel</span
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
                                <p :class="[statusClass(pledge.status || ''), 'align-right', 'm-t']">
                                    {{ pledge.status || '' }}
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
            <div v-if="pledgesAreAvailable">
                <b-row class="mobile-table" v-for="(pledge, index) in pledges" :key="index">
                    <b-col class="mobile-table__content" @click="toggleDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ pledge.transactionDate | monthDateYearFormat }}
                            </p>
                            <p class="mobile-content__text" v-if="pledge.donorName">{{ pledge.donorName }}</p>
                            <p class="content-text dark-grey" v-else><i>(Donor not included)</i></p>
                            <p class="mobile-content__text">
                                {{ pledge.donationForm | formOfDonation }}
                            </p>
                            <p class="mobile-content__text" v-if="pledge.description">
                                {{ pledge.description }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showDonationDetails(index)">
                                    <p class="mobile-content__text">
                                        {{ formattedAmount(pledge.amount) }}
                                        <span class="dark-grey ml-2" v-if="shouldShowDueDate(pledge.redemptionType)">
                                            Due {{ pledge.pledgeDueDate | monthDateYearFormat }}
                                        </span>
                                    </p>

                                    <p class="mt-4 mb-0 txt--primary item-controls">
                                        <span
                                            class="pointer mobile-content__text action-button"
                                            @click.stop="editPledge(pledge)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon mr-2" />Edit
                                            Pledge</span
                                        >
                                        <span
                                            class="pointer mobile-content__text action-button"
                                            @click.stop="redeemPledge(pledge)"
                                        >
                                            <font-awesome-icon icon="gift" class="table-icon" />Redeem Pledge</span
                                        >
                                        <span class="pointer mobile-content__text action-button">
                                            <font-awesome-icon icon="times" class="table-icon" />
                                            Cancel</span
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
                                <p :class="[statusClass(pledge.status || ''), 'align-right', 'm-t']">
                                    {{ pledge.status || '' }}
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
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import { MoneyObject, VueExtension } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

import { Pledge, RedemptionTypeOption } from '@/pages/Donations/types';

@Component({
    filters: {
        formOfDonation(donationForm: string): string {
            return `${donationForm} Donation`;
        },
    },
})
export default class PledgesTable extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: () => Array<Pledge>() }) readonly pledges!: Array<Pledge>;
    @Prop({ default: '' }) readonly searchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    private selectedTableContentIndex = '';

    private functionalCurrency = '';

    public $root!: VueExtension;

    get showRecentDonors(): boolean {
        return this.searchString.length === 0;
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Pledges';
    }

    get pledgesAreAvailable(): boolean {
        return this.pledges.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.pledgesAreAvailable) {
            return 'There are no pledges available';
        }
        return '';
    }

    get requestInProgress() {
        return this.status === 'LOADING';
    }

    //TODO remove temp function when the real pledges endpoint is ready
    get randomStatus(): string {
        const statuses: Array<string> = ['Pending', 'Ongoing', 'Redeemed'];
        const randomIndex = Math.floor(Math.random() * Math.floor(statuses.length - 1));

        return statuses[randomIndex];
    }

    private hasAmount(amount: MoneyObject): boolean {
        if (!amount) return false;

        if (!amount.amount) return false;

        return true;
    }

    private formattedAmount(amount: MoneyObject): string {
        if (!amount) return '';

        return this.$options.filters.amountWithCurrency(amount);
    }

    private shouldShowDueDate(redemptionType: string) {
        return redemptionType === RedemptionTypeOption.PLEDGE;
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeTableOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleTableOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeTableOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private closeCardDetails() {
        this.selectedTableContentIndex = '';
    }

    private cardDetailsIcon(cardIndexNumber: number) {
        return this.selectedTableContentIndex === cardIndexNumber.toString() ? 'chevron-up' : 'chevron-down';
    }

    private showDonationDetails(cardIndexNumber: number) {
        return this.selectedTableContentIndex === cardIndexNumber.toString();
    }

    private showDonationItemsNames(cardIndexNumber: string) {
        return this.selectedTableContentIndex !== cardIndexNumber;
    }

    private caretShouldShow(cardIndexNumber: number): boolean {
        return this.cardDetailsIcon(cardIndexNumber) === 'chevron-up';
    }

    private toggleDetailsCard(cardIndexNumber: number) {
        if (this.selectedTableContentIndex === cardIndexNumber.toString()) {
            this.closeCardDetails();
            return;
        }
        this.selectedTableContentIndex = cardIndexNumber.toString();
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

    private editPledge(pledge: Pledge) {
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

    private redeemPledge(pledge: Pledge) {
        this.$emit('redeem-pledge', pledge);
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
