/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/donation-module-constants';
import { RequestErrorObject, Status } from '@/types';

import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';
import {
    DonationRequestStatus,
    Donor,
    defaultDonor,
    DonationScheme,
    defaultDonationScheme,
    DonationItemType,
    DonationList,
    Donation,
    defaultDonation,
    DonorDonation,
    SchemeDonation,
    DonationPayload,
    Pledge,
    DonationDashboardStats,
} from '@/pages/Donations/types';

export interface State {
    donationRequestStatus: DonationRequestStatus;
    donationsError: any;
    errorCode: any;
    donors: Array<Donor>;
    newDonor: Donor;
    donationSchemes: Array<DonationScheme>;
    newDonationScheme: DonationScheme;
    donationItemTypes: Array<DonationItemType>;
    donations: Array<DonationList>;
    donation: Donation;

    donorTransactions: Array<Donation>;
    pledges: Array<Pledge>;
    donationDashboardStats: DonationDashboardStats;

    donorDonations: Array<DonorDonation>;
    schemeDonations: Array<SchemeDonation>;
}

@Module({ namespaced: true, name: 'donation' })
export default class Donations extends VuexModule {
    public donationRequestStatus: DonationRequestStatus = {
        getDonors: Status.NORMAL,
        createDonor: Status.NORMAL,
        createDonationScheme: Status.NORMAL,
        getDonationSchemes: Status.NORMAL,
        editDonor: Status.NORMAL,
        getDonationItemTypes: Status.NORMAL,
        createDonation: Status.NORMAL,
        getDonations: Status.NORMAL,
        updateDonationScheme: Status.NORMAL,
        getDonationDetails: Status.NORMAL,
        updateDonation: Status.NORMAL,

        getDonorTransactions: Status.NORMAL,
        getPledges: Status.NORMAL,
        getDonationDashboardStats: Status.NORMAL,

        getDonorDonations: Status.NORMAL,
        getSchemeDonations: Status.NORMAL,
    };

    public donationsError: any = null;
    public errorCode: any = null;
    public donors: Array<Donor> = [];
    public newDonor: Donor = { ...defaultDonor };
    public donationSchemes: Array<DonationScheme> = [];
    public newDonationScheme: DonationScheme = { ...defaultDonationScheme };
    public donationItemTypes: Array<DonationItemType> = [];
    public donations: Array<DonationList> = [];
    public donation: Donation = { ...defaultDonation };

    public donorTransactions: Array<Donation> = [];
    public pledges: Array<Pledge> = [];
    public donationDashboardStats: DonationDashboardStats = {
        countOfInstantDonationsInCurrentMonth: 0,
        countOfPledgeDonationsInCurrentMonth: 0,
        totalPledgeAmount: { amount: 0, currencyKey: 0 },
        totalDonationsAmountInCurrentMonth: { amount: 0, currencyKey: 0 },
    };

