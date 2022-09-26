<template>
    <b-container class="add-new-expense-item">
        <div class="select-expense__loader" v-if="requirementsAreStillLoading">
            <Loader size="4" />
        </div>

        <template v-else>
            <!-- MeasurementTypes -->
            <b-row class="add-new-expense-item__input--row" v-if="showMeasurableExpenseInputForms">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        className="add-new-expense-item__input--select"
                        selectContainerClass="add-expense-group-select"
                        keyProperty="measurementTypeKey"
                        defaultSelectField="true"
                        defaultText="-- Measurement Type --"
                        valueProperty="key"
                        textProperty="name"
                        floatingLabelText="Measurement Type"
                        :options="measurementTypes"
                        @change="handleMeasurementTypeSelection"
                        :value="measurementTypeValue"
                        :errors="addExpenseError.measurementTypeKey"
                    >
                        <template v-slot:first-option>
                            <option value="none">None</option>
                        </template>
                    </BaseSelectWithBorderAndFloatingLabel>
                </b-col>
            </b-row>

            <!-- cost and currency -->
            <b-row class="add-new-expense-item__input--row">
                <b-col class="p-0 mr-2">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        required="true"
                        :floatingLabelText="measurableExpenseInputFormsLabelText"
                        className="add-new-expense-item__input--field add-new-expense-item__cost-field"
                        inputContainerClass="add-new-expense-item"
                        :errors="addExpenseError.unitCost"
                        @input="formatAndValidateExpenseUnitCost"
                        :value="convertFigureToCurrency(form.unitCost.amount)"
                    />
                    <BaseButton
                        overRideButtonClass="true"
                        className="add-new-expense-item__show-measurement-types"
                        @button-clicked="setShowMeasurableExpenseInputs"
                        v-if="!showMeasurableExpenseInputForms"
                    >
                        <font-awesome-icon icon="ellipsis-h" class="txt--primary" />
                    </BaseButton>
                </b-col>

                <!-- currencyOptions -->
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        className="add-new-expense-item__input--select"
                        selectContainerClass="add-expense-group-select"
                        floatingLabelText="Currency"
                        valueProperty="currencyKey"
                        textProperty="currencyName"
                        defaultOptionText="-- Select Currency --"
                        :options="availableCurrencies"
                        :value="offerCurrency.currencyKey"
                        :errors="addExpenseError.offerCurrency"
                        @change="handleOfferCurrencySelection"
                        isCurrency="true"
                        :disabled="true"
                    />
                </b-col>
            </b-row>

            <!-- Quantity -->
            <b-row class="add-new-expense-item__input--row" v-if="showMeasurableExpenseInputForms">
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        className="add-new-expense-item__input--field"
                        inputContainerClass="add-new-expense-item"
                        :value="form.quantity"
                        type="number"
                        floatingLabelText="Quantity"
                        :errors="addExpenseError.quantity"
                        @input="handleQuantityInput"
                    />
                </b-col>
            </b-row>

            <!-- Tax Option -->
            <b-row class="add-new-expense-item__input--row">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        className="add-new-expense-item__input--select"
                        selectContainerClass="add-expense-group-select"
                        floatingLabelText="Withholding Tax"
                        defaultOptionText="Please select a tax type"
                        keyProperty="name"
                        valueProperty="name"
                        textProperty="displayName"
                        :options="taxTypes"
                        v-model="form.withHoldingTaxType"
                        :errors="addExpenseError.withHoldingTaxType"
                        @change="handleTaxTypeSelection"
                    />
                </b-col>
            </b-row>

            <!-- Payment Status -->
            <BaseRadioGroupWithBorderAndFloatingLabel
                floatingLabelText="Payment Status"
                :radioButtonOptions="radioButtonOptions"
                v-model="paymentStatus"
                @change="setPaymentStatus"
                :checkedValue="paymentStatus"
                :errors="addExpenseError.paymentStatus"
            />

            <!-- Donation Scheme source for NGO -->
            <b-row class="add-new-expense-item__input--row" v-if="$root.businessIsANgo">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        className="add-new-expense-item__input--select"
                        selectContainerClass="add-expense-group-select"
                        defaultSelectField="true"
                        defaultOptionText="-- Select Project Fund --"
                        floatingLabelText="Project Fund"
                        keyProperty="donationSchemeKey"
                        valueProperty="donationSchemeKey"
                        textProperty="name"
                        :value="form.donationSchemeKey"
                        :options="donationSchemes"
                        @change="handleDonationSchemeSelection"
                        :errors="addExpenseError.donationSchemeKey"
                    />
                </b-col>
            </b-row>

            <!-- Amount Paid and Source of Fund -->
            <template v-if="fullOrPartPaymentChosen">
                <!-- Fund Source -->
                <b-row class="add-new-expense-item__input--row">
                    <b-col class="p-0">
                        <BaseSelectWithBorderAndFloatingLabel
                            className="add-new-expense-item__input--select"
                            selectContainerClass="add-expense-group-select"
                            defaultSelectField="true"
                            defaultOptionText="-- Select Account --"
                            floatingLabelText="Source of Funds"
                            keyProperty="paymentAccountKey"
                            valueProperty="paymentAccountKey"
                            textProperty="displayNameWithBalance"
                            :value="form.paymentAccountKey"
                            :options="updatedPaymentAccounts"
                            @change="handlePaymentAccountSelection"
                            :errors="addExpenseError.paymentAccountKey"
                        />
                    </b-col>
                </b-row>

                <!-- Amount Paid -->
                <b-row class="add-new-expense-item__input--row">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            required="true"
                            :floatingLabelText="amountPaidLabelText"
                            className="add-new-expense-item__input--field"
                            inputContainerClass="add-new-expense-item"
                            :errors="addExpenseError.amountPaid"
                            @input="formatAndValidateAmountPaid"
                            :value="convertFigureToCurrency(form.amountPaid.amount)"
                            :disabled="fullPaymentChosen && !offerCurrencyDoesNotMatchPaymentAccountCurrency"
                        />
                        <img
                            src="@/assets/img/notification-circle-outlined.svg"
                            class="add-new-expense-item__payment-input-notification"
                        />
                    </b-col>
                </b-row>

                <!-- Amount Paid in the offer currency -->
                <b-row class="add-new-expense-item__input--row" v-if="offerCurrencyDoesNotMatchPaymentAccountCurrency">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            required="true"
                            :floatingLabelText="amountPaidInOfferCurrencyLabelText"
                            className="add-new-expense-item__input--field"
                            inputContainerClass="add-new-expense-item"
                            :errors="addExpenseError.amountPaidInOfferCurrency"
                            @input="formatAndValidateAmountPaidInOfferCurrency"
                            :value="convertFigureToCurrency(form.amountPaidInOfferCurrency.amount)"
                            :disabled="conditionToDisableAmountPaidInOfferCurrency"
                        />
                        <img
                            src="@/assets/img/notification-circle-outlined.svg"
                            class="add-new-expense-item__payment-input-notification"
                        />
                    </b-col>
                </b-row>
            </template>

            <!-- Expense Balance and Balance Due Date -->
            <template v-if="showExpenseBalanceAndPaymentDueDateProperty">
                <!-- Balance -->
                <b-row class="add-new-expense-item__input--row" v-if="expenseBalance > 0">
                    <b-col class="p-0">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            className="add-new-expense-item__input--field"
                            inputContainerClass="add-new-expense-item"
                            disabled="true"
                            :value="convertFigureToCurrency(expenseBalance)"
                            :floatingLabelText="balanceLabelText"
                        />
                    </b-col>
                    <!-- Balance Due Date -->
                    <b-col class="p-0 ml-3">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            placeholder="Balance Due Date"
                            floatingLabelText="Balance Due Date"
                            @change="handleBalanceDueDateField"
                            :errors="addExpenseError.paymentDueDate"
                            :value="form.paymentDueDate"
                        />
                    </b-col>
                </b-row>
            </template>

            <template v-if="false">
                Exchange Rate {{ exchangeRate }} <br />

                Balance {{ calculateBalance() }}
            </template>

            <!-- Next Button -->
            <b-row class="align-items-center">
                <BasePrimaryButton
                    buttonText="Next"
                    className="add-new-expense-item__button"
                    :overRideButtonClass="true"
                    @button-clicked="handleNextClick"
                    :disabled="!expenseFormIsReadyForSubmission"
                />
            </b-row>
        </template>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';

