<template>
    <div>
        <ReportWrapper :reportTitle="reportTitle" reportType="pl">
            <template v-slot:report-items>
                <!-- Income -->
                <section class="reports__section">
                    <b-row class="reports__section-header">
                        <b-col cols="7">NAME OF LEDGER</b-col>

                        <b-col class="amount-col">
                            Debit
                        </b-col>

                        <b-col class="amount-col">
                            Credit
                        </b-col>
                    </b-row>

                    <TableRow :row="item" v-for="(item, index) in trialBalanceItems" :key="`no-total-income-${index}`">
                        <template #report-contents>
                            <b-col class="table-row__column d-flex align-items-center" cols="7">
                                <p class="m-0 table-row__report-line">{{ item.reportLine }}</p>
                            </b-col>

                            <b-col class="amount-col"
                                ><span v-if="item.reportType === 'Debit'">{{ item | renderedText('Debit') }}</span
                                ><span v-else></span
                            ></b-col>
                            <b-col class="amount-col"
                                ><span v-if="item.reportType === 'Credit'">{{ item | renderedText('Credit') }}</span
                                ><span v-else></span
                            ></b-col>
                        </template>
                    </TableRow>

                    <TableFooter title="Grand Total" :previousAmount="totalDebit" :currentAmount="totalCredit">
                        <template #footer-content>
                            <b-col cols="7" class="uppercase">Grand Total</b-col>

                            <b-col class="amount-col">{{ totalDebit | formatMoney }}</b-col>

                            <b-col class="amount-col">{{ totalCredit | formatMoney }}</b-col>
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

import { ReportItem, ReportType } from '@/pages/Reports/types';

@Component({
    components: {
        ReportWrapper,
        TableRow,
        TableFooter,
    },
    filters: {
        renderedText(item: ReportItem, reportType: ReportType): string {
            let valueToUse = item.previousAmount;

            if (reportType === 'Credit') {
                valueToUse = item.currentAmount;
            }

            const value = valueToUse > 0 ? valueToUse.toLocaleString() : '-';

            return value;
        },
    },
})
export default class ProfitAndLossStatement extends Mixins(ReportsMixin) {
    private reportTitle = 'Trial Balance';

    private trialBalanceItems: Array<ReportItem> = [
        {
            reportLine: 'Cash Balance',
            previousAmount: 250002,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Bank Balance',
            previousAmount: 140254,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Bills Receivables',
            previousAmount: 245874,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Tax Receivables',
            previousAmount: 12542,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Prepayments - Expenses',
            previousAmount: 58214,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Prepayments - Tax',
            previousAmount: 24521,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Inventory - Operations',
            previousAmount: 6985325,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Inventory - Donated Items',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Pledge Receivables',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Financial Investments',
            previousAmount: 1258745,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Intangible Assets',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Property, Plant and Equipment (PPE)',
            previousAmount: 11447565,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Other Assets',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Advance from Customers',
            previousAmount: 0,
            currentAmount: 258884,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Bills Payables',
            previousAmount: 0,
            currentAmount: 548000,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Tax Payables',
            previousAmount: 0,
            currentAmount: 254120,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Loans and Overdraft',
            previousAmount: 0,
            currentAmount: 2045214,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Other Liabilities',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: `Donors' Advance/Deposit`,
            previousAmount: 0,
            currentAmount: 40000,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Business Capital',
            previousAmount: 0,
            currentAmount: 8000000,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Retained Earnings',
            previousAmount: 0,
            currentAmount: 964196,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Staff Cost',
            previousAmount: 252000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'General Administration',
            previousAmount: 1245000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Marketing and Distribution',
            previousAmount: 1245800,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Interest/Bank Charges',
            previousAmount: 34000,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Tax Expense',
            previousAmount: 30450,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Research and Development',
            previousAmount: 710517,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Donations/Charity',
            previousAmount: 101345,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Debit',
        },
        {
            reportLine: 'Revenue from Sales',
            previousAmount: 0,
            currentAmount: 6183332,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Revenue from Services',
            previousAmount: 0,
            currentAmount: 4215860,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Donations and Grants - Financial',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Donations and Grants - Non Financial',
            previousAmount: 0,
            currentAmount: 0,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
        {
            reportLine: 'Other Income',
            previousAmount: 0,
            currentAmount: 1532548,
            reportLineKey: '',
            reportCategoryKey: '',
            reportCategory: '',
            reportType: 'Credit',
        },
    ];

    get totalDebit(): number {
        return this.trialBalanceItems.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.previousAmount,
            0,
        );
    }

    get totalCredit(): number {
        return this.trialBalanceItems.reduce(
            (currentTotal: number, reportItem: ReportItem) => currentTotal + reportItem.currentAmount,
            0,
        );
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
