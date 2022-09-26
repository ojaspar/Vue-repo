/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/customer-module-constants';

import { CustomerProfile, Status, RequestErrorObject, CustomerRequest, TransactionCardDetails } from '@/types';

import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';
import { CustomerBioData, CustomerTransaction } from '@/pages/Sales/ManageCustomers/types';
import { SaleCustomer } from '@/pages/Sales/types';
export interface State {
    customerRequest: CustomerRequest;
    error: any;
    errorCode: any;
    newCustomer: SaleCustomer;
    customers: Array<SaleCustomer>;
}
@Module({ namespaced: true, name: 'customer' })
export default class Customer extends VuexModule {
    public customerRequest: CustomerRequest = {
        addCutomer: Status.NORMAL,
        getCustomers: Status.NORMAL,
        updateCustomer: Status.NORMAL,
        getTransactions: Status.NORMAL,
        getTransactionCardDetails: Status.NORMAL,
    };
    public error: any = null;
    public errorCode: any = null;
    public newCustomer: SaleCustomer = {
        name: '',
        phoneNumber: '',
        email: '',
        lastInteractionDate: '',
        lastInteractionAge: '',
        customerKey: '',
        totalPrepayment: { amount: 0, currencyKey: '' },
        financialYearStartDate: '',
        lastInteraction: '',
        totalBalanceDue: { currencyKey: '', amount: 0 },
        totalFinancialYearSale: { amount: 0, currencyKey: '' },
        address: '',
        notes: '',
    };
    public customers: Array<SaleCustomer> = [];
    public customerKey = '';
    public transactionCardDetails: TransactionCardDetails[] = [];
    public customerTransactions: CustomerTransaction[] = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.REGISTER_CUSTOMER_LOADING]() {
        this.customerRequest.addCutomer = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.REGISTER_CUSTOMER_SUCCESS](payload: CustomerProfile) {
        this.customerRequest.addCutomer = Status.SUCCESS;
        const { email, name, phoneNumber, customerKey, notes, address } = payload;
        const newCustomer: SaleCustomer = {
            name,
            phoneNumber,
            email,
            lastInteractionDate: '',
            lastInteractionAge: '',
            customerKey,
            totalPrepayment: { amount: 0, currencyKey: '' },
            financialYearStartDate: '',
            lastInteraction: '',
            totalBalanceDue: { currencyKey: '', amount: 0 },
            totalFinancialYearSale: { amount: 0, currencyKey: '' },
            address: address ? address.toString() : '',
            notes: notes ? notes.toString() : '',
        };
        this.newCustomer = newCustomer;
        this.customers.unshift(this.newCustomer);
    }

    @Mutation
    public [ACTIONS.REGISTER_CUSTOMER_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.customerRequest.addCutomer = Status.ERROR;
    }

    @Action
    registerNewCustomer(customerInfo: CustomerBioData) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/create-customer',
            [ACTIONS.REGISTER_CUSTOMER_LOADING, ACTIONS.REGISTER_CUSTOMER_SUCCESS, ACTIONS.REGISTER_CUSTOMER_ERROR],
            customerInfo,
        );
    }

    @Mutation
    public [ACTIONS.GET_CUSTOMERS_LOADING]() {
        this.customerRequest.getCustomers = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_CUSTOMERS_SUCCESS](payload: Array<SaleCustomer>) {
        this.customerRequest.getCustomers = Status.SUCCESS;
        this.customers = payload;
    }

    @Mutation
    public [ACTIONS.GET_CUSTOMERS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.customerRequest.getCustomers = Status.ERROR;
    }

    @Action
    getCustomers() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-customers', [
            ACTIONS.GET_CUSTOMERS_LOADING,
            ACTIONS.GET_CUSTOMERS_SUCCESS,
            ACTIONS.GET_CUSTOMERS_ERROR,
        ]);
    }

    @Mutation
    public keepCustomerDetails(customerKey: string) {
        this.customerKey = customerKey;
    }

    @Mutation
    public [ACTIONS.UPDATE_CUSTOMER_DETAILS_LOADING]() {
        this.customerRequest.updateCustomer = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_CUSTOMER_DETAILS_SUCCESS](payload: SaleCustomer) {
        this.customerRequest.updateCustomer = Status.SUCCESS;

        const indexOfUpdatedItem = this.customers.findIndex(
            (customer: SaleCustomer) => customer.customerKey === this.customerKey,
        );

        const existingCustomer = this.customers[indexOfUpdatedItem];

        this.customers.splice(indexOfUpdatedItem, 1, { ...existingCustomer, ...payload });
    }

    @Mutation
    public [ACTIONS.UPDATE_CUSTOMER_DETAILS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.customerRequest.updateCustomer = Status.ERROR;
    }

    @Action
    updateCustomer({ customerKey, customerDetails }: { customerKey: string; customerDetails: CustomerBioData }) {
        this.context.commit('keepCustomerDetails', customerKey);
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/sale-service/update-customer/${customerKey}`,
            [
                ACTIONS.UPDATE_CUSTOMER_DETAILS_LOADING,
                ACTIONS.UPDATE_CUSTOMER_DETAILS_SUCCESS,
                ACTIONS.UPDATE_CUSTOMER_DETAILS_ERROR,
            ],
            customerDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_LOADING]() {
        this.customerRequest.getTransactionCardDetails = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_SUCCESS](payload: TransactionCardDetails[]) {
        this.customerRequest.getTransactionCardDetails = Status.SUCCESS;
        this.transactionCardDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.customerRequest.getTransactionCardDetails = Status.ERROR;
    }

    @Action
    getTransactionCardDetails(customerKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/sale-service/get-customer-sale-transaction-dashboard/${customerKey}`,
            [
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_LOADING,
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_SUCCESS,
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_ERROR,
            ],
        );
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_LOADING]() {
        this.customerRequest.getTransactions = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_SUCCESS](payload: CustomerTransaction[]) {
        this.customerRequest.getTransactions = Status.SUCCESS;
        this.customerTransactions = payload;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.customerRequest.getTransactions = Status.ERROR;
    }

    @Action
    getTransactions(customerKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/sale-service/get-customer-sale-transactions/${customerKey}`, [
            ACTIONS.GET_TRANSACTIONS_LOADING,
            ACTIONS.GET_TRANSACTIONS_SUCCESS,
            ACTIONS.GET_TRANSACTIONS_ERROR,
        ]);
    }
}
