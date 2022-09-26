<template>
    <div class="mp-index">
        <transition-group name="slide-right-fade" mode="out-in" appear>
            <BusinessProfilePage
                key="business-profile"
                v-if="showBusinessProfile"
                :businessDetails="businessDetails"
                :isBusinessEditMode="isBusinessEditMode"
                :isNewBusinessAddition="isNewBusinessAddition"
                :companyInfo="companyInfo"
                :authenticatedUser="authenticatedUser"
                @set-business-edit-mode="setBusinessEditMode"
                @show-business-addition-toaster="showBusinessAdditionToaster"
                @close-business-profile-page="hideAddBusinessModal"
                @hide-business-profile-page="hideAddBusinessModal"
            />

            <div class="mp-index__outer-container" v-else key="user-profile">
                <div class="mp-index__inner-container">
                    <div class="mp-index__logo-section">
                        <div class="mp-index__logo-container">
                            <!-- <img :src="companyInfo.logo" alt="" v-if="companyInfo.logo" width="80" height="80" /> -->
                            <template>
                                <p class="logo-initials-container">{{ authenticatedUser.businessName | initials }}</p>
                            </template>
                            <span class="mp-index__business-name">{{ authenticatedUser.businessName }}</span>
                        </div>
                    </div>
                    <div
                        class="profile-details-mp__loader-container"
                        v-if="userProfileStatus.fetchUserProfile === 'LOADING'"
                    >
                        <Loader size="4" />
                    </div>
                    <div class="user-profile-card" v-else>
                        <div class="user-profile-card__first-layout">
                            <h3 class="user-profile-card__profile--detail-section-heading">My Profile</h3>
                            <div class="__flex">
                                <span
                                    class="user-profile-card__change-password-link linkify"
                                    @click="openChangePasswordModal"
                                    >Change Password</span
                                >
                                <span class="user-profile-card__edit-link linkify" @click="openEditProfileDetailsModal"
                                    >Edit</span
                                >
                            </div>
                        </div>
                        <div class="user-profile-card__content">
                            <div class="user-profile-card__name-phone-number-section">
                                <div class="user-profile-card__profile-detail-section">
                                    <label class="user-profile-card__profile-details-label">Name</label>
                                    <p class="user-profile-card__profile-details-text">{{ fullName }}</p>
                                </div>
                                <div class="user-profile-card__profile-detail-section">
                                    <label class="user-profile-card__profile-details-label">Phone Number</label>
                                    <p class="user-profile-card__profile-details-text">{{ user.phoneNumber }}</p>
                                </div>
                            </div>
                            <div class="user-profile-card__email-section">
                                <div class="user-profile-card__profile-detail-section">
                                    <label class="user-profile-card__profile-details-label">Email</label>
                                    <p class="user-profile-card__profile-details-text">{{ user.email }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="user-profile-card__business-details-loader-container"
                        v-if="showBusinessReequestStatusLoader"
                    >
                        <Loader size="4" />
                    </div>
                    <div class="user-profile-card" v-if="showBusinessSection">
                        <div>
                            <div class="user-profile-card__first-layout">
                                <h3 class="user-profile-card__profile--detail-section-heading">Businesses</h3>
                                <!--div class="__flex">
                                <AddNewEntityWithPlusIconButton
                                    buttonText="Add Business"
                                    :icon="require('@/assets/img/plus-button-light-blue.svg')"
                                    :disabled="true"
                                    @button-clicked="openAddBusinessModal"
                                />
                            </div-->
                            </div>
                            <div class="user-profile-card__business-cards">
                                <div v-for="(business, index) in businesses" :key="index">
                                    <AppBusinessCard
                                        :businessDetail="business"
                                        @open-business-profile-page="showBusinessProfilePage"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>

        <ChangePasswordModal
            v-if="showChangePasswordModal"
            id="change-password-modal"
            :passwordIsValidated="passwordIsValidated"
            @hide-change-password-modal="hideChangePasswordModal"
            @otp-verification-is-required="displayOTPVerificationModal"
            @password-validated="setPasswordValidation(true)"
            @reset-password-validation="setPasswordValidation(false)"
        />
        <EditProfileDetailsModal
            v-if="showEditProfileDetailsModal"
            id="edit-profile-details-modal"
            :fetchedUser="user"
            :userKey="authenticatedUser.nameid"
            @set-profile-details-edit-mode="setProfileDetailsEditMode"
            @hide-edit-profile-details-modal="hideEditProfileDetailsModal"
            @show-profile-details-toaster="showProfileDetailsAdditionToaster"
        />
        <ChangePasswordSuccessModal
            v-if="showChangePasswordSuccessModal"
            id="change-password-success-modal"
            @hide-change-password-success-modal="hideChangePasswordSuccessModal"
        />
        <OTPVerificationModal
            id="otp-verification-modal"
            @hide-otp-verification-modal="hideOTPVerificationModal"
            @password-change-is-successful="handleSuccessfulOTPVerification"
        />
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
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import AppBusinessCard from '@/pages/Settings/UserProfile/AppBusinessCard.vue';
import BusinessProfilePage from '@/pages/Settings/BusinessProfilePage.vue';
import ChangePasswordModal from '@/pages/Settings/UserProfile/MediumPlus/ChangePasswordModal.vue';
import EditProfileDetailsModal from '@/pages/Settings/UserProfile/MediumPlus/EditProfileDetailsModal.vue';
import ChangePasswordSuccessModal from '@/pages/Settings/UserProfile/MediumPlus/ChangePasswordSuccessModal.vue';
import OTPVerificationModal from '@/pages/Settings/UserProfile/MediumPlus/OTPVerificationModal.vue';

import UtilityMixins from '@/mixins/Utility';
import SettingsMixin from '@/pages/Settings/mixins';

import AuthModule from '@/store/modules/auth';
import BusinessModule from '@/store/modules/business';

import { UserProfileBusiness, defalutBusinesssProfile } from '@/pages/Settings/types';

import {
    BusinessData,
    BusinessRequestStatus,
    CompanyInfo,
    Status,
    ToasterObject,
    Token,
    tokenDefaultValue,
} from '@/types';

let authModule: AuthModule;

let businessModule: BusinessModule;
const business = namespace('business');

const companyDefault: CompanyInfo = {
    logo: '',
    address: '',
};
@Component({
    components: {
        AppBusinessCard,
        BusinessProfilePage,
        ChangePasswordModal,
        ChangePasswordSuccessModal,
        OTPVerificationModal,
        EditProfileDetailsModal,
    },
})
export default class UserProfileIndexMediumPlus extends Mixins(UtilityMixins, SettingsMixin) {
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    @Prop({ default: () => tokenDefaultValue }) readonly authenticatedUser!: Token;

    @business.State
    public businessInfo!: BusinessData;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    @business.Action
    public getBusinessDetails!: () => void;

    private showChangePasswordSuccessModal = false;
    private showChangePasswordModal = false;
    private otp = false;
    private showEditProfileDetailsModal = false;
    private isEditMode = false;
    public isBusinessEditMode = false;
    private isProfileDetailsEditMode = false;
    private isNewBusinessAddition = true;
    private passwordIsValidated = false;
    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'user-profile-index-toaster',
        position: 'b-toaster-top-center',
    };

    private businessDetails = { ...defalutBusinesssProfile };

    private businesses: Array<UserProfileBusiness> = [
        {
            ...defalutBusinesssProfile,
        },
    ];

    private showBusinessProfile = false;

    get showBusinessReequestStatusLoader() {
        return (
            this.businessRequestStatus.getBusinessDetails === Status.LOADING &&
            this.userProfileStatus.fetchUserProfile !== Status.LOADING
        );
    }

    get showBusinessSection() {
        return (
            this.businessRequestStatus.getBusinessDetails !== Status.LOADING &&
            this.userProfileStatus.fetchUserProfile !== Status.LOADING
        );
    }

    get pageTitle(): string {
        return this.showBusinessProfile ? 'Business Profile' : 'User Profile';
    }

    private openAddBusinessModal() {
        this.businessDetails = { ...defalutBusinesssProfile };
        this.isBusinessEditMode = true;
        this.isNewBusinessAddition = true;
        this.$nextTick(() => {
            this.displayModal('business-profile-page');
        });
    }

    private showBusinessProfilePage(business: UserProfileBusiness) {
        this.businessDetails = business;

        this.isBusinessEditMode = false;
        this.isNewBusinessAddition = false;
        this.showBusinessProfile = true;
    }

    private hideAddBusinessModal() {
        this.isBusinessEditMode = false;
        this.$nextTick(() => {
            this.cancelModal('business-profile-page');
        });
    }

    private showProfileDetailsAdditionToaster(toasterObject: ToasterObject) {
        this.showToaster(toasterObject);
    }

    private showBusinessAdditionToaster(toasterObject: ToasterObject) {
        this.showToaster(toasterObject);
    }

    private openChangePasswordModal() {
        this.showChangePasswordModal = true;
    }

    private hideChangePasswordModal() {
        this.showChangePasswordModal = false;
    }

    private openEditProfileDetailsModal() {
        this.showEditProfileDetailsModal = true;
    }

    private hideEditProfileDetailsModal() {
        this.showEditProfileDetailsModal = false;
    }

    private setBusinessEditMode(value: boolean) {
        this.isBusinessEditMode = value;
    }

    private setProfileDetailsEditMode(value: boolean) {
        this.isProfileDetailsEditMode = value;
    }

    private displayOTPVerificationModal() {
        this.showChangePasswordModal = false;

        this.$nextTick(() => {
            this.displayModal('otp-verification-modal');
        });
    }

    private hideOTPVerificationModal() {
        this.cancelModal('otp-verification-modal');
    }

    private hideChangePasswordSuccessModal() {
        this.showChangePasswordSuccessModal = false;
    }

    private handleSuccessfulOTPVerification() {
        this.cancelModal('otp-verification-modal');
        this.$nextTick(() => {
            this.showChangePasswordSuccessModal = true;
        });
    }

    private setPasswordValidation(isValidated: boolean) {
        this.passwordIsValidated = isValidated;
    }

    private assignModules() {
        authModule = getModule(AuthModule, this.$store);
        businessModule = getModule(BusinessModule, this.$store);
    }

    private async fetchBusinessInfo() {
        await businessModule.getBusinessDetails();
        if (this.businessRequestStatus.getBusinessDetails === Status.SUCCESS) {
            this.setBusinessInfo();
        }
    }

    private async fetchUserInfo() {
        await authModule.fetchUserProfile(this.authenticatedUser.nameid);
        if (this.userProfileStatus.fetchUserProfile === Status.SUCCESS) {
            this.setUserInfo();
        }
    }

    private setBusinessInfo() {
        // this implementation will be used to fetch only one business until the endpoint for getting all businesses is ready
        // after the implementation of getting all user businesses is ready, this implementation will be removed
        this.businesses = [
            {
                name: this.businessInfo.name,
                rc: this.businessInfo.rcNumber,
                phone: this.businessInfo.phoneNumber,
                type: this.businessInfo.businessRegistrationType,
                email: this.businessInfo.email,
                industry: this.businessInfo.businessVertical,
                country: this.businessInfo.country,
                state: this.businessInfo.state,
                council: this.businessInfo.lga,
                address: this.businessInfo.address,
                businessKey: this.businessInfo.businessKey,
                industryName: this.authenticatedUser.businessVerticalName,
            },
        ];

        this.businessDetails = {
            name: this.businessInfo.name,
            rc: this.businessInfo.rcNumber,
            phone: this.businessInfo.phoneNumber,
            type: this.businessInfo.businessRegistrationType,
            email: this.businessInfo.email,
            industry: this.businessInfo.businessVertical,
            country: this.businessInfo.country,
            state: this.businessInfo.state,
            council: this.businessInfo.lga,
            address: this.businessInfo.address,
            businessKey: this.businessInfo.businessKey,
        };
    }

    private setUserInfo() {
        this.user = {
            firstName: this.userProfile.firstName,
            lastName: this.userProfile.lastName,
            email: this.userProfile.email,
            phoneNumber: this.userProfile.phoneNumber,
        };
    }

    private goToUserProfilePage() {
        this.showBusinessProfile = false;
    }

    mounted() {
        this.assignModules();
        this.fetchUserInfo();
        this.fetchBusinessInfo();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/mp-index.scss';
</style>
