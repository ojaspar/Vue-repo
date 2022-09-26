import { MoneyObject, Status } from '@/types';

export enum DonationSchemeType {
    PROJECT_SPECIFIC = 'Project Specific',
    GENERAL = 'General',
}

export enum RedemptionTypeOption {
    INSTANT = 'Instant',
    PLEDGE = 'Pledge',
}

export enum FormOfDonation {
    FINANCIAL = 'Financial',
    ITEM = 'Item',
    SERVICE = 'Service',
    NONE = '',
}

export enum PledgeStatus {
    PENDING = 'Pending',
    PARTLY_REDEEMED = 'Partly Redeemed',
}

export enum DonatedItemUsage {
    SALE = 'sale',
    PROJECT_SCHEME = 'project-scheme',
    UNDECIDED = 'undecided',
    DEFAULT = '',
}

export const defaultDonor: Donor = {
    phoneNumber: '',
    emailAddress: '',
    address: '',
    notes: '',
    donorKey: '',
    fullName: '',
    lastInteraction: '',
    lastInteractionDate: '',
    totalDonation: { amount: 0, currencyKey: 0 },
    totalPledge: { amount: 0, currencyKey: 0 },
};

export const defaultDonationScheme: DonationScheme = {
    donationSchemeKey: '',
    name: '',
    description: '',
    lastTransactionDate: new Date().toISOString(),
    currentAmount: { currencyKey: 0, amount: 0 },
    financialTarget: { currencyKey: 0, amount: 0 },
    totalAmount: { currencyKey: 0, amount: 0 },
    type: DonationSchemeType.PROJECT_SPECIFIC,
    targetDate: '',
};

export const defaultDonationSummary: DonationSummary = {
    schemeName: '',
    redemptionType: RedemptionTypeOption.INSTANT,
    amount: { amount: 0, currencyKey: 0 },
    description: '',
    donationForm: FormOfDonation.NONE,
    pledgeDueDate: '',
    itemType: '',
    donationSchemeKey: '',
    donationItemTypeKey: '',
    donorKey: '',
    transactionDate: '',
};

export const defaultDonation: Donation = {
    donationForm: FormOfDonation.FINANCIAL,
    redemptionType: RedemptionTypeOption.INSTANT,
    amount: { amount: 0, currencyKey: 0 },
    paymentAccountKey: '',
    itemType: '',
    description: '',
    pledgeDueDate: '',
    donationItemTypeKey: '',
    donationSchemeKey: '',
    donorKey: '',
    transactionDate: '',
    quantity: '',
    schemeName: '',
    donationKey: '',
    donationScheme: '',
};

export const defaultDonationExport: DonationExport = {
    donationKey: '',
    transactionDate: '',
    donorName: '',
    donationScheme: '',
    amount: '',
    pledgeDueDate: '',
    donationForm: FormOfDonation.NONE,
    redemptionType: RedemptionTypeOption.INSTANT,
};

export const defaultPledge: Pledge = {
    donationKey: '',
    transactionDate: '',
    donorName: '',
    status: PledgeStatus.PENDING,
    pledgeValue: { currencyKey: 0, amount: 0 },
    pledgeDueDate: '',
    donationForm: FormOfDonation.FINANCIAL,
};
export interface DonationRequestStatus {
    getDonors: Status;
    createDonor: Status;
    editDonor: Status;
    createDonationScheme: Status;
    getDonationSchemes: Status;
    getDonationItemTypes: Status;
    createDonation: Status;
    getDonations: Status;
    updateDonationScheme: Status;
    getDonationDetails: Status;
    updateDonation: Status;

    getDonorTransactions: Status;
    getPledges: Status;
    getDonationDashboardStats: Status;

    getDonorDonations: Status;
    getSchemeDonations: Status;
}

export interface Donor {
    donorKey?: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    notes: string;
    lastInteraction?: string | null;
    lastInteractionDate?: string | null;
    totalDonation: MoneyObject;
    totalPledge: MoneyObject;
}

