<template>
    <div>
        <div>
            <TopSection
                :selectedAccount="selectedAccount"
                :accountType="accountType"
                :key="componentKey"
                @transfer-funds-from-account-details="preSelectSourceAccountForTransfer"
                @search-input-changed="updateSearchString"
                @from-date-filter-has-changed="setFromDateFilter"
                @to-date-filter-has-changed="setToDateFilter"
                @edit-bank-details="$emit('edit-bank-details', $event)"
            />
            <AccountDetailsTable :transactions="transactionsToBeDisplayed" :searchMatchFound="searchMatchFound" />
        </div>
        <FundTransferModal
            v-if="showFundTransferModal"
            :modalId="fundTransferModalId"
            :isSourceAccountSelected="isSourceAccountSelected"
            :selectedSourceAccount="selectedSourceAccount"
            @fund-transfer-modal-hidden="hideFundTransferModal"
            @reset-selected-source-account="resetSelectedSourceAccount"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TopSection from '@/pages/Spending/Banking/AccountDetailsTopSection.vue';
import AccountDetailsTable from '@/pages/Spending/Banking/AccountDetailsTable.vue';
import FundTransferModal from '@/pages/Spending/Banking/FundTransferModal.vue';
import UtilityMixins from '@/mixins/Utility';
import BankModule from '@/store/modules/bank.ts';

import { BankAccount } from '@/pages/Spending/Banking/types';
import { AccountTransaction, BankRequest } from '@/pages/Spending/Banking/types';

import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

const bank = namespace('bank');
let bankModule: BankModule;

const defaultBankAccount: BankAccount = {
    bankAccountKey: '',
    bankName: '',
    displayName: '',
    accountName: '',
    accountNumber: '',
    accountBalance: {
        currencyKey: 0,
        amount: 0,
    },
};

@Component({
    components: { TopSection, AccountDetailsTable, FundTransferModal },
})
export default class AccountDetailsPage extends Mixins(BankingMixin, UtilityMixins) {
    @Prop({ default: '' }) readonly accountType!: string;
    @Prop({ default: () => defaultBankAccount }) readonly selectedAccount!: BankAccount;
    @Prop({ default: 0 }) readonly componentKey!: number;

    private showFundTransferModal = false;
    private fundTransferModalId = 'second-transfer-modal';

    private isSourceAccountSelected = true;
    private selectedSourceAccount = '';

    private searchString = '';
    private fromDate = '';
    private toDate = '';

    @bank.State
    public bankRequest!: BankRequest;

    @bank.State
    public accountTransactions!: AccountTransaction[];

    @bank.State
    public error!: string;

    @bank.Action
    public getPaymentAccountsTransactions!: () => Array<AccountTransaction>;

    get getPaymentAccountRequest() {
        return this.bankRequest.getTransactions;
    }

    get searchMatchFound() {
        if (this.searchStringIsEmpty) return true;
        if (!this.searchStringIsEmpty && this.accountTransactions.length < 1) return true;
        return this.accountTransactions.length > 0 && this.transactionsToBeDisplayed.length > 0;
    }

    get transactionsToBeDisplayed(): AccountTransaction[] {
        if (!this.searchString && this.datesNotSelected) return this.accountTransactions;

        //search all cash account's details for a match
        return this.transactionsToFilter.filter(account => {
            const values = Object.values(account);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get dateFilteredTransactions(): AccountTransaction[] {
        return this.accountTransactions.filter(transaction => {
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

    get transactionsToFilter(): AccountTransaction[] {
        if (this.datesNotSelected) {
            return this.accountTransactions;
        }
        return this.dateFilteredTransactions;
    }

    get datesNotSelected() {
        return this.fromDate === '' && this.toDate === '';
    }

    get searchStringIsEmpty() {
        return this.searchString.length == 0;
    }

    private displayFundTransferModal() {
        this.showFundTransferModal = true;
        this.$nextTick(() => {
            this.$bvModal.show(this.fundTransferModalId);
        });
    }

    private preSelectSourceAccountForTransfer(selectedAccount: string) {
        this.isSourceAccountSelected = true;
        this.selectedSourceAccount = selectedAccount;
        if (this.userIsOnMobile) {
            this.$emit('preselect-account-for-fund-transfer', selectedAccount);
            return;
        }
        this.displayFundTransferModal();
    }

    private resetSelectedSourceAccount() {
        this.isSourceAccountSelected = false;
        this.selectedSourceAccount = '';
    }

    private hideFundTransferModal() {
        this.showFundTransferModal = false;
        this.$bvModal.hide(this.fundTransferModalId);
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.$nextTick(() => {
            this.fromDate = date;
        });
    }

    private setToDateFilter(date: string) {
        this.$nextTick(() => {
            this.toDate = date;
        });
    }

    private async getTransactions(accountKey: string) {
        await bankModule.getPaymentAccountTransactions(accountKey);
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        this.getTransactions(this.selectedAccount.bankAccountKey);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/account-details-top-section';
</style>
