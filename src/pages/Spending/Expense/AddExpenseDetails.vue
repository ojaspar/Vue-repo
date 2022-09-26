<template>
    <div>
        <!-- transactionDate text input -->
        <BaseDateFieldWithBorderAndFloatingLabel
            inputContainerClass="add-expense-details__transaction-date-container"
            floatingLabelText="Transaction Date"
            floatingLabelClass="add-expense-details__select-label"
            :value="form.transactionDate"
            @change="handleTransactionDate"
            :disabled="hasOtherExpenses"
            :errors="errors.transactionDate"
        />

        <BaseCheckboxWithBorderAndFloatingLabel
            labelText="Item Received / Service Completed"
            id="add-expense-details__checkbox-full-value"
            labelClass="add-expense-details__checkbox-label"
            floatingLabelText="Item Receipt"
            className="add-expense-details__checkbox"
            @change="setItemReceivedProperty"
            :value="form.itemReceived"
        />

        <b-row no-gutters v-if="!form.itemReceived">
            <b-col class="mr-2 add-expense-details__quantity-received">
                <BaseInputFieldWithBorderAndFloatingLabel
                    inputContainerClass="add-expense-details__transaction-quantity-container"
                    className="add-expense-details__transaction-quantity"
                    floatingLabelText="Quantity Received"
                    floatingLabelClass="add-expense-details__select-label"
                    :value="form.quantityReceived"
                    :errors="errors.quantityReceived"
                    @input="handleQuantityRecievedInput"
                />
            </b-col>

            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    inputContainerClass="add-expense-details__transaction-date-container"
                    className="add-expense-details__transaction-date-input"
                    floatingLabelText="Remainder"
                    floatingLabelClass="add-expense-details__select-label"
                    disabled="true"
                    :value="remainder"
                />
            </b-col>
        </b-row>

        <b-row v-if="incompleteDelivery">
            <b-col>
                <!-- supplyDueDate text input -->
                <BaseDateFieldWithBorderAndFloatingLabel
                    @input="handleSupplyDueDate"
                    inputContainerClass="add-expense-details__transaction-date-container"
                    floatingLabelText="Delivery Date"
                    floatingLabelClass="add-expense-details__select-label"
                    :value="form.supplyDueDate"
                    @change="handleSupplyDueDate"
                    :errors="errors.supplyDueDate"
                />
            </b-col>
        </b-row>

        <BaseFileInputWithBorderAndFloatingLabel
            inputContainerClass="add-expense-details__attachments-file-input-container mt-5"
            className="add-expense-details__cost-input"
            floatingLabelText="Attachments"
            floatingLabelClass="add-expense-details__select-label"
            allowMultiple="true"
            v-if="false"
        />
        <BaseTextAreaWithBorderAndFloatingLabel
            className="add-expense-details__notes-input"
            floatingLabelText="Notes"
            labelText="Notes"
            v-model="form.notes"
            :errors="errors.notes"
            inputContainerClass="add-expense-details__notes-input-container"
        />

        <div
            class="add-expense-details__save-and-add-more pointer"
            v-if="!this.userIsOnDesktop && !isBackDated"
            @click="addExpenseToDraftAndShowExpenseSelectionPage"
        >
            <CircularPlusSign class="add-expense-details__save-and-add-more--icon" />
            <span class="add-expense-details__save-and-add-more--text">Save & Add Another Item</span>
        </div>

        <BasePrimaryButton
            className="add-expense-details__btn"
            :buttonText="addItemButtonText"
            :overRideButtonClass="true"
            @button-clicked="addExpenseToCart"
            :disabled="formContainsErrors"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';

import { RecordExpenseDetail, ExpenseSummary, ExpenseRequest } from '@/pages/Spending/Expense/types';
import { isEmpty } from '@/utils/formValidator';

@Component
export default class AddExpenseDetails extends Mixins(UtilityMixins, ValidationMixin) {
    private form: RecordExpenseDetail = {
        transactionDate: this.todayAsDefaultDate(),
        itemReceived: true,
        quantityReceived: 0,
        supplyDueDate: '',
        attachments: [],
        notes: '',
    };

