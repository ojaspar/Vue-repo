<template>
    <b-container>
        <b-modal
            id="new-customer-form"
            :no-close-on-backdrop="!closeModalOnBackdrop"
            @show="checkFormMode"
            @hide="resetFormMode"
        >
            <template v-slot:modal-header>
                <div class="new-customer-form__heading">
                    <h2 class="new-customer-form__heading--text ">{{ formMode }} Customer</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>

            <div class="new-customer-form__modal-body">
                <AddCustomerForm
                    formButtonText="Save"
                    :isEditing="isEditing"
                    :customerToBeEdited="customerToBeEdited"
                    @customer-added="handleCustomerAdded"
                    @customer-updated="handleCustomerUpdate"
                    @close-customer-modal-on-backdrop="handleModalBackdrop"
                />
            </div>
        </b-modal>
    </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator';

import AddCustomerForm from '@/pages/Sales/ManageCustomers/AddOrEditCustomerForm.vue';

import { CustomerBioData } from '@/pages/Sales/ManageCustomers/types';

const defaultCustomer: CustomerBioData = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
};

@Component({
    components: { AddCustomerForm },
})
export default class AddOrEditCustomerModal extends Vue {
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: () => defaultCustomer }) readonly customerToBeEdited!: CustomerBioData;
    @Prop({ default: false }) readonly closeModalOnBackdrop!: boolean;

    private formMode = 'Add';

    private checkFormMode() {
        this.$nextTick(() => {
            if (this.isEditing) {
                this.formMode = 'Edit';
            }
        });
    }

    private resetFormMode() {
        this.formMode = 'Add';
        this.$emit('reset-customer-form-mode');
    }

    private handleCustomerAdded() {
        this.$emit('customer-added');

        setTimeout(() => {
            this.hideModal();
        }, 600);
    }

    private handleCustomerUpdate() {
        setTimeout(() => {
            this.hideModal();
        }, 600);
    }

    private handleModalBackdrop(coseModal: boolean) {
        this.$emit('close-customer-modal-on-backdrop', coseModal);
    }

    private hideModal() {
        this.$bvModal.hide('new-customer-form');
    }
}
</script>
