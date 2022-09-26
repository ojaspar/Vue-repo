<template>
    <div>
        <div class="estimates mb-0">
            <div class="estimates__heading">
                <p>
                    Customer:
                    <span class="estimates__heading--customer">{{ saleDetails.customer.name }}</span>
                </p>

                <p>PRICE QUOTATION</p>
            </div>

            <div class="estimates__body">
                <div class="estimates__body--actions">
                    <BasePrimaryButton buttonText="Convert to Sale" @button-clicked="convertEstimate" />

                    <div class="d-flex">
                        <BaseSecondaryButton class="mr-4" buttonText="Duplicate" @button-clicked="duplicateEstimate" />
                        <BaseSecondaryButton buttonText="Edit Quotation" @button-clicked="editEstimate" />
                    </div>
                </div>

                <div class="estimates__content--table">
                    <EstimteTable
                        :sales="saleDetails"
                        @convert-estimate="convertEstimate"
                        @duplicate-transaction="duplicateEstimate"
                        @edit-price-quotation="editEstimate"
                        @generate-receipt="duplicateEstimate"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import EstimteTable from '@/pages/Sales/ManageEstimates/EstimateTable.vue';

import SalesMixin from '@/pages/Sales/SalesMixin';

@Component({ components: { EstimteTable } })
export default class ManageEstimate extends Mixins(SalesMixin) {
    get saleKey() {
        return this.saleDetails.saleKey;
    }

    public convertEstimate() {
        this.$router.push({ name: 'Convert-Estimate', params: { saleKey: this.saleKey } });
    }

    private duplicateEstimate() {
        this.$router.push({ name: 'Duplicate-Estimate', params: { saleKey: this.saleKey } });
    }

    public editEstimate() {
        this.$router.push({ name: 'Edit-Estimate', params: { saleKey: this.saleKey } });
    }

    private async getSaleDetails() {
        const saleKey = this.$route.params.saleKey;
        await this.salesModule.getSaleDetails(saleKey);
    }

    mounted() {
        this.getSaleDetails();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/manage-estimates/index';
</style>
