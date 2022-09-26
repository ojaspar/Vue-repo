<template>
    <div class="sale-item-summary-card">
        <div class="sale-item-summary-card__item-details-section">
            <p class="sale-item-summary-card__item-text">{{ productDetails.name }}</p>
            <p class="sale-item-summary-card__item-text">
                <span v-if="productDetails.measurementType">
                    {{ productDetails.quantity }} X {{ productDetails.unitPrice | amountWithCurrency }} /
                    {{ productDetails.measurementType }}
                </span>
                <span v-else>
                    {{ productDetails.unitPrice | amountWithCurrency }}
                </span>
            </p>
            <p
                class="sale-item-summary-card__item-text sale-item-summary-card__discount-text"
                v-if="productDetails.discount.amount > 0"
            >
                <span class="sale-item-summary-card__item-text sale-item-summary-card__discount-text--italic"
                    >less</span
                >
                {{ productDetails.discount | amountWithCurrency }}
            </p>
        </div>
        <div class="sale-item-summary-card__edit-item-icon-section" v-if="canEdit" @click="$emit('edit-icon-clicked')">
            <img src="@/assets/img/pencil-icon.svg" class="sale-item-summary-card__edit-item-icon" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';

import { SalesItemSummary } from '@/pages/Sales/types';

@Component
export default class SalesItemSummaryCard extends Mixins(UtilityMixins) {
    @Prop({
        default: () => ({
            name: '',
            unitPrice: { amount: 0, currencyKey: 0 },
            measurementType: '',
            quantity: 1,
            discount: { amount: 0, currencyKey: 0 },
        }),
    })
    productDetails!: SalesItemSummary;
    @Prop({ default: false }) canEdit!: boolean;
}
</script>

<style lang="scss">
.sale-item-summary-card {
    border: 1px solid $dark-grey-1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 11px 16px;
    border-radius: 4px;
    box-shadow: $input-box-shadow;
    background: #f7f7f7;
    &__item-text {
        font-size: 14px;
        margin-bottom: 9px;
    }
    &__discount-text {
        color: $dark-grey-1;
        &--italic {
            font-style: italic;
            margin-right: 5px;
        }
    }
    &__edit-item-icon {
        cursor: pointer;
    }
}
</style>
