<template>
    <div class="quick-actions-container">
        <header class="quick-actions-container__header">
            <div class="quick-actions-container__search-container">
                <img
                    src="@/assets/img/search.svg"
                    alt="Search icon"
                    class="quick-actions-container__search-container--icon"
                />

                <BaseInputField
                    className="quick-actions-container__search-input"
                    placeholder="search quick actions"
                    inputContainerClass="quick-actions-container__search-input-container"
                    v-model="searchInput"
                />
            </div>

            <img
                src="@/assets/img/navbar/close-button-blue.svg"
                alt="Close Button"
                @click="closeOptions"
                class="quick-actions-container__close-button pointer"
            />
        </header>

        <section class="quick-actions__no-match-found" v-show="thereAreNoMatches">
            Sorry, no match found
        </section>

        <div class="quick-actions__row--frequent" v-show="thereAreFrequentlyUsedMatches">
            <p class="quick-actions__category">Frequently Used</p>
            <div class="quick-actions__frequently-used">
                <div
                    v-for="action in frequentlyUsed"
                    :key="action.text"
                    class="quick-actions__action"
                    @click="goToRoute(action.routeName)"
                >
                    <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                    <p class="quick-actions__name">{{ action.text }}</p>
                </div>
            </div>
        </div>

        <section class="quick-actions__modules">
            <div class="quick-actions__row--others" v-show="thereAreSalesMatches">
                <p class="quick-actions__category">sales</p>
                <div class="quick-actions">
                    <div
                        v-for="action in sales"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreBankingMatches">
                <p class="quick-actions__category">banking</p>
                <div class="quick-actions">
                    <div
                        v-for="action in banking"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreExpenseMatches">
                <p class="quick-actions__category">expense</p>
                <div class="quick-actions">
                    <div
                        v-for="action in expense"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreFinancingMatches">
                <p class="quick-actions__category">financing</p>
                <div class="quick-actions">
                    <div
                        v-for="action in financing"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" :class="productionHideClass" v-show="thereAreInventoryMatches">
                <p class="quick-actions__category">inventory</p>
                <div class="quick-actions">
                    <div
                        v-for="action in inventory"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreTaxMatches">
                <p class="quick-actions__category">tax</p>
                <div class="quick-actions">
                    <div
                        v-for="action in tax"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreReportMatches">
                <p class="quick-actions__category">report</p>
                <div class="quick-actions">
                    <div
                        v-for="action in report"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions__row--others" v-show="thereAreSettingsMatches">
                <p class="quick-actions__category">settings</p>
                <div class="quick-actions">
                    <div
                        v-for="action in settings"
                        :key="action.text"
                        class="quick-actions__action"
                        @click="goToRoute(action.routeName)"
                    >
                        <img :src="action.icon" :alt="action.text" class="quick-actions__action--icon" />
                        <p class="quick-actions__name">{{ action.text }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { MenuItem } from '@/types';

@Component
export default class QuickActions extends Vue {
    @Prop({ default: 'Notification' }) readonly title!: string;

    private searchInput = '';

    get frequentlyUsed() {
        const options: Array<MenuItem> = [
            {
                text: 'Record Expense',
                routeName: 'RecordExpense',
                icon: require('@/assets/img/quick-actions/record-expense.svg'),
            },
            { text: 'Record Sale', routeName: 'RecordSale', icon: require('@/assets/img/quick-actions/new-entry.svg') },
            {
                text: 'Create Quotation',
                routeName: 'PriceQuotation',
                icon: require('@/assets/img/quick-actions/quotation.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get pathname() {
        return window.location.host;
    }

    get productionHideClass() {
        if (window.location.host.startsWith('app.mzuri.ng')) return 'd-none';
        return '';
    }

    get sales() {
        const options: Array<MenuItem> = [
            { text: 'Sales Dashboard', routeName: 'Sales', icon: require('@/assets/img/quick-actions/sales.svg') },
            { text: 'Record Sale', routeName: 'RecordSale', icon: require('@/assets/img/quick-actions/new-entry.svg') },
            {
                text: 'Create Quotation',
                routeName: 'PriceQuotation',
                icon: require('@/assets/img/quick-actions/quotation.svg'),
            },
            { text: 'Products', routeName: 'Products', icon: require('@/assets/img/quick-actions/products.svg') },
            { text: 'Customers', routeName: 'Customers', icon: require('@/assets/img/quick-actions/customer.svg') },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get expense() {
        const options: Array<MenuItem> = [
            {
                text: 'Expense Dashboard',
                routeName: 'Expenses',
                icon: require('@/assets/img/quick-actions/expense.svg'),
            },
            {
                text: 'Record Expense',
                routeName: 'RecordExpense',
                icon: require('@/assets/img/quick-actions/record-expense.svg'),
            },
            // { text: 'Expense Items', routeName: '', icon: require('@/assets/img/quick-actions/expense-item.svg') },
            {
                text: 'Salary / Commission',
                routeName: 'Salaries-Commissions',
                icon: require('@/assets/img/quick-actions/salaries.svg'),
            },
            { text: 'Vendors', routeName: 'Vendors', icon: require('@/assets/img/quick-actions/vendor.svg') },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get inventory() {
        const options: Array<MenuItem> = [
            {
                text: 'Inventory Dashboard',
                routeName: 'InventoryDashboard',
                icon: require('@/assets/img/quick-actions/stock.svg'),
            },
            {
                text: 'Add Stock item',
                routeName: '',
                icon: require('@/assets/img/quick-actions/add-stock.svg'),
            },
            { text: 'Materials', routeName: '', icon: require('@/assets/img/quick-actions/materials.svg') },
            {
                text: 'Migrate Existing Stock',
                routeName: '',
                icon: require('@/assets/img/quick-actions/migrate-stock.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get banking() {
        const options: Array<MenuItem> = [
            {
                text: 'Banking Dashboard',
                routeName: 'Banking',
                icon: require('@/assets/img/quick-actions/banking.svg'),
            },
            {
                text: 'Add Bank Account',
                routeName: 'AddBank',
                icon: require('@/assets/img/quick-actions/add-bank.svg'),
            },
            {
                text: 'Transfer Funds',
                routeName: 'FundTransfer',
                icon: require('@/assets/img/quick-actions/transfer.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get financing() {
        const options: Array<MenuItem> = [
            {
                text: 'Financing Dashboard',
                routeName: 'Financing',
                icon: require('@/assets/img/quick-actions/financing.svg'),
            },
            { text: 'Add Loan', routeName: 'AddLoan', icon: require('@/assets/img/quick-actions/add-loan.svg') },
            {
                text: 'Add Capital',
                routeName: 'AddCapital',
                icon: require('@/assets/img/quick-actions/add-capital.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get tax() {
        const options: Array<MenuItem> = [
            {
                text: 'Record Paid Tax',
                routeName: 'RecordPaidTax',
                icon: require('@/assets/img/quick-actions/record-tax.svg'),
            },
            {
                text: 'Tax Liabilities',
                routeName: 'TaxLiabilities',
                icon: require('@/assets/img/quick-actions/tax-liabilities.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get report() {
        const options: Array<MenuItem> = [
            {
                text: 'Income Statement',
                routeName: 'ProfitAndLossStatement',
                icon: require('@/assets/img/quick-actions/income-reports.svg'),
            },
            {
                text: 'Balance Sheet',
                routeName: 'BalanceSheetReports',
                icon: require('@/assets/img/quick-actions/balancesheet.svg'),
            },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get settings() {
        const options: Array<MenuItem> = [
            { text: 'My Profile', routeName: 'UserProfile', icon: require('@/assets/img/quick-actions/profile.svg') },
            { text: 'Other Users', routeName: 'ViewUsers', icon: require('@/assets/img/quick-actions/users.svg') },
            { text: 'Tax Setup', routeName: 'TaxSettings', icon: require('@/assets/img/quick-actions/tax-setup.svg') },
        ];

        return options.filter((item: MenuItem) => item.text.toLowerCase().includes(this.searchInput.toLowerCase()));
    }

    get thereAreNoMatches(): boolean {
        return (
            !this.thereAreFrequentlyUsedMatches &&
            !this.thereAreSalesMatches &&
            !this.thereAreSettingsMatches &&
            !this.thereAreReportMatches &&
            !this.thereAreTaxMatches &&
            !this.thereAreInventoryMatches &&
            !this.thereAreFinancingMatches &&
            !this.thereAreExpenseMatches &&
            !this.thereAreBankingMatches
        );
    }

    get thereAreFrequentlyUsedMatches(): boolean {
        return this.frequentlyUsed.length > 0;
    }
    get thereAreSalesMatches(): boolean {
        return this.sales.length > 0;
    }
    get thereAreExpenseMatches(): boolean {
        return this.expense.length > 0;
    }
    get thereAreInventoryMatches(): boolean {
        return this.inventory.length > 0;
    }
    get thereAreBankingMatches(): boolean {
        return this.banking.length > 0;
    }
    get thereAreFinancingMatches(): boolean {
        return this.financing.length > 0;
    }
    get thereAreTaxMatches(): boolean {
        return this.tax.length > 0;
    }
    get thereAreReportMatches(): boolean {
        return this.report.length > 0;
    }
    get thereAreSettingsMatches(): boolean {
        return this.settings.length > 0;
    }

    private closeOptions() {
        this.$emit('close');
    }

    private goToRoute(routeName: string) {
        this.$emit('navigate', routeName);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/quick-actions';
</style>
