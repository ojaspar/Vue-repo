/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/bank-module-constants';

import { Status, RequestErrorObject } from '@/types';

import { genericGetRequest, genericPutRequest, genericPostRequest } from '@/utils/request';
import {
    BankRequest,
    BankDetails,
    BankAccount,
    FundTransferPayload,
    AccountTransaction,
} from '@/pages/Spending/Banking/types';

export interface State {
    error: any;
    errorCode: any;
    bankRequest: BankRequest;
    bankAccounts: Array<BankAccount>;
    selectedAccountForTransactionView: BankAccount;
    accountTransactions: AccountTransaction[];
}

@Module({ namespaced: true, name: 'bank' })
export default class Bank extends VuexModule {
    public error: any = null;
    public errorCode: any = null;
    public bankRequest: BankRequest = {
        addBankAccount: Status.NORMAL,
        updateBankAccount: Status.NORMAL,
        getPaymentAccounts: Status.NORMAL,
        transferFund: Status.NORMAL,
        getTransactions: Status.NORMAL,
        getAccountDetails: Status.NORMAL,
    };
    public paymentAccounts: BankDetails[] = [];
    public updatedAccount: BankDetails = {
        bankAccountKey: '',
        bankName: '',
        accountNumber: '',
        displayName: '',
        accountBalance: { currencyKey: '', amount: 0 },
        sourcePaymentAccountKey: '',
    };
    public accountTransactions: AccountTransaction[] = [];
    public paymentAccountDetails: BankDetails = {
        bankAccountKey: '',
        bankName: '',
        accountNumber: '',
        displayName: '',
        accountBalance: { currencyKey: '', amount: 0 },
        sourcePaymentAccountKey: '',
    };

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.ADD_NEW_BANK_LOADING]() {
        this.bankRequest.addBankAccount = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.ADD_NEW_BANK_SUCCESS]() {
        this.bankRequest.addBankAccount = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.ADD_NEW_BANK_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.addBankAccount = Status.ERROR;
    }

    @Action
    createBankAccount(bankDetails: BankDetails) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/bank-service/create-payment-account',
            [ACTIONS.ADD_NEW_BANK_LOADING, ACTIONS.ADD_NEW_BANK_SUCCESS, ACTIONS.ADD_NEW_BANK_ERROR],
            bankDetails,
        );
    }

    @Mutation
    public [ACTIONS.UPDATE_BANK_LOADING]() {
        this.bankRequest.updateBankAccount = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_BANK_SUCCESS](payload: BankDetails) {
        this.updatedAccount = Object.assign(this.updatedAccount, payload);
        this.bankRequest.updateBankAccount = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_BANK_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.updateBankAccount = Status.ERROR;
    }

    @Action
    updateBankAccount(bankDetails: BankDetails) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/bank-service/update-payment-account/${bankDetails.bankAccountKey}`,
            [ACTIONS.UPDATE_BANK_LOADING, ACTIONS.UPDATE_BANK_SUCCESS, ACTIONS.UPDATE_BANK_ERROR],
            bankDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_BANK_ACCOUNTS_LOADING]() {
        this.bankRequest.getPaymentAccounts = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_BANK_ACCOUNTS_SUCCESS](payload: Array<BankDetails>) {
        this.paymentAccounts = payload;
        this.bankRequest.getPaymentAccounts = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_BANK_ACCOUNTS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.getPaymentAccounts = Status.ERROR;
    }

    @Action
    getPaymentAccounts() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/bank-service/get-payment-accounts', [
            ACTIONS.GET_BANK_ACCOUNTS_LOADING,
            ACTIONS.GET_BANK_ACCOUNTS_SUCCESS,
            ACTIONS.GET_BANK_ACCOUNTS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.FUND_TRANSFER_LOADING]() {
        this.bankRequest.transferFund = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.FUND_TRANSFER_SUCCESS]() {
        this.bankRequest.transferFund = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.FUND_TRANSFER_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.transferFund = Status.ERROR;
    }

    @Action
    public transferFunds(fundTransferDetails: FundTransferPayload) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/bank-service/bank-transfer',
            [ACTIONS.FUND_TRANSFER_LOADING, ACTIONS.FUND_TRANSFER_SUCCESS, ACTIONS.FUND_TRANSFER_ERROR],
            fundTransferDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_LOADING]() {
        this.bankRequest.getTransactions = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_SUCCESS](payload: Array<AccountTransaction>) {
        this.accountTransactions = payload;
        this.bankRequest.getTransactions = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.getTransactions = Status.ERROR;
    }

    @Action
    getPaymentAccountTransactions(paymentAccountKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/bank-service/get-bank-transactions/${paymentAccountKey}`, [
            ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_LOADING,
            ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_SUCCESS,
            ACTIONS.GET_PAYMENT_ACCOUNT_TRANSACTIONS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_LOADING]() {
        this.bankRequest.getAccountDetails = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_SUCCESS](payload: BankDetails) {
        this.paymentAccountDetails = payload;
        this.bankRequest.getAccountDetails = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.bankRequest.getAccountDetails = Status.ERROR;
    }

    @Action
    getPaymentAccountDetails(bankAccountKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/bank-service/get-payment-account-detail/${bankAccountKey}`, [
            ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_LOADING,
            ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_SUCCESS,
            ACTIONS.GET_PAYMENT_ACCOUNT_DETAILS_ERROR,
        ]);
    }
}
