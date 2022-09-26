<template>
    <b-row class="mid-section-container">
        <b-col class="mid-section__search" sm="12" md="8" lg="4">
            <div class="mid-section__search-container">
                <font-awesome-icon icon="search" class="search-icon" />
                <BaseInputField
                    class="search-input"
                    :placeholder="searchInputPlaceholder"
                    :value="searchStringValue"
                    @input="handleSearchInput"
                />
                <img
                    src="@/assets/img/filter.svg"
                    class="mid-section__filter-controls--trigger pointer"
                    @click="toggleFilterVisibility"
                />
            </div>

            <!--  Mobile Filter -->
            <transition name="slide-up-fade">
                <div class="mid-section__filter-controls" v-if="showFilters">
                    <header class="mid-section__filter-controls--header">Filter Results</header>

                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Category"
                        keyProperty="key"
                        textProperty="name"
                        valueProperty="key"
                        className="status-text__select"
                        selectContainerClass="mid-section__status-filter--dropdown"
                        :options="statusOptions"
                        :value="activeStatus"
                        v-model="filters.category"
                    />

                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        inputContainerClass="date-input"
                        floatingLabelText="From"
                        v-model="filters.fromDate"
                    />

                    <BaseDateFieldWithBorderAndFloatingLabel
                        :overRideInputContainerClass="true"
                        inputContainerClass="date-input"
                        floatingLabelText="To"
                        v-model="filters.toDate"
                    />

                    <div class="mid-section__filter-controls--buttons">
                        <BaseSecondaryButton buttonText="Clear" @button-clicked="clearForm" />
                        <BasePrimaryButton buttonText="Search" @button-clicked="filterResults" />
                    </div>
                </div>
            </transition>
        </b-col>

        <b-col class="mid-section__status-filter">
            <p class="mid-section__status-filter--text">View By</p>

            <BaseSelect
                keyProperty="key"
                textProperty="name"
                valueProperty="key"
                className="status-text__select"
                selectContainerClass="mid-section__status-filter--dropdown"
                :options="statusOptions"
                :value="activeStatus"
                @input="handleSalesStatusFilter"
            />
        </b-col>

        <b-col class="mid-section__buttons">
            <div class="mid-section__dates-container">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :overRideInputContainerClass="true"
                    inputContainerClass="date-input mr-3"
                    floatingLabelText="From"
                    @change="handleFromDateChange"
                />

                <BaseDateFieldWithBorderAndFloatingLabel
                    :overRideInputContainerClass="true"
                    inputContainerClass="date-input"
                    floatingLabelText="To"
                    @change="handleToDateChange"
                />
            </div>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { DashboardStatusOption, Filters } from '@/types';

@Component
export default class DashboardMidSection extends Vue {
    @Prop({ default: '' }) readonly searchStringValue!: string;
    @Prop({ default: 'Search' }) readonly searchInputPlaceholder!: string;
    @Prop({ required: true }) readonly statusOptions!: Array<DashboardStatusOption>;
    @Prop({ required: true }) readonly activeStatus!: string;
    @Prop({ required: true }) readonly fromDate!: string;
    @Prop({ required: true }) readonly toDate!: string;

    private showFilters = false;

    private filters: Filters = {
        category: '',
        fromDate: '',
        toDate: '',
    };

    private handleSalesStatusFilter(selectedStatus: string) {
        this.statusFilterChanged(selectedStatus);
    }

    private statusFilterChanged(selectedStatus: string) {
        this.$emit('status-filter-changed', selectedStatus);
    }

    // @Watch('salesStatusFilter', { immediate: true })
    // updateStatusFilter() {
    //     // this.activeStatus = this.salesStatusFilter;
    // }

    private handleSearchInput(searchInput: string) {
        this.$emit('search-input-changed', searchInput);
    }

    private handleFromDateChange(date: string) {
        this.$emit('from-date-filter-has-changed', date);
    }

    private handleToDateChange(date: string) {
        this.$emit('to-date-filter-has-changed', date);
    }

    private toggleFilterVisibility() {
        this.showFilters = !this.showFilters;
    }

    private clearForm() {
        this.filters = {
            category: '',
            fromDate: '',
            toDate: '',
        };

        this.filterResults();
    }

    private filterResults() {
        this.$emit('apply-filters', this.filters);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/general-module-mid-section';
</style>