import ExpenseModule from '@/store/modules/expense';
import DonationModule from '@/store/modules/donation';

import {
    ExpenseRequest,
    PaymentStatus,
    ExpenseSummary,
    ExpenseItemType,
    ExpenseTaxType,
    ExpenseRequestStatus,
    ExpenseWitholdingTaxTypes,
    VendorType,
} from '@/pages/Spending/Expense/types';
import { Vendor, MeasurementType, Status, Currency, RadioButtonOption, PaymentAccount } from '@/types';
import { DonationScheme } from '@/pages/Donations/types';

import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';
import UtilityMixin from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import { isEmpty } from '@/utils/formValidator';

const expenses = namespace('expense');
const vendors = namespace('vendor');
const donations = namespace('donation');

let expenseModule: ExpenseModule;
let donationsModule: DonationModule;

@Component({
    components: {
        CircularPlusSign,
    },
})
export default class AddExpense extends Mixins(ExpenseMixin, UtilityMixin, CurrencyMixins) {
    private showMeasurableExpenseInputForms = false;
    private form: ExpenseRequest = {
        name: '',
        unitCost: { currencyKey: 0, amount: 0 },
        amountPaidInOfferCurrency: { currencyKey: 0, amount: 0 },
        amountPaid: { currencyKey: 0, amount: 0 },
        quantity: 1,
        vendorKey: '',
        measurementTypeKey: '',
        withHoldingTaxType: '',
        notes: '',
        amountOwed: 0,
        paymentDueDate: '',
        paymentAccountKey: '',
        expenseItemTypeKey: '',
        discount: 0,
        quantityReceived: 0,
        transactionDate: '',
        supplyDueDate: '',
        attachments: [],
        donationSchemeKey: '',
    };
    private exchangeRate = 0;
    private radioButtonOptions: RadioButtonOption = {
        name: 'paymentStatus',
        values: [PaymentStatus.FULL, PaymentStatus.PART, PaymentStatus.NONE],
    };
    private paymentAccountCurrencyKey = 0;
    private paymentStatus = PaymentStatus.FULL;

