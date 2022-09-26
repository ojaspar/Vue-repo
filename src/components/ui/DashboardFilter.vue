<template>
    <div>
        <b-row class="list-filters mt-5">
            <b-col
                v-for="filter in filters"
                :key="filter.value"
                @click="changeShownSection(filter.value)"
                class="list-filters__filter text-center pointer"
                :class="{ active: activeTab === filter.value }"
                v-text="filter.text"
            ></b-col>
        </b-row>

        <b-row class="date-filter d-flex justify-content-between mt-3">
            <div class="date-filter__left d-flex justify-content-around">
                <div class="from d-flex justify-content-center pointer">
                    <img class="mr-2" src="@/assets/img/calendar.svg" alt="a calendar filter" />
                    <input type="date" />
                </div>
                <div class="to d-flex justify-content-center pointer">
                    <img class="mr-2" src="@/assets/img/calendar.svg" alt="a calendar filter" />
                    <input type="date" />
                </div>
                <div class="list d-flex justify-content-center pointer">
                    <img class="mr-2" src="@/assets/img/check-square.svg" alt="a calendar filter" />
                    <b-form-select v-model="selected" :options="filters" class="list__select"></b-form-select>
                </div>
            </div>
            <div class="date-filter__right controls d-flex justify-content-around">
                <div class="controls__sort pointer">
                    <img class="mr-2" src="@/assets/img/filter.svg" alt="a calendar filter" /> Sort
                </div>
                <div class="controls__filter pointer">
                    <img class="mr-2" src="@/assets/img/funnel.svg" alt="a calendar filter" /> Filter
                </div>
            </div>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface Filter {
    text: string;
    value: string;
}

@Component
export default class DashboardFilter extends Vue {
    private activeTab = 'all';

    private selected = '';

    @Prop({ required: true }) readonly filters!: Filter[];

    public changeShownSection(tab: string): void {
        this.activeTab = tab;
        this.$emit('filter-clicked', tab);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-filter';
</style>
