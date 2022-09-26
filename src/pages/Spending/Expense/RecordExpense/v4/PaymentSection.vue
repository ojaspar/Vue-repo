<template>
    <div class="payment-section">
        <!-- Expense Item Details -->
        <transition name="slide-up-fade" mode="out-in">
            <div class="payment-section__item-summary">
                <!-- Transaction Date -->
                <FormattedDatePicker :defaultDate="transactionDate" @date-selected="handleDateSelection" />

                <VendorCard
                    :selectedVendor="selectedVendor"
                    :showVendorDetails="showVendorDetails"
                    @edit-vendor="$emit('edit-vendor')"
                    @change-vendor="$emit('change-vendor')"
                />

                <ItemSummary
                    :functionalCurrency="functionalCurrency"
                    :selectedItems="selectedItems"
                    :totalAmount="selectedItemsTotalAmount"
                    :updateTaxOptions="updateItemsTaxOptions"
                    :selectedItemsTaxOptions="selectedItemsTaxOptions"
                    :selectedVendor="selectedVendor"
                    @edit-selected-item="editSelectedItem"
                    @add-another-item="$emit('add-another-item')"
                    @delete-item-from-list="$emit('delete-item-from-list', $event)"
                    @update-tax-options="$emit('update-tax-options', $event)"
                    @back-to-item-list="$emit('back-to-item-list', $event)"
                />
            </div>
        </transition>

        <!-- Payment Form -->
        <transition name="slide-up-fade" mode="out-in">
            <div class="payment-section__payment-form" key="payment-form">
                <PaymentForm
                    :selectedItemCount="selectedItemCount"
                    :transactionDate="transactionDate"
                    :functionalCurrency="functionalCurrency"
                    :totalAmount="selectedItemsTotalAmount"
                    :selectedVendor="selectedVendor"
                    :action="action"
                    @change-vendor="$emit('change-vendor')"
                    @process-expense-submission="$emit('process-expense-submission', $event)"
                />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import VendorCard from '@/pages/Spending/Expense/RecordExpense/v4/VendorCard.vue';
import ItemSummary from '@/pages/Spending/Expense/RecordExpense/v4/ItemSummary.vue';
import PaymentForm from '@/pages/Spending/Expense/RecordExpense/v4/PaymentForm.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    defaultItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';
import { Vendor, defaultVendor } from '@/types';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { VendorCard, ItemSummary, PaymentForm } })
export default class ExpensePaymentSection extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: '' }) readonly action!: string;
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ default: () => [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: true }) readonly showVendorDetails!: boolean;
    @Prop({ default: () => defaultItemsTotalAmount }) readonly selectedItemsTotalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: false }) readonly updateItemsTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;

    get selectedItemCount(): number {
        return this.selectedItems.length;
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
@import 'src/styles/pages/spending/expenses/record-expense/v4/payment-section';
</style>
