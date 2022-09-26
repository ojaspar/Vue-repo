<template>
    <b-container fluid class="p-0">
        <div class="add-product">
            <SaleItemSummaryCard
                :productDetails="productDetailsForSummaryCard"
                @edit-icon-clicked="handleEditIconClicked"
                :canEdit="true"
            />

            <b-row>
                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Quantity"
                        className="add-product__text-input-field"
                        :value="quantityText"
                        :errors="addProductToSalesFormError.quantity"
                        @input="handleQuantityInput"
                    />
                </b-col>

                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :floatingLabelText="
                            wrapFloatingLabelTextWithCurrencySymbol('Net Price', form.unitPrice.currencyKey)
                        "
                        className="add-product__text-input-field"
                        :value="netPriceMoney"
                        :disabled="true"
                    />
                </b-col>
            </b-row>

            <BaseSelectWithBorderAndFloatingLabel
                floatingLabelText="VAT"
                :options="vatOptions"
                valueProperty="name"
                textProperty="displayName"
                keyProperty="key"
                @input="handleVatTypeSelection"
                :value="vatName"
            />

            <b-row v-if="vatAmount !== 0">
                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Price Excl. VAT"
                        className="add-product__text-input-field"
                        :value="convertFigureToCurrency(priceExcludingVat)"
                        :disabled="true"
                    />
                </b-col>

                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="VAT Amount"
                        className="add-product__text-input-field"
                        :disabled="true"
                        :value="convertFigureToCurrency(vatAmount)"
                    />
                </b-col>
            </b-row>

            <BaseInputFieldWithBorderAndFloatingLabel
                :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Total', form.unitPrice.currencyKey)"
                className="add-product__text-input-field"
                :disabled="true"
                :value="totalAmountMoney"
            />
            <BaseCheckboxWithBorderAndFloatingLabel
                floatingLabelText="Supply Schedule"
                labelText="Instant Supply"
                labelClass="add-product__checkbox-label"
                :value="instantSupply"
                v-if="showSupplySchedule"
                @change="handleInstantSupplySelection"
            />

            <div class="add-product__instant-supply-section" v-if="!instantSupply && !isEstimate">
                <b-row>
                    <b-col>
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Quantity Supplied"
                            className="add-product__text-input-field"
                            inputContainerClass="add-product__quantity-supplied-field-container"
                            :overRideContainerClass="true"
                            v-model="quantitySuppliedText"
                            :errors="addProductToSalesFormError.quantitySupplied"
                            @input="handleQuantitySuppliedChange"
                        />
                    </b-col>
                    <b-col>
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Remainder"
                            className="add-product__text-input-field"
                            inputContainerClass="add-product__quantity-supplied-field-container"
                            :overRideContainerClass="true"
                            :value="remainder"
                            :disabled="true"
                        />
                    </b-col>
                </b-row>
                <div v-if="showSupplyDueDate">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        floatingLabelText="Supply Due Date"
                        :value="form.supplyDueDate"
                        :errors="addProductToSalesFormError.supplyDueDate"
                        @change="handleSupplyDueDateChange"
                    />
                </div>
            </div>

            <BaseFileInputWithBorderAndFloatingLabel floatingLabelText="Attachments" v-if="false" />

            <BaseTextAreaWithBorderAndFloatingLabel
                floatingLabelText="Notes"
                className="add-product__notes-text-area-field"
                v-model="form.notes"
            />

            <BaseButton
                :buttonText="submitButtonText"
                className="add-product__add-product-button"
                :overRideButtonClass="true"
                :disabled="disableSubmitButton"
                @button-clicked="handleAddProductToCart"
            />
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import SaleItemSummaryCard from '@/pages/Sales/SaleItemSummaryCard.vue';

import { AddProductToSalesForm, Product, ProductSummary, SalesItemSummary, TaxForms } from '@/pages/Sales/types';

import ProductModule from '@/store/modules/product';

import { VatOption } from '@/types';
import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SalesServiceMixin from '@/mixins/SalesService';

import deepCloneFunction from '@/utils/deepCloneFunction';

const products = namespace('product');
let productModule: ProductModule;

@Component({
    components: {
        SaleItemSummaryCard,
    },
})
export default class AddProductToSales extends Mixins(UtilityMixins, CurrencyMixins, SalesServiceMixin) {
    private searchString = '';
    private inputVariable = [];
    private form: AddProductToSalesForm = {
        productKey: '',
        name: '',
        unitPrice: { amount: 0, currencyKey: 0 },
        measurementTypeKey: '',
        quantity: 1,
        discount: { amount: 0, currencyKey: 0 },
        vatTypeKey: '',
        quantitySupplied: 0,
        supplyDueDate: '',
        attachmentArray: [],
        notes: '',
    };
    private vatName = 'None';
    private instantSupply = true;

    private quantityText = '';
    private quantitySuppliedText = '';

    @products.State
    private vatOptions!: Array<VatOption>;

