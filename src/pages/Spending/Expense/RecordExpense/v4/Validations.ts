import { Component, Mixins } from 'vue-property-decorator';

import UtilityMixin from '@/mixins/Utility';

import { isEmpty, isValidNumberInput, formHasError, hasError } from '@/utils/formValidator';
import { MoneyObject } from '@/types';
import { SelectedItemDetails, ExpensePaymentDetails } from '@/pages/Spending/Expense/RecordExpense/v4/types';

const itemDetailsError = {
    name: '',
    amount: '',
    quantity: '',
    quantityReceived: '',
    supplyDueDate: '',
    donationScheme: '',
};

const paymentError = {
    paymentAccount: '',
    amountPaid: '',
    balanceDueDate: '',
};

@Component
export default class ExpenseValidations extends Mixins(UtilityMixin) {
    public generalFormError = '';

    public itemDetailsError = { ...itemDetailsError };

    public setGeneralError(errorMessage: string) {
        this.$nextTick(() => (this.generalFormError = errorMessage));
    }

    private clearGeneralError() {
        this.generalFormError = '';
    }

    //Expense Item Details Form Validation

    public validateSelectedItem(itemName: string) {
        if (isEmpty(itemName)) {
            this.itemDetailsError['name'] = 'This is required';
            this.setGeneralError(`Please select an expense item`);
            return;
        }
        this.itemDetailsError['name'] = '';
        this.clearGeneralError();
        return;
    }

