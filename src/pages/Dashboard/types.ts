import { MoneyObject, Status } from '@/types';

export interface DashboardRequestStatus {
    getExpense: Status;
    getSales: Status;
    getOutstandingOrders: Status;
    getDashboardCreditSales: Status;
    getDashboardCreditPurchases: Status;
    getDashboardLoanDebts: Status;
}

export interface DashboardSales {
    totalSalesAmount: MoneyObject;
    totalAmountPaid: MoneyObject;
    totalBalance: MoneyObject;
    outstandingOrderCount: number;
    saleCharts: Array<BarChartData>;
}

export interface DashboardExpense {
    totalExpenseAmount: MoneyObject;
    totalAmountPaid: MoneyObject;
    totalBalance: MoneyObject;
    expenseCharts: Array<BarChartData>;
}

export interface BusinessPerformanceRange {
    starts: string;
    ends: string;
}

export interface OutstandingCustomer {
    customerName: string;
    balance: number;
}

export interface OutstandingOrders {
    totalOutstandingCount: number;
    outstandingCustomers: Array<OutstandingCustomer>;
    totalOutstandingAmount: number;
}

export interface Job {
    name: string;
    amount: string;
    completed: boolean;
}

export interface BarChartData {
    totalAmount: number;
}

export interface DashboardCreditSales {
    pastDue: MoneyObject;
    notDue: MoneyObject;
}
export interface DashboardCreditPurchases {
    pastDue: MoneyObject;
    maturing: MoneyObject;
}
export interface DashboardLoanDebts {
    maturingLoan: MoneyObject;
    pastDueLoan: MoneyObject;
}
