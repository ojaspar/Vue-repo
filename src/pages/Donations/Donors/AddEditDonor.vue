<template>
    <div>
        <div class="donor-form">
            <!-- Donor Name -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Name"
                        v-model="donor.fullName"
                        :errors="donorFormError.name"
                        @input="validateDonorName(donor.fullName)"
                    />
                </b-col>
            </b-row>

            <!-- Phone Number -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        type="number"
                        floatingLabelText="Phone Number"
                        v-model="donor.phoneNumber"
                        :errors="donorFormError.phoneNumber"
                        @input="validateDonorPhoneNumber(donor.phoneNumber)"
                    />
                </b-col>
            </b-row>

            <!-- Email Address -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        type="email"
                        floatingLabelText="Email Address"
                        v-model="donor.emailAddress"
                        :errors="donorFormError.email"
                        @input="validateDonorEmail(donor.emailAddress)"
                    />
                </b-col>
            </b-row>

            <!-- Address -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Address" v-model="donor.address" />
                </b-col>
            </b-row>

            <!-- Notes -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="donor.notes" />
                </b-col>
            </b-row>

            <b-row class="donor-form__footer">
                <BasePrimaryButton
                    className="donor-form__save-btn"
                    :buttonText="submitButtonText"
                    :disabled="buttonIsDisabled"
                    :status="donorRequestStatus"
                    @button-clicked="handleDonorDorm"
                />
            </b-row>
        </div>

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
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonationModule from '@/store/modules/donation';

import { Donor, DonationRequestStatus, defaultDonor } from '@/pages/Donations/types';
import DonationMixin from '@/pages/Donations/DonationMixin';
import { NotificationType, Status, Toaster } from '@/types';

import UtilityMixins from '@/mixins/Utility';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component
export default class AddEditDonor extends Mixins(UtilityMixins, DonationMixin) {
    private donor: Donor = { ...defaultDonor };
    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-donor-request-notification',
        position: 'b-toaster-top-center',
    };

    @Prop({ default: '' }) readonly searchedDonorName!: string;
    @Prop({ default: false }) readonly donorIsEditing!: boolean;
    @Prop({ default: () => defaultDonor }) readonly donorToBeEdited!: Donor;

    @donations.State
    private error!: string;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private newDonor!: Donor;

    get submitButtonText() {
        return this.donorIsEditing ? 'Save Changes' : 'Add Donor';
    }

    get productKeyIsRequired(): boolean {
        return this.donorIsEditing;
    }

    get buttonIsDisabled(): boolean {
        return !this.donorFormIsValidated;
    }

    get donorRequestStatus() {
        return this.donorIsEditing ? this.donationRequestStatus.editDonor : this.donationRequestStatus.createDonor;
    }

    private checkFormMode() {
        if (this.donorIsEditing) {
            this.prefillFormWithDonorToBeUpdated();
            return;
        }
    }

    private autoFillDonorName() {
        if (this.searchedDonorName !== '') {
            this.donor.fullName = this.searchedDonorName;
        }
    }

    private prefillFormWithDonorToBeUpdated() {
        const { donorKey, fullName, emailAddress, phoneNumber, address, notes } = this.donorToBeEdited;
        this.$set(this.donor, 'donorKey', donorKey);
        this.$set(this.donor, 'fullName', fullName);
        this.$set(this.donor, 'emailAddress', emailAddress);
        this.$set(this.donor, 'phoneNumber', phoneNumber);
        this.$set(this.donor, 'address', address);
        this.$set(this.donor, 'notes', notes);
    }

    private handleDonorDorm() {
        this.validateDonorForm(this.donor);
        if (!this.donorFormIsValidated) return;
        this.submitDonorForm();
    }

    private submitDonorForm() {
        if (this.donorIsEditing) {
            this.updateDonor();
            return;
        }

        this.addNewDonor();
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
            });
            return;
        }

        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: message || 'An Error Occured',
        });
    }

    private async addNewDonor() {
        await donationsModule.createDonor(this.donor);
        if (this.donationRequestStatus.createDonor === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Donor added successfully');
            this.$emit('new-donor-added', this.newDonor);
            return;
        }

        if (this.donationRequestStatus.createDonor === Status.ERROR) {
            this.showNotification(NotificationType.ERROR, 'Failed to add donor. Please re-try later');
        }
    }

    private async updateDonor() {
        await donationsModule.editDonor(this.donor);
        if (this.donorRequestStatus == Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Donor updated successfully');
            this.$emit('existing-donor-updated', this.donor);
            return;
        }
        if (this.donorRequestStatus == Status.ERROR) {
            this.showNotification(NotificationType.ERROR, 'Failed to update donor. Please re-try later');
        }
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);

        this.autoFillDonorName();
        this.checkFormMode();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/add-edit-donor';
</style>
