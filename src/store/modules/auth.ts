/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

import * as ACTIONS from '@/store/identity-service-constants';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import {
    Status,
    SecretQuestion,
    LoginInfo,
    LoginPhoneNumberValidation,
    LoginEmailValidation,
    UserAccountInfo,
    ResetPasswordRequest,
    ResetPasswordPayload,
    RequestErrorObject,
    AuthRequestStatus,
} from '@/types';

import { SignupOtpValidation } from '@/pages/Signup/types';

import SessionStorageService from '@/services/sessionStorage';

import { genericPostRequest, genericGetRequest, genericPutRequest } from '@/utils/request';
import {
    AddBusinessUserPayload,
    UserProfileResponse,
    UserProfileStatus,
    BusinessUserResponse,
    UserProfile,
} from '@/pages/Settings/types';

import { SignupError } from '@/pages/auth/signup/types';

export interface State {
    status: Status;
    authRequestStatus: AuthRequestStatus;
    authenticatedUser: object;
    error: string;
    signupError: SignupError;
    loginError: string;
    errorCode: any;
    secretQuestions: Array<SecretQuestion>;
    accountCreationStatus: Status;
    businessAccountCreationStatus: Status;
    accountVerificationRequest: Status;
    resetPasswordRequest: ResetPasswordRequest;
    sendOtpRequest: Status;
    verifyOtpStatus: Status;
    userProfileStatus: UserProfileStatus;
    userProfile: UserProfileResponse;
    businessUsers: BusinessUserResponse;
    verifyUserProfileUpdateToken: string;
}

