<template>
    <b-container fluid class="p-0">
        <div class="expense-vendor-list">
            <div class="expense-vendor-list__header">
                <span>Vendor List</span>
                <span class="pointer" @click="displayVendorModal"><i>Add New</i></span>
            </div>

            <div class="expense-vendor-list__search-section">
                <div class="expense-vendor-list__links">
                    <transition name="fade">
                        <span
                            v-if="allowUnnamedVendor"
                            class="expense-vendor-list__links--unnamed-vendor"
                            @click="$emit('proceed-without-vendor')"
                        >
                            Proceed with Unnamed Vendor
                        </span>
                    </transition>
                    <span class="expense-vendor-list__links--new-vendor" @click="displayVendorModal">
                        Add New
                    </span>
                </div>
                <div class="expense-vendor-list__search-container">
                    <font-awesome-icon icon="search" class="expense-vendor-list__search--icon" />

                    <div class="w-100">
                        <BaseInputField
                            placeholder="Search for vendor"
                            inputContainerClass="expense-vendor-list__search"
                            className="expense-vendor-list__search--input"
                            v-model="searchString"
                        />
                    </div>
                </div>
            </div>

            <div class="expense-vendor-list__body">
                <div v-if="vendorsAreAvailable">
                    <transition-group name="slide-up-fade">
                        <AvatarAndResource
                            class="expense-vendor-list__avatar"
                            resourceNameClass="expense-vendor-list__avatar--name"
                            v-for="vendor in allVendors"
                            :key="vendor.vendorKey"
                            :resourceName="vendor.name"
                            :showChevronIcon="false"
                            :itemKey="vendor.vendorKey"
                            expandedItemKey=""
                            @resource-selected="handleVendorSelection(vendor)"
                        >
                            <template>
                                <span v-if="vendor.lastActivity" class="expense-vendor-list__avatar--text">
                                    {{ vendor.lastActivity }}
                                    <i class="ml-1">{{ vendor.lastActivityDate | humanReadableDateTime }}</i>
                                </span>
                            </template>
                        </AvatarAndResource>
                    </transition-group>
                </div>
                <div v-else-if="fetchingVendors" class="expense-vendor-list__body--loader">
                    <Loader size="2" />
                </div>
                <div v-show="contentIsEmpty" class="expense-vendor-list__body--empty">
                    <span v-html="noContentMessage"></span>
                </div>
            </div>
        </div>

        <BaseModal
            :modalId="newVendorModal"
            modalTitle="New Vendor"
            :no-close-on-backdrop="!closeVendorModalOnBackdrop"
            @hide-modal="hideVendorModal"
        >
            <AddVendorForm
                :searchedVendor="searchString"
                :vendorIsToBeEdited="vendorIsToBeEdited"
                :selectedVendorForEditing="selectedVendorForEditing"
                @new-vendor-created="handleVendorCreation"
                @existing-vendor-updated="handleVendorUpdate"
                @close-vendor-modal-on-backdrop="setModalClosureOnBackdrop"
            />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AddVendorForm from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorForm.vue';

import { Status, Vendor, defaultVendor } from '@/types';
import { VendorRequestStatus } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import VendorModule from '@/store/modules/vendor';

const vendors = namespace('vendor');
let vendorModule: VendorModule;

@Component({ components: { AddVendorForm } })
export default class ExpenseVendorList extends Mixins(UtilityMixins) {
    @Prop({ default: false }) readonly vendorIsToBeEdited!: boolean;
    @Prop({ default: true }) readonly allowUnnamedVendor!: boolean;
    @Prop({ default: () => defaultVendor }) readonly selectedVendorForEditing!: Vendor;

    private searchString = '';
    private newVendorModal = 'new-vendor-modal';
    private closeVendorModalOnBackdrop = false;
    private selectedVendor: Vendor = { ...defaultVendor };

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    @vendors.State
    private vendors!: Array<Vendor>;

    @vendors.State
    private createdVendor!: Vendor;

    get fetchingVendors() {
        return this.vendorRequestStatus.getVendors === Status.LOADING;
    }

    get vendorsAreAvailable() {
        return this.vendors.length > 0;
    }

    get contentIsEmpty() {
        return !this.fetchingVendors && this.noContentMessage != '';
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString.length === 0;
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

    get searchMatchFound() {
        if (this.searchStringIsEmpty) return true;
        if (!this.searchStringIsEmpty && !this.vendorsAreAvailable) return true;
        return this.vendorsAreAvailable && this.allVendors.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return `<p>Looks like you haven't added this Vendor to your list</p>
            <p>Click the "Add New" link above to add it</p>`;
        }
        if (!this.vendorsAreAvailable) {
            return `<p>Looks like you haven't added any Vendor to your list</p>
            <p>Click the "Add New" link above to start</p>`;
        }
        return '';
    }

    private handleVendorSelection(selectedVendor: Vendor) {
        this.$emit('vendor-selected', selectedVendor);
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeVendorModalOnBackdrop = coseModal;
    }

    private displayVendorModal() {
        this.displayModal(this.newVendorModal);
    }

    private hideVendorModal() {
        this.cancelModal(this.newVendorModal);
    }

    private handleVendorCreation(selectedVendor: Vendor) {
        this.$emit('vendor-selected', selectedVendor);
    }

    private handleVendorUpdate(selectedVendor: Vendor) {
        this.$emit('vendor-updated', selectedVendor);
    }

    private goToQuickExpense() {
        this.$router.push({ name: 'QuickExpense' });
    }

    private assignModule() {
        vendorModule = getModule(VendorModule, this.$store);
    }

    private async getAllVendors() {
        await vendorModule.getVendors();
    }

    @Watch('createdVendor', { deep: true })
    handleCreatedEntiy() {
        this.handleVendorSelection(this.createdVendor);
    }

    mounted() {
        this.assignModule();
        this.getAllVendors();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/vendor-list';
</style>
