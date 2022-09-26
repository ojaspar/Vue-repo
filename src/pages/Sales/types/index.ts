import { Status } from '@/types';
import { CustomerDetails } from '../ManageCustomers/types';
import { PaymentDetails } from '../RecordSale/v4/types';

export enum PaymentTypeName {
    CASH = 'cash',
    INITIAL_PAYMENT = 'initial payment',
    BANK = 'bank',
}

export enum DocumentPreviewType {
    ESTIMATE = 'ESTIMATE',
    INVOICE = 'INVOICE',
    RECEIPT = 'RECEIPT',
}

export interface InvoiceBusinessProfile {
    name: string;
    logo: string;
    address: string;
    phoneNumber: string;
    email: string;
}
export interface InvoiceCustomerProfile {
    name: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    customerKey?: string;
}

export interface DocumentDetails {
    customer: InvoiceCustomerProfile;
    amountPaid: MoneyObject;
    dateIssued: string;
    notes: string;
    transactionDate: string;
    products: Array<ProductSummary>;
}

export interface SaleCustomer {
    name: string;
    lastInteraction: string;
    lastInteractionDate: string;
    lastInteractionAge: string;
    lastSaleKey?: string;
    phoneNumber: string;
    email: string;
    totalBalanceDue: MoneyObject;
    customerKey?: string;
    totalPrepayment: MoneyObject;
    totalFinancialYearSale: MoneyObject;
    financialYearStartDate: string;
    address: string;
    notes: string;
}

export const defaultCustomer: SaleCustomer = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
    lastInteractionDate: '',
    lastInteractionAge: '',
    customerKey: '',
    totalPrepayment: { amount: 0, currencyKey: '' },
    financialYearStartDate: '',
    lastInteraction: '',
    lastSaleKey: '',
    totalBalanceDue: { amount: 0, currencyKey: '' },
    totalFinancialYearSale: { amount: 0, currencyKey: '' },
};

export interface FinancialYearSale {
    currencySymbol: string;
    amount: number;
}

export interface Customer {
    customerName: string;
    phoneNumber: string;
    emailAddress: string;
    deliveryAddress: string;
    notes: string;
}

export interface IncomeGroup {
    incomeGroupKey: string;
    name: string;
}

export interface ProductRequest {
    addProduct: Status;
    editProduct: Status;
    getProducts: Status;
    getProductTransactions: Status;
}

export interface MoneyObject {
    currencyKey: string | number;
    amount: number | string;
}

export interface ProductDetails {
    productKey?: string;
    name: string;
    description: string;
    incomeGroupKey: string;
    estimatedPrice: MoneyObject;
    measurementTypeKey: string;
    isVATExempt?: boolean;
    isSoldFromInventory?: boolean;
    stockBalance?: string;
    status?: string;
    productComponents?: [{ product: string; quantity: string }];
}

export interface Product {
    productKey: string;
    name: string;
    description: string;
    lastSalePrice: MoneyObject;
    firstSalePrice?: MoneyObject;
    lastSaleDate: string;
    lastSaleAge: string;
    financialYearStartDate: string;
    totalFinancialYearSale: MoneyObject;
    incomeGroupKey: string;
    measurementTypeKey: string;
    estimatedPrice: MoneyObject;
    isVATExempt?: boolean;
    isSoldFromInventory?: boolean;
    availableQuantity?: number;
    stockItemStatus?: string;
    productType?: string;
}

export const defaultProduct: Product = {
    productKey: '',
    name: '',
    description: '',
    lastSalePrice: {
        currencyKey: 0,
        amount: 0,
    },
    firstSalePrice: {
        currencyKey: 0,
        amount: 0,
    },
    lastSaleDate: '',
    lastSaleAge: '',
    financialYearStartDate: '',
    totalFinancialYearSale: {
        currencyKey: 0,
        amount: 0,
    },
    incomeGroupKey: '',
    measurementTypeKey: '',
    estimatedPrice: {
        currencyKey: 0,
        amount: 0,
    },
    isVATExempt: false,
    isSoldFromInventory: true,
    availableQuantity: 0,
    stockItemStatus: '',
    productType: '',
};

export interface ProductSummary {
    productName: string;
    productKey: string;
    unitPrice: MoneyObject;
    quantity: number;
    measurementUnit: string;
    notes: string;
    files: Array<string>;
    supplyStatus: string;
    discount: MoneyObject;
    vatAmount: MoneyObject;
    totalExclusiveVat: MoneyObject;
    vatType: string;
    subTotal: MoneyObject;
    measurementTypeKey: string;
}

export interface ProductSummaryDetails {
    amountPaid: MoneyObject;
    transactionDate: string;
    paymentAccountKey: string;
    balanceDueDate: string;
}

export interface EstimateSummaryDetails {
    dateIssued: string;
    notes: string;
}

export interface AddProductToSalesForm {
    productKey: string;
    name: string;
    unitPrice: MoneyObject;
    measurementTypeKey: string;
    quantity: number;
    discount: MoneyObject;
    vatTypeKey: string;
    quantitySupplied: number;
    supplyDueDate: string;
    attachmentArray: Array<string>;
    notes: string;
}

