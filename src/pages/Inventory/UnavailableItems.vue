<template>
    <section class="unavailable-items">
        <header class="unavailable-items__header" @click.stop="toggleDetails">
            <p class="unavailable-items__header--title">Unavailable Items</p>
            <p class="unavailable-items__header--value">(0% of Total)</p>

            <font-awesome-icon v-if="showCollapseIcon" class="stock-status__collapse-icon" :icon="chevronType" />
        </header>

        <section class="unavailable-items__data-section" v-if="!collapsed">
            <ul class="unavailable-items__list">
                <li class="unavailable-items__list-item">Outgoing</li>
                <li class="unavailable-items__list-item">Damaged</li>
                <li class="unavailable-items__list-item">Expired</li>
                <li class="unavailable-items__list-item">Uncategorised</li>
            </ul>

            <aside class="unavailable-items__graph">
                <VariablePieChart
                    v-if="thereIsChartData"
                    :chartData="chartData"
                    chartName=""
                    :chartConfiguration="chartConfiguration"
                />
            </aside>
        </section>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import VariablePieChart, { VariablePieChartData } from '@/pages/Inventory/VariablePieChart.vue';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

@Component({
    components: {
        VariablePieChart,
    },
})
export default class UnavailableItems extends Mixins(InventoryMixin) {
    get chartData(): Array<VariablePieChartData> {
        const { outgoing, damaged, expired, used, returned, uncategorized } = this.stockItemCategories;

        return [
            {
                name: 'Outgoing',
                y: outgoing,
                z: 1,
            },
            {
                name: 'Damaged',
                y: damaged,
                z: 3,
            },
            {
                name: 'Expired',
                y: expired,
                z: 2,
            },
            {
                name: 'Used',
                y: used,
                z: 1,
            },
            {
                name: 'Returned',
                y: returned,
                z: 4,
            },
            {
                name: 'Uncategorized',
                y: uncategorized,
                z: 5,
            },
        ];
    }

    get chartConfiguration() {
        return {
            colors: ['#00a7e1', '#2a4047', '#007ea7', '#003459'],
            credits: {
                enabled: false,
            },
        };
    }

    get thereIsChartData(): boolean {
        return Object.values(this.stockItemCategories).every(value => value > 0);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/unavailable-items';
</style>
