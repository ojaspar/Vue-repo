<template>
    <div>
        <div class="product-form">
            <!-- Product Name -->
            <b-row class="product-form__field--row">
                <b-col class="product-form__field--input">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Product Name"
                        v-model="product.name"
                        :errors="productFormError.name"
                        @input="validateProductName(product.name)"
                    />
                </b-col>
            </b-row>

            <!-- Description -->
            <b-row class="product-form__field--row" v-if="false">
                <b-col class="product-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel
                        floatingLabelText="Description"
                        v-model="product.description"
                        :errors="productFormError.description"
                        @input="validateProductDescription(product.description)"
                    />
                </b-col>
            </b-row>

            <!-- Income Group -->
            <b-row class="product-form__field--row" v-if="false">
                <b-col class="product-form__field--select">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Income Group"
                        defaultOptionText="Select Income Group"
                        textProperty="name"
                        keyProperty="incomeGroupKey"
                        valueProperty="incomeGroupKey"
                        :options="incomeGroups"
                        v-model="product.incomeGroupKey"
                        :errors="productFormError.incomeGroupKey"
                        @input="validateProductIncomeGroup(product.incomeGroupKey)"
                    />
                </b-col>
            </b-row>

            <!-- Measurement Type -->
            <b-row class="product-form__field--row">
                <b-col class="product-form__field--select">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Measurement Type"
                        defaultOptionText="Select Measurement Type"
                        textProperty="name"
                        keyProperty="key"
                        valueProperty="key"
                        :options="measurementTypes"
                        v-model="product.measurementTypeKey"
                        :errors="productFormError.measurementTypeKey"
                        @input="validateProductMeasurementType(product.measurementTypeKey)"
                    />
                </b-col>
            </b-row>

            <b-row class="product-form__split-field">
                <!-- Estimated Price -->
                <b-col class="product-form__split-field--left">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Price"
                        className="product-form__form-input"
                        v-model="product.estimatedPrice"
                        :errors="productFormError.estimatedPrice"
                        @input="formatAndValidateEstimatedPrice"
                    />
                </b-col>

                <!-- Currency -->
                <b-col class="product-form__split-field--right">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Currency"
                        defaultOptionText="Select Currency"
                        :isCurrency="true"
                        keyProperty="currencyKey"
                        valueProperty="currencyKey"
                        :options="availableCurrencies"
                        v-model="product.estimatedPriceCurrencyKey"
                        :errors="productFormError.estimatedPriceCurrencyKey"
                        @input="validateProductCurrency(product.estimatedPriceCurrencyKey)"
                    />
                </b-col>
            </b-row>

            <!-- VAT Exemption -->
            <b-row class="mt-3">
                <b-col>
                    <BaseCheckbox
                        inputContainerClass="product-form__checkbox--input"
                        labelText="VAT Exempt"
                        labelClass="product-form__checkbox--label"
                        id="vat-exemption"
                        @change="toggleVatExemption"
                        v-model="product.isVATExempt"
                    />
                </b-col>
            </b-row>

            <!-- Inventory Option -->
            <b-row class="mt-3">
                <b-col>
                    <BaseCheckbox
                        inputContainerClass="product-form__checkbox--input"
                        labelText="Sell from Inventory"
                        labelClass="product-form__checkbox--label"
                        id="inventory-option"
                        @change="toggleInventoryOption"
                        v-model="product.isSoldFromInventory"
                    />
                </b-col>
            </b-row>

            <!-- Availability Status -->
            <b-row v-if="!product.isSoldFromInventory" class="product-form__row-border">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Status"
                        defaultOptionText="Select Status"
                        keyProperty="key"
                        valueProperty="key"
                        textProperty="name"
                        :options="productStatus"
                        v-model="product.status"
                    />
                </b-col>
            </b-row>

            <!-- Product Components -->
            <div v-if="product.isSoldFromInventory" class="product-form__row-border">
                <b-row class="product-form__split-field" v-for="(product, index) in productComponents" :key="index">
                    <!-- Product List -->
                    <b-col :cols="productListCmmponentWidth(index)" class="product-form__split-field--left">
                        <ListDropdownAndAddBar
                            v-if="productListShouldShow(index)"
                            class="product-form__product-list"
                            addEntityText=""
                            placeholder="Select Item"
                            entityKey="stockItemKey"
                            dateKey=""
                            entityNameKey="name"
                            :entityList="inventoryItems"
                            :autoFocus="true"
                            @entity-list-hidden="hideProductList"
                            @resource-selected="handleProductSelection($event, index)"
                        />

                        <BaseSelectWithBorderAndFloatingLabel
                            v-else
                            floatingLabelText="Stock Item"
                            :defaultOptionText="selectedProductName(index)"
                            keyProperty="key"
                            valueProperty="key"
                            textProperty="name"
                            :options="productStatus"
                            @focus="showProductList(index)"
                        />
                    </b-col>

                    <!-- Quantity -->
                    <b-col class="product-form__split-field--right product-form__product-list--right">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Quantity"
                            v-model="productComponents[index].quantity"
                            :errors="productQuantityError[index]"
                            @input="formatAndValidateProductQuantity($event, index)"
                        />
                        <span class="product-form__product-list--remove-item" @click="removeProductComponent(index)">
                            <font-awesome-icon icon="times-circle" title="Remove item" />
                        </span>
                    </b-col>
                </b-row>
            </div>

            <div class="product-form__add-more-item" v-if="showAddNewItemButton">
                <span class="pointer" @click="generateNewProductComponent">
                    <img src="@/assets/img/blue-circled-plus.svg" />
                </span>
                <span class="pointer ml-2" @click="generateNewProductComponent">
                    Add Another Item
                </span>
            </div>

            <b-row class="product-form__footer">
                <BasePrimaryButton
                    :buttonText="buttonText"
                    className="product-form__save-btn"
                    :status="productRequestStatus"
                    :disabled="buttonIsDisabled"
                    @button-clicked="handleProductForm"
                />
            </b-row>
        </div>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';
