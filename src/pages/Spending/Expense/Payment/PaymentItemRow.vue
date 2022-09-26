<template>
    <b-row class="expense-details__row">
        <b-col>₦{{ paymentItem.amount | formatMoney }}</b-col>
        <b-col>{{ paymentItem.paymentTypeName | formatPaymentType }}</b-col>
        <b-col>{{ paymentItem.datePaid | localDate }}</b-col>
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { ExpensePayment } from '@/pages/Spending/Expense/types';
import UtilityMixins from '@/mixins/Utility';

@Component
export default class PaymentItemRow extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly paymentItem!: ExpensePayment;
}
</script>
