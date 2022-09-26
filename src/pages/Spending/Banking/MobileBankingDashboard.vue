<template>
    <div class="mobile-banking-dashboard">
        <!-- Table Rendered On Mobile Screens (sm-xs) -->
        <div class="banking-mobile-table">
            <b-row class="banking-mobile-table__content">
                <div @click="goToCashDetailsPage">
                    <h3 class="banking-mobile-table__account-name">{{ cashAccount.displayName }}</h3>
                    <h3 class="banking-mobile-table__account-balance">
                        {{ cashAccount.accountBalance | amountWithCurrency }}
                    </h3>
                </div>
                <div @click="$emit('preselect-account-for-fund-transfer', cashAccount.bankAccountKey)">
                    <img src="@/assets/img/transfer.svg" />
                </div>
            </b-row>
            <div v-if="bankAccountsAreAvailable">
                <b-row class="banking-mobile-table__content" v-for="(account, index) in bankAccounts" :key="index">
                    <div @click="goToBankDetailsPage(account)">
                        <h3 class="banking-mobile-table__account-name">{{ account.displayName }}</h3>
                        <h3 class="banking-mobile-table__account-balance">
                            {{ account.accountBalance | amountWithCurrency }}
                        </h3>
                    </div>
                    <div @click="$emit('preselect-account-for-fund-transfer', account.bankAccountKey)">
                        <img src="@/assets/img/transfer.svg" />
                    </div>
                </b-row>
            </div>
            <b-row v-if="fetchBanksRequestIsLoading" class="banking-mobile-table__content--loading">
                <Loader />
            </b-row>

            <MobileMenu
                @add-bank-button-clicked="$parent.$emit('mobile-add-bank-button-clciked')"
                @fund-transfer-button-clicked="$parent.$emit('mobile-fund-transfer-button-clicked')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import MobileMenu from '@/pages/Spending/Banking/MobileMenu.vue';

import { BankAccount } from '@/pages/Spending/Banking/types';

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

@Component({ components: { MobileMenu } })
export default class MobileBankingDashboard extends Vue {
    @Prop({ default: () => defaultBankAccount }) readonly cashAccount!: BankAccount;
    @Prop({ default: () => defaultBankAccount }) readonly bankAccounts!: BankAccount[];
    @Prop({ default: false }) readonly fetchBanksRequestIsLoading!: boolean;

    get bankAccountsAreAvailable() {
        return this.bankAccounts.length > 0;
    }

    private cashAccountIsAvailable(cashAccount: BankAccount) {
        return cashAccount.displayName !== '';
    }

    private goToCashDetailsPage() {
        this.$emit('go-to-cash-details-page', this.cashAccount, 'Cash');
    }

    private goToBankDetailsPage(accountDetails: BankAccount) {
        this.$emit('go-to-bank-details-page', accountDetails, 'Bank');
    }

    @Watch('cashAccount')
    checkCashAccount(cashAccount: BankAccount) {
        if (this.cashAccountIsAvailable(cashAccount)) {
            this.$emit('reset-fetch-banks-request-status');
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/mobile-banking-dashoard';
</style>
