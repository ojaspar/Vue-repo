/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';

import { Status, RequestErrorObject, MoneyObject } from '@/types';

import {
    DashboardSales,
    DashboardExpense,
    BusinessPerformanceRange,
    OutstandingCustomer,
    OutstandingOrders,
    DashboardRequestStatus,
    BarChartData,
    DashboardCreditSales,
    DashboardCreditPurchases,
    DashboardLoanDebts,
} from '@/pages/Dashboard/types';

import { genericGetRequest } from '@/utils/request';

export interface State {
    dashboardRequestStatus: DashboardRequestStatus;
    error: any;
    errorCode: any;
    sales: DashboardSales;
    expense: DashboardExpense;
    outstandingOrders: OutstandingOrders;
    barChartExpenseData: Array<BarChartData>;
    barChartSaleData: Array<BarChartData>;
    onlyExpense: number;
    onlySales: number;
    dashboardCreditSales: DashboardCreditSales;
    dashboardCreditPurchases: DashboardCreditPurchases;
    dashboardLoanDebts: DashboardLoanDebts;
}

@Module({ namespaced: true, name: 'dashboard' })
export default class Dashboard extends VuexModule {
    public dashboardRequestStatus: DashboardRequestStatus = {
        getExpense: Status.NORMAL,
        getSales: Status.NORMAL,
        getOutstandingOrders: Status.NORMAL,
        getDashboardCreditSales: Status.NORMAL,
        getDashboardCreditPurchases: Status.NORMAL,
        getDashboardLoanDebts: Status.NORMAL,
    };
    public onlyExpense: MoneyObject = { amount: 0, currencyKey: 0 };
    public onlySales: MoneyObject = { amount: 0, currencyKey: 0 };
    public error: any = null;
    public errorCode: any = null;
    public sales: DashboardSales = {
        totalSalesAmount: { amount: 0, currencyKey: 0 },
        totalAmountPaid: { amount: 0, currencyKey: 0 },
        outstandingOrderCount: 0,
        saleCharts: [],
        totalBalance: { amount: 0, currencyKey: 0 },
    };
    public expense: DashboardExpense = {
        totalExpenseAmount: { amount: 0, currencyKey: 0 },
        totalAmountPaid: { amount: 0, currencyKey: 0 },
        expenseCharts: [],
        totalBalance: { amount: 0, currencyKey: 0 },
    };
    public outstandingOrders: OutstandingOrders = {
        totalOutstandingCount: 0,
        outstandingCustomers: [],
        totalOutstandingAmount: 0,
    };

    public outstandingCustomers: Array<OutstandingCustomer> = [];

