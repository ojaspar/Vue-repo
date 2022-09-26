import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

import * as ACTIONS from '@/store/inventory-module-constants';

import { Status, RequestErrorObject } from '@/types';
import {
    CreateStockItemForm,
    InventoryDashboardCard,
    InventoryRequestStatus,
    StockItem,
    StockItemDetailsCardValues,
    StockItemLevels,
    Supplier,
    StockItemActivity,
    StockItemCategories,
    ItemReorderLevelRequest,
    StockItemsCategoryRequest,
    InventoryMeasurementUnit,
    NewInventoryType,
} from '@/pages/Inventory/types';

import { genericGetRequest, genericPostRequest } from '@/utils/request';

export interface State {
    inventoryRequestStatus: InventoryRequestStatus;
    error: any;
    errorCode: any;
    measurementUnits: Array<InventoryMeasurementUnit>;
    inventoryItems: Array<StockItem>;
    inventoryDashboardCardValues: InventoryDashboardCard;
    stockItemLevels: StockItemLevels;
    stockItemDetailsCardValues: StockItemDetailsCardValues;
    suppliers: Array<Supplier>;
    stockItemActivities: Array<StockItemActivity>;
    stockItemCategories: StockItemCategories;
    stockItem: StockItem;
    itemReorderLevelRequest: ItemReorderLevelRequest;
    inventoryDashboardAction: string;
}

@Module({ namespaced: true, name: 'inventory' })
export default class Inventory extends VuexModule {
    public inventoryRequestStatus: InventoryRequestStatus = {
        getMeasurementUnits: Status.NORMAL,
        createInventoryItem: Status.NORMAL,
        getStockItems: Status.NORMAL,
        getDashboardCardsValues: Status.NORMAL,
        getStockItemLevels: Status.NORMAL,
        getStockItemDetailsCardValues: Status.NORMAL,
        getSuppliers: Status.NORMAL,
        getStockItemActivities: Status.NORMAL,
        getStockItemCategories: Status.NORMAL,
        setItemReorderLevel: Status.NORMAL,
        setStockItemsCategory: Status.NORMAL,
    };
    public error: any = null;
    public errorCode: any = null;
    public measurementUnits: Array<InventoryMeasurementUnit> = [];
    public inventoryItems: Array<StockItem> = [];
    public inventoryDashboardCardValues: InventoryDashboardCard = {
        availableInventoryValue: 0,
        expectedInventoryValue: 0,
        totalInventoryValue: 0,
        totalInventoryCount: 0,
    };
    public stockItemLevels: StockItemLevels = {
        criticalLow: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
    };
    public stockItemDetailsCardValues: StockItemDetailsCardValues = {
        availableQuantity: 0,
        incomingQuantity: 0,
        reorderLevel: 0,
        stockMeasurementUnit: '',
        totalStock: 0,
    };
    public suppliers: Array<Supplier> = [];
    public stockItemActivities: Array<StockItemActivity> = [];
    public itemReorderLevelRequest: ItemReorderLevelRequest = {} as ItemReorderLevelRequest;
    public stockItem: StockItem = {
        name: '',
        availableQuantity: 0,
        reorderLevel: 0,
        totalQuantity: 0,
        measurementUnitName: '',
        inventoryType: 'Product',
        stockItemLevel: 'Out Of Stock',
        stockItemKey: '',
    };
    public stockItemCategories: StockItemCategories = {
        damaged: 0,
        expired: 0,
        outgoing: 0,
        returned: 0,
        uncategorized: 0,
        used: 0,
    };
    public inventoryDashboardAction = '';

    @Mutation
    public clearErrors() {
        this.errorCode = null;
        this.error = null;
    }

    @Action
    clearStoreErrors() {
        this.context.commit('clearErrors');
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_LOADING]() {
        this.inventoryRequestStatus.getMeasurementUnits = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getMeasurementUnits = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_SUCCESS](payload: InventoryMeasurementUnit[]) {
        this.inventoryRequestStatus.getMeasurementUnits = Status.SUCCESS;
        this.measurementUnits = payload;
    }

    @Action
    getMeasurementUnits() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'inventory-service/get-measurement-units', [
            ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_LOADING,
            ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_SUCCESS,
            ACTIONS.GET_INVENTORY_MEASUREMENT_UNITS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.CREATE_STOCK_ITEM_LOADING]() {
        this.inventoryRequestStatus.createInventoryItem = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.CREATE_STOCK_ITEM_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.createInventoryItem = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.CREATE_STOCK_ITEM_SUCCESS](payload: StockItem) {
        this.inventoryRequestStatus.createInventoryItem = Status.SUCCESS;

        this.inventoryItems.unshift(payload);
    }

