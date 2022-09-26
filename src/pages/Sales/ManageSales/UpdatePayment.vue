<template>
    <div>
        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="New Payment"
                    :value="convertFigureToCurrency(form.amountPaid.amount)"
                    @input="amountPaidInputHandler"
                    :errors="updatePaymentFormError.amountPaid"
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
                    @input="validatePaymentAccountKey"
                    :errors="updatePaymentFormError.paymentAccountKey"
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
                <BaseDateFieldWithBorderAndFloatingLabel
                    floatingLabelText="Payment Date"
                    v-model="form.dateReceived"
                    @input="validateDateReceived"
                    :errors="updatePaymentFormError.dateReceived"
                />
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
                    :status="salesRequestStatus.addSalePayment"
                    :disabled="!updatePaymentFormIsValidated"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import SalesMixin from '@/pages/Sales/SalesMixin';
import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

import { MoneyObject, PaymentAccount, Status } from '@/types';
import { AddSalesPayment } from '@/pages/Sales/ManageSales/types';

@Component
export default class UpdatePayment extends Mixins(CurrencyMixins, SalesMixin, UtilityMixins) {
    private form: AddSalesPayment = {
        amountPaid: { amount: 0, currencyKey: this.homeCurrencyKey },
        paymentAccountKey: '',
        dateReceived: this.todayAsDefaultDate(),
        saleKey: '',
    };

    get businessPaymentAccounts(): Array<PaymentAccount> {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get outstandingBalance(): MoneyObject {
        const { amount: balance } = this.saleDetails.balance;
        const { amount: amountPaid } = this.form.amountPaid;

        if (isNaN(amountPaid)) {
            return {
                amount: Number(this.saleDetails.balance.amount),
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

        // this.validateAmountPaid(amountToInteger, Number(this.saleDetails.balance.amount));

        this.form.amountPaid = Object.assign({}, this.form.amountPaid, {
            ...this.form.amountPaid,
            amount: amountToInteger,
        });
    }

    private validateAndSubmitForm() {
        this.validateUpdatePaymentForm(this.form, Number(this.saleDetails.balance.amount));

        // if (!this.updatePaymentFormIsValidated) return;

        this.addPayment();
    }

    private async addPayment() {
        await this.salesModule.addSalePayment({
            ...this.form,
            saleKey: this.saleDetails.saleKey,
        });

        // Add this amount paid to the saleDetails.amountPaid to reduce http call here

        if (this.salesRequestStatus.addSalePayment === Status.SUCCESS) {
            this.$emit('hide-modal');
        }
    }

    mounted() {
        this.$set(this.form.amountPaid, 'currencyKey', this.homeCurrencyKey);
    }
}
</script>
