<template>
    <div class="email-form">
        <MzuriLogo className="email-form__logo-container" />
        <div class="email-form__medium-plus-container">
            <div class="email-form__medium-plus-inner-container">
                <h1 class="email-form__heading--primary">Forgot Password</h1>
                <p class="email-form__action-text">Kindly enter your email address to get a reset link</p>

                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Email address"
                    type="email"
                    :required="true"
                    :errors="emailFormErrors.email"
                    v-model="emailForm.email"
                    @input="validateEmail(emailForm.email, emailFormErrors)"
                />
                <div class="email-form__button-container">
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        className="email-form__button"
                        :status="status"
                        :disabled="buttonIsDisabled(status, emailFormErrors)"
                        @button-clicked="validateEmailForm"
                    >
                        Send
                    </BasePrimaryButton>
                </div>

                <p class="email-form__have-account-text">
                    <router-link class="email-form__signin-text" to="/login">Click here </router-link>
                    to login
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
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { validateEmail } from '@/utils/formValidator';
import { LoginEmailValidation, Status, ResetPasswordRequest } from '@/types';

import AuthModule from '@/store/modules/auth';

import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class EmailForm extends Mixins(ValidationMixin, UtilityMixins) {
    private emailForm: LoginEmailValidation = {
        email: '',
    };
    private emailFormErrors: LoginEmailValidation = {
        email: '',
    };
    private showSuccessNotificationModal = false;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'password-reset-toaster',
        position: 'b-toaster-top-right',
    };

    @auth.State
    private error!: string;

    @auth.State
    private resetPasswordRequest!: ResetPasswordRequest;

    @auth.Action
    public sendResetPasswordEmailToUser!: (userEmail: LoginEmailValidation) => void;

    get status() {
        return this.resetPasswordRequest.sendResetPasswordEmail;
    }

    public validateEmailForm() {
        this.emailFormErrors = validateEmail(this.emailForm.email);
        if (!this.formHasError(this.emailFormErrors)) {
            this.sendResetPasswordEmail();
        }
    }

    public async sendResetPasswordEmail() {
        await authModule.sendResetPasswordEmailToUser(this.emailForm);
        if (this.status === Status.SUCCESS) {
            this.emailForm.email = '';
            this.$emit('password-reset-email-sent-successfully');
        } else {
            this.displayFailureNotification();
        }
    }

    private displayFailureNotification() {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: this.error,
        });
    }

    mounted() {
        authModule = getModule(AuthModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/forgot-password/email-form.scss';
</style>
