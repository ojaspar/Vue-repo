<template>
    <div>
        <div class="loan-details-cards__desktop-view" v-for="(loan, index) in loanDetailsCard" :key="index">
            <div class="loan-details-cards__left">
                <div class="loan-details-cards__content--left">
                    <p>Lender</p>
                    <p>Principal</p>
                    <p>Interest</p>
                    <p>Loan Date</p>
                </div>
                <div class="loan-details-cards__content--right">
                    <p>{{ loan.lender }}</p>
                    <p>{{ loan.principal | amountWithCurrency }}</p>
                    <p>{{ loan.interest | amountWithCurrency }}</p>
                    <p>
                        <img src="@/assets/img/calendar-grey.svg" />
                        {{ loan.loanDate | monthDateYearFormat }}
                    </p>
                </div>
            </div>
            <div class="loan-details-cards__right">
                <div class="loan-details-cards__content--left">
                    <p>Amount Outstanding</p>
                    <p>Next Due Date</p>
                </div>
                <div class="loan-details-cards__content--right">
                    <p>{{ loan.amountOutstanding | amountWithCurrency }}</p>
                    <p v-if="loan.nextRepaymentDate">
                        <img src="@/assets/img/calendar-grey.svg" />
                        {{ loan.nextRepaymentDate | monthDateYearFormat }}
                    </p>
                </div>
            </div>
        </div>

        <div class="loan-details-cards__mobile-view" v-for="(loan, index) in loanDetailsCard" :key="index + 1">
            <div class="loan-details-cards__content--left">
                <p>Lender</p>
                <p>Principal</p>
                <p>Interest</p>
                <p>Loan Date</p>
                <p>Amount Outstanding</p>
                <p>Next Due Date</p>
            </div>
            <div class="loan-details-cards__content--right">
                <p>{{ loan.lender }}</p>
                <p>{{ loan.principal | amountWithCurrency }}</p>
                <p>{{ loan.interest | amountWithCurrency }}</p>
                <p>
                    <img src="@/assets/img/calendar-grey.svg" />
                    {{ loan.loanDate | monthDateYearFormat }}
                </p>
                <p>{{ loan.amountOutstanding | amountWithCurrency }}</p>
                <p v-if="loan.nextRepaymentDate">
                    <img src="@/assets/img/calendar-grey.svg" />
                    {{ loan.nextRepaymentDate | monthDateYearFormat }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { LoanCardDetails, defaultLoanCardDetails } from '@/pages/Financing/Loan/types';

@Component
export default class LoanDetailsCards extends Vue {
    @Prop({ default: () => defaultLoanCardDetails }) readonly loanDetailsCard!: LoanCardDetails;
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/loan-details-cards';
</style>
