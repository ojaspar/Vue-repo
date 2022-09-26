<template>
    <div class="success-page">
        <div class="success-page__secondary-container">
            <div class="success-page__icon-container">
                <img
                    class="success-page__icon"
                    src="@/assets/img/sales-success-page-icon.svg"
                    alt="success page icon"
                />
            </div>
            <h1 class="success-page__text">{{ successText }}</h1>
            <div class="success-page__buttons-container"><slot /></div>
            <div><slot name="new-row" /></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SuccessPage extends Vue {
    @Prop({ default: 'Your transaction was saved Successfully!' }) successText!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/success-page';
</style>
