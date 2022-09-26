<template>
    <div>
        <slot></slot>
        <BasePrimaryButton
            :buttonText="buttonText"
            className="setup__next-button"
            v-if="isButtonToShow"
            @button-clicked="$emit('next-button-has-been-clicked')"
            :disabled="errorExists"
        />
        <p v-if="isSkipTextToShow" class="setup__skip-text pointer" @click="$emit('skip-text-has-been-clicked')">
            {{ SkipText }}
        </p>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class NextButtonAndSkipText extends Vue {
    @Prop({ default: true }) readonly isSkipTextToShow!: boolean;
    @Prop({ default: true }) readonly isButtonToShow!: boolean;
    @Prop({ default: false }) readonly errorExists!: boolean;
    @Prop({ default: 'Next' }) readonly buttonText!: string;
    @Prop({ default: 'Skip' }) readonly SkipText!: string;
}
</script>

<style lang="scss"></style>
