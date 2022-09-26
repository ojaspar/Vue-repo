<template>
    <div :class="[inputContainerClass ? inputContainerClass : 'text-area-field']">
        <label v-if="labelExists" :class="floatingLabelClass">{{ floatingLabelText }}</label>
        <textarea
            :value="value"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            class="form-control"
            :class="className"
            @input="$emit('input', $event.target.value)"
            @keyup="$emit('keyup')"
            :id="id"
        />
        <transition name="fade">
            <p class="parsley-required" v-text="errors"></p>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class BaseTextArea extends Vue {
    @Prop({ default: '' }) readonly errors!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly id!: string;
    @Prop({ default: false }) readonly required!: boolean;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ default: false }) readonly overRideErrorMessageClass!: boolean;
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;

    get labelExists(): boolean {
        return this.floatingLabelText !== '';
    }
}
</script>

<style></style>
