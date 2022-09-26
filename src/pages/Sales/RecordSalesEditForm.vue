<template>
    <div>
        <div class="record-sales__edit-item-interface" action="#">
            <div class="record-sales__edit-item-interface__heading">
                <p class="record-sales__edit-item-interface__heading-text">Add Sales</p>
            </div>
            <div class="record-sales__edit-item-interface__form-body">
                <div class="record-sales__edit-item-customer-selection">
                    <BaseSelect
                        :options="customers.items"
                        keyProperty="customerKey"
                        textProperty="name"
                        valueProperty="customerKey"
                        v-model="selectedProduct.customerKey"
                        defaultText="Select Customer"
                        @input="handleCustomerSelection"
                        :errors="errors.customer"
                        className="record-sales__customer-select"
                        selectContainerClass="record-sales__customer-select-container"
                        floatingLabelText="Customer name"
                        floatingLabelClass="record-sales__label"
                    />
                    <BaseButton
                        className="record-sales__create-new-customer-btn"
                        buttonText="Create new customer"
                        :overRideButtonClass="true"
                        @button-clicked="openCreateNewCustomerModal"
                    >
                        <CircularPlusSign />
                    </BaseButton>
                </div>
                <div class="record-sales__select-add-new-product-section">
                    <BaseSelect
                        :options="listOfProductItems"
                        keyProperty="productKey"
                        textProperty="name"
                        valueProperty="productKey"
                        defaultText="Select Product"
                        v-model="selectedProduct.productKey"
                        @input="handleProductSelection"
                        :errors="errors.products"
                        className="record-sales__select"
                        selectContainerClass="record-sales__select-container"
                        floatingLabelText="Products"
                        floatingLabelClass="record-sales__label"
                    />
                    <BaseButton
                        className="record-sales__create-new-product-btn"
                        buttonText="Create new product"
                        :overRideButtonClass="true"
                        @button-clicked="openCreateNewProductModal"
                    >
                        <CircularPlusSign />
                    </BaseButton>
                </div>
                <BaseSelect
                    :options="measurementTypes"
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    defaultText="Select"
                    @input="handleMeasurementType"
                    v-model="selectedProduct.measurementTypeKey"
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    :errors="errors.measurementType"
                    className="record-sales__select"
                    selectContainerClass="record-sales__select-container"
                    floatingLabelText="Measurement Type"
                    floatingLabelClass="record-sales__label"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <BaseInputField
                    className="record-sales__input"
                    placeholder="Unit Price"
                    reference="unitPrice"
                    @focus="handleFocus"
                    :required="true"
                    :errors="errors.price"
                    @input="
                        validateUnitPrice(convertFormattedFiguresToNumber(selectedProduct.unitPrice.toString()), errors)
                    "
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    v-model="selectedProduct.unitPrice"
                    inputContainerClass="record-sales__input-container"
                    floatingLabelText="Unit Price (₦)"
                    floatingLabelClass="record-sales__label"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <BaseInputField
                    inputContainerClass="record-sales__input-container"
                    placeholder="Quantity"
                    @focus="handleFocus"
                    @input="
                        validateQuantity(convertFormattedFiguresToNumber(selectedProduct.quantity.toString()), errors)
                    "
                    :errors="errors.quantity"
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    :required="true"
                    v-model="selectedProduct.quantity"
                    className="record-sales__input"
                    floatingLabelText="Quantity"
                    floatingLabelClass="record-sales__label"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <div class="record-sales__split-discount-boxes">
                    <BaseInputField
                        inputContainerClass="record-sales__input-container"
                        placeholder="Naira discount"
                        v-model="selectedProduct.discount"
                        @input="
                            validateDiscount(convertFormattedFiguresToNumber(selectedProduct.discount), 'nairaDiscount')
                        "
                        @focus="handleFocus"
                        :errors="errors.nairaDiscount"
                        :required="true"
                        :overRideErrorMessageClass="true"
                        :disabled="conditionForDiscountInputToBeDisabled"
                        errorMessageClass="record-sales__error-message"
                        className="record-sales__input"
                        floatingLabelText="Naira Discount"
                        floatingLabelClass="record-sales__label"
                        v-if="conditionForSalesItemEditFormInputFieldsToShow"
                    />
                    <BaseInputField
                        inputContainerClass="record-sales__input-container"
                        placeholder="%Discount"
                        type="number"
                        v-model="calculatePercentageDiscount"
                        @focus="handleFocus"
                        @input="validateDiscount(percentageDiscount, 'percentageDiscount')"
                        :errors="errors.percentageDiscount"
                        :disabled="conditionForDiscountInputToBeDisabled"
                        :overRideErrorMessageClass="true"
                        errorMessageClass="record-sales__error-message"
                        :required="true"
                        className="record-sales__input"
                        floatingLabelText="% Discount"
                        floatingLabelClass="record-sales__label"
                        v-if="conditionForSalesItemEditFormInputFieldsToShow"
                    />
                </div>
                <BaseSelect
                    floatingLabelText="VAT"
                    defaultText="Select VAT Type"
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    className="record-sales__select"
                    selectContainerClass="record-sales__select-container"
                    :options="vatOptions"
                    @input="handleVatOptionChange"
                    v-model="selectedProduct.productVatKey"
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    :errors="errors.vatType"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <BaseInputField
                    inputContainerClass="record-sales__input-container"
                    placeholder="Total Sales Amount"
                    readOnly
                    @focus="handleFocus"
                    :errors="errors.totalAmount"
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    :required="true"
                    :value="formattedAmountWithCurrency(totalAmount)"
                    className="record-sales__input"
                    floatingLabelText="Total Sale Amount (₦)"
                    floatingLabelClass="record-sales__label"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <div class="record-sales__amount-paid-payment-method-split mb-2">
                    <BaseInputField
                        inputContainerClass="record-sales__amount-paid-input-container"
                        placeholder="Amount Paid"
                        v-model="selectedProduct.amountPaid"
                        @input="validateAmountPaid()"
                        @focus="handleFocus"
                        :errors="errors.amountPaid"
                        :overRideErrorMessageClass="true"
                        :disabled="conditionForDiscountInputToBeDisabled"
                        errorMessageClass="record-sales__amount-paid-error-message"
                        className="record-sales__input"
                        floatingLabelText="How much was paid? (₦)"
                        floatingLabelClass="record-sales__label"
                        v-if="conditionForSalesItemEditFormInputFieldsToShow"
                    />
                    <BaseSelect
                        :options="paymentTypes"
                        keyProperty="key"
                        textProperty="name"
                        valueProperty="paymentTypeKey"
                        defaultText="Select"
                        @input="handlePaymentType"
                        v-model="selectedProduct.paymentTypeKey"
                        :overRideErrorMessageClass="true"
                        :emitEventObject="true"
                        :disabled="conditionForRecordEditInputToBeDisabled"
                        :errors="errors.paymentType"
                        className="record-sales__payment-method-select"
                        errorMessageClass="record-sales__payment-type-error-message"
                        selectContainerClass="record-sales__payment-type-select-container"
                        floatingLabelText="Payment method"
                        floatingLabelClass="record-sales__label"
                        v-if="conditionForSalesItemEditFormInputFieldsToShow"
                    />
                </div>
                <BaseInputField
                    type="date"
                    floatingLabelText="Sale Date"
                    className="record-sales__date-select"
                    inputContainerClass="record-sales__date-selection-container"
                    @change="validateSaleDate()"
                    :disabled="conditionForDiscountInputToBeDisabled"
                    v-model="saleDate"
                    floatingLabelClass="record-sales__label"
                    :errors="errors.saleDate"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <BaseTextArea
                    className="record-sales__input"
                    :disabled="conditionForRecordEditInputToBeDisabled"
                    placeholder="Enter additional product information"
                    :required="true"
                    inputContainerClass="record-sales__text-area-container"
                    floatingLabelText="Description"
                    floatingLabelClass="record-sales__label"
                    v-model="selectedProduct.note"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
                <div class="record-sales__order-completion-question-wrapper">
                    <div
                        :class="[
                            Object.keys(errors.orderQuestion).length > 0 ? 'error-wrapper' : '',
                            'record-sales__order-completion-question',
                        ]"
                        v-if="!conditionForRecordEditInputToBeDisabled"
                    >
                        <p class="record-sales__order-question-text">Is the order completed?</p>
                        <BaseInputField
                            type="radio"
                            floatingLabelText="Yes"
                            @change="handleOrderCompletionSelection(false)"
                            className="record-sales__radio-button"
                            v-model="selectedProduct.isOutstandingOrder"
                            inputContainerClass="record-sales__radio-button-container"
                            :checked="selectedProduct.isOutstandingOrder === false"
                        />
                        <BaseInputField
                            type="radio"
                            floatingLabelText="No"
                            @change="handleOrderCompletionSelection(true)"
                            className="record-sales__radio-button"
                            inputContainerClass="record-sales__radio-button-container"
                            v-model="selectedProduct.isOutstandingOrder"
                            :checked="selectedProduct.isOutstandingOrder === true"
                        />
                    </div>
                    <p class="record-sales__order-completion-section-error-message">{{ errors.orderQuestion }}</p>
                </div>

                <BaseButton
                    :buttonText="buttonTextForEditSalesButton"
                    :disabled="conditionForEditItemButtonToBeDisabled"
                    className="record-sales__edit-item-interface__button"
                    @button-clicked="addOrEditSalesItem"
                    v-if="conditionForSalesItemEditFormInputFieldsToShow"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import {
    MeasurementType,
    TargetObject,
    ErrorIndexSignature,
    CustomerResponse,
    SalesCustomer,
    ensureObjectHasValue,
    FilteredSalesProductResponse,
    SalesProduct,
    PaymentType,
    ensurePossiblyNullValueReturnsString,
    Status,
    VatOption,
} from '@/types';

