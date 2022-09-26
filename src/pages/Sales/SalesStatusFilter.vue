<template>
    <div class="desktop-view">
        <b-row class="sales-status">
            <b-col>
                <BaseSelect
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    className="status-text__select"
                    selectContainerClass="status-text-select"
                    :options="salesStatusOptions"
                    v-model="activeSalesStatus"
                    @input="salesStatusFilterChanged"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { VueExtension } from '@/types';
import { SalesTableDetails } from '@/pages/Sales/types';

@Component
export default class SalesStatusFilter extends Vue {
    @Prop({ default: 'all-sales' }) readonly salesStatusFilter!: string;
    @Prop({ required: true }) readonly exportData!: SalesTableDetails[];

    public $root!: VueExtension;

    private activeSalesStatus = 'all-sales';

    private salesStatusOptions = [
        { key: 'all-sales', name: 'All Sales' },
        { key: 'draft', name: 'Draft' },
        { key: 'estimates', name: 'Estimates' },
        { key: 'pending-supply', name: 'Pending Supply' },
        { key: 'pending-payments', name: 'Pending Payment' },
        { key: 'completed', name: 'Completed' },
        { key: 'cancelled', name: 'Cancelled' },
    ];

    private salesStatusClass(expenseStatus: string): string {
        return this.activeSalesStatus === expenseStatus ? 'status-text active-status' : 'status-text';
    }

    private handleSalesStatusFilter(selectedStatus: string) {
        this.activeSalesStatus = selectedStatus;
        this.salesStatusFilterChanged();
    }

    private salesStatusFilterChanged() {
        this.$emit('sales-status-filter-changed', this.activeSalesStatus);
    }

    @Watch('salesStatusFilter', { immediate: true })
    updateStatusFilter() {
        this.activeSalesStatus = this.salesStatusFilter;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/sales-status-filter';
</style>
