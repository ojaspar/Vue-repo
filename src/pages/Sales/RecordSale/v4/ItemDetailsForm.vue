<template>
    <div class="item-details-form">
        <!-- Transaction Date -->
        <FormattedDatePicker
            v-if="!userIsOnMobile"
            :defaultDate="transactionDate"
            :disabled="itemIsEditing"
            @date-selected="handleDateSelection"
        />

        <!-- Form Header -->
        <div class="item-details-form__header">{{ headerText }}</div>

        <div class="item-details-form__body">
            <!-- Product Selection... New Products should not be added here-->
            <b-row class="m-0">
                <b-col class="p-0 mt-3" v-if="!itemIsEditing && productsShouldShow">
                    <ListDropdownAndAddBar
                        addEntityText=""
                        placeholder="Select Product"
                        :entityList="products"
                        entityKey="productKey"
                        dateKey="lastTransactionDate"
                        entityNameKey="name"
                        :newEntityCreated="newSaleItemCreated"
                        :createdEntity="createdProduct"
                        :requestIsLoading="productRequestIsLoading"
                        :autoFocus="true"
                        @add-entity-button-clicked="showSaleItemModal"
                        @resource-selected="handleProductSelection"
                        @search-string-changed="updateSearchString"
                        @entity-list-hidden="handleProductListDismissal"
                    />
                </b-col>

                <b-col v-else class="p-0 item-details-form__product-list-container">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Product Name"
                        :value="selectedProductName"
                        :disabled="productRequestIsLoading || itemIsEditing"
                        :errors="itemDetailsError.name"
                        @change="validateSelectedProduct(selectedProductName)"
                        @focus="showProducts"
                    />

                    <Loader size="2" class="item-details-form__product-list-loader" v-if="productRequestIsLoading" />
                </b-col>
            </b-row>

            <div class="item-details-form__row">
                <div class="item-details-form__col">
                    <!-- Unit Price -->
                    <div class="item-details-form__col--amount">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            v-if="!userIsOnDesktop"
                            :floatingLabelText="
                                wrapFloatingLabelTextWithCurrencySymbol('Unit Price', selectedCurrencyKey)
                            "
                            :value="unformattedUnitPrice"
                            :errors="itemDetailsError.unitPrice"
                            :disabled="itemIsEditing"
                            @input="formatAndValidateUnitPrice"
                        />
                        <BaseInputFieldWithBorderAndFloatingLabel
                            v-else
                            :floatingLabelText="
                                wrapFloatingLabelTextWithCurrencySymbol('Unit Price', selectedCurrencyKey)
                            "
                            :value="formattedUnitPrice"
                            :disabled="itemIsEditing"
                            :errors="itemDetailsError.unitPrice"
                            @input="formatAndValidateUnitPrice"
                        />
                        <span
                            v-if="!itemIsEditing && !shouldShowDiscount && formattedUnitPrice"
                            class="item-details-form__include-discount"
                            @click="showDiscount"
                        >
                            Include Discount
                        </span>
                    </div>

                    <div class="item-details-form__col--currency">
                        <!-- Currency -->
                        <BaseSelectWithBorderAndFloatingLabel
                            v-if="availableCurrencies"
                            defaultOptionText="Select Currency"
                            keyProperty="currencyKey"
                            valueProperty="currencyKey"
                            textProperty="currencyName"
                            :disabled="itemIsEditing"
                            :options="availableCurrencies"
                            v-model="itemDetailsForm.unitPrice.currencyKey"
                        />
                    </div>
                </div>

                <div class="item-details-form__col">
                    <!-- Quantity -->
                    <div class="item-details-form__col--quantity">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Quantity"
                            :value="formattedQuantity"
                            :disabled="itemIsEditing"
                            :errors="itemDetailsError.quantity"
                            @input="formatAndValidateQuantity"
                        />

                        <!-- Item Delivery Status -->
                        <BaseCheckbox
                            v-if="showItemDeliveryStatusChecker"
                            inputContainerClass="item-details-form__checkbox--input"
                            labelText="Delivery Complete"
                            labelClass="item-details-form__checkbox--label"
                            id="delivery-status"
                            v-model="supplyCompleted"
                            :disabled="itemIsEditing"
                            @change="toggleItemDeliveryStatus"
                        />
                    </div>

                    <!-- Measurement Type -->
                    <div class="item-details-form__col--unit">
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultOptionText="Measurement Type"
                            keyProperty="name"
                            valueProperty="name"
                            textProperty="name"
                            :options="measurementTypes"
                            v-model="itemDetailsForm.measurementType"
                        />
                    </div>
                </div>

                <div class="item-details-form__col" v-if="!userIsOnDesktop && !shouldShowDiscount">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        containerClass="w-100"
                        :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Net Amount', selectedCurrencyKey)"
                        :disabled="true"
                        :value="netAmount | amountWithCurrency"
                    />
                </div>
            </div>

            <transition name="slide-up-fade" mode="out-in" v-if="discountWithFullSupply">
                <div>
                    <div class="item-details-form__rowD">
                        <!-- Discount -->
                        <div class="item-details-form__col--left">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="
                                    wrapFloatingLabelTextWithCurrencySymbol('Discount', selectedCurrencyKey)
                                "
                                :value="formattedDiscount"
                                :disabled="itemIsEditing"
                                :errors="itemDetailsError.discount"
                                @input="formatAndValidateDiscount"
                            />
                        </div>

                        <!-- Discount Percentage -->
                        <div class="item-details-form__col--right">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Discount (%)"
                                :value="formattedDiscountPercent"
                                :errors="itemDetailsError.discountPercent"
                                :disabled="itemIsEditing"
                                @input="formatAndValidateDiscountPercentage"
                            />
                        </div>
                    </div>
                    <div class="item-details-form__row">
                        <!-- Amount -->
                        <div class="item-details-form__col--full">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="
                                    wrapFloatingLabelTextWithCurrencySymbol('Net Amount', selectedCurrencyKey)
                                "
                                :disabled="true"
                                :value="netAmount | amountWithCurrency"
                            />
                        </div>
                    </div>
                </div>
            </transition>

            <transition name="slide-up-fade" mode="out-in" v-if="incompleteSupplyNoDiscount">
                <div class="item-details-form__row">
                    <div class="item-details-form__col">
                        <div class="d-flex w-100">
                            <!-- Quantity Supplied-->
                            <div class="item-details-form__col--received">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Quantity Supplied"
                                    :value="formattedQuantitySupplied"
                                    :disabled="itemIsEditing"
                                    :errors="itemDetailsError.quantitySupplied"
                                    @input="formatAndValidateQuantitySupplied"
                                />
                            </div>

                            <!-- Quantity Remaining -->
                            <div class="item-details-form__col--remaining">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Quantity Remaining"
                                    :disabled="true"
                                    :value="balanceQuantity"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Supply Due Date -->
                    <div class="item-details-form__col--supply-due-date">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Supply Due Date"
                            :disableDatesTo="transactionDate"
                            :disabled="disableSupplyDueDate"
                            :errors="itemDetailsError.supplyDueDate"
                            v-model="itemDetailsForm.supplyDueDate"
                            @input="performValidateSupplyDueDate"
                        />
                    </div>
                </div>
            </transition>

            <transition name="slide-up-fade" mode="out-in" v-if="discountWithIncompleteSupply">
                <div>
                    <div class="item-details-form__row">
                        <div class="item-details-form__col">
                            <div class="d-flex w-100">
                                <!-- Discount-->
                                <div class="item-details-form__col--received">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :floatingLabelText="
                                            wrapFloatingLabelTextWithCurrencySymbol('Discount', selectedCurrencyKey)
                                        "
                                        :value="formattedDiscount"
                                        :disabled="itemIsEditing"
                                        :errors="itemDetailsError.discount"
                                        @input="formatAndValidateDiscount"
                                    />
                                </div>

                                <!-- Discount % -->
                                <div class="item-details-form__col--remaining">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        floatingLabelText="Discount (%)"
                                        :value="formattedDiscountPercent"
                                        :disabled="itemIsEditing"
                                        :errors="itemDetailsError.discountPercent"
                                        @input="formatAndValidateDiscountPercentage"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="item-details-form__col" v-if="!userIsOnDesktop">
                            <div class="d-flex w-100">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    containerClass="w-100"
                                    :floatingLabelText="
                                        wrapFloatingLabelTextWithCurrencySymbol('Net Amount', selectedCurrencyKey)
                                    "
                                    :disabled="true"
                                    :value="netAmount | amountWithCurrency"
                                />
                            </div>
                        </div>
                        <div class="item-details-form__col">
                            <div class="d-flex w-100">
                                <!-- Quantity Received-->
                                <div class="item-details-form__col--received">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        floatingLabelText="Quantity Supplied"
                                        :disabled="itemIsEditing"
                                        :value="formattedQuantitySupplied"
                                        :errors="itemDetailsError.quantitySupplied"
                                        @input="formatAndValidateQuantitySupplied"
                                    />
                                </div>

                                <!-- Quantity Remaining -->
                                <div class="item-details-form__col--remaining">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        floatingLabelText="Quantity Remaining"
                                        :disabled="true"
                                        :value="balanceQuantity"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item-details-form__row">
                        <!-- Amount -->
                        <div class="item-details-form__col" v-if="userIsOnDesktop">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="
                                    wrapFloatingLabelTextWithCurrencySymbol('Net Amount', selectedCurrencyKey)
                                "
                                :disabled="true"
                                :value="netAmount | amountWithCurrency"
                            />
                        </div>
                        <!-- Amount -->
                        <div class="item-details-form__col">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                containerClass="w-100"
                                floatingLabelText="Supply Due Date"
                                :disableDatesTo="transactionDate"
                                :disabled="disableSupplyDueDate"
                                :errors="itemDetailsError.supplyDueDate"
                                v-model="itemDetailsForm.supplyDueDate"
                                @input="performValidateSupplyDueDate"
                            />
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Notes -->
            <b-row class="m-0">
                <b-col class="p-0">
                    <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="itemDetailsForm.notes" />
                </b-col>
            </b-row>

            <b-row class="item-details-form__footer">
                <GeneralFormError :message="generalFormError" />

                <!--Customer Error -->
                <CustomerAlert :showAlert="showCustomerAlert" @action-taken="$emit('display-customer-list')" />

                <!-- Form Button -->
                <BaseSecondaryButton
                    :buttonText="buttonText"
                    :disabled="disableFormButton"
                    @button-clicked="handleItemDetailsForm"
                />
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import CustomerAlert from '@/pages/Sales/RecordSale/v4/CustomerAlert.vue';

