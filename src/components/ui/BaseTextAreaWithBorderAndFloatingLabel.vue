<template>
    <div>
        <div :class="[overRideInputContainerClass ? inputContainerClass : 'input-container']">
            <textarea
                :value="value"
                :placeholder="placeholder"
                :required="required"
                :disabled="disabled"
                :class="[className ? className : '', 'text-area']"
                :id="id"
                ref="textArea"
                @focus="handleFocusEvent"
                @blur="handleBlurOfTextAreaField"
                @input="$emit('input', $event.target.value)"
                @keyup="$emit('keyup')"
            />
            <p class="floating-label" @click="focusOnTextAreaField">
                <span :class="[continueFloatingTextAreaLabel ? 'keep-label-floating' : '', 'text-area-label']">{{
                    floatingLabelText
                }}</span>
            </p>
        </div>
        <ErrorMessage :message="errors" :errorLabelClass="errorLabelClass" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import GeneralModule from '@/store/modules/general';

let generalModule: GeneralModule;

@Component
export default class BaseTextAreaWithBorderAndFloatingLabel extends Vue {
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly errors!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly id!: string;
    @Prop({ default: false }) readonly required!: boolean;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: false }) readonly overRideInputContainerClass!: boolean;
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ default: false }) readonly overRideErrorMessageClass!: boolean;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;

    $refs!: {
        textArea: HTMLFormElement;
        input: HTMLFormElement;
    };
    public continueFloatingTextAreaLabel = false;
    private focusOnTextAreaField() {
        this.$refs.textArea.focus(); // focus on the input field when the text is clicked
    }

    private handleBlurOfTextAreaField() {
        if (this.$refs.textArea.value) {
            this.continueFloatingTextAreaLabel = true;
        } else {
            this.continueFloatingTextAreaLabel = false;
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
                this.handleBlurOfTextAreaField();
            }
        });
    }

    mounted() {
        this.assignModule();

        // if there is a default value on the input field, the floating label should continue to float
        this.handleBlurOfTextAreaField();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-text-area-with-border-and-floating-label.scss';
</style>
