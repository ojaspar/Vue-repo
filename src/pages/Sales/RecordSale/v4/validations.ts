import { Component, Mixins } from 'vue-property-decorator';

import UtilityMixin from '@/mixins/Utility';

import { isEmpty, isValidNumberInput, formHasError, hasError } from '@/utils/formValidator';
import { MoneyObject } from '@/types';
import { SelectedItemDetails, PaymentDetails } from '@/pages/Sales/RecordSale/v4/types';
import { TaxForms } from '@/pages/Sales/types';
import CurrencyMixin from '@/mixins/currency';
import SessionStorageService from '@/services/sessionStorage';

const itemDetailsError = {
    name: '',
    unitPrice: '',
    quantity: '',
    discount: '',
    discountPercent: '',
    quantitySupplied: '',
    supplyDueDate: '',
};

const paymentError = {
    paymentAccount: '',
    amountPaid: '',
    balanceDueDate: '',
};

@Component
export default class SalesValidations extends Mixins(UtilityMixin, CurrencyMixin) {
    public generalFormError = '';

    public itemDetailsError = { ...itemDetailsError };

    public setGeneralError(errorMessage: string) {
        this.$nextTick(() => (this.generalFormError = errorMessage));
    }

    private clearGeneralError() {
        this.generalFormError = '';
    }

    //Sale Item Details Form Validation
    public validateSelectedProduct(productName: string) {
        if (isEmpty(productName)) {
            this.itemDetailsError['name'] = 'This is required';
            this.setGeneralError(`Please select a product`);
            return;
        }
        this.itemDetailsError['name'] = '';
        this.clearGeneralError();
        return;
    }

    public lineAmount(unitPrice: number, quantity: number, discount: number): number {
        return unitPrice * quantity - discount;
    }

    public getVATAmount(vatType: string, subTotal: number): number {
        if (vatType === TaxForms.NONE) {
            return 0;
        }

        let vat = 0.075 * subTotal;

        if (vatType === TaxForms.INCLUSIVE) {
            vat = (7.5 * subTotal) / 107.5;
        }

        return Number(this.roundN(vat, 2));
    }

    public getTotalExclusiveOfVAT(vatType: string, vatAmount: number, subTotal: number): number {
        if (vatType === TaxForms.INCLUSIVE) {
            return subTotal - vatAmount;
        }

        return subTotal;
    }

    public getSupplyStatus(quantity: number, quantitySupplied: number) {
        if (quantitySupplied < quantity) {
            return 'Partial Supply';
        }
        if (quantitySupplied === 0) {
            return 'Not Supplied';
        }
        return 'Supplied';
    }

