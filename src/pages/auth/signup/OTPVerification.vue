<template>
    <b-container fluid class="otp-verification">
        <b-row>
            <b-col>
                <div class="otp-verification__container">
                    <img src="@/assets/img/mzuri-logo.svg" class="otp-verification__logo" />

                    <ProgressTracker v-if="!$root.isMobileScreenSize" :activeComponentIndex="activeComponentIndex" />

                    <div class="otp-verification__medium-plus-container">
                        <h1 class="otp-verification__heading-primary">OTP Verification</h1>
                        <p class="otp-verification__destination-text">
                            OTP {{ sentOrResent }} to <i>{{ phoneNumber }}</i> and <i>{{ email }}</i>
                        </p>

                        <div class="otp-verification__block-error-message-container">
                            <BlockErrorMessage :message="signupError.verifyOTP" />
                        </div>

                        <b-row class="otp-verification__otp-field-container">
                            <b-col>
                                <BaseInputField
                                    className="otp-verification__otp-field"
                                    type="number"
                                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                                    @input="handleOTPInput"
                                    v-model="form.inputOne"
                                    @focus="handleFocus"
                                    :errors="otpFormErrors.inputOne"
                                    :required="true"
                                    maxLength="1"
                                    :autoFocus="focusIndex === 1"
                                />
                            </b-col>
                            <b-col>
                                <BaseInputField
                                    className="otp-verification__otp-field"
                                    type="number"
                                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                                    @input="handleOTPInput"
                                    v-model="form.inputTwo"
                                    @focus="handleFocus"
                                    :errors="otpFormErrors.inputTwo"
                                    placeholder=""
                                    :required="true"
                                    maxLength="1"
                                    :autoFocus="focusIndex === 2"
                                />
                            </b-col>
                            <b-col>
                                <BaseInputField
                                    className="otp-verification__otp-field"
                                    type="number"
                                    @input="handleOTPInput"
                                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                                    v-model="form.inputThree"
                                    @focus="handleFocus"
                                    :errors="otpFormErrors.inputThree"
                                    :required="true"
                                    maxLength="1"
                                    :autoFocus="focusIndex === 3"
                                />
                            </b-col>
                            <b-col>
                                <BaseInputField
                                    className="otp-verification__otp-field"
                                    type="number"
                                    @input="handleOTPInput"
                                    @delete-or-backspace-key-pressed="handleOTPDeletion"
                                    v-model="form.inputFour"
                                    @focus="handleFocus"
                                    :errors="otpFormErrors.inputFour"
                                    :required="true"
                                    maxLength="1"
                                    :autoFocus="focusIndex === 4"
                                />
                            </b-col>
                        </b-row>

                        <p class="otp-verification__receive-otp-text" v-if="conditionsForResendOTPTextToDisplay">
                            Didn’t receive an OTP?
                            <span class="otp-verification__resend-code-text" @click="handleResendOTP">
                                Resend Code
                            </span>
                            <Loader size="1" v-if="this.sendOtpRequest === 'LOADING'">RESEND OTP</Loader>
                        </p>

                        <BasePrimaryButton
                            buttonText="Verify"
                            :overRideButtonClass="true"
                            className="otp-verification__button"
                            @button-clicked="handleSignupFormSubmission"
                            :disabled="conditionsForOTPSubmitButtonToBeDisabled"
                            :status="verifyOtpStatus"
                        />

                        <p class="otp-verification__have-account-text">
                            Already have an Mzuri account?
                            <router-link class="otp-verification__signin-text" to="/login"> Sign in</router-link>
                        </p>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth.ts';

import ValidationMixin from '@/mixins/validation.ts';

import ProgressTracker from '@/components/ui/ProgressTracker.vue';

import InputFieldMixins from '@/mixins/InputFieldMixins';
import UtilityMixins from '@/mixins/Utility';
import SignupMixin from '@/pages/Signup/SignupMixin';

import { SignupOtpValidation } from '@/pages/Signup/types';
import { Status, Toaster } from '@/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component({
    components: {
        ProgressTracker,
    },
})
export default class OTPVerification extends Mixins(ValidationMixin, InputFieldMixins, UtilityMixins, SignupMixin) {
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
    private sentOrResent = 'sent';

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
    @Prop({ default: '' }) readonly email!: string;
    @Prop({ default: '' }) readonly phoneNumber!: string;
    @Prop({ required: true }) readonly activeComponentIndex!: number;
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
            if (value.length >= 1 && this.focusIndex < 4) {
                this.focusIndex += 1;
            }
        });
    }

    private validateUserOTP(otp: string) {
        this.userOtpObject.otp = otp;
        this.sendOTPValidation();
    }

    public async sendOTPValidation() {
        await authModule.sendOtpValidation(this.userOtpObject);
        if (this.verifyOtpStatus === Status.SUCCESS) {
            this.$emit('go-to-next-section');
        }
    }

    private handleOTPDeletion() {
        if (this.focusIndex > 1) {
            this.focusIndex -= 1;
        }
    }

    private handleResendOTP() {
        this.sendOTPToUser({ freshRequest: false, phoneNumber: this.phoneNumber, email: this.email });
        this.hideResendOTPText = true;
        this.sentOrResent = 'resent';
    }

    get conditionsForOTPSubmitButtonToBeDisabled() {
        const atLeastOneOTPInputIsUnfilled = Object.values(this.form).some(formValue => !formValue.length);
        return atLeastOneOTPInputIsUnfilled;
    }

    get thereIsAnErrorInTheVerifyOTPStage() {
        return this.verifyOtpStatus === Status.ERROR;
    }

    @Watch('form.inputOne')
    formInputOneHasChanged(newValue: string) {
        // set focus index of first otp input field to 1 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 1;
        this.$nextTick(() => {
            this.form.inputOne = newValue.slice(-1); // this ensures that the fourth input field has one value
            // it is an equivalent of max length for input type number. inputs 1-3 don't have to be sliced because the
            // cursor changes when 1 number is inputted in the input field
        });
    }

    @Watch('form.inputTwo')
    formInputTwoHasChanged(newValue: string) {
        // set focus index of first otp input field to 2 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 2;
        this.$nextTick(() => {
            this.form.inputTwo = newValue.slice(-1); // this ensures that the fourth input field has one value
            // it is an equivalent of max length for input type number. inputs 1-3 don't have to be sliced because the
            // cursor changes when 1 number is inputted in the input field
        });
    }

    @Watch('form.inputThree')
    formInputThreeHasChanged(newValue: string) {
        // set focus index of first otp input field to 3 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 3;
        this.$nextTick(() => {
            this.form.inputThree = newValue.slice(-1); // this ensures that the fourth input field has one value
            // it is an equivalent of max length for input type number. inputs 1-3 don't have to be sliced because the
            // cursor changes when 1 number is inputted in the input field
        });
    }

    @Watch('form.inputFour')
    formInputFourHasChanged(newValue: string) {
        // set focus index of first otp input field to 4 when it changes.
        // This will help with situations where the user doesn't use the input fields in numerical order
        this.focusIndex = 4;
        this.$nextTick(() => {
            this.form.inputFour = newValue.slice(-1); // this ensures that the fourth input field has one value
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
@import 'src/styles/pages/auth/otp-verification.scss';
</style>
