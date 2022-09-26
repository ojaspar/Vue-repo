<template>
    <b-container fluid class="stock-item-container">
        <div v-if="userIsOnMobile">
            <header class="stock-item__details">
                <span class="stock-item__details--name">{{ stockItem.name }} Product Name</span>
            </header>

            <div class="stock-item__header">
                <p class="stock-item__details m-0">
                    {{ stockItem.inventoryType || 'Product' }}
                </p>

                <p class="stock-item__availability-status m-0" :class="stockItemAvailability.cssClass">
                    {{ stockItemAvailability.status }}
                </p>
            </div>
        </div>

        <div class="stock-item__header" v-else>
            <header class="stock-item__details">
                <span class="stock-item__details--title">Stock Item:</span>
                <span class="stock-item__details--name">{{ stockItem.name }}</span> |
                {{ stockItem.inventoryType || 'Product' }}
            </header>

            <p class="stock-item__availability-status" :class="stockItemAvailability.cssClass">
                {{ stockItemAvailability.status }}
            </p>
        </div>
        <section class="stock-item">
            <div class="stock-item__cards">
                <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index" />
            </div>

            <div class="stock-item__unavailable-items">
                <UnavailableItems />
            </div>

            <div class="stock-item__suppliers">
                <Suppliers />
            </div>

            <section class="stock-item__actions">
                <button
                    v-for="(actionItem, index) in stockItemActions.primaryActions"
                    class="stock-item__action"
                    :key="index"
                    @click="actionItem.action"
                >
                    <div class="stock-item__action-icon-container">
                        <img class="stock-item__action-icon" :src="actionItem.icon" />
                    </div>
                    {{ actionItem.text }}
                </button>

                <button class="stock-item__action stock-item__action--others" @blur="hideMoreOptions">
                    <div
                        class="stock-item__action-icon-container stock-item__action-icon-others"
                        @click.stop="toggleMoreOptions"
                    >
                        <img class="stock-item__action-icon" src="@/assets/img/inventory/others.svg" />
                    </div>

                    <section class="stock-item__more-actions" ref="moreActions" v-show="showMoreOptions">
                        <li
                            class="stock-item__more-actions--action"
                            @click="actionItem.action"
                            tabindex="1"
                            v-for="(actionItem, index) in stockItemActions.secondaryActions"
                            :key="index"
                        >
                            {{ actionItem.text }}
                        </li>
                    </section>
                    Other Actions
                </button>
            </section>

            <div class="stock-item__main-content">
                <StockItemTable />
            </div>

            <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="actionCompleted">
                <component
                    :is="componentList[activeComponentIndex]"
                    @action-completed="actionCompleted"
                    :stockItem="stockItem"
                    :stockStatus="stockStatus"
                />
            </BaseModal>
        </section>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import UnavailableItems from '@/pages/Inventory/UnavailableItems.vue';
import Suppliers from '@/pages/Inventory/StockItem/Suppliers.vue';
import StockItemTable from '@/pages/Inventory/StockItem/StockItemTable.vue';
import SetReorderLevel from '@/pages/Inventory/StockItem/SetReorderLevel.vue';
import InitiateReturn from '@/pages/Inventory/StockItem/InitiateReturn.vue';
import ChangeStatus from '@/pages/Inventory/StockItem/ChangeStatus.vue';

import { DashboardCardItem, Status } from '@/types';
import { stockStatusAction } from '@/pages/Inventory/types';

import SessionStorageService from '@/services/sessionStorage';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';
import DynamicComponentMixin from '@/mixins/dynamicComponents';

@Component({
    components: {
        UnavailableItems,
        Suppliers,
        StockItemTable,
    },
})
export default class StockItemDetails extends Mixins(InventoryMixin, DynamicComponentMixin) {
    private componentList: Array<object> = [SetReorderLevel, InitiateReturn, ChangeStatus];
    private modalId = 'stock-item-modal';
    private modalTitle = '';
    private stockStatus: stockStatusAction = 'Used';
    private showMoreOptions = false;

    $refs!: {
        moreActions: HTMLFormElement;
    };

    get stockItemDetailsCardValuesAreBeingFetched(): boolean {
        return this.inventoryRequestStatus.getStockItemDetailsCardValues === Status.LOADING;
    }

