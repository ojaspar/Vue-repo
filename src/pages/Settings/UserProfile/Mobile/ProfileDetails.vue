<template>
    <div>
        <div class="profile-details-m__loader-container">
            <Loader v-if="userProfileStatus.fetchUserProfile === 'LOADING'" size="4" />
        </div>
        <div v-if="!isProfileDetailsEditMode && userProfileStatus.fetchUserProfile !== 'LOADING'">
            <div class="profile-details-m__field-div">
                <p class="profile-details-m__field-label">Name</p>
                <p class="profile-details-m__field-value">{{ fullName }}</p>
            </div>
            <div class="profile-details-m__field-div">
                <p class="profile-details-m__field-label">Email</p>
                <p class="profile-details-m__field-value">{{ user.email }}</p>
            </div>
            <div class="profile-details-m__field-div">
                <p class="profile-details-m__field-label">Phone Number</p>
                <p class="profile-details-m__field-value">{{ user.phoneNumber }}</p>
            </div>
        </div>
        <div v-if="isProfileDetailsEditMode">
            <BaseInputFieldWithBorderAndFloatingLabel
                type="text"
                floatingLabelText="First Name"
                v-model="user.firstName"
                @input="validateFirstName"
                :errors="profileDetailsErrors.firstName"
            />

            <BaseInputFieldWithBorderAndFloatingLabel
                type="text"
                floatingLabelText="Last Name"
                v-model="user.lastName"
                @input="validateLastName"
                :errors="profileDetailsErrors.lastName"
            />

            <BaseInputFieldWithBorderAndFloatingLabel
                type="email"
                floatingLabelText="Email"
                v-model="user.email"
                @input="validateUserEmail"
                :errors="profileDetailsErrors.email"
            />

            <BaseInputFieldWithBorderAndFloatingLabel
                type="number"
                floatingLabelText="Phone Number"
                v-model="user.phoneNumber"
                @input="validateUserPhoneNumber"
                :errors="profileDetailsErrors.phoneNumber"
            />
        </div>

        <div class="modal-bnt-layout" v-if="userProfileStatus.fetchUserProfile !== 'LOADING'">
            <BaseButton
                className="button"
                :overRideButtonClass="true"
                @button-clicked="handleButtonClick"
                :disabled="conditionsForButtonToBeDisabled"
                :status="authRequestStatus.editUserProfile"
            >
                {{ isProfileDetailsEditMode ? 'Save' : 'Edit' }}
            </BaseButton>
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
import { Prop, Component, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import AuthModule from '@/store/modules/auth.ts';

import { Status, Toaster, Token, AuthRequestStatus, tokenDefaultValue } from '@/types';

import SettingsMixin from '@/pages/Settings/mixins';
import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class EditProfileDetailsMobile extends Mixins(SettingsMixin, ValidationMixin, UtilityMixins) {
    @Prop({ default: false }) readonly isProfileDetailsEditMode!: boolean;
    @Prop({ default: () => tokenDefaultValue }) readonly authenticatedUser!: Token;

    @auth.State
    public error!: string;

    @auth.State
    public authRequestStatus!: AuthRequestStatus;

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'user-profile-details-toaster',
    };

    private businessUserKey = '';

    private setProfileEditMode(isEditMode = true) {
        if (!isEditMode) {
            this.$emit('set-profile-details-edit-mode', false);
            return;
        }
        this.$emit('set-profile-details-edit-mode', true);
    }

    private handleButtonClick() {
        if (!this.isProfileDetailsEditMode) {
            // if not editable, when the edit button is clicked, make it editable
            this.setProfileEditMode();
            return;
        }
        this.validateUserProfileDetailsPage();
        if (this.atLeastOneErrorExists(this.profileDetailsErrors)) return;
        this.updateProfile();
    }

    private async updateProfile() {
        await authModule.editUserProfile({ updatedUserCredentials: this.user, userKey: this.authenticatedUser.nameid });
        if (this.authRequestStatus.editUserProfile === Status.SUCCESS) {
            await authModule.verifyUserProfileUpdate({
                token: this.verifyUserProfileUpdateToken,
                userKey: this.authenticatedUser.nameid,
            });
            if (this.authRequestStatus.verifyUserProfileUpdate === Status.SUCCESS) {
                this.setProfileEditMode(false);
                this.showNotication();
                this.fetchUserDetails();
                return;
            }
            if (this.authRequestStatus.verifyUserProfileUpdate === Status.ERROR) {
                this.showNotication(false);
            }
        }
        if (this.authRequestStatus.editUserProfile === Status.ERROR) {
            this.showNotication(false);
        }
    }

    private showNotication(isSuccess = true) {
        if (!isSuccess) {
            this.toaster.type = 'danger';
            this.toaster.title = 'Error!';
            this.toaster.message = this.error;
            this.showToaster(this.toaster);
            return;
        }

        this.toaster.type = 'success';
        this.toaster.title = 'Success!';
        this.toaster.message = 'You have successfully updated your profile';
        this.showToaster(this.toaster);
        return;
    }

    private prefillUserDetails() {
        this.user = {
            firstName: this.userProfile.firstName,
            lastName: this.userProfile.lastName,
            email: this.userProfile.email,
            phoneNumber: this.userProfile.phoneNumber,
        };
    }

    private assignModule() {
        authModule = getModule(AuthModule, this.$store);
    }

    private async fetchUserDetails() {
        await authModule.fetchUserProfile(this.authenticatedUser.nameid);
        if (this.userProfileStatus.fetchUserProfile === Status.SUCCESS) {
            this.prefillUserDetails();
        }
    }

    mounted() {
        this.assignModule();
        this.fetchUserDetails();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/profile-details-mobile.scss';
</style>

<style lang="scss"></style>
