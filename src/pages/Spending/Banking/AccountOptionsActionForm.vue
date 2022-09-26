<template>
    <div>
        <b-row>
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Choose Account"
                    keyProperty="bankAccountKey"
                    valueProperty="bankAccountKey"
                    textProperty="displayName"
                    :disabled="true"
                    :options="paymentAccounts"
                    :value="accountClosureForm.bankAccountKey"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Balance"
                    :disabled="true"
                    :value="accountBalance"
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col v-if="showBalanceDestination">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Move Balance To"
                    defaultOptionText="--Select Destination Account--"
                    keyProperty="paymentAccountKey"
                    valueProperty="paymentAccountKey"
                    textProperty="displayNameWithBalance"
                    :options="availableDestinationAccounts"
                    :errors="balanceDestinationError"
                    v-model="accountClosureForm.balanceDestinationAccount"
                    @input="
                        validateBalanceDestinationAccount(
                            accountHasBalance,
                            accountClosureForm.balanceDestinationAccount,
                        )
                    "
                />
            </b-col>

            <b-col v-if="!isAccountClosureForm">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Overdraft Limit', selectedCurrencyKey)"
                    :value="formattedLimitAmount"
                    :errors="accountLimitError"
                    @input="formatAndValidateOverdraft"
                />
            </b-col>
        </b-row>

        <b-row class="account-options__footer">
            <GeneralFormError class="account-options__error" :message="generalFormError" />
            <BasePrimaryButton
                buttonText="Submit"
                :disabled="disableFormButton"
                @button-clicked="handleFormSubmission"
            />
            <!-- :status="requestStatus" -->
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { PaymentAccount } from '@/types';
import { BankAccount, AccountOptions } from '@/pages/Spending/Banking/types';

import UtilityMixin from '@/mixins/Utility';
import BankingMixin from '@/pages/Spending/Banking/BankingMixin';
import CurrencyMixins from '@/mixins/currency';

import BankModule from '@/store/modules/bank.ts';

const bank = namespace('bank');
let bankModule: BankModule;

@Component
export default class AccountOptionsActionForm extends Mixins(UtilityMixin, BankingMixin, CurrencyMixins) {
    @Prop({ required: true }) readonly selectedAccount!: BankAccount;
    @Prop({ required: true }) readonly selectedOption!: AccountOptions;

    private selectedCurrencyKey = this.selectedAccount.accountBalance.currencyKey;

    private accountClosureForm = {
        bankAccountKey: this.selectedAccount.bankAccountKey,
        balanceDestinationAccount: '',
    };

    private accountOverdraftForm = {
        bankAccountKey: this.selectedAccount.bankAccountKey,
        overdraftLimit: { amount: 0, currencyKey: this.selectedCurrencyKey },
    };

    private formattedLimitAmount = '';

    @bank.State
    private paymentAccounts!: Array<PaymentAccount>;

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get availableDestinationAccounts() {
        const { bankAccountKey } = this.selectedAccount;
        return this.updatedPaymentAccounts.filter(paymentAccount => {
            return paymentAccount.paymentAccountKey != bankAccountKey;
        });
    }

    get disableFormButton() {
        return this.isAccountClosureForm ? !this.accountClosureFormIsValidated : !this.overdraftFormIsValidated;
    }

    get isAccountClosureForm() {
        return this.selectedOption === AccountOptions.CLOSURE;
    }

    get showBalanceDestination() {
        return this.isAccountClosureForm && this.accountHasBalance;
    }

    get accountBalance() {
        let { accountBalance } = this.selectedAccount;
        accountBalance = this.$options.filters.amountWithCurrency(accountBalance);
        return accountBalance;
    }

    get accountHasBalance() {
        const { accountBalance } = this.selectedAccount;
        return accountBalance.amount > 0;
    }

    private formatAndValidateOverdraft(overdraftLimit: string) {
        const overdraftLimitAmount = this.convertFormattedFiguresToNumber(overdraftLimit);
        if (this.validateOverdaftLimit(String(overdraftLimitAmount))) {
            this.formattedLimitAmount = this.convertFigureToCurrency(overdraftLimitAmount);
            const currencyKey = Number(this.selectedCurrencyKey);
            const amount = overdraftLimitAmount;
            this.$set(this.accountOverdraftForm, 'overdraftLimit', { currencyKey, amount });
            return;
        }
        this.formattedLimitAmount = '';
        this.accountOverdraftForm.overdraftLimit.amount = 0;
    }

    private handleFormSubmission() {
        if (this.isAccountClosureForm) {
            this.validateAccountClosureForm();
            return;
        }
        this.validateOverdraftForm();
    }

    private validateAccountClosureForm() {
        if (
            !this.validateBalanceDestinationAccount(
                this.accountHasBalance,
                this.accountClosureForm.balanceDestinationAccount,
            )
        )
            return;
        //submit form
    }

    private validateOverdraftForm() {
        const { overdraftLimit } = this.accountOverdraftForm;
        if (!this.validateOverdaftLimit(String(overdraftLimit.amount))) return;
        //submit form
    }

    private async getPaymentAccouts() {
        await bankModule.getPaymentAccounts();
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        this.getPaymentAccouts();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/account-options';
</style>