import InputFieldMixins from '@/mixins/InputFieldMixins.ts';
import SalesServiceMixin from '@/mixins/SalesService.ts';
import UtilityMixin from '@/mixins/Utility.ts';

import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';
import ProductModule from '@/store/modules/product';

const products = namespace('product');
let productModule: ProductModule;

const itemToBeEditedDefault = {
    productName: '',
    productKey: '',
    description: '',
    productImage: '',
    price: 0,
    unitPrice: 0,
    quantity: 0,
    discount: 0,
    productVatKey: '',
    vat: 0,
    note: '',
    measurementName: '',
    measurementTypeKey: '',
};

@Component({
    components: {
        CircularPlusSign,
    },
})
export default class RecordSalesEditForm extends Mixins(SalesServiceMixin, UtilityMixin, InputFieldMixins) {
    private initialStateOfErrors: ErrorIndexSignature = {
        price: '',
        quantity: '',
        nairaDiscount: '',
        percentageDiscount: '',
        amountPaid: '',
        measurementType: '',
        vatType: '',
        customer: '',
        saleDate: '',
        paymentType: '',
        orderQuestion: '',
        products: '',
    };
    private editIndex = 0;
    private errors = { ...this.initialStateOfErrors };
    private measurementType = '';
    private measurementTypeKey = '';
    private percentageDiscount = 0;
    private nairaDiscount = 0;
    private initialStateOfSelectedProduct: SalesProduct = {
        productKey: '',
        productName: '',
        description: '',
        price: 0,
        unitPrice: 0,
        quantity: 0,
        discount: 0,
        productVatKey: '',
        vat: 0,
        note: '',
        measurementTypeKey: '',
        paymentTypeKey: '',
        paymentTypeName: '',
        amountPaid: 0,
        //productAmount now represents the inital totalAmount
        productAmount: 0,
        saleDate: '',
        isOutstandingOrder: null,
        customerKey: '',
    };

