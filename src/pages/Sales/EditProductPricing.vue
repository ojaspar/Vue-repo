<template>
    <div class="edit-product-details-estimate">
        <SalesItemSummaryCard @edit-icon-clicked="$emit('edit-icon-clicked')" :productDetails="clonedProductDetails" />

        <BaseSelectWithBorderAndFloatingLabel
            floatingLabelText="Measurement Type"
            :options="measurementTypes"
            valueProperty="name"
            textProperty="name"
            keyProperty="key"
            @input="handleMeasurementTypeSelection"
            :value="measurementTypeName"
        />

        <b-container fluid class="p-0 m-0">
            <b-row>
                <b-col class="pr-0 mr-3">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :floatingLabelText="priceLabelText"
                        className="edit-product-details-estimate__text-input-field"
                        :overRideContainerClass="true"
                        :value="unitPriceText"
                        :errors="pricingFormError.unitPrice"
                        @input="handleUnitPriceInput"
                    />
                </b-col>
                <b-col class="pl-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Currency"
                        className="edit-product-details-estimate__text-input-field"
                        :overRideContainerClass="true"
                        defaultOptionText="-- Select Currency --"
                        valueProperty="currencyKey"
                        textProperty="currencyName"
                        :options="availableCurrencies"
                        :value="form.unitPrice.currencyKey"
                        :disabled="hasPresetCurrency"
                        @change="handleCurrencySelection"
                        isCurrency="true"
                    />
                </b-col>
            </b-row>
        </b-container>

        <BaseInputFieldWithBorderAndFloatingLabel
            floatingLabelText="Quantity"
            v-if="productIsMeasurable"
            :value="quantityText"
            :errors="pricingFormError.quantity"
            @input="handleQuantityInput"
        />

        <BaseInputFieldWithBorderAndFloatingLabel
            floatingLabelText="Sub Total"
            :value="subTotalMoney"
            :disabled="true"
        />

        <b-container fluid class="m-0 p-0">
            <b-row>
                <b-col class="pr-0 mr-3">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :floatingLabelText="discountLabelText"
                        className="edit-product-details-estimate__text-input-field"
                        inputContainerClass="edit-product-details-estimate__naira-discount-container"
                        :overRideContainerClass="true"
                        :value="discountAmountText"
                        :errors="pricingFormError.discountAmount"
                        @input="handleDiscountAmountInput"
                    />
                </b-col>
                <b-col class="pl-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Discount (%)"
                        className="edit-product-details-estimate__text-input-field"
                        inputContainerClass="edit-product-details-estimate__percentage-discount-container"
                        :overRideContainerClass="true"
                        :value="discountPercentText"
                        :errors="pricingFormError.discountPercent"
                        @input="handleDiscountPercentageInput"
                    />
                </b-col>
            </b-row>
        </b-container>

        <BaseInputFieldWithBorderAndFloatingLabel
            floatingLabelText="Net Price"
            :value="netPriceMoney"
            :disabled="true"
        />

        <BasePrimaryButton
            buttonText="Save Changes"
            className="edit-product-details-estimate__edit-product-details-estimate-button"
            :disabled="disableSubmitButton"
            @button-clicked="savePricingChanges"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import SalesItemSummaryCard from '@/pages/Sales/SaleItemSummaryCard.vue';

import ProductModule from '@/store/modules/product';

import { Product, SalesItemSummary } from '@/pages/Sales/types';
import { MeasurementType } from '@/types';
import UtilityMixins from '@/mixins/Utility';
import deepCloneFunction from '@/utils/deepCloneFunction';
import CurrencyMixins from '@/mixins/currency';
import SalesServiceMixin from '@/mixins/SalesService';

const products = namespace('product');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productModule: ProductModule;

@Component({
    components: {
        SalesItemSummaryCard,
    },
})
export default class EditProductPricing extends Mixins(UtilityMixins, CurrencyMixins, SalesServiceMixin) {
    private searchString = '';
    private inputVariable = [];
    private form = {
        measurementTypeKey: '',
        discount: { amount: 0, currencyKey: 0 },
        unitPrice: { amount: 0, currencyKey: 0 },
        quantity: 1,
    };
    private measurementTypeName = 'none';
    private productIsMeasurable = false;
    private discountPercentage = 0;

