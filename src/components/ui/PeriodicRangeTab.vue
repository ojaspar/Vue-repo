<template>
    <div class="periodic-tab">
        <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="activeTabClass(tab.name)"
            @click="setActiveTab(tab.name)"
        >
            {{ tab.displayText }}
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export interface PiriodicRangeTab {
    name: string;
    displayText: string;
}

@Component
export default class PeriodicRangeTab extends Vue {
    @Prop({ required: true }) readonly tabs!: PiriodicRangeTab[];
    @Prop({ default: '' }) readonly defaultActiveTab!: string;

    private activeTab = this.tabs[0].name;

    private activeTabClass(selectedTab: string): string {
        return selectedTab === this.activeTab ? 'active' : '';
    }

    private setActiveTab(selectedTab: string) {
        this.activeTab = selectedTab;
        this.emitTabChangeEvent();
    }

    private emitTabChangeEvent() {
        this.$emit('periodic-tab-changed', this.activeTab);
    }

    private setDefaultActiveTab() {
        if (this.defaultActiveTab) {
            this.activeTab = this.defaultActiveTab;
        }
    }

    mounted() {
        this.setDefaultActiveTab();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/periodic-range-tab';
</style>
