<template>
    <div
        :class="[
            message && message.length > 0 ? 'content-available' : 'no-content',
            'block-error-message__outer-container',
        ]"
    >
        <div class="block-error-message__inner-container">
            <span class="block-error-message__message" :class="errorLabelClass">{{ message }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ErrorMessage extends Vue {
    @Prop({ default: '' }) readonly message!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/block-error-message';
</style>