import debounce from 'lodash.debounce';

import ProductModule from '@/store/modules/product';

import InventoryModule from '@/store/modules/inventory';

import ProductMixin from '@/mixins/Product';
import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

import { Status, MeasurementType, Toaster } from '@/types';
import { Product } from '@/pages/Sales/types';
import { ProductForm, IncomeGroup, ProductRequest, ProductDetails } from '@/pages/Sales/types';

import { StockItem } from '@/pages/Inventory/types';

const product = namespace('product');
const inventory = namespace('inventory');

let productModule: ProductModule;
let inventoryModule: InventoryModule;

const defaultProductForm: ProductForm = {
    name: '',
    description: '',
    incomeGroupKey: '',
    measurementTypeKey: '',
    estimatedPrice: '',
    estimatedPriceCurrencyKey: '',
    isVATExempt: false,
    isSoldFromInventory: false,
    status: 'available',
};

const defaultStockItem: StockItem = {
    name: '',
    availableQuantity: 0,
    reorderLevel: 0,
    totalQuantity: 0,
    measurementUnitName: '',
    inventoryType: 'Product',
    stockItemLevel: 'Out Of Stock',
    stockItemKey: '',
};

interface ProductComponent {
    product: StockItem;
    quantity: string;
}

@Component
export default class AddOrEditProduct extends Mixins(ProductMixin, UtilityMixins, CurrencyMixins) {
    @Prop({ default: '' }) readonly searchedProduct!: string;
    @Prop({ default: false }) readonly productIsEditing!: boolean;
    @Prop({ default: () => defaultProductForm }) readonly productToBeEdited!: ProductDetails;

    @product.State
    public error!: string;

    @product.State
    public productRequests!: ProductRequest;

    @product.State
    public incomeGroups!: Array<IncomeGroup>;

    @product.State
    public measurementTypes!: Array<MeasurementType>;

    @product.State
    public newProduct!: Product;

    @inventory.State
    public inventoryItems!: Array<StockItem>;

    private debounceTime = Number(process.env.VUE_APP_DEBOUNCE_TIME);

