<template>
    <!-- <b-container fluid class="bio-data"> -->
    <div>
        <b-container fluid class="">
            <b-row no-gutters>
                <DashboardBreadCrumb
                    section="Expenses"
                    title="Pay Salary or Commission"
                    subTitle=""
                    sectionIsClickable="true"
                    @section-clicked="goToExpenseDashboard"
                />
            </b-row>
        </b-container>
        <div v-if="!paymentMadeSuccessfully">
            <div class="">
                <b-row class="add-staff-payment__row salaries-commissions__transcation-layout">
                    <b-col class="pl-lg-0 pr-lg-0 d-flex align-items-center mx-sm-0 mx-lg-1">
                        <p class="salaries-commissions__date">Transaction Date</p>
                        <BaseDateFieldWithBorderAndFloatingLabel
                            v-model="paymentAndCommission.transactionDate"
                            @input="validateTransactionDate(paymentAndCommission.transactionDate)"
                            inputClass="salaries-commissions__date-dashed"
                            :errors="paymentAndCommisionError.transactionDate"
                        />
                    </b-col>
                </b-row>
            </div>

            <!---->
            <b-container>
                <b-row>
                    <b-col>
                        <div class="salaries-commissions__container">
                            <div class="salaries-commissions__medium-plus-container">
                                <div class="salaries-commissions__header" v-if="showHeaderSection && !userIsOnMobile">
                                    <p class="m-0">{{ headerTitle }}</p>
                                </div>
                                <div class="salaries-commissions__content">
                                    <b-row>
                                        <b-col class="pl-lg-0 pr-lg-0" v-if="!addStaff">
                                            <StaffListAndSearch
                                                :staffs="staffListForPayment"
                                                :paymentAndCommissionRequestIsLoading="
                                                    paymentAndCommissionRequestIsLoading
                                                "
                                                @staff-selected="getSelectedStaff"
                                                class="margin-tp"
                                                :class="{ 'pr-lg-0': addStaff }"
                                                @add-new-staff="addNewStaff"
                                            />
                                        </b-col>

                                        <b-col md="6" cols="12" class="pl-lg-0" v-if="addStaff">
                                            <BaseInputFieldWithBorderAndFloatingLabel
                                                required="true"
                                                floatingLabelText="Full Name"
                                                className="add-staff-payment__row--input w-100"
                                                inputContainerClass="add-staff-fullname-input"
                                                floatingLabelClass="add-staff-fullname-input__label"
                                                v-model="paymentAndCommission.fullname"
                                                :errors="paymentAndCommisionError.fullname"
                                                @input="validatesStaffFullName(paymentAndCommission.fullname)"
                                            />
                                        </b-col>
                                        <b-col md="6" cols="12" class="pr-lg-0" v-if="addStaff">
                                            <BaseInputFieldWithBorderAndFloatingLabel
                                                required="true"
                                                floatingLabelText="Phone Number"
                                                className="add-staff-payment__row--input w-100"
                                                inputContainerClass="add-staff-payment-input"
                                                floatingLabelClass="add-staff-payment-input__label"
                                                v-model="paymentAndCommission.phoneNumber"
                                                :errors="paymentAndCommisionError.phoneNumber"
                                                @input="handlePaymentPhoneInput"
                                            />
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col cols="12" class="pl-lg-0 pr-lg-0">
                                            <BaseRadioGroupWithBorderAndFloatingLabel
                                                floatingLabelText="Payment Type"
                                                :radioButtonOptions="radioButtonOptions"
                                                :checkedValue="paymentAndCommission.paymentType"
                                                @change="setPaymentType"
                                                :errors="paymentAndCommisionError.paymentType"
                                            />
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col md="6" cols="12" class="pl-lg-0">
                                            <BaseInputFieldWithBorderAndFloatingLabel
                                                :floatingLabelText="
                                                    wrapFloatingLabelTextWithCurrencySymbol('Amount', currency)
                                                "
                                                @input="handlePaymentAmountInput"
                                                className="salaries-commissions__split-input"
                                                :value="
                                                    convertFigureToCurrency(paymentAndCommission.paymentAmount.amount)
                                                "
                                                :errors="paymentAndCommisionError.paymentAmount"
                                            />
                                        </b-col>
                                        <b-col md="6" cols="12" class="pr-lg-0">
                                            <BaseSelectWithBorderAndFloatingLabel
                                                defaultOptionText="-- Select Payment Period --"
                                                floatingLabelText="Month & Year"
                                                selectContainerClass="salaries-commissions"
                                                floatingLabelClass="salaries-commissions__label"
                                                className="salaries-commissions__row--select"
                                                @change="setPaymentPaymentPeriod"
                                                :options="monthsTillCurrentMonth"
                                                v-model="paymentAndCommission.paymentPeriod"
                                                :errors="paymentAndCommisionError.paymentPeriod"
                                            />
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col md="6" cols="12" class="pl-lg-0">
                                            <BaseInputFieldWithBorderAndFloatingLabel
                                                :floatingLabelText="
                                                    wrapFloatingLabelTextWithCurrencySymbol('Deductions', currency)
                                                "
                                                @input="handleDeductionInput"
                                                className="salaries-commissions__split-input"
                                                :value="convertFigureToCurrency(paymentAndCommission.deduction.amount)"
                                                :errors="paymentAndCommisionError.deduction"
                                            />
                                        </b-col>
                                        <b-col md="6" cols="12" class="pr-lg-0">
                                            <BaseRadioGroupWithBorderAndFloatingLabel
                                                :floatingLabelText="taxLabel"
                                                :radioButtonOptions="taxPaymentOptions"
                                                :checkedValue="paymentAndCommission.payTax"
                                                @change="setTaxPaymentOption"
                                                :errors="paymentAndCommisionError.payTax"
                                            />
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col md="6" cols="12" class="pl-lg-0">
                                            <BaseInputFieldWithBorderAndFloatingLabel
                                                :floatingLabelText="
                                                    wrapFloatingLabelTextWithCurrencySymbol('Net Pay', currency)
                                                "
                                                className="salaries-commissions__split-input"
                                                disabled="true"
                                                :value="convertFigureToCurrency(paymentAndCommission.netPay.amount)"
                                            />
                                        </b-col>
                                        <b-col md="6" cols="12" class="pr-lg-0">
                                            <BaseSelectWithBorderAndFloatingLabel
                                                floatingLabelText="Paid From"
                                                className="quick-expense-index__split-input"
                                                defaultOptionText="-- Select Payment Account --"
                                                selectContainerClass="salaries-commissions"
                                                floatingLabelClass="salaries-commissions__label"
                                                keyProperty="paymentAccountKey"
                                                valueProperty="paymentAccountKey"
                                                textProperty="displayNameWithBalance"
                                                :errors="paymentAndCommisionError.paymentAccount"
                                                :options="updatedPaymentAccounts"
                                                v-model="paymentAndCommission.paymentAccountKey"
                                            />
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col cols="12" class="pl-lg-0 pr-lg-0">
                                            <BaseTextAreaWithBorderAndFloatingLabel
                                                floatingLabelText="Notes"
                                                v-model="paymentAndCommission.note"
                                            />
                                        </b-col>
                                    </b-row>

                                    <b-row class="salaries-commissions__footer">
                                        <b-col cols="12">
                                            <b-row class="salaries-commissions__button-container">
                                                <p class="salaries-commissions__button-info-section" v-if="showTaxInfo">
                                                    Additonal tax amount of <b>{{ formattedTaxAmount }}</b> will be
                                                    incurred!
                                                </p>
                                            </b-row>
                                        </b-col>

                                        <BaseButton
                                            buttonText="Submit"
                                            className="salaries-commissions__save-btn"
                                            :overRideButtonClass="true"
                                            @button-clicked="submitPayAndCommission"
                                            :disabled="buttonShouldBeDisabled"
                                            :status="addStaffForPaymentRequestStatus"
                                        />
                                    </b-row>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <SuccessPage v-if="paymentMadeSuccessfully">
            <BaseButton
                buttonText="Expense History"
                :overRideButtonClass="true"
                @button-clicked="goToExpenseDashboard"
                className="success-page__btn success-page__btn--receipt success-page__btn--white"
            />
            <BasePrimaryButton
                buttonText="New Payment"
                @button-clicked="showStaffSelectionPage"
                className="success-page__btn success-page__btn--blue"
            />
        </SuccessPage>
    </div>
