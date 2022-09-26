<template>
    <div>
        <button
            class="action-btn form-control"
            :disabled="buttonIsDisabled"
            @mousedown="handleMouseDownEvent($event)"
            @click="toggleShowActions"
        >
            {{ buttonText }}
            <font-awesome-icon icon="caret-down" class="action-btn__icon" />
            <span v-if="showLoader" class="mr-3">
                <Loader />
            </span>
        </button>
        <transition name="slide-up-fade">
            <div
                v-if="showActions"
                tabindex="-1"
                :class="['action-btn__all-actions', actionsContainerClass]"
                ref="allActions"
                @blur="closeActons"
            >
                <p
                    class="action-btn__action"
                    v-for="(action, index) in actions"
                    :key="index"
                    @click="emitSelectedAction(action.event)"
                >
                    {{ action.name }}
                </p>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Ref } from 'vue-property-decorator';

import { Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';

interface ActionList {
    name: string;
    event: string;
}

@Component
export default class BaseActionButton extends Mixins(UtilityMixins) {
    @Prop({ default: 'Actions' }) readonly buttonText!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: false }) readonly showLoaderIcon!: boolean;
    @Prop({ default: '' }) readonly actionsContainerClass!: string;
    @Prop({ default: () => [] }) readonly actions!: ActionList[];

    @Ref() readonly allActions!: HTMLFormElement;

    private showActions = false;

    get buttonIsDisabled(): boolean {
        return this.disabled || this.status === Status.LOADING;
    }

    get showLoader() {
        return this.showLoaderIcon && this.status === Status.LOADING;
    }

    private closeActons() {
        this.showActions = false;
    }

    private handleMouseDownEvent(event: Event) {
        if (this.showActions) {
            this.preventBlurFromHappening(event);
        }
    }

    private toggleShowActions() {
        if (this.showActions) {
            this.closeActons();
            return;
        }
        this.showActions = true;
        this.$nextTick(() => {
            this.allActions.focus();
        });
    }

    private emitSelectedAction(actionEvent: string) {
        this.$emit(actionEvent);
        this.closeActons();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/action-button';
</style>
