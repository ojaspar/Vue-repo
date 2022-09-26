/*eslint-disable @typescript-eslint/no-explicit-any */
import { MoneyObject, Status as RequestStatus } from '@/types';
import { Vendor } from '@/types';

export enum VendorType {
    BUSINESS = 'Business',
    INDIVIDUAL = 'Individual',
}

export enum PaymentStatus {
    FULL = 'Full',
    PART = 'Part',
    NONE = 'None',
}

export const expenseItemTypeInitialState: ExpenseItemType = {
    name: '',
    notes: '',
    isMeasurable: false,
    expenseItemTypeKey: '',
    lastTransactionAmount: { currencyKey: 0, amount: 0 },
    lastTransactionDate: '',
    totalFinancialYearAmount: { amount: 0, currencyKey: 0 },
    description: '',
    financialYearStartDate: '',
};

export const vendorInitialState: Vendor = {
    vendorKey: '',
    name: '',
    email: '',
    debtBalance: { amount: 0, currencyKey: '' },
    lastActivity: '',
    lastActivityDate: '',
    address: '',
    note: '',
    phoneNumber: '',
    prepaymentBalance: { amount: 0, currencyKey: '' },
    vendorType: VendorType.INDIVIDUAL,
};

export const initialStateOfExpenseSummary: ExpenseSummary = {
    itemName: '',
    unitCost: 0,
    isMeasurable: false,
    quantity: 1,
    withholdingTaxPercentage: 0,
    amountPaid: 0,
    bankDetails: {
        accountName: '',
        accountCurrencySymbol: '',
    },
    vendorName: '',
    measurementUnit: '',
    expenseCurrency: '',
    netCost: 0,
    balance: 0,
    withholdingAmount: 0,
    exchangeRate: 0,
    taxType: '',
    paymentStatus: PaymentStatus.FULL,
};

export const initialStateOfExpenseForm: ExpenseRequest = {
    name: '',
    unitCost: { currencyKey: 0, amount: 0 },
    amountPaidInOfferCurrency: { currencyKey: 0, amount: 0 },
    amountPaid: { currencyKey: 0, amount: 0 },
    quantity: 1,
    vendorKey: '',
    measurementTypeKey: '',
    withHoldingTaxType: '',
    notes: '',
    amountOwed: 0,
    paymentDueDate: '',
    paymentAccountKey: '',
    expenseItemTypeKey: '',
    discount: 0,
    quantityReceived: 0,
    transactionDate: '',
    supplyDueDate: '',
    attachments: [],
};

export interface Expense {
    expenseKey: string;
    transactionDate: string;
    names: string[];
    itemCount: number;
    balance: number;
    totalCost: number;
    amountPaid: number;
}

export interface ExpenseGroup {
    expenseGroupKey: string;
    name: string;
    isMeasurable: boolean;
}

export interface ExpenseItemTypeRequest {
    name: string;
    description: string;
    expenseGroupKey: string;
    isMeasurable: boolean;
    expenseGroupName: string;
    estimatedCost: MoneyObject;
}
export interface ExpenseItemType {
    name: string;
    expenseItemTypeKey: string;
    lastTransactionAmount: MoneyObject;
    lastTransactionDate: string;
    totalFinancialYearAmount: MoneyObject;
    notes: string;
    isMeasurable: boolean;
    description: string;
    financialYearStartDate: string;
}

export interface NewExpenseItemType {
    name: string;
    expenseItemTypeKey: string;
    description: string;
    isMeasurable: boolean;
    estimatedCost: MoneyObject;
    financialYearStartDate: string;
}

export interface ExpenseRequest {
    name: string;
    expenseItemTypeKey: string;
    amountPaidInOfferCurrency: MoneyObject;
    unitCost: MoneyObject;
    amountPaid: MoneyObject;
    discount: number;
    quantity: number;
    vendorKey: string;
    measurementTypeKey: string;
    notes: string;
    description?: string;
    amountOwed: number;
    withHoldingTaxType: string;
    paymentAccountKey: string;
    paymentDueDate: string;
    quantityReceived: number;
    transactionDate: string;
    supplyDueDate: string;
    attachments: Array<string>;
    expenseItemKey?: string;
    donationSchemeKey?: string;
}

export interface ExpenseRow {
    itemName: string;
    quantity: number;
    totalCost: number;
    balanceOwed: number;
}
export interface ExpenseRequestStatus {
    getAllExpenses: RequestStatus;
    getbudgetPercentage: RequestStatus;
    getExpenseItemsTypes: RequestStatus;
    getExpenseGroups: RequestStatus;
    createExpenseItemType: RequestStatus;
    createExpense: RequestStatus;
    getExpenseMeasurementTypes: RequestStatus;
    getDashboardStat: RequestStatus;
    addPayment: RequestStatus;
    getExpenseDetails: RequestStatus;
    getExpenseItemDetails: RequestStatus;
    updateExpense: RequestStatus;
    getExpenseTaxTypes: RequestStatus;
    getExpensePaymentAccounts: RequestStatus;
    updateExpenseItemType: RequestStatus;
    updateExpenseSupply: RequestStatus;
    cancelExpense: RequestStatus;
}

export interface BudgetPercentage {
    name: string;
    percentage: number;
}

export interface ExpenseDashboardStat {
    totalAmountOwed: number;
}

export interface AddVendorRequest {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    note: string;
    vendorTypeName: string;
    vendorKey?: string;
}

export interface VendorRequestStatus {
    addVendor: RequestStatus;
    getVendors: RequestStatus;
    updateVendor: RequestStatus;
    getTransactions: RequestStatus;
    getTransactionCardDetails: RequestStatus;
}

