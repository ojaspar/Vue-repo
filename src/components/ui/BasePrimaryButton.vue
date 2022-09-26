<template>
    <button
        :class="[overRideButtonClass ? '' : 'app-primary-btn', `${className} form-control`]"
        @click.prevent="handleClick"
        :disabled="buttonIsDisabled"
    >
        <slot></slot>
        {{ buttonText }}
        <Loader v-if="status === loadingState && buttonText !== 'cancel'" class="ml-1" />
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Status } from '@/types';

@Component
export default class BasePrimaryButton extends Vue {
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: '' }) readonly buttonText!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: false }) readonly overRideButtonClass!: boolean;

    get loadingState(): string {
        return Status.LOADING;
    }

    get buttonIsDisabled(): boolean {
        return this.disabled || this.status === Status.LOADING;
    }

    public handleClick() {
        this.$emit('button-clicked');
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/primary-button';
</style>