</template>

<script lang="ts">
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import UtilityMixins from '@/mixins/Utility';
import { PaymentAccount, RadioButtonOption } from '@/types';
import {
    defaultPayAndCommissionRequest,
    ExistingStaffPaymentAndCommission,
    PayAndCommissionRequest,
    PaymentAndCommissionRequest,
    PaymentTypes,
    SalariesAndCommissionRequestStatus,
    SalaryAndCommissionRequest,
    Staff,
    TaxTypes,
} from './types';
import StaffListAndSearch from '@/pages/Spending/SalariesAndCommissions/StaffListAndSearch.vue';
import CurrencyMixins from '@/mixins/currency';
import SalariesAndCommissionsMixin from '@/pages/Spending/SalariesAndCommissions/SalariesAndCommissionsMixin';
import { namespace } from 'vuex-class';
const expenses = namespace('expense');
import SalariesAndCommissionsModule from '@/store/modules/salariesAndCommissions';
import ExpenseModule from '@/store/modules/expense';
import { getModule } from 'vuex-module-decorators';
import { Status } from '@/types';
import { ErrorResponse } from '@/utils/errorCode';

let expenseModule: ExpenseModule;
const salariesAndCommissions = namespace('salariesAndCommissions');

let salariesAndCommissionsModule: SalariesAndCommissionsModule;
@Component({
    components: {
        StaffListAndSearch,
    },
})
export default class PaySalariesAndCommissionsNew extends Mixins(
    SalariesAndCommissionsMixin,
    DynamicComponentMixin,
    UtilityMixins,
    CurrencyMixins,
) {
    private addStaff = false;
    private paymentAndCommission: PayAndCommissionRequest = { ...defaultPayAndCommissionRequest };
    private salaryAndCommissionRequest: SalaryAndCommissionRequest = {
        staffPayments: [],
        newStaffList: [],
    };
    private currency = 566;
    private headerTitle = 'Pay Salary or Commission';
    private showHeaderSection = true;
    private paymentMadeSuccessfully = false;

    private taxPaymentOptions: RadioButtonOption = {
        name: 'payTax',
        values: ['Yes', 'No'],
    };
    isBackDatedPayment = false;
    private paymentDrafts: Array<PayAndCommissionRequest> = [];
    private taxLabel!: string;

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }
    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private radioButtonOptions: RadioButtonOption = {
        name: 'paymentType',
        values: [PaymentTypes.SALARY, PaymentTypes.COMMISSION],
    };

    private setPaymentType(paymentType: PaymentTypes) {
        this.validateInput(paymentType, 'paymentType');
        this.paymentAndCommission.paymentType = paymentType;
    }

    private setTaxPaymentOption(payTax: string) {
        this.paymentAndCommission.payTax = payTax;
    }
    private submitPayAndCommission() {
        const { validatePayAndCommission, paymentAndCommission } = this;
        validatePayAndCommission(paymentAndCommission);
        if (this.paymentAndCommissionFormHasError) return;
        const staffDetails: PayAndCommissionRequest = this.paymentAndCommission;
        const { fullname, ...otherStaffDetails } = staffDetails;
        const name = fullname.split(' ');
        const firstName = name[0];
        const lastName = name[1];
        const finalStaffDetails = {
            ...otherStaffDetails,
            firstName,
            lastName,
            fullname,
        };
        this.paymentDrafts.push(finalStaffDetails);

        this.handlePaymentSubmission(this.preparePaymentDraftsForSubmission());
    }

    private createStaffListRequest(staffPayment: PayAndCommissionRequest): PayAndCommissionRequest {
        const {
            paymentType,
            paymentAmount,
            deduction,
            note,
            paymentPeriod,
            payTax,
            phoneNumber,
            fullname,
            paymentAccountKey,
            transactionDate,
            netPay,
            firstName,
            lastName,
        } = staffPayment;
        return {
            paymentType,
            paymentAmount,
            note,
            phoneNumber,
            transactionDate,
            fullname,
            firstName,
            lastName,
            netPay,
            paymentPeriod,
            deduction,
            paymentAccountKey,
            payTax,
            staffPaymentKey: '',
        };
    }

    private createStaffPaymentRequest(staffPayment: PayAndCommissionRequest): ExistingStaffPaymentAndCommission {
        const {
            paymentType,
            staffPaymentKey,
            paymentAmount,
            deduction,
            note,
            netPay,
            paymentPeriod,
            paymentAccountKey,
            payTax,
            transactionDate,
        } = staffPayment;
        return {
            staffPaymentKey: staffPaymentKey ? staffPaymentKey : '',
            staffPaymentType: paymentType === PaymentTypes.SALARY ? PaymentTypes.SALARY : PaymentTypes.COMMISSION,
            paymentAmount,
            deduction,
            note,
            paymentPeriod,
            paymentAccountKey,
            payTax,
            transactionDate,
            netPay,
        };
    }

    private showStaffSelectionPage() {
        this.paymentMadeSuccessfully = false;
        this.paymentDrafts = [];
        this.paymentAndCommission = {
            ...defaultPayAndCommissionRequest,
            paymentAccountKey: this.updatedPaymentAccounts[0].paymentAccountKey,
            paymentPeriod: this.currentMonthWithYear,
            paymentAmount: { amount: 0, currencyKey: this.currency },
            netPay: { amount: 0, currencyKey: this.currency },
            deduction: { amount: 0, currencyKey: this.currency },
            transactionDate: this.todayAsDefaultDate(),
        };
    }

    private async handlePaymentSubmission(preparedPayment: PaymentAndCommissionRequest) {
        // we need to convert the payment drafts we have prepared to the format that the endpoint is expecting for payments creation
        const requestPayload = preparedPayment ? preparedPayment : this.preparePaymentDraftsForSubmission();

        await salariesAndCommissionsModule.paySalariesAndCommission(requestPayload);

        if (this.salariesAndCommissionRequestStatus.paySalaryCommission === Status.SUCCESS) {
            // clear out all the data we stored already
            this.paymentMadeSuccessfully = true;
            this.salaryAndCommissionRequest = {
                staffPayments: [],
                newStaffList: [],
            };
            this.paymentDrafts = [];
            return;
        }
        const error = ErrorResponse[Number(this.errorCode)];
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            message: error || 'Request failed, please try again',
        });
    }

    private preparePaymentDraftsForSubmission() {
        const staffPayments = this.paymentDrafts
            .filter((staffPayment: PayAndCommissionRequest) => staffPayment.staffPaymentKey.length > 0)
            .map(this.createStaffPaymentRequest);

        const newStaffList = this.paymentDrafts
            .filter((staffPayment: PayAndCommissionRequest) => staffPayment.staffPaymentKey.length === 0)
            .map(this.createStaffListRequest);

        return { staffPayments, newStaffList };
    }
    private setPaymentPaymentPeriod(selectedPaymentPeriod: string) {
        this.validateInput(selectedPaymentPeriod, 'paymentPeriod');
        this.$set(this.paymentAndCommission, 'paymentPeriod', selectedPaymentPeriod);
    }

    get addStaffForPaymentRequestStatus(): string {
        const request = this.salariesAndCommissionRequestStatus;
        return this.isBackDatedPayment ? request.paySalaryCommission : request.addStaffForPayment;
    }

    private setTodayAsDefaultDate() {
        this.paymentAndCommission.transactionDate = this.todayAsDefaultDate();
    }

    get disableTransactionDate() {
        return true;
    }

    addNewStaff(event: string) {
        if (event) {
            this.addStaff = true;
            this.paymentAndCommission = {
                ...defaultPayAndCommissionRequest,
                paymentAccountKey: this.updatedPaymentAccounts[0].paymentAccountKey,
                // paymentPeriod: this.currentMonthWithYear,
                paymentAmount: { amount: 0, currencyKey: this.currency },
                netPay: { amount: 0, currencyKey: this.currency },
                deduction: { amount: 0, currencyKey: this.currency },
                transactionDate: this.todayAsDefaultDate(),
            };
        }
    }

    get buttonShouldBeDisabled(): boolean {
        return this.paymentAndCommissionFormHasError;
    }

    private getSelectedStaff(staff: Staff) {
        this.addStaff = false;
        this.paymentAndCommission = {
            paymentAmount: staff.lastAmountPaid,
            phoneNumber: staff.phoneNumber,
            paymentType: PaymentTypes.SALARY,
            paymentAccountKey: this.updatedPaymentAccounts[0].paymentAccountKey,
            fullname: staff.staffName,
            note: '',
            payTax: String(this.taxPaymentOptions.values[1]),
            deduction: {
                amount: 0,
                currencyKey: staff.lastAmountPaid.currencyKey,
            },
            staffPaymentKey: staff.staffPaymentKey,
            transactionDate: staff.lastDatePaid,
            paymentPeriod: this.currentMonthWithYear,
            netPay: {
                amount: 0,
                currencyKey: staff.lastAmountPaid.currencyKey,
            },
        };

        const { validatePayAndCommission, paymentAndCommission } = this;
        validatePayAndCommission(paymentAndCommission);
    }

    private async calculateTaxAmountToBePaid(paymentType: string): Promise<void> {
        const taxType = paymentType === PaymentTypes.SALARY ? TaxTypes.PAYE : TaxTypes.WITHOLDING;

        await salariesAndCommissionsModule.calculateTaxAmountForPayment({
            paymentAmount: this.paymentAndCommission.paymentAmount.amount,
            taxType,
        });
    }

    private handleDeductionInput(deductionInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(deductionInput.toString());

        if (isNaN(inputToNumber)) {
            this.paymentAndCommisionError.deduction = 'Please a valid Number';
        } else {
            const { paymentAmount } = this.paymentAndCommission;

            this.paymentAndCommission.deduction.amount = inputToNumber;
            this.validateStaffDeduction(inputToNumber, paymentAmount.amount);
        }
    }

    private handlePaymentPhoneInput(phoneNumber: string) {
        this.validateStaffPhoneNumber(phoneNumber);
    }

    private handlePaymentAmountInput(paymentAmountInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(paymentAmountInput);

        if (isNaN(inputToNumber)) {
            this.paymentAndCommisionError.deduction = 'Please a valid Number';
        } else {
            this.validatePaymentAmount(inputToNumber);

            if (inputToNumber === 0) {
                // if the user changes full pay to 0, then deduction should be cleared;
                this.paymentAndCommission.deduction.amount = 0;
                this.setSalaryCommissionError('paymentAmount', 'Invalid');
                return;
            }

            // if the user selected that tax should be calculated and the value of the fullpay is not 0, then let's calculate it
            const { deduction } = this.paymentAndCommission;
            this.validateStaffDeduction(deduction.amount, inputToNumber);

            this.$nextTick(() => {
                this.paymentAndCommission.paymentAmount.amount = inputToNumber;

                this.checkAccountBalance();

                if (this.paymentAndCommission.payTax === 'Yes') {
                    const { paymentType } = this.paymentAndCommission;
                    this.calculateTaxAmountToBePaid(paymentType);
                }
            });
        }
    }

    private checkAccountBalance() {
        const {
            paymentAmount: { amount },
            paymentAccountKey,
        } = this.paymentAndCommission;

        // get the account balance of the payment account key...
        const account = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );
    }

    get taxAmountToBeShown(): number {
        const { paymentAmount, payTax } = this.paymentAndCommission;
        if (Number(paymentAmount.amount) === 0 || payTax === 'No') {
            return 0;
        }

        return this.taxAmount;
    }

    get showTaxInfo(): boolean {
        return this.taxAmountToBeShown > 0 && !this.showError;
    }

    get showError(): boolean {
        if (!this.error) return false;

        return true;
    }

    get formattedTaxAmount(): string {
        return this.$options.filters.amountWithCurrency({
            amount: this.taxAmountToBeShown,
            currencyKey: this.defaultCurrency.currencyKey,
        });
    }

    @Watch('paymentAndCommission.paymentAmount.amount', { deep: true, immediate: true })
    calculateNet(paymentAmount: number) {
        this.paymentAndCommission.netPay.amount = paymentAmount - this.paymentAndCommission.deduction.amount;
    }

    @Watch('paymentAndCommission.paymentType', { deep: true, immediate: true })
    getTaxLabel(paymentType: string) {
        paymentType === 'salary'
            ? (this.taxLabel = 'Pay Staff Income Tax (PAYE)')
            : (this.taxLabel = 'Pay Withholding Tax (WHT)');
    }

    @Watch('paymentAndCommission.deduction.amount', { deep: true, immediate: true })
    calculateNetAmount(deduction: number) {
        this.paymentAndCommission.netPay.amount = this.paymentAndCommission.paymentAmount.amount - deduction;
    }

    @Watch('paymentAndCommission.transactionDate')
    checkSelectedDate(selectedDate: string) {
        this.isBackDatedPayment = this.isDateBeforeToday(selectedDate);
    }

    @Watch('paymentAndCommission.payTax')
    @Watch('paymentAndCommission.paymentType')
    calculateTaxIfUserSpecifies() {
        const { payTax, paymentType, paymentAmount } = this.paymentAndCommission;
        this.$nextTick(() => {
            // if the value of the paymentAmount is 0, then there is no need to calculate tax
            if (paymentAmount.amount === 0 || payTax === 'No') return;

            this.calculateTaxAmountToBePaid(paymentType);
        });
    }

    @salariesAndCommissions.State
    private taxAmount!: number;

    @salariesAndCommissions.State
    private errorCode!: string;

    @expenses.State
    private paymentAccounts!: PaymentAccount[];

    @salariesAndCommissions.State
    private salariesAndCommissionRequestStatus!: SalariesAndCommissionRequestStatus;

    @salariesAndCommissions.State
    private staffListForPayment!: Array<Staff>;

    @salariesAndCommissions.State
    private error!: string;

    get paymentAndCommissionRequestIsLoading(): boolean {
        return this.salariesAndCommissionRequestStatus.getStaffListForPayment === Status.LOADING;
    }

    async mounted() {
        salariesAndCommissionsModule = getModule(SalariesAndCommissionsModule, this.$store);
        await salariesAndCommissionsModule.getStaffListForPayment();

        salariesAndCommissionsModule = getModule(SalariesAndCommissionsModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);

        await expenseModule.getPaymentAccounts();

        this.setTodayAsDefaultDate();
        this.paymentAndCommission.paymentAccountKey = this.updatedPaymentAccounts[0].paymentAccountKey;
        this.paymentAndCommission.paymentType = PaymentTypes.SALARY;
        this.paymentAndCommission.payTax = String(this.taxPaymentOptions.values[1]);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/salaries-commissions/pay-salaries-comissions-new';
</style>

@import '../scss/_var'; @import '../scss/mixin/_media'; .container { @include media('>=tablet', '<=992px') { padding: 0
3rem; } @include media('>=phone', '<tablet') { padding: 0 1rem; } // @include media('>=phone', '<=tablet') { // padding:
0 4rem; // } // @include media('<=phone') { // padding: 0 1rem; // } // @include media('>=phone', '>=tablet') { //
padding: 0 3rem; // } // @include media('>tablet', '<=992px') { // padding: 0 3rem; // } @include media('>=desktop',
'<=1200px') { padding: 0 5rem; } padding: 0 8rem; } .full-width { width: 100%; } .flex { display: flex; } .h-flex {
flex: 50%; max-width: 50%; width: 100%; @include media('>=desktop', '<1200px') { flex: 0 0 33%; } @include
media('>=phone', '<=tablet') { flex: 1; max-width: 100%; } @include media('>tablet', '<=850px') { flex: 1; max-width:
70%; } } .align-center { align-items: center; } .justify-center { justify-content: center; } .justify-between {
justify-content: space-between; } .justify-end { justify-content: flex-end; } .justify-self-end { justify-self:
flex-end; } .relative { position: relative; } .ml-5 { margin-left: 3rem; } .mt-3 { margin-top: 3rem !important; } .mt-4
{ margin-top: 4rem !important; } .mt-5 { margin-top: 5rem !important; } .pr-5 { padding-right: 5rem; @include
media('>=phone', '<=tablet') { padding-right: 0; } } .pl-5 { padding-left: 5rem; @include media('>=phone', '<=tablet') {
padding-left: 0; } } .mb-5 { margin-bottom: 5rem; } .sr-only { display: none; } .topnav { width: 100%; height: 100%;
&__primary { padding: 1rem 0; } &__logo { height: 45px; @include media('>=phone', '<=tablet') { height: 35px; } & img {
height: 100%; } } &__menu { list-style: none; @include media('>=phone', '<desktop') { display: none; } &
li:not(:last-child) { margin-right: 1.8rem; } & li { position: relative; & a { font-weight: 600; } } &__mobile {
display: flex; flex-flow: column; list-style-type: none; width: 100%; align-items: flex-start; padding-top: 10%; & li {
list-style-type: none; padding-bottom: 1rem; &:last-child { margin-top: 1rem; } } } } &__btn { background: $blue; color:
$white; border-radius: 5px; padding: 0.7rem 3rem; font-size: 16px; } &__mobile { cursor: pointer; @include
media('>992px') { display: none; } } } .header { background: $dark-white; box-shadow: 0px 4px 4px rgba(50, 50, 71,
0.08), 0px 4px 8px rgba(50, 50, 71, 0.06); position: fixed; z-index: 99; width: 100%; transition: -webkit-transform
0.25s ease-in-out; transition: transform 0.25s ease-in-out; transition: transform 0.25s ease-in-out, -webkit-transform
0.25s ease-in-out; &__unpin { transform: translate3d(0, -150px, 0); will-change: transform; @include media('>=phone',
'<=992px') { transform: translate3d(0, 0, 0); } } &__banner { height: 56px; } } .btn { position: relative; outline:
none; border-radius: 5px; cursor: pointer; &-primary { background: $white; padding: 0.9rem 4.4rem; font-size: 15px;
color: $blue; font-weight: 700; @include media('>=phone', '<=992px') { padding: 0.9rem 2.4rem; } } &-sec { background:
transparent; padding: 0.9rem 2.4rem; font-size: 15px; color: $white; font-weight: 700; border: 2px solid $white; }
&__sub { background: $blue; height: 52px; transform: translate(-10px, -1px); border: 0; border-radius: 0px 5px 5px 0px;
padding: 0 3rem; color: $white; @include media('>=tablet') { border-radius: 0px 5px 5px 0px; } @include media('>=phone',
'<tablet') { border-radius: 5px; } } &__standard { background: $blue; padding: 0.9rem 2.4rem; font-size: 15px;
font-weight: 700; color: $white; outline: 0; border: 0; } &_white { color: $blue; background: $white; } } .col-3 { flex:
0 0 30%; max-width: 30%; width: 100%; padding: 0.3rem; @include media('>=tablet', '<=900px') { flex: 0 0 45%; max-width:
45%; } @include media('>=phone', '<=tablet') { flex: 1; max-width: 100%; padding: 0.3rem 0; } } .col-4 { flex: 0 0 25%;
max-width: 25%; width: 100%; padding: 0.3rem 0; @include media('>=phone', '<=900px') { flex: 1; max-width: 100%; } }
.input { background: $white; border: 1px solid rgba(135, 135, 135, 0.5); border-radius: 5px; } .form__input { height:
50px; padding: 0 1rem; border-radius: 5px 0px 0px 5px; @include media('>=tablet') { border-radius: 5px 0px 0px 5px; }
@include media('>=phone', '<tablet') { border-radius: 5px; } } .text { &__white { color: $white; } &__center {
text-align: center; } } .background__white { background: $white; } .w-75 { width: 75%; @include media('>=phone',
'<=tablet') { width: 100%; } } .w-60 { width: 60%; @include media('>=phone', '<=tablet') { width: 100%; } }
.playstoreIcon { height: 38px; margin-right: 1.2rem; @include media('>=phone', '<=tablet') { height: 50px; } } .subBtn {
transform: translate(-10px, 0); @include media('>=phone', '<=tablet') { margin-top: 1rem; transform: translate(0, 0); }
} .text-center { text-align: center; } .close { color: #fafafa; float: right; font-size: 28px; font-weight: bold;
cursor: pointer; transition: all 0.3s ease; &:hover { color: $black; } } #mobile-icon { width: 3.75rem; height: 2.81rem;
position: absolute; z-index: 999; top: 0.3rem; right: 0; -mos-transform: rotate(0deg); transform: rotate(0deg)
scale(0.4); transition: 0.5s ease-in-out; cursor: pointer; padding: 1rem; & span { display: inline-flex; position:
absolute; height: 9px; width: 80%; background: $dark-gray; border-radius: 5px; opacity: 1; left: 0; transform:
rotate(0deg); transition: 0.25s ease-in-out; &:first-child { top: 0; transform-origin: left center; } &:nth-child(2) {
top: 1.125rem; transform-origin: left center; } &:nth-child(3) { top: 2.3rem; transform-origin: left center; } } }
#mobile-icon { &.open { position: fixed; & span { &:first-child { transform: rotate(45deg); top: -15px; left: 0; //
background: $white; } &:nth-child(2) { width: 0; opacity: 0; // background: $white; } &:nth-child(3) { transform:
rotate(-45deg); // background: $white; } } } } .bg-gray { background: $dark-white !important; } .bg-white { background:
$white !important; } .pd1-3 { padding: 1rem 3rem !important; @include media('<=800px') { padding: 0.7rem 2rem
!important; } }
