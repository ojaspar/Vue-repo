<template>
    <b-container fluid class="add-user">
        <b-row>
            <b-col>
                <div class="add-user__container">
                    <div
                        v-if="isEditing && userProfileStatus.fetchUserProfile === 'LOADING'"
                        class="add-user__loader-container"
                    >
                        <Loader size="4" />
                    </div>
                    <form class="add-user__medium-plus-container" v-else>
                        <h1 class="add-user__heading-primary">{{ headingPrimaryText }}</h1>
                        <p class="add-user__heading-secondary">{{ headingSecondaryText }}</p>

                        <div class="add-user__input-field-container-medium-plus">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="First Name"
                                v-model="form.firstName"
                                :className="[hasError(formErrors.firstName) ? 'error' : '', 'add-user__input-field']"
                                :errors="formErrors.firstName"
                                :required="true"
                                @input="validateBusinessUserFirstName"
                            />

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Last Name"
                                v-model="form.lastName"
                                :className="[hasError(formErrors.lastName) ? 'error' : '', 'add-user__input-field']"
                                :errors="formErrors.lastName"
                                :required="true"
                                @input="validateBusinessUserLastName"
                            />
                            <BaseInputFieldWithBorderAndFloatingLabel
                                type="number"
                                v-model="form.phoneNumber"
                                :className="[hasError(formErrors.phoneNumber) ? 'error' : '', 'add-user__input-field']"
                                :errors="formErrors.phoneNumber"
                                floatingLabelText="Phone Number"
                                :required="true"
                                @input="validateBusinessUserPhoneNumber"
                            />
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Email Address"
                                type="email"
                                v-model="form.email"
                                :className="[hasError(formErrors.email) ? 'error' : '', 'add-user__input-field']"
                                :errors="formErrors.email"
                                :required="true"
                                @input="validateBusinessUserEmail"
                            />
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Password"
                                type="password"
                                v-model="form.password"
                                :className="[hasError(formErrors.password) ? 'error' : '', 'add-user__input-field']"
                                :errors="formErrors.password"
                                :required="true"
                                @input="validateBusinessUserPassword"
                                v-if="!isEditing"
                            />
                        </div>

                        <BasePrimaryButton
                            :buttonText="buttonText"
                            :overRideButtonClass="true"
                            className="add-user__button"
                            @button-clicked="handleAdditionOfNewUser"
                            :disabled="conditionsForButtonToBeDisabled"
                            :status="buttonStatus"
                        />
                    </form>
                </div>
            </b-col>
            <Toaster
                :title="toaster.title"
                :messageBody="toaster.message"
                :toaster="toaster.position"
                :variant="toaster.type"
                :id="toaster.id"
            />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ValidationMixin from '@/mixins/validation.ts';
import UtilityMixins from '@/mixins/Utility';
import SettingsMixin from './mixins';

import AuthModule from '@/store/modules/auth';

import { AuthRequestStatus, Status, Toaster } from '@/types';

