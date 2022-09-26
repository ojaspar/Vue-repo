/*eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth';

import { SignupOtpValidation } from '@/pages/Signup/types';
import { LoginPhoneNumberValidation, Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';

import { SignupError } from '@/pages/auth/signup/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
class SignupMixin extends Mixins(UtilityMixins) {
    public userInfo: LoginPhoneNumberValidation = {
        phoneNumber: '',
        email: '',
    };

    @auth.State
    public verifyOtpStatus!: string;

    @auth.State
    public sendOtpRequest!: string;

    @auth.State
    public errorCode!: number;

    @auth.State
    public signupError!: SignupError;

    @auth.Action
    public sendOtpValidation!: (userOtp: SignupOtpValidation) => void;

    public async sendOTPToUser({
        freshRequest: freshRequest = true,
        phoneNumber,
        email,
    }: {
        freshRequest?: boolean;
        phoneNumber: string;
        email?: string;
    }) {
        this.userInfo.phoneNumber = phoneNumber;
        this.userInfo.email = email;

        await authModule.sendOtpToUser(this.userInfo);

        if (this.sendOtpRequest === Status.SUCCESS) {
            if (!freshRequest) return;
            this.$emit('go-to-next-section');
        }
    }

    created() {
        authModule = getModule(AuthModule, this.$store);
    }
}

export default SignupMixin;
