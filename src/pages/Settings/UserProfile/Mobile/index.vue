<template>
    <transition name="slide-up-fade" mode="out-in" appear>
        <component
            :is="componentList[activeComponentIndex]"
            @set-business-edit-mode="setBusinessEditMode"
            @home-submenu-clicked="handleHomeSubmenuClick"
            @otp-verification-is-required="goToOTPVerificationPage"
            @password-change-is-successful="handleSuccessfulPasswordChange"
            @continue-to-user-profile-home-page="continueToHomePage"
            @set-business="setBusiness"
            @add-business-button-clicked="openAddBusinessForm"
            @set-profile-details-edit-mode="setProfileDetailsEditMode"
            @password-validated="setPasswordValidation(true)"
            @reset-password-validation="setPasswordValidation(false)"
            @back-to-profile-page="handleGoBack"
            :businessDetails="businessDetails"
            :isBusinessEditMode="isBusinessEditMode"
            :isNewBusinessAddition="isNewBusinessAddition"
            :isProfileDetailsEditMode="isProfileDetailsEditMode"
            :companyInfo="companyInfo"
            :authenticatedUser="authenticatedUser"
            :passwordIsValidated="passwordIsValidated"
        />
    </transition>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import UserProfileMobileHome from '@/pages/Settings/UserProfile/Mobile/Home.vue';
import ProfileDetails from '@/pages/Settings/UserProfile/Mobile/ProfileDetails.vue';
import ChangePassword from '@/pages/Settings/UserProfile/Mobile/ChangePassword.vue';
import ChangePasswordSuccess from '@/pages/Settings/UserProfile/Mobile/ChangePasswordSuccess.vue';
import BusinessProfilePage from '@/pages/Settings/BusinessProfilePage.vue';
import ShowBusinesses from '@/pages/Settings/UserProfile/Mobile/ShowBusinesses.vue';
import OTPVerification from '@/pages/Settings/UserProfile/Mobile/OTPVerification.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';

import { LeftIcon, CompanyInfo, Token, tokenDefaultValue } from '@/types';
import { UserProfileBusiness, defalutBusinesssProfile } from '@/pages/Settings/types';

import GeneralModule from '@/store/modules/general';

const general = namespace('general');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let generalModule: GeneralModule;

const companyDefault: CompanyInfo = {
    logo: '',
    address: '',
};

@Component({
    components: {
        UserProfileMobileHome,
        ProfileDetails,
        ChangePassword,
    },
})
export default class UserProfileMobileIndex extends Mixins(DynamicComponentMixin) {
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    @Prop({ default: () => tokenDefaultValue }) readonly authenticatedUser!: Token;

    private componentList = [
        UserProfileMobileHome,
        ProfileDetails,
        ChangePassword,
        ShowBusinesses,
        ChangePasswordSuccess,
        BusinessProfilePage,
        OTPVerification,
    ];
    private leftIcon = LeftIcon.None;

    private pageTitles = [
        'Settings',
        'My Profile',
        'Change Password',
        'Businesses',
        'Password Changed',
        'Business Details',
        'Verify OTP',
    ];

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCancelButtonClicked!: boolean;

    get pageTitle(): string {
        return this.pageTitles[this.activeComponentIndex];
    }

    @Watch('activeComponentIndex')
    activeComponentChanged() {
        switch (this.activeComponentIndex) {
            case 0:
                this.leftIcon = LeftIcon.Hamburger;
                break;
            case 2:
            case 4:
            case 6:
                this.leftIcon = LeftIcon.Cancel;
                break;
            case 1:
            case 3:
            case 5:
                this.leftIcon = LeftIcon.Back;
                break;
            default:
                this.leftIcon = LeftIcon.Hamburger;
        }
    }

    @Watch('pageTitle')
    pageTitleChanged() {
        this.$parent.$parent.$emit('update-page-title', this.pageTitle);
    }

    @Watch('leftIcon')
    leftIconChanged() {
        this.$parent.$parent.$emit('set-left-icon', this.leftIcon);
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileBackButtonState(false);
    }

    @Watch('mobileCancelButtonClicked')
    watchMobileCancelButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileCancelButtonState(false);
    }

    private handleGoBack() {
        switch (this.activeComponentIndex) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.goToHomePage();
                break;
            case 5:
                this.goToViewBusinesses();
                break;
            case 6:
                this.goToChangePasswordPage();
                break;
            default:
                break;
        }
    }

    private isBusinessEditMode = false;

    private isNewBusinessAddition = false;

    private isProfileDetailsEditMode = false;

    private passwordIsValidated = false;

    private businessDetails = { ...defalutBusinesssProfile };

    private handleHomeSubmenuClick(indexOfComponent: number): void {
        this.setActiveComponentIndex(indexOfComponent);
    }

    private goToHomePage(): void {
        this.setActiveComponentIndex(0);
    }

    private goToChangePasswordPage(): void {
        this.setActiveComponentIndex(2);
    }

    private goToViewBusinesses(): void {
        this.setActiveComponentIndex(3);
    }

    private goToPasswordSuccessPage(): void {
        this.setActiveComponentIndex(4);
    }

    private goToBusinessDetailsPage(): void {
        this.setActiveComponentIndex(5);
    }

    private goToOTPVerificationPage(): void {
        this.setActiveComponentIndex(6);
    }

    private goToAddBusinessForm(): void {
        // both business details page adnd add or edit business form share the same component
        this.setActiveComponentIndex(5);
    }

    private handleSuccessfulPasswordChange(): void {
        this.goToPasswordSuccessPage();
    }

    private continueToHomePage() {
        this.goToHomePage();
    }

    private openAddBusinessForm() {
        this.businessDetails = { ...defalutBusinesssProfile };
        this.isBusinessEditMode = true;
        this.isNewBusinessAddition = true;

        this.$nextTick(() => {
            this.goToAddBusinessForm();
        });
    }

    private setBusiness(business: UserProfileBusiness) {
        this.businessDetails = business;

        this.isBusinessEditMode = false;
        this.isNewBusinessAddition = false;

        this.$nextTick(() => {
            this.goToBusinessDetailsPage();
        });
    }

    private setBusinessEditMode(value: boolean) {
        this.isBusinessEditMode = value;
    }

    private setProfileDetailsEditMode(value: boolean) {
        this.isProfileDetailsEditMode = value;
    }

    private setPasswordValidation(isValidated: boolean) {
        this.passwordIsValidated = isValidated;
    }

    mounted() {
        generalModule = getModule(GeneralModule, this.$store);
        this.pageTitleChanged();
    }
}
</script>

<style lang="scss"></style>
