<template>
    <div class="full-business-profile-page">
        <div class="full-business-profile-page__header">Business Profile</div>
        <div class="full-business-profile-page__logo-section">
            <div class="full-business-profile-page__logo-wrapper">
                <div v-if="companyInfo.logo" class="full-business-profile-page__logo-container">
                    <img :src="companyInfo.logo" alt="Company Logo" class="full-business-profile-page__logo" />
                    <img
                        @click="showModal"
                        src="@/assets/img/camera.svg"
                        class="full-business-profile-page__edit-icon pointer"
                    />
                </div>

                <div class="full-business-profile-page__empty-logo pointer" v-else @click="showModal">
                    <img src="@/assets/img/image-outline.svg" />
                    <span>Upload Your Company Logo</span>
                </div>
            </div>
        </div>

        <div class="full-business-profile-page__section-header">Business Details</div>

        <BaseInputFieldWithBorderAndFloatingLabel
            @input="validateBusinessName"
            :errors="addBusinessErrors.name"
            :disabled="true"
            type="text"
            :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
            v-model="business.name"
            floatingLabelText="Company Name"
        />

        <BaseInputFieldWithBorderAndFloatingLabel
            @input="validateBusinessAddress"
            :errors="addBusinessErrors.address"
            :disabled="!isBusinessEditMode"
            type="text"
            :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
            v-model="business.address"
            floatingLabelText="Registered Office"
        />

        <!-- Registered Address and Phone Number -->
        <b-row>
            <b-col sm="12" md="6">
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessEmail"
                    :disabled="!isBusinessEditMode"
                    :errors="addBusinessErrors.email"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    v-model="business.email"
                    type="text"
                    floatingLabelText="Email Address"
                />
            </b-col>

            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    @input="validateBusinessPhoneNumber"
                    :disabled="!isBusinessEditMode"
                    :errors="addBusinessErrors.phoneNumber"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    v-model="business.phone"
                    type="number"
                    floatingLabelText="Phone Number"
                />
            </b-col>
        </b-row>

        <!-- Country, State and LGA -->
        <div v-if="isBusinessEditMode">
            <b-row>
                <b-col>
                    <BaseSelectWithBorderAndFloatingLabel
                        keyProperty="key"
                        textProperty="name"
                        valueProperty="key"
                        :disabled="true"
                        :options="countries"
                        @input="handleBusinessCountryChange"
                        :errors="addBusinessErrors.country.key"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        v-model="business.country.key"
                        floatingLabelText="Country"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="12" md="6">
                    <BaseSelectWithBorderAndFloatingLabel
                        keyProperty="key"
                        textProperty="name"
                        valueProperty="key"
                        :options="states"
                        @input="handleBusinessStateChange"
                        :errors="addBusinessErrors.state.key"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        v-model="business.state.key"
                        floatingLabelText="State"
                    />
                </b-col>

                <b-col>
                    <BaseSelectWithBorderAndFloatingLabel
                        keyProperty="key"
                        textProperty="name"
                        valueProperty="key"
                        :options="lgas"
                        @input="handleBusinessLocalGovernmentChange"
                        :errors="addBusinessErrors.council.key"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        v-model="business.council.key"
                        floatingLabelText="LGA"
                    />
                </b-col>
            </b-row>
        </div>

        <div v-else>
            <b-row>
                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :disabled="true"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        :value="business.country.name"
                        floatingLabelText="Country"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="12" md="6">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="State"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        :disabled="true"
                        :value="business.state.name"
                    />
                </b-col>

                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="LGA"
                        :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                        :disabled="true"
                        v-model="business.council.name"
                    />
                </b-col>
            </b-row>
        </div>

        <!-- Business Incorportation Details -->
        <div class="full-business-profile-page__section-header">Business Incorportation Details</div>

        <b-row v-if="isBusinessEditMode">
            <b-col sm="12" md="6">
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="businessRegistrationTypes"
                    defaultOptionText="Select Business Type"
                    @input="handleBusinessTypeChange"
                    :errors="addBusinessErrors.type.key"
                    type="text"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    v-model="business.type.key"
                    floatingLabelText="Business Type"
                    :disabled="true"
                />
            </b-col>

            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    keyProperty="businessVerticalKey"
                    textProperty="name"
                    valueProperty="businessVerticalKey"
                    :options="businessVerticals"
                    :disabled="true"
                    @input="handleBusinessIndustryChange"
                    :errors="addBusinessErrors.industry.key"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    v-model="business.industry.key"
                    type="text"
                    floatingLabelText="Industry"
                />
            </b-col>
        </b-row>

        <b-row v-else>
            <b-col sm="12" md="6">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Business Type"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    :disabled="true"
                    :value="business.type.name"
                />
            </b-col>

            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Industry"
                    :className="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    :disabled="true"
                    :value="business.industry.name"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col sm="12" md="6">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :disabled="!isBusinessEditMode"
                    :class="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    floatingLabelText="Date of Incorporation"
                    value="2019-02-24"
                />
            </b-col>

            <b-col sm="12" md="6">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :disabled="!isBusinessEditMode"
                    :class="{ 'full-business-profile-page__disabled': !isBusinessEditMode }"
                    floatingLabelText="Commencement Date"
                    value="2019-02-24"
                />
            </b-col>
        </b-row>

        <BasePrimaryButton
            className="button full-business-profile-page__submit-button"
            :status="businessDetailsButtonStatus"
            @button-clicked="handleButtonClick"
            :disabled="conditionsForBusinessDetailsButtonToBeDisabled"
        >
            {{ isBusinessEditMode ? 'Save' : 'Edit' }}
        </BasePrimaryButton>

        <BaseModal @hide-modal="hideModal" :modalId="modalId" modalTitle="Upload Company Logo">
            <LogoUpload @file-uploaded="hideModal" />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import LogoUpload from '@/components/ui/LogoUpload.vue';

