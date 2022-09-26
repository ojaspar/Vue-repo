<template>
    <div class="set-password-form">
        <MzuriLogo className="set-password-form__logo-container" />
        <div class="set-password-form__medium-plus-container">
            <div class="set-password-form__medium-plus-inner-container">
                <h1 class="set-password-form__heading--primary">Set New Password</h1>

                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="New Password"
                    type="password"
                    v-model="form.password"
                    :errors="passwordFormErrors.password"
                    :required="true"
                    @input="validatePassword"
                />
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Confirm Password"
                    type="password"
                    :errors="passwordFormErrors.confirmPassword"
                    v-model="form.confirmPassword"
                    :required="true"
                    @input="validateConfirmPassword"
                />
                <div class="set-password-form__button-container">
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        className="set-password-form__button"
                        @button-clicked="handleResetPasswordSubmission"
                        :disabled="conditionsForButtonToBeDisabled"
                        :status="status"
                    >
                        Change Password
                    </BasePrimaryButton>
                </div>
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
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { validateCreatePasswordSection, validatePassword, validateConfirmPassword } from '@/utils/formValidator.ts';

import { Status, ResetPasswordRequest, ResetPasswordPayload } from '@/types';

import AuthModule from '@/store/modules/auth';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class ResetPassword extends Mixins(UtilityMixins, ValidationMixin) {
    private passwordFormErrors = {
        password: '',
        confirmPassword: '',
    };

    private form = {
        password: '',
        confirmPassword: '',
    };

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'reset-password-form-toaster',
        position: 'b-toaster-top-center',
    };

    private passwordResetToken = '';
    private showSuccessNotificationModal = false;

    @auth.State
    private error!: string;

    @auth.State
    private resetPasswordRequest!: ResetPasswordRequest;

    get status() {
        return this.resetPasswordRequest.resetPassword;
    }

    get conditionsForButtonToBeDisabled() {
        return (
            this.resetPasswordRequest.resetPassword === Status.LOADING ||
            this.atLeastOneErrorExists(this.passwordFormErrors)
        );
    }

    private getTokenFromURL() {
        //Vue automatically decodes a url encoded string so we need to
        const token = encodeURIComponent(this.$route.query.token as string);
        if (token === 'undefined') {
            this.goToForgotPasswordPage();
            return;
        }
        this.passwordResetToken = token;
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

    private async resetPassword(payload: ResetPasswordPayload) {
        await authModule.resetPassword(payload);
        if (this.status === Status.SUCCESS) {
            this.$emit('password-has-been-reset-successfully');
        } else {
            this.displayErrorNotification();
        }
    }

    private goToForgotPasswordPage() {
        this.$router.push('/forgot-password');
    }

    private displayErrorNotification() {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: 'There was an error resetting your password. Please try again',
        });
    }

    private async handleResetPasswordSubmission() {
        this.passwordFormErrors = validateCreatePasswordSection(this.form);

        if (!this.atLeastOneErrorExists(this.passwordFormErrors)) {
            const passwordResetToken = this.passwordResetToken;
            const payload = { passwordResetToken, password: this.form.password };
            await this.resetPassword(payload);
        }
    }

    mounted() {
        authModule = getModule(AuthModule, this.$store);
        this.getTokenFromURL();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/forgot-password/password-form.scss';
</style>
