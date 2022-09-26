<template>
    <b-row class="table-footer">
        <slot name="footer-content">
            <b-col class="uppercase" cols="8">{{ title }} </b-col>
            <!-- <b-col class="amount-col"> {{ previousAmount | formatMoney | formatReportAmount }}</b-col> -->
            <b-col class="amount-col"> {{ currentAmount | formatMoney | formatReportAmount }}</b-col>
            <!-- <b-col class="amount-col"> {{ variance | formatReportAmount }}</b-col> -->
        </slot>
    </b-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class TableFooter extends Vue {
    @Prop({ required: true }) readonly title!: string;
    @Prop({ default: 0 }) readonly previousAmount!: number;
    @Prop({ default: 0 }) readonly currentAmount!: number;

    get variance(): string | number {
        const { currentAmount, previousAmount } = this;

        const variancePercentage = ((currentAmount - previousAmount) / currentAmount) * 100;

        return variancePercentage ? variancePercentage.toFixed(3) : 0;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/reports/table-footer';
</style>
