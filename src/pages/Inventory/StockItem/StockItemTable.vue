<template>
    <section>
        <article class="stock-item-table__mobile">
            <div class="stock-item-table__mobile-search">
                <p>
                    Activities
                </p>
                <img src="@/assets/img/search.svg" />
            </div>

            <div class="stock-item-table__mobile-item" v-for="(transaction, index) in stockItemActivities" :key="index">
                <p class="stock-item-table__mobile-item--name">
                    {{ transaction.transactionDate | monthDateYearFormat }}
                </p>

                <div class="stock-item-table__mobile-item-row">
                    <div>
                        <span>{{ transaction.description }} </span>
                    </div>

                    <p>
                        <span :class="getTransactionTypeClass(transaction.description)">
                            {{ transaction.quantity | quantityPrefix(transaction.description) }}
                        </span>
                        <span class="text--grey">{{ stockItem.measurementUnitName }}</span>
                    </p>
                </div>

                <div class="stock-item-table__mobile-item-row">
                    <div>{{ transaction.amount | amountWithCurrency }}</div>

                    <div class="stock-item-table__stock-status">
                        {{ transaction.quantityBalanceAfterActivity }}
                        <span class="text--grey">{{ stockItem.measurementUnitName }} (balance)</span>
                    </div>
                </div>
            </div>

            <b-row>
                <b-col>
                    <button class="stock-item-table__mobile-load-more">See More</button>
                </b-col>
            </b-row>
        </article>

        <h2 class="stock-item-table__medium-table-title txt--bold">Activities</h2>

        <article class="stock-item-table__medium">
            <div class="stock-item-table__top-section">
                <div class="stock-item-table__search">
                    <img src="@/assets/img/search.svg" alt="search icon" class="stock-item-table__search-icon" />

                    <BaseInputField
                        type="search"
                        placeholder="Search"
                        inputContainerClass="stock-item-table__search-input-container"
                        className="stock-item-table__search-input"
                    />
                </div>

                <div class="stock-item-table__filter">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        floatingLabelText="From"
                    />
                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        floatingLabelText="To"
                    />
                </div>
            </div>

            <section class="stock-item-table__medium-header">
                <h3>Date</h3>
                <h3>Details</h3>
                <h3>Quantity</h3>
                <h3>Value</h3>
                <h3>Balance</h3>
            </section>

            <section class="stock-item-table__medium-row-empty text--grey" v-if="stockItemActivitiesAreBeingFetched">
                <Loader :isInline="false" size="3" />
            </section>

            <template v-else>
                <section class="stock-item-table__medium-row-empty text--grey" v-if="thereAreNoStockItemActivities">
                    No Activities
                </section>

                <section
                    class="stock-item-table__medium-row stock-item-table__medium-data-row"
                    v-for="(transaction, index) in stockItemActivities"
                    :key="index"
                    v-else
                >
                    <p>
                        {{ transaction.transactionDate | monthDateYearFormat }}
                    </p>

                    <p>{{ transaction.description }}</p>
                    <p>
                        <span :class="getTransactionTypeClass(transaction.description)">
                            {{ transaction.quantity | quantityPrefix(transaction.description) }}
                        </span>
                        <span class="text--grey">{{ stockItem.measurementUnitName }}</span>
                    </p>
                    <p>{{ transaction.amount | amountWithCurrency }}</p>
                    <p>
                        {{ transaction.quantityBalanceAfterActivity }}
                        {{ stockItem.measurementUnitName }}
                    </p>
                </section>
            </template>
        </article>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import { transactionDescription } from '@/pages/Inventory/types';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';
import { Status } from '@/types';
import SessionStorageService from '@/services/sessionStorage';

@Component({
    filters: {
        quantityPrefix(quantity: number, transactionDescription: transactionDescription): string {
            if (transactionDescription === 'Item Purchased') {
                return `+ ${quantity}`;
            }

            return `- ${quantity}`;
        },
    },
})
export default class StockItemTable extends Mixins(InventoryMixin) {
    get thereAreNoStockItemActivities(): boolean {
        return this.stockItemActivities.length === 0;
    }

    get stockItemActivitiesAreBeingFetched(): boolean {
        return this.inventoryRequestStatus.getStockItemActivities === Status.LOADING;
    }

    private getTransactionTypeClass(description: transactionDescription): string {
        if (description === 'Item Purchased') return 'stock-item-table__purchase';

        return 'stock-item-table__sale';
    }

    private getStockItemActivites() {
        this.inventoryModule.getStockItemActivities(this.stockItem.stockItemKey);
    }

    private prepareDefaultValues() {
        if (!this.stockItem.name) {
            let selectedStockItem = SessionStorageService.getItem('stock-item');

            if (!selectedStockItem) {
                this.$router.push({ name: 'InventoryDashboard' });
                return;
            }

            selectedStockItem = JSON.parse(selectedStockItem);
            this.inventoryModule.persistStockItem(selectedStockItem);
        }
    }

    mounted() {
        this.prepareDefaultValues();
        this.getStockItemActivites();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/stock-item-table';
</style>
