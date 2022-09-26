<template>
    <div
        :class="[
            className ? className : '',
            'tablet-plus-navigation-header d-flex align-items-center justify-content-between',
        ]"
    >
        <div class="tablet-plus-navigation-header__back-button-container">
            <img
                src="@/assets/img/white-back-arrow.svg"
                @click="$emit('back-button-clicked')"
                class="pointer"
                v-if="shouldShowBackButton"
            />
            <img
                src="@/assets/img/white-cancel-icon.svg"
                @click="$emit('cancel-button-clicked')"
                class="pointer"
                v-else-if="showCancelButton"
            />
        </div>

        <p class="m-0 page-title">{{ pageTitle }}</p>
        <div class="tablet-plus-navigation-header__cart-container pointer">
            <div v-if="showMobileCart" @click="$emit('cart-is-clicked')">
                <img src="@/assets/img/white-shopping-cart.svg" />
                <span class="tablet-plus-navigation-header__cart-count" v-if="showCartCount">{{
                    selectedItemsCount
                }}</span>
            </div>
            <!-- <div v-else>
                <img src="@/assets/img/cancel-icon.svg" @click="$emit('cancel-button-clicked')" class="pointer" />
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { VueExtension, LeftIcon } from '@/types';

@Component
export default class TabletPlusNavigationHeader extends Vue {
    @Prop({ default: 'Page title' }) readonly pageTitle!: number;
    @Prop({ default: 0 }) readonly activeComponentIndex!: number;
    @Prop({ default: true }) readonly selectedItemIsNotNull!: boolean;
    @Prop({ default: true }) readonly showCart!: boolean;
    @Prop({ default: 0 }) readonly selectedItemsCount!: number;
    @Prop({ default: '' }) readonly leftIcon!: string;
    @Prop({ default: true }) readonly showBackButton!: boolean;
    @Prop({ default: '' }) readonly className!: string;

    public $root!: VueExtension;

    get conditionForBackButtonToShow() {
        return this.activeComponentIndex > 0 && this.showBackButton;
    }

    get showMobileCart(): boolean {
        return this.showCart;
    }

    get shouldShowBackButton() {
        return (
            this.leftIcon === LeftIcon.Back ||
            (this.activeComponentIndex > 0 && this.showBackButton && this.leftIcon === LeftIcon.None)
        );
    }

    get showCartCount() {
        return this.selectedItemsCount > 0;
    }

    get showCancelButton() {
        return this.leftIcon === LeftIcon.Cancel;
    }
}
</script>

<style lang="scss">
.tablet-plus-navigation-header {
    display: none;
    @include media-breakpoint-up(md) {
        display: flex;
        background: $primary-gradient-background;
        border-radius: 4px 4px 0px 0px;
        padding: 9px 13px;
        font-size: 16px;
        color: $primary-white;
        height: 34px;
    }

    &--br-4 {
        border-radius: 4px;
    }
    &__cart-container {
        position: relative;
    }

    &__cart-count {
        height: 12px;
        width: 12px;
        background: $notification-red;
        color: $primary-white;
        border-radius: 50%;
        font-size: 11px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 62.5%;
        right: 4.17%;
        top: -2.48%;
        bottom: 96.82%;
    }
}
</style>