    private errors = {
        transactionDate: '',
        itemReceived: '',
        quantityReceived: '',
        supplyDueDate: '',
        attachments: '',
        notes: '',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Prop({ required: true }) expenseSummary!: ExpenseSummary | any;
    @Prop({ required: true }) preliminaryExpenseForm!: ExpenseRequest;
    @Prop({ default: false }) editingSelectedExpense!: boolean;
    @Prop({ default: false }) previousExpenseIsBeingEdited!: boolean;
    @Prop({ required: true }) readonly allExpenses!: Array<ExpenseRequest>;

    get addItemButtonText(): string {
        if (this.shouldSubmitImmediately) return 'Submit';

        if (this.editingSelectedExpense) {
            return 'Save Changes';
        }

        return 'Add Item';
    }

    get submitButtonText(): string {
        return this.editingSelectedExpense ? 'Save Changes' : 'Submit';
    }

    get formContainsErrors(): boolean {
        return this.formHasError(this.errors);
    }

    get incompleteDelivery(): boolean {
        return this.expenseSummary.quantity > this.form.quantityReceived;
    }

    get remainder(): number {
        return this.expenseSummary.quantity - this.form.quantityReceived;
    }

    get hasOtherExpenses(): boolean {
        return this.editingSelectedExpense ? this.allExpenses.length > 1 : this.allExpenses.length > 0;
    }

    get isBackDated(): boolean {
        return this.form.transactionDate !== this.todayAsDefaultDate();
    }

    get shouldSubmitImmediately(): boolean {
        if (this.previousExpenseIsBeingEdited) return true;

        if (this.hasOtherExpenses) return false;

        return !this.userIsOnDesktop || this.form.transactionDate !== this.todayAsDefaultDate();
    }

    private addExpenseToDraft() {
        const { quantityReceived } = this.form;
        const { quantity } = this.preliminaryExpenseForm;

        const completedExpenseForm: ExpenseRequest = {
            ...this.preliminaryExpenseForm,
            ...this.form,
            quantityReceived,
            quantity: Number(quantity),
        };

        this.$emit('add-complete-expense-to-expense-array', completedExpenseForm);

        if (!this.shouldSubmitImmediately) {
            this.$emit('add-expense-details-to-summary', this.form);
            this.$emit('add-complete-expense-item-to-cart');
        }
    }

    private showExpenseSummaryPage() {
        this.$emit('show-expense-summary-page');
    }
    private showExpenseSelectionPage() {
        this.$emit('show-expense-selection-page');
    }

    private addExpenseToDraftAndShowExpenseSelectionPage() {
        this.validateAllFields();

        if (this.formContainsErrors) return;

        this.addExpenseToDraft();
        this.showExpenseSelectionPage();
    }

    private setItemReceivedProperty(received: boolean) {
        this.form.itemReceived = received;

        if (received) {
            this.form.quantityReceived = Number(this.expenseSummary.quantity);
            // remove all errors from other fields pertaining to amoount received
            this.errors = {
                ...this.errors,
                quantityReceived: '',
                supplyDueDate: '',
            };
        } else this.form.quantityReceived = 0;
    }

    private handleTransactionDate(date: string) {
        this.form.transactionDate = date;
        this.validateTransactionDate();
    }

    private handleSupplyDueDate(date: string) {
        this.form.supplyDueDate = date;
        this.$nextTick(() => {
            this.validateDeliveryDueDate();
        });
    }

    private handleQuantityRecievedInput(quantityReceived: string) {
        const qtyReceivedNum = this.convertFormattedFiguresToNumber(quantityReceived);
        this.form.quantityReceived = qtyReceivedNum;
        this.$nextTick(() => {
            this.validateQuantityReceived();
        });
    }

    private validateTransactionDate() {
        const { transactionDate } = this.form;
        this.validateEmptyField('transactionDate', transactionDate, this.errors, 'This is a required field');

        if (!this.errors.transactionDate) {
            // transaction date must not be later than today
            if (!this.isDateOnOrBeforeToday(transactionDate)) {
                this.errors.transactionDate = 'This date cannot be later than today';
                return;
            }

            const financialYearDate = this.financialMonthAndYearToCalendarDate();
            // transaction date must be not be earlier than financial year start month

            if (transactionDate < financialYearDate) {
                this.errors.transactionDate = 'This cannot be earlier than the financial year start date';
                return;
            }

            this.errors.transactionDate = '';
        }
    }

    private financialMonthAndYearToCalendarDate(): string {
        const financialYearStartDate = 'January 2020';
        const indexOfFinancialYearMonth = this.monthsOfTheYear.findIndex((month: string) =>
            month.toLowerCase().match(financialYearStartDate.split(' ')[0].toLowerCase()),
        );

        if (indexOfFinancialYearMonth < 10) {
            return `${financialYearStartDate.split(' ')[1]}-0${indexOfFinancialYearMonth + 1}-01`;
        }

        return `${financialYearStartDate.split(' ')[1]}-${indexOfFinancialYearMonth + 1}-01`;
    }

    private validateQuantityReceived() {
        const {
            form: { quantityReceived },
            expenseSummary: { quantity },
        } = this;
        if (Number(quantityReceived) < 0) {
            this.errors.quantityReceived = 'This amount cannot be less than 0';
            return;
        }

        if (Number(quantityReceived) > Number(quantity)) {
            this.errors.quantityReceived = 'This cannot be greater than the quantity';
            return;
        }
        this.errors.quantityReceived = '';
    }

    private checkIfDeliveryDueDateIsLessThanTransactionDate() {
        const { supplyDueDate, transactionDate } = this.form;

        if (!supplyDueDate) return;

        if (supplyDueDate < transactionDate) {
            this.errors.supplyDueDate = 'This cannot be earlier than the transaction date';
            return;
        }

        if (!this.isDateOnOrAfterToday(supplyDueDate)) {
            this.errors.supplyDueDate = 'This cannot be less than today';
            return;
        }

        this.errors.supplyDueDate = '';
        return;
    }

    private validateDeliveryDueDate() {
        const { supplyDueDate } = this.form;

        this.validateEmptyField('supplyDueDate', supplyDueDate, this.errors, 'This is a required field');

        if (!this.errors.supplyDueDate) {
            if (!this.isDateOnOrAfterToday(supplyDueDate)) {
                this.errors.supplyDueDate = 'This cannot be less than today';
                return;
            }
            this.errors.supplyDueDate = '';
        }
    }

    private validateNotes() {
        const { notes } = this.form;
        if (notes.length > 200) {
            this.errors.notes = 'Please keep this within 200 characters';
            return;
        }
        this.errors.notes = '';
    }

    private validateAllFields() {
        this.validateQuantityReceived();
        this.validateTransactionDate();
        if (this.incompleteDelivery) {
            this.validateDeliveryDueDate();
        }
        this.validateNotes();
    }

    private addExpenseToCart() {
        // validate all fields
        this.validateAllFields();

        if (this.formContainsErrors) return;

        if (this.remainder) {
            if (isEmpty(this.expenseSummary.vendorName)) {
                this.$emit('add-expense-details-to-summary', this.form);

                this.$nextTick(() => {
                    this.$emit('show-vendor-selection-page');
                });
                return;
            }
        }

        this.addExpenseToDraft();

        if (!this.shouldSubmitImmediately) this.showExpenseSummaryPage();
        else this.submitExpenseImmediately();
    }

    private submitExpenseImmediately() {
        this.$emit('submit-expense-immediately');
    }

    private preloadForm() {
        const { transactionDate, quantityReceived, supplyDueDate, attachments, notes } = this.preliminaryExpenseForm;

        const { quantity } = this.expenseSummary;

        if (transactionDate) {
            const itemReceived = quantity === quantityReceived;

            this.form = Object.assign({}, this.form, {
                transactionDate,
                quantityReceived,
                supplyDueDate,
                attachments,
                notes,
                itemReceived,
            });
        } else {
            this.form.quantityReceived = quantity;
        }

        if (this.hasOtherExpenses) this.form.transactionDate = this.todayAsDefaultDate();
    }

    mounted() {
        this.preloadForm();

        // set the quantity received to the value of quantity
        // keep the value of the checkbox

        this.$emit('show-expense-item-summary-component', true);
    }

    beforeUpdate() {
        this.$emit('save-expense-details', this.form);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/add-expense-details.scss';
</style>
