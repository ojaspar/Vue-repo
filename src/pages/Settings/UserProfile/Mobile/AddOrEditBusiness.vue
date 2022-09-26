<template>
    <div>
        <div class="add-business-mobile__logo-container" v-if="!isBusinessEditMode">
            <img class="add-business-mobile__company-logo" :src="companyInfo.logo" alt="company logo" v-if="false" />
            <span v-else class="logo-initials-container">{{ authenticatedUser.businessName | initials }}</span>
            <!-- <p :class="[companyInfo.logo ? '' : 'mt-3', 'add-business-mobile__logo-heading']"> -->
            <!-- {{ authenticatedUser.businessName }} -->
            <!-- </p> -->
        </div>
        <div class="add-business-mobile__content">
            <div>
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessName"
                    :errors="addBusinessErrors.name"
                    type="text"
                    v-model="business.name"
                    floatingLabelText="Business Name"
                    :disabled="!isBusinessEditMode"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="businessRegistrationTypes"
                    defaultOptionText="Select Business Type"
                    @input="handleBusinessTypeChange"
                    :errors="addBusinessErrors.type.key"
                    type="text"
                    v-model="business.type.key"
                    floatingLabelText="Business Type"
                    :disabled="!isBusinessEditMode"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="businessVerticalKey"
                    textProperty="name"
                    valueProperty="businessVerticalKey"
                    :options="businessVerticals"
                    @input="handleBusinessIndustryChange"
                    :errors="addBusinessErrors.industry.key"
                    v-model="business.industry.key"
                    type="text"
                    floatingLabelText="Industry"
                    :disabled="!isBusinessEditMode"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateRCNumber"
                    :errors="addBusinessErrors.rc"
                    v-model="business.rc"
                    type="text"
                    floatingLabelText="RC Number"
                    :disabled="!isBusinessEditMode"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessEmail"
                    :errors="addBusinessErrors.email"
                    v-model="business.email"
                    type="text"
                    floatingLabelText="Email"
                    :disabled="!isBusinessEditMode"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessPhoneNumber"
                    :errors="addBusinessErrors.phoneNumber"
                    v-model="business.phone"
                    type="number"
                    floatingLabelText="Phone Number"
                    :disabled="!isBusinessEditMode"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="countries"
                    @input="handleBusinessCountryChange"
                    :errors="addBusinessErrors.country.key"
                    v-model="business.country.key"
                    floatingLabelText="Country"
                    :disabled="!isBusinessEditMode"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="states"
                    @input="handleBusinessStateChange"
                    :errors="addBusinessErrors.state.key"
                    v-model="business.state.key"
                    floatingLabelText="State"
                    :disabled="!isBusinessEditMode"
                />
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="lgas"
                    @input="handleBusinessLocalGovernmentChange"
                    :errors="addBusinessErrors.council.key"
                    v-model="business.council.key"
                    floatingLabelText="Local Government"
                    :disabled="!isBusinessEditMode"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessAddress"
                    :errors="addBusinessErrors.address"
                    type="text"
                    v-model="business.address"
                    floatingLabelText="Address"
                    :disabled="!isBusinessEditMode"
                />
            </div>

            <div class="modal-bnt-layout">
                <BasePrimaryButton
                    className="button"
                    :status="businessDetailsButtonStatus"
                    @button-clicked="handleAddOrEditBusinessButtonClick"
                    :disabled="conditionsForBusinessDetailsButtonToBeDisabled"
                >
                    {{ isBusinessEditMode ? 'Save' : 'Edit' }}
                </BasePrimaryButton>
            </div>
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
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import BusinessModule from '@/store/modules/business';

import { UserProfileBusiness } from '@/pages/Settings/types';
import { CompanyInfo, User, Status } from '@/types';

import ValidationMixin from '@/mixins/validation';
import SettingsMixin from '@/pages/Settings/mixins';
import UtilityMixins from '@/mixins/Utility';
import { namespace } from 'vuex-class';

const businessDefault = {
    name: '',
    rc: '',
    phone: '',
    type: '',
    email: '',
    industry: '',
    country: '',
    state: '',
    council: '',
    address: '',
    isEdit: false,
};

const companyDefault: CompanyInfo = {
    logo: '',
    address: '',
};

const authenticatedUserDefault: User = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    currencyKey: '',
};

const business = namespace('business');
let businessModule: BusinessModule;

@Component
export default class ShowBusinessDetailsMobile extends Mixins(ValidationMixin, SettingsMixin, UtilityMixins) {
    @Prop({ default: () => businessDefault }) readonly businessDetails!: UserProfileBusiness;
    @Prop({ default: false }) readonly isNewBusinessAddition!: boolean;
    @Prop({ default: false }) readonly isBusinessEditMode!: boolean;
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    @Prop({ default: () => authenticatedUserDefault }) readonly authenticatedUser!: User;

