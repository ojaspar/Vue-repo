<template>
    <b-container fluid class="loan-form">
        <!-- Lender Name -->
        <b-row class="loan-form__row">
            <b-col class="loan-form__input">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Name of lender"
                    v-model="loan.lenderName"
                    :errors="loanFormError.lender"
                    @input="validateLoanLender(loan.lenderName)"
                />
            </b-col>
        </b-row>

        <b-row class="loan-form__row-spilt">
            <!-- Principal -->
            <b-col class="loan-form__split--left">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Principal"
                    :value="formattedPrincipalAmount"
                    :errors="loanFormError.principal"
                    @input="fomartAndValidatePrincipal"
                />
            </b-col>
            <!-- Account Paid To -->
            <b-col class="loan-form__split--right mt-1">
                <BaseSelectWithBorderAndFloatingLabel
                    floatingLabelText="Paid To"
                    defaultOptionText="--Select Account--"
                    keyProperty="paymentAccountKey"
                    valueProperty="paymentAccountKey"
                    textProperty="displayNameWithBalance"
                    :options="updatedPaymentAccounts"
                    v-model="loan.paymentAccountKey"
                    :errors="loanFormError.paymentAccount"
                    @input="validateLoanPaymentAccount(loan.paymentAccountKey)"
                />
            </b-col>
        </b-row>

        <b-row class="loan-form__row-spilt">
            <!-- Loan Interest -->
            <b-col class="loan-form__split--left class">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Interest"
                    :value="formattedInterestAmount"
                    :errors="loanFormError.interest"
                    @input="fomartAndValidateInterest"
                />
            </b-col>
            <!-- Loan Date -->
            <b-col class="loan-form__split--right">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :required="true"
                    floatingLabelText="Loan Date"
                    v-model="loan.loanDate"
                    :errors="loanFormError.transactionDate"
                    @input="validateLoanTransactionDate(loan.loanDate, loan.firstRepaymentDate)"
                />
            </b-col>
        </b-row>

        <b-row class="loan-form__row-spilt">
            <!-- Loan Amount -->
            <b-col class="loan-form__split--left">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Total Amount"
                    :disabled="true"
                    :value="totalLoanAmount"
                />
            </b-col>
            <!-- Loan Tenor -->
            <b-col class="loan-form__split--right">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Tenor (Months)"
                    type="number"
                    min="1"
                    v-model="loan.tenor"
                    :errors="loanFormError.tenor"
                    @input="validateTenor"
                />
            </b-col>
        </b-row>

        <b-row class="loan-form__row-spilt">
            <!-- Effective Rate -->
            <b-col class="loan-form__split--left class">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Effective Rate"
                    :disabled="true"
                    :value="`${effectiveRateAmount}%`"
                />
            </b-col>
            <!-- First Repayment Date -->
            <b-col class="loan-form__split--right">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :required="true"
                    floatingLabelText="First Repayment Date"
                    v-model="loan.firstRepaymentDate"
                    :errors="loanFormError.repaymentDate"
                    @input="validateLoanRepaymentDate(loan.firstRepaymentDate, loan.loanDate)"
                />
            </b-col>
        </b-row>

        <b-row class="loan-form__footer">
            <GeneralFormError :message="generalFormError" />
            <BasePrimaryButton
                buttonText="Submit"
                :disabled="disableFormButton"
                :status="financingRequestStatus.addLoan"
                @button-clicked="handleLoanForm"
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
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Loan, defaultLoan } from '@/pages/Financing/Loan/types';
import { FinancingRequestStatus } from '@/pages/Financing/Capital/types';
import { PaymentAccount, NotificationType, Status } from '@/types';

import LoanMixin from '@/pages/Financing/Loan/loanMixin';
import ValidationMixin from '@/mixins/validation';
import UtilityMixin from '@/mixins/Utility';

import BankModule from '@/store/modules/bank';
import FinanceModule from '@/store/modules/finance';

const bank = namespace('bank');
const finance = namespace('finance');

let bankModule: BankModule;
let financeModule: FinanceModule;

