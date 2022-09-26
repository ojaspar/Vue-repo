<template>
    <div class="product-summary-page__table-header">
        <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--icon"></div>
        <div
            :class="[
                isFullProductSummaryPage
                    ? 'product-summary-page__table-heading--number'
                    : 'product-summary-page__table-heading--number-truncated',
            ]"
        >
            #
        </div>

        <!-- item name -->
        <div
            :class="[
                isFullProductSummaryPage
                    ? 'product-summary-page__table-heading--item'
                    : 'product-summary-page__table-heading--item-truncated',
            ]"
        >
            Item
        </div>

        <!-- Price -->
        <div
            :class="[
                isFullProductSummaryPage
                    ? 'product-summary-page__table-heading--costing'
                    : 'product-summary-page__table-heading--costing-truncated',
            ]"
        >
            Price
        </div>

        <!-- sub total -->
        <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--sub-total">
            Sub Total
        </div>

        <!-- Total excl. vat -->

        <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--total-excluding-vat">
            Total Excl. VAT
        </div>

        <!-- VAT -->
        <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--vat">
            VAT
        </div>

        <!-- Total -->

        <div class="product-summary-page__table-heading--total" v-if="isFullProductSummaryPage">
            Total
        </div>

        <div
            v-if="!isEstimate"
            :class="[
                isFullProductSummaryPage
                    ? 'product-summary-page__table-heading--supply-status'
                    : 'product-summary-page__table-heading--supply-status-truncated',
            ]"
        >
            Supply Status
        </div>
        <div class="product-summary-page__table-heading--attachment-icon" v-if="isFullProductSummaryPage"></div>
        <div class="product-summary-page__table-heading--edit-icon" v-if="isFullProductSummaryPage"></div>
        <div class="product-summary-page__table-heading--delete-icon" v-if="isFullProductSummaryPage"></div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class ProductSummaryHeader extends Vue {
    @Prop({ default: false }) readonly isFullProductSummaryPage!: boolean;
    @Prop({ default: false }) readonly isEstimate!: boolean;
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/product-summary-header.scss';
</style>
