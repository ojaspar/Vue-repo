<template>
    <div :class="[inputContainerClass ? inputContainerClass : 'input-field']">
        <label :class="floatingLabelClass" @click="handleLabelClick" v-if="floatingLabelExists">{{
            floatingLabelText
        }}</label>
        <input
            :type="type"
            :value="value"
            :checked="checked"
            :placeholder="placeholder"
            :required="required"
            @keyup.delete="$emit('delete-or-backspace-key-pressed')"
            class="form-control"
            ref="input"
            :class="className"
            :readonly="readOnly"
            :minlength="minLength"
            :maxlength="maxLength"
            :disabled="disabled"
            @input="$emit('input', $event.target.value)"
            @change="$emit('change', $event.target.checked)"
            @keyup="$emit('keyup', $event)"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)"
            :id="id"
            :defaultInputField="defaultInputField"
        />
        <label
            :class="labelClassExists ? labelClass : 'input-field__label'"
            :for="id"
            @click="handleLabelClick"
            v-if="labelTextExists"
            >{{ labelText }}</label
        >
        <transition name="fade" mode="out-in">
            <ErrorMessage :message="errors" />
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class BaseInputField extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly value!: string | number;
    @Prop({ default: false }) readonly checked!: boolean;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop() readonly errors!: object;
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
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly floatingLabelClass!: string;
    @Prop({ default: true }) readonly defaultInputField!: boolean;
    @Prop({ default: false }) readonly autoFocus!: boolean;
    @Prop() readonly readOnly!: string;

    $refs!: {
        input: HTMLInputElement;
    };

    get floatingLabelExists(): boolean {
        return this.floatingLabelText.length > 0;
    }

    get labelTextExists(): boolean {
        return this.labelText.length > 0;
    }

    get labelClassExists(): boolean {
        return this.labelClass.length > 0;
    }

    private handleLabelClick() {
        if (this.type === 'radio') {
            this.$refs.input.click();
        }
    }

    mounted() {
        if (this.autoFocus) {
            this.$refs.input.focus();
        }
    }

    @Watch('autoFocus')
    autoFocusHasChanged(newValue: boolean) {
        if (newValue) {
            this.$refs.input.focus();
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/input-field.scss';
</style>
