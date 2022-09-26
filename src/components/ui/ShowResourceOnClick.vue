<template>
    <div class="sroc__card-container pointer" @click="toggleFullDetailsVisibility">
        <b-row>
            <b-col>
                <slot name="content-on-same-level-as-dropdown-icon"></slot>
            </b-col>
            <b-col class="sroc__dropdown-icon"><font-awesome-icon :icon="dropdownIcon" aria-hidden="true"/></b-col>
        </b-row>
        <slot name="extra-content-in-top-section"></slot>
        <transition-group name="slide-up-fade">
            <template v-if="showFullDetails">
                <slot name="drop-down-content"></slot>
            </template>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class ShowResourceOnClick extends Vue {
    private showFullDetails = false;

    get dropdownIcon(): string {
        return this.showFullDetails ? 'chevron-up' : 'chevron-down';
    }

    private toggleFullDetailsVisibility() {
        this.showFullDetails = !this.showFullDetails;
    }
}
</script>

<style lang="scss">
.sroc {
    &__card-container {
        margin-top: 15px -15px 24px;
        padding-bottom: 10px;
        padding-top: 10px;
        border-bottom: 1px solid $faint-grey;
    }
    &__dropdown-icon {
        width: 15px;
        height: 8px;
        text-align: right;
    }
}
</style>
