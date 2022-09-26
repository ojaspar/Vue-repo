<template>
    <div>
        <ReportWrapper
            :reportTitle="reportTitle"
            reportType="pl"
            @specifiedPeriodChanged="fetchReportsForSpecifiedPeriod"
            z
        >
            <template v-slot:report-items>
                <!-- Income -->
                <section class="reports__section">
                    <b-row class="table-row">
                        <b-col cols="8" />
                        <!-- <b-col class="reports__section-header m-0 mr-2 p-0 amount-col">
                            {{ `${defaultCurrency.currencyCode} (${defaultCurrency.currencySymbol})` }}
                        </b-col> -->
                        <b-col class="amount-col d-flex ml-0 justify-content-end">
                            {{ `${defaultCurrency.currencyCode} (${defaultCurrency.currencySymbol})` }}
                        </b-col>
                    </b-row>

                    <!-- <b-row class="table-row mb-4"> -->
                    <!-- <b-col></b-col> -->
                    <!-- <b-col class="reports__section-header m-0 mr-2 p-0 amount-col">{{ currentYear - 1 }}</b-col> -->
                    <!-- <b-col class="reports__section-header m-0 amount-col p-0">{{ currentYear }} </b-col> -->
                    <!-- <b-col class="reports__section-header amount-col">Variation (%)</b-col> -->
                    <!-- </b-row> -->

                    <TableRow :row="item" v-for="(item, index) in incomeItems" :key="`no-total-income-${index}`" />

                    <TableFooter
                        title="Total Income"
                        :previousAmount="previousTotalIncome"
                        :currentAmount="currentTotalIncome"
                    />

                    <template v-if="!$root.businessIsANgo">
                        <TableRow
                            :row="item"
                            v-for="(item, index) in costOfItemSoldWithLess"
                            :key="`income-items-${index}`"
                        />
                        <TableFooter
                            title="Gross Profit"
                            :previousAmount="previousGrossProfit"
                            :currentAmount="currentGrossProfit"
                        />
                    </template>
                </section>

                <!-- Expenses -->
                <section class="reports__section">
                    <p class="reports__section-header">Less Expenses</p>

                    <template v-if="$root.businessIsANgo">
                        <TableRow :row="item" v-for="(item, index) in costOfMaterials" :key="`expenses-${index}`" />
                    </template>

                    <TableRow :row="item" v-for="(item, index) in expenseItems" :key="`expenses-${index}`" />

                    <template v-if="$root.businessIsANgo">
                        <TableFooter
                            title="Total Expenses"
                            :previousAmount="previousTotalExpenseAndCostOfItemsSold"
                            :currentAmount="currentTotalExpenseAndCostOfItemsSold"
                        />
                    </template>
                    <template v-else>
                        <TableFooter
                            title="Total Expenses"
                            :previousAmount="previousTotalExpense"
                            :currentAmount="currentTotalExpense"
                        />
                    </template>

                    <TableFooter
                        title="Net Profit / Loss"
                        :previousAmount="previousNetProfitOrLoss"
                        :currentAmount="currentNetProfitOrLoss"
                    />
                </section>
            </template>
        </ReportWrapper>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import ReportWrapper from '@/pages/Reports/Wrapper.vue';
import TableRow from '@/pages/Reports/TableRow.vue';
import TableFooter from '@/pages/Reports/TableFooter.vue';

import { PeriodicRange } from '@/pages/Reports/types';

import ReportsMixin from '@/pages/Reports/ReportsMixin';

@Component({
    components: {
        ReportWrapper,
        TableRow,
        TableFooter,
    },
})
export default class ProfitAndLossStatement extends Mixins(ReportsMixin) {
    private reportTitle = 'Profit or Loss';

    private fetchReportsForSpecifiedPeriod(specifiedPeriod: string, periodicRange: PeriodicRange[]) {
        this.specifiedPeriod = specifiedPeriod;
        this.periodicRange = periodicRange;
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Income Statement');
    }

    async created() {
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/reports/dashboard';
</style>
