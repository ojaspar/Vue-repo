<template>
    <div>
        <div class="quick-expense-index">
            <ListDropdownAndAddBar
                addEntityText="Add New"
                placeholder="Select Expense Item"
                :entityList="expenseItemTypes"
                entityKey="expenseItemTypeKey"
                dateKey="lastTransactionDate"
                entityNameKey="name"
                :newEntityCreated="newExpenseItemCreated"
                :createdEntity="createdExpenseItem"
                :requestIsLoading="expenseItemTypeRequestIsLoading"
                :clearSearchString="clearSearchString"
                @add-entity-button-clicked="$emit('add-entity-button-clicked')"
                @resource-selected="handleExpenseSelection"
                @search-string-changed="emitExpenseSearchStringValue"
                @invalid-search-string="handleInvalidSearchString"
                @valid-search-string="handleValidSearchString"
                @entity-list-hidden="handleExpenseListDismissal"
            />
            <b-container fluid class="quick-expense-index__form-input-container">
                <!-- Item Description -->
                <b-row class="quick-expense-index__row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Item Description"
                            v-model="form.description"
                        />
                    </b-col>
                </b-row>

                <b-row class="quick-expense-index__row">
                    <!-- Amount-->
                    <b-col class="pl-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Amount', this.form.currency)"
                            v-model="form.total"
                            className="quick-expense-index__split-input"
                            @input="validateQuickExpenseTotalAmount"
                            :errors="errors.total"
                        />
                    </b-col>

                    <!-- Account Paid From -->
                    <b-col class="pr-0">
                        <BaseSelectWithBorderAndFloatingLabel
                            keyProperty="paymentAccountKey"
                            valueProperty="paymentAccountKey"
                            textProperty="displayNameWithBalance"
                            defaultOptionText="-- Select Account --"
                            floatingLabelText="Paid From"
                            v-model="form.paidFromAccountKey"
                            @input="handlePaidFromAccountChange"
                            :options="updatedPaymentAccounts"
                            className="quick-expense-index__split-input"
                            :errors="errors.paymentAccount"
                        />
                    </b-col>
                </b-row>

                <b-row class="quick-expense-index__row">
                    <!-- Quantity -->
                    <b-col class="pl-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            v-model="form.quantity"
                            floatingLabelText="Quantity"
                            className="quick-expense-index__split-input"
                            @input="validateQuickExpenseQuantity"
                            :errors="errors.quantity"
                        />
                    </b-col>

                    <!-- Measurement Type -->
                    <b-col class="pr-0">
                        <BaseSelectWithBorderAndFloatingLabel
                            className="quick-expense-index__split-input"
                            floatingLabelText="Measurement Type"
                            keyProperty="key"
                            textProperty="name"
                            valueProperty="key"
                            defaultOptionText="-- Select Measurement Type --"
                            :options="measurementTypes"
                            :errors="errors.measurementType"
                            v-model="form.measurementTypeKey"
                            @input="handleMeasurementTypeChange"
                        />
                    </b-col>
                </b-row>

                <!-- Donation Scheme -->
                <b-row class="quick-expense-index__row" v-if="$root.businessIsANgo">
                    <b-col class="p-0">
                        <BaseSelectWithBorderAndFloatingLabel
                            :options="donationSchemes"
                            defaultSelectField="true"
                            defaultOptionText="-- Select Project Fund --"
                            keyProperty="donationSchemeKey"
                            valueProperty="donationSchemeKey"
                            textProperty="name"
                            floatingLabelText="Project Fund"
                            :errors="errors.donationScheme"
                        />
                    </b-col>
                </b-row>

                <b-row class="quick-expense-index__row">
                    <!-- Transaction Date -->
                    <b-col class="p-0">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Transaction Date"
                            :errors="errors.transactionDate"
                            @input="validateQuickExpenseTransactionDate"
                            v-model="form.transactionDate"
                        />
                    </b-col>
                </b-row>

                <!-- Vendor Selection-->
                <b-row class="quick-expense-index__row">
                    <b-col class="p-0 mt-3" v-if="vendorListShouldShow">
                        <ListDropdownAndAddBar
                            addEntityText="Add New"
                            placeholder="Select Vendor"
                            :entityList="vendors"
                            entityKey="vendorKey"
                            dateKey="lastActivityDate"
                            entityNameKey="name"
                            :newEntityCreated="newVendorCreated"
                            :createdEntity="createdVendor"
                            :requestIsLoading="vendorRequestIsLoading"
                            :autoFocus="true"
                            @add-entity-button-clicked="addNewVendor"
                            @resource-selected="handleVendorSelection"
                            @search-string-changed="emitVendorSearchStringValue"
                            @entity-list-hidden="handleVendorListDismissal"
                        />
                    </b-col>

                    <b-col class="p-0" v-else>
                        <BaseInputFieldWithBorderAndFloatingLabel
                            :floatingLabelText="vendorSelectionLabelText"
                            :value="selectedVendorName"
                            @focus="showVendorList"
                        />
                    </b-col>
                </b-row>

                <b-row class="quick-expense-index__row">
                    <!-- Notes -->
                    <b-col class="p-0">
                        <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="form.notes" />
                    </b-col>
                </b-row>

                <div class="quick-expense-index__block-error-message-container quick-expense-index__row">
                    <BlockErrorMessage :message="generalErrorMessage" />
                </div>

                <!-- Buttons -->
                <b-row class="quick-expense-index__row">
                    <b-col class="p-0">
                        <div class="quick-expense-index__buttons-container">
                            <!-- Save -->
                            <BasePrimaryButton
                                buttonText="Save"
                                className="quick-expense-index__button--save"
                                :disabled="conditionsForButtonToBeDisabled"
                                :status="saveButtonStatus"
                                @button-clicked="saveQuickExpensePage"
                            />
                            <!-- Save & Close -->
                            <BaseButton
                                buttonText="Save and Close"
                                :overRideButtonClass="true"
                                :disabled="conditionsForButtonToBeDisabled"
                                className="quick-expense-index__button--save-and-close"
                                :status="saveAndCloseButtonStatus"
                                @button-clicked="saveAndCloseQuickExpensePage"
                            />
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import BusinessModule from '@/store/modules/business';
import ExpenseModule from '@/store/modules/expense';
import DonationModule from '@/store/modules/donation';
import SalesModule from '@/store/modules/sale';
import VendorModule from '@/store/modules/vendor';

