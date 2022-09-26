<template>
    <b-container fluid class="login">
        <b-row>
            <b-col>
                <div class="login__left-side">
                    <img src="@/assets/img/mzuri-logo.svg" class="login__logo" />

                    <h1 class="login__heading-primary">Welcome</h1>
                    <p class="login__heading-secondary">Please login to your account</p>

                    <BlockErrorMessage :message="loginError" />

                    <BaseInputField
                        floatingLabelText="Email"
                        floatingLabelClass="login__input-label"
                        v-model="loginInfo.email"
                        :className="[hasError(errors.email) ? 'error' : '', 'login__input-field']"
                        :errors="errors.email"
                        :required="true"
                        :autoFocus="true"
                        @keyup.enter="loginUser"
                        id="login-email"
                        @input="validateEmail(loginInfo.email, errors)"
                    />

                    <div class="login__password-input-field-container">
                        <BaseInputField
                            :type="inputType"
                            floatingLabelText="Password"
                            floatingLabelClass="login__input-label"
                            :className="[
                                hasError(errors.password) ? 'error' : '',
                                'login__input-field login__password-input-field',
                            ]"
                            :errors="errors.password"
                            v-model="loginInfo.password"
                            @input="validateLoginPassword(loginInfo.password, errors)"
                            :required="true"
                            @keyup.enter="loginUser"
                        />
                        <span @click="togglePasswordIcon">
                            <span v-if="showPasswordText"
                                ><font-awesome-icon :icon="icon" aria-hidden="true" class="login__eye-icon"
                            /></span>
                            <span v-else
                                ><font-awesome-icon :icon="icon" aria-hidden="true" class="login__eye-icon"
                            /></span>
                        </span>
                    </div>

                    <b-row class="login__forgot-password-section">
                        <b-col>
                            <p class="login__text">
                                <router-link to="/forgot-password" class="login__forgot-password-text"
                                    >Forgot Password?</router-link
                                >
                            </p>
                        </b-col>
                    </b-row>

                    <BasePrimaryButton
                        buttonText="Login"
                        :overRideButtonClass="true"
                        className="login__button"
                        @button-clicked="loginUser"
                        :disabled="buttonIsDisabled(authRequestStatus.login, errors)"
                        :status="authRequestStatus.login"
                    />
                    <p class="login__text login__have-account-text">
                        Don't have an Mzuri account?
                        <router-link to="/signup" class="login__signup-text">Sign up</router-link>
                    </p>
                </div>
            </b-col>
            <b-col v-if="!$root.isMobileScreenSize">
                <img src="@/assets/img/login-right-image.png" class="login__right-image" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AuthModule from '@/store/modules/auth';
import ValidationMixin from '@/mixins/validation.ts';
import PasswordMixin from '@/mixins/Password.ts';
import UtilityMixins from '@/mixins/Utility';

import { AuthRequestStatus, LoginInfo, Status } from '@/types';
import { SIGNUP_STAGE_TWO } from '@/store/constants';

import { getLoginErrors } from '@/utils/formValidator';
import SessionStorageService from '@/services/sessionStorage';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class LoginPage extends Mixins(ValidationMixin, PasswordMixin, UtilityMixins) {
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

    @auth.Action
    public resetLoginErrorState!: () => void;

    @auth.State
    public errorCode!: number;

    @auth.State
    public loginError!: string;

    @auth.State
    public authRequestStatus!: AuthRequestStatus;

    public validateForm() {
        this.errors = getLoginErrors(this.loginInfo);
    }

    public async loginUser() {
        this.validateForm();
        if (!this.formHasError(this.errors)) {
            await authModule.login(this.loginInfo);
            if (this.authRequestStatus.login === Status.SUCCESS) {
                this.checkUserSignUpStatus();
                return;
            }
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
        this.resetLoginErrorState();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/auth/login.scss';
</style>
