<template>
    <div>
        <div class="desktop-view">
            <b-row class="dashboard-filter">
                <b-row class="dashboard-filter__content">
                    <div
                        v-for="(item, index) in filterList"
                        :key="index"
                        :class="statusClass(item.key)"
                        @click="handleStatusFilter(item.key)"
                    >
                        {{ item.name }}
                    </div>
                </b-row>
            </b-row>
        </div>
        <b-row>
            <b-col class="dashboard-filter__mobile-view">
                <BaseSelect
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    className="status-text__select"
                    selectContainerClass="status-text-select"
                    :options="filterList"
                    v-model="activeStatus"
                    @input="handleStatusFilter"
                />

                <slot name="buttons"></slot>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { VueExtension, DashboardFilterList } from '@/types';

const defaultFilterList: DashboardFilterList[] = [
    {
        key: '',
        name: '',
    },
];

@Component
export default class DashboardStatusFilter extends Vue {
    @Prop({ default: () => defaultFilterList }) readonly filterList!: DashboardFilterList[];
    public $root!: VueExtension;

    private activeStatus = this.filterList[0].key;

    private statusClass(expenseStatus: string): string {
        return this.activeStatus === expenseStatus ? 'status-text active-status' : 'status-text';
    }

    private handleStatusFilter(selectedStatus: string) {
        this.activeStatus = selectedStatus;
        this.statusFilterChanged();
    }

    private statusFilterChanged() {
        this.$emit('filter-status-changed', this.activeStatus);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-status-filter.scss';
</style>
