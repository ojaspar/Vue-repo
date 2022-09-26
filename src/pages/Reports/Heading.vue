<template>
    <b-row class="report-heading flex-column align-items-center">
        <p class="report-heading__title m-0">{{ companyName }}</p>
        <p class="report-heading__address m-0">{{ companyAddress }}</p>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Heading extends Vue {
    @Prop({ required: true }) readonly companyName!: string;
    @Prop({ default: 'pl' }) readonly reportType!: string;
    @Prop({ default: '' }) readonly companyAddress!: string;

    get reportText(): string {
        return this.reportType === 'balanceSheet' ? 'Financial Position' : 'Profit or Loss';
    }
}
</script>

<style scoped lang="scss">
@import 'src/styles/pages/reports/heading';
</style>
