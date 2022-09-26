<template>
    <b-container>
        <b-modal id="add-or-edit-donor-modal" no-close-on-backdrop @show="checkFormMode" @hide="resetFormMode">
            <template v-slot:modal-header>
                <div class="add-donor-modal__heading">
                    <h2 class="add-donor-modal__heading--text ">{{ modalTitle }}</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>

            <AddOrEditDonorForm
                :searchedDonorName="searchedDonor"
                :donorIsEditing="donorIsToBeEdited"
                :donorToBeEdited="selectedDonorForEditing"
                @new-donor-added="newDonorAdded"
                @existing-donor-updated="$emit('existing-donor-updated')"
            />
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import AddOrEditDonorForm from '@/pages/Donations/Donors/AddEditDonor.vue';

import { Donor, defaultDonor } from '@/pages/Donations/types';

@Component({
    components: {
        AddOrEditDonorForm,
    },
})
export default class AddOrEditDonorModal extends Vue {
    @Prop({ default: '' }) readonly searchedDonor!: string;
    @Prop({ default: false }) readonly donorIsToBeEdited!: boolean;
    @Prop({ default: () => defaultDonor }) readonly selectedDonorForEditing!: Donor;

    private modalTitle = 'New Donor';

    private newDonorAdded(newDonor: Donor) {
        this.$emit('new-donor-added', newDonor);
    }

    private hideModal() {
        this.$bvModal.hide('add-or-edit-donor-modal');
    }

    private checkFormMode() {
        this.$nextTick(() => {
            if (this.donorIsToBeEdited) {
                this.modalTitle = 'Edit Donor';
            }
        });
    }

    private resetFormMode() {
        this.modalTitle = 'Add Donor';
        this.$emit('reset-conditions-for-donor-editing');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donors/add-or-edit-donor-modal.scss';
</style>
