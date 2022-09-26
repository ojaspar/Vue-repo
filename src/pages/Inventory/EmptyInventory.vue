<template>
    <section class="empty-inventory">
        <img class="empty-inventory__image" src="@/assets/img/inventory/no-inventory.svg" alt="Icon - No Inventory" />

        <p class="empty-inventory__main-text">You don't have any Inventory yet</p>
        <p class="empty-inventory__sub-text text--grey">Add your inventory in one place to track stock seamlessly</p>

        <section class="empty-inventory__buttons">
            <BasePrimaryButton
                className="empty-inventory__button"
                @button-clicked="createInventoryItem('fresh')"
                buttonText="Create New Stock Item"
            />
            <BasePrimaryButton
                className="empty-inventory__button"
                @button-clicked="createInventoryItem('existing')"
                buttonText="Add Existing Stock Item"
            />
        </section>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { NewInventoryType } from '@/pages/Inventory/types';

@Component
export default class EmptyInventory extends Vue {
    private createInventoryItem(inventoryItemType: NewInventoryType) {
        this.$emit('add-inventory-item', inventoryItemType);
    }
}
</script>

<style lang="scss">
.empty-inventory {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;

    height: 100vh;

    text-align: center;

    @include media-breakpoint-up(md) {
        background: $primary-white;
        box-shadow: $box-shadow-3;
    }

    &__image {
        width: 157px;
        height: 157px;

        margin-bottom: 15px;
    }

    &__main-text {
        color: $primary-color;
        font-size: 20px;

        margin-bottom: 11px;
    }

    &__sub-text {
        font-size: 16px;
    }

    &__buttons {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-top: 30px;

        @include media-breakpoint-up(md) {
            flex-direction: row;
        }
    }

    &__button {
        &:first-child {
            margin-bottom: 20px;

            @include media-breakpoint-up(md) {
                margin: 0;
                margin-right: 10px;
            }
        }
    }
}
</style>