    private unitPriceText = '';
    private quantityText = '';
    private discountAmountText = '';
    private discountPercentText = '';

    @Prop({}) readonly isCustomerCompulsory!: boolean;
    @Prop({}) readonly selectedProduct!: Product;
    @Prop({}) readonly selectedSalesCurrency!: string | number;
    @Prop({
        default: () => ({
            name: '',
            unitPrice: { amount: 0, currencyKey: 0 },
            measurementType: '',
            quantity: 1,
            discount: { amount: 0, currencyKey: 0 },
            discountPercentage: 0,
        }),
    })
    readonly productDetails!: SalesItemSummary;

    @products.State
    private measurementTypes!: Array<MeasurementType>;

    get clonedProductDetails(): SalesItemSummary {
        return deepCloneFunction(this.productDetails);
    }

    get hasPresetCurrency(): boolean {
        return !(this.selectedSalesCurrency === 0);
    }

    get priceLabelText(): string {
        return this.productIsMeasurable ? 'Unit Price' : 'Price';
    }

    get discountLabelText(): string {
        return 'Discount (' + this.getCurrencySymbolFromCurrencyKey(this.form.discount.currencyKey.toString()) + ')';
    }

    get subTotal(): number {
        const { quantity, unitPrice } = this.form;

        if (!quantity) {
            return unitPrice.amount;
        }

        if (!unitPrice.amount) {
            return 0;
        }

        return unitPrice.amount * quantity;
    }

    get netPrice(): number {
        return this.subTotal - this.form.discount.amount;
    }

    get disableSubmitButton() {
        return !this.pricingFormIsValidated;
    }

    get netPriceMoney(): string {
        const netMoney = {
            amount: this.netPrice,
            currencyKey: this.form.unitPrice.currencyKey,
        };

        return this.$options.filters.amountWithCurrency(netMoney);
    }

    get subTotalMoney(): string {
        const stMoney = {
            amount: this.subTotal,
            currencyKey: this.form.unitPrice.currencyKey,
        };

        return this.$options.filters.amountWithCurrency(stMoney);
    }

    private handleMeasurementTypeSelection(measurementTypeName: string) {
        // is not measurable
        if (measurementTypeName === 'none') {
            this.productIsMeasurable = false;
            return;
        }
        this.productIsMeasurable = true;
        this.measurementTypeName = measurementTypeName;

        const measurementTypeObject = this.measurementTypes.find(
            (measurementType: MeasurementType) => measurementType.name === measurementTypeName,
        );

        if (measurementTypeObject) {
            this.form.measurementTypeKey = measurementTypeObject.key;
            // validaation goes here
        }
    }

    private handleQuantityInput(newValue: string) {
        if (this.validatePricingQuantity(newValue)) {
            const qtyNum = this.convertFormattedFiguresToNumber(newValue);
            this.form.quantity = qtyNum;
            this.quantityText = this.convertFigureToCurrency(qtyNum);

            this.$nextTick(() => {
                this.calculateDiscountPercentage();
            });
        } else {
            this.quantityText = newValue;
        }
    }

    private handleUnitPriceInput(unitPrice: string) {
        const priceNum = this.convertFormattedFiguresToNumber(unitPrice);

        if (this.isValidUnitPrice(priceNum)) {
            const roundedUnitPrice = Number(this.roundN(priceNum, 2));

            this.form.unitPrice = Object.assign({}, this.form.unitPrice, {
                ...this.form.unitPrice,
                amount: roundedUnitPrice,
            });

            this.unitPriceText = this.convertFigureToCurrency(roundedUnitPrice);

            this.$nextTick(() => {
                this.calculateDiscountPercentage();
            });
        } else {
            this.unitPriceText = unitPrice;
        }
    }

    private handleCurrencySelection(currencyKey: number) {
        this.form.discount.currencyKey = currencyKey;
        this.form.unitPrice.currencyKey = currencyKey;
    }

