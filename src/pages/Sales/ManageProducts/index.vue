<template>
    <b-container fluid class="product-dashboard">
        <h3 class="product-dashboard__title">Products</h3>

        <b-row>
            <BasePrimaryButton
                buttonText="Add Product"
                :overRideButtonClass="true"
                className="product-dashboard__mobile-add-product-btn"
                @button-clicked="showProductModal"
            />
        </b-row>

        <div class="product-dashboard-content">
            <TopSection @add-new-product="showProductModal" @search-string-changed="updateSearchString" />

            <ProductTable
                :products="productsToBeDisplayed"
                :productSearchString="productSearchString"
                :searchMatchFound="searchMatchFound"
                :status="productRequests.getProducts"
                :measurementTypes="measurementTypes"
                @edit-existing-product="editProduct"
            />
        </div>

        <AddOrEditProductModal
            :searchedProduct="productSearchString"
            :productIsEditing="productIsEditing"
            :productToBeEdited="productToBeEdited"
            @reset-product-form-modal="resetProductFormModal"
            @update-product-list="getAllProducts"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TopSection from '@/pages/Sales/ManageProducts/TopSection.vue';
import ProductTable from '@/pages/Sales/ManageProducts/ProductTable.vue';
import AddOrEditProductModal from '@/pages/Sales/ManageProducts/AddOrEditProductModal.vue';

import ProductModule from '@/store/modules/product';
import { Product, ProductRequest } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import { MeasurementType } from '@/types';

const products = namespace('product');
let productModule: ProductModule;

@Component({
    components: {
        TopSection,
        ProductTable,
        AddOrEditProductModal,
    },
})
export default class ProductDashboard extends Mixins(UtilityMixins) {
    @products.State
    private products!: Product[];

    @products.State
    private productRequests!: ProductRequest;

    @products.State
    public measurementTypes!: Array<MeasurementType>;

    private productSearchString = '';

    private productIsEditing = false;
    private productToBeEdited = {};

    get searchMatchFound() {
        if (this.productSearchString.length === 0) return true;
        if (this.productSearchString.length > 0 && this.products.length < 1) return true;
        return this.products.length > 0 && this.productsToBeDisplayed.length > 0;
    }

    get productsToBeDisplayed(): Product[] {
        if (this.productSearchString === '') return this.products;

        //search all products' details for a match
        return this.products.filter(product => {
            const values = Object.values(product);
            return values.find(value => {
                if (typeof value !== 'string') return;
                return value.toLowerCase().includes(this.productSearchString.toLowerCase());
            });
        });
    }

    private showProductModal() {
        this.$bvModal.show('new-product-form');
    }

    private updateSearchString(searchString: string) {
        this.productSearchString = searchString;
    }

    private editProduct(productToBeEdited: Product) {
        this.productIsEditing = true;
        this.productToBeEdited = productToBeEdited;
        this.showProductModal();
    }

    private resetProductFormModal() {
        this.productIsEditing = false;
        this.productToBeEdited = {};
    }

    private async getAllProducts() {
        await productModule.getAllProducts();
    }

    private async getMeasurementTypes() {
        await productModule.getMeasurementTypes();
    }

    private goToSalesDashboard() {
        this.$router.push({ name: 'Sales' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Products');
    }

    mounted() {
        productModule = getModule(ProductModule, this.$store);
        this.getAllProducts();
        this.getMeasurementTypes();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/product-dashboard';
</style>
