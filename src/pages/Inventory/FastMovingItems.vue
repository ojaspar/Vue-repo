<template>
    <section class="fast-moving-items">
        <header class="fast-moving-items__header" @click.stop="toggleDetails">
            <p class="fast-moving-items__header--title">Top 5 Fast Moving Items</p>

            <font-awesome-icon class="stock-status__collapse-icon" :icon="chevronType" v-if="showCollapseIcon" />
        </header>

        <section class="fast-moving-items__filter"></section>

        <ul class="fast-moving-items__list" v-if="false">
            <li class="fast-moving-items__item">
                <div class="fast-moving-items__item-details">
                    <p class="fast-moving-items__item-name">Ankara Shirt (Pieces)</p>
                    <p class="fast-moving-items__item-value">0</p>
                </div>
                <ProgressBar progress="90" class="fast-moving-items__item-progress" />
            </li>

            <template v-if="!collapsed">
                <li class="fast-moving-items__item">
                    <div class="fast-moving-items__item-details">
                        <p class="fast-moving-items__item-name">Ankara Shirt (Cartons)</p>
                        <p class="fast-moving-items__item-value">0</p>
                    </div>
                    <ProgressBar progress="70" class="fast-moving-items__item-progress" />
                </li>

                <li class="fast-moving-items__item">
                    <div class="fast-moving-items__item-details">
                        <p class="fast-moving-items__item-name">Ankara Material (Pieces)</p>
                        <p class="fast-moving-items__item-value">0</p>
                    </div>
                    <ProgressBar progress="60" class="fast-moving-items__item-progress" />
                </li>

                <li class="fast-moving-items__item">
                    <div class="fast-moving-items__item-details">
                        <p class="fast-moving-items__item-name">Ankara Trouser (Yards)</p>
                        <p class="fast-moving-items__item-value">0</p>
                    </div>
                    <ProgressBar progress="40" class="fast-moving-items__item-progress" />
                </li>

                <li class="fast-moving-items__item">
                    <div class="fast-moving-items__item-details">
                        <p class="fast-moving-items__item-name">Ankara Trouser (Yards)</p>
                        <p class="fast-moving-items__item-value">0</p>
                    </div>
                    <ProgressBar progress="30" class="fast-moving-items__item-progress" />
                </li>
            </template>
        </ul>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

@Component
export default class FastMovingItems extends Mixins(InventoryMixin) {}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/fast-moving-items';
</style>