    private handleDiscountAmountInput(discountAmount: string) {
        const discountInNumber = this.convertFormattedFiguresToNumber(discountAmount);

        if (this.validateDiscountAmount(discountAmount, this.subTotal)) {
            this.form.discount.amount = discountInNumber;
            this.form.discount.currencyKey = this.form.unitPrice.currencyKey;

            this.discountAmountText = this.convertFigureToCurrency(discountInNumber);

            this.$nextTick(() => {
                this.calculateDiscountPercentage();
            });
        } else {
            if (discountInNumber) this.discountAmountText = this.convertFigureToCurrency(discountInNumber);
            else this.discountAmountText = discountAmount;
        }
    }

    private calculateDiscountPercentage() {
        const discountPercent = (this.form.discount.amount / this.subTotal) * 100;
        this.discountPercentage = discountPercent;

        if (discountPercent < 0.005) this.discountPercentText = '0.00';
        else this.discountPercentText = this.roundN(discountPercent, 2);

        this.validateDiscountPercentage(discountPercent);
    }

    private handleDiscountPercentageInput(discountPercentInput: string) {
        const discountPercent = this.convertFormattedFiguresToNumber(discountPercentInput);

        if (this.validateDiscountPercentage(discountPercentInput)) {
            this.discountPercentText = discountPercentInput;
            this.discountPercentage = discountPercent;

            this.form.discount.currencyKey = this.form.unitPrice.currencyKey;

            // set the discount amount
            const roundedDiscount = this.roundN((discountPercent / 100) * this.subTotal, 2);

            this.form.discount.amount = Number(roundedDiscount);

            this.discountAmountText = this.convertFigureToCurrency(roundedDiscount);
            this.validateDiscountAmount(roundedDiscount, this.subTotal);
        } else {
            this.discountPercentText = discountPercentInput;
        }
    }

    private savePricingChanges() {
        this.validateDiscountPercentage(this.discountPercentage);
        this.validateSaleQuantity(this.form.quantity.toString());
        this.isValidUnitPrice(this.form.unitPrice.amount);

        if (!this.pricingFormIsValidated) return;

        this.$emit('update-product-pricing-details', {
            ...this.form,
            measurementType: this.measurementTypeName,
        });
    }

    private preloadProductPricingForm() {
        if (!this.productDetails.quantity) return;

        const { quantity, unitPrice, measurementType, discount } = deepCloneFunction(this.productDetails);

        let currencyKey = this.selectedSalesCurrency;

        if (currencyKey === 0) {
            currencyKey = unitPrice.currencyKey;
        }

        if (measurementType.toLowerCase() !== 'none') {
            this.productIsMeasurable = true;
        }

        const measurementTypeIndex = this.measurementTypes.findIndex(
            (measurementTypeObject: MeasurementType) => measurementTypeObject.name === measurementType.toString(),
        );

        if (measurementTypeIndex) {
            this.form.measurementTypeKey = this.measurementTypes[measurementTypeIndex].key;
        }

        const discountPercentage = (discount.amount / (unitPrice.amount * quantity)) * 100;

        this.unitPriceText = this.convertFigureToCurrency(unitPrice.amount);
        this.quantityText = this.convertFigureToCurrency(quantity);
        this.discountAmountText = this.convertFigureToCurrency(discount.amount);
        this.discountPercentText = this.convertFigureToCurrency(discountPercentage);

        this.$nextTick(() => {
            this.form = Object.assign({}, this.form, {
                ...this.form,
                unitPrice: {
                    ...unitPrice,
                    currencyKey: currencyKey,
                },
                discount: {
                    ...discount,
                    currencyKey: currencyKey,
                },
                quantity: Number(quantity),
            });
            // recalculate the discount now and set the percentage
            this.discountPercentage = discountPercentage;
            this.measurementTypeName = measurementType;
        });
    }

    mounted() {
        productModule = getModule(ProductModule, this.$store);
        this.preloadProductPricingForm();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/new-estimate/edit-product-details.scss';
</style>
