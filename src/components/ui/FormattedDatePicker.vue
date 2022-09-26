<template>
    <div class="formatted-date-picker">
        <span class="formatted-date-picker__title"> {{ titleText }} </span>
        <div class="formatted-date-picker__container" title="Select date">
            <BaseDateFieldWithBorderAndFloatingLabel
                inputClass="formatted-date-picker__input"
                :overRideInputContainerClass="true"
                :showClearButton="false"
                :format="formattedDate"
                :disableDatesFrom="new Date()"
                :disabled="disabled"
                v-model="selectedDate"
                @blur="updateSelectedDate"
                @change="handleDateChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';

@Component
export default class FormattedDatePicker extends Mixins(UtilityMixins) {
    @Prop({ default: '' }) readonly defaultDate!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
    @Prop({ default: 'Transaction Date' }) readonly titleText!: string;

    private selectedDate = '';

    get formattedDate(): string {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(this.selectedDate);
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    }

    private updateSelectedDate(newDate: string) {
        if (!newDate) {
            this.selectedDate = this.todayAsDefaultDate();
            return;
        }
        this.selectedDate = newDate;
    }

    private handleDateChange(selectedDate: string) {
        this.updateSelectedDate(selectedDate);
        this.$emit('date-selected', selectedDate);
    }

    @Watch('defaultDate', { immediate: true })
    setDate(newDate: string) {
        this.updateSelectedDate(newDate);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/formatted-date-picker';
</style>
