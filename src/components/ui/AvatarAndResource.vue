<template>
    <b-row
        class="avatar-and-resource pointer"
        @mouseenter.prevent="handleItemMouseOver"
        @mouseleave.prevent="handleItemMouseOut"
        @click.stop="emitCliCkEvent"
    >
        <!-- text section -->
        <b-col class="avatar-and-resource__avatar" key="inactive" :style="{ background: randomColor }">{{
            resourceName | initials
        }}</b-col>
        <b-col :class="[repositionName ? repositionName : 'avatar-and-resource__details']">
            <span :class="resourceNameClass">{{ resourceName }}</span>
            <p class="avatar-and-resource__details--base-text" v-if="!itemExpanded">
                <slot></slot>
            </p>

            <p class="avatar-and-resource__details--slot">
                <template v-if="itemExpanded">
                    <slot name="drop-down"></slot>
                </template>
            </p>
        </b-col>
        <font-awesome-icon
            v-if="showDropdownIcon"
            class="avatar-and-resource__chevron-icon"
            :title="chevronIconTitle"
            :icon="chevronType"
            @click.stop="toggleDetails"
        />
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';

@Component
export default class AvatarAndResource extends Mixins(UtilityMixins) {
    private resourceWasHovered = false;

    @Prop({ required: true }) itemKey!: string;
    @Prop({ required: true }) expandedItemKey!: string;
    @Prop({ required: true }) resourceName!: object;
    @Prop({ default: true }) showChevronIcon!: boolean;
    @Prop({ default: 'avatar-and-resource__details--name' }) resourceNameClass!: string;
    @Prop({ default: '' }) repositionName!: string;

    get chevronType(): string {
        return this.itemExpanded ? 'chevron-up' : 'chevron-down';
    }

    get chevronIconTitle(): string {
        return this.itemExpanded ? 'Hide details' : 'Show more details';
    }

    get itemExpanded(): boolean {
        return this.itemKey === this.expandedItemKey;
    }

    get showDropdownIcon() {
        if (!this.userIsOnDesktop || this.itemExpanded) return this.showChevronIcon;
        return this.resourceWasHovered && this.showChevronIcon;
    }

    private handleItemMouseOver() {
        this.resourceWasHovered = true;
    }

    private handleItemMouseOut() {
        this.resourceWasHovered = false;
    }

    private toggleDetails() {
        this.emitToggleEvent();
    }

    private emitToggleEvent() {
        this.$emit('full-details-toggled', this.itemKey);
    }

    private emitCliCkEvent() {
        if (this.itemExpanded) return;
        this.$emit('resource-selected');
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/avatar-and-resource';
</style>
