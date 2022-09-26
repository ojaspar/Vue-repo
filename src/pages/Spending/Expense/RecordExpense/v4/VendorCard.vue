<template>
    <div>
        <div :class="showVendorDetails ? 'expense-vendor-card' : 'expense-vendor-card--no-details'">
            <div :class="showVendorDetails ? 'expense-vendor-card__header' : 'expense-vendor-card__header--no-vendor'">
                <span class="expense-vendor-card__header--name">{{ vendorName }}</span>
                <span v-if="vendorSelected">
                    <span v-if="showEditButton" class="pointer" @click="handleVendorEditing"><i>Edit</i></span>
                    <span v-else class="expense-vendor-card__header--mobile-button" @click="$emit('change-vendor')">
                        <i>Change Vendor</i>
                    </span>
                </span>

                <!-- Add New Vendor Button on Mobile -->
                <span v-else class="expense-vendor-card__header--mobile-button" @click="$emit('change-vendor')">
                    Add Vendor
                </span>
            </div>
            <div
                v-if="showVendorDetails"
                :class="vendorSelected ? 'expense-vendor-card__details' : 'expense-vendor-card__details--empty'"
            >
                <span v-if="vendorSelected">
                    <p v-if="vendorHasBalance">
                        <span class="mr-1">Pending payment</span>
                        {{ selectedVendor.prepaymentBalance | amountWithCurrency }}
                    </p>
                    <p>{{ selectedVendor.phoneNumber }}</p>
                    <p>{{ selectedVendor.email }}</p>
                    <p v-if="selectedVendor.lastActivity">
                        {{ selectedVendor.lastActivity }}
                    </p>
                </span>
                <span v-else>
                    <i>No vendor details</i>
                </span>
            </div>
            <div v-if="showVendorButton" class="expense-vendor-card__button" @click="$emit('change-vendor')">
                {{ buttonName }}
            </div>
        </div>

        <BaseModal
            :modalId="editVendorModal"
            modalTitle="Edit Vendor"
            :no-close-on-backdrop="!closeVendorModalOnBackdrop"
            @hide-modal="hideVendorModal"
        >
            <AddVendorForm
                :vendorIsToBeEdited="vendorIsToBeEdited"
                :selectedVendorForEditing="selectedVendor"
                @existing-vendor-updated="handleVendorUpdate"
                @close-vendor-modal-on-backdrop="setModalClosureOnBackdrop"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { Vendor, defaultVendor } from '@/types';

import AddVendorForm from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorForm.vue';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { AddVendorForm } })
export default class VendorCard extends Mixins(UtilityMixins) {
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: true }) readonly showVendorDetails!: boolean;

    private vendorIsToBeEdited = false;
    private closeVendorModalOnBackdrop = false;
    private editVendorModal = 'edit-vendor-modal';

    get vendorHasBalance(): boolean {
        return this.selectedVendor?.prepaymentBalance.amount > 0;
    }

    get vendorSelected() {
        return this.selectedVendor.name.length > 0;
    }

    get vendorName() {
        const { name } = this.selectedVendor;
        return this.vendorSelected ? name : 'Unnamed Vendor';
    }

    get showVendorButton() {
        if (this.userIsOnMobile) {
            return this.showVendorDetails && this.vendorSelected;
        }
        return true;
    }

    get buttonName() {
        return this.vendorSelected ? 'Change Vendor' : 'Add Vendor';
    }

    get showEditButton() {
        if (this.userIsOnMobile) return this.showVendorDetails;
        return this.vendorSelected;
    }

    private setVendorEditingCondition() {
        this.vendorIsToBeEdited = true;
    }

    private resetVendorEditingCondition() {
        this.vendorIsToBeEdited = false;
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeVendorModalOnBackdrop = coseModal;
    }

    private displayVendorModal() {
        this.displayModal(this.editVendorModal);
    }

    private hideVendorModal() {
        this.resetVendorEditingCondition();
        this.cancelModal(this.editVendorModal);
    }

    private handleVendorEditing() {
        this.setVendorEditingCondition();
        this.displayVendorModal();
    }

    private handleVendorUpdate(updatedVendor: Vendor) {
        setTimeout(() => {
            this.$emit('selected-vendor-updated', updatedVendor);
            this.hideVendorModal();
        }, 500);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/vendor-card';
</style>
