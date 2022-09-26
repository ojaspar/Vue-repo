<template>
    <b-container fluid :class="headerContainerClass">
        <b-row class="dashboard-table-header" :class="className">
            <b-col v-for="(header, index) in headers" :key="index" :cols="header.numberOfColumns">
                <span v-text="header.text"></span>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class DashboardTableHeader extends Vue {
    @Prop({ required: true, default: [] }) readonly headers!: string[];
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: '' }) readonly headerContainerClass!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-table-header';
</style>
