<template>
    <div class="business-log">
        <div class="business-log__top pointer" @click="goToSalesDashboard">
            <div class="business-log__title">
                <span class="business-log__title--icon">
                    <img src="@/assets/img/sale-inflow-green.svg" />
                </span>
                <span class="business-log__title--text">Expected Inflow</span>
            </div>

            <div v-if="creditSaleExists">
                <div class="business-log__heading">
                    <div>
                        <p class="business-log__heading--text">Credit Sales</p>
                        <p>Past Due</p>
                        <p>Not Due</p>
                    </div>
                    <div class="business-log__right">
                        <p class="business-log__heading--text">
                            {{ totalCreditSales | amountWithCurrency }}
                        </p>
                        <p>{{ logDetails.expectedInflow.pastDue | amountWithCurrency }}</p>
                        <p>{{ logDetails.expectedInflow.notDue | amountWithCurrency }}</p>
                    </div>
                </div>
            </div>

            <div v-else class="business-log__top--empty">
                No expected inflow
            </div>
        </div>

        <div class="business-log__bottom pointer" @click="goToExpenseDashboard">
            <div class="business-log__title">
                <span class="business-log__title--icon">
                    <img src="@/assets/img/sale-inflow-orange.svg" />
                </span>
                <span class="business-log__title--text">Pending Obligations </span>
            </div>

            <div v-if="thereIsPendingObligation">
                <div class="business-log__heading" v-if="debtExists">
                    <div>
                        <p class="business-log__heading--text">Debts</p>
                        <p>Maturing Loans</p>
                        <p>Past Due Loans</p>
                    </div>
                    <div class="business-log__right">
                        <p class="business-log__heading--text">
                            {{ totalDebts | amountWithCurrency }}
                        </p>
                        <p>{{ logDetails.debts.maturingLoans | amountWithCurrency }}</p>
                        <p>{{ logDetails.debts.pastDueLoans | amountWithCurrency }}</p>
                    </div>
                </div>

                <div class="business-log__heading" v-if="creditPurchaseExists">
                    <div>
                        <p class="business-log__heading--text">Credit Purchases</p>
                        <p>Maturing</p>
                        <p>Past Due</p>
                    </div>
                    <div class="business-log__right">
                        <p class="business-log__heading--text">
                            {{ totalCreditPurchases | amountWithCurrency }}
                        </p>
                        <p>{{ logDetails.credit.maturingCredit | amountWithCurrency }}</p>
                        <p>{{ logDetails.credit.pastDueCredits | amountWithCurrency }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="business-log__bottom--empty">
                No pending obligations
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { MoneyObject } from '@/types';

export interface UserBusinessLog {
    expectedInflow: {
        pastDue: MoneyObject;
        notDue: MoneyObject;
    };
    debts: {
        maturingLoans: MoneyObject;
        pastDueLoans: MoneyObject;
    };
    credit: {
        maturingCredit: MoneyObject;
        pastDueCredits: MoneyObject;
    };
}

@Component
export default class BusinessLog extends Vue {
    @Prop({ required: true }) readonly logDetails!: UserBusinessLog;

    get totalCreditSales() {
        const { expectedInflow } = this.logDetails;
        const { currencyKey } = expectedInflow.pastDue;
        const amount = expectedInflow.pastDue.amount + expectedInflow.notDue.amount;
        return { amount, currencyKey };
    }

    get totalDebts() {
        const { debts } = this.logDetails;
        const { currencyKey } = debts.maturingLoans;
        const amount = debts.maturingLoans.amount + debts.pastDueLoans.amount;
        return { amount, currencyKey };
    }

    get totalCreditPurchases() {
        const { credit } = this.logDetails;
        const { currencyKey } = credit.pastDueCredits;
        const amount = credit.pastDueCredits.amount + credit.maturingCredit.amount;
        return { amount, currencyKey };
    }

    get creditSaleExists() {
        const { pastDue, notDue } = this.logDetails.expectedInflow;
        return pastDue.amount > 0 || notDue.amount > 0;
    }

    get debtExists() {
        const { maturingLoans, pastDueLoans } = this.logDetails.debts;

        return maturingLoans.amount > 0 || pastDueLoans.amount > 0;
    }

    get creditPurchaseExists() {
        const { maturingCredit, pastDueCredits } = this.logDetails.credit;

        return maturingCredit.amount > 0 || pastDueCredits.amount > 0;
    }

    get thereIsPendingObligation() {
        return this.debtExists || this.creditPurchaseExists;
    }

    private goToSalesDashboard() {
        this.$router.push({ name: 'Sales', query: { status: 'Pending Payment' } });
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses', query: { status: 'Pending Payment' } });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/main/business-log';
</style>
