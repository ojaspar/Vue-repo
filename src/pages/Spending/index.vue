<template>
    <div>
        <ExpenseStat :firstStat="firstStat" :secondStat="secondStat" :thirdStat="thirdStat" />
        <b-container fluid>
            <b-row>
                <b-col class="p-0" cols="8">
                    <ExpenseList
                        :expenses="expenses"
                        :expenseRequestStatus="expenseRequestStatus"
                        :totalExpenseCount="totalExpenseCount"
                        @page-change="fetchExpenses"
                    />
                </b-col>
                <b-col class="pr-0 mt-4">
                    <b-row class="w-100 d-flex justify-content-between m-0 align-items-center controls">
                        <div class="search-filter d-flex justify-content-between align-items-center">
                            <img class="pointer" src="@/assets/img/search.svg" />
                            <img class="pointer" src="@/assets/img/filter.svg" />
                            <span class="pointer">Sort</span>
                        </div>
                        <BaseButton
                            className="add-expense"
                            buttonText="Create Expense"
                            @button-clicked="routeToExpensePage"
                        >
                            <CircularPlusSign />
                        </BaseButton>
                    </b-row>
                    <b-row class="m-0">
                        <ExpenseDistribution />
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ExpenseList from '@/pages/Spending/Expense/ExpenseList.vue';
import ExpenseStat from '@/pages/Dashboard/DashboardStat.vue';
import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';
import ExpenseDistribution from '@/pages/Spending/Expense/ExpenseDistribution.vue';

import ExpenseModule from '@/store/modules/expense';

import { Expense, ExpenseRequestStatus, ExpenseDashboardStat } from '@/pages/Spending/Expense/types';
import { DashboardStat } from '@/types';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component({
    components: {
        ExpenseList,
        ExpenseStat,
        CircularPlusSign,
        ExpenseDistribution,
    },
})
export default class ExpenseDashboard extends Vue {
    get secondStat(): DashboardStat {
        return {
            header: 'number of people owed',
            body: '0',
            isMonetaryValue: false,
            meta: '',
            icon: '',
            status: this.expenseRequestStatus.getDashboardStat,
        };
    }
    get thirdStat(): DashboardStat {
        return {
            header: '',
            body: '',
            isMonetaryValue: false,
            meta: '',
            icon: '',
            status: this.expenseRequestStatus.getDashboardStat,
        };
    }
    get firstStat(): DashboardStat {
        return {
            header: 'total amount owed',
            body: `₦${this.dashboardStats.totalAmountOwed}`,
            isMonetaryValue: true,
            meta: '',
            icon: '',
            status: this.expenseRequestStatus.getDashboardStat,
        };
    }

    @expenses.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    public error!: string;

    @expenses.State
    public expenses!: Expense[];

    @expenses.State
    public totalExpenseCount!: number;

    @expenses.State
    public dashboardStats!: ExpenseDashboardStat;

    mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);
        // Promise.all([expenseModule.getAllExpenses(), expenseModule.getDashboardStats()]);
    }

    private routeToExpensePage() {
        this.$router.push({ name: 'RecordExpense' });
    }

    private fetchExpenses() {
        // expenseModule.getAllExpenses(pageNumber);
    }
}
</script>

<style lang="scss">
.add-expense {
    height: 38px;
    width: 50%;
}

.search-filter {
    width: 40%;
    height: 40px;
    font-size: 16px;
    padding: 0 15px;
}
</style>