    private product: ProductForm = { ...defaultProductForm };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-product-request-notification',
        position: 'b-toaster-top-center',
    };

    private productStatus = [
        { name: 'Available', key: 'available' },
        { name: 'Unavailable', key: 'unavailable' },
    ];

    private productComponents: ProductComponent[] = [{ product: { ...defaultStockItem }, quantity: '1' }];

    private activeProductComponentIndex = '';

    private activeProductQuantityIndex = 0;

    private productComponentHasError = false;

    get addProductRequestStatus() {
        return this.productRequests.addProduct;
    }

    get editProductRequestStatus() {
        return this.productRequests.editProduct;
    }

    get productRequestStatus() {
        if (this.productIsEditing) return this.editProductRequestStatus;
        return this.addProductRequestStatus;
    }

    get buttonIsDisabled() {
        return this.productRequestStatus === 'LOADING' || !this.productFormIsValidated || this.productComponentHasError;
    }

    get buttonText() {
        return this.productIsEditing ? 'Save Changes' : 'Add Product';
    }

    get productKeyIsRequired() {
        return this.productIsEditing;
    }

    get showAddNewItemButton() {
        const lastIndex = this.productComponents.length - 1;
        const lastItem = this.productComponents[lastIndex];
        return this.product.isSoldFromInventory && lastItem.product.name;
    }

    private checkFormMode() {
        if (this.productIsEditing) {
            this.prefillFormWithProductToBeUpdated();
            return;
        }

        this.setInitialValues();
    }

    private setInitialValues() {
        this.product.estimatedPriceCurrencyKey = this.defaultCurrency.currencyKey.toString();
    }

    private autoFillProductName() {
        if (this.searchedProduct !== '') {
            this.product.name = this.searchedProduct;
        }
    }

    private prefillFormWithProductToBeUpdated() {
        const { name, description, incomeGroupKey, estimatedPrice, measurementTypeKey } = this.productToBeEdited;
        const formatedPrice = this.convertFigureToCurrency(estimatedPrice.amount);
        this.$set(this.product, 'name', name);
        this.$set(this.product, 'description', description);
        this.$set(this.product, 'incomeGroupKey', incomeGroupKey);
        this.$set(this.product, 'measurementTypeKey', measurementTypeKey);
        this.$set(this.product, 'estimatedPrice', formatedPrice);
        this.$set(this.product, 'estimatedPriceCurrencyKey', estimatedPrice.currencyKey.toString());
    }

    private formatAndValidateEstimatedPrice = debounce((estimatedPrice: string) => {
        const formatedPrice = this.convertFigureToCurrency(estimatedPrice);
        if (formatedPrice == 'NaN') {
            this.product.estimatedPrice = '0';
            return;
        }
        this.product.estimatedPrice = formatedPrice;
        this.validateProductPrice(this.product.estimatedPrice);
    }, this.debounceTime);

    private handleProductForm() {
        this.validateProductForm(this.product);
        this.validateProductComponentSection();
        if (!this.productFormIsValidated || this.productComponentHasError) return;

        const productPayload: ProductDetails = this.generateProductDetails();
        if (!this.productIsEditing) {
            this.addNewProduct(productPayload);
            return;
        }
        this.updateProduct(productPayload);
    }

    private toggleVatExemption() {
        this.product.isVATExempt = !this.product.isVATExempt;
    }

    private toggleInventoryOption() {
        this.product.isSoldFromInventory = !this.product.isSoldFromInventory;
        if (this.product.isSoldFromInventory) {
            this.product.status = '';
        }
    }

    private showProductList(index: string) {
        this.activeProductComponentIndex = index;
    }

    private hideProductList() {
        this.activeProductComponentIndex = '';
    }

    private productListCmmponentWidth(index: string) {
        return this.productListShouldShow(index) ? '12' : '7';
    }

    private productListShouldShow(index: string) {
        return this.activeProductComponentIndex === index;
    }

    private formatAndValidateProductQuantity(quantity: string, index: number) {
        this.activeProductQuantityIndex = index;
        this.formatQuantityInput(quantity, index);
        const selectedProduct = this.productComponents[index].product.name;
        this.validateProductQuantity(quantity, selectedProduct, index);
    }

    private formatQuantityInput = debounce((quantity: string, index: number) => {
        const formatedQuantity = this.convertFigureToCurrency(quantity);
        if (formatedQuantity == 'NaN') {
            this.productComponents[index].quantity = '0';
            return;
        }
        this.productComponents[index].quantity = formatedQuantity;
    }, this.debounceTime);

    private handleProductSelection(selectedProduct: StockItem, index: number) {
        this.productComponents[index].product = selectedProduct;
        this.hideProductList();
    }

    private selectedProductName(index: number) {
        return this.productComponents[index].product.name || 'Select Item';
    }

    private generateNewProductComponent() {
        this.productComponents.push({ product: { ...defaultStockItem }, quantity: '1' });
        this.productQuantityError.push('');
    }

    private removeProductComponent(index: number) {
        if (this.productComponents.length === 1) {
            this.toggleInventoryOption();
            return;
        }
        this.productComponents.splice(index, 1);
        this.productQuantityError.splice(index, 1);
    }

    private validateProductComponentSection() {
        this.productComponents.forEach((component: ProductComponent, index = 0) => {
            this.validateProductQuantity(component.quantity, component.product.name, index);
            index++;
        });
        this.productComponentHasError = this.validateProductComponentError(this.productQuantityError);
    }

    private validateProductComponentError(errorList: string[]): boolean {
        return errorList.some((quantityError: string) => {
            return this.hasError(quantityError);
        });
    }

    private prefillFormWithInitialValues() {
        // set the income group key
        const defaultIncomeGroup = this.incomeGroups.find((incomeGroup: IncomeGroup) =>
            incomeGroup.name.match(/Operating Income/),
        );
        if (defaultIncomeGroup) {
            this.product.incomeGroupKey = defaultIncomeGroup.incomeGroupKey;
        } else {
            this.product.incomeGroupKey = this.incomeGroups[0]?.incomeGroupKey;
        }

        const { measurementTypeKey } = this.productToBeEdited;

        if (this.productIsEditing) {
            this.product.measurementTypeKey = measurementTypeKey;

            return;
        }

        const defaultMeasurementType = this.measurementTypes.find((measurementType: MeasurementType) =>
            measurementType.name.toLowerCase().match(/unit/),
        );

        if (defaultMeasurementType) {
            this.product.measurementTypeKey = defaultMeasurementType.key;
        }
    }

    private generateProductDetails() {
        const {
            name,
            description,
            incomeGroupKey,
            measurementTypeKey,
            estimatedPriceCurrencyKey,
            estimatedPrice,
            isVATExempt,
            isSoldFromInventory,
            status,
        } = this.product;
        const estimatedPriceInNumber = this.convertFormattedCurrencyToNumber(estimatedPrice);
        const productPayload: ProductDetails = {
            name,
            description,
            incomeGroupKey: incomeGroupKey ? incomeGroupKey : this.incomeGroups[0].incomeGroupKey,
            estimatedPrice: { currencyKey: Number(estimatedPriceCurrencyKey), amount: estimatedPriceInNumber },
            measurementTypeKey,
            productKey: this.productToBeEdited.productKey,
            isVATExempt,
            isSoldFromInventory,
            status,
            productComponents: this.selectedProductComponents(),
        };

        return productPayload;
    }

    private selectedProductComponents() {
        const selectedProductComponents: any = [];
        this.productComponents.forEach((component: ProductComponent) => {
            const components = { product: component.product.stockItemKey, quantity: component.quantity };
            selectedProductComponents.push(components);
        });

        return selectedProductComponents;
    }

    private async addNewProduct(product: ProductDetails) {
        await productModule.registerNewProduct(product);
        if (this.productRequestStatus == Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Product added successfully',
            });
            this.resetFormFields(this.product);
            this.$emit('new-product-added', this.newProduct);
        }
        if (this.productRequestStatus == Status.ERROR) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'Failed to add product. Please re-try later',
            });
        }
    }

    private async updateProduct(product: ProductDetails) {
        await productModule.updateProduct(product);
        if (this.productRequestStatus == Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Product updated successfully',
            });
            this.resetFormFields(this.product);
            this.$emit('existing-product-updated');
        }
        if (this.productRequestStatus == Status.ERROR) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'Failed to update product. Please re-try later',
            });
        }
    }

    private assignModules() {
        productModule = getModule(ProductModule, this.$store);
        inventoryModule = getModule(InventoryModule, this.$store);
    }

    private async makePreliminaryRequests() {
        await Promise.all([
            productModule.getIncomeGroups(),
            productModule.getMeasurementTypes(),
            inventoryModule.getStockItems(),
        ]);
    }

    @Watch('productComponents', { deep: true })
    validateProductComponents() {
        this.validateProductComponentSection();
    }

    mounted() {
        this.autoFillProductName();
        this.checkFormMode();
        this.assignModules();
        this.makePreliminaryRequests();
        this.prefillFormWithInitialValues();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/add-or-edit-product-form';
</style>
