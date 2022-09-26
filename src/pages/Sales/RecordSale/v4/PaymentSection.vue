<template>
    <div class="payment-section">
        <!-- Expense Item Details -->
        <transition name="slide-up-fade" mode="out-in">
            <div class="payment-section__item-summary">
                <!-- Transaction Date -->
                <FormattedDatePicker :defaultDate="transactionDate" @date-selected="handleDateSelection" />

                <CustomerCard
                    :selectedCustomer="selectedCustomer"
                    :showCustomerDetails="showCustomerDetails"
                    :isEstimate="isEstimate"
                    @edit-customer="$emit('edit-customer')"
                    @change-customer="$emit('change-customer')"
                />

                <ItemSummary
                    :functionalCurrency="functionalCurrency"
                    :selectedItems="selectedItems"
                    :totalAmount="selectedItemsTotalAmount"
                    :updateTaxOptions="updateItemsTaxOptions"
                    :selectedItemsTaxOptions="selectedItemsTaxOptions"
                    :selectedCustomer="selectedCustomer"
                    :isEstimate="isEstimate"
                    @edit-selected-item="editSelectedItem"
                    @add-another-item="$emit('add-another-item')"
                    @delete-item-from-list="$emit('delete-item-from-list', $event)"
                    @update-tax-options="$emit('update-tax-options', $event)"
                    @back-to-item-list="$emit('back-to-item-list', $event)"
                />
            </div>
        </transition>

        <div v-if="isEstimate" class="payment-section__quotation">
            <BasePrimaryButton
                buttonText="Generate Quotation"
                :status="requestStatus"
                :disabled="disableButton"
                @button-clicked="$emit('generate-estimate')"
            />
        </div>

        <!-- Payment Form -->
        <transition v-else name="slide-up-fade" mode="out-in">
            <div class="payment-section__payment-form" key="payment-form">
                <PaymentForm
                    :transactionDate="transactionDate"
                    :functionalCurrency="functionalCurrency"
                    :totalAmount="selectedItemsTotalAmount"
                    :selectedCustomer="selectedCustomer"
                    :isEstimate="isEstimate"
                    :isEstimateConversion="isEstimateConversion"
                    :action="action"
                    @change-customer="$emit('change-customer')"
                    @generate-estimate="$emit('generate-estimate')"
                    @process-sale-submission="$emit('process-sale-submission', $event)"
                    @generate-invoice="$emit('generate-invoice', $event)"
                    @generate-no-payment-invoice="$emit('generate-no-payment-invoice')"
                />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CustomerCard from '@/pages/Sales/RecordSale/v4/CustomerCard.vue';
import ItemSummary from '@/pages/Sales/RecordSale/v4/ItemSummary.vue';
import PaymentForm from '@/pages/Sales/RecordSale/v4/PaymentForm.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
} from '@/pages/Sales/RecordSale/v4/types';

import { SaleCustomer, defaultCustomer } from '@/pages/Sales/types';
import { Status, SaleRequestStatus } from '@/types';

import UtilityMixins from '@/mixins/Utility';

const sales = namespace('sale');

@Component({ components: { CustomerCard, ItemSummary, PaymentForm } })
export default class SalePaymentSection extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ required: true }) readonly selectedItemsTotalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: '' }) readonly action!: string;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: false }) readonly isEstimateConversion!: boolean;
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ default: () => [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ default: true }) readonly showCustomerDetails!: boolean;
    @Prop({ default: false }) readonly updateItemsTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;

    @sales.State
    public salesRequestStatus!: SaleRequestStatus;

    get disableButton() {
        return (
            this.salesRequestStatus.recordEstimate === Status.LOADING ||
            this.salesRequestStatus.updateEstimate === Status.LOADING ||
            this.salesRequestStatus.generatePdf === Status.LOADING
        );
    }

    get requestStatus() {
        const { salesRequestStatus } = this;
        if (salesRequestStatus.recordEstimate === Status.LOADING) return salesRequestStatus.recordEstimate;
        if (salesRequestStatus.updateEstimate === Status.LOADING) return salesRequestStatus.updateEstimate;
        return salesRequestStatus.generatePdf;
    }

    private handleDateSelection(selectedDate: string) {
        this.$emit('update-transaction-date', selectedDate);
    }

    private editSelectedItem(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        this.$emit('edit-selected-item', itemIndex, itemToBeEdited);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/payment-section';
</style>
