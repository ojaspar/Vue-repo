<template>
    <div class="expense-mobile-item-selection w-100">
        <FormattedDatePicker :defaultDate="transactionDate" @date-selected="handleDateSelection" />

        <VendorCard
            :selectedVendor="selectedVendor"
            @edit-vendor="$emit('edit-vendor')"
            @change-vendor="$emit('change-vendor')"
        />

        <transition name="slide-up-fade" mode="out-in">
            <ItemDetailsForm
                v-if="displayItemDetailsForm"
                class="expense-mobile-item-selection__item-details"
                :functionalCurrency="functionalCurrency"
                :transactionDate="transactionDate"
                :selectedVendor="selectedVendor"
                :itemIsEditing="itemIsEditing"
                :itemToBeEdited="itemToBeEdited"
                @add-item-to-list="emitSelectedItem"
                @display-vendor-list="$emit('display-vendor-list')"
                @update-transaction-date="$emit('update-transaction-date', $event)"
            />
        </transition>

        <transition name="slide-up-fade" mode="out-in">
            <ItemList
                v-if="displaySelectedItems"
                :selectedItems="selectedItems"
                :functionalCurrency="functionalCurrency"
                :updateTaxOptions="updateItemsTaxOptions"
                :selectedItemsTaxOptions="selectedItemsTaxOptions"
                :totalAmount="selectedItemsTotalAmount"
                @edit-selected-item="emitEditingItem"
                @add-another-item="$emit('add-another-item')"
                @delete-item-from-list="$emit('delete-item-from-list')"
                @update-tax-options="$emit('update-tax-options', $event)"
                @proceed-to-payment="proceedToPayment"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import VendorCard from '@/pages/Spending/Expense/RecordExpense/v4/VendorCard.vue';
import ItemDetailsForm from '@/pages/Spending/Expense/RecordExpense/v4/ItemDetailsForm.vue';
import ItemList from '@/pages/Spending/Expense/RecordExpense/v4/ItemList.vue';

import {
    ExpenseItemDetails,
    SelectedItemDetails,
    defaultSelectedItems,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';
import { Vendor, defaultVendor } from '@/types';
import { ExpenseItemType } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { VendorCard, ItemDetailsForm, ItemList } })
export default class ExpenseMobileItemSelection extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: () => [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ required: true }) readonly selectedItemsTotalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: false }) readonly itemIsEditing!: boolean;
    @Prop({ default: () => defaultSelectedItems }) readonly itemToBeEdited!: SelectedItemDetails;
    @Prop({ default: false }) readonly updateItemsTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;
    @Prop({ default: false }) readonly showItemList!: boolean;

    private displaySelectedItems = false;
    private displayItemDetailsForm = true;

    private handleDateSelection(selectedDate: string) {
        this.$emit('update-transaction-date', selectedDate);
    }

    private emitSelectedItem(selectedExpenseItem: ExpenseItemType, expenseItemDetails: ExpenseItemDetails) {
        this.$emit('add-item-to-list', selectedExpenseItem, expenseItemDetails);
    }

    private proceedToPayment() {
        this.$emit('proceed-to-payment');
    }

    private emitEditingItem(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        this.$emit('edit-selected-item', itemIndex, itemToBeEdited);
    }

    private showSelectedItems() {
        this.displayItemDetailsForm = false;
        setTimeout(() => {
            this.displaySelectedItems = true;
        }, 200);
    }

    private showItemDetailsForm() {
        this.displaySelectedItems = false;
        setTimeout(() => {
            this.displayItemDetailsForm = true;
        }, 200);
    }

    @Watch('showItemList', { immediate: true })
    update(showItemList: boolean) {
        if (showItemList) {
            this.showSelectedItems();
            return;
        }
        this.showItemDetailsForm();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/mobile-item-selection';
</style>
