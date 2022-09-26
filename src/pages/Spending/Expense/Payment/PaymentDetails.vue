<template>
    <b-container class="expense-details" fluid>
        <b-row
            class="expense-details__drawer justify-content-between align-items-center pointer"
            @click="togglePaymentDetails"
        >
            <b-col cols="11" class="text--primary">Payment Details</b-col>
            <b-col>
                <font-awesome-icon icon="chevron-up" alt="Collapse Icon" v-if="showPaymentDetails" />
                <font-awesome-icon icon="chevron-down" class="mr-4" alt="Collapse Icon" v-else />
            </b-col>
        </b-row>

        <transition name="slide-up-fade" mode="out-in">
            <b-row v-if="showPaymentDetails">
                <template v-if="expenseHasRecordedAPayment">
                    <DashboardTableHeader :headers="paymentHeaders" className="expense-details__header" />
                </template>
                <b-container class="expense-details__body" fluid>
                    <template v-if="paymentHistory.length > 0">
                        <transition-group name="slide-up-fade" appear>
                            <PaymentItemRow
                                v-for="item in paymentHistory"
                                :key="JSON.stringify(item)"
                                :paymentItem="item"
                            />
                        </transition-group>
                    </template>
                    <template v-else>
                        <p class="text-center">You haven't made any payment yet</p>
                    </template>
                    <b-row class="justify-content-between expense-details__footer">
                        <b-col>Total Amount Due: ₦{{ totalAmount | formatMoney }}</b-col>
                        <b-col class="text-success">Amount Paid: ₦{{ amountPaid | formatMoney }}</b-col>
                        <b-col class="text-danger">Balance: ₦{{ balance | formatMoney }}</b-col>
                    </b-row>
                </b-container>
            </b-row>
        </transition>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import PaymentItemRow from '@/pages/Spending/Expense/Payment/PaymentItemRow.vue';
import DashboardTableHeader from '@/components/ui/DashboardTableHeader.vue';

import { DashboardHeader } from '@/types';
import { ExpensePayment } from '@/pages/Spending/Expense/types';

@Component({
    components: {
        PaymentItemRow,
        DashboardTableHeader,
    },
})
export default class PaymentDetails extends Vue {
    private readonly paymentHeaders: Array<DashboardHeader> = [
        {
            text: 'Amount Paid',
        },
        {
            text: 'Payment Type',
        },
        {
            text: 'Date',
        },
    ];

    private showPaymentDetails = false;

    private togglePaymentDetails() {
        this.showPaymentDetails = !this.showPaymentDetails;
    }

    @Prop({ required: true }) readonly paymentHistory!: ExpensePayment[];
    @Prop({ default: 0 }) readonly totalAmount!: number;
    @Prop({ default: 0 }) readonly amountPaid!: number;
    @Prop({ default: 0 }) readonly balance!: number;

    get expenseHasRecordedAPayment(): boolean {
        return this.paymentHistory.length > 0;
    }
}
</script>
