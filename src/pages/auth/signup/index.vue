<template>
    <AuthFooterLayout>
        <keep-alive>
            <transition name="fade" mode="out-in">
                <component
                    :is="componentList[activeComponentIndex]"
                    :sendOtpRequest="sendOtpRequest"
                    :verifyOtpStatus="verifyOtpStatus"
                    @next-section="goToNextSection"
                    @go-to-next-section="handleNextSection"
                    :progress="calculateProgressBar(3)"
                    :bioDataFields="userBioData"
                    @set-phone-number="setPhoneNumber"
                    @set-email="setEmail"
                    :isDuplicateAccountSession="isDuplicateAccount"
                    :email="userBioData.email"
                    :phoneNumber="userBioData.phoneNumber"
                    :otpSentSuccessfully="otpSentSuccessfully"
                    :activeComponentIndex="activeComponentIndex"
                />
            </transition>
        </keep-alive>
    </AuthFooterLayout>
</template>

<script lang="ts">
import AuthFooterLayout from '@/pages/auth/layout/Footer.vue';

import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import SendOTPPage from '@/pages/auth/signup/SendOTP.vue';
import OTPVerificationPage from '@/pages/auth/signup/OTPVerification.vue';
import PersonalDetailsPage from '@/pages/auth/signup/PersonalDetails.vue';
import StartTrialPage from '@/pages/auth/signup/StartTrial.vue';

import { BioDataFields, Status, LoginPhoneNumberValidation } from '@/types';

import { SignupOtpValidation } from '@/pages/Signup/types';

import DynamicComponentMixin from '@/mixins/dynamicComponents.ts';
import ValidationMixin from '@/mixins/validation.ts';

const auth = namespace('auth');

@Component({
    components: {
        SendOTPPage,
        OTPVerificationPage,
        AuthFooterLayout,
        PersonalDetailsPage,
        StartTrialPage,
    },
})
export default class SignupIndex extends Mixins(DynamicComponentMixin, ValidationMixin) {
    private componentList: Array<object> = [SendOTPPage, OTPVerificationPage, PersonalDetailsPage];

    private userBioData: BioDataFields = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    private isDuplicateAccount = false;

    private otpSentSuccessfully = false;

    @auth.State
    public status!: string;

    @auth.State
    public errorCode!: number;

    @auth.State
    private sendOtpRequest!: Status;

    @auth.Action
    public sendOtpEmailToUser!: (userEmail: LoginPhoneNumberValidation) => void;

    @auth.Action
    public resetSignupErrorState!: () => void;

    @auth.State
    private verifyOtpStatus!: string;

    @auth.Action
    public sendOtpValidation!: (userOtp: SignupOtpValidation) => void;

    private goToNextSection() {
        this.handleNextSection();
    }

    private setPhoneNumber(phoneNumber: string) {
        this.userBioData.phoneNumber = phoneNumber;
    }

    private setEmail(email: string) {
        this.userBioData.email = email;
    }

    mounted() {
        this.resetSignupErrorState();
    }
}
</script>

<style lang="scss"></style>
