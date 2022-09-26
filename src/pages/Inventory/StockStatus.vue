<template>
    <section class="stock-status" :class="{ collapsed: 'stock-status__collapsed' }">
        <!-- Mobile header -->
        <header class="stock-status__header stock-status__mobile" @click.stop="toggleDetails">
            <p class="stock-status__header--title">Total Item Count ({{ totalItems }})</p>
            <font-awesome-icon class="stock-status__collapse-icon" :icon="chevronType" v-if="showCollapseIcon" />
        </header>

        <!-- Desktop header -->
        <header class="stock-status__header stock-status__desktop">
            <p class="stock-status__header--title">Total Item Count</p>
            <p class="stock-status__header--value">{{ totalItems }}</p>
        </header>

        <ul class="stock-status__items" v-if="!collapsed">
            <li :class="['stock-status__item', stockItemLevels.inStock && 'stock-status__in-stock']">
                <p class="stock-status__item--title">In Stock</p>
                <p class="stock-status__item--divider"></p>
                <p class="stock-status__item--value">{{ stockItemLevels.inStock }}</p>
            </li>

            <li :class="['stock-status__item', stockItemLevels.lowStock && 'stock-status__low-stock']">
                <p class="stock-status__item--title">Low Stock</p>
                <p class="stock-status__item--divider"></p>
                <p class="stock-status__item--value">{{ stockItemLevels.lowStock }}</p>
            </li>

            <li :class="['stock-status__item', stockItemLevels.criticalLow && 'stock-status__critical-stock']">
                <p class="stock-status__item--title">Critical Stock</p>
                <p class="stock-status__item--divider"></p>
                <p class="stock-status__item--value">{{ stockItemLevels.criticalLow }}</p>
            </li>

            <li :class="['stock-status__item', stockItemLevels.outOfStock && 'stock-status__out-of-stock']">
                <p class="stock-status__item--title">Out of Stock</p>
                <p class="stock-status__item--divider"></p>
                <p class="stock-status__item--value">{{ stockItemLevels.outOfStock }}</p>
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

@Component
export default class StockStatus extends Mixins(InventoryMixin) {
    get totalItems(): number {
        return Object.values(this.stockItemLevels).reduce(
            (totalNumber: number, stockLevel: number) => stockLevel + totalNumber,
            0,
        );
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/stock-status';
</style>
