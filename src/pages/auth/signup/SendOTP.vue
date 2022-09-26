<template>
    <b-container fluid class="send-otp">
        <b-row>
            <b-col class="p-0" v-if="!$root.isMobileScreenSize">
                <img src="@/assets/img/signup-right-image.png" class="send-otp__right-image" />
            </b-col>
            <b-col>
                <div class="send-otp__left-side">
                    <img src="@/assets/img/mzuri-logo.svg" class="send-otp__logo" />

                    <h1 class="send-otp__heading-primary">Sign Up</h1>
                    <p class="send-otp__heading-secondary">Enter your phone number to get started</p>

                    <BlockErrorMessage :message="signupError.sendOTP" />

                    <label class="send-otp__phone-number-label">Phone Number</label>

                    <VuePhoneNumberInput
                        class="send-otp__number-input"
                        v-model="form.phoneNumber"
                        default-country-code="NG"
                    />
                    <p v-text="formErrors.phoneNumber" class="send-otp__error"></p>

                    <!-- email field -->
                    <BaseInputField
                        floatingLabelText="Email"
                        placeholder="Email Address"
                        v-model="form.email"
                        :required="true"
                        className="send-otp__email-input"
                        floatingLabelClass="send-otp__email-input-label"
                        inputContainerClass="send-otp__email-input-container"
                        id="login-email"
                        :errors="formErrors.email"
                        @input="validateEmail(form.email, formErrors)"
                    />

                    <div class="d-flex">
                        <BaseCheckbox
                            inputContainerClass="send-otp__checkbox"
                            id="terms-and-conditions"
                            @change="toggleTermsAndConditionsConsent"
                            v-model="termsAgreed"
                        />
                        <span
                            @click="toggleTermsAndConditionsConsent"
                            class="send-otp__terms-and-conditions-text pointer"
                        >
                            I have read the
                            <router-link to="" class="send-otp__send-otp-text--orange"> Terms & Conditions</router-link
                            >, and agree to be bound by them.
                        </span>
                    </div>

                    <input
                        class="send-otp__first-name"
                        id="firstName"
                        name="firstName"
                        type="text"
                        v-model="firstName"
                    />

                    <BasePrimaryButton
                        buttonText="Sign Up"
                        :overRideButtonClass="true"
                        className="send-otp__button"
                        @button-clicked="handleSendOTPFormSubmission"
                        :disabled="buttonIsDisabled(sendOtpRequest, formErrors.phoneNumber) || disableButton"
                        :status="sendOtpRequest"
                    />

                    <p class="send-otp__have-account-text">
                        Already have an Mzuri account?
                        <router-link class="send-otp__signin-text" to="/login"> Sign in</router-link>
                    </p>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import VueRecaptcha from 'vue-recaptcha';

import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import SignupMixin from '@/pages/Signup/SignupMixin';

import { LoginPhoneNumberValidation, Toaster } from '@/types';

const auth = namespace('auth');

@Component({
    components: {
        VueRecaptcha,
    },
})
export default class SendOTP extends Mixins(ValidationMixin, UtilityMixins, DynamicComponentMixin, SignupMixin) {
    @Prop() readonly progress!: number;
    @Prop({ default: false }) readonly isDuplicateAccountSession!: boolean;

    @auth.State
    public errorCode!: number;

    @auth.Action
    public sendOtpEmailToUser!: (userEmail: LoginPhoneNumberValidation) => void;

    private form: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    private formErrors = {
        phoneNumber: '',
        email: '',
    };
    private sitekey = process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    private captchaVerified = false;
    private captchaExpired = false;
    private captchaError = '';

    public userInfo: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    // hidden trap for bots to set
    public firstName = '';

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'signup-form-toaster',
    };

    private termsAgreed = false;

    get disableButton() {
        return !this.form.phoneNumber || !this.termsAgreed;
    }

    get phoneNumberInCorrectFormat() {
        return this.formatPhoneNumberFromVueNumberInput(this.form.phoneNumber);
    }

    public formatPhoneNumberFromVueNumberInput(phoneNumber: string) {
        // remove spaces in the phone number string
        return phoneNumber.replace(/\s/g, '');
    }

    public handleSendOTPFormSubmission() {
        if (this.firstName) {
            return;
        }

        this.validatePhoneNumber(this.phoneNumberInCorrectFormat, this.formErrors);

        if (this.formHasError(this.formErrors)) return;

        const phoneNumber = this.phoneNumberInCorrectFormat;
        const email = this.form.email;
        this.$emit('set-phone-number', phoneNumber);
        this.$emit('set-email', email);

        this.sendOTPToUser({ phoneNumber, email });
    }

    private toggleTermsAndConditionsConsent() {
        this.termsAgreed = !this.termsAgreed;
    }

    @Watch('form.phoneNumber')
    handlePhoneNumberChange() {
        if (this.formHasError(this.formErrors)) {
            this.validatePhoneNumber(this.phoneNumberInCorrectFormat, this.formErrors);
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth/send-otp.scss';
</style>
