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

            <div class="auth-form__form-input">
                <BaseInputFieldAuth
                    v-model="form.phoneNumber"
                    :className="[hasError(formErrors.phoneNumber) ? 'error' : '', 'auth-form__input']"
                    :errors="formErrors.phoneNumber"
                    floatingLabelText="Phone Number"
                    id="phone-number"
                    :required="true"
                    @input="validatePhoneNumber(form.phoneNumber, formErrors)"
                />
            </div>
            <div class="auth-form__captcha-container d-flex flex-column align-items-center mt-3">
                <vue-recaptcha
                    :loadRecaptchaScript="true"
                    ref="recaptcha"
                    @verify="verifyCaptcha"
                    @expired="handleCaptchaExpiration"
                    :sitekey="sitekey"
                >
                </vue-recaptcha>
                <p class="auth-form__captcha-error" v-if="captchaError !== ''">{{ captchaError }}</p>
                <button @click="resetRecaptcha">Reset ReCAPTCHA</button>
            </div>

            <div class="auth-form__code-text-container">
                A code will be send to your phone number, click to continue
            </div>
            <div class="auth-form__form-footer d-flex flex-column align-items-center">
                <BaseButton
                    className="uppercase auth-form__btn"
                    @button-clicked="handleSignupFormSubmission"
                    :disabled="buttonIsDisabled(sendOtpRequest, formErrors.phoneNumber)"
                    :status="sendOtpRequest"
                    buttonText="Continue"
                />
                <p class="auth-form__meta mt-3">
                    Already have an account?
                    <router-link to="/login"><span class="text-warning pointer">Sign in</span></router-link>
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
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';

import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import SignupMixin from '@/pages/Signup/SignupMixin';

import { LoginPhoneNumberValidation, Toaster } from '@/types';

import VueRecaptcha from 'vue-recaptcha';

const auth = namespace('auth');

@Component({
    components: { VueRecaptcha },
})
export default class SignupForm extends Mixins(ValidationMixin, UtilityMixins, DynamicComponentMixin, SignupMixin) {
    private form: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    private formErrors = {
        phoneNumber: '',
    };
    private sitekey = process.env.VUE_APP_RECAPTCHA_SITE_KEY;

    private captchaVerified = false;

    private captchaExpired = false;
    private captchaError = '';
    public userInfo: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'signup-form-toaster',
    };

    @Prop() readonly progress!: number;
    @Prop({ default: false }) readonly isDuplicateAccountSession!: boolean;
    @Prop({ default: 'NORMAL' }) readonly sendOtpRequest!: string;

    @auth.State
    public errorCode!: number;

    @auth.Action
    public sendOtpEmailToUser!: (userEmail: LoginPhoneNumberValidation) => void;

    public handleSignupFormSubmission() {
        this.validatePhoneNumber(this.form.phoneNumber, this.formErrors);
        const { phoneNumber } = this.form;

        if (this.formHasError(this.formErrors)) return;
        this.$emit('set-phone-number', phoneNumber);
        this.validateCaptcha();
        if (this.captchaVerified) {
            this.handleCaptchaVerification(phoneNumber);
        }
    }

    private handleCaptchaVerification(phoneNumber: string) {
        this.userInfo = {
            phoneNumber,
            email: this.form.email,
        };
        this.sendOTPToUser({ phoneNumber: this.userInfo.phoneNumber, email: this.userInfo.email });
    }

    private verifyCaptcha() {
        this.captchaVerified = true;
    }
    private handleCaptchaExpiration() {
        this.captchaVerified = false;
        //reset captcah automatically
    }

    private resetRecaptcha() {
        this.$refs.recaptcha.reset(); // Direct call reset method
    }

    public $refs!: {
        recaptcha: HTMLFormElement;
    };

    private validateCaptcha() {
        if (!this.captchaVerified) {
            this.captchaError = 'Please validate captcha';
        } else this.captchaError = '';
    }

    @Watch('captchaVerified')
    handleCaptchaChange() {
        this.validateCaptcha();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth.scss';
</style>
f
