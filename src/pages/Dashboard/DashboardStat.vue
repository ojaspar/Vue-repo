<template>
    <div :class="useDefaultStatsContainer ? 'dashboard-stats' : statsContainerClass">
        <div
            :xl="firstCardColumnSize.xl"
            :lg="firstCardColumnSize.lg"
            :md="firstCardColumnSize.md"
            :sm="firstCardColumnSize.sm"
            :cols="firstCardColumnSize.xs"
            :class="[extraContainerCLass.firstCard, 'dashboard-stats__stat', 'd-flex', 'justify-content-between']"
            v-if="firstStat.header !== ''"
        >
            <div class="left d-flex flex-column">
                <p :class="overRideTitleCLass ? titleCLass : 'title'">
                    {{ firstStat.header }}
                    <Loader v-if="firstStat.status === 'LOADING'" />
                </p>
                <p v-if="firstStat.status !== 'LOADING'" class="figure">
                    <span v-if="firstStat.isMonetaryValue">{{ firstStat.body | formatAmount }}</span>
                    <span v-else>{{ firstStat.body }}</span>
                </p>
                <slot name="first-meta"></slot>
            </div>
            <div class="right d-flex align-items-center">
                <p class="icon">
                    <img
                        alt="image of a sales cart"
                        :src="firstStat.icon.length > 0 ? firstStat.icon : require('@/assets/img/sales.svg')"
                        height="100%"
                        width="100%"
                    />
                </p>
            </div>
        </div>
        <slot name="beneath-first-card"></slot>

        <div
            :xl="secondCardColumnSize.xl"
            :lg="secondCardColumnSize.lg"
            :md="secondCardColumnSize.md"
            :sm="secondCardColumnSize.sm"
            :cols="secondCardColumnSize.xs"
            :class="[extraContainerCLass.secondCard, 'dashboard-stats__stat', 'd-flex', 'justify-content-between']"
            v-if="secondStat.header !== ''"
        >
            <div class="left d-flex flex-column">
                <p :class="overRideTitleCLass ? titleCLass : 'title'">
                    {{ secondStat.header }}
                    <Loader v-if="secondStat.status === 'LOADING'" />
                </p>
                <p v-if="secondStat.status !== 'LOADING'" class="figure">
                    <span v-if="secondStat.isMonetaryValue">{{ secondStat.body | formatAmount }}</span>
                    <span v-else>{{ secondStat.body }}</span>
                </p>
                <slot name="second-meta"></slot>
            </div>
            <div class="right d-flex align-items-center">
                <p class="icon">
                    <img
                        alt="image of spreadsheet"
                        :src="secondStat.icon.length > 0 ? secondStat.icon : require('@/assets/img/receivables.svg')"
                        height="100%"
                        width="100%"
                    />
                </p>
            </div>
        </div>
        <slot name="beneath-second-card"></slot>

        <div
            col=""
            :xl="thirdCardColumnSize.xl"
            :lg="thirdCardColumnSize.lg"
            :md="thirdCardColumnSize.md"
            :sm="thirdCardColumnSize.sm"
            :cols="thirdCardColumnSize.xs"
            :class="[extraContainerCLass.thirdCard, 'dashboard-stats__stat', 'd-flex', 'justify-content-between']"
            v-if="thirdStat.header !== ''"
        >
            <div class="left d-flex flex-column">
                <p :class="overRideTitleCLass ? titleCLass : 'title'">
                    {{ thirdStat.header }}
                    <Loader v-if="thirdStat.status === 'LOADING'" />
                </p>
                <p v-if="thirdStat.status !== 'LOADING'" class="figure">
                    <span v-if="thirdStat.isMonetaryValue">{{ thirdStat.body | formatAmount }}</span>
                    <span v-else>{{ thirdStat.body }}</span>
                </p>
                <slot name="third-meta"></slot>
            </div>
            <div class="right d-flex align-items-center">
                <p class="icon">
                    <img
                        alt="image describing payables"
                        :src="thirdStat.icon.length > 0 ? thirdStat.icon : require('@/assets/img/payables.svg')"
                        height="100%"
                        width="100%"
                    />
                </p>
            </div>
        </div>
        <slot name="beneath-third-card"></slot>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

import { Status, DashboardCardContainerClass, DashboardCardColumnSize } from '@/types';

const defaultStat = {
    header: '',
    body: '',
    meta: '',
    icon: '',
    status: '',
};

const defaultExtraContainerCLass: DashboardCardContainerClass = {
    firstCard: '',
    secondCard: '',
    thirdCard: '',
};

const defaultColumnSize: DashboardCardColumnSize = {
    xl: '',
    lg: '',
    md: '',
    sm: '',
    xs: '',
};

@Component
export default class DashboardStat extends Vue {
    @Prop({ default: () => defaultStat }) readonly firstStat!: DashboardStat;
    @Prop({ default: () => defaultStat }) readonly secondStat!: DashboardStat;
    @Prop({ default: () => defaultStat }) readonly thirdStat!: DashboardStat;
    @Prop({ default: '' }) readonly status!: Status;
    @Prop({ default: false }) readonly overRideTitleCLass!: boolean;
    @Prop({ default: '' }) readonly titleCLass!: string;
    @Prop({ default: () => defaultExtraContainerCLass }) readonly extraContainerCLass!: DashboardCardContainerClass;
    @Prop({ default: true }) readonly useDefaultStatsContainer!: boolean;
    @Prop({ default: '' }) readonly statsContainerClass!: string;
    @Prop({ default: () => defaultColumnSize }) readonly firstCardColumnSize!: DashboardCardColumnSize;
    @Prop({ default: () => defaultColumnSize }) readonly secondCardColumnSize!: DashboardCardColumnSize;
    @Prop({ default: () => defaultColumnSize }) readonly thirdCardColumnSize!: DashboardCardColumnSize;
}
</script>

<style lang="scss" scoped>
@import 'src/styles/pages/dashboard/dashboard-stats';
</style>
