/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

//import * as ACTIONS from '@/store/constants';
import * as ACTIONS from '@/store/general-constants';

import { Status, PaymentType, CompanyLogoRequest, CompanyInfo, UploadLogoPayload, UploadedFile } from '@/types';

import { genericGetRequest, genericPostRequest } from '@/utils/request';

export interface State {
    status: Status;
    error: any;
    errorCode: any;
    paymentTypes: PaymentType;
    companyLogoRequest: CompanyLogoRequest;
    companyLogoError: any;
    companyInfo: CompanyInfo;
    mobileBackButtonClicked: boolean;
    mobileCancelButtonClicked: boolean;
    mobileCartButtonClicked: boolean;
    inputFieldIsFocusedOn: boolean;
}

@Module({ namespaced: true, name: 'general' })
export default class General extends VuexModule {
    public status: string = Status.NORMAL;
    public error: any = null;
    public errorCode: any = null;
    public paymentTypes: PaymentType[] = [];
    public companyLogoRequest: CompanyLogoRequest = {
        uploadLogo: Status.NORMAL,
        getLogoAndAddress: Status.NORMAL,
    };
    public companyLogoError: any = null;
    public companyInfo: CompanyInfo = {
        logo: '',
        address: '',
    };
    public mobileBackButtonClicked = false;
    public mobileCancelButtonClicked = false;
    public mobileCartButtonClicked = false;
    public uploadedFile: UploadedFile = {
        fileTag: '',
        fileUrl: '',
    };
    public inputFieldIsFocusedOn = false;

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_TYPES_ERROR](error: any) {
        this.error = error.message;
        this.errorCode = error.code;
        this.status = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_TYPES_LOADING]() {
        this.status = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_TYPES_SUCCESS](payload: PaymentType[]) {
        this.status = Status.SUCCESS;
        this.paymentTypes = payload;
    }

    @Action
    getPaymentTypes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'v1/account-service/get-payment-types', [
            ACTIONS.GET_PAYMENT_TYPES_LOADING,
            ACTIONS.GET_PAYMENT_TYPES_SUCCESS,
            ACTIONS.GET_PAYMENT_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPLOAD_COMPANY_LOGO_LOADING]() {
        this.companyLogoRequest.uploadLogo = Status.LOADING;
        this.error = null;
        this.errorCode = null;
    }

    @Mutation
    public [ACTIONS.UPLOAD_COMPANY_LOGO_SUCCESS](payload: UploadLogoPayload) {
        this.companyLogoRequest.uploadLogo = Status.SUCCESS;
        this.companyInfo.logo = payload.logoUrl;
        this.error = null;
        this.errorCode = null;
    }

    @Mutation
    public [ACTIONS.UPLOAD_COMPANY_LOGO_ERROR](error: any) {
        this.companyLogoError = error.message;
        this.errorCode = error.code;
        this.companyLogoRequest.uploadLogo = Status.ERROR;
    }

    @Action
    public uploadLogo(formDatalogoFile: object) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/upload-logo',
            [
                ACTIONS.UPLOAD_COMPANY_LOGO_LOADING,
                ACTIONS.UPLOAD_COMPANY_LOGO_SUCCESS,
                ACTIONS.UPLOAD_COMPANY_LOGO_ERROR,
            ],
            formDatalogoFile,
        );
    }

    @Mutation
    public [ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_LOADING]() {
        this.companyLogoRequest.getLogoAndAddress = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_SUCCESS](payload: any) {
        this.companyLogoRequest.getLogoAndAddress = Status.SUCCESS;
        this.companyInfo.logo = payload.logoUrl;
        this.companyInfo.address = payload.address;
    }

    @Mutation
    public [ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_ERROR](error: any) {
        this.companyLogoError = error.message;
        this.errorCode = error.code;
        this.companyLogoRequest.getLogoAndAddress = Status.ERROR;
    }

    @Action
    getCompanyInfo() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/invoice-header-address-and-logo', [
            ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_LOADING,
            ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_SUCCESS,
            ACTIONS.FETCH_COMPANY_LOGO_AND_ADDRESS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_BACK_BUTTON_STATE_TO_TRUE]() {
        this.mobileBackButtonClicked = true;
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_BACK_BUTTON_STATE_TO_FALSE]() {
        this.mobileBackButtonClicked = false;
    }

    @Action
    setMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.context.commit(ACTIONS.SET_NAVBAR_BACK_BUTTON_STATE_TO_TRUE);
            return;
        }
        this.context.commit(ACTIONS.SET_NAVBAR_BACK_BUTTON_STATE_TO_FALSE);
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_CART_BUTTON_STATE_TO_TRUE]() {
        this.mobileCartButtonClicked = true;
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_CART_BUTTON_STATE_TO_FALSE]() {
        this.mobileCartButtonClicked = false;
    }

    @Action
    setMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.context.commit(ACTIONS.SET_NAVBAR_CART_BUTTON_STATE_TO_TRUE);
            return;
        }
        this.context.commit(ACTIONS.SET_NAVBAR_CART_BUTTON_STATE_TO_FALSE);
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_CANCEL_BUTTON_STATE_TO_TRUE]() {
        this.mobileCancelButtonClicked = true;
    }

    @Mutation
    public [ACTIONS.SET_NAVBAR_CANCEL_BUTTON_STATE_TO_FALSE]() {
        this.mobileCancelButtonClicked = false;
    }

    @Action
    setMobileCancelButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.context.commit(ACTIONS.SET_NAVBAR_CANCEL_BUTTON_STATE_TO_TRUE);
            return;
        }
        this.context.commit(ACTIONS.SET_NAVBAR_CANCEL_BUTTON_STATE_TO_FALSE);
    }

    @Mutation
    public [ACTIONS.UPLOAD_FILE_LOADING]() {
        this.status = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPLOAD_FILE_ERROR](error: any) {
        this.error = error.message;
        this.errorCode = error.code;
        this.status = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.UPLOAD_FILE_SUCCESS](payload: UploadedFile) {
        this.status = Status.SUCCESS;
        this.uploadedFile = payload;
    }

    @Action
    uploadFile(fileToBeUploaded: FormData) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/utility-service/upload-file',
            [ACTIONS.UPLOAD_FILE_LOADING, ACTIONS.UPLOAD_FILE_SUCCESS, ACTIONS.UPLOAD_FILE_ERROR],
            fileToBeUploaded,
        );
    }

    @Mutation
    public [ACTIONS.SET_FOCUS_ON_INPUT_FIELD](isFocused: boolean) {
        this.inputFieldIsFocusedOn = isFocused;
    }

    @Action
    public setFocusOnInputField(isFocused: boolean) {
        if (isFocused) {
            this.context.commit(ACTIONS.SET_FOCUS_ON_INPUT_FIELD, true);
            return;
        }
        this.context.commit(ACTIONS.SET_FOCUS_ON_INPUT_FIELD, false);
    }
}
