<template>
    <div class="donations-module-entity-mobile__details">
        <b-row class="m-2 pb-4" v-for="(donor, index) in donors" :key="index" @click="toggleItemDetailsCard(index)">
            <b-col class="donations-module-entity-mobile__avatar">
                <span class="avatar-text">{{ donor.fullName | initials }}</span>
            </b-col>
            <b-col class="donations-module-entity-mobile__info-container">
                <b-col class="donations-module-entity-mobile__info p-0">
                    <div class="entity-info">
                        <p class="entity-info__name">{{ donor.fullName }}</p>
                        <p class="entity-info__text">
                            <i>Total Donation</i>
                            <span class="ml-2">
                                {{ functionalCurrency }}{{ donor.totalDonation.amount | formatAmount }}
                            </span>
                        </p>
                        <transition-group name="slide-up-fade">
                            <div
                                v-if="showItemDetails(index)"
                                :key="index"
                                class="donations-module-entity-mobile__drop-down"
                            >
                                <p
                                    class="entity-info__text--pledge"
                                    key="pledge"
                                    v-if="donorHasPledged(donor.totalPledge.amount)"
                                >
                                    <i>Pledged Donation</i>
                                    <span class="ml-2">{{ donor.totalPledge | amountWithCurrency }}</span>
                                </p>
                                <p class="entity-info__text" key="phone-number">{{ donor.phoneNumber }}</p>
                                <p class="entity-info__text" key="email">{{ donor.emailAddress }}</p>
                                <p key="edit-donation">
                                    <font-awesome-icon icon="pencil-alt" class="entity-info__icon" />
                                    <span class="icon-text mr-2" @click.stop="$emit('edit-existing-donor', donor)">
                                        Edit Donation
                                    </span>
                                    <span class="entity-info__mobile-options--sm  ml-5">
                                        <font-awesome-icon icon="eye" class="entity-info__icon" />

                                        <span class="icon-text" @click.stop="$emit('view-donor-transactions', donor)">
                                            View Donations
                                        </span>
                                    </span>
                                </p>
                                <p>
                                    <span class="entity-info__mobile-options--xs">
                                        <font-awesome-icon icon="eye" class="entity-info__icon" />
                                        <span class="icon-text" @click.stop="$emit('view-donor-transactions', donor)">
                                            View Donations
                                        </span>
                                    </span>
                                </p>
                                <p key="new-donation">
                                    <font-awesome-icon icon="plus" class="entity-info__icon" />
                                    <span class="icon-text" @click.stop="$emit('goto-add-new-donation-page', donor)">
                                        New Donation
                                    </span>
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
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Donor, defaultDonor } from '@/pages/Donations/types';

@Component
export default class MobileDonorsTable extends Vue {
    @Prop({ default: () => defaultDonor }) readonly donors!: Array<Donor>;
    @Prop({ default: '' }) readonly functionalCurrency!: string;

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

    private donorHasPledged(pledgeAmount: number) {
        return pledgeAmount > 0;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/mobile-module-entity-table';
</style>
