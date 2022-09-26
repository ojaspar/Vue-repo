<template>
    <transition name="fade" mode="out-in">
        <div class="general-form-error__container" :class="errorContainerClass" :style="errorContainerStyle">
            <div class="general-form-error__message" :class="errorMessageClass">{{ message }}</div>
        </div>
    </transition>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class GeneralFormError extends Vue {
    @Prop({ default: '' }) readonly message!: string;
    @Prop({ default: '' }) readonly errorMessageClass!: string;
    @Prop({ default: '' }) readonly errorContainerClass!: string;

    get errorContainerStyle() {
        const noErrorMessage = this.message.length < 1;
        return { visibility: noErrorMessage ? 'hidden' : 'visible' };
    }
}
</script>
<style lang="scss">
@import 'src/styles/components/general-form-error';
</style>
