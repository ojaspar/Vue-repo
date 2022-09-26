/*eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { InputValidation, PaymentAccount } from '@/types';
import {
    ExpenseDetails,
    ExpenseItemTypeRequest,
    ExpenseRequestStatus,
    ManageExpenseDetails,
} from '@/pages/Spending/Expense/types';

import { isEmpty, isEmail, isPhoneNumber } from '@/utils/formValidator';

import ValidationMixin from '@/mixins/validation';
import UtilityMixin from '@/mixins/Utility';

import ExpenseModule from '@/store/modules/expense';

const addExpenseItemForm: InputValidation = {
    name: '',
    description: '',
    expenseGroupKey: '',
    estimatedCost: '',
    currencyKey: '',
};

const addExpenseForm: InputValidation = {
    name: '',
    unitCost: '',
    totalCost: '',
    amountPaid: '',
    amountPaidInOfferCurrency: '',
    quantity: '',
    measurementTypeKey: '',
    withHoldingTaxType: '',
    offerCurrency: '',
    notes: '',
    donationSchemeKey: '',
    paymentAccountKey: '',
    paymentDueDate: '',
    paymentStatus: '',
};

const addVendorForm: InputValidation = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    note: '',
    vendorTypeName: '',
};

const expenseDeliveryForm = {
    newDelivery: '',
    deliveryDate: '',
    outstandingDueDate: '',
};

const expense = namespace('expense');
let expenseModule: ExpenseModule;

@Component
export default class ExpenseMixin extends Mixins(ValidationMixin, UtilityMixin) {
    public addExpenseItemError = { ...addExpenseItemForm };
    public addExpenseError = { ...addExpenseForm };
    private addVendorError = { ...addVendorForm };

    @expense.State
    public expenseDetails!: ExpenseDetails;

    @expense.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    @expense.State
    public paymentAccounts!: Array<PaymentAccount>;

    @expense.State
    public expenseFullDetails!: ManageExpenseDetails;

    @expense.State
    public errorMessage!: string;

    get expenseItemFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addExpenseItemError);
    }

    get expensesModule() {
        return expenseModule;
    }

    get vendorName(): string {
        const { vendor } = this.expenseDetails;

        return vendor?.name ?? 'Unnamed Vendor';
    }

    get thereIsBalanceToBePaid(): boolean {
        return this.expenseDetails.balance.amount > 0;
    }

    get expenseHasVendor(): boolean {
        return this.vendorName !== '';
    }

    get hasVatAndWht(): boolean {
        if (!this.expenseDetails.vatAmount) return false;
        return this.expenseDetails.vatAmount?.amount > 0 && this.expenseDetails.withholdingTaxAmount?.amount > 0;
    }

    get totalTaxAmount(): number {
        const { withholdingTaxAmount, vatAmount } = this.expenseDetails;
        if (vatAmount) {
            const totalTax = withholdingTaxAmount.amount - vatAmount?.amount;
            return totalTax;
        }
        return withholdingTaxAmount.amount;
    }

    get netAmount(): string {
        const { totalTaxAmount, expenseDetails } = this;
        const amount = expenseDetails.totalCost.amount + totalTaxAmount;
        const { currencyKey } = expenseDetails.totalCost;
        return this.$options.filters.amountWithCurrency({ amount, currencyKey });
    }

    get totalTax(): string {
        const { withholdingTaxAmount } = this.expenseDetails;
        const { totalTaxAmount } = this;
        const { currencyKey } = withholdingTaxAmount;
        const amount = Math.abs(totalTaxAmount);
        const formattedTaxAmount = this.$options.filters.amountWithCurrency({ amount, currencyKey });
        if (totalTaxAmount >= 0) return formattedTaxAmount;
        return `(${formattedTaxAmount})`;
    }

    get disableAddPaymentButton(): boolean {
        const { thereIsBalanceToBePaid, requestsInProgress } = this;
        return !thereIsBalanceToBePaid || requestsInProgress;
    }

    get requestsInProgress(): boolean {
        const { expenseRequestStatus } = this;
        return expenseRequestStatus.getExpenseDetails === 'LOADING' || expenseRequestStatus.addPayment === 'LOADING';
    }

    public addPayment() {
        const { amount } = this.expenseDetails.balance;
        if (amount) this.$emit('add-payment');
    }

    public validateExpenseName(expenseName: string): void {
        if (isEmpty(expenseName)) {
            this.addExpenseItemError['name'] = 'This field is required';
            return;
        }
        if (expenseName.length > 50) {
            this.addExpenseItemError['name'] = 'The maximum number of characters is 50';
            return;
        }

        this.addExpenseItemError['name'] = '';
        return;
    }

    public validateExpenseDescription(expenseDescription: string): void {
        if (isEmpty(expenseDescription)) {
            this.addExpenseItemError['description'] = '';
            return;
        }
        if (expenseDescription.length > 200) {
            this.addExpenseItemError['description'] = 'The maximum number of characters is 200';
            return;
        }
        this.addExpenseItemError['description'] = '';
        return;
    }

    public validateExpenseGroupKey(expenseGroupKey: string): void {
        if (isEmpty(expenseGroupKey)) {
            this.addExpenseItemError['expenseGroupKey'] = 'This field is required';
            return;
        }

        this.addExpenseItemError['expenseGroupKey'] = '';
        return;
    }

    public validateExpenseCost(cost: number): void {
        if (isEmpty(cost.toString())) {
            this.addExpenseItemError['estimatedCost'] = 'This field is required';
            return;
        }

        if (cost < 1) {
            this.addExpenseItemError['estimatedCost'] = 'The miminum amount is 1';
            return;
        }

        this.addExpenseItemError['estimatedCost'] = '';
        return;
    }

    public validateExpenseCurrency(currencyKey: string, field: string, errors: InputValidation): void {
        if (isEmpty(currencyKey)) {
            errors[field] = 'This field is required';
            return;
        }

        errors[field] = '';
        return;
    }

    public validateAllExpenseItemFields(form: ExpenseItemTypeRequest, editMode = false) {
        const {
            name,
            description,
            expenseGroupKey,
            estimatedCost: { amount, currencyKey },
        } = form;

        this.validateExpenseName(name);
        this.validateExpenseDescription(description);

        if (editMode) return;

        this.validateExpenseGroupKey(expenseGroupKey);
        this.validateEmptyField(
            'currencyKey',
            currencyKey.toString(),
            this.addExpenseItemError,
            'This is a required field',
        );
        return;
    }

    public validateAmountInput(field: string, value: number, error: InputValidation, message = 'Invalid'): void {
        if (!value) {
            error[field] = message;
            return;
        }

        error[field] = '';
        return;
    }

    // Add Expense Form
    public validateExpenseAmount(value: number, field: string): void {
        if (value < 0) {
            this.addExpenseError[field] = 'This value must be at least 0';
            return;
        }

        this.addExpenseError[field] = '';
        return;
    }

    public validateExpenseVendor(vendorKey: string): void {
        if (isEmpty(vendorKey)) {
            this.addExpenseError['vendorKey'] = 'Please select a vendor';
            return;
        }

        this.addExpenseError['vendorKey'] = '';
        return;
    }

    public get expenseFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addExpenseError);
    }

    public clearAddExpenseForm(form: InputValidation) {
        Object.keys(form).forEach((field: string) => {
            form[field] = '';

            if (field === 'amountPaid') {
                form[field] = '0';
            }
        });
    }

    public clearForm(form: InputValidation) {
        Object.keys(form).forEach((field: string) => (form[field] = ''));
    }

    // add vendor form
    public validateVendorName(name: string) {
        if (isEmpty(name)) {
            this.addVendorError['name'] = 'Please provide vendor name';
            return;
        }

        if (name.length > 25) {
            this.addVendorError['name'] = 'Please keep this between 1-25 characters';
            return;
        }

        if (name.split(' ').length > 3) {
            this.addVendorError['name'] = 'Maximum of 3 names allowed';
            return;
        }

        this.addVendorError['name'] = '';
        return;
    }

    public validateVendorEmail(email: string) {
        if (email.length === 0) {
            this.addVendorError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.addVendorError['email'] = 'Please provide a valid email address';
            return;
        }

        this.addVendorError['email'] = '';
        return;
    }

    public validateVendorPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length > 0) {
            if (!isPhoneNumber(phoneNumber)) {
                this.addVendorError['phoneNumber'] = 'Please provide a valid phone number';
                return;
            }
        }

        this.addVendorError['phoneNumber'] = '';
        return;
    }

    public validateVendorAddress(address: string): void {
        if (isEmpty(address)) {
            this.addVendorError['address'] = 'Please provide vendor address';
            return;
        }

        this.addVendorError['address'] = '';
        return;
    }

    public validateVendorType(type: string): void {
        if (isEmpty(type)) {
            this.addVendorError['vendorTypeName'] = 'Please select vendor type';
            return;
        }

        this.addVendorError['vendorTypeName'] = '';
        return;
    }

    public validateAddVendorForm(form: {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
        note: string;
        vendorTypeName: string;
    }) {
        const { name, email, phoneNumber, vendorTypeName } = form;

        this.validateVendorName(name);
        this.validateVendorEmail(email);
        this.validateVendorPhoneNumber(phoneNumber);
        this.validateVendorType(vendorTypeName);
    }

    public get addVendorFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addVendorError);
    }

    public calculateDeliveryStatusTextClass(
        baseClass: string,
        { quantityReceived, quantity }: ExpenseDetails,
    ): { deliveryStatus: string; cssClass: string } {
        let deliveryStatusTextClass = '';

        const notDelivered = quantityReceived === 0;
        const partialDelivery = quantityReceived !== 0 && quantityReceived < quantity;

        if (notDelivered) {
            deliveryStatusTextClass = `${baseClass}--red`;
            return {
                deliveryStatus: 'Not Delivered',
                cssClass: deliveryStatusTextClass,
            };
        }

        if (partialDelivery) {
            deliveryStatusTextClass = `${baseClass}--yellow`;
            return {
                deliveryStatus: 'Partial Delivery',
                cssClass: deliveryStatusTextClass,
            };
        }

        // since full delivery is the only remaining option
        deliveryStatusTextClass = `${baseClass}--green`;
        return {
            deliveryStatus: 'Delivered',
            cssClass: deliveryStatusTextClass,
        };
    }

    public itemStillHasOutstandingDelivery({ quantity, quantityReceived }: ExpenseDetails): boolean {
        return quantity !== quantityReceived;
    }

    public deliveryStatus(item: ExpenseDetails): { cssClass: string; deliveryStatus: string } {
        return this.calculateDeliveryStatusTextClass('p-0 ms-tablet-plus-index__supply-status', item);
    }

    public moreActions = [
        { name: 'Duplicate Transaction', event: 'duplicate-transaction' },
        { name: 'Edit Initial Expense', event: 'edit-initial-transaction' },
        { name: 'Cancel Expense', event: 'cancel-expense' },
    ];

    public editInitialTransaction() {
        const { expenseKey } = this.$route.params;
        this.$router.push({ name: 'Edit-Previous-Expense', params: { expenseKey } });
    }

    public duplicateTransaction() {
        const { expenseKey } = this.$route.params;
        this.$router.push({ name: 'Duplicate-Expense', params: { expenseKey } });
    }

    //Epense Delivery Form Validation

    private deliveryFormError = { ...expenseDeliveryForm };

    public generalFormError = '';

    public setGeneralFormError(errorMessage: string) {
        this.generalFormError = errorMessage;
    }

    public validateExpenseNewDelivery(newDelivery: string, outstandingQuantity: number): void {
        if (isEmpty(newDelivery)) {
            this.deliveryFormError['newDelivery'] = 'Required field';
            this.setGeneralFormError('Please supply the delivered quantity');
            return;
        }

        const deliveredQuantity = this.convertFormattedCurrencyToNumber(newDelivery);

        if (deliveredQuantity == 0) {
            this.deliveryFormError['newDelivery'] = 'Invalid input';
            this.setGeneralFormError('Delivered quantity must be greater than 0');
            return;
        }

        if (deliveredQuantity > outstandingQuantity) {
            this.deliveryFormError['newDelivery'] = 'Invalid input';
            this.setGeneralFormError('Delivered quantity cannot exceed outstanding quantity');
            return;
        }

        this.deliveryFormError['newDelivery'] = '';
        this.setGeneralFormError('');
        return;
    }

    public validateExpenseDeliveryDate(deliveryDate: string) {
        if (isEmpty(deliveryDate)) {
            this.deliveryFormError['deliveryDate'] = 'Required field';
            this.setGeneralFormError('Please supply the delivery date');
            return;
        }

        this.deliveryFormError['deliveryDate'] = '';
        this.setGeneralFormError('');
    }

    public validateOutstandingDeliveryDate(deliveryDate: string, outstandingQuantity: string) {
        const outstanding = this.convertFormattedCurrencyToNumber(outstandingQuantity);
        if (outstanding == 0) {
            this.deliveryFormError['outstandingDueDate'] = '';
            this.setGeneralFormError('');
            return;
        }
        if (isEmpty(deliveryDate)) {
            this.deliveryFormError['outstandingDueDate'] = 'Required field';
            this.setGeneralFormError('Please supply the outstanding delivery date');
            return;
        }

        this.deliveryFormError['outstandingDueDate'] = '';
        this.setGeneralFormError('');
    }

    get deliveryFormIsValidated() {
        return !this.formHasError(this.deliveryFormError);
    }

    created() {
        expenseModule = getModule(ExpenseModule, this.$store);
    }
}
