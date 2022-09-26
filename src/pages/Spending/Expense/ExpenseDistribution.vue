<template>
    <b-container fluid class="mt-4 expense-distribution">
        <b-row
            class="justify-content-between align-items-center expense-distribution__header m-0 pb-3 expense-distribution__row text--black"
        >
            <b-col cols="8" class="txt--bold text-uppercase p-0">
                Expense distribution
            </b-col>
            <b-col class="pl-0 text-right">
                <BaseSelect
                    className="pointer expense-distribution__months"
                    selectContainerClass="expense-distribution__months-container"
                    @change="getExpenseDistribution"
                    :value="currentMonthWithYear"
                    :options="monthsTillCurrentMonth"
                />
            </b-col>
        </b-row>
        <template v-if="expenseRequestStatus.getbudgetPercentage === 'LOADING'">
            <b-container class="text-center mt-5">
                <Loader size="2" />
            </b-container>
        </template>
        <template v-else>
            <b-row class="justify-content-between expense-distribution__row m-0 mt-4 mb-4 expense-distribution__title">
                <b-col cols="8" class="p-0">Expense Group</b-col>
                <b-col class="txt--bold p-0">100%</b-col>
                <ProgressBar progress="100" class="mt-2" />
            </b-row>

            <b-row
                class="m-0 mt-3 mb-3 justify-content-between expense-distribution__row expense-group align-items-center"
                v-for="budgetPercentage in budgetPercentages"
                :key="budgetPercentage.name"
            >
                <b-col cols="8" class="d-flex align-items-center p-0">
                    <span class="expense-group__color" :style="{ background: randomColor }"></span>
                    <span class="ml-3">{{ budgetPercentage.name }}</span>
                </b-col>
                <b-col class="text-right p-0">{{ budgetPercentage.percentage }}%</b-col>
            </b-row>
        </template>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ProgressBar from '@/components/ui/ProgressBar.vue';

import ExpenseModule from '@/store/modules/expense';
import { ExpenseRequestStatus, BudgetPercentage } from '@/pages/Spending/Expense/types';
import UtilityMixins from '@/mixins/Utility';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component({ components: { ProgressBar } })
export default class ExpenseDistribution extends Mixins(UtilityMixins) {
    private selectedMonth = this.getMonthWithYear(this.monthsOfTheYear[this.currentMonth], this.currentYear);

    get monthsTillCurrentMonth(): string[] {
        const { currentYear, monthsOfTheYear, currentMonth } = this;
        return monthsOfTheYear.slice(0, currentMonth + 1).map(month => `${month} ${currentYear}`);
    }

    private readonly colours: string[] = [
        '#5867DD',
        '#34BFA3',
        '#FFB822',
        '#9ACEFF',
        '#E79798',
        '#3DD1BA',
        '#F55637',
        '#9E8ADB',
        '#70B056',
    ];

    @expenses.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    public budgetPercentages!: BudgetPercentage[];

    private getExpenseDistribution(monthWithYear: string) {
        const monthWithoutYear = this.getMonthWithoutYear(monthWithYear);

        expenseModule.getExpenseBudgetPercentages(monthWithoutYear);
    }

    public getMonthWithYear(monthWithoutYear: string, year: number): string {
        return `${monthWithoutYear} ${year}`;
    }

    public getMonthWithoutYear(monthWithYear: string): string {
        return monthWithYear.split(' ')[0];
    }

    mounted() {
        const { $store, currentMonthWithYear } = this;
        const monthWithoutYear: string = this.getMonthWithoutYear(currentMonthWithYear);

        expenseModule = getModule(ExpenseModule, $store);
        expenseModule.getExpenseBudgetPercentages(monthWithoutYear);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-distribution';
</style>
