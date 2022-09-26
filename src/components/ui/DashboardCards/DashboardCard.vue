<template>
    <div class="dashboard-detail-cards__card" :class="item.cssClass">
        <slot v-if="item.title" name="card-item" :item="item">
            <div class="dashboard-detail-cards__card--top">{{ item.title }}</div>

            <div class="dashboard-detail-cards__card--middle">
                <p class="dashboard-detail-cards__card--middle-text">
                    {{ item.midSection }}
                </p>
                <img :src="item.icon" class="dashboard-detail-cards__card--middle-icon" />
            </div>

            <div v-if="item.meta.value" class="dashboard-detail-cards__card--bottom">
                {{ item.meta.title }}
                <span v-if="item.meta.value">
                    :
                    <span class="dashboard-detail-cards__card--blue">
                        {{ item.meta.value }}
                    </span>
                </span>
            </div>
            <slot v-else name="card-bottom"></slot>
        </slot>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

import { DashboardCardItem } from '@/types';

@Component
export default class DashboardCard extends Vue {
    @Prop({
        default: () => ({
            title: '',
            amount: { amount: 9, currencyKey: 566 },
            icon: '',
            meta: { title: '', value: '9' },
            cssClass: '',
        }),
    })
    readonly item!: DashboardCardItem;
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-cards';
</style>