@Component
export default class LoanForm extends Mixins(LoanMixin, ValidationMixin, UtilityMixin) {
    private loan: Loan = { ...defaultLoan };

    private formattedPrincipalAmount = '0';
    private formattedInterestAmount = '0';

    @bank.State
    private paymentAccounts!: Array<PaymentAccount>;

    @finance.State
    private financingRequestStatus!: FinancingRequestStatus;

    @finance.State
    private error!: string;

    get disableFormButton(): boolean {
        return !this.loanFormIsValidated;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get totalLoanAmount(): string {
        const { totalPrincipal, totalInterest } = this.loan;
        const totalLoanAmount = totalPrincipal.amount + totalInterest.amount;
        if (this.principalInputFieldHasError || this.interestInputFieldHasError) return '0';
        return this.convertFigureToCurrency(totalLoanAmount);
    }

    get effectiveRateAmount(): string {
        const { totalPrincipal, totalInterest } = this.loan;
        const principalAmount = totalPrincipal.amount;
        const interestAmount = totalInterest.amount;
        const rate = (interestAmount / principalAmount) * 100;
        if (!rate || this.principalInputFieldHasError || this.interestInputFieldHasError) return '0';
        if (rate % 1 != 0) return rate.toFixed(2);
        return rate.toString();
    }

    get tenorsInYears(): number {
        const { tenor } = this.loan;
        return tenor ? tenor / 12 : 0;
    }

    get principalInputFieldHasError(): boolean {
        const principalInputError = this.loanFormError.principal;
        return this.hasError(principalInputError);
    }

    get interestInputFieldHasError(): boolean {
        const interestInputError = this.loanFormError.interest;
        return this.hasError(interestInputError);
    }

    private fomartAndValidatePrincipal(principalAmountInput: string) {
        const principalAmount = this.convertFormattedFiguresToNumber(principalAmountInput);

        if (this.validatePrincipalAmount(principalAmount.toString())) {
            this.loan.totalPrincipal.amount = principalAmount;
            this.formattedPrincipalAmount = this.convertFigureToCurrency(principalAmount);
            return;
        }
        this.formattedPrincipalAmount = '';
    }

    private fomartAndValidateInterest(interestAmountInput: string) {
        const interestAmount = this.convertFormattedFiguresToNumber(interestAmountInput);

        if (this.validateInterestAmount(interestAmount.toString())) {
            this.loan.totalInterest.amount = interestAmount;
            this.formattedInterestAmount = this.convertFigureToCurrency(interestAmount);
            return;
        }
        this.formattedInterestAmount = '';
    }

    private validateTenor(tenor: string) {
        if (this.validateLoanTenor(tenor)) {
            this.loan.tenor = Number(tenor);
        }
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
                id: 'add-loan-notification',
            });
            return;
        }
    }

    private redirectToFinanceDashboard() {
        setTimeout(() => {
            this.$router.push({ name: 'Financing' });
        }, 1500);
    }

    private clearLoanForm() {
        this.$nextTick(() => {
            this.formattedPrincipalAmount = '';
            this.formattedInterestAmount = '';
            this.loan.totalPrincipal.amount = 0;
            this.loan.totalInterest.amount = 0;
            this.loan = { ...defaultLoan };
        });
    }

    private handleLoanForm() {
        this.validateLoanForm(this.loan);
        if (!this.loanFormIsValidated) return;
        this.addNewLoan();
    }

    private async getPaymentAccouts() {
        await bankModule.getPaymentAccounts();
    }

    private async addNewLoan() {
        await financeModule.addLoan(this.loan);

        if (this.financingRequestStatus.addLoan === Status.SUCCESS) {
            this.clearLoanForm();
            this.showNotification(NotificationType.SUCCESS, 'Loan has been added successfully!');
            this.redirectToFinanceDashboard();
            return;
        }

        if (this.financingRequestStatus.addLoan === Status.ERROR) {
            this.setGeneralError(this.error);
            return;
        }
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        financeModule = getModule(FinanceModule, this.$store);

        this.getPaymentAccouts();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/loan-form';
</style>
