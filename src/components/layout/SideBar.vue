<template>
    <aside>
        <ul :class="['sidebar-menu', currentRouteIsNotDashboard && 'sidebar-menu__module']">
            <template v-if="currentRouteIsNotDashboard">
                <li class="sidebar-menu__module-header">
                    <img src="@/assets/img/mzuri-bird.svg" class="sidebar-menu__module-header--logo" />

                    <p class="sidebar-menu__module-header--module-name" v-if="!collapsed">{{ currentModule }}</p>

                    <img
                        :src="collapseToggleIcon"
                        @click="toggleSidebarCollapse"
                        v-if="!$root.isLargeScreenSize"
                        class="sidebar-menu__module-header--collapse-icon pointer"
                    />
                </li>

                <li
                    v-for="sublink in currentSubLinks"
                    :key="sublink.routeName"
                    :class="[
                        'sidebar-menu__module-link pointer',
                        currentRouteName === sublink.routeName && 'sidebar-menu__module-link-active',
                    ]"
                    @click="goToRoute(sublink.routeName)"
                >
                    <IconBase :iconName="sublink.icon" class="sidebar-menu__module-link--icon" />
                    <p class="sidebar-menu__module-link--text" v-if="!collapsed">{{ sublink.title }}</p>
                </li>

                <li
                    class="sidebar-menu__module-link pointer sidebar-menu__module-link--homepage"
                    @click="goToRoute('Dashboard')"
                >
                    <IconBase iconName="go-back" class="sidebar-menu__module-link--icon" />
                    <p class="sidebar-menu__module-link--text" v-if="!collapsed">Back to Home</p>
                </li>
            </template>

            <template v-else>
                <li class="sidebar-menu__list-item sidebar-menu__business-details">
                    <p class="sidebar-menu__business-details--initials">
                        {{ authenticatedUser.businessName | initials }}
                    </p>
                    <p class="sidebar-menu__business-details--name">{{ authenticatedUser.businessName }}</p>
                </li>

                <li
                    v-for="link in displayLinks"
                    :key="link.title"
                    class="sidebar-menu__list-item pointer"
                    @click="goToRoute(link.routeName)"
                >
                    <IconBase :iconColor="link.iconColor" :iconName="link.icon" class="sidebar-menu__list-item--icon" />

                    <article class="sidebar-menu__list-item--link-text">
                        <p class="sidebar-menu__list-item--link-title">
                            {{ link.title }}
                        </p>

                        <p
                            v-if="link.metaData"
                            class="sidebar-menu__list-item--link-meta-data"
                            :style="{ color: link.metaData.color }"
                        >
                            {{ link.metaData.text }}
                        </p>
                    </article>
                </li>
            </template>
        </ul>
    </aside>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { VueExtension, SideBarItem, User, SubLink } from '@/types';
import { OutstandingCustomer } from '@/pages/Dashboard/types';

import DashboardModule from '@/store/modules/dashboard';
import InventoryModule from '@/store/modules/inventory';

let dashboardModule: DashboardModule;
const dashboard = namespace('dashboard');
let inventoryModule: InventoryModule;

@Component
export default class SideBar extends Vue {
    @Prop({ required: true }) readonly authenticatedUser!: User;
    @Prop({ required: true }) readonly collapsed!: boolean;

