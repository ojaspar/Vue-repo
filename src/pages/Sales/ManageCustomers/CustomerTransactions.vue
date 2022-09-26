<template>
    <b-container fluid class="customer-transactions">
        <MobileHeader :customerName="customerName" />

        <div class="customer-transactions__top-section">
            <TransactionStatsCards
                :firstStats="firstStatsDetails"
                :secondStats="secondStatsDetails"
                :showSecondStats="transactionCardDetails.length > 1"
            />
        </div>

        <b-row class="customer-transactions__button-container">
            <BasePrimaryButton
                buttonText="New Sale"
                :overRideButtonClass="true"
                className="customer-transactions__button"
                @button-clicked="goToRecordNewSalePage"
            />
        </b-row>

        <!-- Search, Dates, Add New Expense-->
        <TransactionMidSection
            :searchStringValue="transactionsSearchString"
            searchInputPlaceholder="Search"
            buttonName="New Sale"
            @search-input-changed="updateTransactionsSearchString"
            @button-clicked="goToRecordNewSalePage"
            @from-date-filter-has-changed="setFromDateFilter"
            @to-date-filter-has-changed="setToDateFilter"
        />

        <div class="customer-transactions__table">
            <transition name="fade" mode="out-in" appear>
                <TransactionTable
                    :transactions="transactionsToBeDispslayed"
                    :searchMatchFound="searchMatchFound"
                    :requestStatus="customerRequest.getCustomerTransactions"
                />
            </transition>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TransactionTable from '@/pages/Sales/ManageCustomers/CustomerTransactionTable.vue';

import UtilityMixins from '@/mixins/Utility';
import CustomerModule from '@/store/modules/customer';

import { CustomerTransaction } from '@/pages/Sales/ManageCustomers/types';
import {
    VueExtension,
    CustomerRequest,
    TransactionStatsCard,
    TransactionCardDetails,
    defaultTransactionCard,
} from '@/types';

const customers = namespace('customer');
let customerModule: CustomerModule;

@Component({ components: { TransactionTable } })
export default class CustomerTransactions extends Mixins(UtilityMixins) {
    public $root!: VueExtension;

    private customerName = '';

    private transactionsSearchString = '';

    private fromDate = '';

    private toDate = '';

    @customers.State
    private customerRequest!: CustomerRequest;

    @customers.State
    private customerTransactions!: CustomerTransaction[];

    @customers.State
    private transactionCardDetails!: TransactionCardDetails[];

    get transactionsSearchStringIsEmpty() {
        return this.transactionsSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.transactionsSearchStringIsEmpty) return true;
        if (!this.transactionsSearchStringIsEmpty && this.customerTransactions.length < 1) return true;
        return this.customerTransactions.length > 0 && this.transactionsToBeDispslayed.length > 0;
    }

    get datesSelected() {
        return this.fromDate !== '' || this.toDate !== '';
    }

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

    get dateFilteredTransactions(): CustomerTransaction[] {
        return this.customerTransactions.filter(transaction => {
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

    get transactionListToFilter(): CustomerTransaction[] {
        if (this.datesSelected) {
            return this.dateFilteredTransactions;
        }
        return this.customerTransactions;
    }

    get transactionsToBeDispslayed(): CustomerTransaction[] {
        if (this.transactionsSearchStringIsEmpty && !this.datesSelected) {
            return this.customerTransactions;
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

    private goToRecordNewSalePage() {
        this.$router.push({ name: 'RecordSale' });
    }

    private setCustomerName(name: string) {
        this.customerName = name;
    }

    private checkCustomerDetails() {
        const { customerKey, name } = this.$route.params;
        if (!customerKey || !name) {
            this.$router.push({ name: 'Customers' });
            return;
        }
        this.setCustomerName(name);
        this.getCustomerTransactions(customerKey);
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Customer Transactions');
    }

    private async getCustomerTransactions(customerKey: string) {
        await Promise.all([
            customerModule.getTransactionCardDetails(customerKey),
            customerModule.getTransactions(customerKey),
        ]);
    }

    created() {
        customerModule = getModule(CustomerModule, this.$store);
        this.checkCustomerDetails();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/customer-transactions';
</style>