    @Prop({ required: true }) readonly selectedExpenseItemType!: ExpenseItemType;
    @Prop({ required: true }) readonly selectedVendor!: Vendor;
    @Prop({ required: true }) readonly preliminaryExpenseForm!: ExpenseRequest;
    @Prop({ required: true }) readonly expenseSummary!: ExpenseSummary;
    @Prop({ required: true }) readonly allExpenses!: Array<ExpenseRequest>;

    @vendors.State
    public vendors!: Vendor[];

    @expenses.State
    public measurementTypes!: MeasurementType[];

    @expenses.State
    public taxTypes!: ExpenseTaxType[];

    @expenses.State
    public paymentAccounts!: PaymentAccount[];

    @expenses.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    @donations.State
    public donationSchemes!: Array<DonationScheme>;

    get measurementTypeValue(): string {
        const { measurementTypeKey } = this.form;

        if (measurementTypeKey) {
            return measurementTypeKey;
        }

        if (this.measurementTypes.length > 0) {
            return this.measurementTypes[0].key;
        }

        return 'None';
    }

    get requirementsAreStillLoading(): boolean {
        const { getExpenseMeasurementTypes, getExpenseTaxTypes, getExpensePaymentAccounts } = this.expenseRequestStatus;

        return (
            getExpenseMeasurementTypes === Status.LOADING ||
            getExpenseTaxTypes === Status.LOADING ||
            getExpensePaymentAccounts === Status.LOADING
        );
    }

    get measurableExpenseInputFormsLabelText(): string {
        return this.showMeasurableExpenseInputForms ? 'Unit Cost' : 'Cost';
    }

    get fullOrPartPaymentChosen(): boolean {
        return this.paymentStatus !== PaymentStatus.NONE;
    }

    get expenseIsNotFullyPaid(): boolean {
        return this.expenseBalance > 0;
    }

    get fullPaymentChosen(): boolean {
        return this.paymentStatus === PaymentStatus.FULL;
    }

    get noPaymentChosen(): boolean {
        return this.paymentStatus === PaymentStatus.NONE;
    }

    get expenseSpecifiesWithholdingTax(): boolean {
        return this.form.withHoldingTaxType !== 'None';
    }

    get balanceLabelText(): string {
        if (this.offerCurrencyDoesNotMatchPaymentAccountCurrency) {
            return `Balance (${this.offerCurrency.currencySymbol})`;
        }
        return `Balance (${this.paymentAccountCurrency.currencySymbol})`;
    }

    get expenseRequiresVendor(): boolean {
        // if the expense is not fully paid for
        // if the tax is specified
        const { expenseIsNotFullyPaid, expenseSpecifiesWithholdingTax } = this;

        return expenseIsNotFullyPaid || expenseSpecifiesWithholdingTax;
    }

    get showExpenseBalanceAndPaymentDueDateProperty(): boolean {
        const {
            offerCurrencyDoesNotMatchPaymentAccountCurrency,
            noPaymentChosen,
            form: { amountPaidInOfferCurrency, amountPaid },
        } = this;

        // if no amount has been paid, we still want the user to see the balance anyways
        if (noPaymentChosen) {
            return true;
        }

        if (offerCurrencyDoesNotMatchPaymentAccountCurrency) {
            // check if the user has provided the amount paid and amount paid in offer currency
            if (amountPaidInOfferCurrency.amount < 1 || amountPaid.amount < 1) {
                return false;
            }
        }
        return this.expenseBalance > 0;
    }