@Module({ namespaced: true, name: 'auth' })
export default class Auth extends VuexModule {
    public status: string = Status.NORMAL;
    public authenticatedUser: object = {};
    public verifyUserProfileUpdateToken = '';
    public businessUsers: BusinessUserResponse = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        userKey: '',
    };
    public authRequestStatus: AuthRequestStatus = {
        login: Status.NORMAL,
        addBusinessUser: Status.NORMAL,
        fetchBusinessUsers: Status.NORMAL,
        editUserProfile: Status.NORMAL,
        verifyUserProfileUpdate: Status.NORMAL,
        changePassword: Status.NORMAL,
    };
    public error = '';
    private signupError: SignupError = {
        sendOTP: '',
        verifyOTP: '',
        personalDetails: '',
    };
    public loginError = '';
    public errorCode: any = null;
    public userProfile: UserProfileResponse = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    };
    public secretQuestions: Array<SecretQuestion> = [];
    public accountCreationStatus = Status.NORMAL;
    public accountVerificationRequest = Status.NORMAL;
    public resetPasswordRequest: ResetPasswordRequest = {
        sendResetPasswordEmail: Status.NORMAL,
        resetPassword: Status.NORMAL,
    };
    public userProfileStatus: UserProfileStatus = {
        fetchUserProfile: Status.NORMAL,
    };
    public sendOtpRequest: string = Status.NORMAL;
    public verifyOtpStatus: string = Status.NORMAL;
    public userCredentials: UserAccountInfo = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        phoneNumber: '',
    };
    public isMigrated = false;

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.signupError = { personalDetails: '', sendOTP: '', verifyOTP: '' };
        this.error = '';
    }

    @Mutation
    public [ACTIONS.CREATE_USER_ACCOUNT_SUCCESS](payload: any) {
        this.accountCreationStatus = Status.SUCCESS;
        SessionStorageService.setItem('token', payload);
        this.authenticatedUser = SessionStorageService.decodeToken();
    }

    @Mutation
    public [ACTIONS.CREATE_USER_ACCOUNT_LOADING](): void {
        this.accountCreationStatus = Status.LOADING;
        this.signupError.personalDetails = '';
    }

    @Mutation
    public [ACTIONS.CREATE_USER_ACCOUNT_ERROR](error: RequestErrorObject): void {
        this.signupError.personalDetails = error.message;
        this.errorCode = error.code;
        this.accountCreationStatus = Status.ERROR;
    }

    @Action
    public createUserAccount(userCredentials: UserAccountInfo) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/sign-up',
            [
                ACTIONS.CREATE_USER_ACCOUNT_LOADING,
                ACTIONS.CREATE_USER_ACCOUNT_SUCCESS,
                ACTIONS.CREATE_USER_ACCOUNT_ERROR,
            ],
            userCredentials,
        );
    }

    @Mutation
    public [ACTIONS.LOGIN_SUCCESS](payload: any) {
        this.authRequestStatus.login = Status.SUCCESS;
        SessionStorageService.setItem('token', payload.accessToken);
    }

    @Mutation
    public [ACTIONS.LOGIN_LOADING](): void {
        this.authRequestStatus.login = Status.LOADING;
        this.loginError = '';
    }

    @Mutation
    public [ACTIONS.LOGIN_ERROR](error: RequestErrorObject): void {
        this.loginError = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.login = Status.ERROR;
    }

    @Action
    public login(loginCredentials: LoginInfo) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/authenticate',
            [ACTIONS.LOGIN_LOADING, ACTIONS.LOGIN_SUCCESS, ACTIONS.LOGIN_ERROR],
            loginCredentials,
        );
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_ACCOUNT_SUCCESS]() {
        this.accountVerificationRequest = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_ACCOUNT_LOADING](): void {
        this.accountVerificationRequest = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_ACCOUNT_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.accountVerificationRequest = Status.ERROR;
    }

    @Action
    public verifyUserAccount(verificationToken: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/identity-service/validate-email?token=${verificationToken}`, [
            ACTIONS.VERIFY_USER_ACCOUNT_LOADING,
            ACTIONS.VERIFY_USER_ACCOUNT_SUCCESS,
            ACTIONS.VERIFY_USER_ACCOUNT_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_EMAIL_LOADING](): void {
        this.resetPasswordRequest.sendResetPasswordEmail = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_EMAIL_SUCCESS](): void {
        this.resetPasswordRequest.sendResetPasswordEmail = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_EMAIL_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.resetPasswordRequest.sendResetPasswordEmail = Status.ERROR;
    }

    @Action
    public sendResetPasswordEmailToUser(userEmail: LoginEmailValidation) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/request-password-reset',
            [
                ACTIONS.RESET_PASSWORD_EMAIL_LOADING,
                ACTIONS.RESET_PASSWORD_EMAIL_SUCCESS,
                ACTIONS.RESET_PASSWORD_EMAIL_ERROR,
            ],
            userEmail,
        );
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_LOADING](): void {
        this.resetPasswordRequest.resetPassword = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_SUCCESS](): void {
        this.resetPasswordRequest.resetPassword = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.RESET_PASSWORD_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.resetPasswordRequest.resetPassword = Status.ERROR;
    }

    @Action
    public resetPassword(passwordCredentials: ResetPasswordPayload) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/reset-password',
            [ACTIONS.RESET_PASSWORD_LOADING, ACTIONS.RESET_PASSWORD_SUCCESS, ACTIONS.RESET_PASSWORD_ERROR],
            passwordCredentials,
        );
    }

    @Mutation
    public [ACTIONS.SEND_OTP_LOADING](): void {
        this.sendOtpRequest = Status.LOADING;
        this.signupError.sendOTP = '';
    }

    @Mutation
    public [ACTIONS.SEND_OTP_SUCCESS]() {
        this.sendOtpRequest = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.SEND_OTP_ERROR](error: RequestErrorObject): void {
        this.signupError.sendOTP = error.message;
        this.errorCode = error.code;
        this.sendOtpRequest = Status.ERROR;
    }

    @Action
    public sendOtpToUser(userNumberObject: LoginPhoneNumberValidation) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/request-otp',
            [ACTIONS.SEND_OTP_LOADING, ACTIONS.SEND_OTP_SUCCESS, ACTIONS.SEND_OTP_ERROR],
            userNumberObject,
        );
    }

    @Mutation
    public [ACTIONS.VERIFY_OTP_LOADING](): void {
        this.verifyOtpStatus = Status.LOADING;
        this.signupError.verifyOTP = '';
    }

    @Mutation
    public [ACTIONS.VERIFY_OTP_SUCCESS]() {
        this.verifyOtpStatus = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.VERIFY_OTP_ERROR](error: RequestErrorObject): void {
        this.signupError.verifyOTP = error.message;
        this.errorCode = error.code;
        this.verifyOtpStatus = Status.ERROR;
    }

    @Action
    public sendOtpValidation(userOtp: SignupOtpValidation) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/verify-otp',
            [ACTIONS.VERIFY_OTP_LOADING, ACTIONS.VERIFY_OTP_SUCCESS, ACTIONS.VERIFY_OTP_ERROR],
            userOtp,
        );
    }

    @Mutation
    public [ACTIONS.ADD_BUSINESS_USER_SUCCESS]() {
        this.authRequestStatus.addBusinessUser = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.ADD_BUSINESS_USER_LOADING](): void {
        this.authRequestStatus.addBusinessUser = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.ADD_BUSINESS_USER_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.addBusinessUser = Status.ERROR;
    }

    @Action
    public addBusinessUser(userCredentials: AddBusinessUserPayload) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            'identity-service/add-new-user',
            [ACTIONS.ADD_BUSINESS_USER_LOADING, ACTIONS.ADD_BUSINESS_USER_SUCCESS, ACTIONS.ADD_BUSINESS_USER_ERROR],
            userCredentials,
        );
    }

    @Mutation
    public [ACTIONS.FETCH_USER_PROFILE_SUCCESS](payload: UserProfileResponse) {
        this.userProfileStatus.fetchUserProfile = Status.SUCCESS;
        this.userProfile = payload;
    }

    @Mutation
    public [ACTIONS.FETCH_USER_PROFILE_LOADING](): void {
        this.userProfileStatus.fetchUserProfile = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.FETCH_USER_PROFILE_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.userProfileStatus.fetchUserProfile = Status.ERROR;
    }

    @Action
    public fetchUserProfile(userKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/identity-service/get-user-detail/${userKey}`, [
            ACTIONS.FETCH_USER_PROFILE_LOADING,
            ACTIONS.FETCH_USER_PROFILE_SUCCESS,
            ACTIONS.FETCH_USER_PROFILE_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.FETCH_BUSINESS_USERS_SUCCESS](payload: BusinessUserResponse) {
        this.authRequestStatus.fetchBusinessUsers = Status.SUCCESS;
        this.businessUsers = payload;
    }

    @Mutation
    public [ACTIONS.FETCH_BUSINESS_USERS_LOADING](): void {
        this.authRequestStatus.fetchBusinessUsers = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.FETCH_BUSINESS_USERS_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.fetchBusinessUsers = Status.ERROR;
    }

    @Action
    public fetchBusinessUsers() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'identity-service/get-users', [
            ACTIONS.FETCH_BUSINESS_USERS_LOADING,
            ACTIONS.FETCH_BUSINESS_USERS_SUCCESS,
            ACTIONS.FETCH_BUSINESS_USERS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.EDIT_USER_PROFILE_SUCCESS](payload: string) {
        this.verifyUserProfileUpdateToken = payload;
        this.authRequestStatus.editUserProfile = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.EDIT_USER_PROFILE_LOADING](): void {
        this.authRequestStatus.editUserProfile = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.EDIT_USER_PROFILE_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.editUserProfile = Status.ERROR;
    }

    @Action
    public editUserProfile({
        updatedUserCredentials,
        userKey,
    }: {
        updatedUserCredentials: AddBusinessUserPayload | UserProfile;
        userKey: string;
    }) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `identity-service/edit-user-profile/${userKey}`,
            [ACTIONS.EDIT_USER_PROFILE_LOADING, ACTIONS.EDIT_USER_PROFILE_SUCCESS, ACTIONS.EDIT_USER_PROFILE_ERROR],
            updatedUserCredentials,
        );
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_PROFILE_UPDATE_SUCCESS]() {
        this.authRequestStatus.verifyUserProfileUpdate = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_PROFILE_UPDATE_LOADING](): void {
        this.authRequestStatus.verifyUserProfileUpdate = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.VERIFY_USER_PROFILE_UPDATE_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.verifyUserProfileUpdate = Status.ERROR;
    }

    @Action
    public verifyUserProfileUpdate({ token, userKey }: { token: string; userKey: string }) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            `identity-service/verify-user-profile-update/${userKey}`,
            [
                ACTIONS.VERIFY_USER_PROFILE_UPDATE_LOADING,
                ACTIONS.VERIFY_USER_PROFILE_UPDATE_SUCCESS,
                ACTIONS.VERIFY_USER_PROFILE_UPDATE_ERROR,
            ],
            { token },
        );
    }

    @Mutation
    public [ACTIONS.RESET_LOGIN_ERROR_STATE](): void {
        this.loginError = '';
    }

    @Action
    public resetLoginErrorState(): void {
        this.context.commit(ACTIONS.RESET_LOGIN_ERROR_STATE);
    }

    @Mutation
    public [ACTIONS.RESET_SIGNUP_ERROR_STATE](): void {
        this.signupError = {
            sendOTP: '',
            verifyOTP: '',
            personalDetails: '',
        };
    }

    @Action
    public resetSignupErrorState(): void {
        this.context.commit(ACTIONS.RESET_SIGNUP_ERROR_STATE);
    }

    @Mutation
    public [ACTIONS.CHANGE_PASSWORD_LOADING](): void {
        this.authRequestStatus.changePassword = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.CHANGE_PASSWORD_SUCCESS](): void {
        this.authRequestStatus.changePassword = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.CHANGE_PASSWORD_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.authRequestStatus.changePassword = Status.ERROR;
    }

    @Action
    public changePassword(passwordDetails: { oldPassword: string; newPassword: string }) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/change-password',
            [ACTIONS.CHANGE_PASSWORD_LOADING, ACTIONS.CHANGE_PASSWORD_SUCCESS, ACTIONS.CHANGE_PASSWORD_ERROR],
            passwordDetails,
        );
    }
}
