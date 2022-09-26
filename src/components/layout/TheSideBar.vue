<template>
    <ul class="sidenav__list" v-clickOutside="hideSubmenu">
        <div>
            <div class="sidenav__close-icon-container">
                <font-awesome-icon
                    icon="times"
                    aria-hidden="true"
                    class="pointer sidenav__close-icon"
                    @click="closeSidebarMobileMenu"
                />
            </div>

            <div
                v-for="link in displayLinks"
                :key="link.routeName"
                :class="[
                    isCurrentNavigationTheActiveLink(link) || link.isHovering ? 'highlight' : '',
                    'sidenav__list-item',
                ]"
                @mouseenter="handleMouseHover(link)"
                @mouseleave="handleMouseLeave(link)"
            >
                <li class="sidenav__list-item-nav-link" @click="handleMenuClick(link)">
                    <div class="d-flex">
                        <div class="sidenav__icon-container">
                            <img
                                :src="
                                    isCurrentNavigationTheActiveLink(link) || link.isHovering
                                        ? link.activeIcon
                                        : link.inactiveIcon
                                "
                                class="sidenav__icon"
                            />
                        </div>
                        <div class="d-flex flex-column justify-content-center text-container align-items-center">
                            <h3
                                :class="[
                                    isCurrentNavigationTheActiveLink(link) || link.isHovering
                                        ? 'active-title-text'
                                        : '',
                                    'text-container__title',
                                ]"
                                v-text="link.title"
                            ></h3>
                        </div>
                    </div>
                    <font-awesome-icon
                        icon="chevron-right"
                        aria-hidden="true"
                        class="sidenav__submenu-icon"
                        v-if="conditionsForChevronRightToAppear(link)"
                    />
                    <font-awesome-icon
                        icon="chevron-down"
                        aria-hidden="true"
                        class="sidenav__submenu-icon"
                        v-if="conditionsForChevronDownToAppear(link)"
                    />
                    <font-awesome-icon
                        icon="chevron-up"
                        aria-hidden="true"
                        class="sidenav__submenu-selected-arrow-icon"
                        v-if="conditionsForChevronUpToAppear(link)"
                    />
                    <div
                        class="sidenav__submenu-container"
                        tabindex="0"
                        v-if="conditionsForMediumScreenSizedSubmenuToShow(link)"
                    >
                        <ul class="sidenav__submenu" v-for="(subMenuLink, index) in link.subLinks" :key="index">
                            <li tabindex="0" @click="handleSubmenuClick(subMenuLink)" class="sidenav__submenu__item">
                                <span class="sidenav__submenu__link" :to="{ name: subMenuLink.routeName }">
                                    {{ subMenuLink.title }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </li>

                <div tabindex="0" class="sidenav__dropdown-mobile" v-if="$root.isMobileScreenSize">
                    <ul
                        :class="[
                            isCurrentNavigationTheActiveLink(link) && showSubMenu ? 'active' : 'inactive',
                            'sidenav__submenu-mobile',
                        ]"
                        v-for="(subMenuLink, index) in link.subLinks"
                        :key="index"
                    >
                        <li
                            tabindex="0"
                            @click="handleMobileSubmenuClick(subMenuLink)"
                            class="sidenav__submenu-mobile-item"
                        >
                            <span class="sidenav__submenu-link-mobile" :to="{ name: subMenuLink.routeName }">
                                {{ subMenuLink.title }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="sidenav__logo-container" v-if="!$root.isMobileScreenSize">
            <img src="@/assets/img/mzuri-logo.svg" class="sidenav__logo" alt="Mzuri Logo" />
        </div>
    </ul>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator';

import inactiveDashboardIcon from '@/assets/img/sidebar/dashboard-inactive.svg';
import activeDashboardIcon from '@/assets/img/sidebar/dashboard-active.svg';
import inactiveSalesIcon from '@/assets/img/sidebar/sales-inactive.svg';
import activeSalesIcon from '@/assets/img/sidebar/sales-active.svg';
import inactiveSpendingIcon from '@/assets/img/sidebar/expenses-inactive.svg';
import activeSpendingIcon from '@/assets/img/sidebar/expenses-active.svg';
import inactiveReportsIcon from '@/assets/img/sidebar/reports-inactive.svg';
import activeReportsIcon from '@/assets/img/sidebar/reports-active.svg';
import inactiveFinancingIcon from '@/assets/img/sidebar/financing-inactive.svg';
import activeFinancingIcon from '@/assets/img/sidebar/financing-active.svg';
import inactiveTaxAndRemittanceIcon from '@/assets/img/sidebar/tax-remittance-inactive.svg';
import activeTaxAndRemittanceIcon from '@/assets/img/sidebar/tax-remittance-active.svg';
import activeBankingIcon from '@/assets/img/sidebar/banking-active.svg';
import inactiveBankingIcon from '@/assets/img/sidebar/banking-inactive.svg';
import inactiveSettingsIcon from '@/assets/img/sidebar/settings-inactive.svg';
import activeSettingsIcon from '@/assets/img/sidebar/settings-active.svg';
import inactiveLogoutIcon from '@/assets/img/sidebar/logout-inactive.svg';
import activeLogoutIcon from '@/assets/img/sidebar/logout-active.svg';
import inactiveDonationsIcon from '@/assets/img/sidebar/donations-inactive.svg';
import activeDonationsIcon from '@/assets/img/sidebar/donations-active.svg';
import inactivePayrollIcon from '@/assets/img/sidebar/payroll-inactive.svg';
import activePayrollIcon from '@/assets/img/sidebar/payroll-active.svg';

import SessionStorageService from '@/services/sessionStorage';
import AuthenticationService from '@/services/authentication';

import { SideNavLink, VueExtension, ensureObjectHasValue, SubLink } from '@/types';

@Component({
    directives: {
        clickOutside: {
            bind: function(el: any, binding: any, vnode: any) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                el.clickOutsideEvent = (event: any) => {
                    event.stopPropagation();
                    if (!el.contains(event.target)) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unbind: function(el: any) {
                document.body.removeEventListener('click', el.clickOutsideEvent);
            },
        },
    },
})
export default class TheSideBar extends Vue {
    private activeLinkName = 'Dashboard';
    private previousLinkName = '';
    private showSubMenu = false;
    private links: Array<SideNavLink> = [
        {
            routeName: 'Dashboard',
            title: 'Dashboard',
            inactiveIcon: inactiveDashboardIcon,
            activeIcon: activeDashboardIcon,
            subLinks: [],
            isHovering: false,
        },
        {
            routeName: 'Donations',
            subLinks: [
                {
                    icon: '',
                    routeName: 'NewDonation',
                    title: 'New Donation',
                },
                {
                    icon: '',
                    routeName: 'Pledges',
                    title: 'Pledges',
                },
                {
                    icon: '',
                    routeName: 'DonationSchemes',
                    title: 'Donation Schemes',
                },
                {
                    icon: '',
                    routeName: 'DonatedItems',
                    title: 'Donated Items',
                },
                {
                    icon: '',
                    routeName: 'Donors',
                    title: 'Donors',
                },
                {
                    icon: '',
                    routeName: 'Donations',
                    title: 'Donations Dashboard',
                },
            ],
            title: 'Donations',
            inactiveIcon: inactiveDonationsIcon,
            activeIcon: activeDonationsIcon,
            isHovering: false,
        },
        {
            routeName: 'Sales',
            subLinks: [
                {
                    icon: '',
                    routeName: 'RecordSale',
                    title: 'Record Sale',
                },
                {
                    icon: '',
                    routeName: 'PriceQuotation',
                    title: 'Price Quotation',
                },
                {
                    icon: '',
                    routeName: 'Customers',
                    title: 'Customers',
                },
                {
                    icon: '',
                    routeName: 'Products',
                    title: 'Products',
                },
                {
                    icon: '',
                    routeName: 'Sales',
                    title: 'Sales Dashboard',
                },
            ],
            title: 'Sales',
            inactiveIcon: inactiveSalesIcon,
            activeIcon: activeSalesIcon,
            isHovering: false,
        },
        {
            routeName: 'Expenses',
            title: 'Expenses',
            inactiveIcon: inactiveSpendingIcon,
            activeIcon: activeSpendingIcon,
            isHovering: false,
            subLinks: [
                /*{
                     icon: '',
                     routeName: 'QuickExpense',
                     title: 'Quick Expense',
                },*/
                {
                    icon: '',
                    routeName: 'RecordExpense',
                    title: 'Record Expense',
                },
                /*{
                     icon: '',
                     routeName: 'RecordExpense',
                    title: 'Batch Expense',
                },*/
                {
                    icon: '',
                    routeName: 'Salaries-Commissions',
                    title: 'Pay Salaries & Commissions',
                },
                {
                    icon: '',
                    routeName: 'Vendors',
                    title: 'Vendors',
                },
                {
                    icon: '',
                    routeName: 'Expenses',
                    title: 'Expense Dashboard',
                },
            ],
        },
        {
            routeName: 'Inventory',
            title: 'Inventory',
            inactiveIcon: inactiveSalesIcon,
            activeIcon: activeSalesIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'InventoryDashboard',
                    title: 'Inventory Dashboard',
                },
            ],
        },
        {
            routeName: 'Banking',
            title: 'Banking',
            inactiveIcon: inactiveBankingIcon,
            activeIcon: activeBankingIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'AddBank',
                    title: 'Add Bank Account',
                },
                {
                    icon: '',
                    routeName: 'FundTransfer',
                    title: 'Transfer Funds',
                },
                {
                    icon: '',
                    routeName: 'Banking',
                    title: 'Banking Dashboard',
                },
            ],
        },
        {
            routeName: 'Financing',
            title: 'Financing',
            inactiveIcon: inactiveFinancingIcon,
            activeIcon: activeFinancingIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'AddLoan',
                    title: 'Add Loan',
                },
                {
                    icon: '',
                    routeName: 'AddCapital',
                    title: 'Add Capital',
                },
                {
                    icon: '',
                    routeName: 'Financing',
                    title: 'Financing Dashboard',
                },
            ],
        },
        {
            routeName: 'Payroll',
            title: 'Payroll',
            inactiveIcon: inactivePayrollIcon,
            activeIcon: activePayrollIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'AddEmployee',
                    title: 'Add Employee',
                },
            ],
        },
        {
            routeName: 'TaxAndRemittance',
            title: 'Taxes & Remitances',
            inactiveIcon: inactiveTaxAndRemittanceIcon,
            activeIcon: activeTaxAndRemittanceIcon,
            subLinks: [
                {
                    title: 'Record Paid Tax',
                    icon: '',
                    routeName: 'RecordPaidTax',
                },
                {
                    icon: '',
                    routeName: 'ValidateTaxProfile',
                    title: 'Validate Tax Profile',
                },
                {
                    icon: '',
                    routeName: 'ViewTaxLiabilities',
                    title: 'View Tax Liabilities',
                },
            ],
            isHovering: false,
        },
        {
            routeName: 'Reports',
            title: 'Reports',
            inactiveIcon: inactiveReportsIcon,
            activeIcon: activeReportsIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'BalanceSheetReports',
                    title: this.$root.businessIsANgo ? 'Statement of Financial Position' : 'Balance Sheet',
                },
                {
                    icon: '',
                    routeName: 'ProfitAndLossStatement',
                    title: this.$root.businessIsANgo ? 'Statement of Activities' : 'Income Statement',
                },
            ],
        },
        {
            routeName: 'Settings',
            title: 'Settings',
            inactiveIcon: inactiveSettingsIcon,
            activeIcon: activeSettingsIcon,
            isHovering: false,
            subLinks: [
                {
                    icon: '',
                    routeName: 'UserProfile',
                    title: 'My Profile',
                },
                {
                    icon: '',
                    routeName: 'ViewUsers',
                    title: 'Other Users',
                },
                {
                    icon: '',
                    routeName: 'TaxSettings',
                    title: 'Tax Setup',
                },
            ],
        },
        {
            routeName: '',
            title: 'Log out',
            inactiveIcon: inactiveLogoutIcon,
            activeIcon: activeLogoutIcon,
            isHovering: false,
            subLinks: [],
        },
    ];

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
            routeName: 'RecordExpense',
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
            routeName: 'RecordExpense',
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
    private authenticatedUser: any = {};
    private companyName = '';
    private navigationClicked = false;
    private hiddenLinks: Array<string> = ['Inventory', 'Payroll'];

    public $root!: VueExtension;

    get displayLinks(): Array<SideNavLink> {
        if (process.env.NODE_ENV === 'development') return this.links;

        if (this.$root.businessIsANgo) {
            return this.links.filter((link: SideNavLink) => !this.hiddenLinks.includes(link.routeName));
        }

        return this.links.filter(
            (link: SideNavLink) => link.routeName !== 'Donations' && !this.hiddenLinks.includes(link.routeName),
        );
    }

    public showLogoutText(link: SideNavLink) {
        // if logout link is to be displayed on sidebar
        return link.title === 'Log out' && this.$root.isMobileScreenSize;
    }

    public handleMenuClick(link: SideNavLink) {
        // the previous link name will be the active name when a menu is clicked
        this.previousLinkName = this.activeLinkName;

        this.activeLinkName = link.routeName; // highlight the active link

        // if the route is the logout option (it does not have a routeName)
        if (!this.activeLinkName) {
            AuthenticationService.logoutUser();
            return;
        }

        if (link.subLinks) {
            if (link.subLinks.length > 0) {
                // if there are sub links and the route is some other route, it means the submenu is open.
                // close the previous submenu and open the current one
                if (!this.isRouteTheSame(link)) {
                    this.showSubMenu = false;
                    this.showSubMenu = true;
                } else this.showSubMenu = !this.showSubMenu; //toggle sub menu
            } else this.processClickOnMenuWithoutSubmenu(link);
        } else this.processClickOnMenuWithoutSubmenu(link);
    }

    public processClickOnMenuWithoutSubmenu(link: SideNavLink) {
        this.showSubMenu = false; //close any open sub menu

        if (!this.isRouteTheSame(link)) this.$router.push({ name: link.routeName });
        else this.reloadCurrentRoute();
    }

    public handleMouseHover(link: SideNavLink) {
        link.isHovering = true; // highlight the active link
    }

    public handleMouseLeave(link: SideNavLink) {
        link.isHovering = false;
    }

    public isRouteTheSame(link: SideNavLink | SubLink) {
        // if there are no sublinks, the routename is compared with the url name e.g /new-donation
        if (!ensureObjectHasValue((link as SideNavLink).subLinks).length) {
            return this.$route.name === link.routeName;
        }
        // if there are sublinks, the previous linkname is compared with the link name that was picked
        return this.activeLinkName === this.previousLinkName;
    }

    public thereIsAtLeastOneSubLink(link: SideNavLink) {
        return ensureObjectHasValue(link.subLinks).length > 0;
    }

    public conditionsForChevronRightToAppear(link: SideNavLink) {
        return this.thereIsAtLeastOneSubLink(link) && !this.$root.isMobileScreenSize;
    }

    public isCurrentNavigationTheActiveLink(link: SideNavLink) {
        return this.activeLinkName === link.routeName;
    }

    public conditionsForChevronDownToAppear(link: SideNavLink) {
        return (
            this.thereIsAtLeastOneSubLink(link) &&
            (!this.isCurrentNavigationTheActiveLink(link) ||
                (this.isCurrentNavigationTheActiveLink(link) && !this.showSubMenu)) &&
            this.$root.isMobileScreenSize
        );
    }

    public conditionsForChevronUpToAppear(link: SideNavLink) {
        return (
            this.thereIsAtLeastOneSubLink(link) &&
            this.isCurrentNavigationTheActiveLink(link) &&
            this.$root.isMobileScreenSize &&
            this.showSubMenu
        );
    }
    public conditionsForMediumScreenSizedSubmenuToShow(link: SideNavLink) {
        return (
            this.thereIsAtLeastOneSubLink(link) &&
            this.showSubMenu &&
            this.isCurrentNavigationTheActiveLink(link) &&
            !this.$root.isMobileScreenSize
        );
    }

    public handleSubmenuClick(submenuLink: SubLink) {
        if (!this.isRouteTheSame(submenuLink)) {
            this.$router.push({ name: submenuLink.routeName });
            this.hideSubmenu();
        }
        // this is to prevent console error that occurs when the same route is clicked
        else this.reloadCurrentRoute();
    }

    public handleMobileSubmenuClick(submenuLink: SubLink) {
        if (!this.isRouteTheSame(submenuLink)) {
            this.$router.push({ name: submenuLink.routeName });
            this.closeSidebarMobileMenu();
        } else this.reloadCurrentRoute();
    }

    public hideSubmenu() {
        this.showSubMenu = false;
    }

    private reloadCurrentRoute() {
        window.location.reload();
    }

    public closeSidebarMobileMenu() {
        this.$emit('close-sidebar-button-clicked');
    }

    mounted() {
        this.navigationClicked = false;
        this.authenticatedUser = SessionStorageService.decodeToken();
        const { businessName } = this.authenticatedUser;
        this.companyName = businessName;
        const activeLink = this.subLinks.find(sublink => this.$route.name === sublink.routeName);
        if (activeLink) {
            this.activeLinkName = activeLink.parentNavigation;
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/layout/the-sidebar';
</style>