export interface DonationScheme {
    donationSchemeKey?: string;
    name: string;
    type: DonationSchemeType;
    description: string;
    financialTarget: MoneyObject;
    totalAmount?: MoneyObject;
    currentAmount?: MoneyObject;
    lastTransactionDate?: string;
    targetDate: string;
}

export interface RedemptionType {
    key: string;
    value: string;
    displayName: string;
}

export interface DonationDashboardCards extends DonationDashboardStats {
    functionalCurrencySymbol: string;
    currentMonth: string;
}

export interface DonationList {
    donationKey: string;
    transactionDate: string;
    donorName: string;
    donationScheme: string;
    amount: MoneyObject;
    pledgeDueDate: string;
    redemptionType: RedemptionTypeOption;
    donationForm?: FormOfDonation;
}

export interface Donation {
    donationForm: FormOfDonation;
    redemptionType: RedemptionTypeOption;
    amount: MoneyObject;
    paymentAccountKey?: string;
    itemType?: string;
    description?: string;
    pledgeDueDate?: string;
    donationItemTypeKey: string;
    donationSchemeKey: string;
    donorKey: string;
    transactionDate: string;
    quantity?: string;
    schemeName: string;
    donationKey?: string;
    donationScheme?: string;
}
export interface DonationPayload {
    donationForm: string;
    redemptionType: string;
    amount?: MoneyObject | null;
    paymentAccountKey?: string;
    description?: string;
    pledgeDueDate?: string;
    donationItemTypeKey: string;
    donationSchemeKey: string;
    donorKey: string;
    transactionDate: string;
    quantity?: number | null;
    schemeName: string;
    donationKey?: string;
    donationScheme?: string;
}

export interface DonationSummary {
    schemeName: string;
    redemptionType: RedemptionTypeOption;
    amount: MoneyObject;
    description?: string;
    donationForm: FormOfDonation;
    pledgeDueDate?: string;
    itemType?: string;
    donationItemTypeKey?: string;
    donationSchemeKey: string;
    donorKey: string;
    transactionDate: string;
}

export interface DonationItemType {
    name: string;
    donationItemTypeKey: string;
    description: string;
}

export interface DonorDonation {
    donorName: string;
    transactionDate: string;
    amount: MoneyObject;
    pledgeDueDate: string;
    donationScheme: string;
    donationKey: string;
    redemptionType: RedemptionTypeOption;
    donationForm: FormOfDonation;
    description: string;
}

export interface DonationExport {
    donationKey: string;
    transactionDate: string;
    donorName: string;
    donationScheme?: string;
    amount: string;
    pledgeDueDate: string;
    redemptionType?: RedemptionTypeOption;
    donationForm?: FormOfDonation;
}

export interface Pledge {
    donationKey: string;
    transactionDate: string;
    donorName: string;
    status: PledgeStatus;
    pledgeValue: MoneyObject;
    pledgeDueDate: string;
    donationForm: FormOfDonation;
    description?: string;
    quantityPledged?: number;
    quantityRedeemed?: number;
}

export interface DonationDashboardStats {
    totalDonationsAmountInCurrentMonth: MoneyObject;
    countOfInstantDonationsInCurrentMonth: number;
    countOfPledgeDonationsInCurrentMonth: number;
    totalPledgeAmount: MoneyObject;
}
export interface ItemValuation {
    itemValue: MoneyObject;
    usage: DonatedItemUsage;
    donationSchemeKey: string;
}

export interface SchemeDonation {
    donorName: string | null;
    transactionDate: string;
    currentAmount: MoneyObject;
    targeValue: MoneyObject;
    pledgeDueDate: string;
    donationScheme: string;
    donationKey: string;
    redemptionType: RedemptionTypeOption;
    description: string | null;
    donationForm: FormOfDonation | null;
}
