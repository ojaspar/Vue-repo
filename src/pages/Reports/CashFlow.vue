<template>
    <div>
        <ReportWrapper :reportTitle="reportTitle">
            <template v-slot:report-items>
                <!-- Cash flow from operations -->
                <section class="reports__section">
                    <b-row class="reports__section-header cash-flow__header">
                        <b-col>Cash Flow From Operations</b-col>
                    </b-row>

                    <!-- operating outflow  Operations -->

                    <b-row class="reports__section-header">
                        <b-col cols="7" class="cash-flow__sub-header">
                            Operating Inflow
                        </b-col>
                        <b-col class="amount-col">{{ previousMonth }}</b-col>
                        <b-col class="amount-col">{{ currentMonthName }}</b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in operatingInflow" :key="`operating-inflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthOperatingInflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthOperatingInflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <!-- operating outflow  Operations -->

                    <b-row class="reports__section-header">
                        <b-col cols="7" class="cash-flow__sub-header">
                            Operating Outflow
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in operatingOutflow" :key="`operating-outflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthOperatingOutflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthOperatingOutflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <TableFooter title="">
                        <template #footer-content>
                            <b-col cols="7">Net Cashflow From Operating Activities</b-col>

                            <b-col class="amount-col">{{
                                previousMonthOperatingActivitiesNetCashFlow | formatMoney
                            }}</b-col>

                            <b-col class="amount-col">{{
                                currentMonthOperatingActivitiesNetCashFlow | formatMoney
                            }}</b-col>
                        </template>
                    </TableFooter>
                </section>

                <!-- Cash flow from Investing -->
                <section class="reports__section">
                    <b-row class="reports__section-header cash-flow__header">
                        <b-col>Cash Flow From Investing</b-col>
                    </b-row>

                    <!-- Investing Inflow -->

                    <b-row class="reports__section-header">
                        <b-col class="cash-flow__sub-header">
                            Investing Inflow
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in investingInflow" :key="`investing-inflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthInvestingInflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthInvestingInflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <!-- investing outflow  Operations -->

                    <b-row class="reports__section-header">
                        <b-col cols="7" class="cash-flow__sub-header">
                            Investing Outflow
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in investingOutflow" :key="`investing-outflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthInvestingOutflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthInvestingOutflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <TableFooter title="">
                        <template #footer-content>
                            <b-col cols="7">Net Cashflow From Investing Activities</b-col>

                            <b-col class="amount-col">{{
                                previousMonthInvestingActivitiesNetCashFlow | formatMoney
                            }}</b-col>

                            <b-col class="amount-col">{{
                                currentMonthInvestingActivitiesNetCashFlow | formatMoney
                            }}</b-col>
                        </template>
                    </TableFooter>
                </section>

                <!-- Cash flow from Financing -->
                <section class="reports__section">
                    <b-row class="reports__section-header cash-flow__header">
                        <b-col>Cash Flow From Financing</b-col>
                    </b-row>

                    <!-- Financial Inflow -->

                    <b-row class="reports__section-header">
                        <b-col class="cash-flow__sub-header">
                            Financing Inflow
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in financingInflow" :key="`financing-inflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthFinancingInflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthFinancingInflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <!-- financing outflow  Operations -->

                    <b-row class="reports__section-header">
                        <b-col cols="7" class="cash-flow__sub-header">
                            Financing Outflow
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in financingOutflow" :key="`financing-outflow-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"> {{ item.previousAmount | renderedText }}</b-col>
                            <b-col class="amount-col">{{ item.currentAmount | renderedText }}</b-col>
                        </template>
                    </TableRow>

                    <b-row class="cash-flow__section-footer">
                        <b-col cols="7"></b-col>
                        <b-col class="amount-col">{{ previousMonthFinancingOutflowTotal | formatAmount }}</b-col>
                        <b-col class="amount-col">{{ currentMonthFinancingOutflowTotal | formatAmount }}</b-col>
                    </b-row>

                    <TableFooter title="" class="mb-4">
                        <template #footer-content>
                            <b-col cols="7">Net Cashflow From Financing Activities</b-col>

                            <b-col class="amount-col">{{
                                previousMonthFinancingActivitiesNetCashFlow | formatMoney
                            }}</b-col>

                            <b-col class="amount-col">{{
                                currentMonthFinancingActivitiesNetCashFlow | formatMoney
                            }}</b-col>
                        </template>
                    </TableFooter>

                    <TableFooter title="">
                        <template #footer-content>
                            <b-col cols="7" class="uppercase">Net Cash flow </b-col>

                            <b-col class="amount-col">{{ previousNetCashFlow | formatMoney }}</b-col>

                            <b-col class="amount-col">{{ currentNetCashFlow | formatMoney }}</b-col>
                        </template>
                    </TableFooter>

                    <TableFooter title="">
                        <template #footer-content>
                            <b-col cols="7" class="uppercase">Opening cash position</b-col>

                            <b-col class="amount-col">{{ previousMonthOpeningCashPosition | formatMoney }}</b-col>

                            <b-col class="amount-col">{{ currentMonthOpeningCashPosition | formatMoney }}</b-col>
                        </template>
                    </TableFooter>

                    <TableFooter title="">
                        <template #footer-content>
                            <b-col cols="7" class="uppercase">closing cash position</b-col>

                            <b-col class="amount-col">{{ previousMonthClosingCashPosition | formatMoney }}</b-col>

                            <b-col class="amount-col">{{ currentMonthClosingCashPosition | formatMoney }}</b-col>
                        </template>
                    </TableFooter>
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

