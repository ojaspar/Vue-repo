<template>
    <div>
        <!-- Table Rendered On Large Screens (xl-sm) -->
        <div class="banking-table desktop-table">
            <!-- Table Header-->
            <b-row class="banking-table__header">
                <b-col>Display Name</b-col>
                <b-col>Bank Name</b-col>
                <b-col>Account No.</b-col>
                <b-col class="banking-table__amount">Amount</b-col>
                <b-col cols="1"></b-col>
            </b-row>

            <!-- Table Content, Cash Account-->
            <div>
                <b-row
                    v-if="cashAccountIsAvailable"
                    title="Click to see account transactions"
                    class="banking-table__content pointer"
                    @click.stop="goToCashDetailsPage"
                >
                    <b-col> {{ cashAccount.displayName }} </b-col>
                    <b-col> - </b-col>
                    <b-col> - </b-col>
                    <b-col class="banking-table__amount">
                        {{ cashAccount.accountBalance | amountWithCurrency }}
                    </b-col>
                    <b-col cols="1" title="Transfer funds from this account" @click.stop="handleIconClick(cashAccount)">
                        <img src="@/assets/img/transfer.svg" />
                    </b-col>
                </b-row>
            </div>

            <!-- Table Content, Bank Account(s)-->
            <div v-if="bankAccountsAreAvailable">
                <b-row
                    class="banking-table__content"
                    title="Click to see account transactions"
                    v-for="(account, index) in bankAccounts"
                    :key="index"
                >
                    <!-- More Options-->
                    <font-awesome-icon
                        icon="ellipsis-v"
                        class="pointer mt-2"
                        title="More options"
                        @click.stop="toggleShowOptions(index)"
                        @mousedown="handleMouseDownEvent($event, index)"
                    /><b-col
                        cols="1"
                        tabindex="-1"
                        class="banking-table__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p
                            class="banking-table__content-action"
                            @click.stop="displayAccountOptionsActionModal(account, 'account-closure')"
                        >
                            Close Account
                        </p>
                        <p
                            class="banking-table__content-action"
                            @click.stop="displayAccountOptionsActionModal(account, 'account-overdraft')"
                        >
                            Add Overdraft
                        </p>
                        <p class="banking-table__content-action" @click.stop="goToBankDetailsPage(account)">
                            View Transactions
                        </p>
                    </b-col>

                    <b-col> {{ account.displayName }} </b-col>
                    <b-col> {{ account.bankName }} </b-col>
                    <b-col> {{ account.accountNumber }} </b-col>
                    <b-col class="banking-table__amount">{{ account.accountBalance | amountWithCurrency }} </b-col>
                    <b-col cols="1" title="Transfer funds from this account" @click.stop="handleIconClick(account)">
                        <img src="@/assets/img/transfer.svg" />
                    </b-col>
                </b-row>
            </div>
            <b-row v-else-if="fetchBanksRequestIsLoading" class="banking-table__content--loading">
                <Loader />
            </b-row>
        </div>

        <BaseModal
            :modalId="accountOptionsActionModal"
            :modalTitle="modalTitle"
            @hide-modal="hideAccountOptionActionModal"
        >
            <AccountOptionsActionForm :selectedAccount="selectedAccount" :selectedOption="selectedOption" />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import MobileMenu from '@/pages/Spending/Banking/MobileMenu.vue';
import AccountOptionsActionForm from '@/pages/Spending/Banking/AccountOptionsActionForm.vue';

import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

import { BankAccount, AccountOptions } from '@/pages/Spending/Banking/types';

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

@Component({ components: { MobileMenu, AccountOptionsActionForm } })
export default class BankingDashboardTable extends Mixins(BankingMixin) {
    @Prop({ default: () => defaultBankAccount }) readonly cashAccount!: BankAccount;
    @Prop({ default: () => defaultBankAccount }) readonly bankAccounts!: BankAccount[];
    @Prop({ default: false }) readonly fetchBanksRequestIsLoading!: string;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    private selectedAccount: BankAccount = { ...defaultBankAccount };
    private selectedOption = AccountOptions.CLOSURE;

    private accountOptionsActionModal = 'account-options-action-modal';

    get bankAccountsAreAvailable() {
        return this.bankAccounts.length > 0;
    }

    get cashAccountIsAvailable() {
        return this.cashAccount.displayName !== '';
    }

    get mobileBankAccounts() {
        return this.bankAccounts.slice(0, 3);
    }

    get modalTitle() {
        return this.selectedOption === AccountOptions.CLOSURE ? 'Close Bank Account' : 'Add Overdraft';
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    private handleMouseDownEvent(event: Event, index: string) {
        if (this.isSelectedOption(index)) {
            this.preventBlurFromHappening(event);
        }
    }

    private toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private displayAccountOptionsActionModal(selectedAccount: BankAccount, selectedOption: AccountOptions) {
        this.selectedAccount = selectedAccount;
        this.selectedOption = selectedOption;
        this.displayModal(this.accountOptionsActionModal);
    }

    private hideAccountOptionActionModal() {
        this.cancelModal(this.accountOptionsActionModal);
    }

    private handleIconClick(selectedAccount: BankAccount) {
        this.$emit('fund-transfer-icon-clicked', selectedAccount.bankAccountKey);
    }

    private goToCashDetailsPage() {
        this.$emit('go-to-cash-details-page', this.cashAccount, 'Cash');
    }

    private goToBankDetailsPage(accountDetails: BankAccount) {
        this.$emit('go-to-bank-details-page', accountDetails, 'Bank');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/banking-dashoard-table';
</style>
