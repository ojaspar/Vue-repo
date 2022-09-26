<template>
    <div class="customer-header" :class="customerHeaderClass" v-if="$root.isMobileScreenSize">
        <div class="customer-header__name-logo-section">
            <h1 class="customer-header__customer-name">{{ customerName }}</h1>
            <img src="@/assets/img/information-icon.svg" class="customer-header__information-icon pointer" />
        </div>
    </div>
</template>

<script lang="ts">
import { VueExtension } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CustomerHeader extends Vue {
    @Prop({ default: '' }) readonly customerHeaderClass!: string;
    @Prop({ default: '' }) readonly customerName!: string;

    $root!: VueExtension;
}
</script>

<style lang="scss">
.customer-header {
    padding: 21px 7px 9px 7px;
    position: fixed;
    top: 37px;
    transform: translateX(-50%);
    left: 50%;
    color: $primary-black;
    border: 1px solid $reddish-grey;
    border-radius: 15px;
    width: 215px;
    height: 50px;
    text-align: center;

    &__name-logo-section {
        display: inline-flex;
        align-items: center;
        margin: 0 auto;
        justify-content: center;
    }

    &__customer-name {
        font-size: 16px;
        margin-bottom: 0;
    }

    &__information-icon {
        position: absolute;
        right: 7px;
    }
}
</style>
