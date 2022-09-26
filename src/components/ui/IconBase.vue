<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        viewBox="0 0 26.227999 24.445333"
        :height="height"
        :aria-labelledby="iconName"
        role="presentation"
    >
        <title :id="iconName" lang="en">{{ iconName }} icon</title>
        <g :fill="iconColor">
            <path :d="path" />
        </g>
    </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import icons from '@/assets/img/navbar/icons.json';

import { DashboardIconType } from '@/types';

@Component
export default class IconBase extends Vue {
    @Prop({ required: true }) readonly iconName!: DashboardIconType;
    @Prop({ default: '18' }) readonly width!: number | string;
    @Prop({ default: 18 }) readonly height!: number | string;
    @Prop({ default: 'currentColor' }) readonly iconColor!: string;

    get path(): string {
        return icons[this.iconName];
    }
}
</script>
