/*eslint-disable @typescript-eslint/no-explicit-any */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/constants';
import {
    Status as RequestStatus,
    MeasurementType,
    RequestErrorObject,
    PaymentAccount,
    Status,
    PaginationProperty,
} from '@/types';
import {
    Expense,
    ExpenseGroup,
    ExpenseRequest,
    ExpenseRequestStatus,
    BudgetPercentage,
    ExpenseDashboardStat,
    ExpensePaymentRequest,
    ExpenseDetails,
    ExpenseTaxType,
    ExpenseItemTypeRequest,
    ExpenseItemType,
    NewExpenseItemType,
    EditExpenseItemTypeRequest,
    ExpenseDashboardCards,
    ExpenseLineItem,
    ManageExpenseDetails,
    PaginatedExpenses,
    ExpenseTableDetails,
} from '@/pages/Spending/Expense/types';
import { ExpensePaymentDetails, defaultPaymentDetails } from '@/pages/Spending/Expense/RecordExpense/v4/types';

import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';

export interface State {
    expenseRequestStatus: ExpenseRequestStatus;
    expenseError: string;
    errorCode: number;
    expenses: PaginatedExpenses;
    expenseGroups: Array<ExpenseGroup>;
    expenseItemTypes: Array<ExpenseItemType>;
    measurementTypes: Array<MeasurementType>;
    budgetPercentages: Array<BudgetPercentage>;
    dashboardStats: ExpenseDashboardStat;
    expenseDetails: ExpenseDetails;
    newExpenseItemType: ExpenseItemType;
    taxTypes: Array<ExpenseTaxType>;
    paymentAccounts: Array<PaymentAccount>;
    expenseItemTypeKeyForEdit: string;
    dasboardCardRequest: Status;
    expenseDashbardCards: ExpenseDashboardCards;
    expenseFullDetails: ManageExpenseDetails;
    previousStateOfPaymentForm: ExpensePaymentDetails;
}

