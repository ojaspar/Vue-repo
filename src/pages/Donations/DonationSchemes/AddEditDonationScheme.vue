<template>
    <div>
        <div class="donor-form">
            <!-- Donor Name -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Name"
                        v-model="donationScheme.name"
                        @input="validateDonationSchemeName(donationScheme.name)"
                        :errors="donationSchemeFormError.name"
                    />
                </b-col>
            </b-row>

            <!-- Redemption Type -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseRadioGroupWithBorderAndFloatingLabel
                        floatingLabelText="Type"
                        :radioButtonOptions="donationSchemeTypes"
                        :checkedValue="type"
                        v-model="donationScheme.type"
                        @change="setDonationType"
                        :errors="donationSchemeFormError.type"
                    />
                </b-col>
            </b-row>

            <template v-if="donationSchemeIsNotGeneral">
                <transition-group name="slide-up-fade" mode="out-in" appear>
                    <!-- Financial Target -->
                    <b-row class="donor-form__field--row" key="financialTarget">
                        <b-col class="donor-form__field--input">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                required="true"
                                @input="handleFinancialTargetInput"
                                v-floating-number-only
                                :floatingLabelText="labelCurrencyText"
                                :value="convertFigureToCurrency(donationScheme.financialTarget.amount)"
                                :errors="donationSchemeFormError.financialTarget"
                            />
                        </b-col>
                    </b-row>

                    <!-- Target Date -->
                    <b-row class="donor-form__field--row" key="targetDate">
                        <b-col class="donor-form__field--input">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="Target Date"
                                v-model="donationScheme.targetDate"
                                :errors="donationSchemeFormError.targetDate"
                                @change="validateDonationTargetDate(donationScheme.targetDate)"
                            />
                        </b-col>
                    </b-row>
                </transition-group>
            </template>

            <!-- Description -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel
                        floatingLabelText="Description"
                        v-model="donationScheme.description"
                        @input="validateDonationSchemeDescription(donationScheme.description)"
                        :errors="donationSchemeFormError.description"
                    />
                </b-col>
            </b-row>

            <b-row class="donor-form__footer">
                <BasePrimaryButton
                    :buttonText="submitButtonText"
                    :status="donationSchemeRequestStatus"
                    :disabled="!donationSchemeFormIsReadyForSubmission"
                    className="donor-form__save-btn"
                    @button-clicked="handleDonationSchemeFormSubmission"
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
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import DonationModule from '@/store/modules/donation';

import {
    defaultDonationScheme,
    DonationRequestStatus,
    DonationScheme,
    DonationSchemeType,
} from '@/pages/Donations/types';
import { NotificationType, RadioButtonOption, Status, Toaster } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import DonationMixin from '@/pages/Donations/DonationMixin';

const donations = namespace('donation');
let donationsModule: DonationModule;

@Component
export default class AddEditDonationScheme extends Mixins(UtilityMixins, CurrencyMixins, DonationMixin) {
    private donationScheme: DonationScheme = { ...defaultDonationScheme };
    private donationSchemeTypes: RadioButtonOption = {
        name: 'type',
        values: [DonationSchemeType.PROJECT_SPECIFIC, DonationSchemeType.GENERAL],
    };
    private type = DonationSchemeType.PROJECT_SPECIFIC;

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-donation-scheme-request-notification',
        position: 'b-toaster-top-center',
    };

    @Prop({ default: '' }) readonly searchedDonationSchemeName!: string;
    @Prop({ default: false }) readonly donationIsEditing!: boolean;
    @Prop({ default: () => defaultDonationScheme }) readonly donationSchemeToBeEdited!: DonationScheme;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private newDonationScheme!: DonationScheme;

    get donationSchemeRequestStatus(): string {
        return this.donationIsEditing
            ? this.donationRequestStatus.updateDonationScheme
            : this.donationRequestStatus.createDonationScheme;
    }
    get buttonText(): string {
        return this.donationIsEditing ? 'Save Changes' : 'Save Donation Scheme';
    }

    get productKeyIsRequired(): boolean {
        return this.donationIsEditing;
    }

    get labelCurrencyText(): string {
        return `Financial Target (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }

    get submitButtonText() {
        return this.donationIsEditing ? 'Save Changes' : 'Save';
    }

    get donationSchemeIsNotGeneral(): boolean {
        return this.donationScheme.type !== DonationSchemeType.GENERAL;
    }

    private setDonationType(type: string) {
        this.$set(this, 'type', type);
        this.$set(this.donationScheme, 'type', type);

        this.$nextTick(() => {
            this.validateDonationSchemeType(type);
        });
    }

    private checkFormMode() {
        if (this.donationIsEditing) {
            this.prefillFormWithDonationSchemeToBeEdited();
            return;
        }
        this.donationScheme.financialTarget.currencyKey = this.homeCurrencyKey;
    }

    private autoFillDonationSchemeName() {
        if (this.searchedDonationSchemeName !== '') {
            this.donationScheme.name = this.searchedDonationSchemeName;
        }
    }

    private handleFinancialTargetInput(financialTarget: number) {
        const financialTargetInNumber = this.convertFormattedCurrencyToNumber(financialTarget.toString());

        this.donationScheme.financialTarget = Object.assign({}, this.donationScheme.financialTarget, {
            ...this.donationScheme.financialTarget,
            amount: financialTargetInNumber,
        });

        this.validateDonationSchemeFinancialTarget(financialTargetInNumber);
    }

    private prefillFormWithDonationSchemeToBeEdited() {
        this.donationScheme = Object.assign(this.donationScheme, this.donationSchemeToBeEdited);
        const { targetDate, type } = this.donationSchemeToBeEdited;
        const date = this.formatDateToFitCalendarFormat(targetDate);
        this.setDonationType(type);
        this.$set(this.donationScheme, 'targetDate', date);
    }

    private handleDonationSchemeFormSubmission() {
        this.validateDonationSchemeForm(this.donationScheme);
        if (!this.donationSchemeFormIsReadyForSubmission) return;

        this.submitDonationSchemeForm();
    }

    private submitDonationSchemeForm() {
        if (this.donationIsEditing) {
            this.updateDonationScheme();
            return;
        }
        this.addNewDonationScheme();
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

    private async addNewDonationScheme() {
        await donationsModule.createDonationScheme(this.donationScheme);
        if (this.donationRequestStatus.createDonationScheme === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Donation Scheme added successfully');

            this.$emit('new-donation-scheme-added', this.newDonationScheme);
        }
        if (this.donationRequestStatus.createDonationScheme === Status.ERROR) {
            this.showNotification(NotificationType.ERROR, 'Failed to add donation scheme. Please re-try later');
        }
    }

    private async updateDonationScheme() {
        await donationsModule.updateDonationScheme(this.donationScheme);
        if (this.donationRequestStatus.updateDonationScheme === Status.SUCCESS) {
            this.showNotification(NotificationType.SUCCESS, 'Donation Scheme updated successfully');

            this.$emit('existing-donation-scheme-updated', this.donationScheme);
        }
        if (this.donationRequestStatus.updateDonationScheme === Status.ERROR) {
            this.showNotification(NotificationType.ERROR, 'Failed to update donation scheme. Please re-try later');
        }
    }

    mounted() {
        donationsModule = getModule(DonationModule, this.$store);

        this.autoFillDonationSchemeName();
        this.checkFormMode();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/add-edit-donor';
</style>
