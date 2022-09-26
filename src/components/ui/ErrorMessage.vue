<template>
    <p class="error__container" :class="errorContainerClass">
        <span class="error__message" :class="errorLabelClass">{{ message }}</span>
    </p>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class ErrorMessage extends Vue {
    @Prop({ default: '' }) readonly message!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;
    @Prop({ default: '' }) readonly errorContainerClass!: string;
}
</script>
<style lang="scss">
@import 'src/styles/components/error-message';
</style>
