<template>
    <div class="shareholder-form">
        <!-- Shareholder Name -->
        <b-row class="shareholder-form__field--row">
            <b-col class="shareholder-form__field--input">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Name"
                    v-model="shareholder.name"
                    :errors="shareholderFormError.name"
                    @input="validateShareholderName(shareholder.name)"
                />
            </b-col>
        </b-row>

        <div :class="{ 'shareholder-form__blur-fields': shareholderDetailsIsStillBeingFetched }">
            <!-- Phone Number -->
            <b-row class="shareholder-form__field--row">
                <b-col class="shareholder-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        type="number"
                        floatingLabelText="Phone Number"
                        v-model="shareholder.phoneNumber"
                        :errors="shareholderFormError.phoneNumber"
                        @input="validateShareholderPhoneNumber(shareholder.phoneNumber)"
                    />
                </b-col>
            </b-row>

            <transition-group name="slide-up-fade" mode="out-in">
                <template v-if="showFullDetails">
                    <!-- Email Address -->
                    <b-row class="shareholder-form__field--row" key="email">
                        <b-col class="shareholder-form__field--input">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                type="email"
                                floatingLabelText="Email Address"
                                v-model="shareholder.emailAddress"
                                :errors="shareholderFormError.email"
                                @input="validateShareholderEmail(shareholder.emailAddress)"
                            />
                        </b-col>
                    </b-row>

                    <!-- Address -->
                    <b-row class="shareholder-form__field--row" key="address">
                        <b-col class="shareholder-form__field--input">
                            <BaseTextAreaWithBorderAndFloatingLabel
                                @input="validateFreeTextField('address', shareholder.address, shareholderFormError)"
                                floatingLabelText="Address"
                                v-model="shareholder.address"
                                :errors="shareholderFormError.address"
                            />
                        </b-col>
                    </b-row>

                    <!-- Notes -->
                    <b-row class="shareholder-form__field--row" key="notes">
                        <b-col class="shareholder-form__field--input">
                            <BaseTextAreaWithBorderAndFloatingLabel
                                @input="validateFreeTextField('notes', shareholder.notes, shareholderFormError)"
                                floatingLabelText="Notes"
                                v-model="shareholder.notes"
                                :errors="shareholderFormError.notes"
                            />
                        </b-col>
                    </b-row>
                    <span
                        class="txt--primary shareholder-form__toggle-details"
                        key="toggle-less"
                        @click="toggleFullDetails"
                        >Less details</span
                    >
                </template>
                <span
                    v-else
                    class="txt--primary shareholder-form__toggle-details"
                    key="toggle-more"
                    @click="toggleFullDetails"
                    >More details</span
                >
            </transition-group>
        </div>

        <b-row class="shareholder-form__footer">
            <BasePrimaryButton
                className="shareholder-form__save-btn"
                :buttonText="submitButtonText"
                :disabled="buttonIsDisabled"
                :status="addOrEditShareholderRequestStatus"
                @button-clicked="handleFormSubmission"
            />
        </b-row>

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

import FinanceModule from '@/store/modules/finance';

import FinancingMixin from '@/pages/Financing/FinancingMixin';
import UtilityMixins from '@/mixins/Utility';

import { NotificationType, Status, Toaster } from '@/types';
import {
    AddShareholderForm,
    defaultShareholder,
    FinancingRequestStatus,
    Shareholder,
} from '@/pages/Financing/Capital/types';

const finance = namespace('finance');
let financeModule: FinanceModule;

@Component
export default class AddEditShareholder extends Mixins(UtilityMixins, FinancingMixin) {
    @Prop({ default: '' }) readonly searchedShareholderName!: string;
    @Prop({ default: false }) readonly shareholderIsBeingEdited!: boolean;
    @Prop({ default: () => defaultShareholder }) readonly shareholderToBeEdited!: Shareholder;

