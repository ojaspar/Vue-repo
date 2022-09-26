<template>
    <div>
        <div class="product-table__desktop">
            <b-row class="product-table__heading">
                <b-col class="pl-3 col-md-3 col-xl-4">Name</b-col>
                <b-col>Measurement</b-col>
                <b-col>Unit Price</b-col>

                <b-col>Last Sale Price</b-col>
                <b-col>Status</b-col>
            </b-row>

            <div v-if="productsAreAvailable">
                <b-row
                    class="product-table__content"
                    v-for="(product, index) in products"
                    :key="index"
                    @click="goToTransactionPage(product)"
                >
                    <b-col class="pl-3 col-md-3 col-xl-4">
                        {{ product.name }}
                        <p v-if="productIsSoldFromInventory(product.productType)" class="product-table__sub-text">
                            Inventory
                        </p>
                    </b-col>
                    <b-col>{{ measurementUnit(product.measurementTypeKey) }}</b-col>
                    <b-col>{{ product.estimatedPrice | amountWithCurrency }}</b-col>
                    <b-col>
                        <span v-if="product.lastSalePrice.amount">{{
                            product.lastSalePrice | amountWithCurrency
                        }}</span>
                        <span v-else>-</span>
                    </b-col>
                    <b-col>
                        <span v-if="product.stockItemStatus" :class="productStatusClass(product.stockItemStatus)">
                            {{ product.stockItemStatus }}
                        </span>
                        <p v-if="product.availableQuantity" class="product-table__sub-text">
                            {{ productStockBalance(product) }}
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="product-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="product-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <div class="product-table__mobile">
            <template v-if="productsAreAvailable">
                <div
                    class="product-table__mobile-content"
                    v-for="(product, index) in products"
                    :key="index"
                    @click="goToTransactionPage(product)"
                >
                    <span>
                        <p>{{ product.name }}</p>
                        <p>{{ product.estimatedPrice | amountWithCurrency }}</p>
                    </span>
                    <span>
                        <!-- Availability Status -->
                        <p v-if="product.stockItemStatus" :class="productStatusClass(product.stockItemStatus)">
                            {{ product.stockItemStatus }}
                        </p>

                        <!-- Available Unit(s) -->
                        <p v-if="product.availableQuantity" class="product-table__sub-text">
                            {{ productStockBalance(product) }}
                        </p>
                    </span>
                </div>
            </template>

            <div v-else-if="requestIsLoading" cols="12" class="product-table__content--loader">
                <Loader size="2" />
            </div>

            <div v-else cols="12" class="product-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Ref } from 'vue-property-decorator';

import ProductList from '@/pages/Sales/ManageProducts/Product.vue';

import { Product, defaultProduct } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import { MeasurementType } from '@/types';
import SessionStorageService from '@/services/sessionStorage';

@Component({
    components: {
        ProductList,
    },
})
export default class ProductTable extends Mixins(UtilityMixins) {
    @Prop({ default: () => defaultProduct }) readonly products!: Array<Product>;
    @Prop({ default: '' }) readonly productSearchString!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ required: true }) readonly measurementTypes!: Array<MeasurementType>;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    get requestIsLoading() {
        return this.status === 'LOADING';
    }

    get productsAreAvailable(): boolean {
        return this.products.length > 0;
    }

    get preparedProducts(): Product[] {
        return this.prepareProducts(this.products);
    }

    get allProducts(): Product[] {
        const allProducts = this.sortArrayByName(this.preparedProducts);
        return allProducts.filter(product => product.name.toLowerCase().match(this.productSearchString.toLowerCase()));
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.productsAreAvailable) {
            return 'There are no products available';
        }
        return '';
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private editProduct(existingProduct: Product) {
        this.$emit('edit-existing-product', existingProduct);
    }

    private goToTransactionPage(product: Product) {
        const { productKey } = product;
        const transactionPage = { name: 'ProductTransactions', params: { productKey } };
        SessionStorageService.setItem('product-transaction', JSON.stringify(product));
        this.$router.push(transactionPage);
    }

    private measurementUnit(measurementTypeKey: string) {
        const measurementType = this.measurementTypes.find((measurementType: MeasurementType) => {
            return measurementType.key === measurementTypeKey;
        });
        return measurementType?.name;
    }

    private productStatusClass(status: string) {
        const baseClass = 'product-table__status';
        return status.toLowerCase() === 'in stock' ? `${baseClass}--available` : `${baseClass}--unavailable`;
    }

    private productIsSoldFromInventory(productType: string) {
        if (!productType) return;
        return productType.toLowerCase() === 'goods' || productType.toLowerCase() === 'inventory';
    }

    private productStockBalance(product: Product) {
        const { availableQuantity, measurementTypeKey } = product;
        const unit = this.measurementUnit(measurementTypeKey);
        return `${availableQuantity} ${unit}`;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/product-table';
</style>
