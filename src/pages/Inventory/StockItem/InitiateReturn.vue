<template>
    <section class="initiate-return">
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
                    valueProperty="key"
                    textProperty="name"
                    floatingLabelText="Stock Status"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    :value="stockItem.availableQuantity"
                    floatingLabelText="Previous Stock"
                    :disabled="true"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel required="true" floatingLabelText="Return Quantity" />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    defaultOptionText="-- Select --"
                    valueProperty="key"
                    textProperty="name"
                    floatingLabelText="Vendor"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="Return Date" />
            </b-col>
        </b-row>

        <BasePrimaryButton
            buttonText="Save"
            @button-clicked="submitForm"
            :overRideButtonClass="true"
            className="initiate-return__save-button"
        />
    </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { StockItem } from '@/pages/Inventory/types';

@Component
export default class InitiateReturn extends Vue {
    @Prop({ required: true }) readonly stockItem!: StockItem;

    private submitForm() {
        this.$emit('action-completed');
    }
}
</script>

<style lang="scss">
.initiate-return {
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
