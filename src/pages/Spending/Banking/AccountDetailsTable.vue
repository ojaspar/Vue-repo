<template>
    <div>
        <div class="cash-account-table" v-if="$root.isLargeScreenSize">
            <!-- Table Header-->
            <b-row class="cash-account-table__header">
                <b-col>Date</b-col>
                <b-col>Transaction Type</b-col>
                <b-col cols="4">Transaction Details</b-col>
                <b-col class="cash-account-table__amount">Amount</b-col>
            </b-row>

            <!-- Table Content, Desktop View-->
            <div v-if="transactionsAreAvailable">
                <b-row class="cash-account-table__content" v-for="(transaction, index) in transactions" :key="index">
                    <b-col> {{ transaction.transactionDate | monthDateYearFormat }} </b-col>
                    <b-col> {{ transaction.transactionType }} </b-col>
                    <b-col cols="4" v-if="transaction.transactionDetail"> {{ transaction.transactionDetail }} </b-col>
                    <b-col cols="4" v-else>
                        <span class="cash-account-table__content--empty">-</span>
                    </b-col>
                    <b-col :class="amountClass(transaction.amount.amount)">
                        {{ transaction.amount | amountWithCurrency }}
                    </b-col>
                </b-row>
            </div>
            <b-row v-else-if="status === 'LOADING'" class="cash-account-table__content--loding">
                <Loader />
            </b-row>
            <b-row class="cash-account-table__content--no-data" v-else>
                <span>{{ noContentMessage }}</span>
            </b-row>
        </div>

        <!-- Table Content, Mobile View-->
        <div v-else>
            <div v-if="transactionsAreAvailable">
                <div class="account-mobile-table" v-for="(transaction, index) in transactions" :key="index">
                    <b-row>
                        <b-col>
                            <p class="transaction__date">{{ transaction.transactionDate | monthDateYearFormat }}</p>
                        </b-col>
                    </b-row>
                    <b-row class="">
                        <b-col class="transaction">
                            <h3 class="transaction__type">{{ transaction.transactionType }}</h3>
                            <h3 :class="amountClass(transaction.amount.amount)">
                                {{ transaction.amount | amountWithCurrency }}
                            </h3>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <p class="transaction__details">{{ transaction.transactionDetail }}</p>
                        </b-col>
                    </b-row>
                </div>
            </div>
            <b-row v-else-if="status === 'LOADING'" class="cash-account-table__content--loding">
                <Loader />
            </b-row>
            <b-row class="cash-account-table__content--no-data" v-else>
                <span>{{ noContentMessage }}</span>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { AccountTransaction } from '@/pages/Spending/Banking/types';
import { VueExtension } from '@/types';

@Component
export default class AccountDetailsTable extends Vue {
    @Prop({ default: () => [] }) readonly transactions!: AccountTransaction[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;

    public $root!: VueExtension;

    private amountClass(amount: number): string {
        const baseClass = 'cash-account-table__amount';
        return amount < 0 ? `${baseClass}--deficit` : `${baseClass}--excess`;
    }

    get transactionsAreAvailable(): boolean {
        return this.transactions.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.transactionsAreAvailable) {
            return 'There are no transactions available';
        }
        return '';
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/cash-details-table';
</style>
