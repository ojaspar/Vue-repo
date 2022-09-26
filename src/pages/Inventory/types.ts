import { MoneyObject, Status } from '@/types';

export type StockItemLevel = 'Out Of Stock' | 'In Stock' | 'Low Stock' | 'Critical Stock';

export interface StockItem {
    name: string;
    availableQuantity: number;
    reorderLevel: number;
    totalQuantity: number;
    measurementUnitName: string;
    inventoryType: 'Product' | 'Service';
    stockItemLevel: StockItemLevel;
    stockItemKey: string;
}

export interface Supplier {
    supplierKey: string;
    name: string;
    phoneNumber: string;
    email?: string;
}

export type activityService = 'ExpenseService' | 'SaleService';
export type transactionDescription = 'Item Purchased' | 'Item Sold';
export interface StockItemActivity {
    transactionDate: string;
    amount: MoneyObject;
    quantity: number;
    quantityBalanceAfterActivity: number;
    stockItemKey: string;
    activityService: activityService;
    transactionKey: string;
    description: transactionDescription;
}

export type stockStatusAction = 'Used' | 'Damaged' | 'Expired' | 'Discarded' | 'Archived';

export type NewInventoryType = 'existing' | 'fresh';

export interface InventoryRequestStatus {
    getMeasurementUnits: Status;
    createInventoryItem: Status;
    getStockItems: Status;
    getDashboardCardsValues: Status;
    getStockItemLevels: Status;
    getStockItemDetailsCardValues: Status;
    getSuppliers: Status;
    getStockItemActivities: Status;
    getStockItemCategories: Status;
    setItemReorderLevel: Status;
    setStockItemsCategory: Status;
}

export interface CreateStockItemForm {
    name: string;
    measurementUnitKey: string;
    reorderLevel: number;
    openingStock: number;
    displayInProductList: boolean;
    stockItemKey?: string;
    unitPrice: MoneyObject;
}

export interface InventoryMeasurementUnit {
    description: string;
    measurementUnitKey: string;
    name: string;
}

export interface InventoryDashboardCard {
    availableInventoryValue: number;
    totalInventoryValue: number;
    totalInventoryCount: number;
    expectedInventoryValue: number;
}

export interface StockItemLevels {
    inStock: number;
    lowStock: number;
    criticalLow: number;
    outOfStock: number;
}

export interface StockItemDetailsCardValues {
    reorderLevel: number;
    incomingQuantity: number;
    availableQuantity: number;
    totalStock: number;
    stockMeasurementUnit: string;
}

export interface StockItemCategories {
    outgoing: number;
    damaged: number;
    expired: number;
    used: number;
    returned: number;
    uncategorized: number;
}

export interface ItemReorderLevelRequest {
    stockItemKey: string;
    quantity: number;
}

export interface StockItemsCategoryRequest {
    stockItemKey: string;
    quantity: number;
    categoryName: string;
}
