<template>
    <div>
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="New Payment"
                    :value="convertFigureToCurrency(form.amountPaid.amount)"
                    @input="amountPaidInputHandler"
                />
            </b-col>
        </b-row>

        <b-row>
            <!-- Fund Source -->
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Paid To"
                    keyProperty="paymentAccountKey"
                    valueProperty="paymentAccountKey"
                    textProperty="displayNameWithBalance"
                    defaultOptionText="-- Select Account --"
                    :options="businessPaymentAccounts"
                    v-model="form.paymentAccountKey"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Outstanding Balance"
                    disabled
                    :value="outstandingBalance | amountWithCurrency"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="Payment Date" v-model="form.paymentDate" />
            </b-col>
        </b-row>

        <BlockErrorMessage :message="errorMessage" />

        <!-- Next Button -->
        <b-row class="align-items-center mt-1 mb-1">
            <b-col>
                <BasePrimaryButton
                    buttonText="Save"
                    class="mr-auto ml-auto"
                    @button-clicked="validateAndSubmitForm"
                    :status="expenseRequestStatus.addPayment"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

import { MoneyObject, PaymentAccount, Status } from '@/types';
import { ExpensePayment } from '@/pages/Spending/Expense/types';

@Component
export default class UpdatePayment extends Mixins(CurrencyMixins, ExpenseMixin, UtilityMixins) {
    private form: ExpensePayment = {
        amountPaid: { amount: 0, currencyKey: this.homeCurrencyKey },
        paymentAccountKey: '',
        paymentDate: '',
        expenseKey: '',
    };

    get businessPaymentAccounts(): Array<PaymentAccount> {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get outstandingBalance(): MoneyObject {
        const { amount: balance } = this.expenseDetails.balance;
        const { amount: amountPaid } = this.form.amountPaid;

        if (isNaN(amountPaid)) {
            return {
                amount: Number(this.expenseDetails.balance.amount),
                currencyKey: this.homeCurrencyKey,
            };
        }

        return {
            amount: Number(balance) - amountPaid,
            currencyKey: this.homeCurrencyKey,
        };
    }

    private amountPaidInputHandler(amountPaid: string) {
        const amountToInteger = this.convertFormattedFiguresToNumber(amountPaid);

        // this.validateAmountPaid(amountToInteger, Number(this.expenseDetails.balance.amount));

        this.form.amountPaid = Object.assign({}, this.form.amountPaid, {
            ...this.form.amountPaid,
            amount: amountToInteger,
        });
    }

    private validateAndSubmitForm() {
        // this.validateUpdatePaymentForm(this.form, Number(this.expenseDetails.balance.amount));

        // if (!this.updatePaymentFormIsValidated) return;

        this.addPaymentToExpense();
    }

    private async addPaymentToExpense() {
        // await this.expensesModule.addPayment({});
        // await this.expe.addSalePayment({
        // ...this.form,
        //     saleKey: this.expenseDetails.saleKey,
        // });

        // Add this amount paid to the expenseDetails.amountPaid to reduce http call here

        if (this.expenseRequestStatus.addPayment === Status.SUCCESS) {
            this.$emit('hide-modal');
        }
    }

    mounted() {
        this.$set(this.form.amountPaid, 'currencyKey', this.homeCurrencyKey);
    }
}
</script>
