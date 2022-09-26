<template>
    <section class="add-stock-item">
        <b-row>
            <b-col>
                <BaseRadioGroupWithBorderAndFloatingLabel
                    :radioButtonOptions="radioButtonOptions"
                    :checkedValue="stockItemType"
                    @change="setStockItemType"
                />
                <span class="add-stock-item__info">{{ message }}</span>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Stock Item"
                    v-model="form.name"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col v-if="!stockItemToBeCreatedIsNew" sm="12" md="6">
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Quantity"
                    v-model.number="form.openingStock"
                    type="number"
                    :min="0"
                />
            </b-col>

            <b-col class="add-stock-item__measurement-unit-container">
                <BaseSelectWithBorderAndFloatingLabel
                    defaultOptionText="-- Select Measurement Type --"
                    keyProperty="measurementUnitKey"
                    textProperty="name"
                    valueProperty="measurementUnitKey"
                    defaultSelectField="true"
                    floatingLabelText="Measurement Type"
                    :options="measurementUnits"
                    v-model="form.measurementUnitKey"
                />
                <Loader v-if="measurementUnitsAreBeingLoaded" class="add-stock-item__loader" />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Reorder Level"
                    v-model.number="form.reorderLevel"
                    type="number"
                    :min="1"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseCheckboxWithBorderAndFloatingLabel
                    :overRideContainerClass="true"
                    inputContainerClass="add-stock-item__row-item"
                    labelClass="pointer"
                    labelText="Display In Product List"
                    v-model="form.displayInProductList"
                />
            </b-col>
        </b-row>

        <b-row v-if="form.displayInProductList">
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Set Price"
                    v-model.number="form.unitPrice.amount"
                    type="number"
                    :min="1"
                />
            </b-col>
        </b-row>

        <BlockErrorMessage :message="error" />

        <BasePrimaryButton
            buttonText="Save"
            @button-clicked="submitForm"
            :overRideButtonClass="true"
            className="add-stock-item__save-button"
            :status="inventoryRequestStatus.createInventoryItem"
        />
    </section>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import InventoryMixin from '@/pages/Inventory/InventoryMixin';

import { RadioButtonOption, Status } from '@/types';
import { CreateStockItemForm, InventoryMeasurementUnit } from '@/pages/Inventory/types';

const inventory = namespace('inventory');

@Component
export default class AddStockItem extends Mixins(InventoryMixin) {
    private form: CreateStockItemForm = {
        name: '',
        measurementUnitKey: '',
        reorderLevel: 1,
        openingStock: 0,
        displayInProductList: false,
        unitPrice: { currencyKey: 0, amount: 0 },
    };

    private radioButtonOptions: RadioButtonOption = {
        name: '',
        values: ['New Stock Item', 'Existing Stock Item'],
    };

    private stockItemType = 'New Stock Item';

    @inventory.State
    private measurementUnits!: Array<InventoryMeasurementUnit>;

    get measurementUnitsAreBeingLoaded(): boolean {
        return this.inventoryRequestStatus.getMeasurementUnits === Status.LOADING;
    }

    get inventoryItemWasCreated(): boolean {
        return this.inventoryRequestStatus.createInventoryItem === Status.SUCCESS;
    }

    get thereAreNoMeasurementUnits(): boolean {
        return this.measurementUnits.length === 0;
    }
    get message(): string {
        return this.stockItemToBeCreatedIsNew
            ? 'A new item you want to add to your inventory'
            : 'An item you had in stock prior to using the Mzuri App';
    }

    get stockItemToBeCreatedIsNew(): boolean {
        return this.stockItemType === 'New Stock Item';
    }

    private setStockItemType(stockItemType: string) {
        this.stockItemType = stockItemType;
    }

    private async submitForm() {
        await this.inventoryModule.createInventoryItem(this.form);

        if (this.inventoryItemWasCreated) {
            // this is a temporary fix pending when the stock item key is being returned from the endpoint after creation
            // we know the first item in that list is the newly added item
            this.$emit('stock-item-added', this.inventoryItems[0]);
        }
    }

    private setUnitAsDefaultMeasurementUnit() {
        const unitMeasurement = this.measurementUnits.find((measurementUnit: InventoryMeasurementUnit) =>
            measurementUnit.name.match(/Unit/),
        );

        this.$set(this.form, 'measurementUnitKey', unitMeasurement?.measurementUnitKey);
    }

    private async makeInitialRequests() {
        if (this.thereAreNoMeasurementUnits) {
            await this.inventoryModule.getMeasurementUnits();
        }

        this.setUnitAsDefaultMeasurementUnit();
    }

    mounted() {
        this.inventoryModule.clearStoreErrors();
        this.makeInitialRequests();
    }
}
</script>

<style lang="scss">
.add-stock-item {
    &__save-button {
        width: 180px;

        color: $primary-white;
        background: $primary-color;

        border-radius: 4px;
        margin: 10px auto 40px;
    }

    &__row-item {
        margin-top: 15px;
    }

    &__measurement-unit-container {
        position: relative;
    }

    &__loader {
        position: absolute;
        bottom: 16px;
        right: 41px;
    }

    &__info {
        display: block;
        background: $light-blue-10;

        padding: 2px 10px;
    }
}
</style>
