<template>
    <div>
        <div class="estimate-table__large">
            <b-row class="estimate-table__heading">
                <span class="mr-3">#</span>
                <b-col>Item</b-col>
                <b-col>Price</b-col>
                <b-col>Total</b-col>
                <b-col>Notes</b-col>
            </b-row>

            <div class="estimate-table__body">
                <b-row class="estimate-table__details" v-for="(product, index) in sales.products" :key="index">
                    <span class="mr-3">{{ index + 1 }}</span>
                    <b-col>{{ product.productName }} </b-col>
                    <b-col>{{ getItemPrice(product) }}</b-col>
                    <b-col> {{ currencySymbol(product) }} {{ totalExcludingDiscount(product) | formatMoney }} </b-col>
                    <b-col>{{ product.notes }}</b-col>
                </b-row>

                <div class="estimate-table__total">
                    Total
                    <span class="estimate-table__total--amount"> {{ sales.totalAmount | amountWithCurrency }} </span>
                </div>
            </div>
        </div>

        <div class="estimate-table__mobile">
            <MobileHeader :customerName="sales.customer.name" />

            <div class="estimate-table__mobile--buttons">
                <BasePrimaryButton buttonText="Convert to Sale" @button-clicked="$emit('convert-estimate')" />
                <BaseActionButton
                    :actions="mobileActions"
                    @duplicate-transaction="$emit('duplicate-transaction')"
                    @edit-price-quotation="$emit('edit-price-quotation')"
                    @generate-receipt="$emit('generate-receipt')"
                />
            </div>

            <div class="estimate-table__mobile-content" v-for="(product, index) in sales.products" :key="index">
                <div>
                    <p>
                        {{ product.productName }}
                        <span class="estimate-table__mobile-content--grey"> x {{ product.quantity }} </span>
                    </p>
                </div>
                <div class="d-flex justify-content-between">
                    <p>{{ getItemPrice(product) }}</p>
                    <p>{{ currencySymbol(product) }} {{ totalExcludingDiscount(product) | formatMoney }}</p>
                </div>
            </div>

            <div class="estimate-table__total">
                Total <span class="estimate-table__total--amount"> {{ sales.totalAmount | amountWithCurrency }} </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Mixins, Prop } from 'vue-property-decorator';

import { SaleDetails, ProductInProductDetailsForm } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import SalesMixin from '@/pages/Sales/SalesMixin';

interface EstimateItem {
    name: string;
    quantity: number;
    unit: string;
    amount: { currencyKey: number; amount: number };
    notes: string;
}

@Component
export default class EstimateTable extends Mixins(UtilityMixins, SalesMixin) {
    @Prop({ required: true }) readonly sales!: SaleDetails;

    private mobileActions = [
        { name: 'Duplicate Transaction', event: 'duplicate-transaction' },
        { name: 'Edit Price Quotation', event: 'edit-price-quotation' },
        { name: 'Generate Receipt', event: 'generate-receipt' },
        { name: 'Cancel Sale', event: 'cancel-sale' },
    ];

    private getItemPrice(product: ProductInProductDetailsForm): string {
        const { quantity, unitPrice, measurementTypeName } = product;
        const itemAmount = this.$options.filters.amountWithCurrency(unitPrice);
        return `${quantity} x ${itemAmount} / ${measurementTypeName}`;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/manage-estimates/estimate-table';
</style>