    get offerCurrency(): Currency {
        const {
            unitCost: { currencyKey },
        } = this.form;

        if (Number(currencyKey) === 0) {
            // we should return the business default currency symbol here
            return { currencySymbol: '', currencyKey: 0, currencyName: '', currencyCode: '' };
        }

        const currencyObject = this.getCurrencyObjectFromCurrencyKey(currencyKey);

        return currencyObject;
    }

    get paymentAccountCurrency(): Currency {
        const { paymentAccountCurrencyKey } = this;

        if (Number(paymentAccountCurrencyKey) === 0) {
            // we should return the business default currency symbol here
            return { currencySymbol: '', currencyKey: 0, currencyName: '', currencyCode: '' };
        }

        const currencyObject = this.getCurrencyObjectFromCurrencyKey(paymentAccountCurrencyKey);
        return currencyObject;
    }

    get amountPaidLabelText(): string {
        // get the current state of the currency
        const { paymentAccountCurrency } = this;

        if (!paymentAccountCurrency) {
            return 'Amount Paid';
        }

        return `Amount Paid (${paymentAccountCurrency.currencySymbol})`;
    }

    get amountPaidInOfferCurrencyLabelText(): string {
        const {
            offerCurrency: { currencyKey },
        } = this;

        if (!currencyKey) {
            return 'Amount Paid';
        }

        return `Amount Paid (${this.offerCurrency.currencySymbol})`;
    }

    get offerCurrencyDoesNotMatchPaymentAccountCurrency(): boolean {
        const { unitCost } = this.form;

        return unitCost.currencyKey !== this.paymentAccountCurrencyKey;
    }

    get expenseBalance(): number {
        if (this.paymentStatus === PaymentStatus.FULL) {
            return 0;
        }

        return this.calculateBalance();
    }

    get expenseIsMeasurable(): boolean {
        return this.showMeasurableExpenseInputForms;
    }

    get expenseMeasurementUnit(): string {
        const { measurementTypeKey } = this.form;

        if (this.expenseIsMeasurable) {
            const measurementTypeChosen = this.getMeasurementType(measurementTypeKey);
            if (measurementTypeChosen) {
                return measurementTypeChosen.name;
            }
        }
        return '';
    }

    get conditionToDisableAmountPaidInOfferCurrency(): boolean {
        return this.fullPaymentChosen && this.offerCurrencyDoesNotMatchPaymentAccountCurrency;
    }

    get totalCostOfExpense(): number {
        const {
            quantity,
            unitCost: { amount },
        } = this.form;

        return quantity === 0 || !quantity ? amount : amount * quantity;
    }

    get netCost(): number {
        const { withHoldingTaxType } = this.form;

        if (withHoldingTaxType === ExpenseWitholdingTaxTypes.INCLUSIVE) {
            return this.totalCostOfExpense - this.withholdingAmount;
        }

        // if (withHoldingTaxType === ExpenseWitholdingTaxTypes.EXCLUSIVE) {
        //     return this.totalCostOfExpense + this.withholdingAmount;
        // }

        return this.totalCostOfExpense;
    }

    get withholdingAmount(): number {
        const { withHoldingTaxType } = this.form;

        if (isEmpty(withHoldingTaxType) || withHoldingTaxType === ExpenseWitholdingTaxTypes.NONE) return 0;

        return this.calculateWitholdingTax();
    }