    private vatRate = 0.075;
    private addVatToTotalAmount = false;

    private listOfProducts: FilteredSalesProductResponse = {
        items: Array<SalesProduct>(),
    };

    private selectedProduct = { ...this.initialStateOfSelectedProduct };

    private initialStateOfSelectedCustomer: SalesCustomer = {
        customerKey: '',
    };

    private selectedCustomer: SalesCustomer = {
        customerKey: '',
    };

    @products.State
    private vatOptionsRequest!: Status;

    @products.State
    private vatOptions!: VatOption[];

    @products.Action
    private getVatOption!: () => VatOption[];

    @Prop({ default: () => Array<MeasurementType>() }) readonly measurementTypes!: MeasurementType;
    @Prop({ default: false }) readonly anItemIsToBeEdited!: boolean;
    @Prop({ default: itemToBeEditedDefault }) readonly itemToBeEdited!: SalesProduct;
    @Prop({ default: { items: Array<SalesProduct>() } }) readonly products!: FilteredSalesProductResponse;
    @Prop({ default: { items: Array<SalesCustomer>() } }) readonly customers!: CustomerResponse;
    @Prop({ required: true }) readonly indexOfItemToBeEdited!: number;
    @Prop({ default: false }) readonly aSaleItemHasBeenSelectedInitially!: boolean;
    @Prop({ default: itemToBeEditedDefault }) readonly itemToBeDeleted!: SalesProduct;
    @Prop({ default: Array<PaymentType>() }) readonly paymentTypes!: Array<PaymentType>;
    @Prop({ default: false }) isEditing!: boolean;
    @Prop({ default: false }) readonly itemToBeEditedVatIsRequired!: boolean;
    @Prop({ default: 0 }) readonly vatOfItemToBeEdited!: number;