import { AddBusinessUserPayload, UserProfileStatus } from '@/pages/Settings/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class AddOrEditUser extends Mixins(ValidationMixin, UtilityMixins, SettingsMixin) {
    @Prop({ default: false }) readonly isEditing!: boolean;
    private initialStateOfForm: AddBusinessUserPayload = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
    };

    private form = { ...this.initialStateOfForm };

    private formErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
    };

    private businessUserKey = '';

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'add-user-toaster',
    };

    get headingPrimaryText() {
        return this.isEditing ? 'User Details' : 'New  User Details';
    }

    get headingSecondaryText() {
        return this.isEditing ? 'Kindly enter the new details of the user' : 'Kindly enter the details of the new user';
    }

    get buttonText() {
        return this.isEditing ? 'Save' : 'Add User';
    }

    get buttonStatus() {
        if (this.isEditing) {
            return this.authRequestStatus.editUserProfile;
        }
        return this.authRequestStatus.addBusinessUser;
    }

    private validateBusinessUserFirstName() {
        this.validateEmptyInput('firstName', this.form.firstName, this.formErrors);
    }

    private validateBusinessUserLastName() {
        this.validateEmptyInput('lastName', this.form.lastName, this.formErrors);
    }

    private validateBusinessUserPhoneNumber() {
        this.validatePhoneNumber(this.form.phoneNumber, this.formErrors);
    }

    private validateBusinessUserEmail() {
        this.validateEmail(this.form.email, this.formErrors);
    }

    private validateBusinessUserPassword() {
        this.validateEmptyInput('password', this.form.password, this.formErrors);
    }

    private validateAddNewUserFields() {
        this.validateBusinessUserFirstName();
        this.validateBusinessUserLastName();
        this.validateBusinessUserPhoneNumber();
        this.validateBusinessUserEmail();
        this.validateBusinessUserPassword();
    }

    private validateEditUserFields() {
        this.validateBusinessUserFirstName();
        this.validateBusinessUserLastName();
        this.validateBusinessUserPhoneNumber();
        this.validateBusinessUserEmail();
    }

    public async sequenceOfEventsIfNotEditing() {
        await authModule.addBusinessUser(this.form);
        if (this.authRequestStatus.addBusinessUser === Status.SUCCESS) {
            this.$router.push({ name: 'ViewUsers' });
        } else {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'There was an error creating a new user',
            });
        }
    }

    public showUpdateUserErrorMessage() {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: "There was an error updating the user's profile",
        });
    }

    public async sequenceOfEventsIfIsEditing() {
        await authModule.editUserProfile({ updatedUserCredentials: this.form, userKey: this.businessUserKey });
        if (this.authRequestStatus.editUserProfile === Status.SUCCESS) {
            await authModule.verifyUserProfileUpdate({
                userKey: this.businessUserKey,
                token: this.verifyUserProfileUpdateToken,
            });
            if (this.authRequestStatus.verifyUserProfileUpdate === Status.SUCCESS) {
                this.$router.push({ name: 'ViewUsers' });
            } else {
                this.showUpdateUserErrorMessage();
            }
        } else {
            this.showUpdateUserErrorMessage();
        }
    }

    public async handleAdditionOfNewUser() {
        if (this.isEditing) {
            this.validateEditUserFields();
            if (!this.formHasError(this.formErrors)) {
                await this.sequenceOfEventsIfIsEditing();
            }
        } else {
            this.validateAddNewUserFields();
            if (!this.formHasError(this.formErrors)) {
                await this.sequenceOfEventsIfNotEditing();
            }
        }
    }

    @auth.State
    public userProfileStatus!: UserProfileStatus;

    @auth.State
    private error!: string;

    @auth.State
    public errorCode!: number;

    @auth.State
    public authRequestStatus!: AuthRequestStatus;

    @auth.Action
    public addBusinessUser!: (UserCredentials: AddBusinessUserPayload) => void;

    get errorExists() {
        return this.atLeastOneErrorExists(this.formErrors);
    }
    get conditionsForButtonToBeDisabled() {
        return (
            this.atLeastOneErrorExists(this.formErrors) ||
            this.authRequestStatus.addBusinessUser === Status.LOADING ||
            this.authRequestStatus.editUserProfile === Status.LOADING
        );
    }

    async created() {
        authModule = getModule(AuthModule, this.$store);
        this.businessUserKey = this.$route.params.userKey;

        if (this.isEditing) {
            await authModule.fetchUserProfile(this.businessUserKey);

            if (this.userProfileStatus.fetchUserProfile === Status.SUCCESS) {
                this.form = {
                    firstName: this.userProfile.firstName,
                    lastName: this.userProfile.lastName,
                    phoneNumber: this.userProfile.phoneNumber,
                    email: this.userProfile.email,
                    password: '',
                };
            }
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/add-user.scss';
</style>
