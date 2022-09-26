<template>
    <div class="base-input-field-container" :class="containerClass">
        <div :class="overRideInputContainerClass ? inputContainerClass : 'textfield-input-container'">
            <input
                class="input-with-border-and-floating-label"
                ref="input"
                :type="type"
                :value="value"
                :checked="checked"
                :placeholder="placeholder"
                :required="required"
                :id="id"
                :defaultInputField="defaultInputField"
                :class="className"
                :readonly="readOnly"
                :minlength="minLength"
                :maxlength="maxLength"
                :disabled="disabled"
                @focus="handleFocusEvent"
                @blur="handleBlurOfInputField"
                @keyup="$emit('keyup')"
                @input="$emit('input', $event.target.value)"
                @change="$emit('change', $event.target.checked)"
                @keypress="$emit('keydown', $event)"
                @keyup.delete="$emit('delete-or-backspace-key-pressed')"
                v-bind="$attrs"
            />
            <p class="floating-label">
                <span
                    @click="focusOnInputField"
                    :class="[continueFloatingLabel ? 'keep-label-floating' : '', 'text-label']"
                    >{{ floatingLabelText }}</span
                >
            </p>
        </div>
        <ErrorMessage :message="errors" :errorContainerClass="errorContainerClass" :errorLabelClass="errorLabelClass" />
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import GeneralModule from '@/store/modules/general';

let generalModule: GeneralModule;

@Component
export default class BaseInputFieldWithBorderAndFloatingLabel extends Vue {
    inheritAttrs = false;

    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string | number;
    @Prop({ default: false }) readonly checked!: boolean;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly errors!: string;
    @Prop() readonly id!: string;
    @Prop({ default: false }) readonly required!: boolean;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: '' }) readonly containerClass!: string;
    @Prop({ default: false }) readonly overRideInputContainerClass!: boolean;
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ default: '' }) readonly minLength!: string;
    @Prop({ default: '' }) readonly maxLength!: string;
    @Prop({ default: '' }) readonly labelClass!: string;
    @Prop({ default: '' }) readonly labelText!: string;
    @Prop({ default: false }) readonly overRideErrorMessageClass!: boolean;
    @Prop({ default: false }) readonly overRideContainerClass!: boolean;
    @Prop({ default: '' }) readonly errorMessageClass!: string;
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;
    @Prop({ default: '' }) readonly errorContainerClass!: string;
    @Prop({ default: true }) readonly defaultInputField!: boolean;
    @Prop({ default: false }) readonly autoFocus!: boolean;
    @Prop() readonly readOnly!: string;
    $refs!: {
        textArea: HTMLFormElement;
        input: HTMLFormElement;
    };

    public continueFloatingLabel = false;

    private focusOnInputField() {
        this.$refs.input.focus(); // focus on the input field when the text is clicked
    }

    private handleBlurOfInputField() {
        if (this.$refs.input.value) {
            this.continueFloatingLabel = true;
        } else {
            this.continueFloatingLabel = false;
        }
        this.$emit('blur');
        this.setFocusOnInputField(false);
    }

    private handleFocusEvent($event: Event) {
        this.$emit('focus', $event);
        this.setFocusOnInputField(true);
    }

    private setFocusOnInputField(isFocued: boolean) {
        generalModule.setFocusOnInputField(isFocued);
    }

    private assignModule() {
        generalModule = getModule(GeneralModule, this.$store);
    }

    @Watch('value')
    valueChanged(value: string) {
        this.$nextTick(() => {
            if (value) {
                this.handleBlurOfInputField();
            }
        });
    }

    mounted() {
        this.assignModule();

        // if there is a default value on the input field, the floating label should continue to float
        this.handleBlurOfInputField();
    }
}
</script>
<style lang="scss">
@import 'src/styles/components/base-input-field-with-border-and-floating-label.scss';
</style>
