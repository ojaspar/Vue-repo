<template>
    <div class="customer-header" :class="customerHeaderClass" v-if="$root.isMobileScreenSize">
        <div class="customer-header__name-logo-section">
            <h1 class="customer-header__customer-name">{{ customerName }}</h1>
            <img src="@/assets/img/information-icon.svg" class="customer-header__information-icon pointer" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MobileHeader extends Vue {
    @Prop({ default: '' }) readonly customerHeaderClass!: string;
    @Prop({ default: '' }) readonly customerName!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/mobile-header.scss';
</style>
