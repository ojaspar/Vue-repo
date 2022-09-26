<template>
    <b-container class="add-staff-payment">
        <Loader v-if="preliminaryRequestsAreLoading" size="3" class="add-staff-payment__loader" />

        <template v-else>
            <div class="add-staff-payment__bio-section" v-if="hideBioSection">
                <span class="add-staff-payment__bio-section--full-name">{{ fullName }}</span>
            </div>

            <template v-else>
                <!-- First Name -->
                <b-row class="add-staff-payment__row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            required="true"
                            floatingLabelText="First Name"
                            className="add-staff-payment__row--input w-100"
                            inputContainerClass="add-staff-payment-input"
                            floatingLabelClass="add-staff-payment-input__label"
                            v-model="addStaffPaymentForm.firstName"
                            :errors="addStaffPaymentError.firstName"
                        />
                    </b-col>
                </b-row>

                <!-- Last Name -->
                <b-row class="add-staff-payment__row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            required="true"
                            floatingLabelText="Last Name"
                            className="add-staff-payment__row--input w-100"
                            inputContainerClass="add-staff-payment-input"
                            floatingLabelClass="add-staff-payment-input__label"
                            v-model="addStaffPaymentForm.lastName"
                            :errors="addStaffPaymentError.lastName"
                        />
                    </b-col>
                </b-row>

                <!-- Phone Number -->
                <b-row class="add-staff-payment__row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            required="true"
                            floatingLabelText="Phone Number"
                            className="add-staff-payment__row--input w-100"
                            inputContainerClass="add-staff-payment-input"
                            floatingLabelClass="add-staff-payment-input__label"
                            v-model="addStaffPaymentForm.phoneNumber"
                            :errors="addStaffPaymentError.phoneNumber"
                        />
                    </b-col>
                </b-row>
            </template>

            <!-- Payment Type -->
            <b-row no-gutters class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseRadioGroupWithBorderAndFloatingLabel
                        floatingLabelText="Payment"
                        :radioButtonOptions="paymentTypeOptions"
                        :checkedValue="addStaffPaymentForm.paymentType"
                        @change="setPaymentType"
                    />
                </b-col>
            </b-row>

            <!-- Payment Period -->
            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultOptionText="-- Select Payment Period --"
                        floatingLabelText="Month & Year"
                        selectContainerClass="add-staff-payment-input"
                        floatingLabelClass="add-staff-payment-input__label"
                        className="add-staff-payment__row--select"
                        @change="setPaymentPaymentPeriod"
                        :options="monthsTillCurrentMonth"
                        v-model="addStaffPaymentForm.paymentPeriod"
                    />
                </b-col>
                <b-col class="p-0 ml-3">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :floatingLabelText="amountLabel"
                        className="add-staff-payment__row--input w-100"
                        inputContainerClass="add-staff-payment-input"
                        floatingLabelClass="add-staff-payment-input__label"
                        :value="convertFigureToCurrency(addStaffPaymentForm.paymentAmount.amount)"
                        :errors="addStaffPaymentError.paymentAmount"
                        @input="handlePaymentAmountInput"
                    />
                </b-col>
            </b-row>

            <!-- Amount -->
            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseRadioGroupWithBorderAndFloatingLabel
                        :floatingLabelText="taxTypeSelectionText"
                        :radioButtonOptions="taxPaymentOptions"
                        :checkedValue="addStaffPaymentForm.payTax"
                        @change="setTaxPaymentOption"
                    />
                </b-col>
                <b-col class="p-0 ml-3">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        required="true"
                        floatingLabelText="Deductions"
                        className="add-staff-payment__row--input w-100"
                        inputContainerClass="add-staff-payment-input"
                        floatingLabelClass="add-staff-payment-input__label"
                        :value="convertFigureToCurrency(addStaffPaymentForm.deduction.amount)"
                        :disabled="paymentAmountIsZero"
                        :errors="addStaffPaymentError.deduction"
                        @input="handleDeductionInput"
                    />
                </b-col>
            </b-row>

            <!-- Deductions -->
            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :disabled="true"
                        floatingLabelText="Net Pay"
                        className="add-staff-payment__row--input w-100"
                        inputContainerClass="add-staff-payment-input"
                        floatingLabelClass="add-staff-payment-input__label"
                        :value="convertFigureToCurrency(netPay)"
                    />
                </b-col>
            </b-row>

            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultOptionText="-- Select Payment Account --"
                        floatingLabelText="Paid From"
                        selectContainerClass="add-staff-payment-input"
                        floatingLabelClass="add-staff-payment-input__label"
                        className="add-staff-payment__row--select"
                        keyProperty="paymentAccountKey"
                        valueProperty="paymentAccountKey"
                        textProperty="displayNameWithBalance"
                        :errors="addStaffPaymentError.paymentAccount"
                        :options="updatedPaymentAccounts"
                        v-model="addStaffPaymentForm.paymentAccountKey"
                    />
                </b-col>
            </b-row>

            <!-- Transaction Date -->
            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        floatingLabelText="Transaction Date"
                        :disabled="disableTransactionDate"
                        :errors="addStaffPaymentError.transactionDate"
                        v-model="addStaffPaymentForm.transactionDate"
                        @input="validateTransactionDate(addStaffPaymentForm.transactionDate)"
                    />
                </b-col>
            </b-row>

            <!-- Notes -->
            <b-row class="add-staff-payment__row">
                <b-col class="p-0">
                    <BaseTextAreaWithBorderAndFloatingLabel
                        floatingLabelText="Notes"
                        className="add-staff-payment__row--text-area"
                        v-model="addStaffPaymentForm.notes"
                        :errors="addStaffPaymentError.notes"
                    />
                </b-col>
            </b-row>

            <!-- Buttons -->
            <b-row class="add-staff-payment__button-container">
                <p class="add-staff-payment__button-info-section" v-if="showTaxInfo">
                    Additonal tax amount of <b>{{ formattedTaxAmount }}</b> will be incurred!
                </p>
                <!-- <div class="add-staff-payment__error-container">
                                                                                               
                </div> -->
                <BaseSecondaryButton buttonText="Cancel" @button-clicked="$emit('hide-add-staff-payment-form')" />

                <BasePrimaryButton
                    @button-clicked="handleFormSubmission"
                    :buttonText="buttonText"
                    :status="addStaffForPaymentRequestStatus"
                    :disabled="addStaffPaymentFormHasError"
                />
            </b-row>
        </template>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';
