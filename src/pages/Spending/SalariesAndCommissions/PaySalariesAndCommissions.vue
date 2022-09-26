<template>
    <b-container fluid class="salaries-commissions">
        <b-row no-gutters>
            <DashboardBreadCrumb
                section="Expenses"
                title="Pay Salaries and Commissions"
                subTitle=""
                sectionIsClickable="true"
                @section-clicked="goToExpenseDashboard"
            />
        </b-row>

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

        <b-row class="salaries-commissions-content" no-gutters v-else>
            <b-col
                xl="4"
                class="salaries-commissions-content__left"
                :class="{ 'salaries-commissions-content__left--with-shadow': showHeaderSection }"
                v-if="!hideLeftSection"
            >
                <div class="salaries-commissions-content__header" v-if="showHeaderSection && !userIsOnMobile">
                    <p class="m-0">{{ headerTitle }}</p>
                    <font-awesome-icon icon="times" class="mb-0 pointer d-none" @click="handleRightSectionWidth" />
                </div>

                <div class="salaries-commissions-content__body">
                    <transition name="slide-right-fade" mode="out-in">
                        <keep-alive include="['SelectStaff']">
                            <component
                                :is="componentList[activeComponentIndex]"
                                :paymentDrafts="paymentDrafts"
                                :userIsOnDesktop="userIsOnDesktop"
                                :selectedStaff="selectedStaff"
                                :staffPaymentForEdit="staffPaymentForEdit"
                                :staffPaymentRecordState="staffPaymentRecordState"
                                :key="activeComponentIndex"
                                :nameOfStaffToCreate="nameOfStaffToCreate"
                                :addPaymentsRequestStatus="addPaymentsRequestStatus"
                                :indexOfPaymentBeingEdited="indexOfPaymentToEdit"
                                :errorMessage="error"
                                :errorCode="errorCode"
                                @show-empty-staff-payment-form="showEmptyStaffPaymentForm"
                                @show-filled-staff-payment-form="showFilledStaffPaymentForm"
                                @hide-add-staff-payment-form="showStaffSelectionPage"
                                @add-staff-with-payment-to-draft="addStaffWithPaymentToDraft"
                                @make-another-payment="showStaffSelectionPage"
                                @update-edited-payment="updatePaymentDraft"
                                @prefill-add-payment-form-for-edit="showFilledStaffPaymentFormForEdit"
                                @delete-payment-from-draft="deletePaymentDraft"
                                @submit-payment="handlePaymentSubmission"
                                @make-backdated-payment="handleBackDatedPayement"
                            />
                        </keep-alive>
                    </transition>
                </div>
            </b-col>

            <b-col class="p-0 salaries-commissions-content__right" v-if="userIsOnDesktop">
                <b-row
                    class="salaries-commissions-content__header w-100 salaries-commissions-content__header--br-4 salaries-commissions-content__header--right"
                >
                    <b-col cols="1" class="pr-0">#</b-col>
                    <b-col cols="2" class="pl-0">Full Name</b-col>
                    <b-col>Month</b-col>
                    <b-col>Type</b-col>

                    <!-- these should only when the full details are being shown -->
                    <template v-if="hideLeftSection">
                        <b-col>Full Pay</b-col>
                        <b-col>Deductions</b-col>
                        <b-col>Net Pay</b-col>
                        <b-col>Notes</b-col>
                    </template>
                    <b-col v-else>Amount</b-col>

                    <b-col></b-col>
                </b-row>

                <MakePayment
                    :paymentDrafts="paymentDrafts"
                    :userIsOnDesktop="userIsOnDesktop"
                    :addPaymentsRequestStatus="addPaymentsRequestStatus"
                    :showDraftSummary="showDraftSummary"
                    @make-salaries-and-commissions-full-screen="handleRightSectionWidth"
                    @make-salaries-and-commissions-split-screen="splitScreen"
                    @make-another-payment="showStaffSelectionPageAndResizeSummarySecion"
                    @prefill-add-payment-form-for-edit="showFilledStaffPaymentFormForEdit"
                    @delete-payment-from-draft="deletePaymentDraft"
                    @submit-payment="handlePaymentSubmission"
                />
            </b-col>
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
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import SalariesAndCommissionModule from '@/store/modules/salariesAndCommissions';
import GeneralModule from '@/store/modules/general';

const salariesAndCommissions = namespace('salariesAndCommissions');
const general = namespace('general');
let salariesAndCommissionModule: SalariesAndCommissionModule;
let generalModule: GeneralModule;

