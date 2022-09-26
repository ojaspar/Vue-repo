<template>
    <b-container fluid class="record-expense">
        <SuccessPage v-if="expenseCreatedOrModifiedSuccessfully">
            <BaseButton
                buttonText="Expense History"
                :overRideButtonClass="true"
                @button-clicked="goToExpenseDashboard"
                className="success-page__btn success-page__btn--receipt success-page__btn--white"
            />
            <BasePrimaryButton
                buttonText="New Expense"
                @button-clicked="startNewExpense"
                className="success-page__btn success-page__btn--blue"
            />
        </SuccessPage>

        <b-row class="add-expense-content p-0" v-else>
            <b-col sm="12" md="8" lg="7" xl="4" class="p-0 add-expense-content__left" v-if="splitPageIntoTwoSections">
                <TabletPlusNavigationHeader
                    :activeComponentIndex="activeComponentIndex"
                    :pageTitle="pageTitle"
                    :selectedItemsCount="selectedExpenseItemsCount"
                    :showBackButton="shouldShowBackButton"
                    :showCart="shouldShowCart"
                    @back-button-clicked="goBack"
                    @cart-is-clicked="handleCartClick"
                    v-if="!userIsOnMobile"
                />

                <ExpenseItemSummary
                    :itemName="expenseSummary.itemName"
                    :unitCost="expenseSummary.unitCost"
                    :isMeasurable="expenseSummary.isMeasurable"
                    :quantity="expenseSummary.quantity"
                    :withholdingTaxType="preliminaryExpenseForm.withHoldingTaxType"
                    :withholdingTaxPercentage="expenseSummary.withholdingTaxPercentage"
                    :amountPaid="expenseSummary.amountPaid"
                    :bankDetails="expenseSummary.bankDetails"
                    :vendorName="expenseSummary.vendorName"
                    :measurementUnit="expenseSummary.measurementUnit"
                    :balance="expenseSummary.balance"
                    :netCost="expenseSummary.netCost"
                    :expenseCurrency="expenseSummary.expenseCurrency"
                    :withholdingAmount="expenseSummary.withholdingAmount"
                    :exchangeRate="expenseSummary.exchangeRate"
                    :indexOfCurrentComponent="activeComponentIndex"
                    :quantityReceived="preliminaryExpenseForm.quantityReceived"
                    @show-vendor-selection-page="showVendorSelectionPage"
                    @show-expense-selection-page="showExpenseSelectionPage"
                    @show-add-expense-page="showAddExpenseForm"
                    @remove-selected-vendor="removeSelectedVendor"
                    v-if="showExpenseItemSummary"
                />

                <div class="add-expense-content__body" :class="cardClass">
                    <transition name="slide-up-fade" mode="out-in" appear>
                        <component
                            :is="componentsList[activeComponentIndex]"
                            :newExpenseName="newExpenseName"
                            :selectedExpenseItemType="selectedExpenseItemType"
                            :searchedVendor="searchedVendor"
                            :selectedVendor="selectedVendor"
                            :selectedExpenseItems="selectedExpenseItems"
                            :expenseSummary="expenseSummary"
                            :preliminaryExpenseForm="preliminaryExpenseForm"
                            :requestStatus="requestStatus"
                            :editingSelectedExpense="editingSelectedExpense"
                            :allExpenses="expenseRequestForm"
                            :previousExpenseIsBeingEdited="previousExpenseIsBeingEdited"
                            @expense-item-created="handleNewExpenseItem"
                            @show-add-new-expense-item-form="showAddNewExpenseItemForm"
                            @show-new-expense-form="setExpenseItemAndshowAddExpenseForm"
                            @show-vendor-selection-page="showVendorSelectionPage"
                            @set-vendor-for-expense="addSelectedVendorToForm"
                            @show-add-new-vendor-form="displayAddNewVendorForm"
                            @set-expense-summary-properties="setExpenseSummaryProperties"
                            @new-vendor-created="addSelectedVendorToForm"
                            @show-expense-details-page="showExpenseDetailsPage"
                            @show-expense-summary-page="showExpenseSummaryPage"
                            @show-expense-selection-page="showExpenseSelectionPage"
                            @show-expense-item-summary-component="handleExpenseItemSummaryState"
                            @add-expense-details-to-summary="addExpenseDetailsToSummary"
                            @save-expense-details="saveExpenseDetails"
                            @save-and-add-another-item-button-clicked="handleSaveAndAddAnotherItem"
                            @resize-page-for-desktop="resizePageForExpenseSummaryDesktop"
                            @add-complete-expense-to-expense-array="saveCreateExpenseFormState"
                            @add-complete-expense-item-to-cart="submitExpenseItem"
                            @keep-preliminary-expense-form-state="savePreliminaryExpenseFormState"
                            @edit-expense-item="handleExpenseItemEdit"
                            @delete-expense-item="handleExpenseItemDeletion"
                            @submit-expenses="handleExpenseSubmission"
                            @submit-expense-immediately="handleImmediateSubmission"
                        />
                    </transition>
                </div>
            </b-col>

            <!-- desktop view only -->
            <b-col
                class="add-expense-content__right"
                :class="[splitPageIntoTwoSections && 'add-expense-content__right--xl']"
            >
                <ExpenseItemSummaryPage
                    :selectedExpenseItems="selectedExpenseItems"
                    :isFullExpenseSummaryPage="!splitPageIntoTwoSections"
                    :requestStatus="requestStatus"
                    :previousExpenseIsBeingEdited="previousExpenseIsBeingEdited"
                    @show-expense-summary-page="showExpenseSummaryPage"
                    @show-expense-selection-page="showExpenseSelectionPage"
                    @resize-page-for-mobile="resizePageForExpenseSummaryMobile"
                    @edit-expense-item="handleExpenseItemEdit"
                    @delete-expense-item="handleExpenseItemDeletion"
                    @submit-expenses="handleExpenseSubmission"
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
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AddNewExpenseItemForm from '@/pages/Spending/Expense/AddExpenseItem.vue';
import SelectExpense from '@/pages/Spending/Expense/SelectExpense.vue';
import AddExpense from '@/pages/Spending/Expense/AddExpense.vue';
import SelectVendor from '@/pages/Spending/Expense/SelectVendor.vue';
import AddNewVendorForm from '@/pages/Spending/Expense/AddNewVendorForm.vue';
import ExpenseItemSummary from '@/pages/Spending/Expense/ExpenseItemSummaryCardIndex.vue';
import AddExpenseDetails from '@/pages/Spending/Expense/AddExpenseDetails.vue';
import ExpenseItemSummaryPage from '@/pages/Spending/Expense/ExpenseItemSummaryPage.vue';

