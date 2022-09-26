<template>
    <b-container fluid>
        <b-row class="ms-tablet-plus-index__mid-section-table-header">
            <b-col cols="1">
                #
            </b-col>
            <b-col cols="3">
                Date
            </b-col>
            <b-col cols="4">
                Bank / Account Number
            </b-col>
            <b-col cols="4">
                Amount
            </b-col>
        </b-row>

        <b-row
            class="ms-tablet-plus-index__mid-section-table-body"
            v-for="(additionalPayment, index) in additionalPayments"
            :key="additionalPayment.additionalPaymentKey"
        >
            <b-col cols="1">
                {{ index + 1 }}
            </b-col>
            <b-col cols="3">
                {{ additionalPayment.dateReceived | monthDateYearFormat }}
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-bank-details">
                <p class="ms-tablet-plus-index__payments-list-bank-details-text">
                    <span v-if="additionalPayment.accountNumber"> {{ additionalPayment.accountNumber }} -</span>
                    {{ additionalPayment.bankName }}
                </p>
            </b-col>
            <b-col cols="4" class="ms-tablet-plus-index__payments-list-amount">
                <p class="ms-tablet-plus-index__payments-list-amount">
                    {{ additionalPayment.amount | amountWithCurrency }}
                </p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import SalesMixin from '@/pages/Sales/SalesMixin';

@Component
export default class PaymentsListTable extends Mixins(SalesMixin) {}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__payments-list-bank-details-text {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    &__payments-list-amount {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
