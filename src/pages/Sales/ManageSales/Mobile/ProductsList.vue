<template>
    <div>
        <div
            v-if="salesRequestStatus.getSaleDetails === 'LOADING'"
            class="manage-sale-mobile__loader-container mt-5 text-center"
        >
            <Loader size="4" />
        </div>
        <div v-else v-for="(product, index) in saleDetails.products" :key="index">
            <ShowResourceOnClick>
                <template v-slot:content-on-same-level-as-dropdown-icon>
                    <span class="manage-sale-mobile__text--black">{{ product.productName }}</span>
                </template>

                <template v-slot:extra-content-in-top-section>
                    <b-row class="manage-sale-mobile__supply-status-section">
                        <b-col v-if="product.quantity" class="manage-sale-mobile__text--black">
                            {{ product.quantity }} x {{ currencySymbol(product) }}
                            {{ product.unitPrice.amount | formatMoney }}/{{ product.measurementTypeName }}</b-col
                        >
                        <b-col v-else class="manage-sale-mobile__text--black"
                            >{{ currencySymbol(product) }} {{ totalExcludingDiscount(product) | formatMoney }}</b-col
                        >
                        <b-col :class="calculateSupplyStatusTextClass('manage-sale-mobile__status-text', product)">{{
                            supplyStatus(product)
                        }}</b-col>
                    </b-row>
                </template>

                <template v-slot:drop-down-content>
                    <!-- Subtotal -->
                    <b-row key="amount">
                        <b-col cols="12" class="manage-sale-mobile__text--black">
                            <span class="manage-sale-mobile__text--black">Amount: </span>
                            {{ currencySymbol(product) }} {{ totalExcludingDiscount(product) | formatMoney }}
                        </b-col></b-row
                    >

                    <!-- Vat section -->
                    <b-row key="vat">
                        <b-col cols="12" class="manage-sale-mobile__text--black">
                            {{ currencySymbol(product) }} {{ totalExcludingDiscount(product) | formatMoney
                            }}<span class="manage-sale-mobile__text--grey"> Excl.</span> + {{ currencySymbol(product) }}
                            {{ product.vat }}
                            <span class="manage-sale-mobile__text--grey">VAT</span>
                        </b-col></b-row
                    >

                    <!-- Total section and VAT type -->
                    <b-row key="total">
                        <b-col
                            ><div class="manage-sale-mobile__text--black manage-sale-mobile__dropdown-total">
                                Total: {{ currencySymbol(product) }} {{ productTotal(product) | formatMoney }}
                            </div>
                        </b-col>
                    </b-row>

                    <!-- Notes and Files -->
                    <b-row key="notes">
                        <b-col cols="12" class="manage-sale-mobile__text--grey manage-sale-mobile__notes-text"
                            >Notes: {{ product.notes }}</b-col
                        >
                        <b-col
                            v-if="itemStillHasOutstandingSupply(product)"
                            class="manage-sale-mobile__supply-text"
                            @click.stop="handleUpdateSupplyClick(product)"
                            ><img src="@/assets/img/update-icon-blue.svg" />Update Supply</b-col
                        >
                        <b-col cols="12" v-if="false">File: ...</b-col>
                    </b-row>
                </template>
            </ShowResourceOnClick>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import SalesMixin from '@/pages/Sales/SalesMixin';
import CurrencyMixins from '@/mixins/currency';

import { ProductInProductDetailsForm } from '@/pages/Sales/types';

@Component
export default class ItemsList extends Mixins(SalesMixin, CurrencyMixins) {
    private productTotal(product: ProductInProductDetailsForm): number {
        const productTotal = product.quantity * Number(product.unitPrice.amount) - Number(product.discount.amount);

        return productTotal;
    }

    private itemStillHasOutstandingSupply({ quantitySupplied, quantity }: ProductInProductDetailsForm): boolean {
        return quantity > quantitySupplied;
    }

    private handleUpdateSupplyClick(product: ProductInProductDetailsForm) {
        this.$parent.$emit('update-supply', product);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/manage-sales/mobile.scss';
</style>
