/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';

import { Status, RequestErrorObject } from '@/types';
import {
    Staff,
    SalariesAndCommissionRequestStatus,
    TaxAmount,
    SalaryAndCommissionRequest,
    PaymentAndCommissionRequest,
} from '@/pages/Spending/SalariesAndCommissions/types';

import { genericGetRequest, genericPostRequest } from '@/utils/request';

export interface State {
    error: any;
    errorCode: any;
    staffListForPayment: Staff[];
    salariesAndCommissionRequestStatus: SalariesAndCommissionRequestStatus;
    taxAmount: number;
}

@Module({ namespaced: true, name: 'salariesAndCommissions' })
export default class SalariesAndCommission extends VuexModule {
    public error: any = null;
    public errorCode: any = null;
    public staffListForPayment: Array<Staff> = [];
    public salariesAndCommissionRequestStatus: SalariesAndCommissionRequestStatus = {
        getStaffListForPayment: Status.NORMAL,
        addStaffForPayment: Status.NORMAL,
        calculateTaxAmountForPayment: Status.NORMAL,
        paySalaryCommission: Status.NORMAL,
    };
    public taxAmount = 0;
    static State: any;

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_LOADING]() {
        this.salariesAndCommissionRequestStatus.getStaffListForPayment = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_SUCCESS](payload: Staff[]) {
        this.salariesAndCommissionRequestStatus.getStaffListForPayment = Status.SUCCESS;
        this.staffListForPayment = payload;
    }

    @Mutation
    public [ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_ERROR](error: RequestErrorObject) {
        this.salariesAndCommissionRequestStatus.getStaffListForPayment = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    getStaffListForPayment() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-staff-list-for-payment', [
            ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_LOADING,
            ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_SUCCESS,
            ACTIONS.GET_STAFF_LIST_FOR_PAYMENT_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CALCULATE_TAX_AMOUNT_LOADING]() {
        this.salariesAndCommissionRequestStatus.calculateTaxAmountForPayment = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.CALCULATE_TAX_AMOUNT_SUCCESS](taxAmount: number) {
        this.salariesAndCommissionRequestStatus.calculateTaxAmountForPayment = Status.SUCCESS;
        this.taxAmount = taxAmount;
    }

    @Mutation
    public [ACTIONS.CALCULATE_TAX_AMOUNT_ERROR](error: RequestErrorObject) {
        this.salariesAndCommissionRequestStatus.calculateTaxAmountForPayment = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
        this.taxAmount = 0;
    }

    @Action
    calculateTaxAmountForPayment(taxRequestObject: TaxAmount) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/calculate-tax',
            [
                ACTIONS.CALCULATE_TAX_AMOUNT_LOADING,
                ACTIONS.CALCULATE_TAX_AMOUNT_SUCCESS,
                ACTIONS.CALCULATE_TAX_AMOUNT_ERROR,
            ],
            taxRequestObject,
        );
    }

    @Mutation
    public [ACTIONS.PAY_SALARY_COMMISSION_LOADING]() {
        this.salariesAndCommissionRequestStatus.paySalaryCommission = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.PAY_SALARY_COMMISSION_SUCCESS]() {
        this.salariesAndCommissionRequestStatus.paySalaryCommission = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.PAY_SALARY_COMMISSION_ERROR](error: RequestErrorObject) {
        this.salariesAndCommissionRequestStatus.paySalaryCommission = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    paySalariesAndCommission(salariesAndCommissions: SalaryAndCommissionRequest | PaymentAndCommissionRequest) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/add-staff-payment',
            [
                ACTIONS.PAY_SALARY_COMMISSION_LOADING,
                ACTIONS.PAY_SALARY_COMMISSION_SUCCESS,
                ACTIONS.PAY_SALARY_COMMISSION_ERROR,
            ],
            salariesAndCommissions,
        );
    }
}