export type FormState = {
    [key: string]: boolean;
};

export interface ExpensePaymentRequest {
    amount: number;
    paymentTypeName: string;
    paymentTypeKey?: string;
    datePaid: string;
    expenseKey: string;
}

export interface ExpenseLineItem {
    expenseItemType: {
        key: string;
        name: string;
    };
    unitCost: MoneyObject;
    amountPaid: MoneyObject;
    amountPaidInOfferCurrency: MoneyObject;
    totalCost: MoneyObject;
    balance: MoneyObject;
    quantityReceived: number;
    quantity: number;
    vendor?: {
        key: string;
        name: string;
    };
    withholdingTax?: {
        key: string;
        name: string;
    };
    description: string;
    measurementType?: {
        key: string;
        name: string;
    };
    paymentAccountKey: string;
    paymentDueDate: string;
    supplyDueDate: string;
    transactionDate: string;
    expenseItemKey?: string;
    donationSchemeKey?: string;
    notes?: string;
}

export interface ExpensePayment {
    paymentAccountKey: string;
    paymentDate: string;
    amountPaid: MoneyObject;
    expenseKey: string;
}

type NameAndKey = {
    name: string;
    key: string;
};
export interface ExpenseDetails {
    expenseItemType: NameAndKey;
    notes: string;
    unitCost: MoneyObject;
    amountPaid: MoneyObject;
    amountPaidInOfferCurrency: MoneyObject;
    quantity: number;
    expenseItemKey: string;
    totalCost: MoneyObject;
    balance: MoneyObject;
    vendor: NameAndKey;
    measurementType: NameAndKey;
    paymentAccountKey: string;
    quantityReceived: number;
    paymentDueDate: string;
    transactionDate: string;
    supplyDueDate: string;
    withholdingTax: NameAndKey;
    withholdingTaxAmount: MoneyObject;
    vatAmount?: MoneyObject;
}

export interface ExpenseCostValidationObject {
    value: string;
    expenseItemIsMeasurable: boolean;
    totalAmountPaid: number;
    expenseIsBeingEdited: boolean;
    totalCostOfTheExpense: number;
    originalCostOfExpenseItem: number;
}

export interface BankDetails {
    accountName: string;
    accountCurrencySymbol: string;
}

export interface ExpenseTableDetails {
    expenseKey: string;
    transactionDate: string;
    names: string[];
    itemCount: number;
    totalCost: number;
    amountPaid: number;
    balance: number;
    deliveryStatus: string;
    deliveryDueDate: string;
    expenseType: string;
    vendorName: string;
    name?: string;
}

export interface ExpenseSummary {
    expenseKey?: string;
    itemName: string;
    unitCost: number;
    expenseCurrency: string;
    isMeasurable: boolean;
    quantity: number;
    withholdingTaxPercentage: number;
    amountPaid: number;
    bankDetails: BankDetails;
    vendorName: string;
    measurementUnit: string;
    netCost: number;
    balance: number;
    withholdingAmount: number;
    exchangeRate: number;
    taxType: string;
    paymentStatus: string;
}

export interface ExpenseTaxType {
    name: string;
    displayName: string;
}

export enum ExpenseWitholdingTaxTypes {
    NONE = 'None',
    INCLUSIVE = 'Inclusive',
    EXCLUSIVE = 'Exclusive',
}

export interface EditExpenseItemTypeRequest {
    name: string;
    description: string;
}

export interface ExpenseDashboardCards {
    currentMonth: number;
    functionalCurrencySymbol: string;
    expensesInCurrentMonth: MoneyObject;
    countOfExpensesInCurrentMonth: number;
    unpaidExpenses: MoneyObject;
    countOfUnpaidExpenses: number;
    countOfPendingDeliveries: number;
}

export interface RecordExpenseDetail {
    transactionDate: string;
    itemReceived: boolean;
    quantityReceived: number;
    supplyDueDate: string;
    attachments: Array<string>;
    notes: string;
}

export interface ExpenseTableList {
    expenseItemKey: string;
    name: string;
    transactionDate: string;
    totalCost: MoneyObject;
    balance: MoneyObject;
    deliveryStatus: string;
    deliveryDueDate: string;
    expenseType: string;
    vendorName: string;
    notes?: string;
}
export interface ExpenseTableExport {
    name: string;
    transactionDate: string;
    totalCost: string;
    balance: string;
    deliveryStatus: string;
    deliveryDueDate: string;
    expenseType: string;
    vendorName: string;
}

export interface ManageExpenseTransactionItem {
    itemName: string;
    unitCost: MoneyObject;
    quantity: number;
    quantitySupplied: number;
    deliveryStatus: string;
    measurementTypeName: string;
}

export interface ExpenseDelivery {
    transactionDate: string;
    itemName: string;
    itemCount: number;
}

export interface ExpenseTransactionPayment {
    bankAccount: string;
    amountPaid: MoneyObject;
    datePaid: string;
}

export interface ManageExpenseDetails {
    expenseItems: Array<ManageExpenseTransactionItem>;
    totalAmount: MoneyObject;
    amountPaid: MoneyObject;
    balance: MoneyObject;
    expenseKey: string;
    transactionDate: string;
    transactionId?: string;
    vendorName: string;

    payments: Array<ExpenseTransactionPayment>;
    delivery: Array<ExpenseDelivery>;
}
export interface PaginatedExpenses {
    items: Array<ExpenseTableList>;
    total: number;
    info: number;
}

export interface ExpenseDeliveryForm {
    newDelivery: string;
    deliveryDate: string;
    outstandingDeliveryDueDate: string;
}
