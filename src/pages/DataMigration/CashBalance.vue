<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        :errorExists="atLeastOneErrorExists(errors)"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
    >
        <div>
            <h1 class="setup__right-side-heading">Enter your Cash Balance:</h1>
            <!-- type text is required for formatting currency -->
            <BaseInputFieldWithBorderAndFloatingLabel
                :value="convertFigureToCurrency(cashBalance.amount)"
                type="text"
                errorLabelClass="setup__error-label-text"
                errorContainerClass="setup__error-label-container"
                :floatingLabelText="labelCurrencyText"
                :overRideInputContainerClass="true"
                inputContainerClass="setup__input-container"
                @input="formatAndValidateCashBalanceInput"
                :errors="errors.cashBalance"
            />
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';
import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

import { MoneyObject } from '../Sales/types';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class CashBalance extends Mixins(ValidationMixin, UtilityMixins, CurrencyMixins) {
    private cashBalance: MoneyObject = {
        currencyKey: this.homeCurrencyKey, // default currency key for naira - to be used for testing purposes
        amount: 0,
    };
    public errors = {
        currency: '',
        cashBalance: '',
    };

    @Prop({ default: () => ({ currencyKey: 0, amount: 0 }) }) existingCashBalance!: MoneyObject;

    get labelCurrencyText() {
        return `Amount (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }

    public isWholeNumber(value: string) {
        return Number(value) === parseInt(value, 10);
    }

    public validateCashBalance(amount: string): boolean {
        const inputedNumber = this.convertFormattedFiguresToNumber(amount);

        if (!this.isWholeNumber(inputedNumber.toString())) {
            this.errors.cashBalance = 'Invalid';
            return false;
        }
        this.errors.cashBalance = '';
        return true;
    }

    public formatAndValidateCashBalanceInput(cashBalance: string) {
        if (this.validateCashBalance(cashBalance)) {
            const inputToNumber = this.convertFormattedFiguresToNumber(cashBalance);
            this.cashBalance = Object.assign({}, this.cashBalance, {
                currencyKey: Number(this.homeCurrencyKey),
                amount: inputToNumber,
            });
        }
    }

    public handleNextButtonClick() {
        this.validateCashBalance(this.cashBalance.amount.toString());
        if (!this.errors.cashBalance) {
            // the payload of key and value will be used to set the value of the businessMigrationData object in index.vue
            this.$nextTick(() => {
                this.$emit('proceed-to-the-next-section', {
                    key: 'cashBalance',
                    value: { ...this.cashBalance, currencyKey: Number(this.cashBalance.currencyKey) },
                });
            });
        }
    }

    private prepopulateForm() {
        this.cashBalance = this.existingCashBalance;
    }

    mounted() {
        this.prepopulateForm();
    }
}
</script>

<style lang="scss"></style>
