<template>
    <b-row class="finance-statement-card">
        <b-col sm="6" cols="12" class="finance-statement-card__loan-details">
            <p class="finance-statement-card__first-header">Total Loan</p>
            <p class="finance-statement-card__first-body" v-if="cardDetails.totalOutstandingLoan">
                {{ cardDetails.totalOutstandingLoan | amountWithCurrency }}
            </p>
            <p class="finance-statement-card__first-body" v-else>0</p>

            <!--p class="finance-statement-card__second-header">Next Repayment Amount</p>
            <p class="finance-statement-card__second-body" v-if="cardDetails.nextRepaymentAmount">
                {{ cardDetails.nextRepaymentAmount | amountWithCurrency }}
            </p>
            <p class="finance-statement-card__second-body" v-else>0</p -->

            <p class="finance-statement-card__second-header">Next Repayment Date</p>
            <p class="finance-statement-card__text mt-1" v-if="cardDetails.nextRepaymentDate">
                {{ cardDetails.nextRepaymentDate | monthDateYearFormat }}
            </p>
        </b-col>

        <b-col class="finance-statement-card__capital-details">
            <p class="finance-statement-card__first-header">Capital</p>
            <p class="finance-statement-card__first-body" v-if="cardDetails.totalCapitalAmount">
                {{ cardDetails.totalCapitalAmount | amountWithCurrency }}
            </p>
            <p class="finance-statement-card__first-body" v-else>0</p>

            <p class="finance-statement-card__second-header">Contributors</p>
            <p class="finance-statement-card__second-body">{{ cardDetails.shareholderCount }}</p>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { FinanceDasbhboardCard, defaultDashboardCard } from '@/pages/Financing/types';

@Component
export default class FinanceStatementCard extends Vue {
    @Prop({ default: () => defaultDashboardCard }) readonly cardDetails!: FinanceDasbhboardCard;
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/statement-card';
</style>
