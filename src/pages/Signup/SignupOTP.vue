<template>
    <div>
        <div class="auth-form d-flex flex-column justify-content-between">
            <div class="text mb-5">
                <div>
                    <p class="auth-form__title mb-1">Welcome</p>
                    <ProgressBar :progress="progress" />
                    <p class="otp-form__sub-title">
                        <span class="otp-form__sub-title--grey">OTP sent to</span>
                        <span class="otp-form__sub-title--dark">{{ phoneNumber }}</span>
                    </p>
                </div>
            </div>

            <div class="otp-form__form-input">
                <BaseInputField
                    type="number"
                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                    @input="handleOTPInput"
                    inputContainerClass="otp-form__input-container"
                    v-model="form.inputOne"
                    @focus="handleFocus"
                    className="otp-form__input"
                    :errors="otpFormErrors.inputOne"
                    placeholder=""
                    :required="true"
                    id="otp-signup-input-one"
                    maxLength="1"
                    :autoFocus="focusIndex === 1"
                />

                <BaseInputField
                    type="number"
                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                    inputContainerClass="otp-form__input-container"
                    @input="handleOTPInput"
                    v-model="form.inputTwo"
                    @focus="handleFocus"
                    className="otp-form__input"
                    :errors="otpFormErrors.inputTwo"
                    placeholder=""
                    id="otp-signup-input-two"
                    :required="true"
                    maxLength="1"
                    :autoFocus="focusIndex === 2"
                />

                <BaseInputField
                    type="number"
                    @input="handleOTPInput"
                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                    inputContainerClass="otp-form__input-container"
                    v-model="form.inputThree"
                    @focus="handleFocus"
                    className="otp-form__input"
                    :errors="otpFormErrors.inputThree"
                    id="otp-signup-input-three"
                    :required="true"
                    maxLength="1"
                    :autoFocus="focusIndex === 3"
                />

                <BaseInputField
                    type="number"
                    @input="handleOTPInput"
                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                    inputContainerClass="otp-form__input-container"
                    v-model="form.inputFour"
                    @focus="handleFocus"
                    :className="'otp-form__input'"
                    :errors="otpFormErrors.inputFour"
                    id="otp-signup-input-four"
                    :required="true"
                    maxLength="1"
                    :autoFocus="focusIndex === 4"
                />
            </div>

            <div class="otp-form__form-footer d-flex flex-column align-items-center">
                <p class="otp-form__meta">Didn't receive an OTP?</p>
                <p
                    class="otp-form__resend-otp-text text-warning pointer"
                    @click="handleResendOTP"
                    v-if="conditionsForResendOTPTextToDisplay"
                >
                    RESEND OTP
                </p>
                <Loader size="2" v-if="this.sendOtpRequest === 'LOADING'">RESEND OTP</Loader>
                <BaseButton
                    className="uppercase auth-form__btn"
                    @button-clicked="handleSignupFormSubmission"
                    :disabled="conditionsForOTPSubmitButtonToBeDisabled"
                    :status="verifyOtpStatus"
                    buttonText="Submit"
                />

                <p class="auth-form__meta mt-3">
                    Already have an account?
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
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth.ts';

import ValidationMixin from '@/mixins/validation.ts';

import InputFieldMixins from '@/mixins/InputFieldMixins';
import UtilityMixins from '@/mixins/Utility';

