<template>
    <b-row v-if="!$root.isMobileScreenSize" class="progress-tracker__progress-container">
        <div class="progress-tracker__progress-inner-container" v-if="!showLoginLayout">
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        activeComponentIndex > 1 ? 'active-line' : 'inactive-line',
                        isPageActive(1) ? 'active' : 'inactive',
                        'progress-tracker__outer-circle',
                    ]"
                >
                    <div
                        :class="[
                            activeComponentIndex > 1 ? 'active-line' : 'inactive-line',
                            isPageActive(1) ? 'active' : 'inactive',
                            'progress-tracker__inner-circle',
                        ]"
                    >
                        1
                    </div>
                </div>
                <p class="progress-tracker__progress-label">OTP Verification</p>
            </div>
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        activeComponentIndex > 2 ? 'active-line' : 'inactive-line',
                        isPageActive(2) ? 'active' : 'inactive',
                        'progress-tracker__outer-circle',
                    ]"
                >
                    <div
                        :class="[
                            activeComponentIndex > 2 ? 'active-line' : 'inactive-line',
                            isPageActive(2) ? 'active' : 'inactive',
                            'progress-tracker__inner-circle',
                        ]"
                    >
                        2
                    </div>
                </div>
                <p class="progress-tracker__progress-label">Personal Details</p>
            </div>
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        isPageActive(3) ? 'active' : 'inactive',
                        activeComponentIndex > 3 ? 'active-line' : 'inactive-line',
                        'progress-tracker__outer-circle',
                    ]"
                >
                    <div :class="[isPageActive(3) ? 'active' : 'inactive', 'progress-tracker__inner-circle']">3</div>
                </div>
                <p class="progress-tracker__progress-label">Business Details</p>
            </div>
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        isPageActive(4) ? 'active' : 'inactive',
                        activeComponentIndex > 4 ? 'active-line' : 'inactive-line',
                        'progress-tracker__outer-circle fourth-circle',
                    ]"
                >
                    <div :class="[isPageActive(4) ? 'active' : 'inactive', 'progress-tracker__inner-circle']">4</div>
                </div>
                <p class="progress-tracker__progress-label">Start Trial</p>
            </div>
        </div>

        <div class="progress-tracker__progress-inner-container-layout" v-else>
            <!-- Ui needs to be dynamically modified -->
            <!-- layout progress tracker -->
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        activeComponentIndex >= 0 ? 'active-line active' : 'inactive-line inactive',
                        'progress-tracker__outer-circle-layout',
                    ]"
                >
                    <div :class="[activeComponentIndex >= 0 ? 'active' : 'inactive', 'progress-tracker__inner-circle']">
                        1
                    </div>
                </div>
                <!-- progress-tracker__handle-text-transform -->
                <p class="progress-tracker__progress-label-layout">Bio Data</p>
            </div>
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        activeComponentIndex >= 1 ? 'active-line active' : 'inactive-line inactive',
                        'progress-tracker__outer-circle-layout',
                    ]"
                >
                    <div :class="[activeComponentIndex >= 1 ? 'active' : 'inactive', 'progress-tracker__inner-circle']">
                        2
                    </div>
                </div>
                <p class="progress-tracker__progress-label-layout">Guarantor Information</p>
            </div>
            <div class="progress-tracker__progress-item-container">
                <div
                    :class="[
                        activeComponentIndex >= 2 ? 'active-line active' : 'inactive-line inactive',
                        'progress-tracker__outer-circle-layout fourth-circle',
                    ]"
                >
                    <div :class="[activeComponentIndex >= 2 ? 'active' : 'inactive', 'progress-tracker__inner-circle']">
                        3
                    </div>
                </div>
                <p class="progress-tracker__progress-label-layout">Employment Information</p>
            </div>
        </div>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ProgressTracker extends Vue {
    @Prop({ required: true }) readonly activeComponentIndex!: number;
    @Prop({ default: false }) readonly showLoginLayout!: boolean;

    private numbersUpToAndIncludingPageNumber: Array<number> = [];

    private isPageActive(pageNumber: number) {
        return this.numbersUpToAndIncludingPageNumber.includes(pageNumber);
    }

    created() {
        // create an array of the number of pages using the active component index
        this.numbersUpToAndIncludingPageNumber = Array.from({ length: this.activeComponentIndex }, (__, i) => i + 1);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/progress-tracker-layout.scss';
@import 'src/styles/components/progress-tracker.scss';
</style>
