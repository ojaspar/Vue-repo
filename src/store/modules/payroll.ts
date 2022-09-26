import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import * as ACTIONS from '@/store/constants';
import { CountryState, RequestErrorObject, Status } from '@/types';
import { genericGetRequest, genericPostRequest } from '@/utils/request';
import { EmployeeBioData, TaxAmount, GuarantorData, PayrollRequestStatus } from '@/pages/Payroll/AddEmployee/types';

export interface State {
    states: Array<CountryState>;
    errorCode: any;
    error: any;
    pension: any;
    taxPayee: any;
    employeeBioData: EmployeeBioData;
    guarantorInformation: GuarantorData;
    salaryInformation: any;
    taxAmount: number;
    pensionAmount: number;
}

@Module({ namespaced: true, name: 'payroll' })
export default class Payroll extends VuexModule {
    public payrollRequestStatus: PayrollRequestStatus = {
        getStates: Status.NORMAL,
        calculateTaxAmountForPayment: Status.NORMAL,
        calculatePensionAmountForPayment: Status.NORMAL,
    };

    public states: Array<CountryState> = [];
    public error: any = '';
    public errorCode: any = null;
    public taxAmount = 0;
    public pensionAmount = 0;

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STATES_LOADING]() {
        this.error = '';
        this.payrollRequestStatus.getStates = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_STATES_SUCCESS](payload: CountryState[]) {
        this.states = payload;
        this.payrollRequestStatus.getStates = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_STATES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.payrollRequestStatus.getStates = Status.ERROR;
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
    public [ACTIONS.CALCULATE_TAX_AMOUNT_LOADING]() {
        this.payrollRequestStatus.calculateTaxAmountForPayment = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.CALCULATE_TAX_AMOUNT_SUCCESS](taxAmount: number) {
        this.payrollRequestStatus.calculateTaxAmountForPayment = Status.SUCCESS;
        this.taxAmount = taxAmount;
    }

    @Mutation
    public [ACTIONS.CALCULATE_TAX_AMOUNT_ERROR](error: RequestErrorObject) {
        this.payrollRequestStatus.calculateTaxAmountForPayment = Status.ERROR;
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
    public [ACTIONS.CALCULATE_PENSION_AMOUNT_LOADING]() {
        this.payrollRequestStatus.calculatePensionAmountForPayment = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.CALCULATE_PENSION_AMOUNT_SUCCESS](pensionAmount: number) {
        this.payrollRequestStatus.calculatePensionAmountForPayment = Status.SUCCESS;
        this.pensionAmount = pensionAmount;
    }

    @Mutation
    public [ACTIONS.CALCULATE_PENSION_AMOUNT_ERROR](error: RequestErrorObject) {
        this.payrollRequestStatus.calculatePensionAmountForPayment = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
        this.pensionAmount = 0;
    }

    @Action
    calculatePensionAmountForPayment(pensionRequestObject: TaxAmount) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/calculate-tax',
            [
                ACTIONS.CALCULATE_PENSION_AMOUNT_LOADING,
                ACTIONS.CALCULATE_PENSION_AMOUNT_SUCCESS,
                ACTIONS.CALCULATE_PENSION_AMOUNT_ERROR,
            ],
            pensionRequestObject,
        );
    }
}