import { SignupOtpValidation } from '@/pages/Signup/types';
import { Status, Toaster } from '@/types';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import SignupMixin from '@/pages/Signup/SignupMixin';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class SignupOTP extends Mixins(
    ValidationMixin,
    InputFieldMixins,
    UtilityMixins,
    DynamicComponentMixin,
    SignupMixin,
) {
    private form = {
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        inputFour: '',
    };

    private otpFormErrors = {
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        inputFour: '',
    };

    private hideResendOTPText = false;

    private focusIndex = 1;

    private userOtpObject: SignupOtpValidation = {
        otp: '',
    };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'signup-otp-toaster',
    };

    @Prop() readonly progress!: number;
    @Prop({ default: false }) readonly isDuplicateAccountSession!: boolean;
    @Prop({ default: '' }) readonly phoneNumber!: string;
    @Prop({ default: '' }) readonly error!: string;
    // @Prop({ default: 'NORMAL' }) readonly verifyOtpStatus!: string;
    @Prop({ default: false }) readonly otpSentSuccessfully!: boolean;

    @auth.State
    public errorCode!: number;

    @auth.Action
    public sendOtpValidation!: (userOtp: SignupOtpValidation) => void;

    get conditionsForResendOTPTextToDisplay() {
        return this.sendOtpRequest !== Status.LOADING && this.hideResendOTPText === false;
    }

    public handleSignupFormSubmission() {
        const atLeastOneOTPInputValueIsEmpty = Object.values(this.form).some(value => {
            return value.length === 0;
        });
        if (!atLeastOneOTPInputValueIsEmpty) {
            const otpDataInArray = Object.values(this.form);
            const otp = otpDataInArray.join('');
            this.validateUserOTP(otp);
        }
    }

    private handleOTPInput(value: string) {
        this.$nextTick(() => {
            if (value.length === 1 && this.focusIndex < 4) {
                this.focusIndex += 1;
            }
        });
    }

    private validateUserOTP(otp: string) {
        this.userOtpObject.otp = otp;
        this.sendOTPValidation();
    }

    private returnAppropriateErrorMessageWhenVerifyingOTP(): string {
        switch (this.errorCode) {
            case 610:
                return 'Invalid OTP';
            default:
                return 'There was an error verifying the OTP';
        }
    }

    public async sendOTPValidation() {
        await authModule.sendOtpValidation(this.userOtpObject);
        if (this.verifyOtpStatus === Status.SUCCESS) {
            this.$emit('go-to-next-section');
        } else {
            const errorMessageForOTPValidation = this.returnAppropriateErrorMessageWhenVerifyingOTP();
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error',
                message: errorMessageForOTPValidation,
            });
        }
    }

    // private reSendOtp() {
    //     this.sendOTPToUser(false);
    // }

    private handleOTPDeletion() {
        if (this.focusIndex > 1) {
            this.focusIndex -= 1;
        }
    }

    private handleResendOTP() {
        this.sendOTPToUser({ freshRequest: false, phoneNumber: this.phoneNumber });
        this.hideResendOTPText = true;
    }

    get conditionsForOTPSubmitButtonToBeDisabled() {
        const atLeastOneOTPInputIsUnfilled = Object.values(this.form).some(formValue => !formValue.length);
        return atLeastOneOTPInputIsUnfilled;
    }

    get thereIsAnErrorInTheVerifyOTPStage() {
        return this.verifyOtpStatus === Status.ERROR;
    }

    @Watch('form.inputOne')
    formInputOneHasChanged() {
        // set focus index of first otp input field to 1 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 1;
    }

    @Watch('form.inputTwo')
    formInputTwoHasChanged() {
        // set focus index of first otp input field to 2 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 2;
    }

    @Watch('form.inputThree')
    formInputThreeHasChanged() {
        // set focus index of first otp input field to 3 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 3;
    }

    @Watch('form.inputFour')
    formInputFourHasChanged(newValue: string) {
        // set focus index of first otp input field to 4 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 4;
        this.$nextTick(() => {
            this.form.inputFour = newValue.slice(0, 1); // this ensures that the fourth input field has one value
            // it is an equivalent of max length for input type number. inputs 1-3 don't have to be sliced because the
            // cursor changes when 1 number is inputted in the input field
        });
    }

    @Watch('otpSentSuccessfully')
    handleSuccessNotification() {
        if (this.otpSentSuccessfully) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'OTP has been resent successfully',
            });
        }
    }

    @Watch('hideResendOTPText')
    hideResendOTPTextHasChanged(newValue: boolean) {
        if (newValue) {
            // if hideResendOTPText is true, turn it to false after 1s so that the resend OTP
            // text displays
            setTimeout(() => (this.hideResendOTPText = false), 60000);
        }
    }

    created() {
        authModule = getModule(AuthModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/signupotp.scss';
@import 'src/styles/pages/auth.scss';
</style>
