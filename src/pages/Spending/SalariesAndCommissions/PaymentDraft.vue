<template>
    <b-container class="payment-draft-container" fluid>
        <!-- Desktop View -->
        <b-row class="payment-draft" v-if="userIsOnDesktop">
            <b-col cols="1" class="payment-draft__count">
                <div class="payment-draft__count--draggable">
                    <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
                    <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
                </div>
                {{ itemIndex + 1 }}
            </b-col>
            <b-col class="payment-draft__staff-name pl-0" cols="2"
                >{{ paymentDraft.firstName }} {{ paymentDraft.lastName }}</b-col
            >
            <b-col>{{ paymentDraft.paymentPeriod }}</b-col>
            <b-col>{{ paymentDraft.paymentType | uppercaseFirst }}</b-col>

            <template v-if="showDraftSummary">
                <b-col> {{ paymentDraft.paymentAmount | amountWithCurrency }}</b-col>
                <b-col> {{ paymentDraft.deduction | amountWithCurrency }}</b-col>
            </template>

            <b-col class="payment-draft__net-pay">{{ netPay | amountWithCurrency }} </b-col>

            <b-col v-if="showDraftSummary" class="payment-draft__notes">{{ paymentDraft.notes || '-' }}</b-col>

            <b-col class="payment-draft__actions">
                <span class="pointer payment-draft__actions--edit" @click="$emit('edit-payment-draft', itemIndex)">
                    <font-awesome-icon icon="pencil-alt" class="payment-draft__actions--edit-icon"></font-awesome-icon>
                </span>
                <span class="pointer payment-draft__actions--delete" @click="handleDeleteModal">
                    <font-awesome-icon icon="trash-alt" class="payment-draft__actions--delete-icon"></font-awesome-icon>
                </span>
            </b-col>
        </b-row>

        <!-- Mobile View -->
        <b-row class="payment-draft pointer" @click="toggleShowFullDetails" v-else>
            <div class="payment-draft__details">
                <div class="payment-draft__details-left">
                    <p class="payment-draft__date">{{ paymentDraft.paymentPeriod }}</p>
                    <p class="payment-draft__staff-name">{{ paymentDraft.firstName }} {{ paymentDraft.lastName }}</p>
                </div>
                <div class="payment-draft__details-right">
                    <p class="payment-draft__chevron pointer">
                        <font-awesome-icon icon="chevron-up" alt="Collapse Up Icon" v-if="showFullDetails" key="up" />
                        <font-awesome-icon icon="chevron-down" alt="Collapse Down Icon" v-else key="down" />
                    </p>
                    <p class="payment-draft__net-pay">{{ netPay | amountWithCurrency }}</p>
                </div>
            </div>

            <transition-group name="slide-up-fade">
                <template v-if="showFullDetails">
                    <div class="payment-draft__details" key="details">
                        <div class="payment-draft__details-left">
                            <p class="payment-draft__payment-type">Payment Type</p>
                            <p class="payment-draft__net-pay">Full Pay</p>
                            <p class="payment-draft__deductions">Deductions</p>
                            <p class="payment-draft__notes">{{ paymentDraft.notes }}</p>
                        </div>
                        <div class="payment-draft__details-right payment-draft__details-right-up">
                            <p class="payment-draft__payment-type">
                                {{ paymentDraft.paymentType | uppercaseFirst }}
                            </p>
                            <p class="payment-draft__net-pay">{{ paymentDraft.paymentAmount | amountWithCurrency }}</p>
                            <p class="payment-draft__deductions">{{ paymentDraft.deduction | amountWithCurrency }}</p>
                        </div>
                    </div>

                    <b-row class="payment-draft__actions" key="actions">
                        <div class="pointer" @click.stop="$emit('edit-payment-draft', itemIndex)">
                            <font-awesome-icon icon="pencil-alt" alt="Edit Icon" /><span
                                class="payment-draft__actions--edit-icon"
                                >Edit</span
                            >
                        </div>
                        <div class="pointer" @click.stop="handleDeleteModal">
                            <font-awesome-icon icon="trash-alt" alt="Delete Icon" /><span
                                class="payment-draft__actions--delete-icon"
                                >Delete</span
                            >
                        </div>
                    </b-row>
                </template>
            </transition-group>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { StaffPaymentRequest } from '@/pages/Spending/SalariesAndCommissions/types';
import UtilityMixins from '@/mixins/Utility';

import { MoneyObject } from '@/types';

@Component
export default class PaymentDraft extends Mixins(UtilityMixins) {
    private showFullDetails = false;
    @Prop({ required: true })
    paymentDraft!: StaffPaymentRequest;
    @Prop({ required: true })
    itemIndex!: number;
    @Prop({ required: true })
    showDraftSummary!: boolean;

    get netPay(): MoneyObject {
        const { paymentAmount, deduction } = this.paymentDraft;

        return {
            amount: paymentAmount.amount - deduction.amount,
            currencyKey: paymentAmount.currencyKey,
        };
    }

    private toggleShowFullDetails() {
        this.showFullDetails = !this.showFullDetails;
    }

    private handleDeleteModal() {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Remove Item',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'Delete',
                cancelTitle: 'Cancel',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.$emit('delete-payment-draft', this.itemIndex);
            })
            .catch(err => err);
    }
}
</script>
