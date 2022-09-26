import ValidationMixin from '@/mixins/validation';
import UtilityMixin from '@/mixins/Utility';
import { Component, Mixins } from 'vue-property-decorator';
import {
    ErrorIndexSignature,
    InvoiceCustomer,
    ensurePossiblyNullValueReturnsString,
    ensurePossiblyNullValueReturnsNumber,
    InputValidation,
} from '@/types';

const salesForm: InputValidation = {
    amountPaid: '',
    transactionDate: '',
    balanceDueDate: '',
    paymentAccountKey: '',
    dateIssued: '',
};

const addProductToSalesForm: InputValidation = {
    quantity: '',
    quantitySupplied: '',
    supplyDueDate: '',
};

const productPricingForm: InputValidation = {
    unitPrice: '',
    quantity: '',
    discountAmount: '',
    discountPercent: '',
};

@Component
class SalesServiceMixin extends Mixins(ValidationMixin, UtilityMixin) {
    public salesFormError = { ...salesForm };
    public addProductToSalesFormError = { ...addProductToSalesForm };
    public pricingFormError = { ...productPricingForm };

    public get pricingFormIsValidated(): boolean {
        return !this.formHasError(this.pricingFormError);
    }

    public get addProductToSalesFormIsValidated(): boolean {
        return !this.formHasError(this.addProductToSalesFormError);
    }

    public get salesFormIsValidated(): boolean {
        return !this.formHasError(this.salesFormError);
    }