    public donorDonations: Array<Donation> = [];
    public schemeDonations: Array<SchemeDonation> = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.donationsError = null;
    }

    @Mutation
    public [ACTIONS.GET_DONORS_LOADING](): void {
        this.donationRequestStatus.getDonors = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONORS_SUCCESS](payload: Array<Donor>) {
        this.donationRequestStatus.getDonors = Status.SUCCESS;
        this.donors = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONORS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonors = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonors() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-donors', [
            ACTIONS.GET_DONORS_LOADING,
            ACTIONS.GET_DONORS_SUCCESS,
            ACTIONS.GET_DONORS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_DONOR_LOADING](): void {
        this.donationRequestStatus.createDonor = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_DONOR_SUCCESS](payload: Donor) {
        this.donationRequestStatus.createDonor = Status.SUCCESS;
        const newDonor = {
            ...payload,
            lastActivity: null,
            lastActivityDate: null,
        };
        this.donors.unshift(newDonor);
        this.newDonor = newDonor;
    }

    @Mutation
    public [ACTIONS.CREATE_DONOR_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.createDonor = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createDonor(newDonor: Donor) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/donation-service/create-donor',
            [ACTIONS.CREATE_DONOR_LOADING, ACTIONS.CREATE_DONOR_SUCCESS, ACTIONS.CREATE_DONOR_ERROR],
            newDonor,
        );
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_SCHEME_LOADING](): void {
        this.donationRequestStatus.createDonationScheme = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_SCHEME_SUCCESS](payload: DonationScheme) {
        this.donationRequestStatus.createDonationScheme = Status.SUCCESS;
        this.donationSchemes.unshift(payload);
        this.newDonationScheme = payload;
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_SCHEME_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.createDonationScheme = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createDonationScheme(newDonationScheme: DonationScheme) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/donation-service/create-donation-scheme',
            [
                ACTIONS.CREATE_DONATION_SCHEME_LOADING,
                ACTIONS.CREATE_DONATION_SCHEME_SUCCESS,
                ACTIONS.CREATE_DONATION_SCHEME_ERROR,
            ],
            newDonationScheme,
        );
    }

    @Mutation
    public [ACTIONS.GET_DONATION_SCHEMES_LOADING](): void {
        this.donationRequestStatus.getDonationSchemes = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_SCHEMES_SUCCESS](payload: Array<DonationScheme>) {
        this.donationRequestStatus.getDonationSchemes = Status.SUCCESS;
        this.donationSchemes = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_SCHEMES_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonationSchemes = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonationSchemes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-donation-schemes', [
            ACTIONS.GET_DONATION_SCHEMES_LOADING,
            ACTIONS.GET_DONATION_SCHEMES_SUCCESS,
            ACTIONS.GET_DONATION_SCHEMES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.EDIT_DONOR_LOADING]() {
        this.donationRequestStatus.editDonor = Status.LOADING;
        this.donationsError = null;
    }

    @Mutation
    public [ACTIONS.EDIT_DONOR_SUCCESS](payload: Donor) {
        this.newDonor = Object.assign(this.newDonor, payload);
        this.donationRequestStatus.editDonor = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.EDIT_DONOR_ERROR](error: RequestErrorObject) {
        this.donationsError = error.message;
        this.errorCode = error.code;
        this.donationRequestStatus.editDonor = Status.ERROR;
    }

    @Action
    editDonor(donorDetails: Donor) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/donation-service/update-donor/${donorDetails.donorKey}`,
            [ACTIONS.EDIT_DONOR_LOADING, ACTIONS.EDIT_DONOR_SUCCESS, ACTIONS.EDIT_DONOR_ERROR],
            donorDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_DONATION_ITEM_TYPES_LOADING](): void {
        this.donationRequestStatus.getDonationItemTypes = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_ITEM_TYPES_SUCCESS](payload: Array<DonationItemType>) {
        this.donationRequestStatus.getDonationItemTypes = Status.SUCCESS;
        this.donationItemTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_ITEM_TYPES_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonationItemTypes = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonationItemTypes() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-donation-item-types', [
            ACTIONS.GET_DONATION_ITEM_TYPES_LOADING,
            ACTIONS.GET_DONATION_ITEM_TYPES_SUCCESS,
            ACTIONS.GET_DONATION_ITEM_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_LOADING](): void {
        this.donationRequestStatus.createDonation = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_SUCCESS]() {
        this.donationRequestStatus.createDonation = Status.SUCCESS;
        // push this into the existing donations
    }

    @Mutation
    public [ACTIONS.CREATE_DONATION_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.createDonation = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createDonation(newDonation: DonationPayload) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/donation-service/create-donation',
            [ACTIONS.CREATE_DONATION_LOADING, ACTIONS.CREATE_DONATION_SUCCESS, ACTIONS.CREATE_DONATION_ERROR],
            newDonation,
        );
    }

    @Mutation
    public [ACTIONS.GET_DONATIONS_LOADING](): void {
        this.donationRequestStatus.getDonations = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONATIONS_SUCCESS](payload: Array<DonationList>) {
        this.donationRequestStatus.getDonations = Status.SUCCESS;
        this.donations = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONATIONS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonations = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonations() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-donations', [
            ACTIONS.GET_DONATIONS_LOADING,
            ACTIONS.GET_DONATIONS_SUCCESS,
            ACTIONS.GET_DONATIONS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_SCHEME_LOADING]() {
        this.donationRequestStatus.updateDonationScheme = Status.LOADING;
        this.donationsError = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_SCHEME_SUCCESS](payload: DonationScheme) {
        this.newDonationScheme = Object.assign(this.newDonationScheme, payload);
        this.donationRequestStatus.updateDonationScheme = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_SCHEME_ERROR](error: RequestErrorObject) {
        this.donationsError = error.message;
        this.errorCode = error.code;
        this.donationRequestStatus.updateDonationScheme = Status.ERROR;
    }

    @Action
    public updateDonationScheme(donationScheme: DonationScheme) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/donation-service/update-donation-scheme/${donationScheme.donationSchemeKey}`,
            [
                ACTIONS.UPDATE_DONATION_SCHEME_LOADING,
                ACTIONS.UPDATE_DONATION_SCHEME_SUCCESS,
                ACTIONS.UPDATE_DONATION_SCHEME_ERROR,
            ],
            donationScheme,
        );
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DETAILS_LOADING](): void {
        this.donationRequestStatus.getDonationDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DETAILS_SUCCESS](payload: Donation) {
        this.donationRequestStatus.getDonationDetails = Status.SUCCESS;
        this.donation = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DETAILS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonationDetails = Status.ERROR;
        this.errorCode = error.code;
    }

    @Action
    public getDonationDetails(donationKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/donation-service/get-donation-detail/${donationKey}`, [
            ACTIONS.GET_DONATION_DETAILS_LOADING,
            ACTIONS.GET_DONATION_DETAILS_SUCCESS,
            ACTIONS.GET_DONATION_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_LOADING]() {
        this.donationRequestStatus.updateDonation = Status.LOADING;
        this.donationsError = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_SUCCESS](payload: DonationList) {
        this.donationRequestStatus.updateDonation = Status.SUCCESS;
        const indexOfdonationToBeUpdated = this.donations.findIndex(
            (donation: DonationList) => donation.donationKey === payload.donationKey,
        );
        this.donations.splice(indexOfdonationToBeUpdated, 1, payload);
    }

    @Mutation
    public [ACTIONS.UPDATE_DONATION_ERROR](error: RequestErrorObject) {
        this.donationsError = error.message;
        this.errorCode = error.code;
        this.donationRequestStatus.updateDonation = Status.ERROR;
    }

    @Action
    public updateDonation(editedDonation: DonationPayload) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/donation-service/update-donation/${editedDonation.donationKey}`,
            [ACTIONS.UPDATE_DONATION_LOADING, ACTIONS.UPDATE_DONATION_SUCCESS, ACTIONS.UPDATE_DONATION_ERROR],
            editedDonation,
        );
    }

    @Mutation
    public [ACTIONS.GET_DONOR_DONATIONS_LOADING](): void {
        this.donationRequestStatus.getDonorDonations = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONOR_DONATIONS_SUCCESS](payload: Array<Donation>) {
        this.donationRequestStatus.getDonorDonations = Status.SUCCESS;
        this.donorDonations = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONOR_DONATIONS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonorDonations = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonorDonations(donorKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/donation-service/get-donor-donations/${donorKey}`, [
            ACTIONS.GET_DONOR_DONATIONS_LOADING,
            ACTIONS.GET_DONOR_DONATIONS_SUCCESS,
            ACTIONS.GET_DONOR_DONATIONS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_PLEDGES_LOADING](): void {
        this.donationRequestStatus.getPledges = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_PLEDGES_SUCCESS](payload: Array<Pledge>) {
        this.donationRequestStatus.getPledges = Status.SUCCESS;
        this.pledges = payload;
    }

    @Mutation
    public [ACTIONS.GET_PLEDGES_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getDonationDashboardStats = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getPledges() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-pledged-donations', [
            ACTIONS.GET_PLEDGES_LOADING,
            ACTIONS.GET_PLEDGES_SUCCESS,
            ACTIONS.GET_PLEDGES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DASHBOARD_STATS_LOADING](): void {
        this.donationRequestStatus.getDonationDashboardStats = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DASHBOARD_STATS_SUCCESS](payload: DonationDashboardStats) {
        this.donationRequestStatus.getDonationDashboardStats = Status.SUCCESS;
        this.donationDashboardStats = payload;
    }

    @Mutation
    public [ACTIONS.GET_DONATION_DASHBOARD_STATS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getPledges = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDonationDashboardStats() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/donation-service/get-donation-dashboard-figure', [
            ACTIONS.GET_DONATION_DASHBOARD_STATS_LOADING,
            ACTIONS.GET_DONATION_DASHBOARD_STATS_SUCCESS,
            ACTIONS.GET_DONATION_DASHBOARD_STATS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_SCHEME_DONATIONS_LOADING](): void {
        this.donationRequestStatus.getSchemeDonations = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SCHEME_DONATIONS_SUCCESS](payload: Array<SchemeDonation>) {
        this.donationRequestStatus.getSchemeDonations = Status.SUCCESS;
        this.schemeDonations = payload;
    }

    @Mutation
    public [ACTIONS.GET_SCHEME_DONATIONS_ERROR](error: RequestErrorObject) {
        this.donationRequestStatus.getSchemeDonations = Status.ERROR;
        this.donationsError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getSchemeDonations(donationSchemeKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/donation-service/get-donation-scheme-donations/${donationSchemeKey}`,
            [
                ACTIONS.GET_SCHEME_DONATIONS_LOADING,
                ACTIONS.GET_SCHEME_DONATIONS_SUCCESS,
                ACTIONS.GET_SCHEME_DONATIONS_ERROR,
            ],
        );
    }
}