    @Action
    createInventoryItem(stockItem: CreateStockItemForm) {
        this.context.commit('clearErrors');

        let uri = 'create-stock-item';

        if (stockItem.openingStock > 0) {
            uri = 'add-existing-stock-item';
        }

        return genericPostRequest(
            this.context.commit,
            `inventory-service/${uri}`,
            [ACTIONS.CREATE_STOCK_ITEM_LOADING, ACTIONS.CREATE_STOCK_ITEM_SUCCESS, ACTIONS.CREATE_STOCK_ITEM_ERROR],
            stockItem,
        );
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEMS_LOADING]() {
        this.inventoryRequestStatus.getStockItems = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEMS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getStockItems = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEMS_SUCCESS](payload: Array<StockItem>) {
        this.inventoryRequestStatus.getStockItems = Status.SUCCESS;
        this.inventoryItems = payload;
    }

    @Action
    getStockItems() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, 'inventory-service/get-stock-items', [
            ACTIONS.GET_STOCK_ITEMS_LOADING,
            ACTIONS.GET_STOCK_ITEMS_SUCCESS,
            ACTIONS.GET_STOCK_ITEMS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_LOADING]() {
        this.inventoryRequestStatus.getDashboardCardsValues = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getDashboardCardsValues = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_SUCCESS](payload: InventoryDashboardCard) {
        this.inventoryRequestStatus.getDashboardCardsValues = Status.SUCCESS;
        this.inventoryDashboardCardValues = payload;
    }

