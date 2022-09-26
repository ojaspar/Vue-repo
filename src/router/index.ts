import Vue from 'vue';
import VueRouter, { Location, Route } from 'vue-router';

import AuthenticationLayout from '@/components/layout/AuthenticationLayout.vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

import SessionStorageService from '@/services/sessionStorage';
import { Role } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

const { isNavigationFailure, NavigationFailureType } = VueRouter;

const originalPush: Promise<Route> | Function = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location: Location) {
    return originalPush.call(this, location).catch((failure: any) => {
        if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
            window.location.reload();
            return;
        }
    });
};

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: { name: 'Dashboard' },
        name: 'Home',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard/MainDashboard/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
        },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('@/pages/auth/signup/index.vue'),
        meta: {
            allowedRoles: [Role.GUEST],
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/auth/login/index.vue'),
        meta: {
            allowedRoles: [Role.GUEST],
        },
    },
    {
        path: '/business-setup',
        name: 'BusinessSetup',
        component: () => import('@/pages/BusinessRegistration/index.vue'),
        meta: {
            allowedRoles: [Role.AUTH],
        },
    },
    {
        path: '/add-user',
        name: 'AddUser',
        component: () => import('@/pages/Settings/AddOrEditUser.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'UserProfile',
        },
        props: {
            isEditing: false,
        },
    },
    {
        path: '/edit-user/:userKey',
        name: 'EditUser',
        component: () => import('@/pages/Settings/AddOrEditUser.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'UserProfile',
        },
        props: {
            isEditing: true,
        },
    },
    {
        path: '/view-users',
        name: 'ViewUsers',
        component: () => import('@/pages/Settings/ViewUsers.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'UserProfile',
        },
    },
    {
        path: '/profile',
        name: 'UserProfile',
        component: () => import('@/pages/Settings/UserProfile/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'UserProfile',
        },
    },
    {
        path: '/sales',
        name: 'Sales',
        component: () => import('@/pages/Sales/index.vue'),
        meta: {
            layout: DashboardLayout,
            pageContentTitle: 'Sales Dashboard',
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/manage-sales/:saleKey',
        name: 'ManageSales',
        component: () => import('@/pages/Sales/ManageSales/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/quick-expense',
        name: 'QuickExpense',
        component: () => import('@/pages/Spending/Expense/QuickExpense/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/expenses',
        name: 'Expenses',
        component: () => import('@/pages/Spending/Expense/Dashboard.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    // {
    //     path: '/record-expense',
    //     name: 'RecordExpense',
    //     component: () => import('@/pages/Spending/RecordExpense.vue'),
    //     meta: {
    //         layout: DashboardLayout,
    //         allowedRoles: [Role.AUTH],
    //     },
    // },
    {
        path: '/record-expense',
        name: 'RecordExpense',
        component: () => import('@/pages/Spending/Expense/RecordExpense/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/new-expense',
        name: 'NewExpense',
        component: () => import('@/pages/Spending/Expense/RecordExpense/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/old-sale',
        name: 'OldSale',
        component: () => import('@/pages/Sales/RecordSale.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/record-sale',
        name: 'RecordSale',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/price-quotation',
        name: 'PriceQuotation',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            isEstimate: true,
        },
    },
    {
        path: '/price-quotation/duplicate/:saleKey',
        name: 'Duplicate-Estimate',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            isEstimate: true,
            action: 'duplicate',
        },
    },
    {
        path: '/price-quotation/edit/:saleKey',
        name: 'Edit-Estimate',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            isEstimate: true,
            action: 'edit',
        },
    },
    {
        path: '/data-migration',
        name: 'DataMigration',
        component: () => import('@/pages/DataMigration/index.vue'),
        meta: {
            allowedRoles: [Role.AUTH],
        },
    },
    {
        path: '/add-product-to-sales',
        name: 'AddProduct',
        component: () => import('@/pages/Sales/AddProductToSales.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Ssle',
        },
        props: {
            isBackButtonToShowInThisRoute: true,
        },
    },
    {
        path: '/sales/convert-estimate/:saleKey',
        name: 'Convert-Estimate',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            action: 'convert',
        },
    },
    {
        path: '/sales/duplicate/:saleKey',
        name: 'Duplicate-Sale',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            action: 'duplicate',
        },
    },
    {
        path: '/sales/edit/:saleKey',
        name: 'Edit-Sale-Record',
        component: () => import('@/pages/Sales/RecordSale/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
        props: {
            action: 'edit',
        },
    },
    {
        path: '/reports',
        name: 'Reports',
        redirect: { name: 'BalanceSheetReports' },
        component: () => import('@/components/ui/BaseRouterView.vue'),

        children: [
            {
                path: 'balance-sheet',
                name: 'BalanceSheetReports',
                component: () => import('@/pages/Reports/BalanceSheet.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Reports',
                },
            },

            {
                path: 'profit-and-loss',
                name: 'ProfitAndLossStatement',
                component: () => import('@/pages/Reports/ProfitAndLoss.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Reports',
                },
            },
            {
                path: 'trial-balance',
                name: 'TrialBalance',
                component: () => import('@/pages/Reports/TrialBalance.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Reports',
                },
            },
            {
                path: 'cash-flow',
                name: 'CashFlow',
                component: () => import('@/pages/Reports/CashFlow.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Reports',
                },
            },
        ],
    },
    {
        path: '/verify-account',
        name: 'VerifyAccount',
        component: () => import('@/pages/Signup/AccountVerification.vue'),
        meta: {
            layout: AuthenticationLayout,
            allowedRoles: [Role.GUEST],
        },
    },
    {
        path: '/forgot-password',
        name: 'Forgot-Password',
        component: () => import('@/pages/ForgotPassword/index.vue'),
        meta: {
            allowedRoles: [Role.GUEST],
        },
    },
    {
        path: '/reset-password',
        name: 'Reset-Password',
        component: () => import('@/pages/ResetPassword/index.vue'),
        meta: {
            allowedRoles: [Role.GUEST],
        },
    },
    {
        path: '/duplicate-expense/:expenseKey',
        name: 'Duplicate-Expense',
        component: () => import('@/pages/Spending/Expense/RecordExpense/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
        props: {
            action: 'duplicate',
        },
    },
    {
        path: '/edit-expense/:expenseKey',
        name: 'Edit-Previous-Expense',
        component: () => import('@/pages/Spending/Expense/RecordExpense/v4/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
        props: {
            action: 'edit',
        },
    },
    {
        path: '/pay-salaries-and-commissions',
        name: 'Salaries-Commissions',
        component: () => import('@/pages/Spending/SalariesAndCommissions/PaySalariesAndCommissionsNew.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/duplicate-salary/:expenseKey',
        name: 'Duplicate-Salary',
        component: () => import('@/pages/Spending/SalariesAndCommissions/PaySalariesAndCommissions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
        props: {
            action: 'duplicate',
        },
    },
    {
        path: '/edit-salary/:expenseKey',
        name: 'Edit-Previous-Salary',
        component: () => import('@/pages/Spending/SalariesAndCommissions/PaySalariesAndCommissions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
        props: {
            action: 'edit',
        },
    },
    {
        path: '/financing',
        name: 'Financing',
        component: () => import('@/pages/Financing/Dashboard.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Financing',
        },
    },
    {
        path: '/financing/add-capital',
        name: 'AddCapital',
        component: () => import('@/pages/Financing/Capital/AddCapital.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Financing',
        },
    },
    {
        path: '/financing/add-loan',
        name: 'AddLoan',
        component: () => import('@/pages/Financing/Loan/AddLoan/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Financing',
        },
    },
    {
        path: '/financing/loan-details',
        name: 'LoanDetails',
        component: () => import('@/pages/Financing/Loan/LoanDetails.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Financing',
        },
    },
    {
        path: '/payroll/add-employee',
        name: 'AddEmployee',
        component: () => import('@/pages/Payroll/AddEmployee/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Payroll',
        },
    },
    {
        path: '/vendors',
        name: 'Vendors',
        component: () => import('@/pages/Spending/Expense/ManageVendors/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/vendors/transactions',
        name: 'VendorTransactions',
        component: () => import('@/pages/Spending/Expense/ManageVendors/VendorTransactions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/customers',
        name: 'Customers',
        component: () => import('@/pages/Sales/ManageCustomers/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/customers/transactions',
        name: 'CustomerTransactions',
        component: () => import('@/pages/Sales/ManageCustomers/CustomerTransactions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('@/pages/Sales/ManageProducts/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/products/transactions/:productKey',
        name: 'ProductTransactions',
        component: () => import('@/pages/Sales/ManageProducts/ProductTransactions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },

    {
        path: '/banking',
        name: 'Banking',
        component: () => import('@/pages/Spending/Banking/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Banking',
        },
    },
    {
        path: '/banking/add-bank',
        name: 'AddBank',
        component: () => import('@/pages/Spending/Banking/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Banking',
        },
    },
    {
        path: '/banking/transfer-funds',
        name: 'FundTransfer',
        component: () => import('@/pages/Spending/Banking/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Banking',
        },
    },
    {
        path: '/donations/new',
        name: 'New-Donation',
        component: () => import('@/pages/Donations/NewDonation/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations/donors',
        name: 'Donors',
        component: () => import('@/pages/Donations/Donors/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations/donor-donations',
        name: 'DonorDonations',
        component: () => import('@/pages/Donations/Donors/DonorTransactions.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations/schemes',
        name: 'DonationSchemes',
        component: () => import('@/pages/Donations/DonationSchemes/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations/donation-scheme-donations',
        name: 'DonationSchemeDonations',
        component: () => import('@/pages/Donations/DonationSchemes/DonationSchemeDonations.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations',
        name: 'Donations',
        component: () => import('@/pages/Donations/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },

    {
        path: '/new-donation',
        name: 'NewDonation',
        component: () => import('@/pages/Donations/NewDonation/V2/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
        props: {
            action: '',
        },
    },
    {
        path: '/edit-donation/:donationKey',
        name: 'EditDonation',
        component: () => import('@/pages/Donations/NewDonation/V2/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
        props: {
            action: 'edit',
        },
    },
    {
        path: '/duplicate-donation/:donationKey',
        name: 'DuplicateDonation',
        component: () => import('@/pages/Donations/NewDonation/V2/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
        props: {
            action: 'duplicate',
        },
    },
    {
        path: '/donations/pledges',
        name: 'Pledges',
        component: () => import('@/pages/Donations/Pledges/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/donations/donated-items',
        name: 'DonatedItems',
        component: () => import('@/pages/Donations/DonatedItems/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Donation',
        },
    },
    {
        path: '/tax-settings',
        name: 'TaxSettings',
        component: () => import('@/pages/TaxAndRemittance/TaxProfile/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'UserProfile',
        },
    },
    {
        path: '/validate-tax-profile',
        name: 'ValidateTaxProfile',
        component: () => import('@/pages/TaxAndRemittance/TaxProfile/ValidateProfile.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Tax',
        },
    },
    {
        path: '/record-paid-tax',
        name: 'RecordPaidTax',
        component: () => import('@/pages/TaxAndRemittance/RecordPaidTax.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Tax',
        },
    },
    {
        path: '/tax-liabilities',
        name: 'TaxLiabilities',
        component: () => import('@/components/ui/BaseRouterView.vue'),
        redirect: { name: 'ViewTaxLiabilities' },
        children: [
            {
                path: '/view-tax-liabilities',
                name: 'ViewTaxLiabilities',
                component: () => import('@/pages/TaxAndRemittance/TaxLiabilities/index.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Tax',
                },
            },
            {
                path: '/manage-liability',
                name: 'ManageTaxLiability',
                component: () => import('@/pages/TaxAndRemittance/TaxLiabilities/TaxLiabilitiesDetails/index.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Tax',
                },
            },
        ],
    },
    {
        path: '/manage-expense/:expenseKey',
        name: 'ManageExpense',
        component: () => import('@/pages/Spending/Expense/ManageExpense/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Expenses',
        },
    },
    {
        path: '/manage-salary/:expenseKey',
        name: 'ManageSalary',
        component: () => import('@/pages/Spending/Expense/ManageExpense/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
        },
        props: {
            expenseType: 'salary',
        },
    },
    {
        path: '/manage-estimates/:saleKey',
        name: 'ManageEstimates',
        component: () => import('@/pages/Sales/ManageEstimates/index.vue'),
        meta: {
            layout: DashboardLayout,
            allowedRoles: [Role.AUTH],
            module: 'Sales',
        },
    },
    {
        path: '/inventory',
        redirect: { name: 'InventoryDashboard' },
        component: () => import('@/components/ui/BaseRouterView.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'InventoryDashboard',
                component: () => import('@/pages/Inventory/index.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Inventory',
                },
            },
            {
                path: 'stock-item/~:stockItemName',
                name: 'StockItem',
                component: () => import('@/pages/Inventory/StockItem/index.vue'),
                meta: {
                    layout: DashboardLayout,
                    allowedRoles: [Role.AUTH],
                    module: 'Inventory',
                },
            },
        ],
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
});

router.beforeEach((to: any, _from, next) => {
    let title = 'Mzuri';
    const {
        meta: { title: pageTitle },
    } = to;
    if (pageTitle) title = pageTitle;
    document.title = title;

    // check authentication
    const userObject = SessionStorageService.decodeToken();

    if (!to.meta?.allowedRoles) return next();

    if (to.meta.allowedRoles.includes(Role.AUTH)) {
        if (!userObject) {
            location.href = '/login';
            return;
        }

        if (to.name !== 'BusinessSetup' && to.name !== 'Login' && userObject.signupIncompleteStage) {
            location.href = '/business-setup';
            return;
        }
    }

    if (to.meta.allowedRoles.includes(Role.GUEST)) {
        if (userObject) {
            router.back();
            return;
        }
    }

    return next();
});

export default router;
