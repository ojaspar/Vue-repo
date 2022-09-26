<template>
    <section>
        <article class="inventory-table__mobile">
            <div class="inventory-table__mobile-search">
                <p>
                    Stock Items
                </p>
                <img src="@/assets/img/search.svg" />
            </div>

            <div
                class="inventory-table__mobile-item"
                v-for="(stockItem, index) in inventoryItems"
                :key="index"
                @click="viewStockItem(stockItem)"
            >
                <p class="inventory-table__mobile-item-name">{{ stockItem.name }}</p>

                <div class="inventory-table__mobile-item-row">
                    <div>
                        <span>{{ stockItem.availableQuantity }} </span>
                        <span class="text--grey">{{ stockItem.measurementUnitName }} (Available)</span>
                    </div>

                    <p>
                        <span class="text--grey">Reorder Level </span
                        ><span
                            >{{ stockItem.reorderLevel }}
                            <span v-if="stockItem.measurementUnitName">{{ stockItem.measurementUnitName }}</span></span
                        >
                    </p>
                </div>

                <div class="inventory-table__mobile-item-row">
                    <div>
                        <span>{{ stockItem.totalQuantity }} </span>
                        <span class="text--grey">{{ stockItem.measurementUnitName }} (Total)</span>
                    </div>

                    <div
                        class="inventory-table__stock-status"
                        :class="getStockStatus(stockItem.stockItemLevel, 'inventory-table__stock-status').cssClass"
                    >
                        {{ getStockStatus(stockItem.stockItemLevel).status }}
                    </div>
                </div>
            </div>

            <b-row>
                <b-col>
                    <button class="inventory-table__mobile-load-more">See More</button>
                </b-col>
            </b-row>
        </article>

        <article class="inventory-table__medium">
            <div class="inventory-table__top-section">
                <div class="inventory-table__search">
                    <img src="@/assets/img/search.svg" alt="search icon" class="inventory-table__search-icon" />

                    <BaseInputField
                        type="search"
                        placeholder="Search"
                        inputContainerClass="inventory-table__search-input-container"
                        className="inventory-table__search-input"
                    />
                </div>

                <div class="inventory-table__filter">
                    <BaseSelect
                        :options="filterOptions"
                        v-model="activeFilter"
                        selectContainerClass="inventory-table__filter-container"
                        className="inventory-table__filter-select"
                    />
                </div>
            </div>

            <section class="inventory-table__medium-header">
                <h3>Name</h3>
                <h3>Available</h3>
                <h3>Total</h3>
                <h3>Reorder Level</h3>
                <h3>Stock Level</h3>
            </section>

            <section
                class="inventory-table__medium-row inventory-table__medium-data-row"
                v-for="(stockItem, index) in inventoryItems"
                :key="index"
                @click="viewStockItem(stockItem)"
            >
                <p>
                    {{ stockItem.name }}
                    <span class="text--grey">{{ stockItem.measurementUnitName }}</span>
                </p>
                <p>{{ stockItem.availableQuantity }}</p>
                <p>{{ stockItem.totalQuantity }}</p>
                <p>{{ stockItem.reorderLevel }}</p>
                <p
                    class="inventory-table__stock-status"
                    :class="getStockStatus(stockItem.stockItemLevel, 'inventory-table__stock-status').cssClass"
                >
                    {{ getStockStatus(stockItem.stockItemLevel).status }}
                </p>
            </section>
        </article>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

@Component
export default class InventoryTable extends Mixins(InventoryMixin) {
    private activeFilter = 'All Stock Levels';

    private filterOptions = ['All Stock Levels', 'Out of Stock', 'In Stock', 'Low Stock', 'Critically Low Stock'];
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/inventory-table';
</style>
