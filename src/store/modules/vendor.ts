/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/vendor-module-constants';
import { Status, Vendor, defaultVendor, RequestErrorObject, TransactionCardDetails } from '@/types';
import { VendorRequestStatus, AddVendorRequest } from '@/pages/Spending/Expense/types';
import { VendorTransaction } from '@/pages/Spending/Expense/ManageVendors/types';

import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';

export interface State {
    vendorRequestStatus: VendorRequestStatus;
    error: any;
    errorCode: any;
    vendors: Array<Vendor>;
    createdVendor: Vendor;
}

@Module({ namespaced: true, name: 'vendor' })
export default class VendorModule extends VuexModule {
    public vendorRequestStatus: VendorRequestStatus = {
        addVendor: Status.NORMAL,
        getVendors: Status.NORMAL,
        updateVendor: Status.NORMAL,
        getTransactions: Status.NORMAL,
        getTransactionCardDetails: Status.NORMAL,
    };
    public error: any = null;
    public errorCode: any = null;
    public vendors: Array<Vendor> = [];
    public createdVendor: Vendor = { ...defaultVendor };
    public transactionCardDetails: TransactionCardDetails[] = [];
    public vendorTransactions: VendorTransaction[] = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_VENDORS_LOADING](): void {
        this.vendorRequestStatus.getVendors = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_VENDORS_SUCCESS](payload: any) {
        this.vendorRequestStatus.getVendors = Status.SUCCESS;
        this.vendors = payload.items;
    }

    @Mutation
    public [ACTIONS.GET_VENDORS_ERROR](error: RequestErrorObject) {
        this.vendorRequestStatus.getVendors = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getVendors(): Promise<Vendor[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-vendors', [
            ACTIONS.GET_VENDORS_LOADING,
            ACTIONS.GET_VENDORS_SUCCESS,
            ACTIONS.GET_VENDORS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_VENDOR_LOADING](): void {
        this.vendorRequestStatus.addVendor = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_VENDOR_SUCCESS](payload: Vendor) {
        this.vendorRequestStatus.addVendor = Status.SUCCESS;
        this.createdVendor = payload;
        this.vendors.unshift(payload);
    }

    @Mutation
    public [ACTIONS.CREATE_VENDOR_ERROR](error: RequestErrorObject) {
        this.vendorRequestStatus.addVendor = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createVendor(vendorRequest: AddVendorRequest): Promise<Vendor> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            'expense-service/create-vendor',
            [ACTIONS.CREATE_VENDOR_LOADING, ACTIONS.CREATE_VENDOR_SUCCESS, ACTIONS.CREATE_VENDOR_ERROR],
            vendorRequest,
        );
    }

    @Mutation
    public [ACTIONS.UPDATE_VENDOR_DETAILS_LOADING]() {
        this.vendorRequestStatus.updateVendor = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_VENDOR_DETAILS_SUCCESS]() {
        this.vendorRequestStatus.updateVendor = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_VENDOR_DETAILS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.vendorRequestStatus.updateVendor = Status.ERROR;
    }

    @Action
    updateVendorDetails(vendorDetails: AddVendorRequest) {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/expense-service/update-vendor/${vendorDetails.vendorKey}`,
            [
                ACTIONS.UPDATE_VENDOR_DETAILS_LOADING,
                ACTIONS.UPDATE_VENDOR_DETAILS_SUCCESS,
                ACTIONS.UPDATE_VENDOR_DETAILS_ERROR,
            ],
            vendorDetails,
        );
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_LOADING](): void {
        this.vendorRequestStatus.getTransactionCardDetails = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_SUCCESS](payload: TransactionCardDetails[]) {
        this.vendorRequestStatus.getTransactionCardDetails = Status.SUCCESS;
        this.transactionCardDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTION_CARD_DETAILS_ERROR](error: RequestErrorObject) {
        this.vendorRequestStatus.getTransactionCardDetails = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getTransactionCardDetails(vendorKey: string): Promise<Vendor[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/expense-service/vendor-transactions-dashbaord-data/${vendorKey}`,
            [
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_LOADING,
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_SUCCESS,
                ACTIONS.GET_TRANSACTION_CARD_DETAILS_ERROR,
            ],
        );
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_LOADING](): void {
        this.vendorRequestStatus.getTransactions = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_SUCCESS](payload: VendorTransaction[]) {
        this.vendorRequestStatus.getTransactions = Status.SUCCESS;
        this.vendorTransactions = payload;
    }

    @Mutation
    public [ACTIONS.GET_TRANSACTIONS_ERROR](error: RequestErrorObject) {
        this.vendorRequestStatus.getTransactions = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getTransactions(vendorKey: string): Promise<Vendor[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/expense-service/vendor-transactions/${vendorKey}`, [
            ACTIONS.GET_TRANSACTIONS_LOADING,
            ACTIONS.GET_TRANSACTIONS_SUCCESS,
            ACTIONS.GET_TRANSACTIONS_ERROR,
        ]);
    }
}
