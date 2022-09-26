<template>
    <div>
        <div class="sale-item-list">
            <!-- Customer Details -->
            <CustomerCard
                v-if="!userIsOnMobile"
                :selectedCustomer="selectedCustomer"
                :isEstimate="isEstimate"
                @change-customer="$emit('change-customer')"
                @convert-estimate-to-sale="convertEstimateToSale"
                @selected-customer-updated="handleCustomerUpdate"
            />

            <!-- Item Details -->
            <transition name="slide-up-fade" mode="out-in">
                <div class="sale-item-list__items" v-if="!itemListIsExpty">
                    <div v-for="(item, index) in selectedItems" :key="index" class="mb-3">
                        <transition-group name="slide-up-fade" mode="out-in">
                            <div class="sale-item-list__items--details" key="item-details-left">
                                <p
                                    class="sale-item-list__items--name"
                                    title="Edit Item"
                                    @click="$emit('edit-selected-item', index, item)"
                                >
                                    {{ `${item.saleItemDetails.name} x ${item.saleItemDetails.quantity}` }}
                                    <span
                                        class="sale-item-list__items--mobile-edit"
                                        @click="$emit('edit-selected-item', index, item)"
                                    >
                                        <font-awesome-icon icon="pencil-alt" />
                                    </span>
                                </p>
                                <p class="sale-item-list__items--action" v-if="!editMode">
                                    <span @click="$emit('delete-item-from-list', index)">Delete</span>
                                </p>
                            </div>

                            <div class="sale-item-list__items--details" key="item-details-right">
                                <p :class="itemSupplyClass(item)">{{ itemSupplyStatus(item) }}</p>
                                <p class="sale-item-list__items--amount">
                                    {{ getLineAmount(item.saleItemDetails) | amountWithCurrency2 }}
                                </p>
                            </div>
                        </transition-group>
                    </div>

                    <!-- Sub Total Amount -->
                    <div class="sale-item-list__total">
                        <span>Sub Total</span>
                        <span>
                            {{ subTotal }}
                        </span>
                    </div>

                    <!-- Button -->
                    <b-row class="sale-item-list__footer">
                        <BasePrimaryButton
                            class="sale-item-list__footer--button"
                            :buttonText="proceedButtonText"
                            @button-clicked="proceedToPayment"
                        />

                        <BaseSecondaryButton
                            v-if="userIsOnMobile"
                            class="sale-item-list__footer--button mt-4"
                            buttonText="Add New Item"
                            @button-clicked="$emit('add-another-item')"
                        />

                        <BaseSecondaryButton
                            v-else-if="!isEstimate"
                            class="sale-item-list__footer--button mt-4"
                            buttonText="Generate Invoice"
                            :status="generateInvoiceStatus"
                            :disabled="disableFormButton"
                            @button-clicked="$emit('generate-no-payment-invoice')"
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

import CustomerCard from '@/pages/Sales/RecordSale/v4/CustomerCard.vue';
import TaxAndTotal from '@/pages/Sales/RecordSale/v4/TaxAndTotal.vue';
import { defaultCustomer, SaleCustomer } from '@/pages/Sales/types';

import { Status } from '@/types';
import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    defaultItemsTotalAmount,
    SaleItemDetails,
} from '@/pages/Sales/RecordSale/v4/types';

import UtilityMixins from '@/mixins/Utility';
import SalesMixin from '../../SalesMixin';

@Component({ components: { CustomerCard, TaxAndTotal } })
export default class SaleItemList extends Mixins(UtilityMixins, SalesMixin) {
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ required: true }) readonly selectedCurrencyKey!: number;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ default: [] }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ default: () => defaultItemsTotalAmount }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ required: true }) readonly editMode!: boolean;

    get itemListIsExpty(): boolean {
        return this.selectedItems.length < 1;
    }

    get proceedButtonText(): string {
        return this.isEstimate ? 'View Summary' : 'Proceed to Payment';
    }

    private convertEstimateToSale(lastSaleKey: string) {
        this.$emit('convert-estimate-to-sale', lastSaleKey);
    }

    private handleCustomerUpdate(updatedCustomer: SaleCustomer) {
        this.$emit('selected-customer-updated', updatedCustomer);
    }

    private getLineAmount(line: SaleItemDetails) {
        const amount = this.lineAmount(line.unitPrice.amount, line.quantity, line.discount);
        return { ...line.unitPrice, amount };
    }

    get generateInvoiceStatus(): Status {
        if (this.salesRequestStatus.generatePdf === Status.LOADING) return Status.LOADING;
        return this.salesRequestStatus.createSale;
    }

    get disableFormButton() {
        return (
            this.salesRequestStatus.createSale === Status.LOADING ||
            this.salesRequestStatus.updateSale === Status.LOADING ||
            this.salesRequestStatus.generatePdf === Status.LOADING
        );
    }

    get subTotal(): string {
        const amount = this.totalAmount.subTotal;
        const currencyKey = this.selectedCurrencyKey;
        return this.$options.filters.amountWithCurrency2({ currencyKey, amount });
    }

    private itemSupplyStatus(item: SelectedItemDetails): string {
        const { quantity, quantitySupplied } = item.saleItemDetails;
        return this.getSupplyStatus(quantity, quantitySupplied);
    }

    private itemSupplyClass(item: SelectedItemDetails): string {
        const baseClass = 'sale-item-list__items';
        const supplyStatus = this.itemSupplyStatus(item);
        if (supplyStatus === 'Supplied') return `${baseClass}--supplied`;
        if (supplyStatus === 'Partial Supply') return `${baseClass}--partial`;
        return `${baseClass}--pending`;
    }

    private proceedToPayment() {
        this.$emit('proceed-to-payment');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/item-list';
</style>
