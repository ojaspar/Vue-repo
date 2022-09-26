<template>
    <section class="change-status">
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
                <BaseSelectWithBorderAndFloatingLabel
                    :options="stockStatuses"
                    floatingLabelText="Previous Stock Status"
                    v-model="form.categoryName"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    :value="stockItem.availableQuantity"
                    floatingLabelText="Previous Quantity"
                    :disabled="true"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    :floatingLabelText="floatingLabelText"
                    v-model.number="form.quantity"
                    :min="1"
                    :max="stockItem.totalQuantity"
                />
            </b-col>
        </b-row>

        <BasePrimaryButton
            buttonText="Save"
            @button-clicked="submitForm"
            :overRideButtonClass="true"
            :status="stockItemCategoryStatus"
            className="change-status__save-button"
        />
    </section>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

import { stockStatusAction, StockItemsCategoryRequest } from '@/pages/Inventory/types';
import { Status } from '@/types';

@Component
export default class InitiateReturn extends Mixins(InventoryMixin) {
    @Prop({ required: true }) readonly stockStatus!: stockStatusAction;

    private form = {
        categoryName: '',
        quantity: 0,
    };

    private stockStatuses: Array<string> = ['Damaged', 'Expired', 'Outgoing', 'Returned', 'Uncategorized', 'Available'];

    get floatingLabelText(): string {
        return `Quantity ${this.stockStatus}`;
    }

    get stockItemCategoryStatus(): string {
        return this.inventoryRequestStatus.setStockItemsCategory;
    }

    get stockItemCategoryWasSet(): boolean {
        return this.stockItemCategoryStatus === Status.SUCCESS;
    }

    private async submitForm() {
        const { quantity, categoryName } = this.form;

        const request: StockItemsCategoryRequest = {
            stockItemKey: this.stockItem.stockItemKey,
            quantity,
            categoryName,
        };

        await this.inventoryModule.setStockItemsCategory(request);

        if (this.stockItemCategoryWasSet) {
            this.$emit('action-completed');
        }
    }
}
</script>

<style lang="scss">
.change-status {
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
