<template>
    <!-- Tax Contact Details -->
    <div class="tax-page-container__business-detail mb-4">
        <div class="tax-page-container__heading">
            Tax Contact Details
            <span class="pointer" @click="editProfile"><img src="@/assets/img/pencil.svg"/></span>
        </div>

        <b-row>
            <b-col sm="12" md="6">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Email"
                    :value="taxContactDetails.email"
                    disabled="true"
                    className="tax-page-container__disabled-field"
                />
            </b-col>

            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Phone Number"
                    :value="taxContactDetails.phoneNumber"
                    disabled="true"
                    className="tax-page-container__disabled-field"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Business Operating Address"
                    :value="taxContactDetails.operatingAddress"
                    disabled="true"
                    className="tax-page-container__disabled-field"
                />
            </b-col>
        </b-row>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="hideModal">
            <b-row>
                <b-col sm="12" md="6">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Email"
                        v-model="form.email"
                        @input="validateEmailAddress(form.email)"
                        :errors="taxContactBioFormError.email"
                    />
                </b-col>

                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Phone Number"
                        v-model="form.phoneNumber"
                        @input="validatePhoneNumber(form.phoneNumber)"
                        :errors="taxContactBioFormError.phoneNumber"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseTextAreaWithBorderAndFloatingLabel
                        floatingLabelText="Business Operating Address"
                        v-model="form.operatingAddress"
                        :errors="taxContactBioFormError.operatingAddress"
                        @input="validateBusinessAddress(form.operatingAddress)"
                    />
                </b-col>
            </b-row>

            <BasePrimaryButton
                buttonText="Save"
                className="tax-page-container__submit-button"
                :status="updateRequestStatus"
                @button-clicked="updateTaxContactDetails"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { TaxContactDetails } from '@/pages/TaxAndRemittance/types';
import { Status } from '@/types';

import TaxMixin from '@/pages/TaxAndRemittance/TaxMixin';

import TaxModule from '@/store/modules/tax';

let taxModule: TaxModule;
const tax = namespace('tax');

@Component
export default class BusinessTaxBio extends Mixins(TaxMixin) {
    @tax.State
    private taxContactDetails!: TaxContactDetails;

    private form: TaxContactDetails = {
        email: '',
        phoneNumber: '',
        operatingAddress: '',
    };

    private modalId = 'business-bio-modal';
    private modalTitle = 'Tax Contact Details';

    get updateRequestStatus(): string {
        return this.taxRequestStatus.updateTaxContactDetails;
    }

    private async updateTaxContactDetails() {
        // validate the form
        this.validateTaxContactDetailsForm(this.form);

        if (this.taxContactFormHasErrors) return;

        await taxModule.updateTaxContactDetails(this.form);

        if (this.taxRequestStatus.updateTaxContactDetails === Status.SUCCESS) {
            this.hideModal();
        }
    }

    private showModal() {
        this.$bvModal.show(this.modalId);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private editProfile() {
        this.form = this.taxContactDetails;

        this.showModal();
    }

    private async getTaxContactDetails() {
        await taxModule.getTaxContactDetails();
    }

    created() {
        taxModule = getModule(TaxModule, this.$store);

        this.getTaxContactDetails();
    }
}
</script>
