<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        :errorExists="atLeastOneErrorExists(errors)"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
    >
        <div class="w-100">
            <h1 class="setup__right-side-heading">Enter your Total Expenses for the current year</h1>
            <BaseInputFieldWithBorderAndFloatingLabel
                :value="convertFigureToCurrency(totalExpense.amount)"
                v-floating-number-only
                :floatingLabelText="labelCurrencyText"
                :overRideInputContainerClass="true"
                inputContainerClass="setup__input-container"
                :errors="errors.totalExpense"
                errorLabelClass="setup__error-label-text"
                errorContainerClass="setup__error-label-container"
                @input="formatAndValidateTotalExpenseInput"
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
export default class EnterTotalExpense extends Mixins(UtilityMixins, ValidationMixin, CurrencyMixins) {
    private totalExpense: MoneyObject = {
        currencyKey: this.homeCurrencyKey,
        amount: '',
    };

    public errors = {
        totalExpense: '',
        currency: '',
    };

    @Prop({ default: () => ({ currencyKey: 0, amount: 0 }) }) totalYearExpenses!: MoneyObject;

    get labelCurrencyText() {
        return `Amount (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }

    public validateTotalExpense() {
        if (!this.totalExpense.amount) {
            this.errors.totalExpense = 'Please enter a value';
            return;
        }
        if (this.convertFormattedFiguresToNumber(this.totalExpense.amount.toString()) < 0) {
            this.errors.totalExpense = 'Invalid number';
            return;
        }
        this.errors.totalExpense = '';
    }

    public formatAndValidateTotalExpenseInput(totalExpense: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(totalExpense);
        this.totalExpense = Object.assign({}, this.totalExpense, {
            ...this.totalExpense,
            currencyKey: Number(this.homeCurrencyKey),
            amount: inputToNumber,
        });
        this.$nextTick(() => {
            this.validateTotalExpense();
        });
    }
    public handleNextButtonClick() {
        this.validateTotalExpense();
        if (!this.errors.totalExpense) {
            // override the previous value of totalYearExpenses
            this.$nextTick(() => {
                this.$emit('proceed-to-the-next-section', {
                    key: 'totalYearExpenses',
                    value: { ...this.totalExpense, currencyKey: Number(this.totalExpense.currencyKey) },
                });
            });
        }
    }

    private prepopulateForm() {
        this.totalExpense = this.totalYearExpenses;
    }

    mounted() {
        this.prepopulateForm();
    }
}
</script>

<style lang="scss"></style>
