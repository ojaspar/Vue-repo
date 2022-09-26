<template>
    <div :class="[selectContainerClass ? selectContainerClass : 'select']">
        <label :class="floatingLabelClass" v-if="floatingLabelExists">{{ floatingLabelText }}</label>
        <select
            @change="emitEventObject ? $emit('input', $event) : $emit('input', $event.target.value)"
            :class="className"
            class="form-control"
            :defaultSelectField="defaultSelectField"
            :disabled="disabled"
            v-model="selected"
        >
            <option value="" selected :disabled="disableDefaultOption" v-if="defaultTextWasSupplied">{{
                defaultText
            }}</option>
            <slot name="first-option"></slot>
            <option
                v-for="(option, index) in options"
                :key="option[keyProperty] || index"
                :value="option[valueProperty] || option"
            >
                {{ option[textProperty] || option }}
            </option>
        </select>
        <transition name="fade" mode="out-in">
            <p :class="overRideErrorMessageClass ? errorMessageClass : 'parsley-required'" v-text="errors"></p>
        </transition>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PictureSelectOptions } from '@/types';

@Component
export default class BaseSelect extends Vue {
    get selected() {
        return this.value;
    }
    set selected(newValue) {
        this.$emit('change', newValue);
    }

    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: () => Array<PictureSelectOptions>() }) readonly options!: Array<PictureSelectOptions>;
    @Prop({ default: '' }) readonly optionsKey!: string;
    @Prop({ default: '' }) readonly defaultText!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: '' }) readonly keyProperty!: string;
    @Prop({ default: '' }) readonly textProperty!: string;
    @Prop({ default: '' }) readonly valueProperty!: string;
    @Prop({ default: '' }) readonly errors!: string;
    @Prop({ default: false }) readonly emitEventObject!: boolean;
    @Prop({ default: false }) readonly overRideErrorMessageClass!: boolean;
    @Prop({ default: '' }) readonly errorMessageClass!: string;
    @Prop({ default: '' }) readonly selectContainerClass!: string;
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;
    @Prop({ default: true }) readonly defaultSelectField!: boolean;
    @Prop({ default: true }) readonly disableDefaultOption!: boolean;

    get defaultTextWasSupplied(): boolean {
        return this.defaultText.length > 0;
    }

    get floatingLabelExists(): boolean {
        return this.floatingLabelText.length > 0;
    }
}
</script>
<style lang="scss" scoped>
@import 'src/styles/components/base-select.scss';
</style>