    get taxPercentage(): number {
        const { withHoldingTaxType } = this.form;

        if (isEmpty(withHoldingTaxType) || withHoldingTaxType === ExpenseWitholdingTaxTypes.NONE) return 0;

        if (this.selectedVendor.vendorType === VendorType.BUSINESS) {
            return 5;
        }

        return 10;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    @Watch('selectedVendor.vendorKey')
    setSelectedVendor(vendorKey: string) {
        this.$set(this.form, 'vendorKey', vendorKey);
    }

    @Watch('requirementsAreStillLoading')
    setInitialValuesOfExpenseForm() {
        if (this.requirementsAreStillLoading) return;
        // set the values of payment account
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const defaultOption: any = this.updatedPaymentAccounts.length > 0 ? this.updatedPaymentAccounts[0] : '';

        if (defaultOption) {
            this.$set(this.form, 'paymentAccountKey', defaultOption.paymentAccountKey);
            this.$set(this.form, 'amountPaid', { ...this.form.amountPaid, currencyKey: defaultOption.currencyKey });
            this.paymentAccountCurrencyKey = defaultOption.currencyKey;
        }

        // set the values of tax account
        const defaultTaxOption = this.taxTypes.length > 0 ? this.taxTypes[0].name : '';
        this.$nextTick(() => {
            this.$set(this.form, 'withHoldingTaxType', defaultTaxOption);
        });
    }

    private getMeasurementType(key: string) {
        return this.measurementTypes.find((measurementType: MeasurementType) => measurementType.key === key);
    }

    private calculateWitholdingTax(): number {
        const {
            form: { withHoldingTaxType },
            totalCostOfExpense,
        } = this;

        if (withHoldingTaxType === ExpenseWitholdingTaxTypes.INCLUSIVE) {
            return Number(this.roundN((totalCostOfExpense * this.taxPercentage) / 100, 2));
        }

        const fullAmount = totalCostOfExpense / (1 - this.taxPercentage / 100);

        return Number(this.roundN((fullAmount * this.taxPercentage) / 100, 2));
    }

    private handleQuantityInput(quantity: number) {
        if (!quantity || quantity === 0) {
            this.$set(this.form, 'quantity', '');
        } else {
            this.$set(this.form, 'quantity', quantity);
        }

        this.$nextTick(() => {
            if (this.fullPaymentChosen) {
                this.setAmountPaidValue(this.netCost);
            }

            this.validateAmountInput('quantity', Number(this.form.quantity), this.addExpenseError);
        });
    }

    private handleOfferCurrencySelection(currencyKeyChosen: number) {
        this.form.unitCost.currencyKey = currencyKeyChosen;
        this.validateExpenseCurrency(currencyKeyChosen.toString(), 'offerCurrency', this.addExpenseError);
        this.setValuesForExpenseAmount();
    }

    private handleTaxTypeSelection(withHoldingTaxType: string) {
        this.setValuesForExpenseAmount();

        this.$nextTick(() => {
            this.validateEmptyField(
                'withHoldingTaxType',
                withHoldingTaxType,
                this.addExpenseError,
                'This is a required field',
            );
        });
    }

    private handleBalanceDueDateField(paymentDueDate: string) {
        this.form.paymentDueDate = paymentDueDate;

        this.$nextTick(() => {
            this.validatePaymentDueDate();
        });
    }

    private validatePaymentDueDate() {
        if (this.expenseBalance > 0) {
            this.validateEmptyField(
                'paymentDueDate',
                this.form.paymentDueDate,
                this.addExpenseError,
                'This is a required field',
            );

            if (!this.addExpenseError.paymentDueDate) {
                if (!this.isDateOnOrAfterToday(this.form.paymentDueDate)) {
                    this.addExpenseError.paymentDueDate = 'This cannot be less than today';
                    return;
                }
                this.addExpenseError.paymentDueDate = '';
            }

            return;
        }

        this.addExpenseError.paymentDueDate = '';
    }

    private setValuesForExpenseAmount() {
        // check if payment was made in full
        if (this.fullPaymentChosen) {
            // ** check if the currencies match
            this.$nextTick(() => {
                if (this.offerCurrencyDoesNotMatchPaymentAccountCurrency) {
                    this.setAmountPaidInOfferCurrencyValue(this.netCost);
                    this.setAmountPaidValue(0);
                } else {
                    this.setAmountPaidInOfferCurrencyValue(this.netCost);
                    this.setAmountPaidValue(this.netCost);
                }
                this.validateAmountPaid();
            });
            return;
        }

        // if payment payment was made or no payment has been made
        if (this.noPaymentChosen) {
            this.setAllAmountPaidValuesToZero();
            this.addExpenseError.amountPaid = '';
            return;
        }
    }

    private setAmountPaidValue(amountPaid: number) {
        this.form.amountPaid = Object.assign({}, this.form.amountPaid, {
            ...this.form.amountPaid,
            amount: amountPaid,
        });

        if (!this.offerCurrencyDoesNotMatchPaymentAccountCurrency) {
            this.setAmountPaidInOfferCurrencyValue(amountPaid);
        }
    }

    private setAmountPaidInOfferCurrencyValue(amountPaidInOfferCurrency: number) {
        this.form.amountPaidInOfferCurrency = Object.assign({}, this.form.amountPaidInOfferCurrency, {
            ...this.form.amountPaidInOfferCurrency,
            amount: amountPaidInOfferCurrency,
        });
    }

    private setAllAmountPaidValuesToZero() {
        this.setAmountPaidValue(0);
        this.setAmountPaidInOfferCurrencyValue(0);
    }

    private formatAndValidateExpenseUnitCost(costInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(costInput);

        this.form.unitCost = Object.assign({}, this.form.unitCost, {
            ...this.form.unitCost,
            amount: inputToNumber,
        });

        this.$nextTick(() => {
            // use the quantity to calculate and set the value of the amount paid
            if (this.fullPaymentChosen) {
                this.setAmountPaidValue(this.netCost);
            }
            // we would have to debounce this validation function
            this.validateAmountInput('unitCost', inputToNumber, this.addExpenseError);
        });
    }

    private formatAndValidateAmountPaid(costInput: string) {
        const amountPaidNum = this.convertFormattedFiguresToNumber(costInput);
        this.setAmountPaidValue(amountPaidNum);

        this.$nextTick(() => {
            this.validateAmountPaid();
            this.validatePaymentDueDate();
        });
    }

    @Watch('netCost')
    private processNewNetCost() {
        this.$nextTick(() => {
            this.validateAmountPaid();
        });
    }

    private validateAmountPaid() {
        const {
            amountPaid: { amount },
            paymentAccountKey,
        } = this.form;

        if (amount < 0) {
            this.addExpenseError.amountPaid = 'Cannot be less than 0';
            return;
        }

        if (!this.offerCurrencyDoesNotMatchPaymentAccountCurrency && amount > this.netCost) {
            this.addExpenseError.amountPaid = 'Cannot be more than the Net Cost';
            return;
        }

        // get the account balance of the payment account key...
        const account = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );

        if (account) {
            const totalAmountPaidForSelectedPaymentAccountKey = this.allExpenses
                .filter((expense: ExpenseRequest) => expense.paymentAccountKey === paymentAccountKey)
                .reduce((currentSum: number, expense: ExpenseRequest) => expense.amountPaid.amount + currentSum, 0);

            // if it is in edit mode, then the amount difference should be checked, since the previous amount has been removed from the account already
            // get the previous value and find the difference, use the difference as the amount
            let amountToBeUsedForCheck = amount;
            const { amountPaid: preliminaryAmountPaid } = this.preliminaryExpenseForm;

            if (preliminaryAmountPaid.amount) {
                amountToBeUsedForCheck = Math.abs(Number(preliminaryAmountPaid.amount - amount));
            }

            // get the current account balance of the account factoring in all expense that have been done on the payment account

            const totalAmountPaid = totalAmountPaidForSelectedPaymentAccountKey + amountToBeUsedForCheck;

            if (totalAmountPaid > account.accountBalance) {
                this.addExpenseError.paymentAccountKey = 'Insufficient Balance';
                return;
            }

            this.addExpenseError.paymentAccountKey = '';
        }

        this.addExpenseError.amountPaid = '';
    }