    private shareholder: AddShareholderForm = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        notes: '',
    };

    private showFullDetails = false;

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-shareholder-request-notification',
        position: 'b-toaster-top-center',
    };

    @finance.State
    private error!: string;

    @finance.State
    private financingRequestStatus!: FinancingRequestStatus;

    @finance.State
    private newShareholder!: Shareholder;

    @finance.State
    private shareholderDetail!: Shareholder;

    get submitButtonText() {
        return this.shareholderIsBeingEdited ? 'Save Changes' : 'Save';
    }

    get productKeyIsRequired(): boolean {
        return this.shareholderIsBeingEdited;
    }

    get buttonIsDisabled(): boolean {
        return this.shareholderDetailsIsStillBeingFetched || !this.shareholderFormIsValidated;
    }

    get shareholderDetailsIsStillBeingFetched(): boolean {
        return this.financingRequestStatus.getShareholderDetails === Status.LOADING;
    }

    get addOrEditShareholderRequestStatus() {
        const { createShareholder, updateShareholderDetails } = this.financingRequestStatus;

        if (this.shareholderIsBeingEdited) return updateShareholderDetails;

        return createShareholder;
    }

    private toggleFullDetails() {
        this.showFullDetails = !this.showFullDetails;
    }

    private checkFormMode() {
        if (!this.shareholderIsBeingEdited) return;

        const { shareHoldername, shareHolderKey = '' } = this.shareholderToBeEdited;
        const { emailAddress, phoneNumber, address, notes } = defaultShareholder;

        this.shareholder = { name: shareHoldername, emailAddress, phoneNumber, address, notes };

        this.getShareholderDetails(shareHolderKey);
        return;
    }

    private async getShareholderDetails(shareholderKey: string) {
        await financeModule.getShareholderDetails(shareholderKey);

        if (this.financingRequestStatus.getShareholderDetails === Status.SUCCESS) {
            this.prefillFormWithShareholderToBeUpdated();
        }
    }

    private autoFillShareholderName() {
        if (this.searchedShareholderName !== '') {
            this.shareholder.name = this.searchedShareholderName;
        }
    }

    private prefillFormWithShareholderToBeUpdated() {
        const { shareHolderKey, emailAddress, phoneNumber, address, notes } = this.shareholderDetail;

        this.$set(this.shareholder, 'shareholderKey', shareHolderKey);
        this.$set(this.shareholder, 'emailAddress', emailAddress);
        this.$set(this.shareholder, 'phoneNumber', phoneNumber);
        this.$set(this.shareholder, 'address', address);
        this.$set(this.shareholder, 'notes', notes);
    }

    private handleFormSubmission() {
        this.validateShareholderForm(this.shareholder);
        if (!this.shareholderFormIsValidated) return;
        this.submitForm();
    }

    private submitForm() {
        if (this.shareholderIsBeingEdited) {
            this.updateShareholder();
            return;
        }

        this.addNewShareholder();
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

    private async addNewShareholder() {
        await financeModule.createShareholder(this.shareholder);

        if (this.financingRequestStatus.createShareholder === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Shareholder added successfully');
            this.$emit('new-shareholder-added', this.newShareholder);
            return;
        }

        if (this.financingRequestStatus.createShareholder === Status.ERROR) {
            this.showNotification(NotificationType.ERROR, this.error);
        }
    }

    private async updateShareholder() {
        const { shareHolderKey: shareholderKey = '' } = this.shareholderToBeEdited;

        await financeModule.updateShareholderDetails({
            shareholderKey,
            shareholder: this.shareholder,
        });

        if (this.financingRequestStatus.updateShareholderDetails === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Shareholder updated successfully');

            this.$emit('shareholder-updated-successfully');
            return;
        }

        if (this.financingRequestStatus.updateShareholderDetails === Status.ERROR) {
            this.showNotification(NotificationType.ERROR, this.error);
        }
    }

    mounted() {
        financeModule = getModule(FinanceModule, this.$store);

        this.autoFillShareholderName();
        this.checkFormMode();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/add-edit-shareholder';
</style>
