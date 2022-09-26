<template>
    <div>
        <div class="expense-item-list">
            <!-- Vendor Details -->
            <VendorCard
                v-if="!userIsOnMobile"
                :selectedVendor="selectedVendor"
                @change-vendor="$emit('change-vendor')"
                @selected-vendor-updated="handleVendorUpdate"
            />

            <!-- Item Details -->
            <transition name="slide-up-fade" mode="out-in">
                <div class="expense-item-list__items" v-if="!itemListIsExpty">
                    <div v-for="(item, index) in selectedItems" :key="index" class="mb-3">
                        <transition-group name="slide-up-fade" mode="out-in">
                            <div class="expense-item-list__items--details" key="item-details-left">
                                <p
                                    class="expense-item-list__items--name"
                                    title="Edit Item"
                                    @click="$emit('edit-selected-item', index, item)"
                                >
                                    {{ `${item.expenseItemDetails.name} x ${item.expenseItemDetails.quantity}` }}
                                    <span
                                        class="expense-item-list__items--mobile-edit"
                                        @click="$emit('edit-selected-item', index, item)"
                                    >
                                        <font-awesome-icon icon="pencil-alt" />
                                    </span>
                                </p>
                                <p class="expense-item-list__items--action">
                                    <span @click="$emit('delete-item-from-list', index)">Delete</span>
                                </p>
                            </div>

                            <div class="expense-item-list__items--details" key="item-details-right">
                                <p :class="itemDeliveryClass(item)">{{ itemDeliveryStatus(item) }}</p>
                                <p class="expense-item-list__items--amount">
                                    {{ item.expenseItemDetails.amount | amountWithCurrency }}
                                </p>
                            </div>
                        </transition-group>
                    </div>

                    <!-- Sub Total Amount -->
                    <div class="expense-item-list__total">
                        <span>Sub Total</span>
                        <span>
                            {{ subTotal }}
                        </span>
                    </div>

                    <!-- Button -->
                    <b-row class="expense-item-list__footer">
                        <BasePrimaryButton
                            class="expense-item-list__footer--button"
                            buttonText="Proceed to Payment"
                            @button-clicked="proceedToPayment"
                        />

                        <BaseSecondaryButton
                            v-if="userIsOnMobile"
                            class="expense-item-list__footer--button mt-4"
                            buttonText="Add New Item"
                            @button-clicked="$emit('add-another-item')"
                        />
                    </b-row>
                    <b-row class="item-details-form__footer"> </b-row>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import VendorCard from '@/pages/Spending/Expense/RecordExpense/v4/VendorCard.vue';
import TaxAndTotal from '@/pages/Spending/Expense/RecordExpense/v4/TaxAndTotal.vue';

import { Vendor, defaultVendor } from '@/types';
import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    defaultItemsTotalAmount,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { VendorCard, TaxAndTotal } })
export default class ExpenseItemList extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ default: () => defaultItemsTotalAmount }) readonly totalAmount!: SelectedItemsTotalAmount;

    get itemListIsExpty(): boolean {
        return this.selectedItems.length < 1;
    }

    get subTotal(): string {
        const amount = this.totalAmount.subTotal;
        const currencyKey = Number(this.functionalCurrency);
        return this.$options.filters.amountWithCurrency({ currencyKey, amount });
    }

    private itemDeliveryStatus(item: SelectedItemDetails): string {
        const { quantity, quantityReceived } = item.expenseItemDetails;
        if (quantity === quantityReceived) return 'Delivered';
        return quantityReceived > 0 ? 'Partially Delivered' : 'Not Delivered';
    }

    private itemDeliveryClass(item: SelectedItemDetails): string {
        const baseClass = 'expense-item-list__items';
        const deliveryStatus = this.itemDeliveryStatus(item);
        if (deliveryStatus.toLowerCase() === 'delivered') return `${baseClass}--delivered`;
        if (deliveryStatus.toLowerCase() === 'partially delivered') return `${baseClass}--partial`;
        return `${baseClass}--pending`;
    }

    private proceedToPayment() {
        this.$emit('proceed-to-payment');
    }

    private handleVendorUpdate(updatedVendor: Vendor) {
        this.$emit('selected-vendor-updated', updatedVendor);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/item-list';
</style>
