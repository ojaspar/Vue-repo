<template>
    <div class="select-product">
        <div v-if="!isProductCompulsory" class="select-product__proceed-without-product-section">
            <h2 class="select-product__proceed-without-product-text">Proceed Without Product</h2>
            <img class="select-product__proceed-without-product-icon" src="@/assets/img/info-icon-white.svg" />
        </div>
        <ListSearchAndAddBar
            buttonText="Add New"
            placeholder="Search for Products"
            @search-input-changed="updateSearchString"
            @add-new-resource="addNewProduct"
        />

        <div class="select-customer__loader" v-if="getProductsRequestIsLoading">
            <Loader size="4" />
        </div>

        <template v-else>
            <!-- recent products -->
            <template v-if="showRecentProducts">
                <p class="select-product__headline">Recent Products</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="(product, index) in recentProducts"
                        :item="product"
                        :key="index"
                        :resourceName="product.name"
                        externalControl="true"
                        :itemKey="product.productKey"
                        :expandedItemKey="expandedRecentProductKey"
                        @full-details-toggled="toggleRecentProduct"
                        @resource-selected="productSelected(product)"
                    >
                        <p class="product__text" v-if="product.lastSalePrice.amount > 0">
                            <span>{{ product.lastSalePrice | amountWithCurrency }}</span>
                            <i class="ml-2">{{ product.lastSaleAge }}</i>
                        </p>
                        <p class="product__text" v-else-if="product.estimatedPrice.amount > 0">
                            <span>{{ product.estimatedPrice | amountWithCurrency }}</span>
                        </p>

                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <p class="product__text" key="type">{{ product.description }}</p>
                            <p class="product__text" key="amount" v-if="product.lastSalePrice.amount > 0">
                                <span>{{ product.lastSalePrice | amountWithCurrency }}</span>
                                <i class="ml-2">{{ product.lastSaleAge }}</i>
                            </p>
                            <p class="product__text" key="amount" v-else-if="product.estimatedPrice.amount > 0">
                                <span>{{ product.estimatedPrice | amountWithCurrency }}</span>
                            </p>

                            <p class="product__text" key="date" v-if="product.totalFinancialYearSale.amount > 0">
                                <span
                                    >{{ getCurrencySymbol(product.totalFinancialYearSale.currencyKey) }}
                                    {{ product.totalFinancialYearSale.amount | formatAmount }}</span
                                >
                                <i class="ml-2">since {{ product.financialYearStartDate | humanReadableDateTime }}</i>
                            </p>
                            <div class="d-flex avatar-and-resource__actions-container">
                                <p
                                    class="select-product__select mr-4 avatar-and-resource__action"
                                    @click.stop="productSelected(product)"
                                >
                                    <img
                                        src="@/assets/img/select-resource.svg"
                                        class="select-product__select--icon mr-3"
                                    />
                                    Select Product
                                </p>
                                <p
                                    class="select-product__select mr-4 avatar-and-resource__action"
                                    @click="editExistingProduct(product)"
                                >
                                    <img src="@/assets/img/pencil.svg" class="select-product__edit--icon mr-2" />
                                    Edit Product
                                </p>
                            </div>
                        </template>
                    </AvatarAndResource>
                </div>
            </template>

            <!-- All Products -->
            <p class="select-product__headline">{{ headlineText }}</p>
            <div>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="(product, index) in productListToBeDisplayed"
                        :item="product"
                        :key="index"
                        :resourceName="product.name"
                        externalControl="true"
                        :itemKey="product.productKey"
                        :expandedItemKey="expandedProductKey"
                        @full-details-toggled="toggleProduct"
                        @resource-selected="productSelected(product)"
                    >
                        <p class="product__text" v-if="product.lastSalePrice.amount > 0">
                            <span>{{ product.lastSalePrice | amountWithCurrency }}</span>
                            <i class="ml-2">{{ product.lastSaleAge }}</i>
                        </p>
                        <p class="product__text" v-else>
                            <span>{{ product.estimatedPrice | amountWithCurrency }}</span>
                        </p>
                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <p class="product__text" key="type">{{ product.description }}</p>
                            <p class="product__text" key="amount" v-if="product.lastSalePrice.amount > 0">
                                <span>{{ product.lastSalePrice | amountWithCurrency }}</span>
                                <i class="ml-2">{{ product.lastSaleAge }}</i>
                            </p>
                            <p class="product__text" key="amount" v-else>
                                <span>{{ product.estimatedPrice | amountWithCurrency }}</span>
                            </p>
                            <p class="product__text" key="date" v-if="product.totalFinancialYearSale.amount > 0">
                                {{ product.totalFinancialYearSale | amountWithCurrency }} total sales since
                                {{ product.financialYearStartDate }}
                            </p>

                            <div class="d-flex avatar-and-resource__actions-container">
                                <p
                                    class="select-product__select mr-4 avatar-and-resource__action"
                                    @click.stop="productSelected(product)"
                                >
                                    <img
                                        src="@/assets/img/select-resource.svg"
                                        class="select-product__select--icon mr-3"
                                    />Select Product
                                </p>
                                <p
                                    class="select-product__select mr-4 avatar-and-resource__action"
                                    @click="editExistingProduct(product)"
                                >
                                    <img src="@/assets/img/pencil.svg" class="select-product__edit--icon mr-2" />
                                    Edit Product
                                </p>
                            </div>
                        </template>
                    </AvatarAndResource>
                </div>

                <div class="product__none-found" v-if="productListToBeDisplayed.length === 0">
                    <p>Looks like you haven't added any product to your list</p>
                    <p>Click the 'New Product' link above to add a Product</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import ProductModule from '@/store/modules/product.ts';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