import debounce from 'lodash.debounce';

import SalariesAndCommissionsModule from '@/store/modules/salariesAndCommissions';
import ExpenseModule from '@/store/modules/expense';

import {
    PaymentTypes,
    SalariesAndCommissionRequestStatus,
    Staff,
    StaffPaymentRequest,
    TaxTypes,
    StaffPaymentRecordState,
    defaultStaffPaymentState,
} from '@/pages/Spending/SalariesAndCommissions/types';
import { PaymentAccount, RadioButtonOption, Status } from '@/types';

import SalariesAndCommissionsMixin from '@/pages/Spending/SalariesAndCommissions/SalariesAndCommissionsMixin';
import CurrencyMixins from '@/mixins/currency';

import { isEmpty } from '@/utils/formValidator';
import deepCloneFunction from '@/utils/deepCloneFunction';
import { ExpenseRequestStatus } from '../Expense/types';

const salariesAndCommissions = namespace('salariesAndCommissions');
const expenses = namespace('expense');
let salariesAndCommissionsModule: SalariesAndCommissionsModule;
let expenseModule: ExpenseModule;

@Component
export default class AddStaff extends Mixins(SalariesAndCommissionsMixin, CurrencyMixins) {
    private debounceTime = Number(process.env.VUE_APP_DEBOUNCE_TIME);
    private showDeductions = false;
    private hideBioSection = false;
    private addStaffPaymentForm: StaffPaymentRequest = { ...defaultStaffPaymentState };
    private paymentTypeOptions: RadioButtonOption = {
        name: 'paymentType',
        values: [PaymentTypes.SALARY, PaymentTypes.COMMISSION],
    };
    private taxPaymentOptions: RadioButtonOption = {
        name: 'payTax',
        values: ['Yes', 'No'],
    };

    private isBackDatedPayment = false;

    @salariesAndCommissions.State
    private salariesAndCommissionRequestStatus!: SalariesAndCommissionRequestStatus;

    @salariesAndCommissions.State
    private taxAmount!: number;

    @expenses.State
    private paymentAccounts!: PaymentAccount[];

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @Prop({ default: defaultStaffPaymentState }) selectedStaff!: Staff;
    @Prop({ required: true }) staffPaymentRecordState!: StaffPaymentRecordState;
    @Prop({ default: '' }) nameOfStaffToCreate!: string;
    @Prop({ default: defaultStaffPaymentState }) staffPaymentForEdit!: StaffPaymentRequest;
    @Prop({ default: () => [] }) paymentDrafts!: Array<StaffPaymentRequest>;
    @Prop({ required: true }) indexOfPaymentBeingEdited!: number;
    @Prop({ default: '' }) errorMessage!: string;

