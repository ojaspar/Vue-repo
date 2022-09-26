<template>
    <b-container fluid class="loan-repayment-form">
        <div>
            <BaseDateFieldWithBorderAndFloatingLabel
                floatingLabelText="Payment Date"
                v-model="loanRepayment.paymentDate"
                :errors="loanRepaymentError.paymentDate"
                @input="validateLoanRepaymentDate(loanRepayment.paymentDate, '', 'repaymentForm')"
            />
        </div>

        <div>
            <BaseInputFieldWithBorderAndFloatingLabel
                floatingLabelText="Amount Paid"
                :value="formattedAmountPaid"
                :errors="loanRepaymentError.amountPaid"
                @input="fomartAndValidateAmountPaid"
            />
        </div>

        <div>
            <BaseSelectWithBorderAndFloatingLabel
                floatingLabelText="Paid From"
                defaultOptionText="--Select Account--"
                keyProperty="paymentAccountKey"
                valueProperty="paymentAccountKey"
                textProperty="displayNameWithBalance"
                :options="updatedPaymentAccounts"
                v-model="loanRepayment.paymentAccountKey"
                :errors="loanRepaymentError.paymentAccount"
                @input="validateLoanRepaymentAccount(loanRepayment.paymentAccountKey)"
            />
        </div>

        <b-row class="loan-repayment-form__footer">
            <GeneralFormError :message="generalFormError" />
            <BasePrimaryButton
                buttonText="Add Payment"
                :disabled="disableFormButton"
                :status="financingRequestStatus.addLoanRepayment"
                @button-clicked="handlePaymentForm"
            />
        </b-row>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { LoanRepayment, defaultLoanRepayment } from '@/pages/Financing/Loan/types';
import { PaymentAccount, NotificationType, Status } from '@/types';
import { FinancingRequestStatus } from '@/pages/Financing/Capital/types';

import LoanMixin from '@/pages/Financing/Loan/loanMixin';
import UtilityMixin from '@/mixins/Utility';
//import ValidationMixin from '@/mixins/validation';

import BankModule from '@/store/modules/bank.ts';
import FinanceModule from '@/store/modules/finance';

const bank = namespace('bank');
const finance = namespace('finance');

let bankModule: BankModule;
let financeModule: FinanceModule;

@Component
export default class LoanRepaymentForm extends Mixins(LoanMixin, UtilityMixin) {
    @Prop({ required: true }) readonly servicingLoan!: string;

    private loanRepayment: LoanRepayment = { ...defaultLoanRepayment };

    private formattedAmountPaid = '';

    @bank.State
    private paymentAccounts!: Array<PaymentAccount>;

    @finance.State
    private financingRequestStatus!: FinancingRequestStatus;

    @finance.State
    private error!: string;

    get disableFormButton() {
        return !this.loanRepaymentFormIsValidated;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    private fomartAndValidateAmountPaid(amount: string) {
        const amountPaid = this.convertFormattedFiguresToNumber(amount);

        if (this.validateLoanRepaymentAmount(String(amountPaid))) {
            this.loanRepayment.amountPaid.amount = amountPaid;
            this.formattedAmountPaid = this.convertFigureToCurrency(amountPaid);
            return;
        }
        this.loanRepayment.amountPaid.amount = 0;
        this.formattedAmountPaid = '';
    }

    private handlePaymentForm() {
        this.validateLoanRepaymentForm(this.loanRepayment);
        if (!this.loanRepaymentFormIsValidated) return;
        this.loanRepayment.loanKey = this.servicingLoan;
        this.addLoanRepayment();
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
                id: 'loan-repayment-notification',
            });
            return;
        }
    }

    private clearPaymentForm() {
        this.loanRepayment.paymentDate = '';
        this.loanRepayment.amountPaid.amount = 0;
        this.loanRepayment.paymentAccountKey = '';
    }

    private emitSuccessEvent() {
        this.$emit('loan-repayment-recorded');
    }

    private async addLoanRepayment() {
        await financeModule.addLoanRepayment(this.loanRepayment);

        if (this.financingRequestStatus.addLoanRepayment === Status.SUCCESS) {
            this.clearPaymentForm();
            this.showNotification(NotificationType.SUCCESS, 'Loan repayment added successfully!');
            this.emitSuccessEvent();
            return;
        }

        if (this.financingRequestStatus.addLoanRepayment === Status.ERROR) {
            this.setGeneralError(this.error);
            return;
        }
    }

    private assignModules() {
        bankModule = getModule(BankModule, this.$store);
        financeModule = getModule(FinanceModule, this.$store);
    }

    private async getPaymentAccounts() {
        await bankModule.getPaymentAccounts();
    }

    mounted() {
        this.assignModules();
        this.clearPaymentForm();
        this.getPaymentAccounts();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/loan-repayment-form';
</style>
