<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        :errorExists="atLeastOneErrorExists(errors)"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
    >
        <div class="w-100">
            <h1 class="setup__right-side-heading">Enter your Total Sales for the current year</h1>
            <BaseInputFieldWithBorderAndFloatingLabel
                :value="convertFigureToCurrency(totalSales.amount)"
                v-floating-number-only
                :floatingLabelText="labelCurrencyText"
                :overRideInputContainerClass="true"
                inputContainerClass="setup__input-container"
                :errors="errors.totalSales"
                errorLabelClass="setup__error-label-text"
                errorContainerClass="setup__error-label-container"
                @input="formatAndValidateTotalSalesInput"
            />
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';
import CurrencyMixins from '@/mixins/currency';

import { MoneyObject } from '@/pages/Sales/types';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class EnterTotalSales extends Mixins(UtilityMixins, ValidationMixin, CurrencyMixins) {
    private totalSales: MoneyObject = {
        currencyKey: this.homeCurrencyKey,
        amount: '',
    };
    public errors = {
        totalSales: '',
        currency: '',
    };

    @Prop({ default: () => ({ currencyKey: 0, amount: 0 }) }) totalYearSales!: MoneyObject;

    get labelCurrencyText() {
        return `Amount (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }
    public validateTotalSales() {
        if (!this.totalSales.amount) {
            this.errors.totalSales = 'Please enter a value';
            return;
        }
        if (this.convertFormattedFiguresToNumber(this.totalSales.amount.toString()) < 0) {
            this.errors.totalSales = 'Invalid number';
            return;
        }
        this.errors.totalSales = '';
    }
    public formatAndValidateTotalSalesInput(totalSales: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(totalSales);
        this.totalSales = Object.assign({}, this.totalSales, {
            ...this.totalSales,
            currencyKey: Number(this.homeCurrencyKey),
            amount: inputToNumber,
        });
        this.$nextTick(() => {
            this.validateTotalSales();
        });
    }
    public handleNextButtonClick() {
        this.validateTotalSales();
        if (!this.errors.totalSales) {
            // override the previous value of totalYearSales
            this.$emit('proceed-to-the-next-section', {
                key: 'totalYearSales',
                value: { ...this.totalSales, currencyKey: Number(this.totalSales.currencyKey) },
            });
        }
    }

    private prepopulateForm() {
        this.totalSales = this.totalYearSales;
    }

    mounted() {
        this.prepopulateForm();
    }
}
</script>

<style lang="scss"></style>