    private subLinks = [
        {
            routeName: 'Dashboard',
            title: 'Dashboard',
            parentNavigation: 'Dashboard',
        },
        {
            routeName: 'PriceQuotation',
            title: 'Price Quotation',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Duplicate-Estimate',
            title: 'Duplicate Estimate',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Edit-Estimate',
            title: 'Edit Estimate',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'RecordSale',
            title: 'Record Sale',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Customers',
            title: 'Customers',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Products',
            title: 'Products',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Sales',
            title: 'Sales Dashboard',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'ManageSales',
            title: 'Manage Sales',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'ManageEstimates',
            title: 'Manage Estimates',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'CustomerTransactions',
            title: 'Customer Transactions',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'ProductTransactions',
            title: 'Products',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Convert-Estimate',
            title: 'Convert Estimate',
            parentNavigation: 'Sales',
        },
        {
            routeName: 'Expenses',
            title: 'Expense Dashboard',
            parentNavigation: 'Expenses',
        },
        // {
        //     routeName: 'QuickExpense',
        //     title: 'Quick Expense',
        //     parentNavigation: 'Expenses',
        // },
        {
            routeName: 'NewExpense',
            title: 'Record Expense',
            parentNavigation: 'Expenses',
        },
        // {
        //     routeName: 'RecordExpense',
        //     title: 'Batch Expense',
        //     parentNavigation: 'Expenses',
        // },
        {
            routeName: 'Expenses',
            title: 'Expense Dashboard',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'Salaries-Commissions',
            title: 'Pay Salaries & Commissions',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'BalanceSheetReports',
            title: this.$root.businessIsANgo ? 'Statement of Financial Position' : 'Balance Sheet',
            parentNavigation: 'Reports',
        },
        {
            routeName: 'ProfitAndLossStatement',
            title: this.$root.businessIsANgo ? 'Statement of Activities' : 'Income Statement',
            parentNavigation: 'ProfitAndLossStatement',
        },
        {
            routeName: 'Vendors',
            title: 'Vendors',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'VendorTransactions',
            title: 'Vendors',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'Expenses',
            title: 'Pay Salaries & Commissions',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'NewExpense',
            title: 'New Expense',
            parentNavigation: 'Expenses',
        },
        {
            routeName: 'Financing',
            title: 'Add Loan',
            parentNavigation: 'Financing',
        },
        {
            routeName: 'AddCapital',
            title: 'Add Capital',
            parentNavigation: 'Financing',
        },
        {
            routeName: 'AddLoan',
            title: 'Add Loan',
            parentNavigation: 'Financing',
        },
        {
            routeName: 'LoanDetails',
            title: 'Loan Details',
            parentNavigation: 'Financing',
        },
        {
            routeName: 'Financing',
            title: 'Financing Dashboard',
            parentNavigation: 'Financing',
        },
        {
            routeName: 'TaxAndRemittance',
            title: 'Tax and Remittance',
            parentNavigation: 'TaxAndRemittance',
        },
        {
            routeName: 'AddEmployee',
            title: 'Add Employee',
            parentNavigation: 'Payroll',
        },
        {
            routeName: 'BalanceSheetReports',
            title: 'Balance Sheet',
            parentNavigation: 'Reports',
        },
        {
            routeName: 'ProfitAndLossStatement',
            title: 'Profit and Loss',
            parentNavigation: 'Reports',
        },
        {
            routeName: 'AddUser',
            title: 'Add User',
            parentNavigation: 'Settings',
        },
        {
            routeName: 'EditUser',
            title: 'Edit User',
            parentNavigation: 'Settings',
        },
        {
            routeName: 'UserProfile',
            title: 'User Profile',
            parentNavigation: 'Settings',
        },
        {
            routeName: 'Banking',
            title: 'Banking Dashboard',
            parentNavigation: 'Banking',
        },
        {
            routeName: 'AddBank',
            title: 'Add Bank Account',
            parentNavigation: 'Banking',
        },
        {
            routeName: 'FundTransfer',
            title: 'Transfer Funds',
            parentNavigation: 'Banking',
        },
        {
            routeName: 'NewDonation',
            title: 'New Donation',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'Donors',
            title: 'Donors',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'DonationSchemes',
            title: 'Donation Schemes',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'Donations',
            title: 'Donations Dashboard',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'Pledges',
            title: 'Pledges',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'EditDonation',
            title: 'Edit Donation',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'DonatedItems',
            title: 'Donated Items',
            parentNavigation: 'Donations',
        },
        {
            routeName: 'TaxSettings',
            title: 'Tax Setup',
            parentNavigation: 'Settings',
        },
        {
            routeName: 'ValidateTaxProfile',
            title: 'Validate Tax Profile',
            parentNavigation: 'TaxAndRemittance',
        },
        {
            title: 'Record Paid Tax',
            routeName: 'RecordPaidTax',
            parentNavigation: 'TaxAndRemittance',
        },
        {
            routeName: 'ViewTaxLiabilities',
            title: 'View Tax Liabilities',
            parentNavigation: 'TaxAndRemittance',
        },
        {
            routeName: 'ManageTaxLiability',
            title: 'Manage Tax Liability',
            parentNavigation: 'TaxAndRemittance',
        },
        {
            routeName: 'InventoryDashboard',
            title: 'Inventory Dashboard',
            parentNavigation: 'Inventory',
        },
    ];
    private hiddenLinks: Array<string> = [
        // 'InventoryDashboard',
        'Payroll',
    ];