    public validateExpenseAmount(amount: string): boolean {
        if (isEmpty(amount)) {
            this.itemDetailsError['amount'] = 'This is required';
            this.setGeneralError(`Please provide an amount`);
            return false;
        }
        if (!isValidNumberInput(amount)) {
            this.itemDetailsError['amount'] = 'Invalid amount';
            this.setGeneralError(`Please provide an amount in figures`);
            return false;
        }

        const expenselAmount = this.convertFormattedFiguresToNumber(amount);
        if (expenselAmount == 0) {
            this.itemDetailsError['amount'] = 'Invalid amount';
            this.setGeneralError(`Please provide an amount in figures`);
            return false;
        }

        this.itemDetailsError['amount'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateExpenseQuantity(
        quantity: string,
        quantityReceived: string,
        itemDeliveryCompleted: boolean,
    ): boolean {
        if (isEmpty(quantity)) {
            this.itemDetailsError['quantity'] = 'This is required';
            this.setGeneralError(`Please provide item's quantity`);
            return false;
        }
        if (!isValidNumberInput(quantity)) {
            this.itemDetailsError['quantity'] = 'Invalid quantity';
            this.setGeneralError(`Please provide quantity in figures`);
            return false;
        }

        const expenselQuantity = this.convertFormattedFiguresToNumber(quantity);
        if (expenselQuantity == 0) {
            this.itemDetailsError['quantity'] = 'Invalid quantity';
            this.setGeneralError(`Please provide quantity in figures`);
            return false;
        }

        this.itemDetailsError['quantity'] = '';
        this.clearGeneralError();
        if (itemDeliveryCompleted) return true;
        this.validateQuantityReceived(quantityReceived, quantity);
        return true;
    }

    public validateQuantityReceived(quantityReceived: string, quantity: string): boolean {
        if (!isValidNumberInput(quantityReceived)) {
            this.itemDetailsError['quantityReceived'] = 'Invalid quantity';
            this.setGeneralError(`Please specify quantity received in figures`);
            return false;
        }

        const quantityReceivedAmount = this.convertFormattedFiguresToNumber(quantityReceived);
        const quantityAmount = this.convertFormattedFiguresToNumber(quantity);

        if (quantityReceivedAmount > quantityAmount) {
            this.itemDetailsError['quantityReceived'] = 'Invalid quantity';
            this.setGeneralError(`Quantity received cannot be more than the actual quatity`);
            return false;
        }

        this.itemDetailsError['quantityReceived'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateSupplyDueDate(balanceDue: number, supplyDueDate: string, transactionDate: string) {
        if (balanceDue === 0) {
            this.itemDetailsError['supplyDueDate'] = '';
            this.clearGeneralError();
            return;
        }
        if (isEmpty(supplyDueDate)) {
            this.itemDetailsError['supplyDueDate'] = 'This is required';
            this.setGeneralError(`Please provide the supply due date`);
            return;
        }

        if (new Date(transactionDate) > new Date(supplyDueDate)) {
            this.itemDetailsError['supplyDueDate'] = 'Invalid date';
            this.setGeneralError(`Supply due date should be after the trasaction date`);
            return;
        }
        this.itemDetailsError['supplyDueDate'] = '';
        this.clearGeneralError();
    }

    public validateExpenseDonationScheme(donationScheme: string) {
        if (isEmpty(donationScheme)) {
            this.itemDetailsError['donationScheme'] = 'This is required';
            this.setGeneralError(`Please select a donation scheme`);
            return;
        }
        this.itemDetailsError['donationScheme'] = '';
        this.clearGeneralError();
        return;
    }

    public validateItemDetailsForm(
        detailsForm: {
            name: string;
            description: string;
            amount: MoneyObject;
            quantity: number;
            quantityReceived: number;
            donationSchemeKey: string;
            supplyDueDate: string;
            transactionDate: string;
            notes: string;
        },
        itemDeliveryCompleted: boolean,
        isNgo: boolean,
    ) {
        const {
            name,
            amount,
            quantity,
            quantityReceived,
            donationSchemeKey,
            supplyDueDate,
            transactionDate,
        } = detailsForm;

        this.validateSelectedItem(name);
        this.validateExpenseAmount(String(amount.amount));
        this.validateExpenseQuantity(String(quantity), String(quantityReceived), itemDeliveryCompleted);
        this.validateQuantityReceived(String(quantityReceived), String(quantity));
        this.validateSupplyDueDate(quantity - quantityReceived, supplyDueDate, transactionDate);
        if (isNgo) this.validateExpenseDonationScheme(donationSchemeKey);
    }

    public get itemDetailsFormIsValidated() {
        return !formHasError(this.itemDetailsError);
    }

    public resetItemDetailsFormErrors() {
        this.itemDetailsError = { ...itemDetailsError };
        this.clearGeneralError();
    }

    public clearSupplyDueDateError() {
        this.itemDetailsError['supplyDueDate'] = '';
        this.clearGeneralError();
    }

    public hasError(inputField: string) {
        return hasError(inputField);
    }

    public itemsIncludeIncompleteDelivery(selectedItems: SelectedItemDetails[]): boolean {
        return selectedItems.some(selectedItem => {
            const { quantity, quantityReceived } = selectedItem.expenseItemDetails;
            return quantity > quantityReceived;
        });
    }

    //Payment Form Validation

    public paymentError = { ...paymentError };

    public validatePaymentAccount(paymentAccount: string) {
        if (isEmpty(paymentAccount)) {
            this.paymentError['paymentAccount'] = 'This is required';
            this.setGeneralError(`Please select the account paid from`);
            return;
        }
        this.paymentError['paymentAccount'] = '';
        this.clearGeneralError();
        return;
    }

    public validateAmountPaid(amountPaid: string): boolean {
        if (!isValidNumberInput(amountPaid)) {
            this.paymentError['amountPaid'] = 'Invalid amount';
            this.setGeneralError(`Please specify amount paid in figures`);
            return false;
        }

        this.paymentError['amountPaid'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateBalanceDueDate(balanceDue: number, balanceDueDate: string, transactionDate: string) {
        if (balanceDue === 0) {
            this.paymentError['balanceDueDate'] = '';
            this.clearGeneralError();
            return;
        }
        if (isEmpty(balanceDueDate)) {
            this.paymentError['balanceDueDate'] = 'This is required';
            this.setGeneralError(`Please provide balance due date`);
            return;
        }

        if (new Date(transactionDate) > new Date(balanceDueDate)) {
            this.paymentError['balanceDueDate'] = 'Invalid date';
            this.setGeneralError(`Balance due date should be after the trasaction date`);
            return;
        }
        this.paymentError['balanceDueDate'] = '';
        this.clearGeneralError();
    }

    public validateaymentForn(paymentForm: ExpensePaymentDetails, balanceDue: number) {
        const { accountPaidFrom, amountPaid, transactionDate, balanceDueDate } = paymentForm;
        this.validatePaymentAccount(accountPaidFrom);
        this.validateAmountPaid(String(amountPaid.amount));
        this.validateBalanceDueDate(balanceDue, balanceDueDate, transactionDate);
    }

    public clearBalanceDueDateError() {
        this.paymentError['balanceDueDate'] = '';
        this.clearGeneralError();
    }

    public get paymentFormIsValidated() {
        return !formHasError(this.paymentError);
    }
}