    get deductionsText(): string {
        return this.showDeductions ? 'Hide Deductions' : 'Show Deductions';
    }

    get amountLabel(): string {
        return this.showDeductions ? 'Full Pay' : 'Amount';
    }

    get taxTypeSelectionText() {
        return 'Pay ' + this.taxType;
    }

    get taxType(): string {
        return this.addStaffPaymentForm.paymentType === 'commission' ? 'Witholding Tax (WHT)' : 'Income Tax (PAYE)';
    }

    get paymentIncluesTax(): boolean {
        return this.addStaffPaymentForm.payTax === 'Yes';
    }

    get netPay(): number {
        const { paymentAmount, deduction } = this.addStaffPaymentForm;
        const netPay = Number(paymentAmount.amount) - Number(deduction.amount);

        if (netPay < 0) {
            return 0;
        }

        return netPay;
    }

    get fullName(): string {
        const { firstName, lastName } = this.addStaffPaymentForm;
        return `${firstName} ${lastName}`;
    }

    get addStaffPaymentRequestIsLoading(): boolean {
        return this.salariesAndCommissionRequestStatus.addStaffForPayment === Status.LOADING;
    }

    get addStaffForPaymentRequestStatus(): string {
        const request = this.salariesAndCommissionRequestStatus;
        return this.isBackDatedPayment ? request.paySalaryCommission : request.addStaffForPayment;
    }

    get paymentAmountIsZero(): boolean {
        const { paymentAmount } = this.addStaffPaymentForm;

        return paymentAmount.amount === 0;
    }

    get taxAmountToBeShown(): number {
        const { paymentAmount, payTax } = this.addStaffPaymentForm;
        if (Number(paymentAmount.amount) === 0 || payTax === 'No') {
            return 0;
        }

        return this.taxAmount;
    }

    get buttonText(): string {
        const { staffPaymentRecordState } = this;

        return this.isBackDatedPayment
            ? 'Submit Payment'
            : staffPaymentRecordState === StaffPaymentRecordState.editPaymentDraft
            ? 'Save Changes'
            : 'Add Payment';
    }

