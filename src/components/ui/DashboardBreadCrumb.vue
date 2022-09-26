<template>
    <div class="dashboard-bread-crumb">
        <div
            :class="[
                'dashboard-bread-crumb__section',
                sectionIsClickable ? 'pointer' : '',
                subTitle && 'dashboard-bread-crumb__polygon',
            ]"
            @click="handleClickOnSection"
        >
            {{ section }}
        </div>

        <div
            class="dashboard-bread-crumb__title"
            :class="[
                subTitle && 'dashboard-bread-crumb__polygon dashboard-bread-crumb__dark-grey',
                titleIsClickable ? 'pointer' : '',
            ]"
            @click="handleClickOnTitle"
        >
            {{ title }}
        </div>

        <div class="dashboard-bread-crumb__sub-title" v-if="subTitle">
            {{ subTitle }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DashboardBreadCrumb extends Vue {
    @Prop({ required: true }) section!: string;
    @Prop({ default: '' }) title!: string;
    @Prop({ default: '' }) subTitle!: string;
    @Prop({ default: false }) sectionIsClickable!: boolean;
    @Prop({ default: false }) titleIsClickable!: boolean;

    private handleClickOnSection() {
        if (!this.sectionIsClickable) {
            return;
        }
        this.$emit('section-clicked');
    }

    private handleClickOnTitle() {
        if (!this.subTitle) {
            return;
        }
        this.$emit('title-clicked');
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/dashboard-bread-crumb';
</style>
