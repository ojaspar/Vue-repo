<template>
    <button
        :class="[overRideButtonClass ? '' : 'base-plain-btn', `${className} form-control`]"
        @click.prevent="handleClick"
        :disabled="buttonIsDisabled"
    >
        <slot></slot>
        {{ buttonText }}
        <Loader v-if="status === 'LOADING' && buttonText !== 'cancel'" />
    </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Status } from '@/types';

@Component
export default class BasePlainButton extends Vue {
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: '' }) readonly buttonText!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: false }) readonly overRideButtonClass!: boolean;

    get buttonIsDisabled(): boolean {
        return this.disabled || this.status === Status.LOADING;
    }

    public handleClick() {
        this.$emit('button-clicked');
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-plain-button';
</style>
