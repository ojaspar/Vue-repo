<template>
    <b-container fluid class="personal-details">
        <b-row>
            <b-col>
                <div class="personal-details__container">
                    <img src="@/assets/img/mzuri-logo.svg" class="personal-details__logo" />

                    <ProgressTracker v-if="!$root.isMobileScreenSize" :activeComponentIndex="activeComponentIndex" />

                    <div class="personal-details__medium-plus-container">
                        <h1 class="personal-details__heading-primary">Personal Details</h1>
                        <p class="personal-details__heading-secondary">Kindly enter your personal details</p>

                        <div class="personal-details__block-message-container">
                            <BlockErrorMessage :message="signupError.personalDetails" />
                        </div>

                        <div class="personal-details__input-field-container-medium-plus">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="First Name"
                                v-model="form.firstName"
                                :className="[
                                    hasError(signupFormErrors.firstName) ? 'error' : '',
                                    'personal-details__input-field',
                                ]"
                                :errors="signupFormErrors.firstName"
                                :required="true"
                                @input="validateEmptyInput('firstName', form.firstName, signupFormErrors)"
                            />

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Last Name"
                                v-model="form.lastName"
                                :className="[
                                    hasError(signupFormErrors.lastName) ? 'error' : '',
                                    'personal-details__input-field',
                                ]"
                                :errors="signupFormErrors.lastName"
                                id="signup-last-name"
                                :required="true"
                                @input="validateEmptyInput('lastName', form.lastName, signupFormErrors)"
                            />
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Email Address"
                                type="email"
                                v-model="form.email"
                                :className="[
                                    hasError(signupFormErrors.email) ? 'error' : '',
                                    'personal-details__input-field',
                                ]"
                                :errors="signupFormErrors.email"
                                id="signup-email"
                                :required="true"
                                disabled="true"
                                @input="validateEmail(form.email, signupFormErrors)"
                            />
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Password"
                                :type="inputType"
                                v-model="form.password"
                                :errors="signupFormErrors.password"
                                :className="[
                                    hasError(signupFormErrors.password) ? 'error' : '',
                                    'personal-details__input-field',
                                ]"
                                :required="true"
                                @input="validatePassword"
                            />

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Confirm Password"
                                type="password"
                                :className="[
                                    hasError(signupFormErrors.confirmPassword) ? 'error' : '',
                                    'personal-details__input-field',
                                ]"
                                :errors="signupFormErrors.confirmPassword"
                                v-model="form.confirmPassword"
                                :required="true"
                                @input="validateConfirmPassword"
                            />
                        </div>

                        <BasePrimaryButton
                            buttonText="Next"
                            :overRideButtonClass="true"
                            className="personal-details__button"
                            @button-clicked="handleSignupFormSubmission"
                            :disabled="buttonIsDisabled(status, signupFormErrors)"
                            :status="accountCreationStatus"
                        />
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import ValidationMixin from '@/mixins/validation.ts';
import PasswordMixin from '@/mixins/Password.ts';
import UtilityMixins from '@/mixins/Utility';
import SignupMixin from '@/pages/Signup/SignupMixin';

import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ProgressTracker from '@/components/ui/ProgressTracker.vue';

import AuthModule from '@/store/modules/auth.ts';

import { validatePassword, validateConfirmPassword, validateBiodataSection } from '@/utils/formValidator.ts';

import { Status, BioDataFields, PasswordFormProperty, Toaster } from '@/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component({
    components: {
        ProgressTracker,
    },
})
export default class PersonalDetails extends Mixins(ValidationMixin, PasswordMixin, UtilityMixins, SignupMixin) {
    private form = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    };

    private signupFormErrors = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'signup-biodata-toaster',
    };

    @Prop({ default: false }) readonly status!: string;
    @Prop() readonly progress!: number;
    @Prop({ default: () => ({}) }) readonly bioDataFields!: BioDataFields;
    @Prop({ default: true }) readonly forDefaultCreatePassword!: boolean;
    @Prop({ default: -1 }) readonly activeComponentIndex!: number;

    public handleSignupFormSubmission() {
        this.signupFormErrors = validateBiodataSection(this.form);
        const { firstName, lastName, email, password, confirmPassword } = this.form;
        const { phoneNumber } = this.bioDataFields;

        if (!this.formHasError(this.signupFormErrors)) {
            const bioData = { firstName, lastName, email, password, confirmPassword, phoneNumber };
            this.createUserAccount(bioData);
        }
    }

    @auth.State
    private accountCreationStatus!: string;

    get requestStatus() {
        return this.forDefaultCreatePassword ? this.accountCreationStatus : this.status;
    }

    get formProps(): PasswordFormProperty {
        if (this.forDefaultCreatePassword) {
            return {
                title: 'Welcome',
                subTitle: 'Please create your Password',
                buttonText: 'Continue',
                routerLinkText: 'Have an account?',
            };
        }
        return {
            title: 'Reset Password',
            subTitle: 'Kindly ensure that your new password is different from the previously used passwords.',
            buttonText: 'Reset',
            routerLinkText: 'Back to',
        };
    }

    private validatePassword() {
        this.signupFormErrors.password = validatePassword(this.form.password);
    }

    private validateConfirmPassword() {
        this.signupFormErrors.confirmPassword = validateConfirmPassword(this.form.password, this.form.confirmPassword);
    }

    private async createUserAccount(userAccountInfo: BioDataFields) {
        await authModule.createUserAccount(userAccountInfo);
        if (this.accountCreationStatus === Status.SUCCESS) {
            this.$router.push('/business-setup');
        }
    }

    created() {
        authModule = getModule(AuthModule, this.$store);
    }

    mounted() {
        // pre-load email in the personal details form
        this.form.email = this.bioDataFields.email;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth/personal-details.scss';
</style>
