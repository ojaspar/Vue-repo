<template>
    <b-container fluid>
        <b-row class="ms-tablet-plus-index__mid-section-table-header">
            <b-col cols="1">
                #
            </b-col>
            <b-col cols="3">
                Item
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'">
                Price
            </b-col>

            <b-col cols="2">
                Total
            </b-col>

            <b-col cols="2" v-if="userIsOnDesktop">
                Notes
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'">
                Supply Status
            </b-col>
        </b-row>
        <div v-if="salesRequestStatus.getSaleDetails === 'LOADING'" class="ms-tablet-plus-index__loader-container">
            <Loader size="4" />
        </div>
        <b-row
            v-else
            class="ms-tablet-plus-index__mid-section-table-body"
            v-for="(product, index) in saleDetails.products"
            :key="index"
        >
            <b-col cols="1">
                {{ index + 1 }}
            </b-col>

            <b-col cols="3">
                {{ product.productName }}
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'">
                <p class="mb-0">{{ itemBreakdown(product) }}</p>
                <p class="txt-12 txt-grey-8 my-0" v-if="discountText(product)">
                    <i>Less</i> <span class="txt-black mx-1"> {{ discountText(product) }} </span> discount
                </p>
            </b-col>

            <b-col cols="2">{{ netAmount(product) }} </b-col>

            <b-col cols="2" class="ms-tablet-plus-index__table-text--grey" v-if="userIsOnDesktop">
                {{ product.notes }}
            </b-col>

            <b-col :cols="userIsOnDesktop ? '2' : '3'" class="d-flex align-items-start">
                <span
                    :class="calculateSupplyStatusTextClass('p-0 ms-tablet-plus-index__supply-status', product)"
                    class="mr-4"
                    >{{ supplyStatus(product) }}</span
                >
                <span
                    class="pointer"
                    v-if="itemStillHasOutstandingSupply(product)"
                    @click="$parent.$emit('update-supply', product)"
                    ><img src="@/assets/img/refresh-update.svg"
                /></span>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';
import SalesMixin from '@/pages/Sales/SalesMixin';

import { ProductInProductDetailsForm } from '@/pages/Sales/types';

@Component
export default class ProductsListTable extends Mixins(UtilityMixins, SalesMixin) {
    private itemStillHasOutstandingSupply({ quantitySupplied, quantity }: ProductInProductDetailsForm): boolean {
        return quantity > quantitySupplied;
    }

    private itemBreakdown(item: ProductInProductDetailsForm): string {
        const { quantity, unitPrice, measurementTypeName } = item;
        const currencyKey = unitPrice.currencyKey;
        const formattedAmount = this.$options.filters.amountWithCurrency({ currencyKey, amount: unitPrice.amount });
        return `${quantity} x ${formattedAmount} / ${measurementTypeName}`;
    }

    private discountText(item: ProductInProductDetailsForm): string {
        const { discount } = item;

        if (!discount) return '';

        if (!discount.amount) return '';

        return this.$options.filters.amountWithCurrency(discount);
    }

    private netAmount(item: ProductInProductDetailsForm): string {
        const amount = this.productNetAmount(item);
        const { currencyKey } = item.unitPrice;
        return this.$options.filters.amountWithCurrency({ amount, currencyKey });
    }
}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__supply-status {
        &--red {
            color: $notification-red;
        }
        &--yellow {
            color: $primary-yellow;
        }
        &--green {
            color: $primary-green;
        }
    }
    &__loader-container {
        margin: 10px auto;
        text-align: center;
    }
    &__update-section {
        display: flex;
        align-items: center;
        font-style: italic;
        font-size: 12px;
        color: $primary-color;
    }
    &__update-text {
        margin-left: 4px;
        cursor: pointer;
    }
    &__table-text {
        &--grey {
            color: $dark-grey-1;
            font-size: 14px;
        }
    }
}
</style>