    get conditionForSalesItemEditFormInputFieldsToShow() {
        return this.aSaleItemHasBeenSelectedInitially;
    }

    get totalPriceOfItem(): number {
        return (
            this.convertFormattedFiguresToNumber(this.selectedProduct.quantity.toString()) *
            this.convertFormattedFiguresToNumber(this.selectedProduct.unitPrice.toString())
        );
    }

    get convertedDiscount(): number {
        return this.convertFormattedFiguresToNumber(this.selectedProduct.discount.toString());
    }

    get vatValue(): number {
        return this.subTotal * this.vatRate;
    }

    get subTotal(): number {
        return this.totalPriceOfItem - this.convertedDiscount;
    }

    get totalAmount(): number {
        return this.calculateTotalAmount();
    }

    get conditionForCustomerSelectedInSalesToBeCompulsory() {
        const amountPaid = ensurePossiblyNullValueReturnsString(this.selectedProduct.amountPaid);
        const amountPaidAsString = amountPaid.toString();
        const amountPaidAsInteger = this.convertFormattedFiguresToNumber(amountPaidAsString);
        return amountPaidAsInteger < this.totalAmount;
    }

    get conditionForCustomerValidationError() {
        return this.conditionForCustomerSelectedInSalesToBeCompulsory && this.selectedProduct.customerKey.length === 0;
    }

    set calculatePercentageDiscount(newValue: number) {
        newValue = Number(newValue);

        this.percentageDiscount = newValue;

        const nairaDiscount = (newValue / 100) * this.totalPriceOfItem;

        this.selectedProduct.discount = this.convertFormattedFiguresToNumber(nairaDiscount.toString());

        this.$emit('nairaDiscount', Number(this.convertNumberToTwoDecimalPlaces(nairaDiscount)));

        this.emitErrors(this.errors);
    }

    get calculatePercentageDiscount(): number {
        const percentageDiscount =
            (Number(this.convertFormattedFiguresToNumber(this.selectedProduct.discount.toString())) /
                this.totalPriceOfItem) *
                100 || 0;
        return Number(this.convertNumberToTwoDecimalPlaces(percentageDiscount));
    }

    get conditionForRecordEditInputToBeDisabled(): boolean {
        return !this.selectedProduct.productKey;
    }

    get conditionForDiscountInputToBeDisabled(): boolean {
        return (
            !this.selectedProduct.productKey ||
            !this.selectedProduct.unitPrice ||
            this.errors.quantity.length > 0 ||
            this.errors.price.length > 0
        );
    }

    get conditionForEditItemButtonToBeDisabled() {
        return !this.selectedProduct.productKey || this.atLeastOneErrorExists(this.errors);
    }

    get listOfProductItems() {
        const cloneOfProductItems = [...this.products.items];
        this.listOfProducts.items = cloneOfProductItems;
        return this.listOfProducts.items;
    }

    get indexOfSelectedProduct() {
        return this.listOfProductItems.findIndex(product => product.productKey === this.selectedProduct.productKey);
    }

    get buttonTextForEditSalesButton() {
        return this.anItemIsToBeEdited ? 'Edit Item' : 'Add Item';
    }

    get saleDate() {
        return (
            (this.isEditing && this.formatDateToFitCalendarFormat(this.selectedProduct.saleDate)) ||
            this.selectedProduct.saleDate
        );
    }

