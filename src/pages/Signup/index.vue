<template>
    <keep-alive>
        <component
            :is="componentList[activeComponentIndex]"
            :secretQuestions="secretQuestions"
            :sendOtpRequest="sendOtpRequest"
            :verifyOtpStatus="verifyOtpStatus"
            @next-section="goToNextSection"
            @go-to-next-section="handleNextSection"
            :progress="calculateProgressBar(3)"
            @bio-data-section-completed="updateUserBioData"
            :bioDataFields="userBioData"
            @set-phone-number="setPhoneNumber"
            :isDuplicateAccountSession="isDuplicateAccount"
            :phoneNumber="userInfo.phoneNumber"
            :error="error"
            :otpSentSuccessfully="otpSentSuccessfully"
        />
    </keep-alive>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import SignupForm from '@/pages/Signup/SignupForm.vue';
import CreatePasswordForm from '@/pages/Signup/CreatePasswordForm.vue';
import SignupBiodata from '@/pages/Signup/SignupBiodata.vue';
import SignupOTP from '@/pages/Signup/SignupOTP.vue';

import { SecretQuestionFields, SecretQuestion, BioDataFields, Status, LoginPhoneNumberValidation } from '@/types';

import { SignupOtpValidation } from '@/pages/Signup/types';

import DynamicComponentMixin from '@/mixins/dynamicComponents.ts';
import ValidationMixin from '@/mixins/validation.ts';

const auth = namespace('auth');

@Component({
    components: {
        SignupForm,
        SignupOTP,
        SignupBiodata,
        CreatePasswordForm,
    },
})
export default class SignupIndex extends Mixins(DynamicComponentMixin, ValidationMixin) {
    private componentList: Array<object> = [SignupForm, SignupOTP, SignupBiodata];

    private error = '';

    private userBioData: BioDataFields = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    private userInfo: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    private isDuplicateAccount = false;

    private otpSentSuccessfully = false;

    @auth.State
    public status!: string;

    @auth.State
    public errorCode!: number;

    @auth.State
    public secretQuestions!: Array<SecretQuestion>;

    @auth.Action
    public getSecrets!: () => object;

    @auth.Action
    public submitSecret!: (SecretQuestionFields: SecretQuestionFields) => object;

    @auth.State
    private sendOtpRequest!: Status;

    @auth.Action
    public sendOtpEmailToUser!: (userEmail: LoginPhoneNumberValidation) => void;

    @auth.State
    private verifyOtpStatus!: string;

    @auth.Action
    public sendOtpValidation!: (userOtp: SignupOtpValidation) => void;

    private updateUserBioData(bioData: BioDataFields) {
        this.userBioData = {
            ...bioData,
            phoneNumber: this.userInfo.phoneNumber,
        };
    }

    private goToNextSection() {
        this.handleNextSection();
    }

    private setPhoneNumber(phoneNumber: string) {
        this.userInfo.phoneNumber = phoneNumber;
    }
}
</script>

<style lang="scss"></style>