export enum TaxForms {
    NONE = 'None',
    INCLUSIVE = 'Inclusive',
    EXCLUSIVE = 'Exclusive',
}

export interface SalesItemSummary {
    name: string;
    unitPrice: MoneyObject;
    measurementType: string;
    quantity: number;
    discount: MoneyObject;
}

export interface ProductForm {
    name: string;
    description: string;
    incomeGroupKey: string;
    measurementTypeKey: string;
    estimatedPrice: string;
    estimatedPriceCurrencyKey: string;
    isVATExempt?: boolean;
    isSoldFromInventory?: boolean;
    status?: string;
}

export interface SaleRequest {
    amountPaid: MoneyObject;
    transactionDate: string;
    balanceDueDate: string;
    customerKey: string;
    paymentAccountKey: string;
    products: Array<AddProductToSalesForm>;
    saleKey?: string;
}

export interface RecordEstimateRequest {
    dateIssued: string;
    customerKey: string;
    notes: string;
    products: Array<AddProductToSalesForm>;
    saleKey?: string;
}

export interface SaleDashboardCards {
    currentMonthSales: MoneyObject;
    currentMonthSalesCount: number;
    customerDebt: MoneyObject;
    outStandingOrderCount: number;
    prepaidOutStandingOrders?: MoneyObject;
    unpaidOutStandingOrders: MoneyObject;
    expectedInflowCount: number;
}

export interface PaginatedSales {
    items: Array<SalesTableDetails>;
    total: number;
    info: number;
}

export interface SalesTableDetails {
    saleKey: string;
    salesReferenceNumber: string;
    transactionDate: string;
    customerName: string;
    totalAmount: MoneyObject;
    balanceOwed: MoneyObject;
    transactionStatus: string;
    supplyDueDate: string;
    itemArray: string[];
}

export interface ProductInProductDetailsForm {
    productKey: string;
    measurementTypeName: string;
    measurementTypeKey: string;
    vatTypeKey: string;
    vatTypeName: string;
    unitPrice: MoneyObject;
    discount: MoneyObject;
    quantitySupplied: number;
    supplyDueDate: string;
    quantity: number;
    vat: number;
    notes: string;
    attachments: Array<string>;
    productName: string;
}

export interface AdditionalPayment {
    amount: MoneyObject;
    dateReceived: string;
    paymentAccountKey: string;
    bankName: string;
    accountNumber?: string;
    additionalPaymentKey: string;
}

export interface SaleDetails {
    customer: InvoiceCustomerProfile;
    totalAmount: MoneyObject;
    amountPaid: MoneyObject;
    balance: MoneyObject;
    products: Array<ProductInProductDetailsForm>;
    paymentAccountKey: string;
    transactionDate: string;
    balanceDueDate: string;
    saleKey: string;
    customerKey: string;
    additionalPayments: Array<AdditionalPayment>;
    withholdingTax?: { key: string; name: string };
}

export const initialStateOfCustomer: CustomerDetails = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
    lastInteractionDate: '',
    customerKey: '',
    totalPrepayment: { amount: 0, currencyKey: '' },
    financialYearStartDate: '',
    lastInteraction: '',
    lastSaleKey: '',
    totalBalanceDue: { currencyKey: '', amount: 0 },
    totalFinancialYearSale: { amount: 0, currencyKey: '' },
};

export const initialStateOfProduct: Product = {
    productKey: '',
    name: '',
    description: '',
    lastSalePrice: {
        currencyKey: 0,
        amount: 0,
    },
    lastSaleDate: '',
    lastSaleAge: '',
    financialYearStartDate: '',
    totalFinancialYearSale: {
        currencyKey: 0,
        amount: 0,
    },
    incomeGroupKey: '',
    measurementTypeKey: '',
    estimatedPrice: {
        currencyKey: 0,
        amount: 0,
    },
};

export const ProductSummaryDefault: ProductSummary = {
    productName: '',
    productKey: '',
    unitPrice: { amount: 0, currencyKey: 0 },
    quantity: 0,
    measurementUnit: '',
    notes: '',
    measurementTypeKey: '',
    files: [],
    subTotal: { amount: 0, currencyKey: 0 },
    supplyStatus: '',
    discount: { amount: 0, currencyKey: 0 },
    vatAmount: { amount: 0, currencyKey: 0 },
    totalExclusiveVat: { amount: 0, currencyKey: 0 },
    vatType: 'None',
};

export const defaultProductDetailsForm: ProductInProductDetailsForm = {
    productKey: '',
    measurementTypeName: '',
    measurementTypeKey: '',
    vatTypeKey: '',
    vatTypeName: '',
    unitPrice: { currencyKey: 0, amount: 0 },
    discount: { currencyKey: 0, amount: 0 },
    quantitySupplied: 0,
    supplyDueDate: '',
    quantity: 0,
    vat: 0,
    notes: '',
    attachments: [],
    productName: '',
};

export interface SalesDocumentType {
    ESTIMATE: DocumentPreviewType;
    INVOICE: DocumentPreviewType;
    RECEIPT: DocumentPreviewType;
}
