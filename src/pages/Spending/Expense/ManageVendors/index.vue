<template>
    <b-container fluid class="vendor-dashboard">
        <div class="vendor-dashboard__content">
            <TopSection
                :searchStringValue="vendorSearchString"
                @add-new-vendor="showVendorModal"
                @search-string-changed="updateSearchString"
            />

            <b-row>
                <b-col class="vendor-dashboard__table">
                    <VendorTable
                        :vendors="vendorsToBeDisplayed"
                        :vendorSearchString="vendorSearchString"
                        :searchMatchFound="searchMatchFound"
                        :getVendorRequestIsLoading="getVendorRequestIsLoading"
                        @edit-existing-vendor="handleVendorEditing"
                    />
                </b-col>
            </b-row>
        </div>
        <div v-if="error">An Error Occurred: {{ error }}</div>

        <AddOrEditVendorModal
            :searchedVendor="vendorSearchString"
            :vendorIsToBeEdited="vendorIsToBeEdited"
            :selectedVendorForEditing="selectedVendorForEditing"
            :closeModalOnBackdrop="closeVendorModalOnBackdrop"
            @reset-conditions-for-vendor-editing="resetConditionsForVendorEditing"
            @new-vendor-created="handleVendorSuccessEvent"
            @existing-vendor-updated="handleVendorSuccessEvent"
            @close-vendor-modal-on-backdrop="setModalClosureOnBackdrop"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TopSection from '@/pages/Spending/Expense/ManageVendors/TopSection.vue';
import VendorTable from '@/pages/Spending/Expense/ManageVendors/VendorTable.vue';
import AddOrEditVendorModal from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorModal.vue';

import VendorModule from '@/store/modules/vendor';

import UtilityMixins from '@/mixins/Utility';

import { Status, Vendor } from '@/types';
import { VendorRequestStatus, VendorType } from '@/pages/Spending/Expense/types';

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
        TopSection,
        VendorTable,
        AddOrEditVendorModal,
    },
})
export default class VendorDashboard extends Mixins(UtilityMixins) {
    private vendorSearchString = '';
    private vendorIsToBeEdited = false;
    private selectedVendorForEditing = { ...defaultVendor };
    private closeVendorModalOnBackdrop = false;

    @vendors.State
    private vendors!: Vendor[];

    @vendors.State
    private error!: string;

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    get vendorsToBeDisplayed(): Vendor[] {
        return this.vendors.filter(vendor => {
            const values = Object.values(vendor);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.vendorSearchString.toLowerCase());
            });
        });
    }

    get getVendorRequestIsLoading(): boolean {
        return this.vendorRequestStatus.getVendors === Status.LOADING;
    }

    get searchMatchFound() {
        if (this.vendorSearchString.length == 0) return true;
        if (this.vendorSearchString.length > 0 && this.vendors.length < 1) return true;
        return this.vendors.length > 0 && this.vendorsToBeDisplayed.length > 0;
    }

    private showVendorModal() {
        this.$bvModal.show('add-or-edit-vendor-modal');
    }

    private hideVendorModal() {
        this.$bvModal.hide('add-or-edit-vendor-modal');
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideVendorModal();
        }, 1500);
    }

    private handleVendorSuccessEvent() {
        this.vendorSearchString = '';
        this.dismissModal();
        this.fetchVendors();
    }

    private updateSearchString(searchString: string) {
        this.vendorSearchString = searchString;
    }

    private async fetchVendors() {
        await vendorModule.getVendors();
    }

    private handleVendorEditing(selectedVendor: Vendor) {
        this.vendorIsToBeEdited = true;
        this.selectedVendorForEditing = Object.assign(this.selectedVendorForEditing, selectedVendor);
        this.showVendorModal();
    }

    private resetConditionsForVendorEditing() {
        this.vendorIsToBeEdited = false;
        this.selectedVendorForEditing = { ...defaultVendor };
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Vendors');
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeVendorModalOnBackdrop = coseModal;
    }

    mounted() {
        vendorModule = getModule(VendorModule, this.$store);
        this.fetchVendors();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/vendor-dashboard';
</style>
