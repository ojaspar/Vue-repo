/* eslint-disable @typescript-eslint/no-explicit-any */

import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/financing-module-constants';

import {
    Shareholder,
    FinancingRequestStatus,
    defaultShareholder,
    FormOfCapital,
    AddCapitalForm,
    AddShareholderForm,
    UpdateShareholderRequest,
    CapitalItemType,
    UpdatedShareholder,
} from '@/pages/Financing/Capital/types';
import { FinanceDasbhboardCard, defaultDashboardCard } from '@/pages/Financing/types';
import { RequestErrorObject, Status } from '@/types';
import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';
import { ErrorResponse } from '@/utils/errorCode';
import {
    Loan,
    defaultLoan,
    LoanCardDetails,
    defaultLoanCardDetails,
    LoanRepaymentHistory,
    LoanDetails,
    LoanRepayment,
} from '@/pages/Financing/Loan/types';

export interface State {
    sharedholders: Array<Shareholder>;
    financingRequestStatus: FinancingRequestStatus;
    dashboardCardDetails: FinanceDasbhboardCard;
    error: any;
    errorCode: any;
    formsOfCapital: Array<FormOfCapital>;
    shareholderDetail: Shareholder;
    capitalItemTypes: Array<CapitalItemType>;
}

@Module({ namespaced: true, name: 'finance' })
export default class Financing extends VuexModule {
    public financingRequestStatus: FinancingRequestStatus = {
        getAllShareholders: Status.NORMAL,
        createShareholder: Status.NORMAL,
        getDashboardCardDetails: Status.NORMAL,
        addLoan: Status.NORMAL,
        getAllLoans: Status.NORMAL,
        getLoanDetails: Status.NORMAL,
        getFormsOfCapital: Status.NORMAL,
        addCapital: Status.NORMAL,
        addLoanRepayment: Status.NORMAL,
        getLoanDetailsCard: Status.NORMAL,
        getLoanRepayments: Status.NORMAL,
        getShareholderDetails: Status.NORMAL,
        updateShareholderDetails: Status.NORMAL,
        getCapitalItemTypes: Status.NORMAL,
    };
    public shareholders: Array<Shareholder> = [];
    public error: any = null;
    public errorCode: any = null;
    public newShareholder: Shareholder = { ...defaultShareholder };
    public dashboardCardDetails: FinanceDasbhboardCard = { ...defaultDashboardCard };
    public newLoan: Loan = { ...defaultLoan };
    public formsOfCapital: Array<FormOfCapital> = [];
    public allLoans: Array<LoanDetails> = [];
    public loanDetailsCard: LoanCardDetails = { ...defaultLoanCardDetails };
    public loanRepayments: Array<LoanRepaymentHistory> = [];
    public shareholderDetail: Shareholder = { ...defaultShareholder };
    public capitalItemTypes: Array<CapitalItemType> = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_ALL_SHAREHOLDERS_LOADING](): void {
        this.financingRequestStatus.getAllShareholders = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_ALL_SHAREHOLDERS_SUCCESS](payload: Array<Shareholder>) {
        this.financingRequestStatus.getAllShareholders = Status.SUCCESS;
        this.shareholders = payload;
    }

    @Mutation
    public [ACTIONS.GET_ALL_SHAREHOLDERS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getAllShareholders = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getAllShareholders(): Promise<Array<Shareholder>> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/get-shareholders', [
            ACTIONS.GET_ALL_SHAREHOLDERS_LOADING,
            ACTIONS.GET_ALL_SHAREHOLDERS_SUCCESS,
            ACTIONS.GET_ALL_SHAREHOLDERS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_NEW_SHAREHOLDER_LOADING](): void {
        this.financingRequestStatus.createShareholder = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_NEW_SHAREHOLDER_SUCCESS](payload: Shareholder) {
        this.financingRequestStatus.createShareholder = Status.SUCCESS;
        this.newShareholder = payload;
    }

    @Mutation
    public [ACTIONS.CREATE_NEW_SHAREHOLDER_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.createShareholder = Status.ERROR;
        this.error = error.code ? ErrorResponse[error.code] : '';
        this.errorCode = error.code;
    }

    @Action
    public createShareholder(newShareholder: AddShareholderForm): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/financing-service/add-shareholder',
            [
                ACTIONS.CREATE_NEW_SHAREHOLDER_LOADING,
                ACTIONS.CREATE_NEW_SHAREHOLDER_SUCCESS,
                ACTIONS.CREATE_NEW_SHAREHOLDER_ERROR,
            ],
            newShareholder,
        );
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CARD_DETAILS_LOADING](): void {
        this.financingRequestStatus.getDashboardCardDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CARD_DETAILS_SUCCESS](payload: FinanceDasbhboardCard) {
        this.financingRequestStatus.getDashboardCardDetails = Status.SUCCESS;
        this.dashboardCardDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CARD_DETAILS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getDashboardCardDetails = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDashboardCardDetails(): Promise<FinanceDasbhboardCard> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/finance-dashboard-card', [
            ACTIONS.GET_DASHBOARD_CARD_DETAILS_LOADING,
            ACTIONS.GET_DASHBOARD_CARD_DETAILS_SUCCESS,
            ACTIONS.GET_DASHBOARD_CARD_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_LOADING](): void {
        this.financingRequestStatus.addLoan = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_SUCCESS](payload: Loan) {
        this.financingRequestStatus.addLoan = Status.SUCCESS;
        this.newLoan = payload;
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.addLoan = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public addLoan(newLoan: Loan): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/financing-service/add-loan',
            [ACTIONS.ADD_LOAN_LOADING, ACTIONS.ADD_LOAN_SUCCESS, ACTIONS.ADD_LOAN_ERROR],
            newLoan,
        );
    }

    @Mutation
    public [ACTIONS.GET_FORMS_OF_CAPTIAL_LOADING](): void {
        this.financingRequestStatus.getFormsOfCapital = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_FORMS_OF_CAPTIAL_SUCCESS](payload: Array<FormOfCapital>) {
        this.financingRequestStatus.getFormsOfCapital = Status.SUCCESS;
        this.formsOfCapital = payload;
    }

    @Mutation
    public [ACTIONS.GET_FORMS_OF_CAPTIAL_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getFormsOfCapital = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getFormsOfCapital(): Promise<Array<FormOfCapital>> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/list-forms-of-capital', [
            ACTIONS.GET_FORMS_OF_CAPTIAL_LOADING,
            ACTIONS.GET_FORMS_OF_CAPTIAL_SUCCESS,
            ACTIONS.GET_FORMS_OF_CAPTIAL_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.ADD_CAPITAL_LOADING](): void {
        this.financingRequestStatus.addCapital = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.ADD_CAPITAL_SUCCESS]() {
        this.financingRequestStatus.addCapital = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.ADD_CAPITAL_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.addCapital = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public addCapital(capital: AddCapitalForm): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/financing-service/add-capital',
            [ACTIONS.ADD_CAPITAL_LOADING, ACTIONS.ADD_CAPITAL_SUCCESS, ACTIONS.ADD_CAPITAL_ERROR],
            capital,
        );
    }

    @Mutation
    public [ACTIONS.GET_ALL_LOANS_LOADING](): void {
        this.financingRequestStatus.getAllLoans = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_ALL_LOANS_SUCCESS](payload: LoanDetails[]) {
        this.financingRequestStatus.getAllLoans = Status.SUCCESS;
        this.allLoans = payload;
    }

    @Mutation
    public [ACTIONS.GET_ALL_LOANS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getAllLoans = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public getAllLoans(): Promise<FinanceDasbhboardCard> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/get-loans', [
            ACTIONS.GET_ALL_LOANS_LOADING,
            ACTIONS.GET_ALL_LOANS_SUCCESS,
            ACTIONS.GET_ALL_LOANS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_LOAN_DETAILS_CARD_LOADING](): void {
        this.financingRequestStatus.getLoanDetailsCard = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_LOAN_DETAILS_CARD_SUCCESS](payload: LoanCardDetails) {
        this.financingRequestStatus.getLoanDetailsCard = Status.SUCCESS;
        this.loanDetailsCard = payload;
    }

    @Mutation
    public [ACTIONS.GET_LOAN_DETAILS_CARD_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getLoanDetailsCard = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public getLoanDetailsCard(loanKey: string): Promise<FinanceDasbhboardCard> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/financing-service/loan-dashboard-card/${loanKey}`, [
            ACTIONS.GET_LOAN_DETAILS_CARD_LOADING,
            ACTIONS.GET_LOAN_DETAILS_CARD_SUCCESS,
            ACTIONS.GET_LOAN_DETAILS_CARD_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_LOAN_REPAYMENTS_LOADING](): void {
        this.financingRequestStatus.getLoanRepayments = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_LOAN_REPAYMENTS_SUCCESS](payload: LoanRepaymentHistory[]) {
        this.financingRequestStatus.getLoanRepayments = Status.SUCCESS;
        this.loanRepayments = payload;
    }

    @Mutation
    public [ACTIONS.GET_LOAN_REPAYMENTS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getLoanRepayments = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public getLoanRepayments(loanKey: string): Promise<FinanceDasbhboardCard> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/financing-service/get-loan-repayment-history/${loanKey}`, [
            ACTIONS.GET_LOAN_REPAYMENTS_LOADING,
            ACTIONS.GET_LOAN_REPAYMENTS_SUCCESS,
            ACTIONS.GET_LOAN_REPAYMENTS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_REPAYMENT_LOADING](): void {
        this.financingRequestStatus.addLoanRepayment = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_REPAYMENT_SUCCESS](payload: Loan) {
        this.financingRequestStatus.addLoanRepayment = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.ADD_LOAN_REPAYMENT_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.addLoanRepayment = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public addLoanRepayment(loanRepayment: LoanRepayment): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            `/financing-service/add-loan-repayment/${loanRepayment.loanKey}`,
            [ACTIONS.ADD_LOAN_REPAYMENT_LOADING, ACTIONS.ADD_LOAN_REPAYMENT_SUCCESS, ACTIONS.ADD_LOAN_REPAYMENT_ERROR],
            loanRepayment,
        );
    }

    @Mutation
    public [ACTIONS.GET_SHAREHOLDER_DETAILS_LOADING](): void {
        this.financingRequestStatus.getShareholderDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SHAREHOLDER_DETAILS_SUCCESS](payload: Shareholder) {
        this.financingRequestStatus.getShareholderDetails = Status.SUCCESS;
        this.shareholderDetail = payload;
    }

    @Mutation
    public [ACTIONS.GET_SHAREHOLDER_DETAILS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getShareholderDetails = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public getShareholderDetails(shareholderKey: string): Promise<Shareholder> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/financing-service/get-share-holder-detail/${shareholderKey}`, [
            ACTIONS.GET_SHAREHOLDER_DETAILS_LOADING,
            ACTIONS.GET_SHAREHOLDER_DETAILS_SUCCESS,
            ACTIONS.GET_SHAREHOLDER_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public persistShareholderKey(shareHolderKey: string) {
        this.shareholderDetail = { ...this.shareholderDetail, shareHolderKey };
    }

    @Mutation
    public [ACTIONS.UPDATE_SHAREHOLDER_DETAILS_LOADING](): void {
        this.financingRequestStatus.updateShareholderDetails = Status.LOADING;
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_SHAREHOLDER_DETAILS_SUCCESS](payload: UpdatedShareholder) {
        this.financingRequestStatus.updateShareholderDetails = Status.SUCCESS;

        this.shareholders = this.shareholders.map((shareholder: Shareholder) => {
            let shareholderDetails = { ...shareholder };
            const { emailAddress, address, notes, name, phoneNumber } = payload;

            if (shareholder.shareHolderKey === this.shareholderDetail.shareHolderKey) {
                shareholderDetails = {
                    ...shareholderDetails,
                    emailAddress,
                    phoneNumber,
                    address,
                    notes,
                    shareHoldername: name,
                };
            }

            return shareholderDetails;
        });

        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_SHAREHOLDER_DETAILS_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.updateShareholderDetails = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public updateShareholderDetails({
        shareholderKey,
        shareholder,
    }: UpdateShareholderRequest): Promise<Shareholder> | object {
        this.context.commit('persistShareholderKey', shareholderKey);

        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/financing-service/update-shareholder/${shareholderKey}`,
            [
                ACTIONS.UPDATE_SHAREHOLDER_DETAILS_LOADING,
                ACTIONS.UPDATE_SHAREHOLDER_DETAILS_SUCCESS,
                ACTIONS.UPDATE_SHAREHOLDER_DETAILS_ERROR,
            ],
            shareholder,
        );
    }

    @Mutation
    public [ACTIONS.GET_CAPITAL_ITEM_TYPES_LOADING](): void {
        this.financingRequestStatus.getCapitalItemTypes = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_CAPITAL_ITEM_TYPES_SUCCESS](payload: Array<CapitalItemType>) {
        this.financingRequestStatus.getCapitalItemTypes = Status.SUCCESS;
        this.capitalItemTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_CAPITAL_ITEM_TYPES_ERROR](error: RequestErrorObject) {
        this.financingRequestStatus.getCapitalItemTypes = Status.ERROR;
        this.error = error.message || ErrorResponse[Number(error.code)];
        this.errorCode = error.code;
    }

    @Action
    public getCapitalItemTypes(): Promise<any> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/get-capital-item-types', [
            ACTIONS.GET_CAPITAL_ITEM_TYPES_LOADING,
            ACTIONS.GET_CAPITAL_ITEM_TYPES_SUCCESS,
            ACTIONS.GET_CAPITAL_ITEM_TYPES_ERROR,
        ]);
    }
}
