<template>
    <div class="vendors__details">
        <b-row class="m-2 pb-4" v-for="(vendor, index) in vendors" :key="index" @click="toggleItemDetailsCard(index)">
            <b-col class="vendors__avatar">
                <span class="avatar-text">{{ vendor.name | initials }}</span>
            </b-col>
            <b-col class="vendors__info-container">
                <b-col class="vendors__info p-0">
                    <div class="info">
                        <p class="info__name">{{ vendor.name }}</p>
                        <p class="info__text" v-show="showItemAmountAndDate(index)" v-if="vendor.lastActivity">
                            <i>{{ vendor.lastActivity }} </i>
                            <span class="info__text ml-1">{{ vendor.lastActivityDate | monthDateYearFormat }}</span>
                        </p>
                        <transition-group name="slide-up-fade">
                            <div v-if="showItemDetails(index)" key="vendor-details" class="vendors__drop-down">
                                <p class="info__text" key="phone">
                                    {{ vendor.phoneNumber }}
                                    <span v-if="vendor.email">, {{ vendor.email }}</span>
                                </p>
                                <p class="info__text" key="note">{{ vendor.note }}</p>
                                <p class="info__text" key="activity" v-if="vendor.lastActivity">
                                    <i>{{ vendor.lastActivity }} </i>
                                    <span class="info__text ml-1">{{
                                        vendor.lastActivityDate | monthDateYearFormat
                                    }}</span>
                                </p>
                                <p class="info__text--balance mb-2" key="balance" v-if="hasDebt(vendor)">
                                    {{ vendor.debtBalance | amountWithCurrency }} Balance Due
                                </p>
                                <p class="info__text--prepayment mb-2" key="prepayment" v-if="hasPrepayment(vendor)">
                                    {{ vendor.prepaymentBalance | amountWithCurrency }} Prepayment
                                </p>
                                <p key="edit-icon">
                                    <font-awesome-icon icon="pencil-alt" class="info__icon" />
                                    <span class="icon-text mr-2" @click="$emit('edit-existing-vendor', vendor)">
                                        Edit Vendor
                                    </span>
                                </p>
                                <p key="transaction-icon">
                                    <font-awesome-icon icon="eye" class="info__icon" />
                                    <span class="icon-text" @click="$emit('view-transactions', vendor)"
                                        >View Transactions</span
                                    >
                                </p>
                                <p key="delete-icon">
                                    <font-awesome-icon icon="plus" class="info__icon" />
                                    <span class="icon-text" @click="$emit('go-to-expense-page', vendor)">
                                        New Expense
                                    </span>
                                </p>
                            </div>
                        </transition-group>
                    </div>
                    <div class="info__icon-box" v-if="showChevronUpIcon(index)">
                        <font-awesome-icon icon="chevron-up" />
                    </div>
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Vendor } from '@/types';

import { MobileVendorDetails } from '@/pages/Spending/Expense/ManageVendors/types';

const defaultVendor: MobileVendorDetails = {
    name: '',
    email: '',
    phoneNumber: '',
    lastActivityDate: '',
    pendingBalanceAmount: '',
    note: '',
};

@Component
export default class VendorList extends Vue {
    @Prop({ default: () => defaultVendor }) readonly vendors!: Array<MobileVendorDetails>;

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

    private hasDebt(vendor: Vendor): boolean {
        if (!vendor) return false;

        if (!vendor.debtBalance) return false;

        if (vendor.debtBalance.amount > 0) return true;

        return false;
    }

    private hasPrepayment(vendor: Vendor): boolean {
        if (!vendor) return false;

        if (!vendor.prepaymentBalance) return false;

        if (vendor.prepaymentBalance.amount > 0) return true;

        return false;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/vendor-list';
</style>