    set saleDate(newDate: string) {
        this.selectedProduct.saleDate = newDate;
    }

    public updateVatValue() {
        const { productVatKey } = this.selectedProduct;
        if (productVatKey === this.vatAdditionKey) {
            this.selectedProduct.vat = this.vatValue;
            this.addVatToTotalAmount = true;
            return;
        }
        this.selectedProduct.vat = 0;
        this.addVatToTotalAmount = false;
    }

    public calculateTotalAmount(): number {
        if (this.isEditing && this.itemToBeEditedVatIsRequired) {
            this.resetVatConditions();
        }
        this.updateVatValue();
        if (this.addVatToTotalAmount) {
            return this.selectedProduct.vat + this.subTotal;
        }
        return this.subTotal;
    }

    public resetVatConditions() {
        if (this.itemToBeEditedVatIsRequired) {
            this.selectedProduct.vat = this.vatOfItemToBeEdited;
            this.addVatToTotalAmount = true;
            this.resetVatOfItemToBeEdited();
            return;
        }
        this.selectedProduct.productVatKey = '';
        this.addVatToTotalAmount = false;
    }

    public resetVatOfItemToBeEdited() {
        this.$emit('resetVatOfItemToBeEdited');
    }

    public handleOrderCompletionSelection(value: boolean) {
        this.selectedProduct.isOutstandingOrder = value;
    }

    public openCreateNewCustomerModal() {
        this.$emit('open-create-new-customer-modal');
    }

    public openCreateNewProductModal() {
        this.$emit('open-create-new-product-modal');
    }

    public validateDiscount(discountValue: number, discountType: string) {
        if (!this.isNonNegativeNumber(discountValue) && discountValue) {
            this.errors[discountType] = 'Please enter a number greater than 0';
            return this.errors;
        }
        if (discountType === 'nairaDiscount' && Number(discountValue) > this.totalPriceOfItem) {
            this.errors[discountType] = "Discount can't be greater than total";
            return this.errors;
        }
        if (discountType === 'percentageDiscount' && Number(discountValue) > 100) {
            this.errors.nairaDiscount = '';
            this.errors[discountType] = 'Field cannot be greater than 100%';
            return this.errors;
        }
        if (discountType === 'nairaDiscount' && this.errors.percentageDiscount) {
            this.errors.percentageDiscount = '';
            return this.errors;
        }
        if (discountType === 'percentageDiscount' && this.errors.nairaDiscount) {
            this.errors.nairaDiscount = '';
            return this.errors;
        }

        this.errors[discountType] = '';
        this.emitErrors(this.errors);
        return this.errors;
    }

    public convertNumberToTwoDecimalPlaces(value: number) {
        return value.toFixed(2);
    }

    public handleMeasurementType(measurementTypeKey: string) {
        this.selectedProduct.measurementTypeKey = measurementTypeKey;
        this.validateMeasurementType(this.selectedProduct.measurementTypeKey, this.errors);
    }

    public handlePaymentType(e: TargetObject) {
        this.selectedProduct.paymentTypeName = e.target.options[e.target.selectedIndex].text;
        this.selectedProduct.paymentTypeKey = e.target.value;
        this.validatePaymentType();
    }

    public validatePaymentType() {
        this.validateEmptyFieldInput(this.selectedProduct.paymentTypeKey, 'paymentType', 'Select a value', this.errors);
        this.emitErrors(this.errors);
    }

    public validateOrderQuestion() {
        if (typeof this.selectedProduct.isOutstandingOrder !== 'boolean') {
            this.errors.orderQuestion = 'Please pick an option';
        } else {
            this.errors.orderQuestion = '';
        }
        this.emitErrors(this.errors);
    }

    public validateAmountPaid() {
        const amountPaidConvertedToString = ensurePossiblyNullValueReturnsString(
            this.selectedProduct.amountPaid,
        ).toString();
        const amountPaidAsInteger = this.convertFormattedFiguresToNumber(amountPaidConvertedToString);

        if (amountPaidAsInteger > this.totalAmount) {
            this.errors.amountPaid = 'Amount paid is more than total';
        } else {
            this.errors.amountPaid = '';
        }
        this.emitErrors(this.errors);
    }

