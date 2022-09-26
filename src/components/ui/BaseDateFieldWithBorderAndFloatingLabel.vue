<template>
    <div :class="containerClass">
        <div :class="overRideInputContainerClass ? inputContainerClass : 'datefield-input-container'">
            <!-- <input
                type="date"
                class="datefield-input"
                @change="$emit('change', $event.target.value)"
                :value="value"
                @input="$emit('input', $event.target.value)"
                v-bind="$attrs"
            /> -->
            <Datepicker
                :clear-button="displayClearButton"
                :format="format"
                :input-class="inputClass"
                :placeholder="floatingLabelText"
                :value="value"
                :disabled="disabled"
                :disabled-dates="disabledDates"
                @input="handleDateChanged"
                @selected="handleDateChanged"
                @cleared="$emit('date-cleared')"
                v-bind="$attrs"
            >
            </Datepicker>
            <p class="datefield-floating-label" v-if="showLabel">
                <span>{{ floatingLabelText }}</span>
            </p>
        </div>
        <ErrorMessage :message="errors" :errorLabelClass="errorLabelClass" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import Datepicker from 'vuejs-datepicker';

@Component({
    components: {
        Datepicker,
    },
})
export default class BaseDateFieldWithBorderAndFloatingLabel extends Vue {
    public inheritAttrs = false;

    @Prop({ default: '' }) readonly containerClass!: string;
    @Prop({ default: false }) readonly overRideInputContainerClass!: boolean;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: true }) readonly showClearButton!: boolean;
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ default: '' }) readonly floatingLabelText!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop() readonly errors!: string;
    @Prop({ default: '' }) readonly errorLabelClass!: string;
    @Prop({ default: 'yyyy-MM-dd' }) readonly format!: string;
    @Prop({ default: 'datefield-input' }) readonly inputClass!: string;
    @Prop({ default: '' }) readonly disableDatesTo!: Date;
    @Prop({ default: '' }) readonly disableDatesFrom!: Date;

    private showLabel = false;

    get disabledDates() {
        const disabledDates = {
            to: new Date(this.disableDatesTo),
            from: new Date(this.disableDatesFrom),
        };
        return disabledDates;
    }

    get displayClearButton(): boolean {
        return this.showClearButton && !this.disabled;
    }

    private handleDateChanged(value: Date) {
        if (value) this.showLabel = true;
        else this.showLabel = false;

        const dateStr = this.getDateString(value);
        this.$emit('input', dateStr);
        this.$emit('change', dateStr);
    }

    private getDateString(date: Date) {
        if (!date) return '';

        return date.toISOString().split('T')[0];
    }

    created() {
        if (this.value) this.showLabel = true;
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-datefield-with-border-and-floating-label';
</style>
