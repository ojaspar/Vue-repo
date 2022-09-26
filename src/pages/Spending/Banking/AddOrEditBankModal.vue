<template>
    <b-modal
        :id="modalId"
        :no-close-on-backdrop="!closeModalOnBackdrop"
        @show="checkFormMode"
        @hide="resetModalTitle"
        @hidden="dismissModal"
    >
        <template v-slot:modal-header>
            <div class="bank-form__heading">
                <h2 class="bank-form__heading--text ">{{ modalTitle }}</h2>
                <span class="close-btn" title="Cancel" @click="hideModal">
                    &times;
                </span>
            </div>
        </template>

        <div class="bank-form__modal-body">
            <BankForm
                buttonText="Save"
                :bankDetailsAreBeingEdited="bankDetailsAreBeingEdited"
                :bankToBeEdited="bankToBeEdited"
                @bank-added="emitAddSuccessEvent"
                @bank-updated="emitUpdateSuccessEvent"
                @close-bank-modal-on-backdrop="handleModalBackdrop"
            />
        </div>
    </b-modal>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator';

import BankForm from '@/pages/Spending/Banking/AddOrEditBankForm.vue';

import { BankDetails } from '@/pages/Spending/Banking/types';
import { BankAccount } from '@/pages/DataMigration/types';

const defaultBankDetails: BankDetails = {
    bankName: '',
    accountNumber: '',
    accountBalance: { currencyKey: '', amount: 0 },
    displayName: '',
    sourcePaymentAccountKey: '',
};

@Component({
    components: { BankForm },
})
export default class AddOrEditBankModal extends Vue {
    @Prop({ default: false }) readonly bankDetailsAreBeingEdited!: boolean;
    @Prop({ default: () => defaultBankDetails }) readonly bankToBeEdited!: BankDetails;
    @Prop({ default: '' }) readonly modalId!: string;
    @Prop({ default: false }) readonly closeModalOnBackdrop!: boolean;

    private modalTitle = 'Add Bank';

    private checkFormMode() {
        this.$nextTick(() => {
            if (this.bankDetailsAreBeingEdited) {
                this.modalTitle = 'Edit Bank Details';
            }
        });
    }

    private resetModalTitle() {
        this.modalTitle = 'Add Bank';
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private emitAddSuccessEvent() {
        this.$emit('account-added');
        this.dismissModal();
    }

    private emitUpdateSuccessEvent(newUpdate: BankAccount) {
        this.$emit('update-bank-details', newUpdate);
        this.$emit('reset-conditions-for-bank-editing');
        this.dismissModal();
    }

    private handleModalBackdrop(closeModal: boolean) {
        this.$emit('close-bank-modal-on-backdrop', closeModal);
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideModal();
            this.$emit('bank-modal-hidden');
        }, 500);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/new-bank-form';
</style>