import { Product, ProductDetails, ProductRequest } from '@/pages/Sales/types';
import { Status } from '@/types';

const product = namespace('product');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let productModule: ProductModule;

@Component
export default class SelectProduct extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: true }) readonly isProductCompulsory!: boolean;

    @product.State
    public error!: string;

    @product.State
    public productRequests!: ProductRequest;

    @product.State
    public products!: Array<Product>;

    private productToBeEdited: ProductDetails = {
        name: '',
        description: '',
        incomeGroupKey: '',
        estimatedPrice: {
            currencyKey: 0,
            amount: 0,
        },
        measurementTypeKey: '',
    };

    private searchString = '';
    private shownProductKey = '';

    private expandedRecentProductKey = '';
    private expandedProductKey = '';

    get showRecentProducts(): boolean {
        return this.searchString.length === 0;
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Products';
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    get preparedProducts(): Product[] {
        return this.prepareProducts(this.products);
    }

    get recentProducts(): Product[] {
        const recentProducts = this.sortByInteractionDate(this.preparedProducts, 'lastSaleDate');
        return recentProducts.slice(0, 2);
    }

    get productListToBeDisplayed(): Array<Product> {
        const products = this.sortArrayByName(this.preparedProducts);
        return products.filter((product: Product) => product.name.toLowerCase().match(this.searchString.toLowerCase()));
    }

    get getProductsRequestIsLoading(): boolean {
        return this.productRequests.getProducts === Status.LOADING;
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private getCurrencySymbol(currencyKey: number): string {
        return this.getCurrencyObjectFromCurrencyKey(currencyKey).currencySymbol;
    }

    private productSelected(selectedProduct: Product) {
        this.$emit('product-selected', selectedProduct);
    }

    private addNewProduct() {
        this.$emit('add-new-product', this.searchString);
    }

    private editExistingProduct(product: Product) {
        const productToBeEdited = this.setPropertiesOfProductToBeEdited(product);
        this.$emit('edit-existing-product', productToBeEdited);
    }

    private setPropertiesOfProductToBeEdited(product: Product): ProductDetails {
        const { productKey, name, description, incomeGroupKey, estimatedPrice, measurementTypeKey } = product;
        this.$set(this.productToBeEdited, 'productKey', productKey);
        this.$set(this.productToBeEdited, 'name', name);
        this.$set(this.productToBeEdited, 'description', description);
        this.$set(this.productToBeEdited, 'incomeGroupKey', incomeGroupKey);
        this.$set(this.productToBeEdited, 'estimatedPrice', estimatedPrice);
        this.$set(this.productToBeEdited, 'measurementTypeKey', measurementTypeKey);
        return this.productToBeEdited;
    }

    private finacialYearDate() {
        //convert date to the appropriate format for display
        //to be handled in the next task
        return 'January 1st';
    }

    private toggleRecentProduct(key: string) {
        this.expandedProductKey = '';

        if (this.expandedRecentProductKey == key) {
            this.expandedRecentProductKey = '';
        } else {
            this.expandedRecentProductKey = key;
        }
    }

    private toggleProduct(key: string) {
        this.expandedRecentProductKey = '';
        if (this.expandedProductKey == key) {
            this.expandedProductKey = '';
            return;
        }
        this.expandedProductKey = key;
    }

    mounted() {
        productModule = getModule(ProductModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/select-product';
</style>
