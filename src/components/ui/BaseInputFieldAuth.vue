<template>
    <div>
        <div :class="overRideInputContainerClass ? inputContainerClass : 'textfield-input-container'">
            <input
                @blur="handleBlurOfInputField"
                class="input-with-border-bottom"
                ref="input"
                :type="type"
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
                @input="$emit('input', $event.target.value)"
                @change="$emit('change', $event.target.checked)"
                @keyup="$emit('keyup')"
                @focus="$emit('focus', $event)"
                :id="id"
                :defaultInputField="defaultInputField"
            />
            <p class="floating-label">
                <span
                    @click="focusOnInputField"
                    :class="[continueFloatingLabel ? 'keep-label-floating' : '', 'text-label-auth']"
                    >{{ floatingLabelText }}</span
                >
            </p>
        </div>
        <ErrorMessage :message="errors" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component
export default class BaseInputFieldAuth extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string | number;
    @Prop({ default: false }) readonly checked!: boolean;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly errors!: string;
    @Prop() readonly id!: string;
    @Prop({ default: false }) readonly required!: boolean;
    @Prop({ default: '' }) readonly className!: string;
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
        // if there is a default value on the input field, the floating label should continue to float
        this.$nextTick(() => {
            this.handleBlurOfInputField();
        });

        if (this.autoFocus) {
            this.focusOnInputField();
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-input-field-auth.scss';
</style>