import ExpenseRow from '@/pages/Spending/Expense/ExpenseRow.vue';
import SuccessPageModal from '@/components/ui/SuccessPageModal.vue';
import SelectStaff from '@/pages/Spending/SalariesAndCommissions/SelectStaff.vue';
import AddStaff from '@/pages/Spending/SalariesAndCommissions/AddStaff.vue';
import MakePayment from '@/pages/Spending/SalariesAndCommissions/MakePayment.vue';
import PaymentDraft from '@/pages/Spending/SalariesAndCommissions/PaymentDraft.vue';

import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import CurrencyMixins from '@/mixins/currency';

import {
    SalariesAndCommissionsHeader,
    Staff,
    StaffPaymentRequest,
    PaymentTypes,
    SalaryAndCommissionRequest,
    SalariesAndCommissionRequestStatus,
    StaffPaymentRecordState,
    defaultStaffPaymentState,
    ExistingStaffPayment,
} from '@/pages/Spending/SalariesAndCommissions/types';
import { LeftIcon, MoneyObject, Status } from '@/types';
import { ErrorResponse } from '@/utils/errorCode';

@Component({
    components: {
        ExpenseRow,
        SuccessPageModal,
        SelectStaff,
        AddStaff,
        MakePayment,
        PaymentDraft,
    },
})
export default class PaySalariesAndCommissions extends Mixins(DynamicComponentMixin, UtilityMixins, CurrencyMixins) {
    private hideLeftSection = false;
    private componentList: Array<object> = [SelectStaff, AddStaff, MakePayment];
    private paymentDrafts: Array<StaffPaymentRequest> = [];
    private headerTitle = 'Select Staff';
    private showHeaderSection = true;
    private selectedStaff: Staff = {
        staffName: '',
        lastAmountPaid: { currencyKey: 0, amount: 0 },
        lastDatePaid: '',
        staffPaymentKey: '',
        phoneNumber: '',
    };
    private staffPaymentRecordState = StaffPaymentRecordState.createStaffWithPayment;
    private nameOfStaffToCreate = '';
    private salaryAndCommissionRequest: SalaryAndCommissionRequest = {
        staffPayments: [],
        newStaffList: [],
    };
    private staffPaymentForEdit: StaffPaymentRequest = { ...defaultStaffPaymentState };
    private indexOfPaymentToEdit = 0;
    private showDraftSummary = false;
    private paymentMadeSuccessfully = false;
    private leftIcon = LeftIcon.None;

    public toaster = {
        title: 'Salaries and Commissions',
        message: '',
        type: '',
        position: 'b-toaster-top-right',
        id: 'pay-salaries-toaster',
    };

    @salariesAndCommissions.State
    private salariesAndCommissionRequestStatus!: SalariesAndCommissionRequestStatus;

    @salariesAndCommissions.State
    private error!: string;

    @salariesAndCommissions.State
    private errorCode!: string;

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCartButtonClicked!: boolean;

    get numberOfPaymentDrafts(): number {
        return this.paymentDrafts.length;
    }

    get totalAmountToBePaid(): MoneyObject {
        return {
            amount: this.paymentDrafts.reduce(
                (previousValue: number, currentDraft: StaffPaymentRequest) =>
                    previousValue + this.getNetPay(currentDraft),
                0,
            ),
            currencyKey: this.paymentDrafts[0]
                ? this.paymentDrafts[0].paymentAmount.currencyKey
                : this.defaultCurrency.currencyKey,
        };
    }

    get userOnMobileHasAddedPaymentDrafts(): boolean {
        return !this.userIsOnDesktop && this.numberOfPaymentDrafts > 0;
    }

    get addPaymentsRequestStatus(): string {
        return this.salariesAndCommissionRequestStatus.paySalaryCommission;
    }

    @Watch('currentWindowWidth')
    handleUserScreenChange() {
        // if the user is on the payment summary page
        if (this.headerTitle === SalariesAndCommissionsHeader.payAnotherStaff || this.activeComponentIndex === 2) {
            // switch to mobile screen
            if (!this.userIsOnDesktop) {
                this.showHeaderSection = false;
                this.setActiveComponentIndex(2);
                this.hideLeftSection = false;
                return;
            }
            // switch to desktop screen
            this.showHeaderSection = true;
            this.headerTitle = SalariesAndCommissionsHeader.payAnotherStaff;
            this.setActiveComponentIndex(0);
            return;
        }

        // if user is on the select staff page
        if (this.headerTitle === SalariesAndCommissionsHeader.selectStaff) {
            // on mobile and desktop, the screen to show is the same
            this.setActiveComponentIndex(0);
            return;
        }
    }

