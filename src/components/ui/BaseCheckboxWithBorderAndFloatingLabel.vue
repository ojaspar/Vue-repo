<template>
    <div :class="[overRideContainerClass ? inputContainerClass : 'base-floating-checkbox__input-container']">
        <label :for="id" :class="[labelClass, 'base-floating-checkbox__label']">
            <input
                type="checkbox"
                ref="checkbox"
                :id="id"
                :checked="value"
                @change="$emit('change', $event.target.checked)"
                @input="$emit('input', $event.target.checked)"
                :class="className"
            />
            <span class="base-floating-checkbox__input-label"> {{ labelText }} </span>
        </label>
        <p>
            <span class="base-floating-checkbox__floating-label">{{ floatingLabelText }}</span>
        </p>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseCheckboxWithBorderAndFloatingLabel extends Vue {
    model!: {
        prop: 'checked';
        event: 'change';
    };

    @Prop({ default: '' }) readonly labelText!: string;
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ default: 'checkbox' }) readonly id!: string;
    @Prop({ default: '' }) readonly labelClass!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: false }) readonly checked!: boolean;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: false }) readonly overRideContainerClass!: boolean;
}
</script>

<style lang="scss">
@import 'src/styles/components/base-checkbox-with-border-and-floating-label.scss';
</style>