import {
    SelectedItemDetails,
    defaultItemDetails,
    defaultSelectedItems,
    SaleItemDetails,
} from '@/pages/Sales/RecordSale/v4/types';
import { Product, defaultCustomer, initialStateOfProduct, SaleCustomer, ProductRequest } from '@/pages/Sales/types';
import { MeasurementType, MoneyObject, PaymentAccount, Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SalesValidations from '@/pages/Sales/RecordSale/v4/validations';

import SessionStorageService from '@/services/sessionStorage';

const products = namespace('product');
const sales = namespace('sale');

@Component({ components: { CustomerAlert } })
export default class SaleItemDetailsForm extends Mixins(UtilityMixins, CurrencyMixins, SalesValidations) {
    @Prop({ default: 0 }) readonly selectedCurrencyKey!: number;
    @Prop({ default: 0 }) readonly cartCount!: number;
    @Prop({ required: false }) readonly isEstimate!: boolean;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ required: true }) readonly itemIsEditing!: boolean;
    @Prop({ default: () => defaultSelectedItems }) readonly itemToBeEdited!: SelectedItemDetails;
    @Prop({ default: '' }) readonly redirectedFrom!: string;

    private saleSearchString = '';
    private addingNewSaleItem = false;
    private newSaleItemCreated = false;
    private selectedProduct: Product = { ...initialStateOfProduct };
    private createdProduct: Product = { ...initialStateOfProduct };
    private clearSearchString = false;
    private productsShouldShow = false;
    private supplyCompleted = true;

    private shouldShowDiscount = false;

    private formattedDiscount = '';
    private discountPercentage = 0;
    private formattedDiscountPercent = '';

    private formattedUnitPrice = '';
    private unformattedUnitPrice = '';
    private formattedQuantity = '1';
    private formattedQuantitySupplied = '1';

    private itemDetailsForm: SaleItemDetails = {
        ...defaultItemDetails,
        name: this.selectedProductName,
        unitPrice: { amount: 0, currencyKey: this.selectedCurrencyKey },
        transactionDate: this.transactionDate,
    };

    @products.State
    private measurementTypes!: MeasurementType[];

    @products.State
    public productRequests!: ProductRequest;

    @products.State
    public products!: Array<Product>;

    @sales.State
    private paymentAccounts!: Array<PaymentAccount>;

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get productRequestIsLoading(): boolean {
        return this.productRequests.getProducts === Status.LOADING;
    }

    get disableFormButton(): boolean {
        return !this.itemDetailsFormIsValidated || this.showCustomerAlert;
    }

    get disableSupplyDueDate(): boolean {
        const { quantity, quantitySupplied } = this.itemDetailsForm;
        return this.itemIsEditing || quantity == quantitySupplied;
    }

    get buttonText() {
        return this.itemIsEditing ? 'Update' : this.cartCount > 0 ? 'Add to List' : 'Next';
    }

    get headerText() {
        return this.itemIsEditing ? 'Edit Item' : this.cartCount > 0 ? 'Add Another Item' : 'Add Item';
    }

    get customerIsSelected() {
        return this.selectedCustomer.name.length > 0;
    }

    get selectedProductName(): string {
        return this.selectedProduct.name;
    }

    get discountWithFullSupply(): boolean {
        return this.shouldShowDiscount && this.supplyCompleted;
    }

    get discountWithIncompleteSupply(): boolean {
        return this.shouldShowDiscount && !this.supplyCompleted;
    }

    get incompleteSupplyNoDiscount(): boolean {
        return !this.shouldShowDiscount && !this.supplyCompleted;
    }

    get balanceQuantity(): string {
        const { quantity, quantitySupplied } = this.itemDetailsForm;
        const balanceQuantity = quantity - quantitySupplied;
        if (this.quantitySuppliedInputFieldHasError || this.quantityInputFieldHasError) return '0';
        return this.convertFigureToCurrency(balanceQuantity) || '0';
    }

    get quantityInputFieldHasError(): boolean {
        const quantityInputError = this.itemDetailsError.quantity;
        return this.hasError(quantityInputError);
    }

    get quantitySuppliedInputFieldHasError(): boolean {
        const quantitySuppliedInputError = this.itemDetailsError.quantitySupplied;
        return this.hasError(quantitySuppliedInputError);
    }

    get amountBeforeDiscount(): number {
        const { quantity, unitPrice } = this.itemDetailsForm;
        return quantity * unitPrice.amount;
    }

    get netAmount(): MoneyObject {
        const { quantity, unitPrice, discount } = this.itemDetailsForm;
        const net = quantity * unitPrice.amount - discount;

        return { amount: net, currencyKey: unitPrice.currencyKey };
    }

    get showItemDeliveryStatusChecker() {
        return !this.quantityInputFieldHasError && !this.isEstimate;
    }

    get showCustomerAlert() {
        return (!this.supplyCompleted || this.isEstimate) && !this.customerIsSelected;
    }

    private getMeasurementTypeFromName(name: string) {
        return this.measurementTypes.find((measurementType: MeasurementType) => measurementType.name === name);
    }

    private getMeasurementTypeKey(name: string) {
        const thisName = name ? name : 'Unit';
        const measurementTypeChosen = this.getMeasurementTypeFromName(thisName);
        if (measurementTypeChosen) {
            return measurementTypeChosen.key;
        }
        return '';
    }

    private showDiscount() {
        this.shouldShowDiscount = true;
    }

    private handleDateSelection(selectedDate: string) {
        this.$emit('update-transaction-date', selectedDate);
    }

    private updateSearchString(searchString: string, clearValue = false) {
        this.saleSearchString = searchString;
        this.clearSearchString = clearValue;
    }

    private toggleItemDeliveryStatus() {
        this.supplyCompleted = !this.supplyCompleted;
        if (this.supplyCompleted) {
            const { quantity } = this.itemDetailsForm;
            this.setItemQuantitySupplied(quantity);
        }

        //supply-status-change
        this.$emit('supply-status-change', this.supplyCompleted);

        this.validateItemDetailsForm(this.itemDetailsForm, this.supplyCompleted);
    }

    private showProducts() {
        this.productsShouldShow = true;
    }

    private hideProducts() {
        this.updateSearchString('', true);
        this.productsShouldShow = false;
    }

    private showSaleItemModal() {
        this.addingNewSaleItem = true;
    }

    private hideSaleItemModal() {
        this.addingNewSaleItem = false;
    }

    private handleProductSelection(saleItem: Product) {
        this.itemDetailsForm.name = saleItem.name;
        const lastSalePrice = saleItem.lastSalePrice?.amount;

        if (lastSalePrice) {
            this.formatAndValidateUnitPrice(lastSalePrice.toString());

            if (this.formattedDiscountPercent) this.formatAndValidateDiscountPercentage(this.formattedDiscountPercent);
        }

        this.setMeasurementType(saleItem.measurementTypeKey);

        this.setSelectedProduct(saleItem);
        this.hideProducts();
    }

    private setMeasurementType(measurementTypeKey: string) {
        const measurementType = this.measurementTypes.find(
            (measurementType: MeasurementType) => measurementType.key === measurementTypeKey,
        );

        if (!measurementType) return;

        this.itemDetailsForm.measurementTypeKey = measurementType.key;
        this.itemDetailsForm.measurementType = measurementType.name;
    }

    private setSelectedProduct(selectedProduct: Product) {
        this.selectedProduct = selectedProduct;
    }

    private handleProductListDismissal() {
        if (this.addingNewSaleItem) return;
        this.hideProducts();
        this.validateSelectedProduct(this.itemDetailsForm.name);
    }

    private formatAndValidateUnitPrice(amountEntered: string) {
        this.unformattedUnitPrice = amountEntered;

        const amount = this.convertFormattedFiguresToNumber(amountEntered);
        if (this.validateUnitPrice(String(amount))) {
            this.formattedUnitPrice = this.convertFigureToCurrency(amount);
            this.$set(this.itemDetailsForm, 'unitPrice', { amount, currencyKey: this.selectedCurrencyKey });

            if (this.formattedDiscountPercent) this.formatAndValidateDiscountPercentage(this.formattedDiscountPercent);

            return;
        }

        if (amount) this.formattedUnitPrice = this.convertFigureToCurrency(amount);
        else this.formattedUnitPrice = amountEntered;
    }

    private formatAndValidateQuantity(quantity: string) {
        const quantityAmount = this.convertFormattedFiguresToNumber(quantity);
        const quantitySupplied = this.itemDetailsForm.quantitySupplied;
        if (this.validateQuantity(String(quantityAmount), String(quantitySupplied), this.supplyCompleted)) {
            this.$set(this.itemDetailsForm, 'quantity', quantityAmount);
            this.formattedQuantity = this.convertFigureToCurrency(quantityAmount);

            this.formatAndValidateDiscountPercentage(this.formattedDiscountPercent);
            return;
        }
        this.formattedQuantity = '';
        this.itemDetailsForm.quantity = 1;
    }

    private formatAndValidateQuantitySupplied(quantitySupplied: string) {
        const quantitySuppliedAmount = this.convertFormattedFiguresToNumber(quantitySupplied);
        this.formattedQuantitySupplied = this.convertFigureToCurrency(quantitySuppliedAmount);
        const quantity = this.itemDetailsForm.quantity;
        this.validateQuantitySupplied(String(quantitySuppliedAmount), String(quantity));
        this.setItemQuantitySupplied(quantitySuppliedAmount);
    }

    private setItemQuantitySupplied(quantitySupplied: number) {
        this.$set(this.itemDetailsForm, 'quantitySupplied', quantitySupplied);
        this.formattedQuantitySupplied = this.convertFigureToCurrency(quantitySupplied);
    }

    private formatAndValidateDiscount(discountText: string) {
        const discount = this.convertFormattedFiguresToNumber(discountText);
        const { quantity, unitPrice } = this.itemDetailsForm;
        const amountBeforeDiscount = quantity * unitPrice.amount;

        if (this.validateDiscount(String(discount), amountBeforeDiscount)) {
            this.formattedDiscount = this.convertFigureToCurrency(discount);
            this.$set(this.itemDetailsForm, 'discount', discount);

            this.$nextTick(() => {
                this.calculateDiscountPercentage();
            });

            this.itemDetailsError['discountPercent'] = '';

            return;
        }

        if (discount) this.formattedDiscount = this.convertFigureToCurrency(discount);
        else this.formattedDiscount = discountText;
    }

    private calculateDiscountPercentage() {
        const { discount } = this.itemDetailsForm;

        const discountPercent = (discount / this.amountBeforeDiscount) * 100;
        this.discountPercentage = discountPercent;

        if (discountPercent < 0.005) this.formattedDiscountPercent = '0.00';
        else this.formattedDiscountPercent = this.roundN(discountPercent, 2);

        this.validateDiscountPercentage(String(discountPercent));
    }

    private formatAndValidateDiscountPercentage(discountPercentText: string) {
        const discountPercent = this.convertFormattedFiguresToNumber(discountPercentText);

        if (this.validateDiscountPercentage(String(discountPercent))) {
            this.formattedDiscountPercent = this.convertFigureToCurrency(discountPercent);
            // set the discount amount
            const roundedDiscount = this.roundN((discountPercent / 100) * this.amountBeforeDiscount, 2);

            this.$set(this.itemDetailsForm, 'discount', Number(roundedDiscount));

            this.formattedDiscount = this.convertFigureToCurrency(roundedDiscount);
            this.itemDetailsError['discount'] = '';

            return;
        }
        this.formattedDiscountPercent = discountPercentText;
    }

    private performValidateSupplyDueDate() {
        const { quantity, quantitySupplied, supplyDueDate } = this.itemDetailsForm;

        this.validateSupplyDueDate(quantity - quantitySupplied, supplyDueDate, this.transactionDate);
    }

    private handleItemDetailsForm() {
        this.validateItemDetailsForm(this.itemDetailsForm, this.supplyCompleted);
        if (!this.itemDetailsFormIsValidated || this.showCustomerAlert) return;
        this.addItemToList();
        this.resetItemForm();
    }

    private addItemToList() {
        const modifiedDetails = {
            ...this.itemDetailsForm,
            measurementTypeKey: this.getMeasurementTypeKey(this.itemDetailsForm.measurementType),
        };
        this.$emit('add-item-to-list', this.selectedProduct, modifiedDetails);
    }

    private resetItemForm() {
        this.selectedProduct = { ...initialStateOfProduct };
        this.itemDetailsForm = { ...defaultItemDetails };
        this.formattedUnitPrice = '';
        this.formattedQuantity = '1';
        this.formattedQuantitySupplied = '1';
        this.supplyCompleted = true;
    }

    private setEditingItemDetails(saleItemDetails: SaleItemDetails) {
        const {
            name,
            unitPrice,
            quantity,
            quantitySupplied,
            discount,
            measurementType,
            measurementTypeKey,
            notes,
            transactionDate,
            supplyDueDate,
        } = saleItemDetails;
        this.itemDetailsForm.name = name;
        this.itemDetailsForm.unitPrice = unitPrice;
        this.itemDetailsForm.quantity = quantity;
        this.itemDetailsForm.quantitySupplied = quantitySupplied;
        this.itemDetailsForm.discount = discount;
        this.itemDetailsForm.measurementType = measurementType;
        this.itemDetailsForm.measurementTypeKey = measurementTypeKey;
        this.itemDetailsForm.notes = notes;
        this.itemDetailsForm.transactionDate = transactionDate;
        this.itemDetailsForm.supplyDueDate = supplyDueDate;
        this.formattedUnitPrice = this.convertFigureToCurrency(unitPrice.amount);
        this.formattedQuantity = this.convertFigureToCurrency(quantity);
        this.formattedQuantitySupplied = this.convertFigureToCurrency(quantitySupplied);
        this.supplyCompleted = quantity === quantitySupplied;
        this.shouldShowDiscount = discount > 0;

        if (discount > 0) {
            this.formatAndValidateDiscount(discount.toString());
        }
    }

    private prefillFormWithItemDetails() {
        const { selectedProduct, saleItemDetails } = this.itemToBeEdited;
        this.setSelectedProduct(selectedProduct);
        this.setEditingItemDetails(saleItemDetails);
    }

    @Watch('itemDetailsForm.quantity')
    updateQuatityReceived(quantity: number) {
        if (!this.supplyCompleted) return;
        this.setItemQuantitySupplied(quantity);
    }

    @Watch('itemDetailsForm.quantitySupplied')
    checkQuantitySupplied(quantitySupplied: number) {
        const { quantity } = this.itemDetailsForm;
        if (quantity == quantitySupplied) {
            this.supplyCompleted = true;
            this.clearSupplyDueDateError();
        }
    }

    @Watch('itemToBeEdited', { immediate: true, deep: true })
    hadleItemEditing() {
        if (!this.itemIsEditing) return;
        this.resetItemDetailsFormErrors();
        this.prefillFormWithItemDetails();
    }

    @Watch('products', { deep: true })
    checkIfItemShouldBePreselected() {
        const { query } = this.$route;

        if (query.redirectedFrom !== 'stockitem') return;

        let selectedItem = SessionStorageService.getItem('stock-item');

        if (!selectedItem) return;
        selectedItem = JSON.parse(selectedItem);

        const selectedProduct = this.products.find((product: Product) => product.name.match(selectedItem?.name));

        if (!selectedProduct) return;

        this.handleProductSelection(selectedProduct);

        // preselect the item
    }

    prefillProduct() {
        if (this.cartCount > 0) return;

        const productKey = this.$route.params.productKey;
        if (productKey) {
            const thisProduct = this.products.find((p: Product) => p.productKey == productKey);
            if (thisProduct) this.handleProductSelection(thisProduct);
        }
    }

    mounted() {
        this.prefillProduct();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/item-details-form';
</style>
