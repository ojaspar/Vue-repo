<template>
    <div>
        <div class="sale-item-summary">
            <div class="sale-item-summary__header">
                <span class="sale-item-summary__header--title">Item Summary</span>
                <span class="sale-item-summary__header--edit d-none" @click="goBackToItemList"><i>Edit</i></span>
            </div>

            <div class="sale-item-summary__body">
                <div v-for="(item, index) in selectedItems" :key="index" class="sale-item-summary__desktop">
                    <b-row class="sale-item-summary__item">
                        <b-col cols="4" class="pr-1 pl-1">
                            <p class="sale-item-summary__item--name">
                                {{ item.saleItemDetails.name }}
                            </p>
                            <p class="sale-item-summary__item--txt-small">
                                <i>{{ item.saleItemDetails.description }}</i>
                            </p>
                        </b-col>
                        <b-col cols="3" class="p-0">
                            <p class="sale-item-summary__item--amount">
                                {{ getLineAmount(item.saleItemDetails) | amountWithCurrency }}
                            </p>
                            <p class="sale-item-summary__item--txt-small">
                                {{ itemBreakdown(item) }}
                            </p>
                            <p class="sale-item-summary__item--txt-small" v-if="discountText(item)">
                                <i>Less</i> &nbsp; <span class="txt-black"> {{ discountText(item) }} </span> discount
                            </p>
                        </b-col>
                        <b-col class="p-0" v-if="!isEstimate">
                            <i :class="[itemSupplyClass(item)]">
                                {{ itemSupplyStatus(item) }}
                            </i>
                        </b-col>
                        <b-col class="sale-item-summary__right">
                            <span class="sale-item-summary__item--edit">
                                <i
                                    class="pointer mr-3"
                                    title="Edit item"
                                    @click="$emit('edit-selected-item', index, item)"
                                >
                                    Edit
                                </i>
                            </span>
                            <span
                                class="sale-item-summary__item--delete"
                                title="Delete item"
                                @click="$emit('delete-item-from-list', index)"
                                v-if="!editMode"
                            >
                                | <font-awesome-icon icon="trash-alt" />
                            </span>
                        </b-col>
                    </b-row>
                </div>

                <div class="sale-item-summary__mobile">
                    <div v-for="(item, index) in selectedItems" :key="index" class="sale-item-summary__item--mobile">
                        <div class="d-flex justify-content-between">
                            <p class="p-0 mb-1">
                                <span class="mr-2">
                                    {{ item.saleItemDetails.name }} x {{ item.saleItemDetails.quantity }}
                                </span>
                                |<span class="sale-item-summary__item--edit">
                                    <i class="ml-2" @click="$emit('edit-selected-item', index, item)">
                                        Edit
                                    </i>
                                </span>
                            </p>
                            <span
                                class="sale-item-summary__item--delete"
                                @click="$emit('delete-item-from-list', index)"
                            >
                                <font-awesome-icon icon="trash-alt" />
                            </span>
                        </div>

                        <div :class="[itemSupplyClass(item), 'd-flex justify-content-between']">
                            <span class="sale-item-summary__item--amount">
                                {{ getLineAmount(item.saleItemDetails) | amountWithCurrency2 }}
                            </span>
                            <i class="sale-item-summary__mobile--status" v-if="!isEstimate">
                                {{ itemSupplyStatus(item) }}
                            </i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sale-item-summary__footer" v-if="!editMode">
                <span v-if="userIsOnMobile" class="sale-item-summary__footer--link" @click="$emit('add-another-item')">
                    Add Another Item
                </span>
                <BaseSecondaryButton
                    v-else
                    class="sale-item-summary__footer--button"
                    buttonText="Add Another Item"
                    @button-clicked="$emit('add-another-item')"
                />
            </div>
        </div>

        <b-row class="sale-item-summary__bottom">
            <b-col v-if="!userIsOnMobile" cols="5" class="sale-item-summary__bottom--info">
                <span v-if="showSelectCustomerHint">
                    <p>
                        Kindly <b class="pointer" @click="$emit('change-customer')">select a customer</b> to enable part
                        payment, deduction of Withholding Tax or Invoice Generation
                    </p>
                </span>
            </b-col>
            <b-col class="sale-item-summary__bottom--total">
                <TaxAndTotal
                    :selectedCurrencyKey="selectedCurrencyKey"
                    :updateTaxOptions="updateTaxOptions"
                    :selectedItemsTaxOptions="selectedItemsTaxOptions"
                    :totalAmount="totalAmount"
                    :customerSelected="customerSelected"
                    :isEstimate="isEstimate"
                    @update-tax-options="$emit('update-tax-options', $event)"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import TaxAndTotal from '@/pages/Sales/RecordSale/v4/TaxAndTotal.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    SaleItemDetails,
} from '@/pages/Sales/RecordSale/v4/types';

import UtilityMixins from '@/mixins/Utility';
import { defaultCustomer, SaleCustomer } from '@/pages/Sales/types';
import SalesMixin from '@/pages/Sales/SalesMixin';

@Component({ components: { TaxAndTotal } })
export default class ItemSummary extends Mixins(UtilityMixins, SalesMixin) {
    @Prop({ required: true }) readonly selectedCurrencyKey!: number;
    @Prop({ required: true }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ required: true }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ default: false }) readonly updateTaxOptions!: boolean;
    @Prop({ required: false }) readonly isEstimate!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;
    @Prop({ required: true }) readonly editMode!: boolean;

    get customerSelected() {
        return this.selectedCustomer.name.length > 0;
    }

    get showSelectCustomerHint(): boolean {
        return !this.isEstimate && !this.customerSelected;
    }

    private getLineAmount(line: SaleItemDetails) {
        const amount = this.lineAmount(line.unitPrice.amount, line.quantity, line.discount);
        return { ...line.unitPrice, amount };
    }

    private itemSupplyStatus(item: SelectedItemDetails): string {
        const { quantity, quantitySupplied } = item.saleItemDetails;
        return this.getSupplyStatus(quantity, quantitySupplied);
    }

    private itemSupplyClass(item: SelectedItemDetails): string {
        const baseClass = 'sale-item-summary__item';
        const supplyStatus = this.itemSupplyStatus(item);
        if (supplyStatus === 'Supplied') return `${baseClass}--supplied`;
        if (supplyStatus === 'Partial Supply') return `${baseClass}--partial`;
        return `${baseClass}--pending`;
    }

    private itemBreakdown(item: SelectedItemDetails): string {
        const { quantity, unitPrice, measurementType } = item.saleItemDetails;
        const currencyKey = unitPrice.currencyKey;
        const formattedAmount = this.$options.filters.amountWithCurrency({ currencyKey, amount: unitPrice.amount });
        return `${quantity} x ${formattedAmount} / ${measurementType}`;
    }

    private discountText(item: SelectedItemDetails): string {
        const { discount, unitPrice } = item.saleItemDetails;

        if (!discount) return '';

        const currencyKey = unitPrice.currencyKey;
        return this.$options.filters.amountWithCurrency({ currencyKey, amount: discount });
    }

    private goBackToItemList() {
        this.$emit('back-to-item-list');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/item-summary-page';
</style>
