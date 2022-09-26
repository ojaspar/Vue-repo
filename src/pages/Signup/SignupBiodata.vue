<template>
    <div>
        <div class="auth-form d-flex flex-column justify-content-between">
            <div class="text">
                <div>
                    <p class="auth-form__title mb-1">Welcome</p>
                    <ProgressBar :progress="progress" />
                    <p class="auth-form__sub-title">Sign up and continue</p>
                </div>
            </div>

            <div class="form-input">
                <BaseInputFieldAuth
                    v-model="form.firstName"
                    :className="[hasError(signupFormErrors.firstName) ? 'error' : '', 'auth-form__input']"
                    :errors="signupFormErrors.firstName"
                    floatingLabelText="First Name"
                    :required="true"
                    id="signup-first-name"
                    @input="validateEmptyInput('firstName', form.firstName, signupFormErrors)"
                />

                <BaseInputFieldAuth
                    v-model="form.lastName"
                    :className="[hasError(signupFormErrors.lastName) ? 'error' : '', 'auth-form__input']"
                    :errors="signupFormErrors.lastName"
                    floatingLabelText="Last Name"
                    id="signup-last-name"
                    :required="true"
                    @input="validateEmptyInput('lastName', form.lastName, signupFormErrors)"
                />

                <BaseInputFieldAuth
                    type="email"
                    v-model="form.email"
                    :className="[hasError(signupFormErrors.email) ? 'error' : '', 'auth-form__input']"
                    :errors="signupFormErrors.email"
                    floatingLabelText="Email Address"
                    id="signup-email"
                    :required="true"
                    @input="validateEmail(form.email, signupFormErrors)"
                />

                <BaseInputFieldAuth
                    :type="inputType"
                    floatingLabelText="Password"
                    v-model="form.password"
                    :errors="signupFormErrors.password"
                    :className="[hasError(signupFormErrors.password) ? 'error' : '', 'auth-form__input col-12']"
                    :required="true"
                    @input="validatePassword"
                />

                <BaseInputFieldAuth
                    type="password"
                    :className="[hasError(signupFormErrors.confirmPassword) ? 'error' : '', 'auth-form__input']"
                    :errors="signupFormErrors.confirmPassword"
                    floatingLabelText="Confirm Password"
                    v-model="form.confirmPassword"
                    :required="true"
                    @input="validateConfirmPassword"
                />
            </div>

            <div class="auth-form__form-footer d-flex flex-column align-items-center mt-3">
                <BaseButton
                    className="uppercase auth-form__btn"
                    @button-clicked="handleSignupFormSubmission"
                    :disabled="buttonIsDisabled(status, signupFormErrors)"
                    :status="accountCreationStatus"
                    buttonText="Sign Up"
                />

                <p class="auth-form__meta mt-3">
                    Have an account?
                    <router-link to="/login"><span class="text-warning pointer">Login</span></router-link>
                </p>
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
import { Component, Prop, Mixins } from 'vue-property-decorator';

import ValidationMixin from '@/mixins/validation.ts';
import PasswordMixin from '@/mixins/Password.ts';
import UtilityMixins from '@/mixins/Utility';

import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth.ts';

import { validatePassword, validateConfirmPassword, validateBiodataSection } from '@/utils/formValidator.ts';

import { Status, BioDataFields, PasswordFormProperty, Toaster } from '@/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class SignupForm extends Mixins(ValidationMixin, PasswordMixin, UtilityMixins) {
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

    @Prop({ required: true }) readonly status!: string;
    @Prop() readonly progress!: number;
    @Prop({ default: () => ({}) }) readonly bioDataFields!: BioDataFields;
    @Prop({ default: true }) readonly forDefaultCreatePassword!: boolean;

    public handleSignupFormSubmission() {
        this.signupFormErrors = validateBiodataSection(this.form);
        const { firstName, lastName, email, password, confirmPassword } = this.form;
        // if (this.isDuplicateAccountSession) {
        //     this.handleDuplicateAccountSession(email);
        // }
        if (!this.formHasError(this.signupFormErrors)) {
            const bioData = { firstName, lastName, email, password, confirmPassword };
            this.$emit('bio-data-section-completed', bioData);
            this.$nextTick(async () => {
                // after biodata information has been updated, create user account
                this.createUserAccount(this.bioDataFields);
            });
        }
    }

    @auth.State
    private accountCreationStatus!: string;

    @auth.State
    private error!: string;

    @auth.State
    private errorCode!: number;

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
        if (this.accountCreationStatus === Status.ERROR) {
            this.handleAcountCreationError();
        }
    }

    private handleAcountCreationError() {
        if (this.errorCode === 600) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'The email is already in use',
            });
        }
    }

    created() {
        authModule = getModule(AuthModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth.scss';
</style>