    private formatAndValidateAmountPaidInOfferCurrency(costInput: string) {
        const inputToNumber = this.convertFormattedFiguresToNumber(costInput);

        this.form.amountPaidInOfferCurrency = Object.assign({}, this.form.amountPaidInOfferCurrency, {
            ...this.form.amountPaidInOfferCurrency,
            amount: inputToNumber,
        });
        // we would have to debounce this validation function
        this.$nextTick(() => {
            this.validateAmountPaidInOfferCurrency();
            this.validatePaymentDueDate();
        });
    }

    private validateAmountPaidInOfferCurrency() {
        const { amount } = this.form.amountPaidInOfferCurrency;
        if (amount < 0) {
            this.addExpenseError.amountPaidInOfferCurrency = 'Cannot be less than 0';
            return;
        }
        if (amount > this.netCost) {
            this.addExpenseError.amountPaidInOfferCurrency = 'Cannot be more than the Net Cost';
            return;
        }

        this.addExpenseError.amountPaidInOfferCurrency = '';
    }

    private handlePaymentAccountSelection(paymentAccountKey: string) {
        // we need the payment account key and the payment account currency key
        const paymentAccount = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );

        if (!paymentAccount) {
            return;
        }

        this.$nextTick(() => {
            this.validateEmptyField(
                'paymentAccountKey',
                paymentAccountKey,
                this.addExpenseError,
                'This is a required field',
            );

            this.validateAmountPaid();
        });

        // set the right values for the payment account keys
        // if the offer and payment account currencies match, then the amountPaid currency key should be updated with the currency key picked, if not the amountPaid in offer currency key should be updated

        if (this.offerCurrencyDoesNotMatchPaymentAccountCurrency) {
            this.form.amountPaidInOfferCurrency.currencyKey = paymentAccount.currencyKey;
        } else {
            this.form.amountPaid.currencyKey = paymentAccount.currencyKey;
        }