    get preliminaryRequestsAreLoading(): boolean {
        return this.expenseRequestStatus.getExpensePaymentAccounts === Status.LOADING;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get disableTransactionDate() {
        const { staffPaymentRecordState, paymentDrafts, indexOfPaymentBeingEdited } = this;
        if (staffPaymentRecordState != StaffPaymentRecordState.editPaymentDraft) {
            return paymentDrafts.length > 0;
        }
        return paymentDrafts.length > 0 && indexOfPaymentBeingEdited > 0;
    }

    get showTaxInfo(): boolean {
        return this.taxAmountToBeShown > 0 && !this.showError;
    }

    get showError(): boolean {
        if (!this.errorMessage) return false;

        return true;
    }

    get formattedTaxAmount(): string {
        return this.$options.filters.amountWithCurrency({
            amount: this.taxAmountToBeShown,
            currencyKey: this.defaultCurrency.currencyKey,
        });
    }

    @Watch('addStaffPaymentForm.firstName')
    validateFirstNameInput = debounce((firstNameValue: string) => {
        this.$nextTick(() => {
            const { validateStaffFirstName } = this;
            validateStaffFirstName(firstNameValue);
        });
    }, this.debounceTime);

    @Watch('addStaffPaymentForm.lastName')
    validateStaffLastNameInput = debounce((lastNameValue: string) => {
        this.$nextTick(() => {
            const { validateStaffLastName } = this;
            validateStaffLastName(lastNameValue);
        });
    }, this.debounceTime);

    @Watch('addStaffPaymentForm.phoneNumber')
    validateStaffPhoneNumberInput = debounce((phoneNumberValue: string) => {
        this.$nextTick(() => {
            const { validateStaffPhoneNumber } = this;
            validateStaffPhoneNumber(phoneNumberValue);
        });
    }, this.debounceTime);

    @Watch('addStaffPaymentForm.notes')
    validateStaffNotesInput = debounce((notesValue: string) => {
        this.$nextTick(() => {
            const { validateStaffNotes } = this;
            validateStaffNotes(notesValue);
        });
    }, this.debounceTime);

    @Watch('addStaffPaymentForm.payTax')
    @Watch('addStaffPaymentForm.paymentType')
    calculateTaxIfUserSpecifies() {
        const { payTax, paymentType, paymentAmount } = this.addStaffPaymentForm;

        this.$nextTick(() => {
            // if the value of the paymentAmount is 0, then there is no need to calculate tax
            if (paymentAmount.amount === 0 || payTax === 'No') return;

            this.calculateTaxAmountToBePaid(paymentType);
        });
    }

    //determine if the supplied transaction date is in the past
    @Watch('addStaffPaymentForm.transactionDate')
    checkSelectedDate(selectedDate: string) {
        this.isBackDatedPayment = this.isDateBeforeToday(selectedDate);
    }

    private handlePaymentAmountInput(paymentAmountInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(paymentAmountInput);
        this.validatePaymentAmount(inputToNumber);

        if (inputToNumber === 0) {
            // if the user changes full pay to 0, then deduction should be cleared;
            this.addStaffPaymentForm.deduction.amount = 0;
            this.setSalaryCommissionError('paymentAmount', 'Invalid');
            return;
        }

        // if the user selected that tax should be calculated and the value of the fullpay is not 0, then let's calculate it
        const { deduction } = this.addStaffPaymentForm;
        this.validateStaffDeduction(deduction.amount, inputToNumber);

        this.$nextTick(() => {
            this.addStaffPaymentForm.paymentAmount.amount = inputToNumber;

            this.checkAccountBalance();

            if (this.addStaffPaymentForm.payTax === 'Yes') {
                const { paymentType } = this.addStaffPaymentForm;
                this.calculateTaxAmountToBePaid(paymentType);
            }
        });
    }

    private handleDeductionInput(deductionInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(deductionInput);

        const { paymentAmount } = this.addStaffPaymentForm;

        this.addStaffPaymentForm.deduction.amount = inputToNumber;
        this.validateStaffDeduction(inputToNumber, paymentAmount.amount);
    }

    private checkAccountBalance() {
        const {
            paymentAmount: { amount },
            paymentAccountKey,
        } = this.addStaffPaymentForm;

        // get the account balance of the payment account key...
        const account = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );

        if (account) {
            const totalAmountPaidForSelectedPaymentAccountKey = this.paymentDrafts
                .filter((staffPayment: StaffPaymentRequest) => staffPayment.paymentAccountKey === paymentAccountKey)
                .reduce(
                    (currentSum: number, staffPayment: StaffPaymentRequest) =>
                        staffPayment.paymentAmount.amount + currentSum,
                    0,
                );

            // get the current account balance of the account factoring in all expense that have been done on the payment account

            const totalAmountPaid = totalAmountPaidForSelectedPaymentAccountKey + amount;

            if (totalAmountPaid > account.accountBalance) {
                this.setSalaryCommissionError('paymentAccount', 'Insufficient Balance');
                return;
            }
            this.setSalaryCommissionError('paymentAccount', '');
            return;
        }
    }

    private setPaymentPaymentPeriod(selectedPaymentPeriod: string) {
        this.$set(this.addStaffPaymentForm, 'paymentPeriod', selectedPaymentPeriod);
    }

    private setPaymentType(paymentType: PaymentTypes) {
        this.addStaffPaymentForm.paymentType = paymentType;
    }

    private setTaxPaymentOption(payTax: string) {
        this.addStaffPaymentForm.payTax = payTax;
    }

    private prepareFormForSubmission(staffPayment: StaffPaymentRequest): StaffPaymentRequest {
        const { paymentAmount, deduction } = staffPayment;

        return {
            ...staffPayment,
            paymentAmount,
            deduction,
        };
    }

    private async calculateTaxAmountToBePaid(paymentType: string): Promise<void> {
        const taxType = paymentType === PaymentTypes.SALARY ? TaxTypes.PAYE : TaxTypes.WITHOLDING;

        await salariesAndCommissionsModule.calculateTaxAmountForPayment({
            paymentAmount: this.addStaffPaymentForm.paymentAmount.amount,
            taxType,
        });
    }