    public hasError(field: string): boolean {
        if (field && field.trim().length > 0) {
            return true;
        }
        return false;
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public conditionForSelectedCustomerToBeValid(selectedCustomerObject: InvoiceCustomer) {
        return !this.objectIsEmpty(selectedCustomerObject) && selectedCustomerObject.name.length > 0;
    }

    public objectIsEmpty(objectToBeChecked: object) {
        const objectIsEmpty = Object.keys(objectToBeChecked).length === 0;
        return objectIsEmpty;
    }

    public emitErrors(errorObject: ErrorIndexSignature) {
        this.$emit('errors', errorObject);
    }

    public isWholeNumber(value: string) {
        return Number(value) === parseInt(value, 10);
    }

    public isValueNonZero(value: string | number) {
        return Number(value) > 0;
    }

    public isNonNegativeNumber(value: string | number) {
        if (value) {
            return Number(value) >= 0;
        }

        return false;
    }

    public validateTotalAmount(total: number, errors: ErrorIndexSignature) {
        this.validateEmptyFieldInput(total, 'total', 'Please enter total amount', errors);

        if (!this.isValueNonZero(total)) {
            errors.total = 'Please enter a valid amount';
        }

        this.emitErrors(errors);
    }

    public validateUnitPrice(price: number, errors: ErrorIndexSignature) {
        this.validateEmptyFieldInput(price, 'price', 'Please enter a unit price', errors);

        if (!this.isValueNonZero(price)) {
            errors.price = 'Please enter a price greater than 0';
        }

        this.emitErrors(errors);
    }

    public conditionsForInvalidQuantityInput(quantity: number) {
        return !this.isWholeNumber(quantity.toString()) || !this.isValueNonZero(quantity);
    }

    public validateEmptyFieldInput(
        value: string | number | null,
        valueProperty: string,
        errorMessage: string,
        errors: ErrorIndexSignature,
    ) {
        if (this.inputFieldEmpty(value)) {
            errors[valueProperty] = errorMessage;
        } else {
            errors[valueProperty] = '';
        }
    }

    public inputFieldEmpty(value: string | number | null) {
        if (typeof value === 'string' || value === null) {
            const assuredValue = ensurePossiblyNullValueReturnsString(value);

            return assuredValue.length === 0;
        }
        const assuredValue = ensurePossiblyNullValueReturnsNumber(value);
        return !assuredValue;
    }

    public validateQuantity(quantity: number, errors: ErrorIndexSignature) {
        this.validateEmptyFieldInput(quantity, 'quantity', 'Please enter a valid quantity', errors);

        if (quantity && this.conditionsForInvalidQuantityInput(quantity)) {
            errors.quantity = 'Please enter a whole number greater than 0';
        }

        this.emitErrors(errors);
    }

    public validateMeasurementType(measurementKey: string, errors: ErrorIndexSignature) {
        this.validateEmptyFieldInput(measurementKey, 'measurementType', 'Please enter a measurement type', errors);
        this.emitErrors(errors);
    }

    public isValidUnitPrice(priceText: string | number): boolean {
        if (!this.isNonNegativeNumber(priceText)) {
            this.pricingFormError['unitPrice'] = 'Invalid';
            return false;
        }

        if (!this.isNumber(priceText)) {
            this.pricingFormError['unitPrice'] = 'Invalid';
            return false;
        }

        this.pricingFormError['unitPrice'] = '';
        return true;
    }

    public validatePricingQuantity(quantity: string): boolean {
        const qtyNum = this.convertFormattedFiguresToNumber(quantity);

        if (!this.isWholeNumber(qtyNum.toString())) {
            this.pricingFormError['quantity'] = 'Please enter a whole number greater than 0';
            return false;
        }

        if (this.conditionsForInvalidQuantityInput(qtyNum)) {
            this.pricingFormError['quantity'] = 'Please enter a whole number greater than 0';
            return false;
        }

        this.pricingFormError['quantity'] = '';
        return true;
    }

    public isNumber(numStr: string | number): boolean {
        if (this.convertFormattedFiguresToNumber(numStr.toString()) > 0) return true;

        return +numStr === +numStr;
    }

    public validateDiscountAmount(discount: string, subTotal: number): boolean {
        if (!discount) {
            this.pricingFormError['discountAmount'] = '';
            return true;
        }

        if (!this.isNumber(discount)) {
            this.pricingFormError['discountAmount'] = 'Invalid';
            return false;
        }

        const discountAmount = this.convertFormattedFiguresToNumber(discount);

        if (discountAmount < 0 || discountAmount > subTotal) {
            this.pricingFormError['discountAmount'] = 'Invalid';
            return false;
        }

        this.pricingFormError['discountAmount'] = '';
        return true;
    }

    public validateDiscountPercentage(discountPercentText: string | number): boolean {
        if (!discountPercentText) {
            this.pricingFormError['discountPercent'] = '';
            return true;
        }

        if (!this.isNumber(discountPercentText)) {
            this.pricingFormError['discountPercent'] = 'Invalid';
            return false;
        }

        const discountPercent = Number(discountPercentText);

        if (discountPercent < 0 || discountPercent > 100) {
            this.pricingFormError['discountPercent'] = 'Invalid';
            return false;
        }

        this.pricingFormError['discountPercent'] = '';
        return true;
    }

    public validateSaleQuantity(quantity: string): boolean {
        const qtyNum = this.convertFormattedFiguresToNumber(quantity);

        if (!this.isWholeNumber(qtyNum.toString())) {
            this.addProductToSalesFormError['quantity'] = 'Invalid';
            return false;
        }

        if (this.conditionsForInvalidQuantityInput(qtyNum)) {
            this.addProductToSalesFormError['quantity'] = 'Invalid';
            return false;
        }

        this.addProductToSalesFormError['quantity'] = '';
        return true;
    }

    public validateQuantitySupplied(quantitySupplied: string, quantity: number): boolean {
        if (!quantitySupplied) {
            this.addProductToSalesFormError['quantitySupplied'] = '';
            return true;
        }

        const qtyNum = this.convertFormattedFiguresToNumber(quantitySupplied);

        if (!this.isWholeNumber(qtyNum.toString())) {
            this.addProductToSalesFormError['quantitySupplied'] = 'Invalid';
            return false;
        }

        if (qtyNum < 0 || qtyNum > quantity) {
            this.addProductToSalesFormError['quantitySupplied'] = 'Invalid';
            return false;
        }

        this.addProductToSalesFormError['quantitySupplied'] = '';
        return true;
    }

    public validateSupplyDueDate(supplyDueDate: string, supplyBalance: number): boolean {
        if (supplyBalance > 0 && !this.isDateOnOrAfterToday(supplyDueDate)) {
            this.addProductToSalesFormError['supplyDueDate'] = 'Supply Due Date cannot be in the past';
            return false;
        }
        this.addProductToSalesFormError['supplyDueDate'] = '';
        return true;
    }

    public isValidAmountPaid(amountPaidInput: string, totalAmount: number): boolean {
        if (!amountPaidInput) {
            this.salesFormError['amountPaid'] = '';
            this.salesFormError['paymentAccountKey'] = '';
            return true;
        }

        if (!this.isNumber(amountPaidInput)) {
            this.salesFormError['amountPaid'] = 'Invalid';
            return false;
        }

        const amountPaidNum = this.convertFormattedFiguresToNumber(amountPaidInput);

        if (amountPaidNum < 0) {
            this.salesFormError['amountPaid'] = 'Invalid';
            return false;
        }

        const amountPaidToOneDecimalPlace = Number(amountPaidNum).toFixed(1);
        const totalAmountToOneDecimalPlace = Number(totalAmount).toFixed(1);

        if (amountPaidToOneDecimalPlace > totalAmountToOneDecimalPlace) {
            this.salesFormError['amountPaid'] = 'The maximum amount is ' + totalAmountToOneDecimalPlace.toString();
            return false;
        }
        this.salesFormError['amountPaid'] = '';
        return true;
    }

    public validateBalanceDueDate(balanceDueDate: string, balanceDue: number, transactionDate: string): boolean {
        if (balanceDue > 0 && balanceDueDate < transactionDate) {
            this.salesFormError['balanceDueDate'] = 'Balance Due Date cannot less than transaction date';
            return false;
        }
        this.salesFormError['balanceDueDate'] = '';
        return true;
    }

    public validateTransactionDate(transactionDate: string): boolean {
        if (!this.isDateOnOrBeforeToday(transactionDate)) {
            this.salesFormError['transactionDate'] = 'Transaction Date cannot be in the future';
            return false;
        }
        this.salesFormError['transactionDate'] = '';
        return true;
    }
}

export default SalesServiceMixin;