    public validateUnitPrice(amount: string): boolean {
        if (isEmpty(amount)) {
            this.itemDetailsError['unitPrice'] = 'This is required';
            this.setGeneralError(`Please provide the Unit Price`);
            return false;
        }
        if (!isValidNumberInput(amount)) {
            this.itemDetailsError['unitPrice'] = 'Invalid amount';
            this.setGeneralError(`Please provide the Unit Price in figures`);
            return false;
        }

        const unitPrice = this.convertFormattedFiguresToNumber(amount);
        if (unitPrice == 0) {
            this.itemDetailsError['unitPrice'] = 'Invalid amount';
            this.setGeneralError(`Please provide the Unit Price in figures`);
            return false;
        }

        this.itemDetailsError['unitPrice'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateQuantity(quantity: string, quantitySupplied: string, itemSupplyCompleted: boolean): boolean {
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

        const saleQuantity = this.convertFormattedFiguresToNumber(quantity);
        if (saleQuantity == 0) {
            this.itemDetailsError['quantity'] = 'Invalid quantity';
            this.setGeneralError(`Please provide quantity in figures`);
            return false;
        }

        this.itemDetailsError['quantity'] = '';
        this.clearGeneralError();
        if (itemSupplyCompleted) return true;
        this.validateQuantitySupplied(quantitySupplied, quantity);
        return true;
    }

    public validateQuantitySupplied(quantitySupplied: string, quantity: string): boolean {
        if (!isValidNumberInput(quantitySupplied)) {
            this.itemDetailsError['quantitySupplied'] = 'Invalid quantity';
            this.setGeneralError(`Please specify quantity received in figures`);
            return false;
        }

        const quantitySuppliedAmount = this.convertFormattedFiguresToNumber(quantitySupplied);
        const quantityAmount = this.convertFormattedFiguresToNumber(quantity);

        if (quantitySuppliedAmount > quantityAmount) {
            this.itemDetailsError['quantitySupplied'] = 'Invalid quantity';
            this.setGeneralError(`Quantity received cannot be more than the actual quatity`);
            return false;
        }

        this.itemDetailsError['quantitySupplied'] = '';
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

    public validateDiscount(discountAmount: string, amountBeforeDiscount: number): boolean {
        if (isEmpty(discountAmount)) {
            this.itemDetailsError['discount'] = '';
            return true;
        }

        if (!isValidNumberInput(discountAmount)) {
            this.itemDetailsError['discount'] = 'Invalid Discount';
            this.setGeneralError(`Please provide the Discount in figures`);
            return false;
        }

        const discount = this.convertFormattedFiguresToNumber(discountAmount);
        if (discount < 0 || discount > amountBeforeDiscount) {
            this.itemDetailsError['discount'] = 'Invalid Discount';

            const formattedAmount = this.convertFigureToCurrency(amountBeforeDiscount);
            this.setGeneralError(`Discount must be between 0 and ${formattedAmount}`);
            return false;
        }

        this.itemDetailsError['discount'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateDiscountPercentage(percent: string): boolean {
        if (isEmpty(percent)) {
            this.itemDetailsError['discountPercent'] = '';
            return true;
        }
        if (!isValidNumberInput(percent)) {
            this.itemDetailsError['discountPercent'] = 'Invalid Percentage';
            this.setGeneralError(`Please provide the Discount Percent in figures`);
            return false;
        }

        const discountPercent = this.convertFormattedFiguresToNumber(percent);
        if (discountPercent < 0 || discountPercent > 100) {
            this.itemDetailsError['discountPercent'] = 'Invalid Percentage';
            this.setGeneralError(`Discount Percentage must be between 0 and 100`);
            return false;
        }

        this.itemDetailsError['discountPercent'] = '';
        this.clearGeneralError();
        return true;
    }

    public validateItemDetailsForm(
        detailsForm: {
            name: string;
            unitPrice: MoneyObject;
            quantity: number;
            quantitySupplied: number;
            supplyDueDate: string;
            transactionDate: string;
            discount: number;
        },
        itemSupplyCompleted: boolean,
    ) {
        const { name, unitPrice, quantity, quantitySupplied, supplyDueDate, transactionDate, discount } = detailsForm;

        this.validateSelectedProduct(name);
        this.validateUnitPrice(String(unitPrice.amount));
        this.validateQuantity(String(quantity), String(quantitySupplied), itemSupplyCompleted);
        this.validateQuantitySupplied(String(quantitySupplied), String(quantity));
        this.validateSupplyDueDate(quantity - quantitySupplied, supplyDueDate, transactionDate);
        this.validateDiscount(String(discount), unitPrice.amount * quantity);
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
            const { quantity, quantitySupplied } = selectedItem.saleItemDetails;
            return quantity > quantitySupplied;
        });
    }

    //Payment Form Validation

    public paymentError = { ...paymentError };

    public validatePaymentAccount(paymentAccount: string) {
        if (isEmpty(paymentAccount)) {
            this.paymentError['paymentAccount'] = 'This is required';
            this.setGeneralError(`Please select the payment account`);
            return;
        }
        this.paymentError['paymentAccount'] = '';
        this.clearGeneralError();
        return;
    }

    public validateAmountPaid(amountPaid: string, netAmount: number): boolean {
        if (!isValidNumberInput(amountPaid)) {
            this.paymentError['amountPaid'] = 'Invalid amount';
            this.setGeneralError(`Please specify amount paid in figures`);
            return false;
        }

        if (Number(amountPaid) > netAmount) {
            this.paymentError['amountPaid'] = 'Invalid amount';

            const formattedAmount = this.convertFigureToCurrency(netAmount);
            this.setGeneralError(`Amount Paid must be between 0 and ${formattedAmount}`);
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

    public validatePaymentForm(paymentForm: PaymentDetails, netAmount: number) {
        const { paymentAccountKey, amountPaid, transactionDate, balanceDueDate } = paymentForm;
        this.validatePaymentAccount(paymentAccountKey);

        const balance = netAmount - amountPaid.amount;
        this.validateAmountPaid(String(amountPaid.amount), netAmount);
        this.validateBalanceDueDate(balance, balanceDueDate, transactionDate);
    }

    public clearBalanceDueDateError() {
        this.paymentError['balanceDueDate'] = '';
        this.clearGeneralError();
    }

    public get paymentFormIsValidated() {
        return !formHasError(this.paymentError);
    }

    public clearSavedEstimateItems() {
        SessionStorageService.removeItem('selected-customer-for-estimate');
        SessionStorageService.removeItem('selected-items-for-estimate');
        SessionStorageService.removeItem('selected-tax-for-estimate');
    }
}