    public $root!: VueExtension;

    @dashboard.State
    private outstandingCustomers!: Array<OutstandingCustomer>;

    get displayLinks(): Array<SideBarItem> {
        if (process.env.NODE_ENV === 'development') return this.links;

        if (this.$root.businessIsANgo) {
            return this.links.filter((link: SideBarItem) => !this.hiddenLinks.includes(link.routeName));
        }

        return this.links.filter(
            (link: SideBarItem) => link.routeName !== 'Donations' && !this.hiddenLinks.includes(link.routeName),
        );
    }

    get links(): Array<SideBarItem> {
        return [
            {
                routeName: 'Sales',
                subLinks: [
                    {
                        routeName: 'Sales',
                        icon: 'dashboard',
                        title: 'Dashboard',
                    },
                    {
                        routeName: 'RecordSale',
                        icon: 'record-new',
                        title: 'Record Sale',
                    },
                    {
                        routeName: 'PriceQuotation',
                        icon: 'price-quotation',
                        title: 'Price Quotation',
                    },
                    {
                        routeName: 'Customers',
                        icon: 'people',
                        title: 'Customers',
                    },
                    {
                        routeName: 'Products',
                        icon: 'products',
                        title: 'Products',
                    },
                ],
                title: 'Sales',
                icon: 'sale',
                iconColor: '#77A412',
                metaData: this.totalOutstandingOrders
                    ? {
                          color: '#F72F09',
                          text: `${this.totalOutstandingOrders} ${
                              this.totalOutstandingOrders === 1 ? 'Order' : 'Orders'
                          } Due`,
                      }
                    : undefined,
            },
            {
                routeName: 'Donations',
                subLinks: [],
                // subLinks: [
                //     {
                //         routeName: 'NewDonation',
                //         title: 'New Donation',
                //     },
                //     {
                //         routeName: 'Pledges',
                //         title: 'Pledges',
                //     },
                //     {
                //         routeName: 'DonationSchemes',
                //         title: 'Donation Schemes',
                //     },
                //     {
                //         routeName: 'DonatedItems',
                //         title: 'Donated Items',
                //     },
                //     {
                //         routeName: 'Donors',
                //         title: 'Donors',
                //     },
                //     {
                //         routeName: 'Donations',
                //         title: 'Donations Dashboard',
                //     },
                // ],
                title: 'Donations',
                icon: 'donation',
                iconColor: '#0CA2D9',
            },
            {
                routeName: 'Expenses',
                title: 'Expenses',
                icon: 'expense',
                iconColor: '#1683B6',

                subLinks: [
                    {
                        routeName: 'Expenses',
                        title: 'Dashboard',
                        icon: 'dashboard',
                    },

                    {
                        icon: 'record-new',
                        routeName: 'RecordExpense',
                        title: 'Record Expense',
                    },
                    {
                        icon: 'give',
                        routeName: 'Salaries-Commissions',
                        title: 'Pay Salary / Commission',
                    },
                    {
                        routeName: 'Vendors',
                        title: 'Vendors',
                        icon: 'people',
                    },
                ],
            },
            {
                routeName: 'InventoryDashboard',
                title: 'Inventory',
                icon: 'inventory',
                iconColor: '#008A8E',

                subLinks: [
                    {
                        routeName: 'InventoryDashboard',
                        title: 'Dashboard',
                        icon: 'dashboard',
                    },
                    {
                        routeName: 'AddStockItem',
                        title: 'Add Stock Item',
                        icon: 'new-entry',
                    },
                ],
            },
            {
                routeName: 'Banking',
                title: 'Banking',
                icon: 'banking',
                iconColor: '#354DA2',

                subLinks: [
                    {
                        icon: 'dashboard',
                        routeName: 'Banking',
                        title: 'Dashboard',
                    },
                    {
                        icon: 'add-bank',
                        routeName: 'AddBank',
                        title: 'Add Bank Account',
                    },
                    {
                        icon: 'transfer',
                        routeName: 'FundTransfer',
                        title: 'Transfer Funds',
                    },
                ],
            },
            {
                routeName: 'ViewTaxLiabilities',
                title: 'Taxes & Remittances',
                icon: 'tax',
                iconColor: '#0D65C7',

                subLinks: [
                    {
                        icon: 'dashboard',
                        routeName: 'ViewTaxLiabilities',
                        title: 'Dashboard',
                    },

                    {
                        icon: 'record-payment',
                        title: 'Record Paid Tax',
                        routeName: 'RecordPaidTax',
                    },
                    // {
                    //     routeName: 'ValidateTaxProfile',
                    //     title: 'Validate Tax Profile',
                    // },
                ],
            },
            {
                routeName: 'Reports',
                title: 'Reports',
                icon: 'reports',
                iconColor: '#1AD6F4',

                subLinks: [
                    {
                        icon: 'balance-sheet',
                        routeName: 'BalanceSheetReports',
                        title: this.$root.businessIsANgo ? 'Statement of Financial Position' : 'Balance Sheet',
                    },
                    {
                        icon: 'reports',
                        routeName: 'ProfitAndLossStatement',
                        title: this.$root.businessIsANgo ? 'Statement of Activities' : 'Income Statement',
                    },
                    {
                        icon: 'trial-balance',
                        routeName: 'TrialBalance',
                        title: 'Trial Balance',
                    },
                    {
                        icon: 'cash-flow',
                        routeName: 'CashFlow',
                        title: 'Cash Flow Statement',
                    },
                ],
            },
            {
                routeName: 'Financing',
                title: 'Financing',
                icon: 'financing',
                iconColor: '#0D7494',

                subLinks: [
                    {
                        routeName: 'Financing',
                        icon: 'dashboard',
                        title: 'Dashboard',
                    },
                    {
                        routeName: 'AddLoan',
                        icon: '',
                        title: 'Add Loan',
                    },
                    {
                        routeName: 'AddCapital',
                        icon: '',
                        title: 'Add Capital',
                    },
                ],
            },
            {
                routeName: 'Payroll',
                title: 'Payroll',
                icon: 'payroll',
                iconColor: '#1683B6',

                subLinks: [
                    {
                        routeName: 'AddEmployee',
                        title: 'Add Employee',
                        icon: '',
                    },
                ],
            },
            {
                routeName: 'UserProfile',
                title: 'Settings',
                icon: 'settings',
                iconColor: '#FF411E',

                subLinks: [
                    {
                        routeName: 'UserProfile',
                        icon: 'dashboard',
                        title: 'My Profile',
                    },
                    {
                        routeName: 'ViewUsers',
                        icon: 'many-people',
                        title: 'Other Users',
                    },
                    {
                        routeName: 'TaxSettings',
                        icon: 'tax-setup',
                        title: 'Tax Setup',
                    },
                ],
            },
        ];
    }