@Module({ namespaced: true, name: 'expense' })
export default class Expenses extends VuexModule {
    public expenseRequestStatus: ExpenseRequestStatus = {
        getbudgetPercentage: RequestStatus.NORMAL,
        getAllExpenses: RequestStatus.NORMAL,
        getExpenseItemsTypes: RequestStatus.NORMAL,
        getExpenseGroups: RequestStatus.NORMAL,
        createExpenseItemType: RequestStatus.NORMAL,
        createExpense: RequestStatus.NORMAL,
        getExpenseMeasurementTypes: RequestStatus.NORMAL,
        getDashboardStat: RequestStatus.NORMAL,
        addPayment: RequestStatus.NORMAL,
        getExpenseDetails: RequestStatus.NORMAL,
        getExpenseItemDetails: RequestStatus.NORMAL,
        updateExpense: RequestStatus.NORMAL,
        getExpenseTaxTypes: RequestStatus.NORMAL,
        getExpensePaymentAccounts: RequestStatus.NORMAL,
        updateExpenseItemType: RequestStatus.NORMAL,
        updateExpenseSupply: RequestStatus.NORMAL,
        cancelExpense: RequestStatus.NORMAL,
    };
    public expenseError = '';
    public errorCode: any = null;
    public expenses: PaginatedExpenses = {
        info: 0,
        items: [],
        total: 0,
    };
    public totalExpenseCount = 0;
    public expenseItemTypes: Array<ExpenseItemType> = [];
    public expenseGroups: Array<ExpenseGroup> = [];
    public measurementTypes: Array<MeasurementType> = [];
    public budgetPercentages: Array<BudgetPercentage> = [];
    public dashboardStats: ExpenseDashboardStat = {
        totalAmountOwed: 0,
    };
    public expenseDetails: ExpenseDetails = {
        expenseItemType: { key: '', name: ' ' },
        notes: '',
        unitCost: { currencyKey: 0, amount: 0 },
        amountPaid: { currencyKey: 0, amount: 0 },
        amountPaidInOfferCurrency: { currencyKey: 0, amount: 0 },
        quantity: 0,
        expenseItemKey: '',
        totalCost: { currencyKey: 0, amount: 0 },
        balance: { currencyKey: 0, amount: 0 },
        vendor: { name: '', key: '' },
        measurementType: { name: '', key: '' },
        paymentAccountKey: '',
        quantityReceived: 0,
        paymentDueDate: '',
        transactionDate: '',
        supplyDueDate: '',
        withholdingTax: { key: '', name: '' },
        withholdingTaxAmount: { amount: 0, currencyKey: 0 },
    };
    public expenseItemDetails: ExpenseLineItem = {
        expenseItemType: {
            key: '',
            name: '',
        },
        unitCost: { currencyKey: 0, amount: 0 },
        amountPaidInOfferCurrency: { currencyKey: 0, amount: 0 },
        amountPaid: { currencyKey: 0, amount: 0 },
        totalCost: { currencyKey: 0, amount: 0 },
        balance: { currencyKey: 0, amount: 0 },
        quantityReceived: 0,
        quantity: 0,
        vendor: {
            key: '',
            name: '',
        },
        withholdingTax: {
            key: '',
            name: '',
        },
        description: '',
        measurementType: {
            key: '',
            name: '',
        },
        paymentAccountKey: '',
        paymentDueDate: '',
        supplyDueDate: '',
        transactionDate: '',
        expenseItemKey: '',
        donationSchemeKey: '',
    };
    public newExpenseItemType: any = {
        name: '',
        expenseItemTypeKey: '',
        description: '',
        isMeasurable: false,
        estimatedCost: {
            amount: 0,
            currencyKey: '',
        },
    };
    public taxTypes: Array<ExpenseTaxType> = [];
    public paymentAccounts: Array<PaymentAccount> = [];
    public expenseItemTypeKeyForEdit = '';
    public dasboardCardRequest = Status.NORMAL;
    public expenseDashbardCards: ExpenseDashboardCards = {
        currentMonth: 0,
        functionalCurrencySymbol: '₦',
        expensesInCurrentMonth: {
            currencyKey: 0,
            amount: 0,
        },
        countOfExpensesInCurrentMonth: 0,
        unpaidExpenses: {
            currencyKey: 0,
            amount: 0,
        },
        countOfUnpaidExpenses: 0,
        countOfPendingDeliveries: 0,
    };
    public expenseFullDetails: ManageExpenseDetails = {
        vendorName: 'Baba Onigbese',
        amountPaid: { amount: 190000, currencyKey: 566 },
        balance: { amount: 8810000, currencyKey: 566 },
        delivery: [
            { itemCount: 9, itemName: 'Ankara Trouser', transactionDate: new Date().toISOString() },
            { itemCount: 2, itemName: 'Palazo Trouser', transactionDate: new Date().toISOString() },
            { itemCount: 5, itemName: 'Red Gown', transactionDate: new Date().toISOString() },
        ],
        expenseKey: 'HUIUT-898959-KJJFHF-8727994-948984H',
        payments: [
            {
                bankAccount: 'Access Bank PLC',
                amountPaid: { amount: 100, currencyKey: 566 },
                datePaid: new Date().toISOString(),
            },
            {
                bankAccount: 'Access Bank PLC',
                amountPaid: { amount: 1900, currencyKey: 566 },
                datePaid: new Date().toISOString(),
            },
            {
                bankAccount: 'Access Bank PLC',
                amountPaid: { amount: 500, currencyKey: 566 },
                datePaid: new Date().toISOString(),
            },
        ],
        totalAmount: { amount: 9000000, currencyKey: 566 },
        transactionId: '#74878',
        transactionDate: new Date().toISOString(),
        expenseItems: [
            {
                itemName: 'Ankara Trouser',
                deliveryStatus: 'Not Delivered',
                quantity: 5,
                quantitySupplied: 1,
                unitCost: { amount: 900, currencyKey: 566 },
                measurementTypeName: 'Piece',
            },
            {
                itemName: 'Gold Gown',
                deliveryStatus: 'Partial Delivery',
                quantity: 5,
                quantitySupplied: 1,
                unitCost: { amount: 900, currencyKey: 566 },
                measurementTypeName: 'Piece',
            },
            {
                itemName: 'Ankara Shirt',
                deliveryStatus: 'Delivered',
                quantity: 5,
                quantitySupplied: 5,
                unitCost: { amount: 900, currencyKey: 566 },
                measurementTypeName: 'Piece',
            },
            {
                itemName: 'Ankara Trouser',
                deliveryStatus: 'Delivered',
                quantity: 5,
                quantitySupplied: 5,
                unitCost: { amount: 900, currencyKey: 566 },
                measurementTypeName: 'Piece',
            },
        ],
    };