    @Action
    getInventoryDashboardCardsValues() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/inventory-service/get-inventory-dashboard-card-values', [
            ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_LOADING,
            ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_SUCCESS,
            ACTIONS.GET_INVENTORY_DASHBOARD_CARDS_VALUES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_LEVELS_LOADING]() {
        this.inventoryRequestStatus.getStockItemLevels = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_LEVELS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getStockItemLevels = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_LEVELS_SUCCESS](payload: StockItemLevels) {
        this.inventoryRequestStatus.getStockItemLevels = Status.SUCCESS;
        this.stockItemLevels = payload;
    }

    @Action
    getStockItemLevels() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/inventory-service/get-stock-item-levels', [
            ACTIONS.GET_STOCK_ITEM_LEVELS_LOADING,
            ACTIONS.GET_STOCK_ITEM_LEVELS_SUCCESS,
            ACTIONS.GET_STOCK_ITEM_LEVELS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_LOADING]() {
        this.inventoryRequestStatus.getStockItemDetailsCardValues = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getStockItemDetailsCardValues = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_SUCCESS](payload: StockItemDetailsCardValues) {
        this.inventoryRequestStatus.getStockItemDetailsCardValues = Status.SUCCESS;
        this.stockItemDetailsCardValues = payload;
    }

    @Action
    getStockItemDetailsCardValues(stockItemKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/inventory-service/get-stock-item-detail-card-value/${stockItemKey}`,
            [
                ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_LOADING,
                ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_SUCCESS,
                ACTIONS.GET_STOCK_ITEM_DETAILS_CARD_VALUES_ERROR,
            ],
        );
    }

    @Mutation
    public [ACTIONS.GET_SUPPLIERS_LOADING]() {
        this.inventoryRequestStatus.getSuppliers = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_SUPPLIERS_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getSuppliers = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_SUPPLIERS_SUCCESS](payload: Array<Supplier>) {
        this.inventoryRequestStatus.getSuppliers = Status.SUCCESS;
        this.suppliers = payload;
    }

    @Action
    getSuppliers() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/inventory-service/get-suppliers', [
            ACTIONS.GET_SUPPLIERS_LOADING,
            ACTIONS.GET_SUPPLIERS_SUCCESS,
            ACTIONS.GET_SUPPLIERS_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_ACTIVITIES_LOADING]() {
        this.inventoryRequestStatus.getStockItemActivities = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_ACTIVITIES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getStockItemActivities = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_ACTIVITIES_SUCCESS](payload: Array<StockItemActivity>) {
        this.inventoryRequestStatus.getStockItemActivities = Status.SUCCESS;
        this.stockItemActivities = payload;
    }

    @Action
    getStockItemActivities(stockItemKey: string) {
        this.context.commit('clearErrors');

        return genericGetRequest(
            this.context.commit,
            `/inventory-service/get-stock-item-activity-logs/${stockItemKey}`,
            [
                ACTIONS.GET_STOCK_ITEM_ACTIVITIES_LOADING,
                ACTIONS.GET_STOCK_ITEM_ACTIVITIES_SUCCESS,
                ACTIONS.GET_STOCK_ITEM_ACTIVITIES_ERROR,
            ],
        );
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_CATEGORIES_LOADING]() {
        this.inventoryRequestStatus.getStockItemCategories = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_CATEGORIES_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.getStockItemCategories = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.GET_STOCK_ITEM_CATEGORIES_SUCCESS](payload: StockItemCategories) {
        this.inventoryRequestStatus.getStockItemCategories = Status.SUCCESS;
        this.stockItemCategories = payload;
    }

    @Action
    getStockItemCategories() {
        this.context.commit('clearErrors');

        return genericGetRequest(this.context.commit, '/inventory-service/get-stock-item-category-distribution', [
            ACTIONS.GET_STOCK_ITEM_CATEGORIES_LOADING,
            ACTIONS.GET_STOCK_ITEM_CATEGORIES_SUCCESS,
            ACTIONS.GET_STOCK_ITEM_CATEGORIES_ERROR,
        ]);
    }

    @Mutation
    public [ACTIONS.SET_ITEM_REORDER_LEVEL_LOADING]() {
        this.inventoryRequestStatus.setItemReorderLevel = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.SET_ITEM_REORDER_LEVEL_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.setItemReorderLevel = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.SET_ITEM_REORDER_LEVEL_SUCCESS]() {
        this.inventoryRequestStatus.setItemReorderLevel = Status.SUCCESS;

        const { quantity } = this.itemReorderLevelRequest;

        this.stockItem.reorderLevel = quantity;
        this.stockItemDetailsCardValues.reorderLevel = quantity;
    }

    @Mutation
    public ['SET_REORDER_LEVEL_REQUEST'](itemReorderLevelRequest: ItemReorderLevelRequest) {
        this.itemReorderLevelRequest = itemReorderLevelRequest;
    }

    @Action
    setItemReorderLevel(itemReorderLevelRequest: ItemReorderLevelRequest) {
        this.context.commit('clearErrors');
        this.context.commit('SET_REORDER_LEVEL_REQUEST', itemReorderLevelRequest);

        return genericPostRequest(
            this.context.commit,
            '/inventory-service/set-reorder-level',
            [
                ACTIONS.SET_ITEM_REORDER_LEVEL_LOADING,
                ACTIONS.SET_ITEM_REORDER_LEVEL_SUCCESS,
                ACTIONS.SET_ITEM_REORDER_LEVEL_ERROR,
            ],
            itemReorderLevelRequest,
        );
    }

    @Mutation
    public ['SET_STOCK_ITEM'](stockItem: StockItem) {
        this.stockItem = stockItem;
    }

    @Action
    persistStockItem(stockItem: StockItem) {
        this.context.commit('SET_STOCK_ITEM', stockItem);
    }

    @Mutation
    public [ACTIONS.SET_STOCK_ITEMS_CATEGORY_LOADING]() {
        this.inventoryRequestStatus.setStockItemsCategory = Status.LOADING;
        this.error = null;
    }

    @Mutation
    public [ACTIONS.SET_STOCK_ITEMS_CATEGORY_ERROR](error: RequestErrorObject) {
        this.error = error.message;
        this.errorCode = error.code;
        this.inventoryRequestStatus.setStockItemsCategory = Status.ERROR;
    }

    @Mutation
    public [ACTIONS.SET_STOCK_ITEMS_CATEGORY_SUCCESS]() {
        this.inventoryRequestStatus.setStockItemsCategory = Status.SUCCESS;

        // find the stock item in stock items and update the avaailale to the new status
    }

    @Action
    setStockItemsCategory(stockItemCategoriesRequest: StockItemsCategoryRequest) {
        this.context.commit('clearErrors');

        return genericPostRequest(
            this.context.commit,
            '/inventory-service/add-stock-item-to-category',
            [
                ACTIONS.SET_STOCK_ITEMS_CATEGORY_LOADING,
                ACTIONS.SET_STOCK_ITEMS_CATEGORY_SUCCESS,
                ACTIONS.SET_STOCK_ITEMS_CATEGORY_ERROR,
            ],
            stockItemCategoriesRequest,
        );
    }

    @Mutation
    performNewAction(action: string) {
        this.inventoryDashboardAction = action;
    }
}
