<template>
    <b-container fluid class="vendor-transactions">
        <MobileHeader :customerName="vendorName" />

        <div class="vendor-transactions__top-section">
            <TransactionStatsCards
                :firstStats="firstStatsDetails"
                :secondStats="secondStatsDetails"
                :showSecondStats="transactionCardDetails.length > 1"
            />
        </div>

        <b-row class="vendor-transactions__button-container">
            <BasePrimaryButton
                buttonText="New Expense"
                :overRideButtonClass="true"
                className="vendor-transactions__new-expense-btn"
                @button-clicked="goToExpensePage"
            />
        </b-row>

        <!-- Search, Dates, Add New Expense-->
        <TransactionMidSection
            :searchStringValue="transactionsSearchString"
            searchInputPlaceholder="Search"
            buttonName="New Expense"
            @search-input-changed="updateTransactionsSearchString"
            @button-clicked="goToExpensePage"
            @from-date-filter-has-changed="setFromDateFilter"
            @to-date-filter-has-changed="setToDateFilter"
        />

        <div class="vendor-transactions__table">
            <transition name="fade" mode="out-in" appear>
                <TransactionTable
                    :transactions="transactionsToBeDispslayed"
                    :searchMatchFound="searchMatchFound"
                    :requestStatus="vendorRequestStatus.getTransactions"
                />
            </transition>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { VueExtension, TransactionStatsCard, TransactionCardDetails, defaultTransactionCard } from '@/types';
import { VendorTransaction } from '@/pages/Spending/Expense/ManageVendors/types';
import { VendorRequestStatus } from '@/pages/Spending/Expense/types';

import TransactionTable from '@/pages/Spending/Expense/ManageVendors/VendorTransactionTable.vue';
import UtilityMixins from '@/mixins/Utility';

import VendorModule from '@/store/modules/vendor';

const vendor = namespace('vendor');
let vendorModule: VendorModule;

@Component({ components: { TransactionTable } })
export default class VendorTransactions extends Mixins(UtilityMixins) {
    public $root!: VueExtension;

    private transactionsSearchString = '';

    private fromDate = '';

    private toDate = '';

    private vendorName = '';

    @vendor.State
    private vendorRequestStatus!: VendorRequestStatus[];

    @vendor.State
    private transactionCardDetails!: TransactionCardDetails[];

    @vendor.State
    private vendorTransactions!: VendorTransaction[];

    get firstStatsDetails(): TransactionStatsCard {
        const cardDetails = this.transactionCardDetails[0] || { ...defaultTransactionCard };
        const prepaymentAmount = this.$options.filters.amountWithCurrency(cardDetails.prepayment);
        const balanceAmount = this.$options.filters.amountWithCurrency(cardDetails.balanceOwed);
        return {
            firstCardHeader: 'Prepayment',
            firstCardBody: prepaymentAmount,
            secondCardHeader: 'Balance Owed',
            secondCardBody: balanceAmount,
        };
    }

    get secondStatsDetails(): TransactionStatsCard {
        const cardDetails = this.transactionCardDetails[1] || { ...defaultTransactionCard };
        const prepaymentAmount = this.$options.filters.amountWithCurrency(cardDetails.prepayment);
        const balanceAmount = this.$options.filters.amountWithCurrency(cardDetails.balanceOwed);
        return {
            firstCardHeader: 'Prepayment',
            firstCardBody: prepaymentAmount,
            secondCardHeader: 'Balance Owed',
            secondCardBody: balanceAmount,
        };
    }

    get transactionsSearchStringIsEmpty() {
        return this.transactionsSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.transactionsSearchStringIsEmpty) return true;
        if (!this.transactionsSearchStringIsEmpty && this.vendorTransactions.length < 1) return true;
        return this.vendorTransactions.length > 0 && this.transactionsToBeDispslayed.length > 0;
    }

    get datesSelected() {
        return this.fromDate !== '' || this.toDate !== '';
    }

    get dateFilteredTransactions(): VendorTransaction[] {
        return this.vendorTransactions.filter(transaction => {
            if (this.fromDate && !this.toDate) {
                return new Date(transaction.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(transaction.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(transaction.transactionDate) >= new Date(this.fromDate) &&
                    new Date(transaction.transactionDate) <= new Date(this.toDate)
                );
            }
            return transaction;
        });
    }

    get transactionListToFilter(): VendorTransaction[] {
        if (this.datesSelected) {
            return this.dateFilteredTransactions;
        }
        return this.vendorTransactions;
    }

    get transactionsToBeDispslayed(): VendorTransaction[] {
        if (this.transactionsSearchStringIsEmpty && !this.datesSelected) {
            return this.vendorTransactions;
        }
        if (this.transactionsSearchStringIsEmpty && this.datesSelected) {
            return this.dateFilteredTransactions;
        }

        //search all transactions' details for a match
        return this.transactionListToFilter.filter(transaction => {
            const values = Object.values(transaction);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.transactionsSearchString.toLowerCase());
            });
        });
    }

    private updateTransactionsSearchString(searchString: string) {
        this.transactionsSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private goToExpensePage() {
        this.$router.push({ name: 'RecordExpense' });
    }

    private setVendorName(name: string) {
        this.vendorName = name;
    }

    private checkVendorDetails() {
        const { vendorKey, name } = this.$route.params;
        if (!vendorKey || !name) {
            this.$router.push({ name: 'Vendors' });
            return;
        }
        this.setVendorName(name);
        this.getVendorTransactions(vendorKey);
    }

    private async getVendorTransactions(vendorKey: string) {
        await Promise.all([vendorModule.getTransactionCardDetails(vendorKey), vendorModule.getTransactions(vendorKey)]);
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Vendor Transactions');
    }

    created() {
        vendorModule = getModule(VendorModule, this.$store);
        this.emitMobilePageTitle();
        this.checkVendorDetails();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/vendor-transactions';
</style>
