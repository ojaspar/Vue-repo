<template>
    <div class="select-expense mt-3">
        <ListSearchAndAddBar
            buttonText="New Vendor"
            @search-input-changed="updateSearchString"
            @add-new-resource="showAddNewVendorForm"
            placeholder="Search For Vendor"
        />
        <template v-if="getVendorRequestIsLoading">
            <div class="vendor-request-loading">
                <Loader size="4" />
            </div>
        </template>

        <template v-else>
            <template v-if="vendorListIsNotEmpty">
                <!-- recent vendors -->
                <template v-if="showRecentVendors">
                    <p class="select-expense__headline">Recent Vendors</p>
                    <div :class="avatarContainerClass">
                        <AvatarAndResource
                            v-for="vendor in recentVendors"
                            :key="vendor.vendorKey"
                            :resourceName="vendor.name"
                            :itemKey="vendor.vendorKey"
                            :expandedItemKey="expandedRecentVendorKey"
                            @full-details-toggled="toggleRecentVendor"
                            @resource-selected="handleVendorSelection(vendor)"
                        >
                            <span class="select-expense__item--amount" v-if="vendor.lastActivity">
                                <i class="text--black">{{ vendor.lastActivity }}</i>
                                <i>, {{ vendor.lastActivityDate | monthDateYearFormat }}</i>
                            </span>

                            <template v-slot:drop-down>
                                <div class="d-flex flex-column">
                                    <span class="select-expense__info" v-if="vendor.phoneNumber">{{
                                        vendor.phoneNumber
                                    }}</span>
                                    <span class="select-expense__info" v-if="vendor.email">{{ vendor.email }}</span>
                                    <span class="select-expense__info" v-if="vendor.note">{{ vendor.note }}</span>
                                    <p class="select-expense__info m-0" key="activity" v-if="vendor.lastActivity">
                                        <i class="text--black">{{ vendor.lastActivity }} </i>
                                        <span>, {{ vendor.lastActivityDate | monthDateYearFormat }}</span>
                                    </p>
                                    <span class="select-expense__info balance" v-if="hasDebt(vendor)">
                                        {{ vendor.debtBalance | amountWithCurrency }} Balance Due
                                    </span>
                                    <span class="select-expense__info prepayment" v-if="hasPrepayment(vendor)">
                                        {{ vendor.prepaymentBalance | amountWithCurrency }} Prepayment
                                    </span>
                                    <div class="d-flex avatar-and-resource__actions-container">
                                        <p
                                            class="select-vendor__select mr-3 avatar-and-resource__action"
                                            @click.stop="handleVendorSelection(vendor)"
                                        >
                                            <img
                                                src="@/assets/img/select-resource.svg"
                                                class="select-vendor__select--icon mr-3"
                                            />Select Vendor
                                        </p>

                                        <p
                                            class="select-vendor__edit avatar-and-resource__action"
                                            @click.stop="editVendor(vendor)"
                                        >
                                            <img src="@/assets/img/pencil.svg" class="select-vendor__edit--icon mr-2" />
                                            Edit Details
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </AvatarAndResource>
                    </div>
                </template>

                <!-- All vendors -->
                <p class="select-expense__headline">{{ headlineText }}</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="vendor in allVendors"
                        :key="vendor.vendorKey"
                        :resourceName="vendor.name"
                        :itemKey="vendor.vendorKey"
                        :expandedItemKey="expandedVendorKey"
                        @full-details-toggled="toggleVendor"
                        @resource-selected="handleVendorSelection(vendor)"
                    >
                        <span class="select-expense__item--amount" v-if="vendor.lastActivity">
                            <i class="text--black">{{ vendor.lastActivity }}</i>
                            <i>, {{ vendor.lastActivityDate | monthDateYearFormat }}</i>
                        </span>

                        <template v-slot:drop-down>
                            <div class="d-flex flex-column">
                                <span class="select-expense__info" v-if="vendor.phoneNumber">{{
                                    vendor.phoneNumber
                                }}</span>
                                <span class="select-expense__info" v-if="vendor.email">{{ vendor.email }}</span>
                                <span class="select-expense__info" v-if="vendor.note">{{ vendor.note }}</span>
                                <p class="select-expense__info m-0" key="activity" v-if="vendor.lastActivity">
                                    <i class="text--black">{{ vendor.lastActivity }} </i>
                                    <span>, {{ vendor.lastActivityDate | monthDateYearFormat }}</span>
                                </p>
                                <span class="select-expense__info balance" v-if="hasDebt(vendor)">
                                    {{ vendor.debtBalance | amountWithCurrency }} Balance Due
                                </span>
                                <span class="select-expense__info prepayment" v-if="hasPrepayment(vendor)">
                                    {{ vendor.prepaymentBalance | amountWithCurrency }} Prepayment
                                </span>

                                <div class="d-flex avatar-and-resource__actions-container">
                                    <p class="select-expense__select mr-3" @click.stop="handleVendorSelection(vendor)">
                                        <img
                                            src="@/assets/img/select-resource.svg"
                                            class="select-vendor__select--icon mr-3"
                                        />Select Vendor
                                    </p>

                                    <p class="select-expense__edit" @click.stop="editVendor(vendor)">
                                        <img src="@/assets/img/pencil.svg" class="select-expense__edit--icon mr-3" />
                                        Edit Details
                                    </p>
                                </div>
                            </div>
                        </template>
                    </AvatarAndResource>

                    <div class="select-expense__no-item-found" v-if="vendorListIsEmpty">
                        <p>Looks like you haven't added this Vendor to your list</p>
                        <p>Click the New Vendor link above to add this item</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="select-expense__no-item-found">
                    <p>Looks like you haven't listed any Vendor yet</p>
                    <p>Click the "New Vendor" link above to start</p>
                </div>
            </template>
        </template>

        <AddOrEditVendorModal
            v-if="editMode"
            :vendorIsToBeEdited="true"
            :selectedVendorForEditing="vendorToBeEdited"
            @reset-conditions-for-vendor-editing="resetConditionsForVendorEditing"
            @existing-vendor-updated="handleVendorUpdated"
        />
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AddOrEditVendorModal from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorModal.vue';