    @Watch('activeComponentIndex')
    activeComponentChanged() {
        switch (this.activeComponentIndex) {
            case 0:
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(true);
                break;

            case 1:
                this.leftIcon = LeftIcon.Back;
                this.setCartVisibility(false);
                this.setCartCount();

                break;

            case 2:
                this.leftIcon = LeftIcon.Hamburger;
                this.headerTitle = SalariesAndCommissionsHeader.paymentSummary;
                this.setCartVisibility(true);
                this.setCartCount();

                break;
            default:
                break;
        }
    }

    @Watch('headerTitle')
    pageTitleChanged() {
        this.$parent.$emit('update-page-title', this.headerTitle);
    }

    @Watch('leftIcon')
    leftIconChanged() {
        this.$parent.$emit('set-left-icon', this.leftIcon);
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileBackButtonState(false);
    }

    @Watch('mobileCartButtonClicked')
    watchMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked && this.numberOfPaymentDrafts > 0) {
            this.setActiveComponentIndex(2);
        }
        generalModule.setMobileCartButtonState(false);
    }

    private setCartVisibility(shouldShow: boolean) {
        this.$parent.$emit('set-show-cart', shouldShow);
    }

    private setCartCount() {
        this.$parent.$emit('set-cart-count', this.numberOfPaymentDrafts);
    }

    private handleGoBack() {
        switch (this.activeComponentIndex) {
            case 1:
                this.showStaffSelectionPage();
                break;
            default:
                break;
        }
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private getNetPay({ paymentAmount, deduction }: StaffPaymentRequest): number {
        return Number(paymentAmount.amount) - Number(deduction.amount);
    }

    private showEmptyStaffPaymentForm(nameOfStaffToCreate: string) {
        this.headerTitle = SalariesAndCommissionsHeader.addNewStaff;
        this.showHeaderSection = true;
        this.staffPaymentRecordState = StaffPaymentRecordState.createStaffWithPayment;
        this.nameOfStaffToCreate = nameOfStaffToCreate;
        this.handleNextSection();
    }

    private showFilledStaffPaymentForm(selectedStaff: Staff) {
        this.headerTitle = SalariesAndCommissionsHeader.addPaymentForSelectedStaff;
        this.showHeaderSection = true;
        this.staffPaymentRecordState = StaffPaymentRecordState.addPaymentForExistingStaff;
        this.selectedStaff = selectedStaff;
        this.handleNextSection();
    }

    private showStaffSelectionPage() {
        this.paymentMadeSuccessfully = false;
        this.selectedStaff = {
            staffName: '',
            staffPaymentKey: '',
            lastAmountPaid: { amount: 0, currencyKey: 0 },
            lastDatePaid: '',
            phoneNumber: '',
        };

        this.headerTitle = SalariesAndCommissionsHeader.selectStaff;
        this.showHeaderSection = true;
        this.setActiveComponentIndex(0);
    }

    private addStaffWithPaymentToDraft(newPaymentDraft: StaffPaymentRequest) {
        this.paymentDrafts.push(newPaymentDraft);

        if (!this.userIsOnDesktop) {
            this.showHeaderSection = false;
            this.handleNextSection();
            return;
        }

        this.hideLeftSection = true;
        this.showDraftSummary = true;
    }

    private preparePaymentDraftsForSubmission() {
        const staffPayments = this.paymentDrafts
            .filter((staffPayment: StaffPaymentRequest) => staffPayment.staffPaymentKey.length > 0)
            .map(this.createStaffPaymentRequest);

        const newStaffList = this.paymentDrafts
            .filter((staffPayment: StaffPaymentRequest) => staffPayment.staffPaymentKey.length === 0)
            .map(this.createStaffListRequest);

        return { staffPayments, newStaffList };
    }

    private prepareBackDatedPaymentForSubmission(staffPaymentForm: StaffPaymentRequest) {
        const staffPayments: ExistingStaffPayment[] = [],
            newStaffList: StaffPaymentRequest[] = [];

        const { staffPaymentKey } = staffPaymentForm;

        if (staffPaymentKey.length > 0) {
            staffPayments.push(this.createStaffPaymentRequest(staffPaymentForm));
        }
        if (staffPaymentKey.length === 0) {
            newStaffList.push(this.createStaffListRequest(staffPaymentForm));
        }

        return { staffPayments, newStaffList };
    }

    private createStaffPaymentRequest(staffPayment: StaffPaymentRequest): ExistingStaffPayment {
        const {
            paymentType,
            staffPaymentKey,
            paymentAmount,
            deduction,
            note,
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
        };
    }

    private createStaffListRequest(staffPayment: StaffPaymentRequest): StaffPaymentRequest {
        const {
            paymentType,
            paymentAmount,
            deduction,
            note,
            paymentPeriod,
            payTax,
            lastName,
            firstName,
            phoneNumber,
            paymentAccountKey,
            transactionDate,
        } = staffPayment;
        return {
            staffPaymentKey: '',
            paymentType,
            paymentAmount,
            deduction,
            note,
            paymentPeriod,
            payTax,
            lastName,
            firstName,
            phoneNumber,
            paymentAccountKey,
            transactionDate,
        };
    }

    /*
    back-dated payments should not be added to the paymentDraft.
    they should be submitted directly.
    */
    private handleBackDatedPayement(newPaymentRequest: StaffPaymentRequest) {
        const preparedPayment = this.prepareBackDatedPaymentForSubmission(newPaymentRequest);
        this.handlePaymentSubmission(preparedPayment);
    }

    private async handlePaymentSubmission(preparedPayment: SalaryAndCommissionRequest) {
        // we need to convert the payment drafts we have prepared to the format that the endpoint is expecting for payments creation
        const requestPayload = preparedPayment ? preparedPayment : this.preparePaymentDraftsForSubmission();

        await salariesAndCommissionModule.paySalariesAndCommission(requestPayload);

        if (this.salariesAndCommissionRequestStatus.paySalaryCommission === Status.SUCCESS) {
            // clear out all the data we stored already
            this.paymentMadeSuccessfully = true;
            this.salaryAndCommissionRequest = {
                staffPayments: [],
                newStaffList: [],
            };
            this.paymentDrafts = [];
            // route to the select staff page
            // if the left section has been hidden, we need to open it for the form to show
            if (this.hideLeftSection) {
                this.hideLeftSection = false;
            }
            this.setActiveComponentIndex(0);
            return;
        }

        const error = ErrorResponse[Number(this.errorCode)];
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            message: error || 'Request failed, please try again',
        });
    }

    private handleRightSectionWidth() {
        // user should not be able to collapse this left side if the payment draft is empty
        if (this.numberOfPaymentDrafts > 0) {
            this.hideLeftSection = true;
            this.showDraftSummary = true;
        }
    }

    private splitScreen() {
        this.hideLeftSection = false;
        this.showDraftSummary = false;
    }

    private showStaffSelectionPageAndResizeSummarySecion() {
        this.hideLeftSection = false;
        this.showStaffSelectionPage();

        this.headerTitle = SalariesAndCommissionsHeader.payAnotherStaff;
    }

    private showFilledStaffPaymentFormForEdit(staffPaymentIndex: number) {
        this.headerTitle = SalariesAndCommissionsHeader.editPaymentForSelectedStaff;
        this.showHeaderSection = true;
        this.staffPaymentRecordState = StaffPaymentRecordState.editPaymentDraft;
        this.indexOfPaymentToEdit = staffPaymentIndex;

        const {
            paymentType,
            lastName,
            phoneNumber,
            payTax,
            firstName,
            paymentPeriod,
            paymentAmount,
            deduction,
            note,
            staffPaymentKey,
            paymentAccountKey,
            transactionDate,
        } = this.paymentDrafts[this.indexOfPaymentToEdit];

        // set the payment for edit object
        this.staffPaymentForEdit = {
            paymentType,
            lastName,
            phoneNumber,
            payTax,
            firstName,
            paymentPeriod,
            paymentAmount,
            deduction,
            note,
            staffPaymentKey,
            paymentAccountKey,
            transactionDate,
        };

        // if the left section has been hidden, we need to open it for the form to show
        if (this.hideLeftSection) {
            this.hideLeftSection = false;
        }
        this.setActiveComponentIndex(1);
    }

    private updatePaymentDraft(updatedStaffPayment: StaffPaymentRequest) {
        // find the item to be updated
        const { indexOfPaymentToEdit, userIsOnDesktop } = this;
        this.paymentDrafts.splice(indexOfPaymentToEdit, 1, updatedStaffPayment);

        if (!userIsOnDesktop) {
            this.showHeaderSection = false;
            this.handleNextSection();
            return;
        }

        this.headerTitle = SalariesAndCommissionsHeader.payAnotherStaff;
        this.handlePreviousSection();
        return;
    }

    private deletePaymentDraft(indexOfPaymentToDelete: number) {
        this.paymentDrafts.splice(indexOfPaymentToDelete, 1);

        const { userIsOnDesktop } = this;
        if (userIsOnDesktop) return;

        this.$nextTick(() => {
            // on mobile, if the payment drafts is now empty, we should show the page to initiate a fresh payment

            if (this.numberOfPaymentDrafts === 0) {
                this.setActiveComponentIndex(0);
            }
        });
    }

    mounted() {
        salariesAndCommissionModule = getModule(SalariesAndCommissionModule, this.$store);
        generalModule = getModule(GeneralModule, this.$store);

        this.pageTitleChanged();
        this.setCartVisibility(true);
        this.setCartCount();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/salaries-commissions/pay-salaries-commissions';
</style>