    public validateSaleDate() {
        this.validateEmptyFieldInput(
            this.selectedProduct.saleDate,
            'saleDate',
            'Please enter a sales date',
            this.errors,
        );

        if (this.selectedProduct.saleDate && !this.isDateOnOrBeforeToday(this.selectedProduct.saleDate)) {
            this.errors.saleDate = 'Please enter a date on or before today';
        }

        this.emitErrors(this.errors);
    }

    private handleVatOptionChange() {
        this.validateVatType();
        this.updateVatValue();
    }

    public validateVatType() {
        this.validateEmptyFieldInput(
            this.selectedProduct.productVatKey,
            'vatType',
            'Please select a VAT type',
            this.errors,
        );
        this.emitErrors(this.errors);
    }

    public validateRecordSalesItemEditForm() {
        this.validateSelectedCustomer();
        this.validateMeasurementType(this.selectedProduct.measurementTypeKey, this.errors);
        this.validateDiscount(Number(this.selectedProduct.discount), 'nairaDiscount');
        this.validateDiscount(this.percentageDiscount, 'percentageDiscount');
        this.validateUnitPrice(
            this.convertFormattedFiguresToNumber(this.selectedProduct.unitPrice.toString()),
            this.errors,
        );
        this.validateQuantity(
            this.convertFormattedFiguresToNumber(this.selectedProduct.quantity.toString()),
            this.errors,
        );
        this.validateAmountPaid();
        this.validateVatType();
        this.validateSaleDate();
        this.validatePaymentType();
        this.validateOrderQuestion();
    }

    public clearEditItemForm() {
        this.selectedCustomer = { ...this.initialStateOfSelectedCustomer };
        this.selectedProduct = { ...this.initialStateOfSelectedProduct };
    }

    public findSelectedObjectFromArrayItemUsingKey(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        arrayItem: Array<any>,
        comparisonKey: string,
        sourceKeyProperty: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return ensureObjectHasValue(arrayItem.find(item => item[sourceKeyProperty] === comparisonKey));
    }

    public handleProductSelection(productKey: string) {
        this.resetVatConditions();
        this.updateVatValue();
        const objectOfSelectedProduct = this.findSelectedObjectFromArrayItemUsingKey(
            [...this.products.items],
            productKey,
            'productKey',
        );

        // prevent the resetting of a selected product when an item is to be selected during editing
        if (this.anItemIsToBeEdited) {
            this.selectedProduct = { ...this.itemToBeEdited };
            this.selectedProduct.productName = objectOfSelectedProduct.productName;
            this.selectedProduct.productKey = objectOfSelectedProduct.productKey;
        } else {
            this.selectedProduct = { ...objectOfSelectedProduct };
        }
    }

    public handleCustomerSelection(customerKey: string) {
        this.selectedCustomer = {
            customerKey,
        }; // this will be used to populate the customer field that will be cleared when a product is selected
        this.selectedProduct.customerKey = customerKey;
        this.validateSelectedCustomer();
    }

    public validateSelectedCustomer() {
        if (this.conditionForCustomerValidationError) {
            this.errors.customer = 'Please select a customer';
        } else {
            this.errors.customer = '';
        }
        this.emitErrors(this.errors);
    }

    public convertFormattedInputOfSelectedProductToNumber() {
        const amountPaidAsString = ensurePossiblyNullValueReturnsString(this.selectedProduct.amountPaid).toString();
        this.selectedProduct = {
            ...this.selectedProduct,
            unitPrice: this.convertFormattedFiguresToNumber(this.selectedProduct.unitPrice.toString()),
            quantity: this.convertFormattedFiguresToNumber(this.selectedProduct.quantity.toString()),
            amountPaid: this.convertFormattedFiguresToNumber(amountPaidAsString),
            discount: this.convertFormattedFiguresToNumber(this.selectedProduct.discount.toString()),
        };
    }

    public addOrEditSalesItem() {
        this.validateRecordSalesItemEditForm();
        if (!this.atLeastOneErrorExists(this.errors)) {
            this.convertFormattedInputOfSelectedProductToNumber();
            this.$set(this.selectedProduct, 'isDelete', false);
            if (this.anItemIsToBeEdited) {
                this.$emit('item-has-finished-being-edited', this.selectedProduct, this.indexOfItemToBeEdited);
            } else {
                // the editIndex will be used to identify a table item which is being edited
                this.$set(this.selectedProduct, 'editIndex', this.editIndex);
                this.$emit('add-item-to-sales-table', this.selectedProduct);
                this.editIndex += 1;
            }
            this.clearEditItemForm();
        }
    }

