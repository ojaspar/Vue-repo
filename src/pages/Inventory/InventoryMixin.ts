import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import UtilityMixins from '@/mixins/Utility';

import InventoryModule from '@/store/modules/inventory';

import SessionStorageService from '@/services/sessionStorage';

import { VueExtension } from '@/types';
import {
    InventoryDashboardCard,
    InventoryRequestStatus,
    StockItem,
    StockItemActivity,
    StockItemCategories,
    StockItemDetailsCardValues,
    StockItemLevel,
    StockItemLevels,
    Supplier,
} from '@/pages/Inventory/types';

const inventory = namespace('inventory');
let inventoryModule: InventoryModule;

@Component
export default class InventoryMixin extends Mixins(UtilityMixins) {
    public $root!: VueExtension;
    public collapsed = true;

    @inventory.State
    public inventoryRequestStatus!: InventoryRequestStatus;

    @inventory.State
    public error!: string;

    @inventory.State
    public inventoryItems!: Array<StockItem>;

    @inventory.State
    public inventoryDashboardCardValues!: InventoryDashboardCard;

    @inventory.State
    public stockItemLevels!: StockItemLevels;

    @inventory.State
    public stockItemDetailsCardValues!: StockItemDetailsCardValues;

    @inventory.State
    public suppliers!: Array<Supplier>;

    @inventory.State
    public stockItemCategories!: StockItemCategories;

    @inventory.State
    public stockItemActivities!: Array<StockItemActivity>;

    @inventory.State
    public stockItem!: StockItem;

    @inventory.State
    public inventoryDashboardAction!: string;

    get chevronType(): string {
        return this.collapsed ? 'chevron-down' : 'chevron-up';
    }

    get showCollapseIcon(): boolean {
        return this.$root.isMobileScreenSize;
    }

    get inventoryModule(): InventoryModule {
        return inventoryModule;
    }

    public toggleDetails() {
        if (this.showCollapseIcon) this.collapsed = !this.collapsed;
    }

    @Watch('showCollapseIcon', { immediate: true })
    openOrCollapse() {
        if (!this.showCollapseIcon) {
            this.collapsed = false;
            return;
        }

        this.collapsed = true;
    }

    public getStockStatus(stockItemLevel: StockItemLevel, baseClass?: string): { cssClass: string; status: string } {
        switch (stockItemLevel) {
            case 'Out Of Stock':
                return {
                    cssClass: baseClass ? `${baseClass}--out-of-stock` : 'out-of-stock',
                    status: 'Out of Stock',
                };

            case 'Critical Stock':
                return {
                    cssClass: baseClass ? `${baseClass}--critically-low` : 'critically-low',
                    status: 'Critically Low',
                };

            case 'Low Stock':
                return {
                    cssClass: baseClass ? `${baseClass}--low-stock` : 'low-stock',
                    status: 'Low Stock',
                };

            default:
                return {
                    cssClass: baseClass ? `${baseClass}--in-stock` : 'in-stock',
                    status: 'In Stock',
                };
        }
    }

    public viewStockItem(stockItem: StockItem) {
        SessionStorageService.setItem('stock-item', JSON.stringify(stockItem));

        this.inventoryModule.persistStockItem(stockItem);

        const itemName = stockItem.name
            .toLowerCase()
            .split(' ')
            .join('-');

        this.$router.push({
            name: 'StockItem',
            params: {
                stockItemName: encodeURIComponent(itemName),
            },
        });
    }

    private bindModules() {
        inventoryModule = getModule(InventoryModule, this.$store);
    }

    created() {
        this.bindModules();
    }
}
