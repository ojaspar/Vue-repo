<template>
    <b-container>
        <b-modal
            id="add-or-edit-vendor-modal"
            :no-close-on-backdrop="!closeModalOnBackdrop"
            @show="checkFormMode"
            @hide="resetFormMode"
        >
            <template v-slot:modal-header>
                <div class="add-vendor-form__heading">
                    <h2 class="add-vendor-form__heading--text ">{{ modalTitle }}</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>

            <AddOrEditVendorForm
                :searchedVendor="searchedVendor"
                :vendorIsToBeEdited="vendorIsToBeEdited"
                :selectedVendorForEditing="selectedVendorForEditing"
                @new-vendor-created="handleVendorCreated"
                @existing-vendor-updated="handleVendorUpdated"
                @close-vendor-modal-on-backdrop="handleModalBackdrop"
            />
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import AddOrEditVendorForm from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorForm.vue';

import { Vendor, defaultVendor } from '@/types';

@Component({
    components: {
        AddOrEditVendorForm,
    },
})
export default class AddOrEditVendorModal extends Vue {
    @Prop({ default: '' }) readonly searchedVendor!: string;
    @Prop({ default: false }) readonly vendorIsToBeEdited!: boolean;
    @Prop({ default: () => defaultVendor }) readonly selectedVendorForEditing!: Vendor;
    @Prop({ default: false }) readonly closeModalOnBackdrop!: boolean;

    private modalTitle = 'Add Vendor';

    private hideModal() {
        this.$bvModal.hide('add-or-edit-vendor-modal');
    }

    private checkFormMode() {
        this.$nextTick(() => {
            if (this.vendorIsToBeEdited) {
                this.modalTitle = 'Edit Vendor';
            }
        });
    }

    private resetFormMode() {
        this.modalTitle = 'Add Vendor';
        this.$emit('reset-conditions-for-vendor-editing');
    }

    private handleModalBackdrop(coseModal: boolean) {
        this.$emit('close-vendor-modal-on-backdrop', coseModal);
    }

    private handleVendorCreated(vendor: Vendor) {
        this.$emit('new-vendor-created', vendor);
    }

    private handleVendorUpdated(vendor: Vendor) {
        this.$emit('existing-vendor-updated', vendor);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/add-new-vendor';
</style>
