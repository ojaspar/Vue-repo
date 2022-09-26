export type ReportLineItemComputableFields = {
    previousAmount: number;
    currentAmount: number;
};

export type ReportType = 'Debit' | 'Credit';
export interface ReportItem {
    reportLine: string;
    previousAmount: number;
    currentAmount: number;
    reportLineKey: string;
    reportCategoryKey: string;
    reportCategory: string;
    reportType?: ReportType;
}

export interface ReportItemResponse {
    reportLine: string;
    amount: number;
    reportLineKey: string;
    reportCategoryKey: string;
    reportCategory: string;
}

export interface BalanceSheet {
    assets: Array<ReportItem>;
    liabilities: Array<ReportItem>;
    capital: Array<ReportItem>;
}

export interface ProfitAndLossAccount {
    income: Array<ReportItem>;
    expenses: Array<ReportItem>;
    profit: Array<ReportItem>;
}

export interface PeriodicOptions {
    period: string;
}

export interface PeriodicRange {
    [key: number]: string | number | Date;
}

export interface TotalInBalanceSheet {
    totalAssets: number;
    totalLiabilities: number;
    totalCapital: number;
}

export interface TotalInProfitAndLoss {
    totalIncome: number;
    totalExpenses: number;
}

export enum REPORT_LINE_ITEM {
    CASH_BALANCE = 'RL001',
    BANK_BALANCE = 'RL002',
    BILL_RECEIVABLES = 'RL003',
    INVENTORY = 'RL004',
    PREPAYMENTS = 'RL005',
    OTHER_ASSETS = 'RL006',
    PLEDGE_RECEIVABLES = 'RL007',
    DONATED_ITEMS = 'RL008',
    PPE = 'RL009',
    PPE_DEPRECIATION = 'RL010',
    INVESTMENTS = 'RL011',
    INTANGIBLE_ASSETS = 'RL012',
    ADVANCE_FROM_CUSTOMERS = 'RL013',
    BILLS_PAYABLES = 'RL014',
    LOANS_AND_OVERDRAFT = 'RL015',
    TAX_PAYABLES = 'RL016',
    OTHER_LIABILITIES = 'RL017',
    ADVANCE_FROM_DONORS = 'RL018',
    COST_OF_ITEMS_SOLD = 'RL019',
    STAFF_COST = 'RL020',
    GENERAL_ADMINISTRATION = 'RL021',
    MARKETING_AND_DISTRIBUTION = 'RL022',
    INTEREST_BANK_CHARGES = 'RL023',
    TAXES = 'RL024',
    RESEARCH_AND_DEVELOPMENT = 'RL025',
    DONATIONS_AND_CHARITY = 'RL026',
    REVENUE_FROM_SALES = 'RL027',
    REVENUE_FROM_SERVICES = 'RL028',
    DONATION_AND_GRANTS = 'RL029',
    OTHER_INCOMES = 'RL030',
    ISSUED_SHARE_CAPITAL = 'RL031',
    CAPITAL_FUND = 'RL032',
    REVALUATION_RESERVE = 'RL033',
}

export enum REPORT_CATEGORY {
    CURRENT_ASSETS = 'RC001',
    NON_CURRENT_ASSETS = 'RC002',
    TOTAL_LIABILITIES = 'RC003',
    COST_OF_ITEMS_CONSUMED = 'RC004',
    EXPENSES = 'RC005',
    INCOME = 'RC006',
    NET_ASSETS = 'RC007',
}
