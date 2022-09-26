/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/product-module-constants';

import {
    Status,
    IncomeType,
    ProductResponse,
    MeasurementType,
    CreatedProduct,
    RequestErrorObject,
    VatOption,
} from '@/types';

import { IncomeGroup, ProductRequest, Product, ProductDetails } from '@/pages/Sales/types';
import { genericGetRequest, genericPostRequest, genericPutRequest } from '@/utils/request';
import { ProductTransaction } from '@/pages/Sales/ManageProducts/types';

export interface State {
    status: Status;
    error: any;
    errorCode: any;
    incomeTypes: Array<IncomeType>;
    newProduct: Product;
    products: Array<Product>;
    vatOptionsRequest: Status;
    vatOptions: Array<VatOption>;
    incomeGroupRequest: Status;
    productRequests: ProductRequest;
}

@Module({ namespaced: true, name: 'product' })
export default class Products extends VuexModule {
    public status: string = Status.NORMAL;
    public error: any = null;
    public errorCode: any = null;
    public incomeTypes: Array<IncomeType> = [];
    public measurementTypes: Array<MeasurementType> = [];
    public vatOptionsRequest = Status.NORMAL;
    public vatOptions: Array<VatOption> = [];
    public incomeGroupRequest = Status.NORMAL;
    public incomeGroups: Array<IncomeGroup> = [];
    public productRequests: ProductRequest = {
        addProduct: Status.NORMAL,
        editProduct: Status.NORMAL,
        getProducts: Status.NORMAL,
        getProductTransactions: Status.NORMAL,
    };

    public products: Array<Product> = [];

    public newProduct: Product = {
        name: '',
        description: '',
        incomeGroupKey: '',
        estimatedPrice: { currencyKey: 0, amount: 0 },
        measurementTypeKey: '',
        financialYearStartDate: '',
        lastSaleDate: '',
        lastSaleAge: '',
        lastSalePrice: { amount: 0, currencyKey: 0 },
        productKey: '',
        totalFinancialYearSale: { currencyKey: 0, amount: 0 },
    };

    public newProductMeasurementTypeKey = '';

