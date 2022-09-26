/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';

import { ReportItem, ReportItemResponse } from '@/pages/Reports/types';
import { Status, ReportsRequestStatus, RequestErrorObject } from '@/types';

import { genericGetRequest } from '@/utils/request';

export interface State {
    reportsRequest: ReportsRequestStatus;
    error: any;
    errorCode: any;
    balanceSheetReport: ReportItem[];
    profitAndLossReport: ReportItem[];
}

@Module({ namespaced: true, name: 'report' })
export default class Reports extends VuexModule {
    public reportsRequest: ReportsRequestStatus = {
        getBalancesheetReport: Status.NORMAL,
        getProfitAndLossReports: Status.NORMAL,
    };
    public error: any = null;
    public errorCode: any = null;
    public balanceSheetReport: ReportItem[] = [];
    public profitAndLossReport: ReportItem[] = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_BALANCESHEET_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.reportsRequest.getBalancesheetReport = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_BALANCESHEET_LOADING]() {
        this.reportsRequest.getBalancesheetReport = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_BALANCESHEET_SUCCESS](payload: ReportItemResponse[]) {
        this.reportsRequest.getBalancesheetReport = Status.SUCCESS;

        this.balanceSheetReport = payload.map((reportLineItem: ReportItemResponse) => ({
            previousAmount: 0,
            currentAmount: reportLineItem.amount,
            ...reportLineItem,
        }));
    }

    @Mutation
    public [ACTIONS.GET_PROFIT_AND_LOSS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.reportsRequest.getProfitAndLossReports = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_PROFIT_AND_LOSS_LOADING]() {
        this.reportsRequest.getProfitAndLossReports = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PROFIT_AND_LOSS_SUCCESS](payload: ReportItemResponse[]) {
        this.reportsRequest.getProfitAndLossReports = Status.SUCCESS;

        this.profitAndLossReport = payload.map((reportLineItem: ReportItemResponse) => ({
            previousAmount: 0,
            currentAmount: reportLineItem.amount,
            ...reportLineItem,
        }));
    }

    @Action
    getBalancesheetReport(specifiedPeriod: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `account-service/balance-sheet?reportPeriod=${specifiedPeriod}`, [
            ACTIONS.GET_BALANCESHEET_LOADING,
            ACTIONS.GET_BALANCESHEET_SUCCESS,
            ACTIONS.GET_BALANCESHEET_ERROR,
        ]);
    }

    @Action
    getProfitAndLossReports(specifiedPeriod: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `account-service/balance-sheet?reportPeriod=${specifiedPeriod}`, [
            ACTIONS.GET_PROFIT_AND_LOSS_LOADING,
            ACTIONS.GET_PROFIT_AND_LOSS_SUCCESS,
            ACTIONS.GET_PROFIT_AND_LOSS_ERROR,
        ]);
    }
}
