<template>
    <b-container fluid class="ms-tablet-plus-index">
        <b-row>
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Supply"
                    v-model="updateSupplyForm.supply"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Outstanding Supply"
                    :value="outstandingSupply"
                    disabled
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="p-0">
                <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="Supply Date" />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="p-0">
                <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="Outstanding Due Date" />
            </b-col>
        </b-row>

        <b-row class="ms-tablet-plus-index__update-supply-button-container">
            <BasePrimaryButton buttonText="Save" @button-clicked="$emit('hide-modal')" />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';

import { ProductInProductDetailsForm } from '@/pages/Sales/types';
import { UpdateSupplyForm } from '@/pages/Sales/ManageSales/types';

@Component
export default class UpdateSupply extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly selectedProduct!: ProductInProductDetailsForm;

    private updateSupplyForm: UpdateSupplyForm = {
        supply: '',
        supplyDate: '',
        outstandingSupplyDueDate: '',
    };

    get outstandingSupply(): number {
        const { quantitySupplied, quantity } = this.selectedProduct;
        const currentOutstanding = quantity - quantitySupplied;

        return currentOutstanding - Number(this.updateSupplyForm.supply);
    }
}
</script>

<style lang="scss">
.ms-tablet-plus-index {
    &__update-supply-button-container {
        @include center-flex-item;
        margin-top: 50px;
    }
}
</style>
