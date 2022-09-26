<template>
    <div class="products__details">
        <b-row class="m-2 pb-4" v-for="(item, index) in products" :key="index" @click="toggleItemDetailsCard(index)">
            <b-col class="products__avatar">
                <span class="avatar-text">{{ item.name | initials }}</span>
            </b-col>
            <b-col class="products__info">
                <b-col class="products__items p-0">
                    <div class="item">
                        <p class="item__name">{{ item.name }}</p>
                        <p class="item__text" v-show="showItemAmountAndDate(index)">
                            <span v-if="item.lastSalePrice.amount">{{ item.lastSalePrice | amountWithCurrency }}</span>
                            <span v-else>{{ item.estimatedPrice | amountWithCurrency }}</span>
                            <i class="ml-2" v-if="item.lastSaleDate">{{ item.lastSaleDate | humanReadableDateTime }}</i>
                        </p>
                        <transition-group name="slide-up-fade">
                            <template v-if="showItemDetails(index)">
                                <p class="item__text" key="type" v-if="item.description">
                                    {{ item.description }}
                                </p>
                                <p class="item__text" key="amount" v-if="item.lastSalePrice.amount">
                                    <span>{{ item.lastSalePrice | amountWithCurrency }}</span>
                                    <i class="ml-2" v-if="item.lastSaleDate">{{
                                        item.lastSaleDate | humanReadableDateTime
                                    }}</i>
                                </p>
                                <p class="item__text" key="date" v-if="item.totalFinancialYearSale.amount">
                                    <span>{{ item.totalFinancialYearSale | amountWithCurrency }}</span>
                                    <i class="ml-2">since {{ item.financialYearStartDate | humanReadableDateTime }}</i>
                                </p>
                                <p key="icon">
                                    <font-awesome-icon icon="pencil-alt" class="item__icon" />
                                    <span class="icon-text" @click="$emit('edit-exiting-product', item)">
                                        Edit Product
                                    </span>
                                    <font-awesome-icon icon="eye" class="item__icon ml-5" />
                                    <span class="icon-text" @click="$emit('view-sales', item)">View Sales</span>
                                </p>
                            </template>
                        </transition-group>
                    </div>
                    <div class="item__icon-box"><font-awesome-icon :icon="chevronIcon(index)" /></div>
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Product } from '@/pages/Sales/types';

const defaultProduct: Product = {
    name: '',
    description: '',
    incomeGroupKey: '',
    estimatedPrice: {
        currencyKey: 0,
        amount: 0,
    },
    measurementTypeKey: '',
    productKey: '',
    lastSalePrice: { currencyKey: 0, amount: 0 },
    lastSaleDate: '',
    lastSaleAge: '',
    financialYearStartDate: '',
    totalFinancialYearSale: { currencyKey: 0, amount: 0 },
};

@Component
export default class ProductList extends Vue {
    private selectedItemCardIndex = '';

    @Prop({ default: () => defaultProduct }) readonly products!: Array<Product>;

    private showItemDetails(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber;
    }

    private showItemAmountAndDate(cardIndexNumber: string) {
        return this.selectedItemCardIndex !== cardIndexNumber;
    }

    private chevronIcon(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private toggleItemDetailsCard(cardIndexNumber: string) {
        if (this.selectedItemCardIndex === cardIndexNumber) {
            this.selectedItemCardIndex = '';
            return;
        }
        this.selectedItemCardIndex = cardIndexNumber;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/product-list';
</style>
