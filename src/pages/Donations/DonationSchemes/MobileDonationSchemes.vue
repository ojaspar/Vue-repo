<template>
    <div class="donations-module-entity-mobile__details">
        <b-row
            class="m-2 pb-4"
            v-for="(donation, index) in donationSchemes"
            :key="index"
            @click="toggleItemDetailsCard(index)"
        >
            <b-col class="donations-module-entity-mobile__avatar">
                <span class="avatar-text">{{ donation.name | initials }}</span>
            </b-col>
            <b-col class="donations-module-entity-mobile__info-container">
                <b-col class="donations-module-entity-mobile__info p-0">
                    <div class="entity-info">
                        <p class="entity-info__name">{{ donation.name }}</p>
                        <p class="entity-info__text" v-show="showItemAmountAndDate(index)">
                            <span> {{ currencySymbol }}{{ donation.currentAmount.amount | formatAmount }} </span>
                            <span class="dark--grey ml-2">
                                ({{ donation.targetDate.toString() | monthDateYearFormat }})
                            </span>
                        </p>
                        <transition-group name="slide-down-fade">
                            <div
                                v-if="showItemDetails(index)"
                                key="slide-down"
                                class="donations-module-entity-mobile__drop-down"
                            >
                                <p class="entity-info__text" key="description">{{ donation.description }}</p>
                                <p class="entity-info__text" key="current-amount">
                                    <span>
                                        {{ currencySymbol }}{{ donation.currentAmount.amount | formatAmount }}
                                    </span>
                                    <span class="dark--grey ml-2">
                                        ({{ donation.targetDate.toString() | monthDateYearFormat }})
                                    </span>
                                </p>
                                <p class="entity-info__text" key="total-amount">
                                    <span>{{ currencySymbol }}{{ donation.totalAmount.amount | formatAmount }}</span>
                                    <span class="dark--grey ml-2">
                                        ({{
                                            amountInPercentage(
                                                donation.totalAmount.amount,
                                                donation.financialTarget.amount,
                                            )
                                        }}
                                        of {{ currencySymbol }}{{ donation.financialTarget.amount | formatAmount }})
                                    </span>
                                </p>
                                <p key="edit-icon">
                                    <font-awesome-icon icon="pencil-alt" class="entity-info__icon" />
                                    <span class="icon-text mr-2" @click="$emit('edit-existing-donation', donation)">
                                        Edit Donation
                                    </span>
                                </p>
                                <p key="view-icon" @click="$emit('view-scheme-donations', donation)">
                                    <font-awesome-icon icon="eye" class="scheme-info__icon" />
                                    <span class="icon-text">View Donations</span>
                                </p>
                                <p key="plus-icon" @click.stop="$emit('goto-add-new-donation-page', donation)">
                                    <font-awesome-icon icon="plus" class="entity-info__icon" />
                                    <span class="icon-text ml-1">New Donation</span>
                                </p>
                            </div>
                        </transition-group>
                    </div>
                    <div class="entity-info__icon-box" v-if="showChevronUpIcon(index)">
                        <font-awesome-icon icon="chevron-up" />
                    </div>
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { DonationSchemeDetails } from '@/pages/Donations/DonationSchemes/types';

import UtilityMixins from '@/mixins/Utility';

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

@Component
export default class MobileSchemesTable extends Mixins(UtilityMixins) {
    @Prop({ default: () => defaultDonationScheme }) readonly donationSchemes!: Array<DonationSchemeDetails>;
    @Prop({ default: '' }) readonly currencySymbol!: string;

    private selectedItemCardIndex = '';

    private showItemDetails(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber;
    }

    private showItemAmountAndDate(cardIndexNumber: string) {
        return this.selectedItemCardIndex !== cardIndexNumber;
    }

    private showChevronUpIcon(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber;
    }

    private toggleItemDetailsCard(cardIndexNumber: string) {
        if (this.selectedItemCardIndex === cardIndexNumber) {
            this.selectedItemCardIndex = '';
            return;
        }
        this.selectedItemCardIndex = cardIndexNumber;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/mobile-module-entity-table';
</style>