    @business.State
    public error!: string;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'business-details-m-toaster',
        position: 'b-toaster-top-center',
    };

    get conditionsForBusinessDetailsButtonToBeDisabled() {
        return this.isBusinessEditMode && this.atLeastOneErrorExists(this.addBusinessErrors);
    }

    private setBusinessEditMode(isEditMode = true) {
        if (!isEditMode) {
            this.$emit('set-business-edit-mode', false);
            return;
        }
        this.$emit('set-business-edit-mode', true);
    }

    private handleAddOrEditBusinessButtonClick() {
        if (!this.isBusinessEditMode) {
            this.setBusinessEditMode();
            return;
        }
        this.validateBusinessDetailsPage();
        if (this.atLeastOneErrorExists(this.addBusinessErrors)) return;

        if (this.isBusinessEditMode && !this.isNewBusinessAddition) {
            this.updateBusinessProfile();
            return;
        }

        if (this.isBusinessEditMode && this.isNewBusinessAddition) {
            this.addNewBusinessProfile();
        }
    }

    private async updateBusinessProfile() {
        const businessCredentials = this.generateBusinessCredentials();
        await businessModule.editBusinessProfile({
            businessKey: this.businessDetails.businessKey,
            businessCredentials,
        });
        if (this.businessRequestStatus.editBusinessProfile === Status.SUCCESS) {
            await businessModule.verifyBusinessProfileUpdate({
                businessKey: this.businessDetails.businessKey,
                token: this.verifyBusinessUpdateToken,
            });
            if (this.businessRequestStatus.verifyBusinessProfileUpdate === Status.SUCCESS) {
                this.setBusinessEditMode(false);
                this.showNotication();
                this.backToHomePage();
                return;
            }
            if (this.businessRequestStatus.verifyBusinessProfileUpdate === Status.ERROR) {
                this.showNotication(false);
            }
        }
        if (this.businessRequestStatus.editBusinessProfile === Status.ERROR) {
            this.showNotication(false);
        }
    }

    private async addNewBusinessProfile() {
        const businessCredentials = this.generateBusinessCredentials();
        await businessModule.registerBusiness(businessCredentials);
        if (this.businessRequestStatus.registerBusiness === Status.SUCCESS) {
            this.showNotication(true, false);
            this.backToHomePage();
            return;
        }
        if (this.businessRequestStatus.registerBusiness === Status.ERROR) {
            this.showNotication(false, false);
        }
    }

    private generateBusinessCredentials() {
        const businessCredentials = {
            name: this.business.name,
            address: this.business.address,
            phoneNumber: this.business.phone,
            email: this.business.email,
            rcNumber: this.business.rc,
            businessRegistrationTypeKey: this.business.type.key,
            businessVerticalKey: this.business.industry.key,
            lgaKey: this.business.council.key,
            countryKey: this.business.country.key,
        };
        return businessCredentials;
    }

    private showNotication(isSuccess = true, isBusinessEditMode = true) {
        if (!isSuccess) {
            this.toaster.type = 'danger';
            this.toaster.title = 'Error!';
            this.toaster.message = this.error;
            this.showToaster(this.toaster);
            return;
        }

        const message = isBusinessEditMode
            ? 'You have successfully edited your business profile'
            : 'You have successfully added a new business';
        this.toaster.type = 'success';
        this.toaster.title = 'Success!';
        this.toaster.message = message;
        this.showToaster(this.toaster);
        return;
    }

    private backToHomePage() {
        setTimeout(() => {
            this.$emit('continue-to-user-profile-home-page');
        }, 1500);
    }

    @Watch('business.state.key')
    stateChanged() {
        businessModule.getLGAs(this.business.state.key);
    }

    mounted() {
        businessModule = getModule(BusinessModule, this.$store);
        Promise.all([
            businessModule.getCountries(),
            businessModule.getStates(),
            businessModule.getBusinessVerticals(),
            businessModule.getBusinessRegistrationTypes(),
        ]);
        this.business = { ...this.businessDetails };
    }
}
</script>

<style lang="scss">
.add-business-mobile {
    &__logo-container {
        text-align: center;
        padding: 28px 0 49px 0;
    }
    &__logo-heading {
        font-weight: 600;
        font-size: 20px;
        text-align: center;
        color: $primary-color;
        margin: 0;
    }
    &__content {
        background: $primary-white;
        margin: -15px;
        padding: 15px;
    }
}
</style>