    public barChartExpenseData: Array<BarChartData> = [];
    public barChartSaleData: Array<BarChartData> = [];
    public dashboardCreditSales: DashboardCreditSales = {
        notDue: { currencyKey: 0, amount: 0 },
        pastDue: { amount: 0, currencyKey: 0 },
    };
    public dashboardCreditPurchases: DashboardCreditPurchases = {
        maturing: { currencyKey: 0, amount: 0 },
        pastDue: { amount: 0, currencyKey: 0 },
    };
    public dashboardLoanDebts: DashboardLoanDebts = {
        maturingLoan: { currencyKey: 0, amount: 0 },
        pastDueLoan: { amount: 0, currencyKey: 0 },
    };

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_EXPENSE_LOADING]() {
        this.dashboardRequestStatus.getExpense = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_EXPENSE_SUCCESS](payload: DashboardExpense) {
        this.dashboardRequestStatus.getExpense = Status.SUCCESS;
        this.expense = payload;
        this.barChartExpenseData = payload.expenseCharts;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_EXPENSE_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getExpense = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_SALES_LOADING]() {
        this.dashboardRequestStatus.getSales = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_SALES_SUCCESS](payload: DashboardSales) {
        this.dashboardRequestStatus.getSales = Status.SUCCESS;
        this.sales = payload;
        this.barChartSaleData = payload.saleCharts;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_SALES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getSales = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_OUTSTANDING_ORDERS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getOutstandingOrders = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_OUTSTANDING_ORDERS_LOADING]() {
        this.dashboardRequestStatus.getOutstandingOrders = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_OUTSTANDING_ORDERS_SUCCESS](payload: Array<OutstandingCustomer>) {
        this.dashboardRequestStatus.getOutstandingOrders = Status.SUCCESS;
        this.outstandingCustomers = payload;
    }

    @Mutation
    public [ACTIONS.GET_ONLY_EXPENSE_SUCCESS](payload: DashboardExpense) {
        this.onlyExpense = payload.totalExpenseAmount;
    }

    @Mutation
    public [ACTIONS.GET_ONLY_SALES_SUCCESS](payload: DashboardSales) {
        this.onlySales = payload.totalSalesAmount;
    }

    @Action
    getSales({ dates, tab }: { dates: BusinessPerformanceRange; tab: string }) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/sale-service/get-main-dashboard-figure?dateFrom=${dates.starts}&dateTo=${dates.ends}&tab=${tab}`,
            [
                ACTIONS.GET_DASHBOARD_SALES_LOADING,
                ACTIONS.GET_DASHBOARD_SALES_SUCCESS,
                ACTIONS.GET_DASHBOARD_SALES_ERROR,
            ],
        );
    }

    @Action
    getExpense({ dates, tab }: { dates: BusinessPerformanceRange; tab: string }) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/expense-service/get-expense-dashboard-figure?dateFrom=${dates.starts}&dateTo=${dates.ends}&tab=${tab}`,
            [
                ACTIONS.GET_DASHBOARD_EXPENSE_LOADING,
                ACTIONS.GET_DASHBOARD_EXPENSE_SUCCESS,
                ACTIONS.GET_DASHBOARD_EXPENSE_ERROR,
            ],
        );
    }

    @Action
    getOnlySales({ dates, tab }: { dates: BusinessPerformanceRange; tab: string }) {
        // this solution is temporary - remove this and the GET_ONLY_SALES_SUCCESS mutation once a more permanent way to know
        // if a user has had a transaction is found
        // also remove onlySales state and onlyExpense State
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/sale-service/get-main-dashboard-figure?dateFrom=${dates.starts}&dateTo=${dates.ends}&tab=${tab}`,
            [ACTIONS.GET_DASHBOARD_SALES_LOADING, ACTIONS.GET_ONLY_SALES_SUCCESS, ACTIONS.GET_DASHBOARD_SALES_ERROR],
        );
    }

    @Action
    getOnlyExpense({ dates, tab }: { dates: BusinessPerformanceRange; tab: string }) {
        // this solution is temporary - remove this and the GET_ONLY_EXPENSE_SUCCESS mutation once a more permanent way to know
        // if a user has had a transaction is found
        // also remove onlySales state and onlyExpense state
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/expense-service/get-expense-dashboard-figure?dateFrom=${dates.starts}&dateTo=${dates.ends}&tab=${tab}`,
            [
                ACTIONS.GET_DASHBOARD_EXPENSE_LOADING,
                ACTIONS.GET_ONLY_EXPENSE_SUCCESS,
                ACTIONS.GET_DASHBOARD_EXPENSE_ERROR,
            ],
        );
    }

    @Action
    getOutstandingOrders() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-outstanding-order', [
            ACTIONS.GET_OUTSTANDING_ORDERS_LOADING,
            ACTIONS.GET_OUTSTANDING_ORDERS_SUCCESS,
            ACTIONS.GET_OUTSTANDING_ORDERS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_SALES_LOADING]() {
        this.dashboardRequestStatus.getDashboardCreditSales = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_SALES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getDashboardCreditSales = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_SALES_SUCCESS](payload: DashboardCreditSales) {
        this.dashboardRequestStatus.getDashboardCreditSales = Status.SUCCESS;
        this.dashboardCreditSales = payload;
    }

    @Action
    getDashboardCreditSales() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'sale-service/get-dashboard-credit-sales-figure', [
            ACTIONS.GET_DASHBOARD_CREDIT_SALES_LOADING,
            ACTIONS.GET_DASHBOARD_CREDIT_SALES_SUCCESS,
            ACTIONS.GET_DASHBOARD_CREDIT_SALES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_LOADING]() {
        this.dashboardRequestStatus.getDashboardCreditSales = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getDashboardCreditSales = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_SUCCESS](payload: DashboardCreditPurchases) {
        this.dashboardRequestStatus.getDashboardCreditSales = Status.SUCCESS;
        this.dashboardCreditPurchases = payload;
    }

    @Action
    getDashboardCreditPurchases() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'expense-service/get-dashboard-credit-purchases-figure', [
            ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_LOADING,
            ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_SUCCESS,
            ACTIONS.GET_DASHBOARD_CREDIT_PURCHASE_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_LOAN_DEBTS_LOADING]() {
        this.dashboardRequestStatus.getDashboardLoanDebts = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_LOAN_DEBTS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.dashboardRequestStatus.getDashboardLoanDebts = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_DASHBOARD_LOAN_DEBTS_SUCCESS](payload: DashboardLoanDebts) {
        this.dashboardRequestStatus.getDashboardLoanDebts = Status.SUCCESS;
        this.dashboardLoanDebts = payload;
    }

    @Action
    getDashboardLoanDebts() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/financing-service/get-dashboard-loan-debts', [
            ACTIONS.GET_DASHBOARD_LOAN_DEBTS_LOADING,
            ACTIONS.GET_DASHBOARD_LOAN_DEBTS_SUCCESS,
            ACTIONS.GET_DASHBOARD_LOAN_DEBTS_ERROR,
        ]);
    }
}
