<template>
    <b-container class="make-payment" fluid>
        <b-row no-gutters>
            <PaymentDraft
                v-for="(paymentDraft, index) in paymentDrafts"
                :key="Math.random() + JSON.stringify(paymentDraft)"
                :paymentDraft="paymentDraft"
                :userIsOnDesktop="userIsOnDesktop"
                :itemIndex="index"
                :showDraftSummary="showDraftSummary"
                @edit-payment-draft="emitEditPaymentEvent"
                @delete-payment-draft="emitDeletePaymentEvent"
            />
        </b-row>

        <AddNewEntityWithPlusIconButton
            buttonText="Add Another Payment"
            @button-clicked="makeAnotherPayment"
            v-if="showAddButton"
            buttonTextClass="make-payment__add-more-button"
            icon=""
        />

        <b-row class="make-payment__summary-section" no-gutters>
            Total:
            <span class="make-payment__summary-section--amount">{{ totalAmountToBePaid | amountWithCurrency }}</span>
        </b-row>

        <!-- View summary button -->

        <BasePrimaryButton
            buttonText="View Summary"
            class="make-payment__finish-payment-button"
            v-if="showDraftSummaryButton"
            @button-clicked="toggleShowDraftSummary"
        />

        <!-- Submit the payment afterwards -->
        <BasePrimaryButton
            buttonText="Finish Payment"
            class="make-payment__finish-payment-button"
            v-if="showSubmitButton"
            @button-clicked="submitPayments"
            :status="addPaymentsRequestStatus"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import PaymentDraft from '@/pages/Spending/SalariesAndCommissions/PaymentDraft.vue';
import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';

import { StaffPaymentRequest } from '@/pages/Spending/SalariesAndCommissions/types';
import { MoneyObject } from '@/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

@Component({
    components: {
        PaymentDraft,
        CircularPlusSign,
    },
})
export default class MakePayment extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: Array<StaffPaymentRequest>() }) paymentDrafts!: Array<StaffPaymentRequest>;
    @Prop({ default: 'NORMAL' }) addPaymentsRequestStatus!: string;
    @Prop({ default: false }) showDraftSummary!: boolean;

    get totalAmountToBePaid(): MoneyObject {
        return {
            amount: this.paymentDrafts.reduce(
                (previousValue: number, currentDraft: StaffPaymentRequest) =>
                    previousValue + this.getNetPay(currentDraft),
                0,
            ),
            currencyKey: this.paymentDrafts[0]
                ? this.paymentDrafts[0].paymentAmount.currencyKey
                : this.defaultCurrency.currencyKey,
        };
    }

    get paymentDraftIsNotEmpty(): boolean {
        return this.paymentDrafts.length > 0;
    }

    get showAddButton(): boolean {
        return this.userIsOnDesktop ? this.showDraftSummary : true;
    }

    get showDraftSummaryButton(): boolean {
        if (!this.userIsOnDesktop) {
            return false;
        }

        return !this.showDraftSummary && this.paymentDraftIsNotEmpty && this.userIsOnDesktop;
    }

    get showSubmitButton(): boolean {
        // this button should be shown by default if the user is not on desktop
        if (!this.userIsOnDesktop) {
            return this.paymentDraftIsNotEmpty;
        }

        return this.showDraftSummary && this.paymentDraftIsNotEmpty;
    }

    private getNetPay({ paymentAmount, deduction }: StaffPaymentRequest): number {
        return Number(paymentAmount.amount) - Number(deduction.amount);
    }

    private makeAnotherPayment() {
        this.$emit('make-another-payment', {
            totalAmountToBePaid: this.totalAmountToBePaid,
        });
        this.emitSplitScreenEvent();
    }

    private submitPayments() {
        this.$emit('submit-payment');
    }

    private toggleShowDraftSummary() {
        this.$emit('make-salaries-and-commissions-full-screen');
    }

    private emitEditPaymentEvent(paymentIndex: number) {
        // if the showDraftSummary is true, we need to hide it
        if (this.showDraftSummary) {
            this.emitSplitScreenEvent();
        }

        this.$emit('prefill-add-payment-form-for-edit', paymentIndex);
    }

    private emitDeletePaymentEvent(paymentIndex: number) {
        this.$emit('delete-payment-from-draft', paymentIndex);
    }

    private emitSplitScreenEvent() {
        this.$emit('make-salaries-and-commissions-split-screen');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/salaries-commissions/make-payment';
</style>
