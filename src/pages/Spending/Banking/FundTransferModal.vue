<template>
    <b-container>
        <b-modal
            no-close-on-backdrop
            :id="modalId"
            @hide="$emit('reset-selected-source-account')"
            @hidden="$emit('fund-transfer-modal-hidden')"
        >
            <template v-slot:modal-header>
                <div class="fund-transfer-modal__heading">
                    <h2 class="fund-transfer-modal__heading--text ">Bank Transfer</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>

            <div class="fund-transfer-modal__modal-body">
                <FundTransferForm
                    :isSourceAccountSelected="isSourceAccountSelected"
                    :selectedSourceAccount="selectedSourceAccount"
                    @fund-transfer-completed="handleFundTransferCompletion"
                />
            </div>
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import FundTransferForm from '@/pages/Spending/Banking/FundTransferForm.vue';

@Component({
    components: { FundTransferForm },
})
export default class FundTransferModal extends Vue {
    @Prop({ default: '' }) readonly modalId!: string;
    @Prop({ default: false }) readonly isSourceAccountSelected!: boolean;
    @Prop({ default: '' }) readonly selectedSourceAccount!: string;

    private handleFundTransferCompletion() {
        this.$emit('refresh-bank-list');
        this.dismissModal();
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideModal();
        }, 1500);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/fund-transfer-modal';
</style>
