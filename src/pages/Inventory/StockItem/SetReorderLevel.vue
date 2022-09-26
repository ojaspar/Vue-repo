<template>
    <section class="reorder-level">
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Stock Item"
                    :value="stockItem.name"
                    :disabled="true"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Reorder Level"
                    :min="1"
                    type="number"
                    v-model.number="reorderLevel"
                    :required="true"
                />
            </b-col>
        </b-row>

        <BasePrimaryButton
            buttonText="Save"
            @button-clicked="submitForm"
            :overRideButtonClass="true"
            :status="setReorderLevelRequestStatus"
            className="reorder-level__save-button"
        />
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import { ItemReorderLevelRequest } from '@/pages/Inventory/types';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';
import { Status } from '@/types';

@Component
export default class SetReorderLevel extends Mixins(InventoryMixin) {
    private reorderLevel = 0;

    get setReorderLevelRequestStatus(): string {
        return this.inventoryRequestStatus.setItemReorderLevel;
    }

    private async submitForm() {
        const {
            stockItem: { stockItemKey },
            reorderLevel,
        } = this;

        const payload: ItemReorderLevelRequest = {
            stockItemKey,
            quantity: reorderLevel,
        };

        await this.inventoryModule.setItemReorderLevel(payload);

        if (this.inventoryRequestStatus.setItemReorderLevel === Status.SUCCESS) {
            this.$emit('action-completed');
        }
    }

    mounted() {
        this.reorderLevel = this.stockItem.reorderLevel;
    }
}
</script>

<style lang="scss">
.reorder-level {
    padding: 10px 5px;

    &__save-button {
        width: 180px;

        color: $primary-white;
        background: $primary-color;

        border-radius: 4px;
        margin: 30px auto 40px;
    }
}
</style>
