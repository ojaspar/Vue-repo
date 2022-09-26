<template>
    <div>
        <div class="radio-outer-inputs-container">
            <div :class="['radio-inner-inputs-container', innerInputsContainerClass]">
                <div
                    class="radio-label-section"
                    v-for="radioButtonOption in radioButtonOptions.values"
                    :key="radioButtonOption"
                >
                    <label :for="radioButtonOption" class="radio-label pointer">
                        <input
                            type="radio"
                            class="radio-input pointer"
                            :value="radioButtonOption"
                            :id="radioButtonOption"
                            @change="$emit('change', radioButtonOption)"
                            :checked="radioButtonOption === checkedValue"
                        />
                        {{ radioButtonOption | uppercaseFirst }}
                    </label>
                </div>
            </div>
            <p>
                <span class="radio-floating-label">{{ floatingLabelText }}</span>
            </p>
        </div>
        <ErrorMessage :message="errors" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { RadioButtonOption } from '@/types';

@Component
export default class BaseRadioGroupWithBorderAndFloatingLabel extends Vue {
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ required: true }) readonly radioButtonOptions!: RadioButtonOption;
    @Prop({ required: true }) readonly checkedValue!: string;
    @Prop() readonly errors!: string;
    @Prop({ default: '' }) readonly innerInputsContainerClass!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/base-radio-group-with-border-and-floating-label.scss';
</style>
