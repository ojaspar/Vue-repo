<template>
    <b-modal :id="id" no-close-on-backdrop class="edit-profile-details-modal" @hide="hideEditProfileDetailsModal">
        <template v-slot:modal-header="{ cancel }">
            <div class="modal-head-layout">
                <h3 class="white modal-header-text">Edit Profile Details</h3>
            </div>
            <div class="pointer" @click="cancel">
                <font-awesome-icon icon="times" class="white" @click="cancel" />
            </div>
        </template>
        <div>
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
        <template v-slot:modal-footer>
            <div class="modal-bnt-layout">
                <BaseButton
                    v-if="userProfileStatus.fetchUserProfile !== 'LOADING'"
                    className="button"
                    :overRideButtonClass="true"
                    @button-clicked="handleButtonClick"
                    :disabled="conditionsForButtonToBeDisabled"
                    :status="authRequestStatus.editUserProfile"
                    >Save</BaseButton
                >
            </div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import { UserProfile } from '@/pages/Settings/types';
import { AuthRequestStatus, Status } from '@/types';

import SettingsMixin from '@/pages/Settings/mixins';
import AuthModule from '@/store/modules/auth.ts';

const fetchedUserDefault: UserProfile = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
};

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class EditProfileDetailsModal extends Mixins(SettingsMixin) {
    @Prop({ required: true }) readonly id!: string;
    @Prop({ default: () => fetchedUserDefault }) readonly fetchedUser!: UserProfile;
    @Prop({ required: true }) readonly userKey!: string;

    @auth.State
    public error!: string;

    @auth.State
    public authRequestStatus!: AuthRequestStatus;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'user-profile-index-toaster',
        position: 'b-toaster-top-center',
    };

    private hideEditProfileDetailsModal() {
        this.$emit('hide-edit-profile-details-modal');
    }

    private setProfileEditMode(isEditMode = true) {
        if (!isEditMode) {
            this.$emit('set-profile-details-edit-mode', false);
            return;
        }
        this.$emit('set-profile-details-edit-mode', true);
    }

    private handleButtonClick() {
        this.validateUserProfileDetailsPage();
        if (this.atLeastOneErrorExists(this.profileDetailsErrors)) return;
        this.updateProfile();
    }

    private async updateProfile() {
        await authModule.editUserProfile({ updatedUserCredentials: this.user, userKey: this.userKey });
        if (this.authRequestStatus.editUserProfile === Status.SUCCESS) {
            await authModule.verifyUserProfileUpdate({
                token: this.verifyUserProfileUpdateToken,
                userKey: this.userKey,
            });
            if (this.authRequestStatus.verifyUserProfileUpdate === Status.SUCCESS) {
                this.setProfileEditMode(false);
                this.hideEditProfileDetailsModal();
                this.emitTosterObject();
                this.refreshPage();
                return;
            }
            if (this.authRequestStatus.verifyUserProfileUpdate === Status.ERROR) {
                this.emitTosterObject(false);
            }
        }
        if (this.authRequestStatus.editUserProfile === Status.ERROR) {
            this.emitTosterObject(false);
        }
    }

    private emitTosterObject(isSuccess = true) {
        let toasterObject = {};
        if (!isSuccess) {
            toasterObject = {
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: this.error,
            };
            this.$emit('show-profile-details-toaster', toasterObject);
            return;
        }

        toasterObject = {
            ...this.toaster,
            type: 'success',
            title: 'Success!',
            message: 'You have successfully updated your profile',
        };
        this.$emit('show-profile-details-toaster', toasterObject);
        return;
    }

    private refreshPage() {
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    private handleSuccessEvent() {
        this.$emit('set-profile-details-edit-mode', false);
        this.$bvModal.hide(this.id);
    }

    private showProfileModal() {
        this.$bvModal.show(this.id);
        this.user = { ...this.fetchedUser };
    }

    private assignModule() {
        authModule = getModule(AuthModule, this.$store);
    }

    mounted() {
        this.assignModule();
        this.showProfileModal();
    }
}
</script>

<style lang="scss"></style>
