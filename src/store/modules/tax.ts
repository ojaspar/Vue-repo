import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/tax-module-constants';

import { CountryState, ErrorObject, Status } from '@/types';

import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';
import {
    TaxContactDetails,
    TaxProfile,
    TaxProfileRegistrationForm,
    TaxRequestStatus,
    TaxStation,
    TaxProfileRegistrationPayload,
    defaultTaxRegistrationProfile,
    TaxStationJurisdiction,
    TaxLiability,
    TaxLiabilityRemittanceForm,
    TaxType,
    TaxLiabilityTransaction,
} from '@/pages/TaxAndRemittance/types';

export interface State {
    taxRequestStatus: TaxRequestStatus;
    error: null | string | number;
    errorCode: null | string | number;
    taxContactDetails: TaxContactDetails;
    taxProfiles: Array<TaxProfile>;
    taxStates: Array<CountryState>;
    taxStations: Array<TaxStation>;
    taxTypes: Array<TaxType>;
    taxLiabilityTransactions: Array<TaxLiabilityTransaction>;
}

@Module({ namespaced: true, name: 'tax' })
export default class Tax extends VuexModule {
    public taxRequestStatus: TaxRequestStatus = {
        getTaxContactDetails: Status.NORMAL,
        updateTaxContactDetails: Status.NORMAL,
        getTaxProfiles: Status.NORMAL,
        getTaxStates: Status.NORMAL,
        getTaxStations: Status.NORMAL,
        createTaxProfile: Status.NORMAL,
        fetchTaxLiabilities: Status.NORMAL,
        remitTax: Status.NORMAL,
        getTaxTypes: Status.NORMAL,
        getTaxLiabilityTransactions: Status.NORMAL,
    };
    public error: null | string = null;
    public errorCode: null | string = null;
    public taxContactDetails: TaxContactDetails = {
        email: '',
        operatingAddress: '',
        phoneNumber: '',
    };
    public taxProfiles: Array<TaxProfile> = [];
    public taxStates: Array<CountryState> = [];
    public taxStations: Array<TaxStation> = [];
    public taxProfileRequestBody: TaxProfileRegistrationForm = {
        ...defaultTaxRegistrationProfile,
    };
    public taxLiabilities: Array<TaxLiability> = [];
    public taxLiabilityRemittance: TaxLiabilityRemittanceForm = {
        amountPaid: { currencyKey: 0, amount: 0 },
        paymentAccountKey: '',
        taxLiabilitySumKey: '',
        transactionDate: '',
    };
    public taxTypes: Array<TaxType> = [];
    public taxLiabilityTransactions: Array<TaxLiabilityTransaction> = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_CONTACT_DETAILS_LOADING]() {
        this.taxRequestStatus.getTaxContactDetails = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_CONTACT_DETAILS_SUCCESS](payload: TaxContactDetails) {
        this.taxRequestStatus.getTaxContactDetails = Status.SUCCESS;
        this.taxContactDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_TAX_CONTACT_DETAILS_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxContactDetails = Status.ERROR;
    }

    @Action
    getTaxContactDetails() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/tax-service/get-tax-contact-detail', [
            ACTIONS.GET_TAX_CONTACT_DETAILS_LOADING,
            ACTIONS.GET_TAX_CONTACT_DETAILS_SUCCESS,
            ACTIONS.GET_TAX_CONTACT_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_TAX_CONTACT_DETAILS_LOADING]() {
        this.taxRequestStatus.updateTaxContactDetails = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_TAX_CONTACT_DETAILS_SUCCESS](payload: TaxContactDetails) {
        this.taxRequestStatus.updateTaxContactDetails = Status.SUCCESS;
        this.taxContactDetails = payload;
    }

    @Mutation
    public [ACTIONS.UPDATE_TAX_CONTACT_DETAILS_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.updateTaxContactDetails = Status.ERROR;
    }

    @Action
    updateTaxContactDetails(taxContactDetails: TaxContactDetails) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            '/tax-service/update-tax-contact',
            [
                ACTIONS.UPDATE_TAX_CONTACT_DETAILS_LOADING,
                ACTIONS.UPDATE_TAX_CONTACT_DETAILS_SUCCESS,
                ACTIONS.UPDATE_TAX_CONTACT_DETAILS_ERROR,
            ],
            taxContactDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_TAX_PROFILES_LOADING]() {
        this.taxRequestStatus.getTaxProfiles = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_PROFILES_SUCCESS](payload: Array<TaxProfile>) {
        this.taxRequestStatus.getTaxProfiles = Status.SUCCESS;
        this.taxProfiles = payload;
    }

    @Mutation
    public [ACTIONS.GET_TAX_PROFILES_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxContactDetails = Status.ERROR;
    }

    @Action
    getTaxProfiles() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/tax-service/get-tax-profiles', [
            ACTIONS.GET_TAX_PROFILES_LOADING,
            ACTIONS.GET_TAX_PROFILES_SUCCESS,
            ACTIONS.GET_TAX_PROFILES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATES_LOADING]() {
        this.taxRequestStatus.getTaxStates = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATES_SUCCESS](payload: Array<CountryState>) {
        this.taxRequestStatus.getTaxStates = Status.SUCCESS;

        const lagos = payload.find((state: CountryState) => state.name === 'Lagos');
        if (lagos) this.taxStates.push(lagos);
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATES_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxStates = Status.ERROR;
    }

    @Action
    getTaxStates() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/tax-service/get-states', [
            ACTIONS.GET_TAX_STATES_LOADING,
            ACTIONS.GET_TAX_STATES_SUCCESS,
            ACTIONS.GET_TAX_STATES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATIONS_LOADING]() {
        this.taxRequestStatus.getTaxStations = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATIONS_SUCCESS](payload: Array<TaxStation>) {
        this.taxRequestStatus.getTaxStations = Status.SUCCESS;
        this.taxStations = payload;
    }

    @Mutation
    public [ACTIONS.GET_TAX_STATIONS_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxStations = Status.ERROR;
    }

    @Action
    getTaxStations(stateKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/tax-service/get-tax-stations/${stateKey}`, [
            ACTIONS.GET_TAX_STATIONS_LOADING,
            ACTIONS.GET_TAX_STATIONS_SUCCESS,
            ACTIONS.GET_TAX_STATIONS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_TAX_PROFILE_LOADING]() {
        this.taxRequestStatus.createTaxProfile = Status.LOADING;
        this.error = null;
        this.errorCode = null;
    }

    @Mutation
    public [ACTIONS.CREATE_TAX_PROFILE_SUCCESS](payload: TaxProfileRegistrationPayload) {
        const taxStation = this.taxStations.find((taxStation: TaxStation) => taxStation.key === payload.taxStationKey);

        const newTaxProfile: TaxProfile = {
            taxIdentity: payload.taxIdentity,
            cacForm101: payload.cacForm101,
            cacForm102: payload.cacForm102,
            cacForm103: payload.cacForm103,
            taxProfileKey: payload.taxProfileKey,
            taxProfileType:
                payload.taxProfileType === TaxStationJurisdiction.FEDERAL.toLowerCase()
                    ? TaxStationJurisdiction.FEDERAL
                    : TaxStationJurisdiction.STATE,

            taxStation: {
                name: taxStation?.name || '',
                stateKey: this.taxProfileRequestBody.taxStationStateKey,
                stationKey: taxStation?.key || '',
            },
        };
        this.taxRequestStatus.createTaxProfile = Status.SUCCESS;
        this.taxProfiles.push(newTaxProfile);
    }

    @Mutation
    public [ACTIONS.CREATE_TAX_PROFILE_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.createTaxProfile = Status.ERROR;
    }

    @Mutation
    public persistTaxProfileRequestBody(taxProfile: TaxProfileRegistrationForm) {
        this.taxProfileRequestBody = taxProfile;
    }

    @Action
    createTaxProfile(newTaxProfile: TaxProfileRegistrationForm) {
        this.context.commit('clearErrors');

        this.context.commit('persistTaxProfileRequestBody', newTaxProfile);

        return genericPostRequest(
            this.context.commit,
            '/tax-service/create-tax-profile',
            [ACTIONS.CREATE_TAX_PROFILE_LOADING, ACTIONS.CREATE_TAX_PROFILE_SUCCESS, ACTIONS.CREATE_TAX_PROFILE_ERROR],
            newTaxProfile,
        );
    }

    @Mutation
    public [ACTIONS.FETCH_TAX_LIABILITIES_LOADING]() {
        this.taxRequestStatus.fetchTaxLiabilities = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.FETCH_TAX_LIABILITIES_SUCCESS](payload: Array<TaxLiability>) {
        this.taxRequestStatus.fetchTaxLiabilities = Status.SUCCESS;
        this.taxLiabilities = payload;
    }

    @Mutation
    public [ACTIONS.FETCH_TAX_LIABILITIES_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.fetchTaxLiabilities = Status.ERROR;
    }

    @Action
    getTaxLiabilities() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/tax-service/tax-liabilities', [
            ACTIONS.FETCH_TAX_LIABILITIES_LOADING,
            ACTIONS.FETCH_TAX_LIABILITIES_SUCCESS,
            ACTIONS.FETCH_TAX_LIABILITIES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.REMIT_TAX_LIABILITY_LOADING]() {
        this.taxRequestStatus.remitTax = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.REMIT_TAX_LIABILITY_SUCCESS]() {
        const { amountPaid, taxLiabilitySumKey } = this.taxLiabilityRemittance;

        this.taxRequestStatus.remitTax = Status.SUCCESS;

        if (!taxLiabilitySumKey) return;

        const taxLiability = this.taxLiabilities.find(
            (taxLiability: TaxLiability) => taxLiability.taxLiabilitySumKey === taxLiabilitySumKey,
        );

        if (!taxLiability) return;

        const { amountPaid: amountPaidSoFar, taxPayable } = taxLiability;
        const totalAmountPaidSoFar = amountPaidSoFar.amount + amountPaid.amount;

        taxLiability.amountPaid.amount = totalAmountPaidSoFar;
        taxLiability.balance.amount = taxPayable.amount - totalAmountPaidSoFar;
    }

    @Mutation
    public [ACTIONS.REMIT_TAX_LIABILITY_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.remitTax = Status.ERROR;
    }

    @Mutation
    public persistTaxLiabilityRemittance(taxLiabilityRemittance: TaxLiabilityRemittanceForm) {
        this.taxLiabilityRemittance = taxLiabilityRemittance;
    }

    @Action
    remitTax(taxLiabilityRemittance: TaxLiabilityRemittanceForm) {
        this.context.commit('clearErrors');
        this.context.commit('persistTaxLiabilityRemittance', taxLiabilityRemittance);

        let endpoint = 'tax-liability-payment';

        if (!taxLiabilityRemittance.taxLiabilitySumKey) {
            endpoint = 'arbitrary-tax-payment';
        }

        return genericPostRequest(
            this.context.commit,
            `/tax-service/${endpoint}`,
            [
                ACTIONS.REMIT_TAX_LIABILITY_LOADING,
                ACTIONS.REMIT_TAX_LIABILITY_SUCCESS,
                ACTIONS.REMIT_TAX_LIABILITY_ERROR,
            ],
            taxLiabilityRemittance,
        );
    }

    @Mutation
    public [ACTIONS.GET_TAX_TYPES_LOADING]() {
        this.taxRequestStatus.getTaxTypes = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_TYPES_SUCCESS](payload: Array<TaxType>) {
        this.taxRequestStatus.getTaxTypes = Status.SUCCESS;
        this.taxTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_TAX_TYPES_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxTypes = Status.ERROR;
    }

    @Action
    getTaxypes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/tax-service/tax-types', [
            ACTIONS.GET_TAX_TYPES_LOADING,
            ACTIONS.GET_TAX_TYPES_SUCCESS,
            ACTIONS.GET_TAX_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_LOADING]() {
        this.taxRequestStatus.getTaxLiabilityTransactions = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_SUCCESS](payload: Array<TaxLiabilityTransaction>) {
        this.taxRequestStatus.getTaxLiabilityTransactions = Status.SUCCESS;
        this.taxLiabilityTransactions = payload;
    }

    @Mutation
    public [ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_ERROR](error: ErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.taxRequestStatus.getTaxLiabilityTransactions = Status.ERROR;
    }

    @Action
    getTaxLiabilityTransactions(taxLiabilitySumKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/tax-service/tax-liability-transactions/${taxLiabilitySumKey}`, [
            ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_LOADING,
            ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_SUCCESS,
            ACTIONS.GET_TAX_LIABILITY_TRANSACTIONS_ERROR,
        ]);
    }
}