        this.$set(this.form, 'paymentAccountKey', paymentAccount.paymentAccountKey);
        this.paymentAccountCurrencyKey = paymentAccount.currencyKey;
    }

    private handleDonationSchemeSelection(donationSchemeKey: string) {
        this.$nextTick(() => {
            this.validateEmptyField(
                'donationSchemeKey',
                donationSchemeKey,
                this.addExpenseError,
                'This is a required field',
            );

            this.validateAmountPaid();
        });

        this.$set(this.form, 'donationSchemeKey', donationSchemeKey);
    }

    private calculateBalance(): number {
        // if the offer currency is not the same as the amount paid
        if (this.offerCurrencyDoesNotMatchPaymentAccountCurrency) {
            return this.calculateBalanceForMultipleCurrencies();
        }

        const {
            netCost,
            form: { amountPaid },
        } = this;

        // if the offerCurrency is the same as payment currency
        const remainingBalance = netCost - amountPaid.amount;
        return remainingBalance < 0 ? 0 : remainingBalance;
    }

    private calculateBalanceForMultipleCurrencies(): number {
        const {
            form: { amountPaid, amountPaidInOfferCurrency },
            totalCostOfExpense,
            noPaymentChosen,
        } = this;

        if (noPaymentChosen) {
            return totalCostOfExpense;
        }

        const exchangeRate: number = amountPaid.amount / amountPaidInOfferCurrency.amount;

        if (isNaN(exchangeRate)) {
            return 0;
        }

        this.exchangeRate = exchangeRate;
        //keep the exchange rate to display it later

        const remainingBalance = totalCostOfExpense - amountPaidInOfferCurrency.amount;

        return remainingBalance < 0 ? 0 : remainingBalance;
    }

    private setPaymentStatus(paymentStatus: string) {
        this.$set(this, 'paymentStatus', paymentStatus);
        this.addExpenseError.paymentDueDate = '';
        this.setValuesForExpenseAmount();
    }

    private handleMeasurementTypeSelection(measurementTypeKey: string) {
        // we want to use this to hide the fields for an expense that is not measurable
        if (measurementTypeKey === 'none') {
            this.showMeasurableExpenseInputForms = false;
            this.form.quantity = 1;

            // set the amount paid here again so we can force validation
            this.validateAmountPaid();
        } else {
            this.setmeasurementTypeKey(measurementTypeKey);

            this.$nextTick(() => {
                this.validateEmptyField(
                    'measurementTypeKey',
                    this.form.measurementTypeKey,
                    this.addExpenseError,
                    'This is a required field',
                );
            });
        }
    }

    private setmeasurementTypeKey(measurementTypeKey: string) {
        this.$set(this.form, 'measurementTypeKey', measurementTypeKey);
    }

    private setShowMeasurableExpenseInputs() {
        this.showMeasurableExpenseInputForms = true;

        this.$nextTick(() => {
            const { measurementTypeKey } = this.form;
            if (!measurementTypeKey) {
                const defaultMeasurementType: MeasurementType = this.measurementTypes.filter(
                    (measurementType: MeasurementType) => measurementType.name.toLowerCase() === 'unit',
                )[0];
                this.setmeasurementTypeKey(defaultMeasurementType?.key);
            }
        });
    }

    private validateAllFields() {
        const {
            form: { withHoldingTaxType, unitCost, quantity, paymentAccountKey, donationSchemeKey },
            expenseIsMeasurable,
        } = this;

        if (expenseIsMeasurable) {
            this.validateEmptyField(
                'measurementTypeKey',
                this.form.measurementTypeKey,
                this.addExpenseError,
                'This is a required field',
            );
        }

        this.validatePaymentDueDate();

        this.validateEmptyField(
            'withHoldingTaxType',
            withHoldingTaxType,
            this.addExpenseError,
            'This is a required field',
        );

        this.validateAmountInput('unitCost', unitCost.amount, this.addExpenseError);
        this.validateAmountInput('quantity', quantity, this.addExpenseError);

        this.validateAmountPaid();
        this.validateAmountPaidInOfferCurrency();

        // this.validateExpenseAmount(amountPaid.amount, 'amountPaid');
        // this.validateExpenseAmount(amountPaidInOfferCurrency.amount, 'amountPaidInOfferCurrency');

        this.validateEmptyField(
            'paymentAccountKey',
            paymentAccountKey,
            this.addExpenseError,
            'This is a required field',
        );

        if (this.$root.businessIsANgo) {
            this.validateEmptyField(
                'donationSchemeKey',
                donationSchemeKey || '',
                this.addExpenseError,
                'This is a required field',
            );
        }
    }

    private handleNextClick() {
        const {
            form: { unitCost, quantity, amountPaid },
            expenseMeasurementUnit,
            netCost,
            withholdingAmount,
            taxPercentage,
        } = this;

        // validate all fields
        let amountPaidInTotal = amountPaid.amount;

        const quantityForComputation = quantity <= 0 ? 1 : quantity;

        this.validateAllFields();

        if (!this.expenseFormIsReadyForSubmission) return;

        if (this.fullPaymentChosen) {
            amountPaidInTotal = this.netCost;
        }

        const bank = this.updatedPaymentAccounts.find(
            (account: PaymentAccount) => account.paymentAccountKey === this.form.paymentAccountKey,
        );

        let bankObject = {
            accountName: '',
            accountCurrencySymbol: '',
        };
        if (bank) {
            bankObject = {
                accountName: bank.displayName,
                accountCurrencySymbol: this.getCurrencyObjectFromCurrencyKey(bank.currencyKey).currencySymbol,
            };
        }

        // we need the bank name and currency of payment
        // we need the offer currency symbol and amount
        const expenseSummary: ExpenseSummary = {
            itemName: this.form.name,
            unitCost: unitCost.amount,
            isMeasurable: this.expenseIsMeasurable,
            quantity: Number(quantityForComputation),
            withholdingTaxPercentage: taxPercentage,
            amountPaid: amountPaidInTotal,
            bankDetails: bankObject,
            vendorName: this.expenseSummary.vendorName || this.selectedVendor.name,
            measurementUnit: expenseMeasurementUnit,
            balance: this.expenseBalance,
            netCost,
            withholdingAmount,
            expenseCurrency: this.offerCurrency.currencySymbol,
            exchangeRate: this.exchangeRate,
            taxType: this.form.withHoldingTaxType,
            paymentStatus: this.paymentStatus,
        };

        this.$emit('set-expense-summary-properties', expenseSummary);

        // we keep this here if it will be needed during route changes - usually if the user presses the back button at any point within the state of the application
        this.$emit('keep-preliminary-expense-form-state', { ...this.form, quantity: Number(quantityForComputation) });

        // If the expense requires a vendor, then we need to communicate that to the parent component
        if (this.expenseRequiresVendor) {
            if (isEmpty(this.form.vendorKey)) {
                this.$emit('show-vendor-selection-page');
                return;
            }
        }

        this.$emit('show-expense-details-page');
    }

    private preloadExpenseForm() {
        // if the properties of the preliminary form are set, then the form is being edited
        const { preliminaryExpenseForm } = this;

        if (preliminaryExpenseForm.name) {
            this.form = Object.assign({}, this.form, { ...this.preliminaryExpenseForm });

            // we need to set the measurement type if it exists
            if (preliminaryExpenseForm.measurementTypeKey) {
                const measurementTypeKey = preliminaryExpenseForm.measurementTypeKey;
                const measurementType = this.getMeasurementType(measurementTypeKey);

                if (measurementType) {
                    this.setShowMeasurableExpenseInputs();
                    this.setmeasurementTypeKey(measurementTypeKey);
                }
            }

            const { paymentStatus } = this.expenseSummary;

            if (paymentStatus === PaymentStatus.PART) {
                this.paymentStatus = PaymentStatus.PART;
            } else if (paymentStatus === PaymentStatus.NONE) {
                this.paymentStatus = PaymentStatus.NONE;
            }

            return;
        }

        // preloading for fresh expense recording
        const { isMeasurable, lastTransactionAmount, expenseItemTypeKey, name } = this.selectedExpenseItemType;
        const { vendorKey } = this.selectedVendor;

        let tCurKey = lastTransactionAmount.currencyKey;

        if (!this.isValidCurrencyKey(tCurKey)) {
            tCurKey = this.defaultCurrency.currencyKey;
        }

        this.$set(this.form, 'unitCost', { ...lastTransactionAmount, currencyKey: tCurKey });
        this.$set(this.form, 'expenseItemTypeKey', expenseItemTypeKey);
        this.$set(this.form, 'name', name);
        if (vendorKey) {
            this.$set(this.form, 'vendorKey', this.selectedVendor.vendorKey);
        }
        this.showMeasurableExpenseInputForms = isMeasurable;
        this.$nextTick(() => {
            this.setValuesForExpenseAmount();
        });
    }

    private isValidCurrencyKey(currencyKey: string | number) {
        if (!currencyKey) return false;

        if (!Number(currencyKey)) return false;

        return true;
    }

    async mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);
        donationsModule = getModule(DonationModule, this.$store);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requests: Array<any> = [
            expenseModule.getMeasurementTypes(),
            expenseModule.getTaxTypes(),
            expenseModule.getPaymentAccounts(),
        ];

        if (this.$root.businessIsANgo) {
            requests.push(donationsModule.getDonationSchemes());
        }

        await Promise.all([...requests]);

        // we need to preload the form with some details *cost, isMeasurable properties
        this.preloadExpenseForm();
    }
}
</script>
