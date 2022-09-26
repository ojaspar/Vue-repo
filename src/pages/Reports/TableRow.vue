<template>
    <b-row class="table-row align-items-center">
        <slot name="report-contents" :rowData="row">
            <b-col class="table-row__column d-flex align-items-center" cols="8">
                <p class="m-0 table-row__report-line">{{ row.reportLine }}</p>
            </b-col>
            <!-- <b-col class="amount-col">{{ row.previousAmount | formatMoney | formatReportAmount }}</b-col> -->
            <b-col class="table-row__report-line amount-col">{{
                row.currentAmount | formatMoney | formatReportAmount
            }}</b-col>
        </slot>
        <!-- <b-col class="amount-col">{{ variance | formatReportAmount }}</b-col> -->
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { ReportItem } from '@/pages/Reports/types';

import CurrencyMixins from '@/mixins/currency';

@Component
export default class TableRow extends Mixins(CurrencyMixins) {
    @Prop({ required: true }) readonly row!: ReportItem;

    get variance(): number | string {
        const { currentAmount, previousAmount } = this.row;

        const variancePercentage = ((currentAmount - previousAmount) / currentAmount) * 100;

        return variancePercentage ? variancePercentage.toFixed(2) : 0;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/reports/table-row';
</style>
