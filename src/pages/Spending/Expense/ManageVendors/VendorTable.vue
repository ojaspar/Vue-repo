<template>
    <div>
        <div class="desktop-table">
            <b-row class="vendor-table__heading">
                <b-col class="pl-3">Name</b-col>
                <b-col>Activity</b-col>
                <b-col>Phone/E-mail</b-col>
                <b-col v-show="$root.isLargeScreenSize">Address/Notes</b-col>
            </b-row>

            <div v-if="vendorsAreAvailable">
                <b-row class="vendor-table__content" v-for="(vendor, index) in vendors" :key="index">
                    <font-awesome-icon
                        icon="ellipsis-h"
                        class="pointer"
                        title="More options"
                        @click="toggleShowOptions(index)"
                        @mousedown="preventBlurFromHappening"
                    /><b-col
                        cols="1"
                        class="vendor-table__more-options"
                        tabindex="-1"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p class="pointer d-flex vendor-table__content-action" @click="editVendor(vendor)">
                            Edit Vendor
                        </p>
                        <p class="pointer d-flex vendor-table__content-action" @click="goToTransactionPage(vendor)">
                            View Transaction
                        </p>
                        <p class="pointer d-flex vendor-table__content-action" @click="goToExpensePage(vendor)">
                            New Expense
                        </p>
                    </b-col>

                    <b-col class="pl-3">{{ vendor.name }}</b-col>
                    <b-col v-if="vendor.lastActivity">
                        <p class="m-0">
                            <span :class="activityTextClass(vendor.lastActivity)">{{ vendor.lastActivity }}</span>
                            <span class="vendor-table__sub"
                                >, {{ vendor.lastActivityDate | humanReadableDateTime }}</span
                            >
                        </p>
                        <p class="vendor-table__sub balance m-0" v-if="hasDebt(vendor)">
                            {{ vendor.debtBalance | amountWithCurrency }} Balance Due
                        </p>
                        <p class="vendor-table__sub prepayment m-0" v-if="hasPrepayment(vendor)">
                            {{ vendor.prepaymentBalance | amountWithCurrency }} Prepayment
                        </p>
                    </b-col>
                    <b-col v-else>-</b-col>
                    <b-col>
                        <p class="m-0">{{ vendor.email }}</p>
                        <p class="m-0">{{ vendor.phoneNumber }}</p>
                    </b-col>
                    <b-col v-show="$root.isLargeScreenSize">
                        <p v-if="contentIsEmpty(vendor)">-</p>
                        <span v-else>
                            <p class="m-0">{{ vendor.address }}</p>
                            <p class="m-0">{{ vendor.note }}</p>
                        </span>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="getVendorRequestIsLoading" cols="12" class="vendor-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="vendor-table__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>
        <div class="mobile-table">
            <template v-if="vendorsAreAvailable">
                <div class="recent-vendors" v-if="showRecentVendors">
                    <p class="recent-vendors__heading">Recent Vendors</p>
                    <VendorList
                        :vendors="recentVendors"
                        @edit-existing-vendor="editVendor"
                        @view-transactions="goToTransactionPage"
                        @go-to-expense-page="goToExpensePage"
                    />
                </div>
                <div class="all-vendors">
                    <p class="all-vendors__heading">{{ vendorHeadlineText }}</p>
                    <VendorList
                        :vendors="allVendors"
                        @edit-existing-vendor="editVendor"
                        @view-transactions="goToTransactionPage"
                        @go-to-expense-page="goToExpensePage"
                    />
                </div>
            </template>
            <div v-else-if="getVendorRequestIsLoading" cols="12" class="vendor-table__content--loader">
                <Loader size="4" />
            </div>
            <div v-else cols="12" class="vendor-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import { VueExtension } from '@/types';
import { Vendor } from '@/types';

import VendorList from '@/pages/Spending/Expense/ManageVendors/Vendors.vue';

import UtilityMixins from '@/mixins/Utility';
import SessionStorageService from '@/services/sessionStorage';

@Component({
    components: {
        VendorList,
    },
})
export default class VendorTable extends Mixins(UtilityMixins) {
    @Prop({ default: () => [] }) readonly vendors!: Array<Vendor>;
    @Prop({ default: '' }) readonly vendorSearchString!: string;
    @Prop({ default: false }) readonly getVendorRequestIsLoading!: boolean;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    public $root!: VueExtension;

    private selectedTableOptionsIndex = '';

    get recentVendors(): Vendor[] {
        const recentVendors = this.sortByInteractionDate(this.vendors, 'lastActivityDate');
        return recentVendors.slice(0, 2);
    }

    get showRecentVendors(): boolean {
        return this.vendorSearchString.length === 0;
    }

    get allVendors(): Array<Vendor> {
        const allVendors = this.sortArrayByName(this.vendors);
        return allVendors.filter((vendor: Vendor) =>
            vendor.name.toLowerCase().match(this.vendorSearchString.toLowerCase()),
        );
    }

    get vendorHeadlineText(): string {
        return this.vendorSearchString.length > 0 ? 'Search Results' : 'All Vendors';
    }

    get vendorsAreAvailable(): boolean {
        return this.vendors.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.vendorsAreAvailable) {
            return 'There are no vendors available';
        }
        return '';
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private contentIsEmpty(vendor: Vendor): boolean {
        const { address, note } = vendor;
        return address == '' && note == '';
    }

    private goToExpensePage(vendor: Vendor) {
        if (vendor) {
            SessionStorageService.setItem('selected-vendor', JSON.stringify(vendor));
        }

        this.$router.push({ name: 'RecordExpense' });
    }

    private goToTransactionPage(vendor: Vendor) {
        const { vendorKey, name } = vendor;
        const transactionPage = { name: 'VendorTransactions', params: { vendorKey, name } };
        this.$router.push(transactionPage);
    }

    private paymentStatusClass(paymentStatus: string): string {
        return paymentStatus === 'Prepayment' ? 'prepayment' : 'balance';
    }

    private activityTextClass(activity: string): string {
        return activity === 'Pending Supply' ? 'activity-text__pending' : 'activity-text__others';
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

    private editVendor(vendor: Vendor) {
        this.$emit('edit-existing-vendor', vendor);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/vendor-table';
</style>