import { DonationScheme, DonationRequestStatus } from '@/pages/Donations/types';
import {
    SaleRequestStatus,
    VueExtension,
    PaymentAccount,
    Currency,
    Status,
    BusinessRequestStatus,
    Toaster,
    Vendor,
    defaultVendor,
} from '@/types';

import { MeasurementType } from '@/types';
import {
    ExpenseItemType,
    ExpenseRequest,
    ExpenseRequestStatus,
    initialStateOfExpenseForm,
    expenseItemTypeInitialState,
    VendorRequestStatus,
} from '@/pages/Spending/Expense/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import SalesServiceMixin from '@/mixins/SalesService';
import { hasError } from '@/utils/formValidator';

const expenses = namespace('expense');
const business = namespace('business');
const donations = namespace('donation');
const sales = namespace('sale');
const vendors = namespace('vendor');

let expenseModule: ExpenseModule;
let businessModule: BusinessModule;
let donationModule: DonationModule;
let salesModule: SalesModule;
let vendorModule: VendorModule;

@Component
export default class QuickExpenseForm extends Mixins(CurrencyMixins, UtilityMixins, SalesServiceMixin) {
    @Prop({ default: false }) readonly newExpenseItemCreated!: boolean;
    @Prop({ default: () => expenseItemTypeInitialState }) readonly createdExpenseItem!: ExpenseItemType;
    @Prop({ default: false }) readonly newVendorCreated!: boolean;
    @Prop({ default: false }) readonly addingNewVendor!: boolean;

    @expenses.State
    private measurementTypes!: MeasurementType[];

    @business.State
    private currencyKeyList!: Array<Currency>;

    @business.State
    private businessRequestStatus!: BusinessRequestStatus;

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @donations.State
    private error!: string;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private donationSchemes!: DonationScheme[];

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    @expenses.State
    private expenseItemTypes!: Array<ExpenseItemType>;

    @expenses.State
    private expenseError!: string;

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    @vendors.State
    private vendors!: Array<Vendor>;

    @vendors.State
    private createdVendor!: Vendor;

