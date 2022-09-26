<template>
    <div class="file-input-container" :class="{ 'hide-default-file-input-text': showFileUploadText }">
        <label :for="id" class="btn browse-btn-layout">Browse</label>
        <input
            type="file"
            class="file-input"
            ref="file"
            :value="value"
            :checked="checked"
            :placeholder="placeholder"
            :required="required"
            @keyup.delete="$emit('delete-or-backspace-key-pressed')"
            :class="className"
            :readonly="readOnly"
            :minlength="minLength"
            :maxlength="maxLength"
            :disabled="disabled"
            @input="$emit('input', emitEventObject ? $event : $event.target.value)"
            @keyup="$emit('keyup')"
            @focus="$emit('focus', $event)"
            :id="id"
            :defaultInputField="defaultInputField"
            :multiple="allowMultiple"
        />
        <label v-if="showFileUploadText" class="moveFileUploadTextClose">{{ fileUploadText }}</label>
        <p>
            <span class="file-label">{{ floatingLabelText }}</span>
        </p>

        <ErrorMessage :message="errors" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseFileInputWithBorderAndFloatingLabel extends Vue {
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: false }) readonly checked!: boolean;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly errors!: string;
    @Prop() readonly id!: string;
    @Prop({ default: false }) readonly required!: boolean;
    @Prop({ default: '' }) readonly className!: string;
    @Prop() readonly inputContainerClass!: string;
    @Prop({ default: '' }) readonly minLength!: string;
    @Prop({ default: '' }) readonly maxLength!: string;
    @Prop({ default: '' }) readonly labelClass!: string;
    @Prop({ default: '' }) readonly labelText!: string;
    @Prop({ default: false }) readonly overRideErrorMessageClass!: boolean;
    @Prop({ default: '' }) readonly errorMessageClass!: string;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;
    @Prop({ default: true }) readonly defaultInputField!: boolean;
    @Prop({ default: false }) readonly autoFocus!: boolean;
    @Prop() readonly readOnly!: string;
    @Prop({ default: false }) readonly allowMultiple!: boolean;
    @Prop({ default: false }) readonly showFileUploadText!: boolean;
    @Prop({ default: '' }) readonly fileUploadText!: string;
    @Prop({ default: false }) readonly emitEventObject!: boolean;
}
</script>

<style lang="scss">
@import 'src/styles/components/base-file-input-with-border-and-floating-label';
</style>
