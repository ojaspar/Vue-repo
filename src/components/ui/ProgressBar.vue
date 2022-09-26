<template>
    <div :class="['progress', containerClass]">
        <transition name="fade">
            <div
                :class="progessBarStyle"
                role="progressbar"
                :aria-valuenow="width"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: width }"
            ></div>
        </transition>
        <span class="progress-text" v-if="showProgressText">{{ width }}</span>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ProgressBar extends Vue {
    @Prop({ default: 0 }) readonly progress!: number;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: '' }) readonly containerClass!: string;
    @Prop({ default: false }) readonly showProgressText!: boolean;
    @Prop({ default: false }) readonly overRideDefaultStyle!: boolean;

    private get width(): string {
        return `${this.progress}%`;
    }

    get progessBarStyle() {
        if (this.overRideDefaultStyle) return this.className;
        return 'progress-bar';
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/progress-bar';
</style>
