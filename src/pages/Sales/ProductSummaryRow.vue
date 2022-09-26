<template>
    <div class="product-summary-page__row">
        <div class="product-summary-page__table-body">
            <div class="product-summary-page__table-heading--icon" v-if="isFullProductSummaryPage">
                <img src="@/assets/img/drag-icon.svg" class="product-summary-page__drag-icon" />
            </div>
            <!-- Product S/N -->
            <div
                :class="[
                    isFullProductSummaryPage
                        ? 'product-summary-page__table-heading--number'
                        : 'product-summary-page__table-heading--number-truncated',
                    '',
                ]"
            >
                {{ index + 1 }}
            </div>

            <!-- Product Name -->
            <div
                :class="[
                    isFullProductSummaryPage
                        ? 'product-summary-page__table-heading--item'
                        : 'product-summary-page__table-heading--item-truncated',
                ]"
            >
                {{ productSummary.productName }}
            </div>

            <!-- Product Price -->
            <div
                v-if="productSummary.measurementUnit"
                class="d-flex flex-column"
                :class="[
                    isFullProductSummaryPage
                        ? 'product-summary-page__table-heading--costing'
                        : 'product-summary-page__table-heading--costing-truncated',
                ]"
            >
                <span>
                    {{ productSummary.quantity }} x {{ productSummary.unitPrice | amountWithCurrency }} /
                    {{ productSummary.measurementUnit && productSummary.measurementUnit }}
                </span>
                <span class="text--grey">Less {{ productSummary.discount | amountWithCurrency }} Discount</span>
            </div>

            <div
                :class="[
                    isFullProductSummaryPage
                        ? 'product-summary-page__table-heading--costing'
                        : 'product-summary-page__table-heading--costing-truncated',
                ]"
                v-else
            >
                <span>{{ productSummary.unitPrice | amountWithCurrency }}</span>
                <span class="text--grey">Less {{ productSummary.discount | amountWithCurrency }} Discount</span>
            </div>

            <!-- Subtotal -->
            <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--sub-total">
                {{ productSummary.subTotal | amountWithCurrency }}
            </div>

            <!-- Total exclusive vat -->
            <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--total-excluding-vat">
                {{ productSummary.totalExclusiveVat | amountWithCurrency }}
            </div>

            <!-- vat -->
            <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--vat">
                {{ productSummary.vatAmount | amountWithCurrency }}
            </div>

            <!-- Total -->
            <div v-if="isFullProductSummaryPage" class="product-summary-page__table-heading--total">
                {{ productTotal | amountWithCurrency }}
            </div>

            <div
                v-if="!isEstimate"
                :class="[
                    isFullProductSummaryPage
                        ? 'product-summary-page__table-heading--supply-status'
                        : 'product-summary-page__table-heading--supply-status-truncated',
                ]"
            >
                <p class="product-summary-page__table-heading__status-text" :class="supplyStatusClass">
                    {{ productSummary.supplyStatus }}
                </p>
            </div>

            <div class="product-summary-page__table-heading__icons">
                <div class="product-summary-page__table-heading--attachment-icon" v-if="false">
                    <img src="@/assets/img/attachment.svg" class="product-summary-page__attachment-icon" />
                </div>

                <div
                    class="product-summary-page__table-heading--edit-icon pointer"
                    v-if="isFullProductSummaryPage"
                    @click="editProduct"
                >
                    <img src="@/assets/img/pencil.svg" class="product-summary-page__edit-icon" />
                </div>

                <div
                    class="product-summary-page__table-heading--delete-icon pointer"
                    v-if="isFullProductSummaryPage"
                    @click="$emit('delete-sale-item', index)"
                >
                    <img src="@/assets/img/trash-black-2.svg" class="product-summary-page__delete-icon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { ProductSummary, ProductSummaryDefault } from '@/pages/Sales/types';
import { MoneyObject } from '@/types';

@Component
export default class ProductSummaryRow extends Vue {
    @Prop({ default: false }) readonly isFullProductSummaryPage!: boolean;
    @Prop({ default: () => ProductSummaryDefault }) readonly productSummary!: ProductSummary;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: false }) readonly isEstimate!: boolean;

    get supplyStatusClass(): string {
        const { supplyStatus } = this.productSummary;
        const baseClass = 'product-summary-page__table-heading__status-text';

        if (supplyStatus.toLowerCase().match(/pending/)) {
            return `${baseClass}--pending`;
        }

        if (supplyStatus.toLowerCase().match(/supplied/)) {
            return `${baseClass}--supplied`;
        }

        if (supplyStatus.toLowerCase().match(/cancelled/)) {
            return `${baseClass}--cancelled`;
        }

        return `${baseClass}--none`;
    }

    get productTotal(): MoneyObject {
        const { totalExclusiveVat, vatAmount } = this.productSummary;

        return {
            amount: Number(totalExclusiveVat.amount) + Number(vatAmount.amount),
            currencyKey: vatAmount.currencyKey,
        };
    }

    private editProduct() {
        this.$emit('edit-sale-item', this.index);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/product-summary-row.scss';
</style>
