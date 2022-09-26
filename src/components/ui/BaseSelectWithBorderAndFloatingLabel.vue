<template>
    <div :class="overRideContainerClass ? inputContainerClass : 'base-floating-select__select-container'">
        <select
            @change="emitEventObject ? $emit('input', $event) : $emit('input', $event.target.value)"
            class="base-floating-select__select-input"
            :class="className"
            :disabled="disabled"
            v-model="selected"
            @focus="$emit('focus', $event)"
        >
            <option value="" selected :disabled="disableDefaultOption" v-if="defaultOptionTextWasSupplied">{{
                defaultOptionText
            }}</option>
            <option v-else value="" disabled>--Please choose an option--</option>
            <slot name="first-option"></slot>
            <option
                v-for="(option, index) in options"
                :key="option[keyProperty] || index"
                :value="option[valueProperty] || option"
            >
                <span v-if="isCurrency">{{ currencyNameAndSymbol(option) }}</span>
                <span v-else>{{ option[textProperty] || option }}</span>
            </option>
        </select>
        <p class="base-floating-select__floating-label">
            <span class="base-floating-select__select-label">{{ floatingLabelText }}</span>
        </p>

        <ErrorMessage :message="errors" />
    </div>
</template>

<script lang="ts">
import { SelectOptions, Currency } from '@/types';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseSelectWithBorderAndFloatingLabel extends Vue {
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly errors!: object;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: () => Array<SelectOptions>() }) readonly options!: Array<SelectOptions>;
    @Prop({ default: false }) readonly overRideContainerClass!: boolean;
    @Prop({ default: '' }) readonly optionsKey!: string;
    @Prop({ default: '' }) readonly defaultOptionText!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: '' }) readonly keyProperty!: string;
    @Prop({ default: '' }) readonly textProperty!: string;
    @Prop({ default: '' }) readonly valueProperty!: string;
    @Prop({ default: 'base-floating-select__select-container' }) inputContainerClass!: string;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: '' }) readonly selectContainerClass!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;
    @Prop({ default: false }) readonly emitEventObject!: boolean;
    @Prop({ default: true }) readonly disableDefaultOption!: boolean;
    @Prop({ default: false }) readonly isCurrency!: boolean;

    get selected() {
        return this.value;
    }

    set selected(newValue) {
        this.$emit('change', newValue);
    }

    get defaultOptionTextWasSupplied(): boolean {
        return this.defaultOptionText.length > 0;
    }

    private currencyNameAndSymbol(currency: Currency): string {
        return `${currency.currencyName} (${currency.currencySymbol})`;
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-select-with-border-and-floating-label.scss';
</style>