    public previousStateOfPaymentForm: ExpensePaymentDetails = { ...defaultPaymentDetails };

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.expenseError = '';
    }

    @Mutation
    public [ACTIONS.FETCH_EXPENSES_LOADING](): void {
        this.expenseRequestStatus.getAllExpenses = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.FETCH_EXPENSES_SUCCESS](payload: PaginatedExpenses) {
        this.expenseRequestStatus.getAllExpenses = RequestStatus.SUCCESS;
        this.expenses = payload;
        this.totalExpenseCount = payload.total;
    }

    @Mutation
    public [ACTIONS.FETCH_EXPENSES_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getAllExpenses = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getAllExpenses({ page = 1, limit = 8 }: PaginationProperty): Promise<ExpenseTableDetails[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/expense-service/get-expenses-paged?page=${page}&limit=${limit}`,
            [ACTIONS.FETCH_EXPENSES_LOADING, ACTIONS.FETCH_EXPENSES_SUCCESS, ACTIONS.FETCH_EXPENSES_ERROR],
        );
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_TYPES_LOADING](): void {
        this.expenseRequestStatus.getExpenseItemsTypes = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_TYPES_SUCCESS](payload: Array<ExpenseItemType>) {
        this.expenseRequestStatus.getExpenseItemsTypes = RequestStatus.SUCCESS;
        this.expenseItemTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_TYPES_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseItemsTypes = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getExpenseItemTypes(): Promise<Array<ExpenseItemType>> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-expense-item-types', [
            ACTIONS.GET_EXPENSE_ITEM_TYPES_LOADING,
            ACTIONS.GET_EXPENSE_ITEM_TYPES_SUCCESS,
            ACTIONS.GET_EXPENSE_ITEM_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_LOADING](): void {
        this.expenseRequestStatus.getbudgetPercentage = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_SUCCESS](payload: BudgetPercentage[]) {
        this.expenseRequestStatus.getbudgetPercentage = RequestStatus.SUCCESS;
        this.budgetPercentages = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getbudgetPercentage = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getExpenseBudgetPercentages(month = ''): Promise<BudgetPercentage[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/expense-service/get-expense-budget-percentage?month=${month}`, [
            ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_LOADING,
            ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_SUCCESS,
            ACTIONS.GET_EXPENSE_BUDGET_PERCENTAGE_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_GROUPS_LOADING](): void {
        this.expenseRequestStatus.getExpenseGroups = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_GROUPS_SUCCESS](payload: any) {
        this.expenseRequestStatus.getExpenseGroups = RequestStatus.SUCCESS;
        this.expenseGroups = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_GROUPS_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseGroups = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getAllExpenseGroups(): Promise<any[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'expense-service/get-expense-groups', [
            ACTIONS.GET_EXPENSE_GROUPS_LOADING,
            ACTIONS.GET_EXPENSE_GROUPS_SUCCESS,
            ACTIONS.GET_EXPENSE_GROUPS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_ITEM_TYPE_LOADING](): void {
        this.expenseRequestStatus.createExpenseItemType = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_ITEM_TYPE_SUCCESS](payload: NewExpenseItemType) {
        this.expenseRequestStatus.createExpenseItemType = RequestStatus.SUCCESS;

        const {
            expenseItemTypeKey,
            name,
            isMeasurable,
            estimatedCost: { amount, currencyKey },
            description,
            financialYearStartDate,
        } = payload;
        // we need the created resource to match the existing structure of the expense item types
        const newExpenseItemType = {
            expenseItemTypeKey,
            isMeasurable,
            name,
            lastTransactionAmount: { currencyKey, amount },
            lastTransactionDate: '',
            notes: description,
            totalFinancialYearAmount: { currencyKey: '', amount: 0 },
            description,
            financialYearStartDate,
        };

        this.newExpenseItemType = newExpenseItemType;

        this.expenseItemTypes = this.expenseItemTypes.concat(newExpenseItemType);
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_ITEM_TYPE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.createExpenseItemType = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createExpenseItemType(expenseItemType: ExpenseItemTypeRequest): Promise<NewExpenseItemType> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/create-expense-item-type',
            [
                ACTIONS.CREATE_EXPENSE_ITEM_TYPE_LOADING,
                ACTIONS.CREATE_EXPENSE_ITEM_TYPE_SUCCESS,
                ACTIONS.CREATE_EXPENSE_ITEM_TYPE_ERROR,
            ],
            expenseItemType,
        );
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_LOADING](): void {
        this.expenseRequestStatus.createExpense = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_SUCCESS]() {
        this.expenseRequestStatus.createExpense = RequestStatus.SUCCESS;
    }

    @Mutation
    public [ACTIONS.CREATE_EXPENSE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.createExpense = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public createExpense(expenseBody: ExpenseRequest[]): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/create-expense',
            [ACTIONS.CREATE_EXPENSE_LOADING, ACTIONS.CREATE_EXPENSE_SUCCESS, ACTIONS.CREATE_EXPENSE_ERROR],
            { expenseItems: expenseBody },
        );
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_LOADING](): void {
        this.expenseRequestStatus.getExpenseMeasurementTypes = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_SUCCESS](payload: MeasurementType[]) {
        this.expenseRequestStatus.getExpenseMeasurementTypes = RequestStatus.SUCCESS;
        this.measurementTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseMeasurementTypes = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getMeasurementTypes(): Promise<MeasurementType[]> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-measurement-types', [
            ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_LOADING,
            ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_SUCCESS,
            ACTIONS.GET_EXPENSE_MEASUREMENT_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_STATS_LOADING](): void {
        this.expenseRequestStatus.getDashboardStat = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_STATS_SUCCESS](payload: ExpenseDashboardStat) {
        this.expenseRequestStatus.getDashboardStat = RequestStatus.SUCCESS;
        this.dashboardStats = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_STATS_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getDashboardStat = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getDashboardStats(): Promise<ExpenseDashboardStat> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-total-amount-owed', [
            ACTIONS.GET_EXPENSE_DASHBOARD_STATS_LOADING,
            ACTIONS.GET_EXPENSE_DASHBOARD_STATS_SUCCESS,
            ACTIONS.GET_EXPENSE_DASHBOARD_STATS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.ADD_EXPENSE_PAYMENT_LOADING](): void {
        this.expenseRequestStatus.addPayment = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.ADD_EXPENSE_PAYMENT_SUCCESS]() {
        this.expenseRequestStatus.addPayment = RequestStatus.SUCCESS;

        // const { datePaid, amount, paymentTypeName } = payload;
        // const { amountPaid, balance } = this.expenseDetails;

        // this.expenseDetails.amountPaid = amountPaid + amount;
        // this.expenseDetails.balance = balance - amount;
        // this.expenseDetails.payments.push({ datePaid, paymentTypeName, amount });
    }

    @Mutation
    public [ACTIONS.ADD_EXPENSE_PAYMENT_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.addPayment = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public addPayment(newPayment: ExpensePaymentRequest): Promise<ExpensePaymentRequest> | object {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/expense-service/add-payment',
            [
                ACTIONS.ADD_EXPENSE_PAYMENT_LOADING,
                ACTIONS.ADD_EXPENSE_PAYMENT_SUCCESS,
                ACTIONS.ADD_EXPENSE_PAYMENT_ERROR,
            ],
            newPayment,
        );
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DETAILS_LOADING](): void {
        this.expenseRequestStatus.getExpenseDetails = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DETAILS_SUCCESS](payload: ExpenseDetails) {
        this.expenseRequestStatus.getExpenseDetails = RequestStatus.SUCCESS;
        this.expenseDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DETAILS_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseDetails = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getExpenseDetails(expenseKey: string): Promise<ExpenseDetails> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/expense-service/get-expense-detail/${expenseKey}`, [
            ACTIONS.GET_EXPENSE_DETAILS_LOADING,
            ACTIONS.GET_EXPENSE_DETAILS_SUCCESS,
            ACTIONS.GET_EXPENSE_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_DETAILS_LOADING](): void {
        this.expenseRequestStatus.getExpenseItemDetails = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_DETAILS_SUCCESS](payload: ExpenseLineItem) {
        this.expenseRequestStatus.getExpenseItemDetails = RequestStatus.SUCCESS;
        this.expenseItemDetails = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_ITEM_DETAILS_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseItemDetails = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getExpenseItemDetails(expenseItemKey: string): Promise<ExpenseLineItem> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/expense-service/get-expense-detail/${expenseItemKey}`, [
            ACTIONS.GET_EXPENSE_ITEM_DETAILS_LOADING,
            ACTIONS.GET_EXPENSE_ITEM_DETAILS_SUCCESS,
            ACTIONS.GET_EXPENSE_ITEM_DETAILS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_LOADING](): void {
        this.expenseRequestStatus.updateExpense = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_SUCCESS]() {
        this.expenseRequestStatus.updateExpense = RequestStatus.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.updateExpense = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public updateExpense({
        expenseBody,
        expenseKey,
    }: {
        expenseBody: ExpenseRequest;
        expenseKey: string;
    }): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/expense-service/update-edited-expense/${expenseKey}`,
            [ACTIONS.UPDATE_EXPENSE_LOADING, ACTIONS.UPDATE_EXPENSE_SUCCESS, ACTIONS.UPDATE_EXPENSE_ERROR],
            { ...expenseBody },
        );
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_TAXTYPES_LOADING](): void {
        this.expenseRequestStatus.getExpenseTaxTypes = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_TAXTYPES_SUCCESS](payload: Array<ExpenseTaxType>) {
        this.expenseRequestStatus.getExpenseTaxTypes = RequestStatus.SUCCESS;
        this.taxTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_TAXTYPES_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpenseTaxTypes = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getTaxTypes(): Promise<ExpenseTaxType> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-tax-types', [
            ACTIONS.GET_EXPENSE_TAXTYPES_LOADING,
            ACTIONS.GET_EXPENSE_TAXTYPES_SUCCESS,
            ACTIONS.GET_EXPENSE_TAXTYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_LOADING](): void {
        this.expenseRequestStatus.getExpensePaymentAccounts = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_SUCCESS](payload: Array<PaymentAccount>) {
        this.expenseRequestStatus.getExpensePaymentAccounts = RequestStatus.SUCCESS;
        this.paymentAccounts = payload;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.getExpensePaymentAccounts = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getPaymentAccounts(): Promise<PaymentAccount> | object {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/get-payment-accounts', [
            ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_LOADING,
            ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_SUCCESS,
            ACTIONS.GET_EXPENSE_PAYMENT_ACCOUNTS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_LOADING](): void {
        this.expenseRequestStatus.updateExpenseItemType = RequestStatus.LOADING;
    }

    @Mutation
    public setExpenseItemTypeKeyForEdit(expenseItemKey: string): void {
        this.expenseItemTypeKeyForEdit = expenseItemKey;
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_SUCCESS]({ name, description }: ExpenseItemTypeRequest) {
        this.expenseRequestStatus.updateExpenseItemType = RequestStatus.SUCCESS;

        // find the expenseItemType with the key
        const editedExpenseItemTypeIndex = this.expenseItemTypes.findIndex(
            (expenseItemType: ExpenseItemType) => expenseItemType.expenseItemTypeKey === this.expenseItemTypeKeyForEdit,
        );

        const editedExpenseItemType = this.expenseItemTypes[editedExpenseItemTypeIndex];

        this.expenseItemTypes.splice(editedExpenseItemTypeIndex, 1, { ...editedExpenseItemType, name, description });
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.updateExpenseItemType = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public updateExpenseItemType({
        editForm,
        expenseItemTypeKey,
    }: {
        editForm: EditExpenseItemTypeRequest;
        expenseItemTypeKey: string;
    }): Promise<ExpenseItemType> | object {
        this.context.commit('setExpenseItemTypeKeyForEdit', expenseItemTypeKey);
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/expense-service/update-expense-item-type/${expenseItemTypeKey}`,
            [
                ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_LOADING,
                ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_SUCCESS,
                ACTIONS.UPDATE_EXPENSE_ITEM_TYPE_ERROR,
            ],
            editForm,
        );
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_LOADING](): void {
        this.dasboardCardRequest = Status.LOADING;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_SUCCESS](payload: ExpenseDashboardCards) {
        this.expenseDashbardCards = payload;
        this.dasboardCardRequest = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_ERROR](error: RequestErrorObject) {
        this.expenseError = error.message;
        this.errorCode = error.code;
        this.dasboardCardRequest = Status.ERROR;
    }

    @Action
    public getExpenseDashboardCardsInfo() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/expense-service/expense-dashboard-cards', [
            ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_LOADING,
            ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_SUCCESS,
            ACTIONS.GET_EXPENSE_DASHBOARD_CARDS_INFO_ERROR,
        ]);
    }

    @Action
    public resetExpenseErrorState(): void {
        this.context.commit(ACTIONS.RESET_EXPENSE_ERROR_STATE);
    }

    @Mutation
    public [ACTIONS.RESET_EXPENSE_ERROR_STATE](): void {
        this.expenseError = '';
    }

    @Mutation
    public [ACTIONS.SET_PAYMENT_FORM_PREVIOUS_STATE](paymentForm: ExpensePaymentDetails) {
        this.previousStateOfPaymentForm = paymentForm;
    }

    @Action
    public setPaymentFormState(paymentForm: ExpensePaymentDetails) {
        this.context.commit(ACTIONS.SET_PAYMENT_FORM_PREVIOUS_STATE, paymentForm);
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_SUPPLY_LOADING](): void {
        this.expenseRequestStatus.updateExpenseSupply = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_SUPPLY_SUCCESS]() {
        this.expenseRequestStatus.updateExpenseSupply = RequestStatus.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_EXPENSE_SUPPLY_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.updateExpenseSupply = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public updateExpenseSupply({
        supllyDetails,
        expenseItemTypeKey,
    }: {
        supllyDetails: { quantity: number; transactionDate: string; outstandingBalanceDueDate: string };
        expenseItemTypeKey: string;
    }): Promise<void> | object {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/expense-service/update-expense-supply/${expenseItemTypeKey}`,
            [
                ACTIONS.UPDATE_EXPENSE_SUPPLY_LOADING,
                ACTIONS.UPDATE_EXPENSE_SUPPLY_SUCCESS,
                ACTIONS.UPDATE_EXPENSE_SUPPLY_ERROR,
            ],
            supllyDetails,
        );
    }

    @Mutation
    public [ACTIONS.CANCEL_EXPENSE_LOADING](): void {
        this.expenseRequestStatus.cancelExpense = RequestStatus.LOADING;
    }

    @Mutation
    public [ACTIONS.CANCEL_EXPENSE_SUCCESS]() {
        this.expenseRequestStatus.cancelExpense = RequestStatus.SUCCESS;
    }

    @Mutation
    public [ACTIONS.CANCEL_EXPENSE_ERROR](error: RequestErrorObject) {
        this.expenseRequestStatus.cancelExpense = RequestStatus.ERROR;
        this.expenseError = error.message;
        this.errorCode = error.code;
    }

    @Action
    public cancelExpense(expenseItemKey: string) {
        this.context.commit('clearErrors');

        return genericPutRequest(this.context.commit, `/expense-service/cancel-expense/${expenseItemKey}`, [
            ACTIONS.CANCEL_EXPENSE_LOADING,
            ACTIONS.CANCEL_EXPENSE_SUCCESS,
            ACTIONS.CANCEL_EXPENSE_ERROR,
        ]);
    }
}
