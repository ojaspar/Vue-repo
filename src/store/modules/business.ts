/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';

import {
    BusinessVertical,
    Status,
    BusinessRegistrationType,
    Country,
    CountryState,
    RequestErrorObject,
    BusinessRequestStatus,
    BusinessData,
    defaultBusinessDetails,
    LGA,
    BusinessProfile,
} from '@/types';

import { genericPostRequest, genericGetRequest, genericPutRequest } from '@/utils/request';

import SessionStorageService from '@/services/sessionStorage';

import { AssetTypeData, BusinessMigrationData, CurrencyKeyListData } from '@/pages/DataMigration/types';

export interface State {
    user: object;
    error: any;
    businessRequestStatus: BusinessRequestStatus;
    errorCode: any;
    businessVerticals: Array<BusinessVertical>;
    businessRegistrationTypes: Array<BusinessRegistrationType>;
    countries: Country[];
    lgas: LGA[];
    states: Array<CountryState>;
    businessData: BusinessMigrationData;
    businessInfo: BusinessData;
    isMigrated: boolean;
}

@Module({ namespaced: true, name: 'business' })
export default class Business extends VuexModule {
    public businessRequestStatus: BusinessRequestStatus = {
        getStates: Status.NORMAL,
        getLGAs: Status.NORMAL,
        getBusinessRegistrationTypes: Status.NORMAL,
        getBusinessVerticals: Status.NORMAL,
        getCountries: Status.NORMAL,
        getBusinessAssetTypes: Status.NORMAL,
        getPaymentCurrentKeyList: Status.NORMAL,
        registerBusiness: Status.NORMAL,
        migrateBusinessData: Status.NORMAL,
        getBusinessData: Status.NORMAL,
        getBusinessDetails: Status.NORMAL,
        editBusinessProfile: Status.NORMAL,
        verifyBusinessProfileUpdate: Status.NORMAL,
        getDataMigrationStatus: Status.NORMAL,
    };
    public verifyBusinessUpdateToken = '';
    public user: object = {};
    public error: any = '';
    public errorCode: any = null;
    public lgas: Array<LGA> = [];
    public businessVerticals: Array<BusinessVertical> = [];
    public businessInfo: BusinessData = { ...defaultBusinessDetails };
    public businessAssetTypes: Array<AssetTypeData> = [];
    public currencyKeyList: Array<CurrencyKeyListData> = [];
    public businessRegistrationTypes: Array<BusinessRegistrationType> = [];
    public states: Array<CountryState> = [];
    public cities: Array<CountryState> = [];
    public countries: Array<Country> = [];
    public businessData: BusinessMigrationData = {
        financialYearStartMonth: '',
        financialYearMonthName: '',
        cashBalance: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearSales: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearExpenses: {
            currencyKey: 0,
            amount: 0,
        },
        creditorList: [],
        debtorList: [],
        bankAccountList: [],
        assetList: [],
    };
    public isMigrated = false;

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_VERTICALS_SUCCESS](payload: BusinessVertical[]) {
        this.businessVerticals = payload;
        this.businessRequestStatus.getBusinessVerticals = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_VERTICALS_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getBusinessVerticals = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_VERTICALS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getBusinessVerticals = Status.ERROR;
    }

    @Action
    public getBusinessVerticals() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/verticals', [
            ACTIONS.GET_BUSINESS_VERTICALS_LOADING,
            ACTIONS.GET_BUSINESS_VERTICALS_SUCCESS,
            ACTIONS.GET_BUSINESS_VERTICALS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_SUCCESS](payload: BusinessRegistrationType[]) {
        this.businessRegistrationTypes = payload;
        this.businessRequestStatus.getBusinessRegistrationTypes = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getBusinessRegistrationTypes = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getBusinessRegistrationTypes = Status.ERROR;
    }

    @Action
    getBusinessRegistrationTypes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/business-registration-types', [
            ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_LOADING,
            ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_SUCCESS,
            ACTIONS.GET_BUSINESS_REGISTRATION_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_STATES_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getStates = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_STATES_SUCCESS](payload: CountryState[]) {
        this.states = payload;
        this.businessRequestStatus.getStates = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_STATES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getStates = Status.ERROR;
    }

    @Action
    getStates() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/states', [
            ACTIONS.GET_STATES_LOADING,
            ACTIONS.GET_STATES_SUCCESS,
            ACTIONS.GET_STATES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_LGAS_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getLGAs = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_LGAS_SUCCESS](payload: LGA[]) {
        this.lgas = payload;
        this.businessRequestStatus.getLGAs = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_LGAS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getLGAs = Status.ERROR;
    }

    @Action
    getLGAs(stateKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/identity-service/lgas/${stateKey}`, [
            ACTIONS.GET_LGAS_LOADING,
            ACTIONS.GET_LGAS_SUCCESS,
            ACTIONS.GET_LGAS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_COUNTRIES_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getCountries = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_COUNTRIES_SUCCESS](payload: []) {
        this.countries = payload;
        this.businessRequestStatus.getCountries = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_COUNTRIES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getCountries = Status.ERROR;
    }

    @Action
    getCountries() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/countries', [
            ACTIONS.GET_COUNTRIES_LOADING,
            ACTIONS.GET_COUNTRIES_SUCCESS,
            ACTIONS.GET_COUNTRIES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.REGISTER_BUSINESS_LOADING]() {
        this.error = '';
        this.businessRequestStatus.registerBusiness = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.REGISTER_BUSINESS_SUCCESS](userToken: string) {
        SessionStorageService.setItem('token', userToken);
        this.user = SessionStorageService.decodeToken();
        this.businessRequestStatus.registerBusiness = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.REGISTER_BUSINESS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.registerBusiness = Status.ERROR;
    }

    @Action
    registerBusiness(businessDetails: object) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/create-business',
            [ACTIONS.REGISTER_BUSINESS_LOADING, ACTIONS.REGISTER_BUSINESS_SUCCESS, ACTIONS.REGISTER_BUSINESS_ERROR],
            businessDetails,
        );
    }
    @Mutation
    public [ACTIONS.GET_BUSINESS_ASSET_TYPES_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getBusinessAssetTypes = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_ASSET_TYPES_SUCCESS](payload: Array<AssetTypeData>) {
        this.businessAssetTypes = payload;
        this.businessRequestStatus.getBusinessAssetTypes = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_ASSET_TYPES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getBusinessAssetTypes = Status.ERROR;
    }

    @Action
    getBusinessAssetTypes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'identity-service/get-business-asset-types', [
            ACTIONS.GET_BUSINESS_ASSET_TYPES_LOADING,
            ACTIONS.GET_BUSINESS_ASSET_TYPES_SUCCESS,
            ACTIONS.GET_BUSINESS_ASSET_TYPES_ERROR,
        ]);
    }
    @Mutation
    public [ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getPaymentCurrentKeyList = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_SUCCESS](payload: Array<CurrencyKeyListData>) {
        this.currencyKeyList = payload;
        this.businessRequestStatus.getPaymentCurrentKeyList = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getPaymentCurrentKeyList = Status.ERROR;
    }

    @Action
    getPaymentCurrencyKeyList() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/payment-currency-keys', [
            ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_LOADING,
            ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_SUCCESS,
            ACTIONS.GET_PAYMENT_CURRENCY_KEY_LIST_ERROR,
        ]);
    }
    @Mutation
    public [ACTIONS.MIGRATE_BUSINESS_DATA_LOADING]() {
        this.error = '';
        this.businessRequestStatus.migrateBusinessData = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.MIGRATE_BUSINESS_DATA_SUCCESS]() {
        this.businessRequestStatus.migrateBusinessData = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.MIGRATE_BUSINESS_DATA_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.migrateBusinessData = Status.ERROR;
    }

    @Action
    migrateBusinessData(businessData: object) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/business-data-setup',
            [
                ACTIONS.MIGRATE_BUSINESS_DATA_LOADING,
                ACTIONS.MIGRATE_BUSINESS_DATA_SUCCESS,
                ACTIONS.MIGRATE_BUSINESS_DATA_ERROR,
            ],
            businessData,
        );
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DATA_LOADING]() {
        this.error = '';
        this.businessRequestStatus.getBusinessData = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DATA_SUCCESS](payload: BusinessMigrationData) {
        this.businessRequestStatus.getBusinessData = Status.SUCCESS;
        this.businessData = payload;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DATA_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getBusinessData = Status.ERROR;
    }

    @Action
    getBusinessData() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/get-business-data-setup', [
            ACTIONS.GET_BUSINESS_DATA_LOADING,
            ACTIONS.GET_BUSINESS_DATA_SUCCESS,
            ACTIONS.GET_BUSINESS_DATA_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DETAILS_LOADING]() {
        this.error = null;
        this.businessRequestStatus.getBusinessDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DETAILS_SUCCESS](payload: BusinessData) {
        this.businessRequestStatus.getBusinessDetails = Status.SUCCESS;
        this.businessInfo = payload;
    }

    @Mutation
    public [ACTIONS.GET_BUSINESS_DETAILS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getBusinessDetails = Status.ERROR;
    }

    @Action
    getBusinessDetails() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/get-business-detail', [
            ACTIONS.GET_BUSINESS_DETAILS_LOADING,
            ACTIONS.GET_BUSINESS_DETAILS_SUCCESS,
            ACTIONS.GET_BUSINESS_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.EDIT_BUSINESS_PROFILE_SUCCESS](payload: string) {
        this.businessRequestStatus.editBusinessProfile = Status.SUCCESS;
        this.verifyBusinessUpdateToken = payload;
    }

    @Mutation
    public [ACTIONS.EDIT_BUSINESS_PROFILE_LOADING](): void {
        this.businessRequestStatus.editBusinessProfile = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.EDIT_BUSINESS_PROFILE_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.editBusinessProfile = Status.ERROR;
    }

    @Action
    public editBusinessProfile({
        businessKey,
        businessCredentials,
    }: {
        businessKey: string;
        businessCredentials: BusinessProfile;
    }) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `identity-service/edit-business-profile/${businessKey}`,
            [
                ACTIONS.EDIT_BUSINESS_PROFILE_LOADING,
                ACTIONS.EDIT_BUSINESS_PROFILE_SUCCESS,
                ACTIONS.EDIT_BUSINESS_PROFILE_ERROR,
            ],
            businessCredentials,
        );
    }
    @Mutation
    public [ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_SUCCESS]() {
        this.businessRequestStatus.verifyBusinessProfileUpdate = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_LOADING](): void {
        this.businessRequestStatus.verifyBusinessProfileUpdate = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.verifyBusinessProfileUpdate = Status.ERROR;
    }

    @Action
    public verifyBusinessProfileUpdate({ businessKey, token }: { businessKey: string; token: string }) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/identity-service/verify-business-profile-update',
            [
                ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_LOADING,
                ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_SUCCESS,
                ACTIONS.VERIFY_BUSINESS_PROFILE_UPDATE_ERROR,
            ],
            { token, businessKey },
        );
    }

    @Mutation
    public [ACTIONS.CHECK_DATA_MIGRATION_STATUS_LOADING](): void {
        this.businessRequestStatus.getDataMigrationStatus = Status.LOADING;
        this.error = '';
    }

    @Mutation
    public [ACTIONS.CHECK_DATA_MIGRATION_STATUS_SUCCESS]({ isMigrated }: { isMigrated: boolean }) {
        this.businessRequestStatus.getDataMigrationStatus = Status.SUCCESS;
        this.isMigrated = isMigrated;
    }

    @Mutation
    public [ACTIONS.CHECK_DATA_MIGRATION_STATUS_ERROR](error: RequestErrorObject): void {
        this.error = error.message;
        this.errorCode = error.code;
        this.businessRequestStatus.getDataMigrationStatus = Status.ERROR;
    }

    @Action
    public getBusinessMigrationStatus() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/identity-service/get-business-migration-status', [
            ACTIONS.CHECK_DATA_MIGRATION_STATUS_LOADING,
            ACTIONS.CHECK_DATA_MIGRATION_STATUS_SUCCESS,
            ACTIONS.CHECK_DATA_MIGRATION_STATUS_ERROR,
        ]);
    }
}