    private pageTitle = 'New Quick Expense';

    private disableQuickExpenseButtons = false;

    public $root!: VueExtension;

    private initialStateOfForm = {
        price: '',
        quantity: '1',
        paidFromAccountKey: '',
        notes: '',
        transactionDate: '',
        measurementTypeKey: '',
        currency: 0,
        description: '',
        total: 0,
    };

    private form = { ...this.initialStateOfForm };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'quick-expense-form',
        position: 'b-toaster-top-center',
    };

    private closePage = false;

    public errors = {
        donationScheme: '',
        transactionDate: '',
        currency: '',
        measurementType: '',
        paymentAccount: '',
        quantity: '',
        total: '',
    };

    private selectedExpenseItem = {
        ...expenseItemTypeInitialState,
    };

    private errorMessage = '';

    private expenseSearchString = '';
    private expenseSearchStingIsValid = true;
    private clearSearchString = false;

    private vendorSearchString = '';
    private selectedVendor: Vendor = { ...defaultVendor };
    private vendorListShouldShow = false;

    get unitCostAmount(): number {
        const { total } = this.form;

        if (Number(total) === 0) return 0;

        const totalAmount = this.convertFormattedFiguresToNumber(this.form.total.toString());
        const quantity = this.convertFormattedFiguresToNumber(this.form.quantity);
        return totalAmount / quantity;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get atLeastOneQuickExpenseStatusIsLoading(): boolean {
        return (
            this.expenseRequestStatus.createExpense === Status.LOADING ||
            this.expenseRequestStatus.getExpenseMeasurementTypes === Status.LOADING ||
            this.salesRequestStatus.getPaymentAccounts === Status.LOADING ||
            this.businessRequestStatus.getPaymentCurrentKeyList === Status.LOADING ||
            this.vendorRequestStatus.getVendors === Status.LOADING
        );
    }

    get quickExpenseButtonStatus(): string {
        return this.atLeastOneQuickExpenseStatusIsLoading ? 'LOADING' : 'NORMAL';
    }

    get saveButtonStatus() {
        return !this.closePage && this.quickExpenseButtonStatus;
    }

    get saveAndCloseButtonStatus() {
        return this.closePage && this.quickExpenseButtonStatus;
    }

    get conditionsForButtonToBeDisabled(): boolean {
        // if the closePage boolean is true or false, if there is at least one error or one expense status is loading, disable the buttons
        // this is to prevent a user from being able to click one button if there is one error or at least one status is loading or the other
        // button is clicked
        return (
            this.atLeastOneErrorExists(this.errors) ||
            this.atLeastOneQuickExpenseStatusIsLoading ||
            this.disableQuickExpenseButtons
        );
    }

    get expenseItemTypeRequestIsLoading(): boolean {
        return this.expenseRequestStatus.getExpenseItemsTypes === Status.LOADING;
    }

    get vendorRequestIsLoading(): boolean {
        return this.vendorRequestStatus.getVendors === Status.LOADING;
    }

    get selectedVendorName(): string {
        return this.selectedVendor.name;
    }

    get vendorSelectionLabelText(): string {
        return this.selectedVendor.name ? 'Vendor' : 'Select Vendor';
    }

    get generalErrorMessage(): string {
        return this.errorMessage || this.expenseError;
    }

    private showVendorList() {
        this.vendorListShouldShow = true;
    }

    private hideVendorList() {
        this.emitVendorSearchStringValue('');
        this.vendorListShouldShow = false;
    }

    private validateQuickExpenseTotalAmount() {
        if (this.form.total < 0) {
            this.errors.total = 'Please enter a valid amount';
            return;
        }

        this.errors.total = '';
    }

    private validateQuickExpenseQuantity() {
        this.validateQuantity(this.convertFormattedFiguresToNumber(String(this.form.quantity)), this.errors);
    }

    private validateQuickExpenseTransactionDate(transactionDate: string): void {
        if (!transactionDate) {
            this.errors.transactionDate = 'Transaction date is required';
            return;
        }
        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.errors.transactionDate = 'Transaction date cannot be in the future';
            return;
        }
        this.errors.transactionDate = '';
    }

    private validateExpenseItem() {
        if (!this.selectedExpenseItem.name && (!this.expenseSearchString || this.expenseSearchStingIsValid)) {
            this.errorMessage = 'Please select an expense item';
            this.disableQuickExpenseButtons = true;
            return;
        }
        if (!this.selectedExpenseItem.name && this.expenseSearchString) {
            this.errorMessage = `The expense item you searched doesn't exist. Please click the 'Add New' button if you wish to add it`;
            this.disableQuickExpenseButtons = true;
            return;
        }
        this.errorMessage = '';
        this.disableQuickExpenseButtons = false;
    }

    private validateCompulsoryFields() {
        this.validateQuickExpenseTotalAmount();
        this.validatePaymentFromAccount();
        this.validateQuickExpenseQuantity();
        this.validateMeasurementType(this.form.measurementTypeKey, this.errors);
        this.validateQuickExpenseTransactionDate(this.form.transactionDate);
        this.validateExpenseItem();
    }

    private handleMeasurementTypeChange(value: string) {
        this.form.measurementTypeKey = value;
        this.$nextTick(() => {
            this.validateMeasurementType(this.form.measurementTypeKey, this.errors);
        });
    }

    private handlePaidFromAccountChange(value: string) {
        this.form.paidFromAccountKey = value;
        this.$nextTick(() => {
            this.validatePaymentFromAccount();
        });
    }

    private handleTransactionDateChange(transactionDate: string) {
        this.form.transactionDate = transactionDate;
        this.$nextTick(() => {
            this.validateQuickExpenseTransactionDate(this.form.transactionDate);
        });
    }

    private validatePaymentFromAccount() {
        if (!this.form.paidFromAccountKey) {
            this.errors.paymentAccount = 'Please select an account';
            return;
        }
        this.errors.paymentAccount = '';
    }

    private handleInvalidSearchString() {
        this.expenseSearchStingIsValid = false;
    }

    private handleValidSearchString() {
        this.expenseSearchStingIsValid = true;
    }

    private validateAndCreateExpense() {
        this.validateCompulsoryFields();
        if (!this.atLeastOneErrorExists(this.errors) && !hasError(this.errorMessage)) {
            this.createExpense();
        }
    }

    private handleExpenseSelection(expenseItem: ExpenseItemType) {
        this.selectedExpenseItem = expenseItem;
        this.validateExpenseItem();
    }

    private handleVendorSelection(selectedVendor: Vendor) {
        this.setSelectedVendor(selectedVendor);
        this.hideVendorList();
    }

    private setSelectedVendor(selectedVendor: Vendor) {
        this.selectedVendor = selectedVendor;
    }

    private handleExpenseListDismissal() {
        if (!this.expenseSearchString || !this.expenseSearchStingIsValid) {
            this.handleExpenseSelection(expenseItemTypeInitialState);
        }
        this.validateExpenseItem();
    }

    private handleVendorListDismissal() {
        if (this.addingNewVendor) return;
        this.hideVendorList();
    }

    private saveQuickExpensePage() {
        this.closePage = false;
        this.validateAndCreateExpense();
    }

    private saveAndCloseQuickExpensePage() {
        this.closePage = true;
        this.validateAndCreateExpense();
    }

    private generateRequestPayload(): ExpenseRequest[] {
        const requestPayload: Array<ExpenseRequest> = [
            {
                ...initialStateOfExpenseForm,

                unitCost: {
                    currencyKey: Number(this.form.currency),
                    amount: this.unitCostAmount,
                },
                quantity: this.convertFormattedFiguresToNumber(this.form.quantity),
                paymentAccountKey: this.form.paidFromAccountKey,
                notes: this.form.notes,
                description: this.form.description,
                transactionDate: this.form.transactionDate,
                measurementTypeKey: this.form.measurementTypeKey,
                expenseItemTypeKey: this.selectedExpenseItem.expenseItemTypeKey,
                vendorKey: this.selectedVendor.vendorKey,
                amountPaid: {
                    currencyKey: Number(this.form.currency),
                    amount:
                        Number(this.form.total) === 0
                            ? 0
                            : this.convertFormattedFiguresToNumber(this.form.total.toString()), // in a quick expense, amount paid is the same as total
                },
                withHoldingTaxType: 'None', // In a quick expense, there's no vendor, and with a withholding tax of none, no vendor is required
                quantityReceived: this.convertFormattedFiguresToNumber(this.form.quantity), // in a quick expense, the quantity supplied is equal to quantity
            },
        ];

        return requestPayload;
    }

    private async createExpense() {
        const expenseRequestPayload = this.generateRequestPayload();

        await expenseModule.createExpense(expenseRequestPayload);

        if (this.expenseRequestStatus.createExpense === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Expense has been created successfully',
            });

            this.$nextTick(async () => {
                this.clearAllFields();
                this.setDefaultCurency();
                this.setDefaultDate();
                await this.reloadPaymentAccounts();
            });

            if (this.closePage) this.$router.push('expenses');
        }
    }

    private clearAllFields() {
        const unitMeasurementType = this.measurementTypes.find(
            (measurementType: MeasurementType) => measurementType.name === 'Unit',
        );

        // set units as the default measurement unit
        this.form = { ...this.initialStateOfForm, measurementTypeKey: unitMeasurementType?.key || '' };

        this.clearSearchStringValue();
        this.selectedExpenseItem = { ...expenseItemTypeInitialState };
        this.selectedVendor = { ...defaultVendor };
        expenseModule.resetExpenseErrorState();
    }

    private emitExpenseSearchStringValue(searchString: string, clearValue = false) {
        this.expenseSearchString = searchString;
        this.clearSearchString = clearValue;
        this.$emit('expense-search-string-changed', searchString);
    }

    private emitVendorSearchStringValue(searchString: string) {
        this.vendorSearchString = searchString;
        this.$emit('vendor-search-string-changed', searchString);
    }

    private clearSearchStringValue() {
        this.emitExpenseSearchStringValue('', true);
        this.clearSearchString = true;
    }

    private addNewVendor() {
        this.$emit('add-vendor-button-clicked');
    }

    private setPageTitle() {
        this.$parent.$emit('update-page-title', this.pageTitle);
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private setDefaultCurency() {
        this.form.currency = this.homeCurrencyKey; // make default currency the home currency
        this.selectedCurrencyObject = this.getCurrencyObjectFromCurrencyKey(this.homeCurrencyKey); // this is used to validate the currency
    }

    private setDefaultDate() {
        this.form.transactionDate = this.todayAsDefaultDate();
    }

    private setUnitAsDefaultMeasurementType() {
        const unitMeasurementType = this.measurementTypes.filter(
            (measurementType: MeasurementType) => measurementType.name.toLowerCase() === 'unit',
        )[0];

        this.$set(this.form, 'measurementTypeKey', unitMeasurementType?.key);
    }

    private async reloadPaymentAccounts() {
        await salesModule.getPaymentAccounts();
    }

    private assignModules() {
        expenseModule = getModule(ExpenseModule, this.$store);
        businessModule = getModule(BusinessModule, this.$store);
        donationModule = getModule(DonationModule, this.$store);
        salesModule = getModule(SalesModule, this.$store);
        vendorModule = getModule(VendorModule, this.$store);
    }

    private async makePreliminaryRequests() {
        if (this.$root.businessIsANgo) {
            await donationModule.getDonationSchemes();
        }
        Promise.all([
            expenseModule.getMeasurementTypes(),
            businessModule.getPaymentCurrencyKeyList(),
            salesModule.getPaymentAccounts(),
            expenseModule.getExpenseItemTypes(),
            vendorModule.getVendors(),
        ]);
    }

    @Watch('form.total')
    formatChangedPrice(newValue: number) {
        const formattedPrice = this.formatFiguresToCurrency(String(newValue));

        this.$nextTick(() => {
            this.$set(this.form, 'total', formattedPrice);
        });
    }

    @Watch('form.quantity')
    formatChangedQuantity(newValue: number) {
        const formattedPrice = this.formatFiguresToCurrency(String(newValue));
        this.$nextTick(() => {
            this.form.quantity = formattedPrice;
        });
    }

    @Watch('newVendorCreated')
    @Watch('createdVendor', { deep: true })
    handleCreatedEntiy() {
        this.handleVendorSelection(this.createdVendor);
    }

    mounted() {
        this.assignModules();
        this.makePreliminaryRequests();
        this.setPageTitle();
        this.setDefaultCurency();
        this.setDefaultDate();
        this.setUnitAsDefaultMeasurementType();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/quick-expense';
</style>
