<template>
    <div>
        <Error v-if="generalError" :message="error" />
        <div
            :class="[
                forDefaultCreatePassword ? 'auth-form' : 'content-container',
                'd-flex flex-column justify-content-between',
            ]"
        >
            <div class="text mb-4">
                <div>
                    <p :class="[forDefaultCreatePassword ? '' : 'text-center', 'auth-form__title mb-1']">
                        {{ formProps.title }}
                    </p>
                    <ProgressBar v-if="forDefaultCreatePassword" :progress="progress" />
                    <p class="auth-form__sub-title">
                        {{ formProps.subTitle }}
                    </p>
                </div>
            </div>

            <div class="form-input">
                <div :class="forDefaultCreatePassword ? '' : 'content-container__password-input'">
                    <div class="auth-form__password-section">
                        <BaseInputField
                            :type="inputType"
                            placeholder="Password"
                            labelText="Password"
                            v-model="form.password"
                            inputContainerClass="auth-form__password-section-input-container"
                            :className="[
                                hasError(passwordFormErrors.password) ? 'error' : '',
                                'auth-form__password-section-input col-12',
                            ]"
                            :required="true"
                            @input="validatePassword"
                        />
                        <span
                            v-if="!forDefaultCreatePassword"
                            @click="togglePasswordIcon"
                            class="tx-16 col-1 pointer icon-container"
                        >
                            <span v-if="showPasswordText"
                                ><font-awesome-icon :icon="icon" class="pull-right mb-0"
                            /></span>
                            <span v-else><font-awesome-icon :icon="icon" class="pull-right mb-0"/></span>
                        </span>
                    </div>
                    <p class="parsley-required" v-show="passwordFormErrors.password !== ''">
                        {{ passwordFormErrors.password }}
                    </p>

                    <BaseInputField
                        type="password"
                        :className="[
                            hasError(passwordFormErrors.confirmPassword) ? 'error' : '',
                            'auth-form__input mt-2',
                        ]"
                        :errors="passwordFormErrors.confirmPassword"
                        placeholder="Re-type Password"
                        labelText="Re-type Password"
                        v-model="form.confirmPassword"
                        :required="true"
                        @input="validateConfirmPassword"
                    />
                </div>

                <div class="auth-form__form-footer d-flex flex-column align-items-center mt-3">
                    <BaseButton
                        className="uppercase auth-form__btn"
                        @button-clicked="handleCreatePasswordFormSubmission"
                        :disabled="buttonIsDisabled(requestStatus, passwordFormErrors)"
                        :status="requestStatus"
                        :buttonText="formProps.buttonText"
                    />

                    <p class="auth-form__meta mt-3">
                        {{ formProps.routerLinkText }}
                        <router-link to="/login"><span class="text-warning pointer">Login</span></router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth.ts';
import ValidationMixin from '@/mixins/validation.ts';
import PasswordMixin from '@/mixins/Password.ts';

import {
    validateCreatePasswordSection,
    validatePassword,
    validateConfirmPassword,
    resetFormFields,
} from '@/utils/formValidator.ts';

import { Status, BioDataFields, UserAccountInfo, PasswordFormProperty } from '@/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class CreatePasswordForm extends Mixins(ValidationMixin, PasswordMixin) {
    private form = {
        password: '',
        confirmPassword: '',
    };

    private passwordFormErrors = {
        password: '',
        confirmPassword: '',
    };

    private generalError = false;

    @Prop({ default: Status.NORMAL }) readonly status!: string;
    @Prop({ default: 0 }) readonly progress!: number;
    @Prop({ default: () => ({}) }) readonly bioDataFields!: BioDataFields;
    @Prop({ default: true }) readonly forDefaultCreatePassword!: boolean;

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
        this.passwordFormErrors.password = validatePassword(this.form.password);
    }

    private validateConfirmPassword() {
        this.passwordFormErrors.confirmPassword = validateConfirmPassword(
            this.form.password,
            this.form.confirmPassword,
        );
    }

    private handleCreatePasswordFormSubmission() {
        this.passwordFormErrors = validateCreatePasswordSection(this.form);
        if (this.formHasError(this.passwordFormErrors)) {
            return;
        }
        const { password } = this.form;
        if (!this.forDefaultCreatePassword) {
            this.$emit('password-validated', password);
            return;
        }
        this.processAccountCreation(password);
    }

    private processAccountCreation(password: string) {
        const { firstName, lastName, email, phoneNumber } = this.bioDataFields;
        const userAccountInfo = { firstName, lastName, email, phoneNumber, password };
        this.createUserAccount(userAccountInfo);
    }

    private async createUserAccount(userAccountInfo: UserAccountInfo) {
        await authModule.createUserAccount(userAccountInfo);
        if (this.accountCreationStatus === Status.SUCCESS) {
            this.$emit('next-section');
        }
        if (this.accountCreationStatus === Status.ERROR) {
            const { email } = userAccountInfo;
            this.handleAcountCreationError(email);
        }
    }

    private handleAcountCreationError(accountEmail: string) {
        if (this.errorCode === 600) {
            resetFormFields(this.form);
            this.$emit('duplicate-account', accountEmail);
            return;
        }
        this.generalError = true;
    }

    created() {
        authModule = getModule(AuthModule, this.$store);
    }
}
</script>