    get dashboardStats(): Array<DashboardCardItem> {
        const {
            availableQuantity,
            reorderLevel,
            totalStock,
            stockMeasurementUnit,
            incomingQuantity,
        } = this.stockItemDetailsCardValues;

        const { stockItemDetailsCardValuesAreBeingFetched } = this;

        return [
            {
                title: 'Available Stock',
                midSection: stockItemDetailsCardValuesAreBeingFetched
                    ? ''
                    : availableQuantity
                    ? availableQuantity.toString()
                    : '0',
                icon: require('@/assets/img/tax-payments.svg'),
                meta: {
                    title: 'Reorder Level',
                    value: stockItemDetailsCardValuesAreBeingFetched
                        ? '-'
                        : `${reorderLevel ? reorderLevel : 0} ${stockMeasurementUnit}`,
                },
                cssClass: 'stock-item__card',
            },
            {
                title: 'Total Stock',
                midSection: stockItemDetailsCardValuesAreBeingFetched
                    ? '-'
                    : availableQuantity
                    ? totalStock.toString()
                    : '0',
                icon: require('@/assets/img/tax-payable.svg'),
                meta: {
                    title: 'Incoming',
                    value: stockItemDetailsCardValuesAreBeingFetched
                        ? '-'
                        : `${incomingQuantity} ${stockMeasurementUnit}`,
                },
                cssClass: 'stock-item__card',
            },
        ];
    }

    get stockItemAvailability(): { cssClass: string; status: string } {
        const { stockItemLevel } = this.stockItem;

        const { cssClass, status } = this.getStockStatus(stockItemLevel, 'stock-item__availability-status');

        return {
            cssClass,
            status,
        };
    }

    get stockItemActions() {
        const mobilePrimaryActions = [
            {
                text: 'Set Reorder Level',
                icon: require('@/assets/img/inventory/set-reorder-level.svg'),
                action: () => this.executeAction(0, 'Set Reorder Level'),
            },
            {
                text: 'Purchase',
                icon: require('@/assets/img/inventory/purchase.svg'),
                action: () => this.purchaseItem(),
            },
            {
                text: 'Start Sale',
                icon: require('@/assets/img/inventory/start-sale.svg'),
                action: () => this.recordSale(),
            },
        ];

        const mediumActions = [
            {
                text: 'Initiate Return',
                icon: require('@/assets/img/inventory/initiate-return.svg'),
                action: () => this.executeAction(1, 'Initiate Return'),
            },
            {
                text: 'Mark Used',
                icon: require('@/assets/img/inventory/mark-used.svg'),
                action: () => this.executeAction(2, 'Mark as Used', 'Used'),
            },
            {
                text: 'Mark Damaged',
                icon: require('@/assets/img/inventory/mark-damaged.svg'),
                action: () => this.executeAction(2, 'Mark as Damaged', 'Damaged'),
            },
        ];

        const mediumSecondaryActions = [
            {
                text: 'Mark Expired',
                icon: '',
                action: () => this.executeAction(2, 'Mark as Expired', 'Expired'),
            },
            {
                text: 'Discard Stock',
                icon: '',
                action: () => this.executeAction(2, 'Mark as Discarded', 'Discarded'),
            },
            {
                text: 'Archive Stock',
                icon: '',
                action: () => this.executeAction(2, 'Archive Stock', 'Archived'),
            },
        ];

        const mobileSecondaryActions = [...mediumActions, ...mediumSecondaryActions];
        const mediumPrimaryActions = [...mobilePrimaryActions, ...mediumActions];

        return {
            primaryActions: this.userIsOnMobile ? mobilePrimaryActions : mediumPrimaryActions,
            secondaryActions: this.userIsOnMobile ? mobileSecondaryActions : mediumSecondaryActions,
        };
    }

    private executeAction(activeComponentIndex: number, modalTitle: string, action?: stockStatusAction) {
        this.setActiveComponentIndex(activeComponentIndex);
        this.modalTitle = modalTitle;

        if (action) this.stockStatus = action;

        this.$nextTick(() => {
            this.openModal(this.modalId);
        });
    }

    private toggleMoreOptions() {
        this.showMoreOptions = !this.showMoreOptions;

        if (this.showMoreOptions) this.$refs.moreActions.focus();
    }

    private hideMoreOptions() {
        this.showMoreOptions = false;
    }

    private actionCompleted() {
        this.closeModal(this.modalId);
    }

    private purchaseItem() {
        this.$router.push({ name: 'RecordExpense', query: { redirectedFrom: 'stockitem' } });
    }

    private recordSale() {
        this.$router.push({ name: 'RecordSale', query: { redirectedFrom: 'stockitem' } });
    }

    private async makeInitialRequests(stockItemKey: string) {
        await this.inventoryModule.getStockItemDetailsCardValues(stockItemKey);
    }

    private getStockItemDetails() {
        if (!this.stockItem) {
            let selectedStockItem = SessionStorageService.getItem('stock-item');

            if (!selectedStockItem) this.$router.push({ name: 'InventoryDashboard' });

            selectedStockItem = JSON.parse(selectedStockItem);

            this.inventoryModule.persistStockItem(selectedStockItem);
        }
    }

    mounted() {
        this.getStockItemDetails();

        this.makeInitialRequests(this.stockItem.stockItemKey);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/stock-item-details';
</style>
