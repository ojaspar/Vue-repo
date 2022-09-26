<template>
    <div class="auth-form d-flex flex-column justify-content-between">
        <div class="text">
            <div>
                <p class="auth-form__title mb-1 text-center">Login to your Account</p>
            </div>
        </div>
        <div class="form-input mt-5">
            <BaseInputFieldAuth
                type="email"
                v-model="loginInfo.email"
                :className="[hasError(errors.email) ? 'error' : '', 'auth-form__input col-12']"
                :errors="errors.email"
                :required="true"
                :autoFocus="true"
                floatingLabelText="Email"
                id="login-email"
                @input="validateEmail(loginInfo.email, errors)"
            />
            <div class="login-password-wrapper">
                <BaseInputFieldAuth
                    :type="inputType"
                    floatingLabelText="Password"
                    id="login-password"
                    :errors="errors.password"
                    v-model="loginInfo.password"
                    :autoFocus="true"
                    :className="[hasError(errors.password) ? 'error' : '', 'auth-form__password-section-input col-12']"
                    @input="validateLoginPassword(loginInfo.password, errors)"
                    :required="true"
                />
                <span @click="togglePasswordIcon" class="tx-16 col-1 pointer icon-container">
                    <span v-if="showPasswordText"><font-awesome-icon :icon="icon" class="pull-right mb-0"/></span>
                    <span v-else><font-awesome-icon :icon="icon" class="pull-right mb-0"/></span>
                </span>
            </div>
        </div>

        <p class="auth-form__meta mt-3">
            <router-link to="/forgot-password" class="forgot-password-text pointer ">Forgot Password?</router-link>
        </p>

        <div class="form-footer d-flex flex-column align-items-center mt-5">
            <BaseButton
                className="uppercase auth-form__btn"
                @button-clicked="loginUser"
                :disabled="buttonIsDisabled(status, errors)"
                :status="status"
                buttonText="Login"
            />
            <p class="auth-form__meta mt-3">
                Don't have an account?
                <router-link to="/signup" class="text-warning pointer">Register</router-link>
            </p>
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
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth';
import ValidationMixin from '@/mixins/validation.ts';
import PasswordMixin from '@/mixins/Password.ts';
import UtilityMixins from '@/mixins/Utility';

import { LoginInfo, Status } from '@/types';
import { SIGNUP_STAGE_TWO } from '@/store/constants';

import { getLoginErrors } from '@/utils/formValidator';
import SessionStorageService from '@/services/sessionStorage';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class LoginIndex extends Mixins(ValidationMixin, PasswordMixin, UtilityMixins) {
    @Prop() readonly status!: Status;
    private loginInfo: LoginInfo = {
        email: '',
        password: '',
    };

    private errors: LoginInfo = {
        email: '',
        password: '',
    };

    @auth.Action
    public login!: (loginInfo: LoginInfo) => object;

    @auth.State
    public errorCode!: number;

    private errorValidationMessage = '';

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'login-toaster',
        position: 'b-toaster-top-center',
    };

    public validateForm() {
        this.errors = getLoginErrors(this.loginInfo);
    }

    public async loginUser() {
        this.validateForm();
        if (!this.formHasError(this.errors)) {
            await authModule.login(this.loginInfo);
            if (this.status === Status.SUCCESS) {
                this.checkUserSignUpStatus();
                return;
            }
            if (this.errorCode === 601) {
                this.errorValidationMessage = 'Invalid username';
            } else if (this.errorCode === 602) {
                this.errorValidationMessage = 'Invalid password';
            } else {
                this.errorValidationMessage = 'There was an error logging in. Please try again';
            }

            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error',
                message: this.errorValidationMessage,
            });
        }
    }

    private checkUserSignUpStatus() {
        const accessToken = SessionStorageService.decodeToken();
        const { signupIncompleteStage } = accessToken;
        if (!signupIncompleteStage) {
            location.href = '/dashboard';
            return;
        }
        this.redirectUserToCompleteSignUp(signupIncompleteStage);
    }

    private redirectUserToCompleteSignUp(currentStage: string) {
        if (currentStage === SIGNUP_STAGE_TWO) {
            this.$router.push('/business-setup');
        }
    }

    mounted() {
        authModule = getModule(AuthModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth.scss';
</style>