    private async handleFormSubmission() {
        const { validateAllStaffPaymentFields, addStaffPaymentForm } = this;
        validateAllStaffPaymentFields(addStaffPaymentForm);
        // if there is an error in the form, just terminate the click
        if (this.addStaffPaymentFormHasError) return;

        const staffPaymentRequest = this.prepareFormForSubmission(this.addStaffPaymentForm);
        const { staffPaymentRecordState } = this;

        /*
        if the transaction date provided is in the past, the payment should not be added to
        the paymentDrafts. it should be submitted directly individually.
        */
        if (this.isBackDatedPayment) {
            this.$emit('make-backdated-payment', staffPaymentRequest);
            return;
        }

        if (staffPaymentRecordState === StaffPaymentRecordState.editPaymentDraft) {
            this.$emit('update-edited-payment', staffPaymentRequest);
            return;
        }

        this.$emit('add-staff-with-payment-to-draft', staffPaymentRequest);
        return;
    }

    private prefillFormWithDataForExtraStaffPayment(): void {
        const { lastAmountPaid, staffName, phoneNumber, staffPaymentKey } = deepCloneFunction(this.selectedStaff);

        this.hideBioSection = true;
        const [firstName, lastName] = staffName.split(' ');

        const dataToPrefill: StaffPaymentRequest = {
            paymentAmount: lastAmountPaid,
            firstName,
            lastName,
            phoneNumber: phoneNumber || '',
            paymentPeriod: this.currentMonthWithYear,
            paymentType: PaymentTypes.SALARY,
            payTax: 'No',
            deduction: { amount: 0, currencyKey: this.defaultCurrency.currencyKey },
            note: '',
            staffPaymentKey,
            paymentAccountKey: '',
            transactionDate: '',
        };

        this.addStaffPaymentForm = Object.assign({}, this.addStaffPaymentForm, dataToPrefill, {
            paymentAccountKey: this.updatedPaymentAccounts[0].paymentAccountKey || '',
            transactionDate: this.todayAsDefaultDate(),
        });

        this.checkAccountBalance();
    }

    private prefillFormWithStaffNameIfUserInputtedIt() {
        const { nameOfStaffToCreate } = this;

        // if the name is empty, we will prefill the payment period only and show the empty form
        if (isEmpty(nameOfStaffToCreate)) {
            this.$set(this.addStaffPaymentForm, 'paymentPeriod', this.currentMonthWithYear);
            this.$set(this.addStaffPaymentForm, 'paymentAmount', { currencyKey: this.homeCurrencyKey, amount: 0 });
            return;
        }

        // nameOfStaffToCreate e.g. John Doe;
        // if the name passed is fullname, split it into first and last names
        const nameOfStaffToCreateSplit: string[] = nameOfStaffToCreate.split(' '); // ["John", "Doe"];

        // if the array contains 2 items, then we know it was a full name that was passed
        const [firstName, ...otherNames] = nameOfStaffToCreateSplit;
        if (nameOfStaffToCreateSplit.length > 1) {
            this.addStaffPaymentForm.firstName = firstName;
            this.addStaffPaymentForm.lastName = otherNames.join(' ');
            return;
        }

        // first name only was passed;
        this.addStaffPaymentForm.firstName = firstName;
    }

    private prefillFormWithDataForStaffPaymentEdit(): void {
        this.addStaffPaymentForm = Object.assign({}, this.addStaffPaymentForm, this.staffPaymentForEdit, {
            paymentAccountKey: this.updatedPaymentAccounts[0].paymentAccountKey || '',
        });

        this.checkAccountBalance();

        // collapse the bio-section
        this.hideBioSection = true;
    }

    private setTodayAsDefaultDate() {
        this.addStaffPaymentForm.transactionDate = this.todayAsDefaultDate();
    }

    async mounted() {
        salariesAndCommissionsModule = getModule(SalariesAndCommissionsModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);

        await expenseModule.getPaymentAccounts();

        this.setTodayAsDefaultDate();
        this.addStaffPaymentForm.paymentAccountKey = this.updatedPaymentAccounts[0].paymentAccountKey;

        const { staffPaymentRecordState } = this;
        // if a new staff is to be added, then we want to prefill the form with the staff name if it was passed
        if (staffPaymentRecordState === StaffPaymentRecordState.createStaffWithPayment) {
            this.prefillFormWithStaffNameIfUserInputtedIt();
            return;
        }

        // if it is just another payment being made
        if (staffPaymentRecordState === StaffPaymentRecordState.addPaymentForExistingStaff) {
            this.prefillFormWithDataForExtraStaffPayment();
            return;
        }

        // until we have another option added to the enum state, we will use this as the default behavior
        this.prefillFormWithDataForStaffPaymentEdit();
        return;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/salaries-commissions/add-staff-payment';
</style>