import ReportsMixin from '@/pages/Reports/ReportsMixin';

import { ReportItem } from '@/pages/Reports/types';

@Component({
    components: {
        ReportWrapper,
        TableRow,
        TableFooter,
    },
    filters: {
        renderedText(amount: number): string {
            return amount > 0 ? amount.toLocaleString() : '-';
        },
    },
})
export default class CashFlowStatement extends Mixins(ReportsMixin) {
    private reportTitle = 'Cash Flow';

    private operatingInflow: Array<ReportItem> = [
        {
            reportLine: 'Sale of Good & Services',
            previousAmount: 5201000,
            currentAmount: 3500415,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Debt Repayment by Customers',
            previousAmount: 245874,
            currentAmount: 584215,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    private operatingOutflow: Array<ReportItem> = [
        {
            reportLine: 'Purchase of Good/Materials',
            previousAmount: 566770,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Payment to Creditors',
            previousAmount: 102540,
            currentAmount: 2152888,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Payroll',
            previousAmount: 250000,
            currentAmount: 250000,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'General Administration',
            previousAmount: 1254124,
            currentAmount: 1250214,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Tax Payments',
            previousAmount: 12024,
            currentAmount: 11002,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    private investingInflow: Array<ReportItem> = [
        {
            reportLine: 'Asset Disposal',
            previousAmount: 678065,
            currentAmount: 54210,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Dividend, Rent & Interest Received',
            previousAmount: 45098,
            currentAmount: 52140,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    private investingOutflow: Array<ReportItem> = [
        {
            reportLine: 'Purchase of Assets',
            previousAmount: 670897,
            currentAmount: 452147,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    private financingInflow: Array<ReportItem> = [
        {
            reportLine: 'Capital Contribution',
            previousAmount: 6000000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Loan and Overdraft Received',
            previousAmount: 3000000,
            currentAmount: 1000000,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    private financingOutflow: Array<ReportItem> = [
        {
            reportLine: 'Capital Drawings',
            previousAmount: 67000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Loan and Overdraft Repayment',
            previousAmount: 1600000,
            currentAmount: 582541,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
        {
            reportLine: 'Dividends Paid',
            previousAmount: 45000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
        },
    ];

    get previousMonth(): string {
        return this.monthsOfTheYear[this.currentMonth - 2];
    }

    get currentMonthName(): string {
        return this.monthsOfTheYear[this.currentMonth - 1];
    }

    get previousMonthOperatingInflowTotal(): number {
        return this.operatingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthOperatingInflowTotal(): number {
        return this.operatingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthOperatingOutflowTotal(): number {
        return this.operatingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthOperatingOutflowTotal(): number {
        return this.operatingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthOperatingActivitiesNetCashFlow(): number {
        return this.previousMonthOperatingInflowTotal - this.previousMonthOperatingOutflowTotal;
    }

    get currentMonthOperatingActivitiesNetCashFlow(): number {
        return this.currentMonthOperatingInflowTotal - this.currentMonthOperatingOutflowTotal;
    }

    get previousMonthInvestingInflowTotal(): number {
        return this.investingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthInvestingInflowTotal(): number {
        return this.investingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthInvestingOutflowTotal(): number {
        return this.investingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthInvestingOutflowTotal(): number {
        return this.investingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthInvestingActivitiesNetCashFlow(): number {
        return this.previousMonthInvestingInflowTotal - this.previousMonthInvestingOutflowTotal;
    }

    get currentMonthInvestingActivitiesNetCashFlow(): number {
        return this.currentMonthInvestingInflowTotal - this.currentMonthInvestingOutflowTotal;
    }

    get previousMonthFinancingInflowTotal(): number {
        return this.financingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthFinancingInflowTotal(): number {
        return this.financingInflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthFinancingOutflowTotal(): number {
        return this.financingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get currentMonthFinancingOutflowTotal(): number {
        return this.financingOutflow.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
    }

    get previousMonthFinancingActivitiesNetCashFlow(): number {
        return this.previousMonthFinancingInflowTotal - this.previousMonthFinancingOutflowTotal;
    }

    get currentMonthFinancingActivitiesNetCashFlow(): number {
        return this.currentMonthFinancingInflowTotal - this.currentMonthFinancingOutflowTotal;
    }

    get previousNetCashFlow(): number {
        return (
            this.previousMonthOperatingActivitiesNetCashFlow +
            this.previousMonthInvestingActivitiesNetCashFlow +
            this.previousMonthFinancingActivitiesNetCashFlow
        );
    }

    get currentNetCashFlow(): number {
        return (
            this.currentMonthOperatingActivitiesNetCashFlow +
            this.currentMonthInvestingActivitiesNetCashFlow +
            this.currentMonthFinancingActivitiesNetCashFlow
        );
    }

    get previousMonthOpeningCashPosition(): number {
        return 1000000;
    }

    get currentMonthOpeningCashPosition(): number {
        return 500021;
    }

    get previousMonthClosingCashPosition(): number {
        return this.previousNetCashFlow + this.previousMonthOpeningCashPosition;
    }

    get currentMonthClosingCashPosition(): number {
        return this.currentNetCashFlow + this.currentMonthOpeningCashPosition;
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

.cash-flow {
    &__header {
        background: $primary-color;
        color: $primary-white;

        margin-top: 20px;
        margin-bottom: 20px;
    }

    &__section-footer {
        font-weight: 600;
        font-size: 14px;

        padding: 1.5rem 8rem;
    }
}
</style>