import { BusinessProfile, BusinessRequestStatus, CompanyInfo, Status, ToasterObject, User } from '@/types';
import { UserProfileBusiness } from '@/pages/Settings/types';

import BusinessModule from '@/store/modules/business';

import SettingsMixin from '@/pages/Settings/mixins';

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

@Component({
    components: { LogoUpload },
})
export default class BusinessProfilePage extends Mixins(SettingsMixin) {
    @Prop({ default: () => businessDefault }) readonly businessDetails!: UserProfileBusiness;
    @Prop({ default: false }) readonly isNewBusinessAddition!: boolean;
    @Prop({ default: false }) readonly isBusinessEditMode!: boolean;
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    @Prop({ default: () => authenticatedUserDefault }) readonly authenticatedUser!: User;

    private modalId = 'company-logo-upload';

    @business.State
    public error!: string;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    @business.Action
    public editBusinessProfile!: (payload: BusinessProfile) => void;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'user-profile-index-toaster',
        position: 'b-toaster-top-center',
    };

    get conditionsForBusinessDetailsButtonToBeDisabled() {
        return this.isBusinessEditMode && this.atLeastOneErrorExists(this.addBusinessErrors);
    }

    private hideAddBusinessModal(delay = false) {
        if (delay) {
            setTimeout(() => {
                this.$emit('hide-businessfull--profile-page');
            }, 1200);
        }
        this.$emit('hide-businessfull--profile-page');
    }

    @Watch('business.state.key')
    stateChanged() {
        businessModule.getLGAs(this.business.state.key);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private showModal() {
        this.$bvModal.show(this.modalId);
    }

    private async handleButtonClick() {
        let toasterObject = {};
        const businessCredentials = this.generateBusinessCredentials();

        if (!this.isBusinessEditMode) {
            this.$emit('set-business-edit-mode', true);
            return;
        }

        this.validateBusinessDetailsPage();
        if (!this.atLeastOneErrorExists(this.addBusinessErrors)) {
            if (this.isBusinessEditMode && !this.isNewBusinessAddition) {
                await businessModule.editBusinessProfile({
                    businessKey: this.businessDetails.businessKey,
                    businessCredentials,
                });
                // make the API call here to update the business in the database
                if (this.businessRequestStatus.editBusinessProfile === Status.SUCCESS) {
                    await businessModule.verifyBusinessProfileUpdate({
                        businessKey: this.businessDetails.businessKey,
                        token: this.verifyBusinessUpdateToken,
                    });
                    if (this.businessRequestStatus.verifyBusinessProfileUpdate === Status.SUCCESS) {
                        toasterObject = {
                            ...this.toaster,
                            type: 'success',
                            title: 'Success',
                            message: 'You have successfully edited your business profile',
                        };
                        this.$emit('set-business-edit-mode', false);
                    } else {
                        toasterObject = {
                            ...this.toaster,
                            type: 'danger',
                            title: 'Error',
                            message: 'There was an error editing the business. Please try again later.',
                        };
                    }
                } else {
                    toasterObject = {
                        ...this.toaster,
                        type: 'danger',
                        title: 'Error',
                        message: 'There was an error editing the business. Please try again later.',
                    };
                }
            }

            if (this.isBusinessEditMode && this.isNewBusinessAddition) {
                this.addNewBusinessProfile();
                return;
            }
            this.$emit('show-business-addition-toaster', toasterObject);
        }
    }

    private async addNewBusinessProfile() {
        const businessCredentials = this.generateBusinessCredentials();
        await businessModule.registerBusiness(businessCredentials);

        if (this.businessRequestStatus.registerBusiness === Status.SUCCESS) {
            this.showNotification();
            this.hideAddBusinessModal(true);
            return;
        }
        if (this.businessRequestStatus.registerBusiness === Status.ERROR) {
            this.showNotification(false);
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

    private showNotification(isSuccess = true) {
        let toasterObject = {};
        if (!isSuccess) {
            toasterObject = {
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: this.error,
            };
            this.$emit('show-business-addition-toaster', toasterObject);
            return;
        }

        toasterObject = {
            ...this.toaster,
            type: 'success',
            title: 'Success!',
            message: 'You have successfully added a new business',
        };
        this.$emit('show-business-addition-toaster', toasterObject);
    }

    private emitToasterObject(toasterObject: ToasterObject) {
        this.$emit('show-business-addition-toaster', toasterObject);
    }

    private async getNecessarySelectOptions() {
        await Promise.all([
            businessModule.getCountries(),
            businessModule.getStates(),
            businessModule.getBusinessVerticals(),
            businessModule.getBusinessRegistrationTypes(),
        ]);
    }

    private setLogoFile(logoUrl: string) {
        //console.log(logoUrl);
    }

    @Watch('isNewBusinessAddition')
    isNewBusinessAdditionStateHasChanged(newValue: boolean) {
        if (!newValue) {
            this.getNecessarySelectOptions();
        }
        this.business = { ...this.businessDetails };
    }

    mounted() {
        businessModule = getModule(BusinessModule, this.$store);

        this.business = { ...this.businessDetails };

        this.getNecessarySelectOptions();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/add-or-edit-business';
</style>