    get currentSubLinks(): Array<SubLink> {
        const currentModule = this.displayLinks.find((link: SideBarItem) =>
            link.routeName.includes(this.currentModule),
        );

        if (currentModule) return currentModule.subLinks;

        return [];
    }

    get totalOutstandingOrders(): number {
        return this.outstandingCustomers.length;
    }

    get currentModule(): string {
        return this.$route?.meta?.module;
    }

    get currentRouteName(): string {
        return this.$route?.name || '';
    }

    get currentRouteIsNotDashboard(): boolean {
        return this.currentRouteName !== 'Dashboard';
    }

    get collapseToggleIcon(): string {
        return this.collapsed
            ? require('@/assets/img/sidebar/expand-menu.svg')
            : require('@/assets/img/sidebar/collapse-menu.svg');
    }

    private routeToInventoryDashboard() {
        if (this.currentRouteName !== 'InventoryDashboard') this.$router.push({ name: 'InventoryDashboard' });
    }

    public goToRoute(routeName: string) {
        if (routeName === 'AddStockItem') {
            inventoryModule.performNewAction('AddStockItem');
            this.routeToInventoryDashboard();
            return;
        }

        this.$router.push({ name: routeName });
    }

    public closeSidebarMobileMenu() {
        this.$emit('close-sidebar-button-clicked');
    }

    private toggleSidebarCollapse() {
        this.$emit('collapse-sidebar');
    }

    private async makeInitialRequests() {
        await dashboardModule.getOutstandingOrders();
    }

    private bindModules() {
        dashboardModule = getModule(DashboardModule, this.$store);
        inventoryModule = getModule(InventoryModule, this.$store);
    }

    mounted() {
        this.bindModules();
        this.makeInitialRequests();
    }
}
</script>

<style lang="scss">
@import 'src/styles/layout/sidebar';
</style>
