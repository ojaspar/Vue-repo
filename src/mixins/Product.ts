import { Component, Mixins } from 'vue-property-decorator';

import { InputValidation } from '@/types';
import currencies from '@/utils/currencies';
import { isEmpty, resetFormFields } from '@/utils/formValidator';

import UtilityMixin from '@/mixins/Utility';

const productForm: InputValidation = {
    name: '',
    description: '',
    incomeGroupKey: '',
    measurementTypeKey: '',
    estimatedPrice: '',
    estimatedPriceCurrencyKey: '',
};

@Component
class ProductMixin extends Mixins(UtilityMixin) {
    public hasError(field: string): boolean {
        if (field && field.trim().length > 0) {
            return true;
        }
        return false;
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public validateEmptyField = (field: string, input: string, errors: InputValidation, errorMessage: string) => {
        if (isEmpty(input)) errors[field] = errorMessage;
        else errors[field] = '';
    };

    //Add or edit product form validation

    public currencies = currencies;

    public productFormError = { ...productForm };

    public productQuantityError: string[] = [''];

    public validateProductName(productName: string) {
        if (isEmpty(productName)) {
            this.productFormError['name'] = 'Please provide product name';
            return;
        }

        if (productName.length > 25) {
            this.productFormError['name'] = 'Please keep this between 1-25 characters';
            return;
        }

        this.productFormError['name'] = '';
        return;
    }

    public validateProductDescription(productDescription: string): void {
        if (isEmpty(productDescription)) {
            this.productFormError['description'] = '';
            return;
        }
        if (productDescription.length > 200) {
            this.productFormError['description'] = 'The maximum number of characters is 200';
            return;
        }
        this.productFormError['description'] = '';
        return;
    }

    public validateProductIncomeGroup(productIncomeGroup: string) {
        if (isEmpty(productIncomeGroup)) {
            this.productFormError['incomeGroupKey'] = 'Please select an income group';
            return;
        }

        this.productFormError['incomeGroupKey'] = '';
        return;
    }

    public validateProductMeasurementType(productMeasurementType: string) {
        if (isEmpty(productMeasurementType)) {
            this.productFormError['measurementTypeKey'] = 'Please select a measurement type';
            return;
        }

        this.productFormError['measurementTypeKey'] = '';
        return;
    }

    public validateProductPrice(productPrice: string): void {
        if (isEmpty(productPrice)) {
            this.productFormError['estimatedPrice'] = 'This field is required';
            return;
        }

        const formatedProductPrice = this.convertFormattedCurrencyToNumber(productPrice);

        if (formatedProductPrice < 1) {
            this.productFormError['estimatedPrice'] = 'The miminum amount is 1';
            return;
        }

        this.productFormError['estimatedPrice'] = '';
        return;
    }

    public validateProductQuantity(productQuantity: string, product: string, index: number): void {
        if (isEmpty(product)) {
            this.productQuantityError[index] = '';
            return;
        }

        if (isEmpty(productQuantity)) {
            this.productQuantityError[index] = 'This field is required';
            return;
        }

        const formatedProductPrice = this.convertFormattedCurrencyToNumber(productQuantity);

        if (formatedProductPrice < 1) {
            this.productQuantityError[index] = 'The miminum amount is 1';
            return;
        }

        this.productQuantityError[index] = '';
        return;
    }

    public validateProductCurrency(productCurrency: string) {
        if (isEmpty(productCurrency)) {
            this.productFormError['estimatedPriceCurrencyKey'] = 'Please select a currency';
            return;
        }

        this.productFormError['estimatedPriceCurrencyKey'] = '';
        return;
    }

    public validateProductForm(productForm: {
        name: string;
        description: string;
        incomeGroupKey: string;
        measurementTypeKey: string;
        estimatedPrice: string;
        estimatedPriceCurrencyKey: string;
    }) {
        const {
            name,
            description,
            incomeGroupKey,
            measurementTypeKey,
            estimatedPrice,
            estimatedPriceCurrencyKey,
        } = productForm;

        this.validateProductName(name);
        this.validateProductDescription(description);
        //this.validateProductIncomeGroup(incomeGroupKey);
        this.validateProductMeasurementType(measurementTypeKey);
        this.validateProductPrice(estimatedPrice);
        this.validateProductCurrency(estimatedPriceCurrencyKey);
    }

    public get productFormIsValidated(): boolean {
        return !this.formHasError(this.productFormError);
    }

    public resetFormFields(form: object) {
        resetFormFields(form);
    }
}

export default ProductMixin;