    @Watch('selectedProduct.amountPaid')
    amountPaidHasChanged(newValue: string) {
        const amountPaid = ensurePossiblyNullValueReturnsString(newValue);
        const formattedAmountPaid = this.formatFiguresToCurrency(amountPaid.toString());
        const amountPaidInteger = this.convertFormattedFiguresToNumber(amountPaid.toString());
        this.$nextTick(() => {
            this.selectedProduct.amountPaid = formattedAmountPaid;
        });
        if (amountPaidInteger >= 0) {
            this.validateSelectedCustomer();
        }
    }

    @Watch('itemToBeDeleted')
    itemToBeDeletedHasChanged(newValue: SalesProduct) {
        if (newValue.editIndex === this.itemToBeEdited.editIndex) {
            this.clearEditItemForm();
            this.$emit('delete-item-being-edited');
        }
        // if there is an item to be edited, delete and clear the form
    }

    @Watch('totalAmount')
    totalAmountHasChanged(newValue: number) {
        this.updateVatValue();
        this.selectedProduct.productAmount = newValue;
        const amountPaidAsString = ensurePossiblyNullValueReturnsString(this.selectedProduct.amountPaid.toString());
        const amountPaidAsInteger = this.convertFormattedFiguresToNumber(amountPaidAsString);

        if (amountPaidAsInteger) {
            this.validateAmountPaid();
        }
    }

    @Watch('itemToBeEdited')
    itemToBeEditedHasChanged(newValue: SalesProduct) {
        this.selectedProduct = newValue;
        this.selectedCustomer.customerKey = newValue.customerKey;
        /* validate the form if a new item is edited after another
         to clear existing errors in the RecordSalesitemEditForm */
        if (newValue.editIndex) {
            this.validateRecordSalesItemEditForm();
        }
    }

    @Watch('measurementTypeKey')
    measurementTypeKeyChanged(newValue: string) {
        this.$emit('measurement-type-key-changed', newValue);
    }

    @Watch('selectedProduct.productKey')
    selectedProductChanged() {
        if (!this.aSaleItemHasBeenSelectedInitially) {
            this.$emit('sales-item-has-been-selected-initally');
        }
    }

    @Watch('selectedProduct.isOutstandingOrder')
    orderQuestionAnswerChanged() {
        // this is solely to remove the error border around the question when no option is picked
        if (this.selectedProduct.isOutstandingOrder !== null) {
            this.validateOrderQuestion();
        }
    }

    @Watch('selectedProduct.discount')
    convertChangedNairaDiscountValueToNumber(newValue: number) {
        const formattedDiscount = this.formatFiguresToCurrency(newValue.toString());
        this.$nextTick(() => {
            this.selectedProduct.discount = formattedDiscount;
        });
    }

    @Watch('selectedProduct.quantity')
    convertChangedQuantityToNumber(newValue: number) {
        this.updateVatValue();
        const formattedQuantity = this.formatFiguresToCurrency(newValue.toString());
        this.$nextTick(() => {
            this.selectedProduct.quantity = formattedQuantity;
        });
    }

    @Watch('selectedProduct.unitPrice')
    convertChangedUnitPriceToNumber(newValue: number) {
        this.updateVatValue();
        const formattedPrice = this.formatFiguresToCurrency(newValue.toString());
        this.$nextTick(() => {
            this.selectedProduct.unitPrice = formattedPrice;
        });
    }

    @Watch('selectedProduct.customerKey')
    selectedCustomerChanged(newValue: string) {
        const conditionWhenProductFieldIsChosenAndThereIsAlreadyACustomerSelected =
            this.selectedCustomer.customerKey.length > 0 && newValue.length === 0;

        if (conditionWhenProductFieldIsChosenAndThereIsAlreadyACustomerSelected) {
            this.selectedProduct.customerKey = this.selectedCustomer.customerKey;
        }
    }

    mounted() {
        productModule = getModule(ProductModule, this.$store);
        productModule.getVatOption();
    }
}
</script>
