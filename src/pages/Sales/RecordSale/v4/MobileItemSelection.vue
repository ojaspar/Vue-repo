<template>
    <div class="sale-mobile-item-selection w-100">
        <FormattedDatePicker :defaultDate="transactionDate" @date-selected="handleDateSelection" />

        <CustomerCard
            :selectedCustomer="selectedCustomer"
            :isEstimate="isEstimate"
            @convert-estimate-to-sale="convertEstimateToSale"
            @edit-customer="$emit('edit-customer')"
            @change-customer="$emit('change-customer')"
            @selected-customer-updated="handleCustomerUpdate"
        />

        <transition name="slide-up-fade" mode="out-in">
            <ItemDetailsForm
                v-if="displayItemDetailsForm"
                class="sale-mobile-item-selection__item-details"
                :functionalCurrency="functionalCurrency"
                :transactionDate="transactionDate"
                :selectedCustomer="selectedCustomer"
                :itemIsEditing="itemIsEditing"
                :itemToBeEdited="itemToBeEdited"
                :isEstimate="isEstimate"
                @add-item-to-list="emitSelectedItem"
                @display-customer-list="$emit('display-customer-list')"
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
                :isEstimate="isEstimate"
                @edit-selected-item="emitEditingItem"
                @add-another-item="$emit('add-another-item')"
                @delete-item-from-list="$emit('delete-item-from-list')"
                @update-tax-options="$emit('update-tax-options', $event)"
                @proceed-to-payment="proceedToPayment"
                @generate-no-payment-invoice="$emit('generate-no-payment-invoice')"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import CustomerCard from '@/pages/Sales/RecordSale/v4/CustomerCard.vue';
import ItemDetailsForm from '@/pages/Sales/RecordSale/v4/ItemDetailsForm.vue';
import ItemList from '@/pages/Sales/RecordSale/v4/ItemList.vue';

import {
    SaleItemDetails,
    SelectedItemDetails,
    defaultSelectedItems,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
} from '@/pages/Sales/RecordSale/v4/types';
import { Product, defaultCustomer, SaleCustomer } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { CustomerCard, ItemDetailsForm, ItemList } })
export default class SaleMobileItemSelection extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ default: () => [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ required: true }) readonly selectedItemsTotalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: false }) readonly itemIsEditing!: boolean;
    @Prop({ default: () => defaultSelectedItems }) readonly itemToBeEdited!: SelectedItemDetails;
    @Prop({ default: false }) readonly updateItemsTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;
    @Prop({ default: false }) readonly showItemList!: boolean;

    private displaySelectedItems = false;
    private displayItemDetailsForm = true;

    private convertEstimateToSale(lastSaleKey: string) {
        this.$emit('convert-estimate-to-sale', lastSaleKey);
    }

    private handleCustomerUpdate(updatedCustomer: SaleCustomer) {
        this.$emit('selected-customer-updated', updatedCustomer);
    }

    private handleDateSelection(selectedDate: string) {
        this.$emit('update-transaction-date', selectedDate);
    }

    private emitSelectedItem(selectedProduct: Product, saleItemDetails: SaleItemDetails) {
        this.$emit('add-item-to-list', selectedProduct, saleItemDetails);
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
@import 'src/styles/pages/sales/record-sale/v4/mobile-item-selection';
</style>
