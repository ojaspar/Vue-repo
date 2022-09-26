<template>
    <b-container fluid class="expense-list">
        <b-row>
            <b-col class="p-0">
                <DashboardTableHeader :headers="headers" headerContainerClass="p-0" />
                <b-container v-if="expenseRequestStatus.getExpense === 'LOADING'" class="text-center mt-5">
                    <Loader size="5" />
                </b-container>

                <b-container fluid v-else class="p-0">
                    <b-container fluid v-if="expenses.length !== 0">
                        <b-row>
                            <b-col cols="12" class="p-0">
                                <transition-group name="slide-up-fade" appear>
                                    <ExpenseItem
                                        :expense="expense"
                                        v-for="expense of expenses"
                                        :key="expense.expenseKey"
                                    />
                                </transition-group>
                            </b-col>
                        </b-row>
                        <b-pagination
                            :total-rows="totalExpenseCount"
                            :per-page="10"
                            size="lg"
                            class="select-entity__pagination mt-5"
                            align="center"
                            v-model="currentPage"
                        />
                    </b-container>

                    <b-container fluid v-else>
                        <b-row class="mt-5 w-100 align-items-center flex-column no-resource">
                            <img
                                src="@/assets/img/no-resource-found.svg"
                                alt="empty invoice"
                                class="no-resource__illustration"
                            />
                            <h2 class="no-resource__text">You don't have any expense yet</h2>
                            <BaseButton
                                buttonText="Record your first Expense"
                                @button-clicked="goToRecordExpensePage"
                                :overRideButtonClass="true"
                                className="no-resource__button"
                            />
                        </b-row>
                    </b-container>
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import DashboardFilter from '@/components/ui/DashboardFilter.vue';
import DashboardSearch from '@/components/ui/DashboardSearch.vue';
import DashboardTableHeader from '@/components/ui/DashboardTableHeader.vue';
import ExpenseItem from '@/pages/Spending/Expense/ExpenseItem.vue';

import { Expense, ExpenseRequestStatus } from '@/pages/Spending/Expense/types';
import { Status, DashboardHeader } from '@/types';

@Component({
    components: {
        DashboardFilter,
        DashboardSearch,
        DashboardTableHeader,
        ExpenseItem,
    },
})
export default class ExpenseList extends Vue {
    private readonly headers: Array<DashboardHeader> = [
        {
            text: 'Expense Items',
            numberOfColumns: 4,
        },
        {
            text: 'Amount',
            numberOfColumns: 3,
        },
        {
            text: 'Date',
        },
        {
            text: 'Action',
        },
    ];
    private currentPage = 1;

    @Prop({ default: Array<Expense>() }) readonly expenses!: Array<Expense>;
    @Prop({ default: { getExpense: Status.NORMAL, getBugetPercentage: Status.NORMAL } })
    readonly expenseRequestStatus!: ExpenseRequestStatus;
    @Prop({ required: true }) readonly totalExpenseCount!: number;

    private goToRecordSpendingPage() {
        this.$router.push({ name: 'RecordSpending' });
    }

    @Watch('currentPage')
    handlePageChange(pageNumber: number): void {
        this.$emit('page-change', pageNumber);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-list.scss';
</style>
