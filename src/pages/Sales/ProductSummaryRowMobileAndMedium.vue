<template>
    <div class="product-summary-page__card-container pointer" @click="toggleFullDetailsVisibility">
        <!-- Product Name and Icon -->
        <b-row class="product-summary-page__mobile">
            <b-col class="product-summary-page__mobile--product-name">{{ productSummary.productName }}</b-col>
            <b-col class="product-summary-page__mobile--dropdown-icon"
                ><font-awesome-icon :icon="dropdownIcon" aria-hidden="true"
            /></b-col>
        </b-row>

        <!-- Product Price and Supply Status -->
        <b-row class="product-summary-page__mobile">
            <b-col v-if="productSummary.measurementUnit">
                {{ productSummary.quantity }} x {{ productSummary.unitPrice | amountWithCurrency }} /
                {{ productSummary.measurementUnit && productSummary.measurementUnit }}</b-col
            >
            <b-col v-else>{{ productSummary.unitPrice | amountWithCurrency }}</b-col>
            <b-col
                class="product-summary-page__table-heading__status-text product-summary-page__mobile--status-text"
                :class="supplyStatusClass"
                >{{ productSummary.supplyStatus }}</b-col
            >
        </b-row>

        <transition-group name="slide-up-fade">
            <template v-if="showFullDetails">
                <!-- Discount -->
                <b-row key="discount" class="product-summary-page__mobile">
                    <b-col cols="12" class="text--grey" v-if="productSummary.discount.amount > 0">
                        <span class="product-summary-page__text--italics">less</span>
                        {{ productSummary.discount | amountWithCurrency }} discount
                    </b-col>
                </b-row>

                <!-- Subtotal -->
                <b-row key="subtotal" class="product-summary-page__mobile">
                    <b-col cols="12">
                        <span class="product-summary-page__text">Amount: </span>
                        {{ productSummary.subTotal | amountWithCurrency }}
                    </b-col></b-row
                >

                <!-- Vat section -->
                <b-row key="vat" class="product-summary-page__mobile">
                    <b-col cols="12">
                        {{ productSummary.totalExclusiveVat | amountWithCurrency
                        }}<span class="product-summary-page__text--italics text--grey"> Excl.</span> +
                        {{ productSummary.vatAmount | amountWithCurrency }}
                        <span class="product-summary-page__text--italics text--grey">VAT</span>
                    </b-col></b-row
                >

                <!-- Total section and VAT type -->
                <b-row key="total" class="product-summary-page__mobile product-summary-page__total-amount-row">
                    <b-col class="p-0"
                        ><span class="product-summary-page__total-amount">
                            Total: {{ productTotal | amountWithCurrency }}</span
                        >
                    </b-col>
                    <b-col class="text-right text--grey">{{ vatType }}</b-col>
                </b-row>

                <!-- Notes and Files -->
                <b-row class="product-summary-page__mobile text--grey" key="notes">
                    <b-col cols="12" class="product-summary-page__table-heading--item"
                        >Notes: {{ productSummary.notes }}</b-col
                    >
                    <b-col cols="12" class="product-summary-page__table-heading--notes-body" v-if="false"
                        >File: {{ productSummary.files }}</b-col
                    >
                </b-row>

                <!-- Edit and Delete Icons -->
                <b-row key="icons" class="product-summary-page__mobile--icons-section">
                    <b-col class="product-summary-page__mobile--edit" @click.stop="$emit('edit-sale-item', index)">
                        <img src="@/assets/img/pencil.svg" class="product-summary-page__mobile--edit-icon" />Edit</b-col
                    >
                    <b-col class="product-summary-page__mobile--delete" @click.stop="$emit('delete-sale-item', index)">
                        <img
                            src="@/assets/img/cancel-icon.svg"
                            class="product-summary-page__mobile--delete-icon"
                        />Delete</b-col
                    >
                </b-row>
            </template>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ProductSummary } from '@/pages/Sales/types';
import { MoneyObject } from '@/types';

const productSummary: ProductSummary = {
    productKey: '',
    productName: '',
    unitPrice: { amount: 0, currencyKey: 0 },
    quantity: 1,
    measurementUnit: '',
    notes: '',
    files: [],
    subTotal: { amount: 0, currencyKey: 0 },
    measurementTypeKey: '',
    supplyStatus: '',
    discount: { amount: 0, currencyKey: 0 },
    vatAmount: { amount: 0, currencyKey: 0 },
    totalExclusiveVat: { amount: 0, currencyKey: 0 },
    vatType: 'None',
};

@Component
export default class ProductSummaryRowMobileAndMedium extends Vue {
    @Prop({ default: () => productSummary }) readonly productSummary!: ProductSummary;
    @Prop({ default: '' }) readonly clickedProductSummaryIndex!: number;
    @Prop({ required: true }) readonly index!: number;

    get supplyStatusClass(): string {
        const { supplyStatus } = this.productSummary;

        const baseClass = 'product-summary-page__table-heading__status-text';

        if (supplyStatus.toLowerCase().match(/pending/)) {
            return `${baseClass}--pending`;
        }

        if (supplyStatus.toLowerCase().match(/supplied/)) {
            return `${baseClass}--supplied`;
        }

        return `${baseClass}--none`;
    }

    get showFullDetails(): boolean {
        return this.index === this.clickedProductSummaryIndex;
    }

    get dropdownIcon(): string {
        return this.showFullDetails ? 'chevron-up' : 'chevron-down';
    }

    get productTotal(): MoneyObject {
        const { totalExclusiveVat, vatAmount } = this.productSummary;

        return {
            amount: Number(totalExclusiveVat.amount) + Number(vatAmount.amount),
            currencyKey: vatAmount.currencyKey,
        };
    }

    get vatType(): string {
        const { vatType } = this.productSummary;
        if (vatType.toLowerCase().includes('inclusive')) {
            return 'VAT Incl.';
        }

        if (vatType.toLowerCase().includes('exclusive')) {
            return '';
        }

        return 'No VAT';
    }

    private toggleFullDetailsVisibility() {
        this.$emit('toggle-visibility', this.index);
    }
}
</script>

<style></style>