import ExpenseModule from '@/store/modules/expense';
import VendorModule from '@/store/modules/vendor';
import GeneralModule from '@/store/modules/general';

import {
    ExpenseItemType,
    ExpenseSummary,
    ExpenseRequest,
    ExpenseRequestStatus,
    VendorType,
    ExpenseWitholdingTaxTypes,
    expenseItemTypeInitialState,
    vendorInitialState,
    initialStateOfExpenseSummary,
    initialStateOfExpenseForm,
    ExpenseDetails,
    PaymentStatus,
    ExpenseLineItem,
    RecordExpenseDetail,
} from '@/pages/Spending/Expense/types';
import { LeftIcon, Status, Vendor } from '@/types';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import UtilityMixins from '@/mixins/Utility';
import { isEmpty } from '@/utils/formValidator';
import CurrencyMixins from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

const expenses = namespace('expense');
const vendors = namespace('vendor');
const general = namespace('general');

let vendorModule: VendorModule;
let expenseModule: ExpenseModule;
let generalModule: GeneralModule;

@Component({
    components: {
        SelectExpense,
        AddNewExpenseItemForm,
        AddExpense,
        SelectVendor,
        AddNewVendorForm,
        ExpenseItemSummary,
        AddExpenseDetails,
        ExpenseItemSummaryPage,
    },
})
export default class RecordExpense extends Mixins(DynamicComponentMixin, UtilityMixins, CurrencyMixins) {
    private splitPageIntoTwoSections = true;
    private showExpenseItemSummary = true;
    private newExpenseName = '';
    private selectedExpenseItemType: ExpenseItemType = {
        ...expenseItemTypeInitialState,
    };
    private selectedVendor: Vendor = {
        ...vendorInitialState,
    };
    private componentsList: object[] = [
        SelectExpense,
        AddExpense,
        AddNewExpenseItemForm,
        SelectVendor,
        AddNewVendorForm,
        AddExpenseDetails,
        ExpenseItemSummaryPage,
    ];
    private pageTitles = [
        'Select Item',
        'New Expense',
        'Add Item',
        'Select Vendor',
        'Add Vendor',
        'Expense Details',
        'Expense Summary',
    ];
    private selectedExpenseItems: Array<ExpenseSummary> = [];
    private expenseSummary = { ...initialStateOfExpenseSummary };
    private searchedVendor = '';
    private expenseRequestForm: Array<ExpenseRequest> = [];
    private immediateExpense = false;
    private preliminaryExpenseForm: ExpenseRequest = {
        ...initialStateOfExpenseForm,
    };
    private expenseCreatedOrModifiedSuccessfully = false;
    private subTitle = '';
    private editingSelectedExpense = false;
    private indexOfCurrentlySelectedExpense = '';
    private leftIcon = LeftIcon.None;
    private showBackButton = true;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'create-expense-toaster',
        position: 'b-toaster-top-right',
    };

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @vendors.State
    private vendors!: Vendor[];

    @expenses.State
    private expenseItemTypes!: Array<ExpenseItemType>;

    @expenses.State
    private expenseItemDetails!: ExpenseLineItem;

    @Prop({ default: '' }) action!: string;

    get previousExpenseIsBeingEdited(): boolean {
        return this.action === 'edit';
    }

    get requestStatus(): string {
        if (this.previousExpenseIsBeingEdited) {
            return this.updateExpenseRequestStatus;
        }

        return this.createExpenseRequestStatus;
    }

    get isFullPayment(): boolean {
        const { unitCost, amountPaid, amountPaidInOfferCurrency } = this.preliminaryExpenseForm;

        if (unitCost.currencyKey === amountPaid.currencyKey) return amountPaid.amount == this.netCost;

        return amountPaidInOfferCurrency.amount == this.netCost;
    }

    get createExpenseRequestStatus(): string {
        return this.expenseRequestStatus.createExpense;
    }

    get updateExpenseRequestStatus(): string {
        return this.expenseRequestStatus.updateExpense;
    }

    get pageTitle(): string {
        return this.pageTitles[this.activeComponentIndex];
    }

    get selectedExpenseItemsCount(): number {
        return this.selectedExpenseItems.length;
    }

    get selectedExpenseItemsIsNotEmpty(): boolean {
        return this.selectedExpenseItems.length > 0;
    }

    get shouldShowCart(): boolean {
        return this.selectedExpenseItems.length > 0 && !this.userIsOnDesktop;
    }

    get shouldShowBackButton(): boolean {
        return this.activeComponentIndex === 2 || this.activeComponentIndex === 3 || this.activeComponentIndex === 4;
    }

    get cardClass(): string {
        return this.$root.isLargeScreenSize ? 'add-expense-content__body--xl' : '';
    }

    get netCost(): number {
        const { withHoldingTaxType } = this.preliminaryExpenseForm;
        const { unitCost, quantity } = this.expenseSummary;

        return this.calculateNetCost(withHoldingTaxType, unitCost * quantity, this.withholdingAmount);
    }

    private calculateNetCost(withHoldingTaxType: string, subTotal: number, withholdingAmount: number): number {
        if (withHoldingTaxType === ExpenseWitholdingTaxTypes.INCLUSIVE) {
            return subTotal - withholdingAmount;
        }

        // if (withHoldingTaxType === ExpenseWitholdingTaxTypes.EXCLUSIVE) {
        //     return subTotal + withholdingAmount;
        // }

        return subTotal;
    }

    get balance(): number {
        const { unitCost, amountPaid, amountPaidInOfferCurrency } = this.preliminaryExpenseForm;

        if (unitCost.currencyKey === amountPaid.currencyKey) return this.netCost - amountPaid.amount;

        return this.netCost - amountPaidInOfferCurrency.amount;
    }

    get withholdingAmount(): number {
        const { withHoldingTaxType } = this.preliminaryExpenseForm;

        if (isEmpty(withHoldingTaxType) || withHoldingTaxType === ExpenseWitholdingTaxTypes.NONE) return 0;

        return this.calculateWitholdingTax();
    }

    get taxPercentage(): number {
        const { withHoldingTaxType } = this.preliminaryExpenseForm;

        if (isEmpty(withHoldingTaxType) || withHoldingTaxType === ExpenseWitholdingTaxTypes.NONE) return 0;

        if (this.selectedVendor.vendorType === VendorType.BUSINESS) {
            return 5;
        }

        return 10;
    }

    @Watch('activeComponentIndex')
    activeComponentChanged() {
        switch (this.activeComponentIndex) {
            case 0:
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(true);
                this.setCartCount();
                break;
            case 1:
            case 5:
                this.leftIcon = LeftIcon.Cancel;
                this.setCartVisibility(false);
                break;
            case 2:
            case 3:
            case 4:
                this.leftIcon = LeftIcon.Back;
                this.setCartVisibility(false);
                break;
            case 6:
                this.leftIcon = LeftIcon.Hamburger;
                this.showBackButton = false;
                this.setCartVisibility(true);
                this.setCartCount();
                break;
            default:
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(true);
                this.showBackButton = true;
        }
    }

    @Watch('pageTitle')
    pageTitleChanged() {
        this.$parent.$emit('update-page-title', this.pageTitle);
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

    @Watch('mobileCancelButtonClicked')
    watchMobileCancelButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileCancelButtonState(false);
    }

    @Watch('mobileCartButtonClicked')
    watchMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked && this.selectedExpenseItemsIsNotEmpty) {
            this.showExpenseSummaryPage();
        }
        generalModule.setMobileCartButtonState(false);
    }

    private setCartVisibility(shouldShow: boolean) {
        this.$parent.$emit('set-show-cart', shouldShow);
    }

    private handleGoBack() {
        switch (this.activeComponentIndex) {
            case 1:
            case 5:
            case 2:
            case 6:
                this.showExpenseSelectionPage();
                break;
            case 3:
                this.showExpenseDetailsPage();
                break;
            case 4:
                this.showVendorSelectionPage();
                break;
            default:
                break;
        }
    }

    private setCartCount() {
        this.$parent.$emit('set-cart-count', this.selectedExpenseItemsCount);
    }

    private handleExpenseItemEdit(indexOfCurrentlySelectedExpense: number) {
        this.indexOfCurrentlySelectedExpense = indexOfCurrentlySelectedExpense.toString();
        // set the expense summary from the array
        this.expenseSummary = this.selectedExpenseItems[indexOfCurrentlySelectedExpense];

        // set the expense form item from the
        const selectedExpenseItem = this.expenseRequestForm[indexOfCurrentlySelectedExpense];
        this.preliminaryExpenseForm = selectedExpenseItem;

        this.handleExpenseItemSummaryState(true);
        this.resizePageForExpenseSummaryMobile();
        this.setEditingSelectedExpenseMode(true);

        this.$nextTick(() => {
            const { vendorKey, expenseItemTypeKey } = selectedExpenseItem;

            this.selectedExpenseItemType = this.expenseItemTypes.filter(
                (expenseItemType: ExpenseItemType) => expenseItemType.expenseItemTypeKey === expenseItemTypeKey,
            )[0];

            if (vendorKey) {
                this.selectedVendor = this.vendors.filter((vendor: Vendor) => vendor.vendorKey === vendorKey)[0];
            }
            this.showExpenseDetailsPage();
        });
    }

    private handleExpenseItemDeletion(index: number) {
        this.selectedExpenseItems.splice(index, 1);
        this.expenseRequestForm.splice(index, 1);

        // if all the items have been deleted, then take the user to a page to restart the expense process
        if (!this.selectedExpenseItemsIsNotEmpty) {
            this.handleExpenseItemSummaryState(true);
            this.resizePageForExpenseSummaryMobile();

            this.$nextTick(() => {
                this.showExpenseSelectionPage();
            });
        }
    }

    private goToExpenseDashboard() {
        this.subTitle = '';
        this.$router.push({ name: 'Expenses' });
    }

    private startNewExpense() {
        this.subTitle = '';
        this.expenseCreatedOrModifiedSuccessfully = false;
        this.showExpenseSelectionPage();
    }

    private calculateWitholdingTax(): number {
        const { withHoldingTaxType } = this.preliminaryExpenseForm;
        const { unitCost, quantity } = this.expenseSummary;

        return this.getWHTAmount(this.taxPercentage, withHoldingTaxType, unitCost * quantity);
    }

    private getWHTAmount(taxPercentage: number, taxType: string, subTotal: number): number {
        if (taxType === ExpenseWitholdingTaxTypes.INCLUSIVE) {
            return Number(this.roundN((subTotal * taxPercentage) / 100, 2));
        }

        const fullAmount = subTotal / (1 - taxPercentage / 100);

        return Number(this.roundN((fullAmount * taxPercentage) / 100, 2));
    }

    private handleNewExpenseItem(newExpenseItem: ExpenseItemType) {
        this.setExpenseItemAndshowAddExpenseForm(newExpenseItem);
    }

    private removeSelectedVendor() {
        this.expenseSummary.vendorName = '';
        this.resetSelectedVendor();
        this.preliminaryExpenseForm.vendorKey = '';
    }

    private showAddNewExpenseItemForm(newExpenseName: string) {
        this.newExpenseName = newExpenseName;
        this.$nextTick(() => {
            this.setActiveComponentIndex(2);
        });
    }

    private setExpenseItemAndshowAddExpenseForm(selectedExpenseItemType: ExpenseItemType) {
        this.selectedExpenseItemType = selectedExpenseItemType;

        if (!selectedExpenseItemType.lastTransactionAmount) {
            this.selectedExpenseItemType.lastTransactionAmount = {
                amount: 0,
                currencyKey: this.defaultCurrency.currencyKey,
            };
        }

        this.$set(this.expenseSummary, 'itemName', selectedExpenseItemType.name);

        this.$nextTick(() => {
            this.showAddExpenseForm();
        });
    }

    private showAddExpenseForm() {
        this.setActiveComponentIndex(1);
    }

    private setEditingSelectedExpenseMode(state: boolean) {
        this.editingSelectedExpense = state;
    }

    private setExpenseSummaryProperties(expenseSummary: ExpenseSummary) {
        this.expenseSummary = { ...expenseSummary, itemName: this.selectedExpenseItemType.name };
    }

    private showVendorSelectionPage() {
        this.$nextTick(() => {
            this.setActiveComponentIndex(3);
        });
    }

    private showAddExpenseFromSummaryCard() {
        this.$nextTick(() => {
            this.setActiveComponentIndex(1);
        });
    }

    private addSelectedVendorToForm(vendor: Vendor) {
        const isFullPayment = this.isFullPayment;

        this.selectedVendor = { ...this.selectedVendor, ...vendor };

        this.preliminaryExpenseForm.vendorKey = vendor.vendorKey;

        if (isFullPayment) {
            this.preliminaryExpenseForm.amountPaid.amount = this.netCost;
            this.expenseSummary.amountPaid = this.netCost;
        }

        this.expenseSummary = Object.assign({}, this.expenseSummary, {
            ...this.expenseSummary,
            vendorName: vendor.name,
            withholdingAmount: this.withholdingAmount,
            withholdingTaxPercentage: this.taxPercentage,
            netCost: this.netCost,
            balance: this.balance,
        });

        this.$nextTick(() => {
            this.showExpenseDetailsPage();
        });
    }

    private displayAddNewVendorForm(searchedVendor: string) {
        this.searchedVendor = searchedVendor;
        this.setActiveComponentIndex(4);
    }

    private addExpenseDetailsToSummary(expenseDetails: ExpenseDetails) {
        this.expenseSummary = Object.assign({}, this.expenseSummary, { ...this.expenseSummary, ...expenseDetails });
    }

    private saveCreateExpenseFormState(createExpenseForm: ExpenseRequest) {
        // if we are editing, just update with the new values
        if (this.editingSelectedExpense) {
            this.expenseRequestForm.splice(Number(this.indexOfCurrentlySelectedExpense), 1, createExpenseForm);
            return;
        }

        this.expenseRequestForm.push(createExpenseForm);
    }

    private saveExpenseDetails(details: RecordExpenseDetail) {
        this.preliminaryExpenseForm = Object.assign({}, this.preliminaryExpenseForm, {
            ...this.preliminaryExpenseForm,
            ...details,
        });
    }

    private savePreliminaryExpenseFormState(createExpenseForm: ExpenseRequest) {
        this.preliminaryExpenseForm = createExpenseForm;
    }

    private addExpenseSummaryItemToSelectedExpenseItems() {
        // if we are editing, just update with the new values
        if (this.editingSelectedExpense) {
            this.selectedExpenseItems.splice(Number(this.indexOfCurrentlySelectedExpense), 1, {
                ...this.expenseSummary,
            });
            this.setEditingSelectedExpenseMode(false);
            return;
        }

        this.selectedExpenseItems.push({ ...this.expenseSummary });
    }

    private restartExpenseProcess() {
        this.resetExpenseSummary();
        this.resetSelectedExpenseItem();
        this.resetSelectedVendor();
        this.handleExpenseItemSummaryState(true);
        this.resizePageForExpenseSummaryMobile();

        this.$nextTick(() => {
            this.setActiveComponentIndex(0);
        });
    }

    private submitExpenseItem() {
        this.addExpenseSummaryItemToSelectedExpenseItems();
        this.resetExpenseSummary();
    }

    private showExpenseSelectionPage() {
        // on desktop, if the user is on the expense page, we need to show the left side of the record expense page
        if (this.userIsOnDesktop && !this.splitPageIntoTwoSections) {
            this.splitPageIntoTwoSections = true;
        }

        this.restartExpenseProcess();
    }

    private showExpenseDetailsPage() {
        this.$nextTick(() => {
            this.setActiveComponentIndex(5);
        });
    }

    private handleExpenseItemSummaryState(state: boolean) {
        this.showExpenseItemSummary = state;
    }

    private showExpenseSummaryPage() {
        //  we will hide the expense item summary component
        this.handleExpenseItemSummaryState(false);

        // on desktop, we need to enable the summary page on fullscreen
        if (this.userIsOnDesktop) {
            this.splitPageIntoTwoSections = false;
        }

        // on mobile, we need to change the component being rendered on the left side
        this.$nextTick(() => {
            this.setActiveComponentIndex(6);
        });
    }

    private handleSaveAndAddAnotherItem() {
        this.addExpenseSummaryItemToSelectedExpenseItems();
        this.restartExpenseProcess();
    }

    private resetExpenseSummary() {
        this.expenseSummary = { ...initialStateOfExpenseSummary };
    }

    private resetSelectedExpenseItem() {
        this.selectedExpenseItemType = { ...expenseItemTypeInitialState };
        this.preliminaryExpenseForm = { ...initialStateOfExpenseForm };
    }

    private resetSelectedVendor() {
        this.selectedVendor = { ...vendorInitialState };
    }

    private resizePageForExpenseSummaryMobile() {
        this.splitPageIntoTwoSections = true;
    }

    private resizePageForExpenseSummaryDesktop() {
        if (this.activeComponentIndex == 6) {
            this.splitPageIntoTwoSections = false;
        }
    }

    private handleCartClick() {
        if (this.selectedExpenseItemsIsNotEmpty) {
            this.showExpenseSummaryPage();
        }
    }

    private clearAllStates() {
        this.selectedExpenseItemType = Object.assign({}, this.selectedExpenseItemType, {
            ...expenseItemTypeInitialState,
        });
        this.selectedVendor = Object.assign({}, this.selectedVendor, {
            ...vendorInitialState,
        });
        this.selectedExpenseItems = [];
        this.expenseSummary = Object.assign({}, this.expenseSummary, {
            ...initialStateOfExpenseSummary,
        });
        this.editingSelectedExpense = false;
        this.expenseRequestForm = [];
        this.preliminaryExpenseForm = Object.assign({}, this.preliminaryExpenseForm, { ...initialStateOfExpenseForm });
        this.setCartCount();
        this.setCartVisibility(false);
    }

    private showExpenseSuccessPage() {
        this.expenseCreatedOrModifiedSuccessfully = true;
        this.subTitle = 'Success';
    }

    private async createNewExpense() {
        await expenseModule.createExpense(this.expenseRequestForm);

        if (this.createExpenseRequestStatus === Status.SUCCESS) {
            this.showExpenseSuccessPage();
            this.clearAllStates();
            return;
        }

        this.showErrorNotification();

        if (this.immediateExpense) this.expenseRequestForm = [];
    }

    private async updateExpense() {
        const { params } = this.$route;
        await expenseModule.updateExpense({ expenseKey: params.expenseKey, expenseBody: this.expenseRequestForm[0] });

        if (this.updateExpenseRequestStatus === Status.SUCCESS) {
            this.showExpenseSuccessPage();
            this.clearAllStates();
            return;
        }

        this.showErrorNotification();

        if (this.immediateExpense) this.expenseRequestForm = [];
    }

    private showErrorNotification(message = 'An Error Occured') {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message,
        });
    }

    private async handleExpenseSubmission() {
        this.immediateExpense = false;

        if (this.previousExpenseIsBeingEdited) {
            this.updateExpense();
        } else {
            this.createNewExpense();
        }
    }

    private async handleImmediateSubmission() {
        this.immediateExpense = true;

        if (this.previousExpenseIsBeingEdited) {
            this.updateExpense();
        } else {
            this.createNewExpense();
        }
    }

    private checkForPreloads() {
        let vendor = SessionStorageService.getItem('selected-vendor');

        if (vendor) {
            vendor = JSON.parse(vendor);

            this.selectedVendor = Object.assign({}, this.selectedVendor, vendor);

            SessionStorageService.removeItem('selected-vendor');
        }
    }

    private setupDataForEdit() {
        const item = this.expenseItemDetails;

        let status = PaymentStatus.FULL;
        if (item.amountPaid.amount == 0) status = PaymentStatus.NONE;
        else if (item.balance.amount > 0) status = PaymentStatus.PART;

        const taxType = item.withholdingTax?.name || 'None';
        const vendorKey = item.vendor?.key || '';
        const vendor = this.vendors.find((vendor: Vendor) => vendor.vendorKey === vendorKey);
        const subTotal = item.unitCost.amount * item.quantity;
        let whtPercent = 0;
        let whtAmount = 0;
        let netCost = subTotal;

        if (vendor) {
            if (vendor.vendorType === VendorType.BUSINESS) whtPercent = 5;
            else if (vendor.vendorType === VendorType.INDIVIDUAL) whtPercent = 10;

            whtAmount = this.getWHTAmount(whtPercent, taxType, subTotal);

            netCost = this.calculateNetCost(taxType, subTotal, whtAmount);
        }

        const preparedLine = {
            itemName: item.expenseItemType.name,
            unitCost: item.unitCost.amount,
            isMeasurable: false,
            quantity: item.quantity,
            withholdingTaxPercentage: whtPercent,
            amountPaid: item.amountPaid.amount,
            bankDetails: {
                accountName: '',
                accountCurrencySymbol: '',
            },
            vendorName: item.vendor?.name || '',
            measurementUnit: item.measurementType?.name || '',
            expenseCurrency: this.getCurrencySymbolFromCurrencyKey(item.unitCost.currencyKey.toString()),
            netCost: netCost,
            balance: item.balance.amount,
            withholdingAmount: whtAmount,
            exchangeRate: 0,
            taxType: taxType,
            totalCost: subTotal,
            paymentStatus: status,
            notes: item.notes,
        };

        this.selectedExpenseItems.push(preparedLine);

        let amountOwed = netCost - item.amountPaid.amount;
        if (item.unitCost.currencyKey !== item.amountPaid.currencyKey)
            amountOwed = netCost - item.amountPaidInOfferCurrency.amount;

        const preparedSummary = {
            name: item.expenseItemType.name,
            expenseItemTypeKey: item.expenseItemType.key,
            amountPaidInOfferCurrency: item.amountPaidInOfferCurrency,
            unitCost: item.unitCost,
            amountPaid: item.amountPaid,
            discount: 0,
            quantity: item.quantity,
            vendorKey: item.vendor?.key || '',
            measurementTypeKey: item.measurementType?.key || '',
            amountOwed: amountOwed,
            withHoldingTaxType: taxType,
            paymentAccountKey: item.paymentAccountKey,
            paymentDueDate: this.formatDateToFitCalendarFormat(item.paymentDueDate),
            quantityReceived: item.quantityReceived,
            transactionDate: this.formatDateToFitCalendarFormat(item.transactionDate),
            supplyDueDate: this.formatDateToFitCalendarFormat(item.supplyDueDate),
            attachments: [],
            notes: item.notes || '',
            expenseItemKey: item.expenseItemKey || '',
        };

        this.expenseRequestForm.push(preparedSummary);
    }

    beforeRouteEnter(to: object, from: object, next: Function) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next(async (vm: any) => {
            expenseModule = getModule(ExpenseModule, vm.$store);
            vendorModule = getModule(VendorModule, vm.$store);

            vm.checkForPreloads();

            if (!vm.action) return;

            const { params } = vm.$route;

            await Promise.all([expenseModule.getExpenseItemDetails(params.expenseKey), vendorModule.getVendors()]);

            vm.setupDataForEdit();

            if (vm.action === 'edit') vm.handleExpenseItemEdit(0);
            else vm.showExpenseSummaryPage();
        });
    }

    mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);
        vendorModule = getModule(VendorModule, this.$store);
        generalModule = getModule(GeneralModule, this.$store);

        if (this.userIsOnMobile) {
            this.$parent.$emit('update-page-title', 'New Expense');
        } else {
            this.pageTitleChanged();
        }

        this.setCartVisibility(true);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense';
</style>
