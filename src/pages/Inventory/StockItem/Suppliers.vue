<template>
    <section class="suppliers">
        <header class="suppliers__heading" @click="toggleDetails">
            <p class="suppliers__heading--text">
                Suppliers
            </p>
            <font-awesome-icon class="suppliers__heading__collapse-icon" :icon="chevronType" v-if="showCollapseIcon" />
        </header>

        <article class="suppliers__list" v-if="!collapsed">
            <Loader v-if="suppliersAreStillBeingFetched" :isInline="false" size="3" />

            <template v-else>
                <section class="suppliers__empty-list text--grey" v-if="thereAreNoSuppliers">
                    No Suppliers
                </section>

                <template v-else>
                    <li class="suppliers__list-item" v-for="supplier in suppliers" :key="supplier.supplierKey">
                        <p class="suppliers__list-item--name">{{ supplier.name }}</p>
                        <p class="suppliers__list-item--phone text--grey">{{ supplier.phoneNumber }}</p>
                        <p class="suppliers__list-item--message" v-if="false">
                            <img src="@/assets/img/black-email.svg" alt="message icon" />
                        </p>
                    </li>
                </template>
            </template>
        </article>
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';
import { Status } from '@/types';

@Component
export default class Suppliers extends Mixins(InventoryMixin) {
    get thereAreNoSuppliers(): boolean {
        return this.suppliers.length === 0;
    }

    get suppliersAreStillBeingFetched() {
        return this.inventoryRequestStatus.getSuppliers === Status.LOADING;
    }

    private async getSuppliers() {
        await this.inventoryModule.getSuppliers();
    }

    mounted() {
        this.getSuppliers();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/inventory/suppliers';
</style>