    public productTransactions: ProductTransaction[] = [];

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_INCOME_TYPES_LOADING]() {
        this.status = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_INCOME_TYPES_SUCCESS](payload: IncomeType[]) {
        this.status = Status.SUCCESS;
        this.incomeTypes = payload;
    }

    @Mutation
    public [ACTIONS.GET_INCOME_TYPES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.status = Status.ERROR;
    }

    @Action
    public getIncomeTypes(): Promise<IncomeType | object> {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/account-service/get-income-type-per-vertical', [
            ACTIONS.GET_INCOME_TYPES_LOADING,
            ACTIONS.GET_INCOME_TYPES_SUCCESS,
            ACTIONS.GET_INCOME_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_MEASUREMENT_TYPES_LOADING]() {
        this.status = Status.LOADING;
        this.error = null;
    }
    @Mutation
    public [ACTIONS.GET_MEASUREMENT_TYPES_SUCCESS](payload: Array<MeasurementType>) {
        this.status = Status.SUCCESS;
        this.measurementTypes = payload;
    }
    @Mutation
    public [ACTIONS.GET_MEASUREMENT_TYPES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.status = Status.ERROR;
    }

    @Action
    public getMeasurementTypes(): Promise<MeasurementType | object> {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-measurement-types', [
            ACTIONS.GET_MEASUREMENT_TYPES_LOADING,
            ACTIONS.GET_MEASUREMENT_TYPES_SUCCESS,
            ACTIONS.GET_MEASUREMENT_TYPES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.REGISTER_PRODUCT_LOADING]() {
        this.productRequests.addProduct = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public storeProductMeasurementTypeKey(measurementTypeKey: string) {
        this.newProductMeasurementTypeKey = measurementTypeKey;
    }

    @Mutation
    public [ACTIONS.REGISTER_PRODUCT_SUCCESS](payload: ProductDetails) {
        this.productRequests.addProduct = Status.SUCCESS;
        const { name, description, estimatedPrice, incomeGroupKey, productKey } = payload;

        const newProduct: Product = {
            name,
            description,
            incomeGroupKey,
            estimatedPrice,
            measurementTypeKey: this.newProductMeasurementTypeKey,
            financialYearStartDate: '',
            lastSaleDate: '',
            lastSaleAge: '',
            lastSalePrice: estimatedPrice,
            productKey: productKey || '',
            totalFinancialYearSale: { currencyKey: 0, amount: 0 },
        };

        this.newProduct = newProduct;
        this.products.unshift(newProduct);
    }

    @Mutation
    public [ACTIONS.REGISTER_PRODUCT_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.productRequests.addProduct = Status.ERROR;
    }

    @Action
    public registerNewProduct(productInfo: ProductDetails): Promise<CreatedProduct | object> {
        this.context.commit('storeProductMeasurementTypeKey', productInfo.measurementTypeKey);
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/sale-service/create-product',
            [ACTIONS.REGISTER_PRODUCT_LOADING, ACTIONS.REGISTER_PRODUCT_SUCCESS, ACTIONS.REGISTER_PRODUCT_ERROR],
            productInfo,
        );
    }

    @Mutation
    public [ACTIONS.GET_PRODUCTS_ERROR](error: RequestErrorObject) {
        this.productRequests.getProducts = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Mutation
    public [ACTIONS.GET_PRODUCTS_SUCCESS](payload: Product[]) {
        this.products = payload;
        this.productRequests.getProducts = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_PRODUCTS_LOADING]() {
        this.productRequests.getProducts = Status.LOADING;
        this.error = null;
    }

    @Action
    public getAllProducts(): Promise<ProductResponse | object> {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-products', [
            ACTIONS.GET_PRODUCTS_LOADING,
            ACTIONS.GET_PRODUCTS_SUCCESS,
            ACTIONS.GET_PRODUCTS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_VAT_OPTIONS_LOADING]() {
        this.vatOptionsRequest = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_VAT_OPTIONS_SUCCESS](payload: VatOption[]) {
        this.vatOptions = payload;
        this.vatOptionsRequest = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.GET_VAT_OPTIONS_ERROR](error: RequestErrorObject) {
        this.vatOptionsRequest = Status.ERROR;
        this.error = error.message;
        this.errorCode = error.code;
    }

    @Action
    public getVatOption(): Promise<VatOption | object> {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-sale-vats', [
            ACTIONS.GET_VAT_OPTIONS_LOADING,
            ACTIONS.GET_VAT_OPTIONS_SUCCESS,
            ACTIONS.GET_VAT_OPTIONS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_INCOME_GROUPS_LOADING]() {
        this.incomeGroupRequest = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_INCOME_GROUPS_SUCCESS](payload: IncomeGroup[]) {
        this.incomeGroupRequest = Status.SUCCESS;
        this.incomeGroups = payload;
    }

    @Mutation
    public [ACTIONS.GET_INCOME_GROUPS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.incomeGroupRequest = Status.ERROR;
    }

    @Action
    public getIncomeGroups() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/sale-service/get-income-groups', [
            ACTIONS.GET_INCOME_GROUPS_LOADING,
            ACTIONS.GET_INCOME_GROUPS_SUCCESS,
            ACTIONS.GET_INCOME_GROUPS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.UPDATE_PRODUCT_LOADING]() {
        this.productRequests.editProduct = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.UPDATE_PRODUCT_SUCCESS]() {
        this.productRequests.editProduct = Status.SUCCESS;
    }

    @Mutation
    public [ACTIONS.UPDATE_PRODUCT_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.productRequests.editProduct = Status.ERROR;
    }

    @Action
    public updateProduct(productInfo: ProductDetails): Promise<CreatedProduct | object> {
        this.context.commit('clearErrors');

        return genericPutRequest(
            this.context.commit,
            `/sale-service/update-product/${productInfo.productKey}`,
            [ACTIONS.UPDATE_PRODUCT_LOADING, ACTIONS.UPDATE_PRODUCT_SUCCESS, ACTIONS.UPDATE_PRODUCT_ERROR],
            productInfo,
        );
    }

    @Mutation
    public [ACTIONS.GET_PRODUCT_TRANSACTIONS_LOADING]() {
        this.productRequests.getProductTransactions = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_PRODUCT_TRANSACTIONS_SUCCESS](payload: ProductTransaction[]) {
        this.productRequests.getProductTransactions = Status.SUCCESS;
        this.productTransactions = payload;
    }

    @Mutation
    public [ACTIONS.GET_PRODUCT_TRANSACTIONS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.productRequests.getProductTransactions = Status.ERROR;
    }

    @Action
    public getProductTransactions(productKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, `/sale-service/get-product-sale-transactions/${productKey}`, [
            ACTIONS.GET_PRODUCT_TRANSACTIONS_LOADING,
            ACTIONS.GET_PRODUCT_TRANSACTIONS_SUCCESS,
            ACTIONS.GET_PRODUCT_TRANSACTIONS_ERROR,
        ]);
    }
}
