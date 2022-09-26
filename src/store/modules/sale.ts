/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';
import {
    Status,
    SalesProduct,
    SalesCreationResponse,
    SaleRequestStatus,
    Sale,
    RequestErrorObject,
    PaymentAccount,
    PaginationProperty,
} from '@/types';

import { genericPostRequest, genericGetRequest, genericPutRequest } from '@/utils/request';
import {
    SaleRequest,
    RecordEstimateRequest,
    SaleDashboardCards,
    SaleDetails,
    DocumentPreviewType,
    AdditionalPayment,
    PaginatedSales,
} from '@/pages/Sales/types';
import { AddSalesPayment } from '@/pages/Sales/ManageSales/types';
import { defaultPaymentDetails, PaymentDetails } from '@/pages/Sales/RecordSale/v4/types';

export interface State {
    salesRequestStatus: SaleRequestStatus;
    errorCode: any;
    errorMessage: string;
    sales: Array<SalesProduct>;
    salesDashBoardStats: string;
    outstandingOrder: 0;
    mainDashboardFigure: 0;
    saleDetails: SaleDetails;
    paymentAccount: Array<PaymentAccount>;
    dasboardCardRequest: Status;
    saleDashboardCards: SaleDashboardCards;
    salesDashboardRequest: Status;
    salesDashboardCards: SaleDashboardCards;
    paginatedSales: PaginatedSales;
    saleKey: string;
    refNo: string;
    receiptPdfFile: string;
}

@Module({ namespaced: true, name: 'sale' })
export default class Sales extends VuexModule {
    public salesRequestStatus: SaleRequestStatus = {
        createSale: Status.NORMAL,
        updateSale: Status.NORMAL,
        getSales: Status.NORMAL,
        getSalesDashboardStats: Status.NORMAL,
        getSaleDetails: Status.NORMAL,
        addSalePayment: Status.NORMAL,
        getPaymentAccounts: Status.NORMAL,
        recordEstimate: Status.NORMAL,
        updateEstimate: Status.NORMAL,
        generatePdf: Status.NORMAL,
    };

    public errorMessage: any = null;
    public errorCode: any = null;
    public sales: Array<SalesProduct> = [];
    public salesDashboardStats: Array<Sale> = [];
    public paginatedSales: PaginatedSales = {
        info: 0,
        items: [],
        total: 0,
    };
    public mainDashboardFigure = 0;
    public outstandingOrder = 0;
    public saleDetails: SaleDetails = {
        products: [],
        totalAmount: { amount: 0, currencyKey: 0 },
        balance: { amount: 0, currencyKey: 0 },
        amountPaid: { amount: 0, currencyKey: 0 },
        balanceDueDate: '',
        customerKey: '',
        customer: {
            name: '',
            address: '',
            customerKey: '',
            email: '',
            phoneNumber: '',
        },
        paymentAccountKey: '',
        saleKey: '',
        transactionDate: '',
        additionalPayments: [],
    };
    public paymentAccounts: Array<PaymentAccount> = [];
    public salesDashboardRequest = Status.NORMAL;
    public salesDashboardCards: SaleDashboardCards = {
        currentMonthSales: { currencyKey: 0, amount: 0 },
        currentMonthSalesCount: 0,
        outStandingOrderCount: 0,
        prepaidOutStandingOrders: {
            currencyKey: 0,
            amount: 0,
        },
        unpaidOutStandingOrders: {
            currencyKey: 0,
            amount: 0,
        },
        customerDebt: {
            currencyKey: 0,
            amount: 0,
        },
        expectedInflowCount: 0,
    };
    public newRemittance: AddSalesPayment = {
        amountPaid: { currencyKey: 0, amount: 0 },
        dateReceived: '',
        paymentAccountKey: '',
        saleKey: '',
    };
    public saleKey = '';
    public receiptPdfFile = '';
    public refNo = '';

