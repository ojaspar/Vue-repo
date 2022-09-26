<template>
    <b-container fluid class="inventory-container">
        <Loader :size="4" v-if="stockItemsAreBeingPulled" :isInline="false" />

        <EmptyInventory v-else-if="businessHasNoInventory" @add-inventory-item="createInventoryItem" />

        <template v-else>
            <section class="inventory-dashboard">
                <div class="inventory-dashboard__cards">
                    <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index" />
                </div>

                <div class="inventory-dashboard__stock-status">
                    <StockStatus />
                </div>

                <div class="inventory-dashboard__unavailable-items">
                    <UnavailableItems />
                </div>

                <div class="inventory-dashboard__fast-moving-items">
                    <FastMovingItems />
                </div>

                <div class="inventory-dashboard__main-content">
                    <b-row>
                        <b-col @click="createInventoryItem('fresh')">
                            <button class="inventory-dashboard__add-stock-item">
                                <img
                                    class="inventory-dashboard__add-stock-item--icon"
                                    src="@/assets/img/add-button.svg"
                                    alt="add icon"
                                />
                                Add Stock Item
                            </button>
                        </b-col>
                    </b-row>

                    <div class="inventory-dashboard__table-caption-section">
                        <div class="inventory-dashboard__table-caption-section--title">Stock Items</div>

                        <button
                            class="inventory-dashboard__table-caption-section--button"
                            @click="createInventoryItem('fresh')"
                        >
                            <img
                                class="inventory-dashboard__add-stock-item--icon"
                                src="@/assets/img/add-button.svg"
                                alt="add icon"
                            />
                            Add Stock Item
                        </button>
                    </div>

                    <InventoryTable />
                </div>
            </section>
        </template>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="closeModal">
            <AddStockItem @stock-item-added="stockItemCreated" />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import StockStatus from '@/pages/Inventory/StockStatus.vue';
import UnavailableItems from '@/pages/Inventory/UnavailableItems.vue';
import FastMovingItems from '@/pages/Inventory/FastMovingItems.vue';
import InventoryTable from '@/pages/Inventory/InventoryTable.vue';
import EmptyInventory from '@/pages/Inventory/EmptyInventory.vue';
import AddStockItem from '@/pages/Inventory/AddStockItem.vue';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

import { StockItem } from '@/pages/Inventory/types';
import { DashboardCardItem, Status } from '@/types';

@Component({
    components: {
        StockStatus,
        UnavailableItems,
        FastMovingItems,
        InventoryTable,
        EmptyInventory,
        AddStockItem,
    },
})
export default class InventoryDashboard extends Mixins(InventoryMixin) {
    private modalId = 'add-inventory';
    private modalTitle = 'Create Stock Item';

    get dashboardStats(): Array<DashboardCardItem> {
        const {
            availableInventoryValue,
            totalInventoryValue,
            totalInventoryCount,
            expectedInventoryValue,
        } = this.inventoryDashboardCardValues;

        return [
            {
                title: 'Available Inventory',
                midSection: availableInventoryValue.toString(),
                icon: require('@/assets/img/tax-payments.svg'),
                meta: { title: 'Incoming', value: expectedInventoryValue.toString() },
                cssClass: 'inventory-dashboard__card',
            },
            {
                title: 'Total Inventory',
                midSection: totalInventoryValue.toString(),
                icon: require('@/assets/img/tax-payable.svg'),
                meta: { title: 'Item Count', value: totalInventoryCount.toString() },
                cssClass: 'inventory-dashboard__card',
            },
        ];
    }

    get businessHasNoInventory(): boolean {
        return this.inventoryItems.length === 0;
    }

    get stockItemsAreBeingPulled(): boolean {
        return this.inventoryRequestStatus.getStockItems === Status.LOADING;
    }

    private createInventoryItem() {
        this.openModal(this.modalId);
    }

    public closeModal() {
        this.inventoryModule.performNewAction('');
        this.$bvModal.hide(this.modalId);
    }

    public stockItemCreated(stockItem: StockItem) {
        this.closeModal();

        this.viewStockItem(stockItem);
    }

    @Watch('inventoryDashboardAction', { immediate: true })
    checkIfStockItemIsToBeCreated() {
        if (!this.inventoryDashboardAction) return;

        if (this.inventoryDashboardAction === 'AddStockItem') {
            this.createInventoryItem();
            return;
        }
    }

    private async makeInitialRequests() {
        await Promise.all([
            this.inventoryModule.getStockItems(),
            this.inventoryModule.getInventoryDashboardCardsValues(),
            this.inventoryModule.getStockItemLevels(),
            this.inventoryModule.getStockItemCategories(),
        ]);
    }

    mounted() {
        this.makeInitialRequests();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/inventory-dashboard';
</style>
