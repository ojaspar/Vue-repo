import { VendorType } from '@/pages/Spending/Expense/types';
import { NavigationGuardNext } from 'vue-router';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type String = string;

export const tokenDefaultValue: Token = {
    nameid: '',
    sub: '',
    jti: '',
    iat: '',
    phoneNumber: '',
    firstName: '',
    email: '',
    lastName: '',
    businessIdentityNumber: '',
    businessVerticalName: '',
    businessVerticalCode: '',
    businessName: '',
    businessAddress: '',
    currencyKey: '',
    signupIncompleteStage: '',
    nbf: 0,
    exp: 0,
    iss: '',
    aud: '',
    businessLogoUrl: '',
};

export interface Token {
    nameid: string;
    sub: string;
    jti: string;
    iat: string;
    nbf: number;
    iss: string;
    aud: string;
    businessAddress: string;
    businessIdentityNumber: string;
    businessName: string;
    businessVerticalCode: string;
    businessVerticalName: string;
    businessLogoUrl: string;
    currencyKey: string;
    email: string;
    exp: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    signupIncompleteStage: string;
}
export interface ErrorIndexSignature {
    [key: string]: string;
}

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    businessName: string;
    currencyKey: string;
}

export interface Secret {
    question: string;
    answer: string;
}

export enum Status {
    LOADING = 'LOADING',
    NORMAL = 'NORMAL',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export enum SignupSections {
    bioData = 'BIODATA',
    secretQuestion = 'SECRET-QUESTION',
    password = 'PASSWORD',
}

export enum LeftIcon {
    Hamburger = 'HAMBURGER',
    Back = 'BACK',
    Cancel = 'CANCEL',
    None = 'NONE',
}

export interface ErrorObject {
    [key: string]: string;
}

export interface SignupFormFields {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    selectedQuestion: string;
    answer: string;
}

export interface AuthRequestStatus {
    login: Status;
    addBusinessUser: Status;
    fetchBusinessUsers: Status;
    editUserProfile: Status;
    verifyUserProfileUpdate: Status;
    changePassword: Status;
}

export interface ItemObject {
    item: InvoiceProduct;
    index: number;
}

export interface SalesItemObject {
    item: SalesProduct;
    index: number;
}

export interface DateObject {
    index: number;
    date: string;
}

export interface ProductToBeEdited {
    supplyDueDate: string;
    unitPrice: number;
    productName: string;
    quantity: number;
    quantitySupplied: number;
    discount: number;
    note: string;
    productMeasurementModel: {
        name: string;
        measurementKey: string;
    };
}

export interface ExpenseRequest {
    name: string;
    expenseItemTypeKey?: string;
    unitCost: string;
    totalCost: string;
    amountPaid: string;
    quantity: number;
    vendorKey: string;
    measurementTypeKey: string;
    paymentTypeName: string;
    notes?: string;
    amountOwed: any;
    isDelete?: boolean;
}

export interface SalesFields {
    paymentType: string;
    paymentTypeKey: string;
    paymentDueDate: string;
    supplyDueDate: string;
    picked: string;
    amountClientPaid: number;
    total: number;
    vat: number;
}

export interface SecretQuestionValidationFields {
    selectedQuestion: string;
    answer: string;
}

export interface BioDataFields {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface CreatePasswordFields {
    password: string;
    confirmPassword: string;
}

export interface SecretQuestion {
    key: string;
    name: string;
}
export interface BusinessVertical {
    name: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    businessVerticalKey: string;
}

export interface SignupFields {
    businessType?: string;
    name?: string;
    address?: string;
    state?: string;
    city?: string;
    email?: string;
    phoneNumber?: string;
    type?: string;
    rcNumber?: string;
}

export interface BusinessDetailsFormFields {
    name: string;
    address: string;
    country: string;
    state: string;
    lga: string;
    email: string;
    tin: string;
    phoneNumber: string;
    category: string;
    rcNumber: string;
}

export interface BusinessRegistrationType {
    name: string;
    key: string;
}
export interface City {
    name: string;
    key: string;
}

export interface Country {
    name: string;
    key: string;
}

export interface LGA {
    name: string;
    key: string;
}

export interface CountryState {
    name: string;
    key: string;
}

export interface BusinessProfile {
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    rcNumber: string;
    businessRegistrationTypeKey: string;
    businessVerticalKey: string;
    countryKey: string;
    lgaKey: string;
}

export interface BusinessRequestStatus {
    getLGAs: Status;
    getStates: Status;
    getBusinessRegistrationTypes: Status;
    getBusinessVerticals: Status;
    registerBusiness: Status;
    getPaymentCurrentKeyList: Status;
    getBusinessAssetTypes: Status;
    getCountries: Status;
    migrateBusinessData: Status;
    getBusinessData: Status;
    getBusinessDetails: Status;
    editBusinessProfile: Status;
    verifyBusinessProfileUpdate: Status;
    getDataMigrationStatus: Status;
}

export interface BusinessDetailsResponse {
    statusCode: number;
    message: string;
    data: BusinessData;
}

export interface BusinessData {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    rcNumber: string;
    businessRegistrationType: { name: string; key: string };
    businessVertical: { name: string; key: string };
    businessKey: string;
    country: { name: string; key: string };
    state: { name: string; key: string };
    lga: { name: string; key: string };
}
export const defaultBusinessDetails: BusinessData = {
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    rcNumber: '',
    businessRegistrationType: { name: '', key: '' },
    businessVertical: { name: '', key: '' },
    businessKey: '',
    country: { name: '', key: '' },
    state: { name: '', key: '' },
    lga: { name: '', key: '' },
};
export interface LoginInfo {
    email: string;
    password: string;
}

export interface PasswordData {
    password: string;
    userId: string;
}

export interface AuthenticatedUser {
    userKey: string;
}

export interface SecretQuestionFields {
    answer: string;
    secretQuestionKey: string;
}

export interface PictureSelectOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface SelectOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface Store {
    state: {};
    mutations: {};
    getters: {};
    actions: {};
    modules: {
        auth: {};
        business: {};
    };
}

export interface LoginEmailValidation {
    email: string;
}

export interface BusinessType {
    businessType: string;
}

export interface Options {
    text: string;
}

export interface TargetOptions {
    options: Array<Options>;
    selectedIndex: number;
    value: string;
    select: Function;
}

export interface TargetObject {
    target: TargetOptions;
}

export interface InputValidation {
    /*eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any;
}

export interface CustomerProfile {
    name: string;
    phoneNumber: string;
    email: string;
    customerKey?: string;
    notes?: string;
    address?: string;
}

export interface InvoiceLineItem {
    product: string;
    unitPrice: string;
    quantity: number;
}

export interface InvoiceCreationRequest {
    totalAmount: number;
    invoiceDate: string;
    products: Array<InvoiceProduct>;
    customerKey: string;
    companyInfo: CompanyInfo;
}

export interface RecordSalesRequest {
    products: Array<SalesProduct>;
}

export interface SaleRequestStatus {
    createSale: Status;
    updateSale: Status;
    getSales: Status;
    getSalesDashboardStats: Status;
    getSaleDetails: Status;
    addSalePayment: Status;
    getPaymentAccounts: Status;
    recordEstimate: Status;
    updateEstimate: Status;
    generatePdf: Status;
}

export interface Sale {
    customer: string;
    key: string;
    quantity: number;
    products: Array<string>;
    totalAmount: number;
    salesReferenceNumber: string;
    date: string;
    balance: number;
    supplyStatus: string;
    supplyDueDate: string;
}

export interface EditSalePayload {
    saleProducts: Array<SalesProduct>;
    additionalPayment: null;
}

export interface CreatedProduct {
    name: string;
    description: string;
    incomeTypeKey: string;
    price: string;
    productKey: string;
}

export interface SalesRequest {
    items: Array<Sale>;
}

export interface SalesDashboardStats {
    totalAmountCustomerOwed: number;
    totalCustomersOwing: number;
    totalPendingOrders: number;
    totalPendingOrdersAmount: number;
}

export interface DashboardHeader {
    text: string;
    numberOfColumns?: number;
}

export interface PaymentTypeModel {
    name: string;
    paymentKey: string;
}

export interface PaymentType {
    name: string;
    paymentTypeKey: string;
}

export interface SideNavLink {
    routeName: string;
    title: string;
    inactiveIcon: string;
    activeIcon: string;
    isHovering: boolean;
    subLinks: Array<SubLink>;
}

export interface SideBarItem {
    icon: string;
    title: string;
    routeName: string;
    iconColor?: string;
    metaData?: {
        color: string;
        text: string;
    };
    subLinks: Array<SubLink>;
}

export interface MobileSideNavLink {
    routeName: string;
    title: string;
    inactiveIcon: string;
    activeIcon: string;
}

export interface SubLink {
    title: string;
    routeName: string;
    icon: string;
}

export interface InvoiceCreationResponse {
    [key: string]: string;
}

export interface SalesCreationResponse {
    items: Array<SalesProduct>;
}

export interface ProductResponse {
    items: Array<Product>;
}

export interface FilteredProductResponse {
    items: Array<InvoiceProduct>;
}

export interface FilteredSalesProductResponse {
    items: Array<SalesProduct>;
}

export interface Product {
    name: string;
    description: string;
    incomeType: string;
    price: string;
    businessVerticalCode: string;
    key: string;
}

export interface InvoiceProduct {
    productName: string;
    description: string;
    price: number;
    productKey: string;
    unitPrice: number | string;
    quantity: number | string;
    discount: number | string;
    productVatKey: string;
    vat: number;
    note: string;
    measurementTypeKey: string;
}

export interface SalesProduct {
    description: string;
    productName: string;
    price: number;
    productKey: string;
    unitPrice: number | string;
    quantity: number | string;
    discount: number | string;
    productVatKey: string;
    vat: number;
    note: string;
    measurementTypeKey: string;
    paymentTypeKey: string;
    paymentTypeName: string;
    //productAmount now represents the inital totalAmount
    productAmount: number;
    amountPaid: number | string;
    saleDate: string;
    customerKey: string;
    isOutstandingOrder: null | boolean;
    editIndex?: number;
    isDelete?: boolean;
}

export interface SalesCustomer {
    customerKey: string;
}

export interface Notification {
    id: string;
    message: string;
}

export interface IncomeType {
    key: string;
    name: string;
}

export interface MeasurementType {
    key: string;
    name: string;
}

export interface SaleProduct {
    productName: string;
    unitPrice: number;
    quantity: number;
    quantitySupplied: number;
    discount: number;
    note: string | null;
}

export interface InvoiceCreationProduct {
    productName: string;
    unitPrice: number;
    quantity: number;
    quantitySupplied: number;
    discount: number;
    note: string | null;
    supplyDueDate: string;

    errors: ErrorIndexSignature;
}

export interface Customer {
    firstName: string;
    lastName: string;
    /*eslint-disable @typescript-eslint/no-explicit-any */
    imageUrl?: any;
}

export interface CustomerResponse {
    items: Array<CustomerProfile>;
}

export interface DashboardStat {
    header: string;
    body: string | number;
    isMonetaryValue: boolean;
    meta: string | number;
    icon: string;
    status: Status;
}

export interface Vendor {
    vendorKey: string;
    name: string;
    email: string;
    debtBalance: MoneyObject;
    lastActivity: string;
    lastActivityDate: string;
    address: string;
    note: string;
    phoneNumber: string;
    prepaymentBalance: MoneyObject;
    vendorType: VendorType;
}

export const defaultVendor: Vendor = {
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

export interface InvoiceCustomer {
    name: string;
    email: string;
    customerKey: string;
    image: string;
}

export interface InvoicePreviewCustomer {
    name: string;
    companyName: string;
    email: string;
}

export interface InvoiceSummary {
    invoiceNumber: number;
    invoiceDate: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ensureObjectHasValue = <T>(argument: T | undefined | null): any => {
    if (argument === undefined || argument === null) {
        return {};
    }

    return argument;
};

export const ensurePossiblyNullValueReturnsString = <T>(argument: T | undefined | null): any => {
    if (argument === undefined || argument === null) {
        return '';
    }

    return argument;
};

export const ensurePossiblyNullValueReturnsNumber = <T>(argument: T | undefined | null): any => {
    if (argument === undefined || argument === null) {
        return 0;
    }

    return argument;
};

export interface ProductPayload {
    name: string;
    description: string;
    incomeTypeKey: string;
    price: number;
}

export interface SalePayment {
    amount: number;
    date: string;
    paymentType: string;
}

export interface PaymentDetailsType {
    amount: number;
    paymentTypeName: string;
    paymentTypeKey: string;
    dateReceived: string;
    paymentKey: string;
}

export interface ReportsRequestStatus {
    getBalancesheetReport: Status;
    getProfitAndLossReports: Status;
}

export interface UserAccountInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface CompanyLogoRequest {
    uploadLogo: string;
    getLogoAndAddress: string;
}

export interface CompanyInfo {
    logo: string;
    address: string;
}
export interface Toaster {
    type: string;
    title: string;
    message: string;
    id: string;
    position?: string;
}

export interface ResetPasswordRequest {
    sendResetPasswordEmail: Status;
    resetPassword: Status;
}

export interface ResetPasswordPayload {
    passwordResetToken: string;
    password: string;
}

export interface PasswordFormProperty {
    title: string;
    subTitle: string;
    buttonText: string;
    routerLinkText: string;
}

export interface CompanyLogoRequest {
    uploadLogo: string;
    getLogoAndAddress: string;
}

export interface CompanyInfo {
    logo: string;
    address: string;
}

export interface ResetPasswordRequest {
    sendResetPasswordEmail: Status;
    resetPassword: Status;
}

export interface ResetPasswordPayload {
    passwordResetToken: string;
    password: string;
}

export interface PasswordFormProperty {
    title: string;
    subTitle: string;
    buttonText: string;
    routerLinkText: string;
}

export interface RequestErrorResponse {
    [index: number]: string;
}

export interface RequestErrorObject {
    code: number | null;
    message: string;
}

export interface UploadLogoPayload {
    logoUrl: string;
}

export interface VatOption {
    saleProductVatKey: string;
    name: string;
    displayName: string;
}

export interface VueExtension extends Vue {
    isMobileScreenSize: boolean;
    isMediumScreenSize: boolean;
    isLargeScreenSize: boolean;
    isTabletPortraitSize: boolean;
    businessIsANgo: boolean;
    abbreviateMonth: Function;
}

export interface DashboardCardContainerClass {
    firstCard: string;
    secondCard: string;
    thirdCard: string;
}

export interface LoginPhoneNumberValidation {
    phoneNumber: string;
    email?: string;
}

export interface LoginEmailValidation {
    email: string;
}

export interface DashboardCardColumnSize {
    xl: string;
    lg: string;
    md: string;
    sm: string;
    xs: string;
}

export interface CustomerRequest {
    addCutomer: Status;
    getCustomers: Status;
    updateCustomer: Status;
    getTransactions: Status;
    getTransactionCardDetails: Status;
}

export interface Currency {
    currencyKey: number;
    currencyName: string;
    currencyCode: string;
    currencySymbol: string;
}

export interface MoneyObject {
    currencyKey: string | number;
    amount: number;
}

export interface RadioButtonOption {
    name: string;
    values: Array<string | number>;
}

export interface PaymentAccount {
    displayName: string;
    accountBalance: number;
    currencyKey: number;
    paymentAccountKey: string;
    displayNameWithBalance?: string;
}

export enum Role {
    GUEST = 'GUEST',
    AUTH = 'AUTH',
}

export interface ToasterObject {
    title: string;
    message: string;
    type: string;
    id: string;
    position: string;
}

export interface DashboardFilterList {
    key: string;
    name: string;
}

export enum NotificationType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface BusinessVerticalDetail {
    name: string;
    code: string;
}

export interface Route {
    to: Route;
    from: Route;
    next: NavigationGuardNext;
}

export interface TransactionStatsCard {
    firstCardHeader: string;
    firstCardBody: string;
    secondCardHeader: string;
    secondCardBody: string;
}

export interface TransactionCardDetails {
    prepayment: MoneyObject;
    balanceOwed: MoneyObject;
}

export const defaultTransactionCard: TransactionCardDetails = {
    prepayment: { currencyKey: 0, amount: 0 },
    balanceOwed: { currencyKey: 0, amount: 0 },
};

export interface UploadedFile {
    fileUrl: string;
    fileTag: string;
}

export interface DashboardStatusOption {
    key: string;
    name: string;
}

export type Filters = {
    category: string;
    fromDate: string;
    toDate: string;
};

export type PaginationProperty = {
    page: number;
    limit: number;
};

export interface DashboardCardItem {
    title: string;
    midSection: string;
    icon: string;
    meta: {
        title: string;
        value: string;
    };
    cssClass: string;
}

export type DashboardIconType = 'home' | 'expense' | 'sale' | 'banking' | 'add-new';

export interface MenuItem {
    routeName: string;
    icon: string;
    text: string;
}

export interface SubMenuItem {
    routeName: string;
    text: string;
}
