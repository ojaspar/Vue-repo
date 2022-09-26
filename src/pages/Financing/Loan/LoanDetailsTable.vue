<template>
    <div>
        <!--Desktop Table-->
        <div class="loan-details-table__desktop-view">
            <b-row class="loan-details-table__heading" no-gutters>
                <b-col cols="5" class="loan-details-table__heading--text">
                    <span class="mr-5">#</span>
                    Payment Date
                </b-col>
                <b-col class="loan-details-table__heading--text">Amount Paid </b-col>
                <b-col class="loan-details-table__heading--text">Paid From </b-col>
            </b-row>
            <div v-if="paymentHistoryIsAvailable">
                <b-row
                    no-gutters
                    class="loan-details-table__content"
                    v-for="(loan, index) in paymentHistory"
                    :key="index"
                >
                    <b-col cols="5" class="loan-details-table__content--text">
                        <span class="mr-5">{{ index + 1 }}</span>
                        {{ loan.paymentDate | monthDateYearFormat }}
                    </b-col>
                    <b-col class="loan-details-table__content--text">{{ loan.amountPaid | amountWithCurrency }} </b-col>
                    <b-col class="loan-details-table__content--text">{{ loan.paidFrom }} </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" class="loan-details-table__content--loader">
                <Loader size="3" />
            </div>

            <div v-else cols="12" class="loan-details-table__content--empty">
                {{ emptyContentMessage }}
            </div>
        </div>

        <!--Mobile Table-->
        <span class="loan-details-table__mobile-header">Payment History</span>
        <div v-if="paymentHistoryIsAvailable">
            <div class="loan-details-table__mobile-view" v-for="(loan, index) in paymentHistory" :key="index">
                <div class="loan-details-table__content--left">
                    <p>Payment Date</p>
                    <p>Amount Paid</p>
                    <p>Paid From</p>
                </div>
                <div class="loan-details-table__content--right">
                    <p>{{ loan.paymentDate | monthDateYearFormat }}</p>
                    <p>{{ loan.amountPaid | amountWithCurrency }}</p>
                    <p>{{ loan.paidFrom }}</p>
                </div>
            </div>
        </div>
        <div v-else-if="requestIsLoading" class="loan-details-table__content--mobile-loader">
            <Loader size="2" />
        </div>

        <div v-else cols="12" class="loan-details-table__content--mobile-empty">
            {{ emptyContentMessage }}
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { LoanRepaymentHistory } from '@/pages/Financing/Loan/types';

@Component
export default class LoanDetailsTable extends Vue {
    @Prop({ default: () => [] }) readonly paymentHistory!: LoanRepaymentHistory[];
    @Prop({ default: 'NORMAL' }) readonly requestStatus!: string;

    get paymentHistoryIsAvailable() {
        return this.paymentHistory.length > 0;
    }

    get requestIsLoading() {
        return this.requestStatus == 'LOADING';
    }

    get emptyContentMessage() {
        return 'No repayment made';
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/loan-details-table';
</style>