    public previousStateOfPaymentForm: PaymentDetails = { ...defaultPaymentDetails };

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.errorMessage = null;
    }

    @Mutation
    public [ACTIONS.RECORD_SALE_LOADING](): void {
        this.salesRequestStatus.createSale = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.RECORD_SALE_SUCCESS]({ saleKey, refNo }: { saleKey: string; refNo: string }) {
        this.salesRequestStatus.createSale = Status.SUCCESS;
        this.saleKey = saleKey;
        this.refNo = refNo;
    }

    @Mutation
    public [ACTIONS.RECORD_SALE_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.createSale = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_FIGURE_LOADING](): void {
        this.salesRequestStatus.getSalesDashboardStats = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_FIGURE_SUCCESS](payload: Array<Sale>) {
        this.salesRequestStatus.getSalesDashboardStats = Status.SUCCESS;
        this.salesDashboardStats = payload;
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_FIGURE_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.getSalesDashboardStats = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.GET_SALES_LOADING](): void {
        this.salesRequestStatus.getSales = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SALES_SUCCESS](payload: PaginatedSales) {
        this.paginatedSales = payload;
        this.salesRequestStatus.getSales = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_SALES_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.getSales = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.GET_SALE_DETAILS_LOADING](): void {
        this.salesRequestStatus.getSaleDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SALE_DETAILS_SUCCESS](payload: SaleDetails) {
        this.salesRequestStatus.getSaleDetails = Status.SUCCESS;
        this.saleDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_SALE_DETAILS_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.getSaleDetails = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.ADD_SALE_PAYMENT_LOADING](): void {
        this.salesRequestStatus.addSalePayment = Status.LOADING;
        this.errorCode = '';
        this.errorMessage = '';
    }

    @Mutation
    public [ACTIONS.ADD_SALE_PAYMENT_SUCCESS]() {
        const { amountPaid, balance } = this.saleDetails;

        const {
            amountPaid: { amount },
        } = this.newRemittance;

        const totalAmountPaid = Number(amountPaid.amount) + amount;
        const newBalance = Number(balance.amount) - amount;

        this.saleDetails.amountPaid = Object.assign({}, this.saleDetails.amountPaid, {
            ...amountPaid,
            amount: totalAmountPaid,
        });

        this.saleDetails.balance = Object.assign({}, this.saleDetails.balance, {
            ...balance,
            amount: newBalance,
        });

        const { amountPaid: newAmountPaid, dateReceived, paymentAccountKey } = this.newRemittance;

        const newAdditionalPayment: AdditionalPayment = {
            additionalPaymentKey: '',
            amount: newAmountPaid,
            bankName: 'Cash',
            dateReceived,
            paymentAccountKey,
            accountNumber: '',
        };

        this.saleDetails.additionalPayments.push(newAdditionalPayment);

        this.salesRequestStatus.addSalePayment = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.ADD_SALE_PAYMENT_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.addSalePayment = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.EDIT_SALE_LOADING](): void {
        this.salesRequestStatus.updateSale = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.EDIT_SALE_SUCCESS](payload: SalesCreationResponse) {
        this.salesRequestStatus.updateSale = Status.SUCCESS;
        this.sales = payload.items;
    }

    @Mutation
    public [ACTIONS.EDIT_SALE_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.updateSale = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_LOADING](): void {
        this.salesRequestStatus.getPaymentAccounts = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_SUCCESS](payload: Array<PaymentAccount>) {
        this.salesRequestStatus.getPaymentAccounts = Status.SUCCESS;
        this.paymentAccounts = payload;
    }

    @Mutation
    public [ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.getPaymentAccounts = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Action
    public recordSale(recordSalesRequestObject: SaleRequest) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/record-sale',
            [ACTIONS.RECORD_SALE_LOADING, ACTIONS.RECORD_SALE_SUCCESS, ACTIONS.RECORD_SALE_ERROR],
            recordSalesRequestObject,
        );
    }

    @Action
    public getSalesDashboardFigure() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-sale-dashboard-figure', [
            ACTIONS.GET_SALES_DASHBOARD_FIGURE_LOADING,
            ACTIONS.GET_SALES_DASHBOARD_FIGURE_SUCCESS,
            ACTIONS.GET_SALES_DASHBOARD_FIGURE_ERROR,
        ]);
    }

    @Action
    public getSales({ page = 1, limit = 8 }: PaginationProperty) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/sale-service/get-sales-paged?page=${page}&limit=${limit}`, [
            ACTIONS.GET_SALES_LOADING,
            ACTIONS.GET_SALES_SUCCESS,
            ACTIONS.GET_SALES_ERROR,
        ]);
    }

    @Action
    public getSaleDetails(saleKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/sale-service/get-sale-detail/${saleKey}`, [
            ACTIONS.GET_SALE_DETAILS_LOADING,
            ACTIONS.GET_SALE_DETAILS_SUCCESS,
            ACTIONS.GET_SALE_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public storeNewlyRemittedPaymentDetails(newlyRemittedAmount: AddSalesPayment) {
        this.newRemittance = newlyRemittedAmount;
    }

    @Action
    public addSalePayment(salePayment: AddSalesPayment) {
        this.context.commit('storeNewlyRemittedPaymentDetails', salePayment);

        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/add-payment',
            [ACTIONS.ADD_SALE_PAYMENT_LOADING, ACTIONS.ADD_SALE_PAYMENT_SUCCESS, ACTIONS.ADD_SALE_PAYMENT_ERROR],
            salePayment,
        );
    }

    @Action
    public updateSale(updateSaleRequest: SaleRequest) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/sale-service/update-edited-sale/${updateSaleRequest.saleKey}`,
            [ACTIONS.EDIT_SALE_LOADING, ACTIONS.EDIT_SALE_SUCCESS, ACTIONS.EDIT_SALE_ERROR],
            updateSaleRequest,
        );
    }

    @Action
    public getPaymentAccounts() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-payment-accounts', [
            ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_LOADING,
            ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_SUCCESS,
            ACTIONS.GET_SALES_PAYMENT_ACCOUNTS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.RECORD_ESTIMATE_LOADING](): void {
        this.salesRequestStatus.recordEstimate = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.RECORD_ESTIMATE_SUCCESS]({ saleKey, refNo }: { saleKey: string; refNo: string }) {
        this.salesRequestStatus.recordEstimate = Status.SUCCESS;
        this.saleKey = saleKey;
        this.refNo = refNo;
    }

    @Mutation
    public [ACTIONS.RECORD_ESTIMATE_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.recordEstimate = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Action
    public recordEstimate(recordEstimateRequestObject: RecordEstimateRequest) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/record-estimate',
            [ACTIONS.RECORD_ESTIMATE_LOADING, ACTIONS.RECORD_ESTIMATE_SUCCESS, ACTIONS.RECORD_ESTIMATE_ERROR],
            recordEstimateRequestObject,
        );
    }

    @Mutation
    public [ACTIONS.UPDATE_ESTIMATE_LOADING](): void {
        this.salesRequestStatus.updateEstimate = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.UPDATE_ESTIMATE_SUCCESS]() {
        this.salesRequestStatus.updateEstimate = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_ESTIMATE_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.updateEstimate = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Action
    public updateEstimate(recordEstimateRequestObject: RecordEstimateRequest) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/update-estimate',
            [ACTIONS.UPDATE_ESTIMATE_LOADING, ACTIONS.UPDATE_ESTIMATE_SUCCESS, ACTIONS.UPDATE_ESTIMATE_ERROR],
            recordEstimateRequestObject,
        );
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_LOADING](): void {
        this.salesDashboardRequest = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_SUCCESS](payload: SaleDashboardCards) {
        this.salesDashboardCards = payload;
        this.salesDashboardRequest = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_ERROR](error: RequestErrorObject) {
        this.salesDashboardRequest = Status.ERROR;
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getSalesDashboardCardsInfo() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/sale-service/get-sale-dashboard-cards`, [
            ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_LOADING,
            ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_SUCCESS,
            ACTIONS.GET_SALES_DASHBOARD_CARDS_INFO_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_LOADING](): void {
        this.salesRequestStatus.generatePdf = Status.LOADING;
        this.receiptPdfFile = '';
        this.errorCode = null;
        this.errorMessage = null;
    }

    @Mutation
    public [ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_SUCCESS]({ receiptPdfFile }: { receiptPdfFile: string }) {
        this.salesRequestStatus.generatePdf = Status.SUCCESS;
        this.receiptPdfFile = receiptPdfFile;
        this.errorCode = null;
        this.errorMessage = null;
    }

    @Mutation
    public [ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_ERROR](error: RequestErrorObject) {
        this.salesRequestStatus.generatePdf = Status.ERROR;
        this.receiptPdfFile = '';
        this.errorMessage = error.message;
        this.errorCode = error.code;
    }

    @Action
    public generatePdf({ saleKey, documentType }: { saleKey: string; documentType: DocumentPreviewType }) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/utility-service/generate-pdf/${saleKey}?type=${documentType}`, [
            ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_LOADING,
            ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_SUCCESS,
            ACTIONS.GENERATE_SALE_TRANSACTION_DOCUMENT_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.SET_PAYMENT_FORM_PREVIOUS_STATE](paymentForm: PaymentDetails) {
        this.previousStateOfPaymentForm = paymentForm;
    }

    @Action
    public setPaymentFormState(paymentForm: PaymentDetails) {
        this.context.commit(ACTIONS.SET_PAYMENT_FORM_PREVIOUS_STATE, paymentForm);
    }
}
