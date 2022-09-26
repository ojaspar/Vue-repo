<template>
    <b-row class="add-payment-container__table--row">
        <b-col cols="1">{{ itemIndex + 1 }}</b-col>
        <b-col cols="3">{{ expense.name }}</b-col>
        <b-col>₦ {{ expense.unitCost | formatMoney }}</b-col>
        <b-col>{{ expense.quantity === 0 ? '-' : expense.quantity }}</b-col>
        <b-col>₦ {{ expense.totalCost | formatMoney }}</b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ExpenseLineItem } from '@/pages/Spending/Expense/types';

@Component
export default class ExpenseItemRow extends Vue {
    @Prop({ required: true })
    readonly expense!: ExpenseLineItem;
    @Prop({ required: true })
    readonly itemIndex!: number;
}
</script>

<style lang="scss"></style>