    @Prop({ required: true }) readonly isCustomerCompulsory!: boolean;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: false }) readonly transactionWithoutCustomer!: boolean;
    @Prop({}) readonly selectedProduct!: Product;
    @Prop({}) readonly productDetails!: SalesItemSummary;
    @Prop({}) readonly editMode!: boolean;
    @Prop({}) readonly itemToBeEdited!: AddProductToSalesForm;
    @Prop({}) readonly selectedSalesCurrency!: string | number;

    get showSupplySchedule(): boolean {
        if (this.isEstimate) return false;
        if (this.transactionWithoutCustomer) return false;

        return true;
    }

    get netPrice(): number {
        const { quantity } = this.form;
        const { amount } = this.productDetails.unitPrice;
        const { discount } = this.productDetails;

        return quantity === 0
            ? Number(amount) - Number(discount.amount)
            : quantity * Number(amount) - Number(discount.amount);
    }

    get netPriceMoney(): string {
        const netMoney = {
            amount: this.netPrice,
            currencyKey: this.form.unitPrice.currencyKey,
        };

        return this.$options.filters.amountWithCurrency(netMoney);
    }

    get totalAmountMoney(): string {
        const tMoney = {
            amount: this.totalAmount,
            currencyKey: this.form.unitPrice.currencyKey,
        };

        return this.$options.filters.amountWithCurrency(tMoney);
    }

    get vatAmount(): number {
        const { vatName } = this;

        if (vatName === TaxForms.NONE) {
            return 0;
        }

        let vat = 0.075 * this.netPrice;

        if (vatName === TaxForms.INCLUSIVE) {
            vat = (7.5 * this.netPrice) / 107.5;
        }

        return Number(this.roundN(vat, 2));
    }

    get totalAmount(): number {
        if (this.vatName === TaxForms.EXCLUSIVE) {
            return this.vatAmount + this.netPrice;
        }

        return this.netPrice;
    }

    get remainder(): number {
        const { quantitySupplied, quantity } = this.form;
        return Number(quantity) - Number(quantitySupplied) < 0 ? 0 : Number(quantity) - Number(quantitySupplied);
    }

    get priceExcludingVat(): number {
        return this.totalAmount - this.vatAmount;
    }

    get productDetailsForSummaryCard(): SalesItemSummary {
        return {
            name: this.selectedProduct.name,
            unitPrice: {
                ...this.productDetails.unitPrice,
                currencyKey: this.form.unitPrice.currencyKey,
            },
            measurementType: this.productDetails.measurementType,
            quantity: Number(this.form.quantity),
            discount: this.form.discount,
        };
    }

    get supplyStatus(): string {
        const {
            form: { quantitySupplied, quantity },
            instantSupply,
        } = this;

        if (instantSupply || quantitySupplied === quantity) {
            return 'Supplied';
        }

        if (quantitySupplied === 0) {
            return 'Not Supplied';
        }

        return 'Pending Supply';
    }

    get showSupplyDueDate(): boolean {
        return this.addProductToSalesFormError.supplyDueDate || this.form.quantitySupplied < this.form.quantity;
    }

    get submitButtonText(): string {
        return this.editMode ? 'Update' : 'Add Item';
    }

    get disableSubmitButton() {
        return !this.addProductToSalesFormIsValidated;
    }

    @Watch('vatOptions')
    setDefaultVatOption() {
        if (this.editMode) {
            const vatObject = this.vatOptions.find(
                (vatType: VatOption) => vatType.saleProductVatKey === this.itemToBeEdited.vatTypeKey,
            );

            if (vatObject) this.vatName = vatObject.name;

            return;
        }

        if (this.vatOptions.length > 0 && !this.form.vatTypeKey) {
            const defaultVat = this.vatOptions[0];
            this.form.vatTypeKey = defaultVat.saleProductVatKey;
            this.vatName = defaultVat.name;
        }
    }

    private handleEditIconClicked() {
        this.$emit('edit-product-pricing', this.productDetailsForSummaryCard);
        this.$emit('set-transient-item', this.form);
    }

    private handleQuantityInput(newValue: string) {
        if (this.validateSaleQuantity(newValue)) {
            const qtyNum = this.convertFormattedFiguresToNumber(newValue);
            this.form.quantity = qtyNum;
            this.quantityText = this.convertFigureToCurrency(qtyNum);

            let qtySupplied = this.form.quantitySupplied;
            if (this.instantSupply) {
                //also set the quantity supplied
                qtySupplied = qtyNum;
                this.form.quantitySupplied = qtyNum;
            }

            this.validateQuantitySupplied(qtySupplied.toString(), qtyNum);
            this.validateSupplyDueDate(this.form.supplyDueDate, this.remainder);
        } else {
            this.quantityText = newValue;
        }
    }

    private handleVatTypeSelection(vatTypeName: string) {
        const vatObject = this.vatOptions.find((vatType: VatOption) => vatType.name === vatTypeName);

        if (vatObject) {
            this.vatName = vatObject.name;
            this.form.vatTypeKey = vatObject.saleProductVatKey;
        }
    }

    private handleInstantSupplySelection(instantSupply: boolean) {
        this.instantSupply = instantSupply;
        if (instantSupply) {
            //reset the supply due date if it is invalid else leave it
            if (!this.validateSupplyDueDate(this.form.supplyDueDate, 1)) {
                this.form.supplyDueDate = '';
            }

            const qty = Number(this.form.quantity);
            this.form.quantitySupplied = qty;

            //clear irrelevant errors
            this.addProductToSalesFormError.quantitySupplied = '';
            this.addProductToSalesFormError.supplyDueDate = '';
        } else {
            this.handleQuantitySuppliedChange(this.quantitySuppliedText);
            this.setDefaultOrExistingSupplyDueDate();
        }
    }

    private setDefaultOrExistingSupplyDueDate() {
        if (!this.form.supplyDueDate) {
            this.form.supplyDueDate = this.todayAsDefaultDate();
        }
    }

    private handleQuantitySuppliedChange(newValue: string) {
        const { form } = this;
        const qty = form.quantity;

        if (this.validateQuantitySupplied(newValue, qty)) {
            const qtySupplied = this.convertFormattedFiguresToNumber(newValue);
            this.form.quantitySupplied = qtySupplied;
            this.quantitySuppliedText = this.convertFigureToCurrency(qtySupplied);

            if (qtySupplied == qty) {
                if (form.supplyDueDate) {
                    form.supplyDueDate = '';
                    this.validateSupplyDueDate('', 0); //balance is 0
                }
            } else {
                this.setDefaultOrExistingSupplyDueDate();
            }
        } else {
            this.quantitySuppliedText = newValue;
        }

        this.validateSupplyDueDate(form.supplyDueDate, this.remainder);
    }

    private handleSupplyDueDateChange(supplyDueDate: string) {
        this.form.supplyDueDate = supplyDueDate;

        this.validateSupplyDueDate(supplyDueDate, this.remainder);
    }

    private handleAddProductToCart() {
        const { name, productKey, unitPrice, discount, notes, quantity, measurementTypeKey } = this.form;

        if (this.instantSupply) {
            this.form.quantitySupplied = Number(this.form.quantity);
        }

        const selectedProductForSale: ProductSummary = {
            productName: name,
            productKey,
            unitPrice,
            measurementUnit: this.productDetailsForSummaryCard.measurementType,
            files: [],
            supplyStatus: this.supplyStatus,
            subTotal: { amount: this.netPrice, currencyKey: unitPrice.currencyKey },
            totalExclusiveVat: { amount: this.priceExcludingVat, currencyKey: unitPrice.currencyKey },
            vatAmount: { amount: this.vatAmount, currencyKey: unitPrice.currencyKey },
            vatType: this.vatName,
            discount: { amount: discount.amount, currencyKey: unitPrice.currencyKey },
            quantity: Number(quantity),
            notes: notes,
            measurementTypeKey: measurementTypeKey,
        };

        if (this.editMode) {
            this.$emit('update-product-in-summary', selectedProductForSale);
            this.$emit('update-product-in-cart', {
                ...this.form,
                quantity: Number(this.form.quantity),
                quantitySupplied: Number(this.form.quantitySupplied),
            });
            return;
        }

        this.$emit('add-product-to-summary', selectedProductForSale);
        this.$emit('add-product-to-cart', {
            ...this.form,
            quantity: Number(this.form.quantity),
            quantitySupplied: Number(this.form.quantitySupplied),
        });
    }

    private preloadForm() {
        let currencyKey = this.selectedSalesCurrency;

        if (currencyKey === 0) {
            currencyKey = this.productDetails.unitPrice.currencyKey;
        }

        if (this.productDetails.unitPrice.amount) {
            this.form = Object.assign(
                {},
                this.form,
                deepCloneFunction({
                    ...this.form,
                    ...this.productDetails,
                    unitPrice: {
                        amount: this.productDetails.unitPrice.amount,
                        currencyKey: currencyKey,
                    },
                    quantitySupplied: this.productDetails.quantity,
                    productKey: this.selectedProduct.productKey,
                    measurementTypeKey: this.selectedProduct.measurementTypeKey,
                    name: this.selectedProduct.name,
                }),
            );
        }

        const { vatTypeKey, quantity, quantitySupplied } = this.itemToBeEdited;

        if (vatTypeKey) {
            //if there is a vatTypeKey then itemToBeEdited is not blank
            this.form.vatTypeKey = vatTypeKey;
            this.form.quantity = quantity;
            this.form.quantitySupplied = quantitySupplied;
            this.quantityText = quantity.toString();

            const isInstant = quantity === quantitySupplied;
            this.instantSupply = isInstant;

            if (!isInstant) {
                this.quantitySuppliedText = quantitySupplied > 0 ? quantitySupplied.toString() : '';
                this.form.supplyDueDate = this.itemToBeEdited.supplyDueDate;
            }

            this.form.notes = this.itemToBeEdited.notes;
        } else {
            this.quantityText = this.productDetails.quantity.toString();
        }

        this.setDefaultVatOption();
    }

    mounted() {
        productModule = getModule(ProductModule, this.$store);
        productModule.getVatOption();

        this.preloadForm();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/add-product.scss';
</style>