import { Status, Vendor } from '@/types';
import { VendorRequestStatus, VendorType } from '@/pages/Spending/Expense/types';

import VendorModule from '@/store/modules/vendor';

import UtilityMixins from '@/mixins/Utility';

const vendors = namespace('vendor');
let vendorModule: VendorModule;

const defaultVendor: Vendor = {
    vendorKey: '',
    name: '',
    email: '',
    debtBalance: { amount: 0, currencyKey: '' },
    lastActivity: '',
    lastActivityDate: '',
    address: '',
    note: '',
    phoneNumber: '',
    prepaymentBalance: { amount: 0, currencyKey: '' },
    vendorType: VendorType.INDIVIDUAL,
};

@Component({
    components: {
        AddOrEditVendorModal,
    },
})
export default class SelectVendor extends Mixins(UtilityMixins) {
    private searchString = '';
    private editMode = false;
    private expandedVendorKey = '';
    private expandedRecentVendorKey = '';
    private vendorToBeEdited: Vendor = { ...defaultVendor };

    @vendors.State
    private vendors!: Vendor[];

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    get getVendorRequestIsLoading(): boolean {
        return this.vendorRequestStatus.getVendors === Status.LOADING;
    }

    get searchStringIsEmpty() {
        return this.searchString.length === 0;
    }

    get showRecentVendors(): boolean {
        return this.searchStringIsEmpty;
    }

    get headlineText(): string {
        return !this.searchStringIsEmpty ? 'Search Results' : 'All Vendors';
    }

    get allVendors(): Array<Vendor> {
        const allVendors = this.sortArrayByName(this.vendors);
        if (this.searchStringIsEmpty) return allVendors;
        return allVendors.filter(vendor => {
            const values = Object.values(vendor);
            return values.find(value => {
                if (typeof value !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get recentVendors(): Vendor[] {
        const recentVendors = this.sortByInteractionDate(this.vendors, 'lastActivityDate');
        return recentVendors.slice(0, 2);
    }

    get vendorListIsNotEmpty(): boolean {
        return this.allVendors.length > 0;
    }

    get vendorListIsEmpty(): boolean {
        return this.allVendors.length === 0;
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private showAddNewVendorForm() {
        this.$emit('show-add-new-vendor-form', this.searchString);
    }

    private handleVendorSelection(vendorSelected: Vendor) {
        this.$emit('set-vendor-for-expense', vendorSelected);
    }

    private toggleRecentVendor(key: string) {
        this.expandedVendorKey = '';

        if (this.expandedRecentVendorKey == key) {
            this.expandedRecentVendorKey = '';
            return;
        }
        this.expandedRecentVendorKey = key;
    }

    private toggleVendor(key: string) {
        this.expandedRecentVendorKey = '';

        if (this.expandedVendorKey == key) {
            this.expandedVendorKey = '';
            return;
        }
        this.expandedVendorKey = key;
    }

    private resetConditionsForVendorEditing() {
        this.editMode = false;
        this.vendorToBeEdited = { ...defaultVendor };
        this.hideVendorModal();
    }

    private editVendor(vendor: Vendor) {
        this.editMode = true;
        this.vendorToBeEdited = Object.assign(this.vendorToBeEdited, vendor);
        this.$nextTick(() => {
            this.showVendorModal();
        });
    }

    private handleVendorUpdated(editedVendor: Vendor) {
        this.showToaster({
            ...this.toaster,
            type: 'success',
            title: 'Success!',
            message: 'Vendor details updated successfully!',
        });

        setTimeout(() => {
            this.hideVendorModal();
        }, 1000);

        this.updateVendorArray(editedVendor);
    }

    private updateVendorArray(updatedVendor: Vendor) {
        const editedVendorIndex = this.vendors.findIndex(
            (vendor: Vendor) => vendor.vendorKey === updatedVendor.vendorKey,
        );

        const newVendor = { ...this.vendors[editedVendorIndex], ...updatedVendor };

        this.vendors.splice(editedVendorIndex, 1, newVendor);
    }

    private showVendorModal() {
        this.$bvModal.show('add-or-edit-vendor-modal');
    }

    private hideVendorModal() {
        this.$bvModal.hide('add-or-edit-vendor-modal');
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

    mounted() {
        vendorModule = getModule(VendorModule, this.$store);
        vendorModule.getVendors();
    }
}
</script>
