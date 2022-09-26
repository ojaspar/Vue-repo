<template>
    <b-container fluid class="product-transactions">
        <div v-if="transactionsAreBeingFetched" class="product-transactions__loader">
            <Loader size="3" :isInline="false" />
        </div>

        <template v-else>
            <b-row class="product-transactions__cards">
                <div class="product-transactions__cards--left">
                    <div class="product-transactions__selected-product--name">
                        {{ selectedProduct.name }}
                    </div>
                    <div class="d-flex justify-content-between">
                        <p
                            v-if="selectedProduct.estimatedPrice.amount > 0"
                            class="product-transactions__selected-product--amount"
                        >
                            {{ selectedProduct.estimatedPrice | amountWithCurrency }}
                            <span class="product-transactions__selected-product--unit">
                                | {{ productMeasurementUnit() }}</span
                            >
                        </p>

                        <span class="product-transactions__selected-product--status-section">
                            <p
                                v-if="selectedProduct.stockItemStatus"
                                :class="[
                                    'product-transactions__selected-product--status',
                                    productStatusClass(selectedProduct.stockItemStatus),
                                ]"
                            >
                                {{ productAvailabiltyStatus() }}
                            </p>
                            <p
                                v-if="selectedProduct.availableQuantity"
                                class="product-transactions__selected-product--balance"
                            >
                                {{ productStockBalance() }}
                            </p>
                        </span>
                    </div>
                </div>

                <div class="product-transactions__cards--right d-none">
                    <div class="product-transactions__selected-product--total">
                        <div>
                            <p class="mb-0">Total Year Sales</p>
                            <p class="product-transactions__selected-product--total--year">₦ 500,000</p>
                        </div>

                        <p class="product-transactions__selected-product--total--month">
                            April Sales: <span>₦ 2,000</span>
                        </p>
                    </div>
                    <div>
                        <img src="@/assets/img/calendar-1.svg" alt="calendar" />
                    </div>
                </div>
            </b-row>

            <b-row class="product-transactions__actions">
                <p class="m-0">Transaction History</p>
                <div class="product-transactions__actions--buttons">
                    <p name="sales.csv" class="product-transactions__actions--export">
                        <DownloadCsv class="d-flex" :data="transactionExportData" name="product transactions.csv">
                            <img src="@/assets/img/black-download-icon.svg" class="mr-2" />Export
                        </DownloadCsv>
                    </p>
                    <BaseSecondaryButton
                        v-if="!userIsOnMobile"
                        buttonText="New Sale"
                        class="mr-5"
                        @button-clicked="startProductSale"
                    />
                    <BasePrimaryButton buttonText="Edit Product" @button-clicked="showProductModal" />
                </div>
            </b-row>

            <section class="general-module-dashboard__content-area">
                <!-- Search, Dates, Add New Estimate, Add New Sale -->
                <DashboardMidSection
                    class="mt-0"
                    :searchStringValue="transactionsSearchString"
                    :activeStatus="transactionStatusFilter"
                    :statusOptions="salesStatusOptions"
                    :fromDate="fromDate"
                    :toDate="toDate"
                    @search-input-changed="updateTransactionsSearchString"
                    @from-date-filter-has-changed="setFromDateFilter"
                    @to-date-filter-has-changed="setToDateFilter"
                    @status-filter-changed="handleSalesStatusFilterChange"
                    @apply-filters="applyFilters"
                />

                <!-- Transaction Table -->
                <b-row>
                    <b-col class="general-module-dashboard__table">
                        <transition name="fade" mode="out-in" appear>
                            <TransactionTable
                                :transactions="transactionsToBeDispslayed"
                                :searchMatchFound="searchMatchFound"
                                :requestStatus="productRequests.getProductTransactions"
                            />
                        </transition>
                    </b-col>
                </b-row>
            </section>
        </template>

        <!-- Edit Product Modal -->
        <AddOrEditProductModal
            :productIsEditing="true"
            :productToBeEdited="selectedProduct"
            @update-product-list="updateSelectedProduct"
        />
    </b-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DashboardMidSection from '@/components/ui/ModulesDashboard/DashboardMidSection.vue';
import TransactionTable from '@/pages/Sales/ManageProducts/ProductTransactionTable.vue';
import AddOrEditProductModal from '@/pages/Sales/ManageProducts/AddOrEditProductModal.vue';

import { DashboardStatusOption, Filters, MeasurementType, Status, VueExtension } from '@/types';
import { ProductTransaction } from '@/pages/Sales/ManageProducts/types';
import { ProductRequest, Product } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import ProductModule from '@/store/modules/product';
import SessionStorageService from '@/services/sessionStorage';

const products = namespace('product');
let productModule: ProductModule;

@Component({ components: { DashboardMidSection, TransactionTable, AddOrEditProductModal } })
export default class ProductTransactionsPage extends Mixins(UtilityMixins) {
    public $root!: VueExtension;

    private productKey = '';

    private selectedProduct: Product = {} as Product;

    private transactionsSearchString = '';

    private fromDate = '';

    private toDate = '';

    private transactionStatusFilter = '';

    private salesStatusOptions: Array<DashboardStatusOption> = [
        { key: 'all-transactions', name: 'All Transactions' },
        { key: 'pending-supply', name: 'Pending Supply' },
        { key: 'pending-payments', name: 'Pending Payment' },
        { key: 'completed', name: 'Completed' },
    ];

    @products.State
    private productRequests!: ProductRequest;

    @products.State
    private productTransactions!: ProductTransaction[];

    @products.State
    private products!: Product[];

    @products.State
    public measurementTypes!: Array<MeasurementType>;

    get transactionsSearchStringIsEmpty() {
        return this.transactionsSearchString.length == 0;
    }

    get searchMatchFound() {
        if (this.transactionsSearchStringIsEmpty) return true;
        if (!this.transactionsSearchStringIsEmpty && this.productTransactions.length < 1) return true;
        return this.productTransactions.length > 0 && this.transactionsToBeDispslayed.length > 0;
    }

    get datesSelected() {
        return this.fromDate !== '' || this.toDate !== '';
    }

    get dateFilteredTransactions(): ProductTransaction[] {
        return this.statusFilteredTransaction.filter(transaction => {
            if (this.fromDate && !this.toDate) {
                return new Date(transaction.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(transaction.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(transaction.transactionDate) >= new Date(this.fromDate) &&
                    new Date(transaction.transactionDate) <= new Date(this.toDate)
                );
            }
            return transaction;
        });
    }

    get statusFilteredTransaction(): ProductTransaction[] {
        return this.productTransactions.filter((transaction: ProductTransaction) => {
            const status = this.transactionStatusFilter;

            if (status === 'completed') {
                return transaction.transactionStatus.toLowerCase() === 'supplied';
            }
            if (status === 'pending-supply') {
                return (
                    transaction.transactionStatus.toLowerCase() === 'no supply' ||
                    transaction.transactionStatus.toLowerCase() === 'partial supply'
                );
            }
            if (status === 'pending-payments') {
                return transaction.balanceDue.amount > 0;
            }
            return transaction;
        });
    }

    get transactionListToFilter(): ProductTransaction[] {
        if (this.datesSelected) {
            return this.dateFilteredTransactions;
        }
        return this.statusFilteredTransaction;
    }

    get transactionsToBeDispslayed(): ProductTransaction[] {
        if (this.transactionsSearchStringIsEmpty && !this.datesSelected) {
            //return this.productTransactions;
            return this.statusFilteredTransaction;
        }
        if (this.transactionsSearchStringIsEmpty && this.datesSelected) {
            return this.dateFilteredTransactions;
        }

        return this.transactionListToFilter.filter(transaction => {
            const values = Object.values(transaction);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.transactionsSearchString.toLowerCase());
            });
        });
    }

    get transactionsAreBeingFetched() {
        return this.productRequests.getProductTransactions === Status.LOADING;
    }

    get dashboardStats() {
        return [
            {
                title: `${this.currentMonthInWords} Sales`,
                midSection: '₦ 70,000',
                icon: require('@/assets/img/calendar-1.svg'),
                meta: {},
                cssClass: 'product-transactions__cards--current-month',
            },
            {
                title: 'Total Year Sales ',
                midSection: this.$options.filters.amountWithCurrency({
                    amount: 500000,
                    currencyKey: 566,
                }),
                icon: require('@/assets/img/calendar-2.svg'),
                meta: { title: ' ', value: ' ' },
                cssClass: 'product-transactions__cards--current-year',
            },
        ];
    }

    get transactionExportData() {
        return this.transactionsToBeDispslayed.map((transaction: ProductTransaction) => ({
            totalAmount: this.$options.filters.amountWithCurrency(transaction.totalAmount),
            salesReferenceNumber: transaction.salesReferenceNumber,
            transactionDate: this.$options.filters.localDate(transaction.transactionDate),
            customerName: transaction.customerName,
            balanceOwed: this.$options.filters.amountWithCurrency(transaction.balanceDue),
            transactionStatus: transaction.transactionStatus,
            items: transaction.products,
            supplyDueDate: this.$options.filters.localDate(transaction.supplyDueDate),
        }));
    }

    private handleSalesStatusFilterChange(selectedStatus: string) {
        this.updateTransactionFilterStatus(selectedStatus);
        this.updateTransactionsSearchString('');
        const currentRoutePath = this.$router.currentRoute.fullPath;
        this.$router.replace({ path: currentRoutePath, query: { tab: selectedStatus } });
    }

    private updateTransactionFilterStatus(status: string) {
        this.transactionStatusFilter = status;
    }

    private updateTransactionsSearchString(searchString: string) {
        this.transactionsSearchString = searchString;
    }

    private setFromDateFilter(date: string) {
        this.fromDate = date;
    }

    private setToDateFilter(date: string) {
        this.toDate = date;
    }

    private applyFilters({ category, fromDate, toDate }: Filters) {
        let salesStatusToUse = 'all-sales';
        if (category) salesStatusToUse = category;

        this.transactionStatusFilter = salesStatusToUse;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    private startProductSale() {
        this.$router.push({
            name: 'RecordSale',
            params: { productKey: this.$route.params.productKey },
        });
    }

    private showProductModal() {
        this.$bvModal.show('new-product-form');
    }

    private productMeasurementUnit(formatUnit = true) {
        const { measurementTypeKey } = this.selectedProduct;
        const measurementType = this.measurementTypes.find((measurementType: MeasurementType) => {
            return measurementType.key === measurementTypeKey;
        });
        if (formatUnit) {
            const measurementUnit = measurementType?.name.substring(0, measurementType.name.length - 3);
            return measurementUnit;
        }
        return measurementType?.name;
    }

    private productAvailabiltyStatus() {
        const { stockItemStatus } = this.selectedProduct;
        return stockItemStatus?.toLowerCase() === 'in stock' ? 'Available' : 'Unavailable';
    }

    private productStatusClass(status: string) {
        const baseClass = 'product-transactions__selected-product--status';
        return status.toLowerCase() === 'in stock' ? `${baseClass}--available` : `${baseClass}--unavailable`;
    }

    private productStockBalance() {
        const { availableQuantity } = this.selectedProduct;
        const unit = this.productMeasurementUnit(false);
        return `${availableQuantity} ${unit}`;
    }

    private getSelectedProduct() {
        let selectedProduct;
        selectedProduct = SessionStorageService.getItem('product-transaction');
        if (selectedProduct) {
            selectedProduct = JSON.parse(selectedProduct);
            this.selectedProduct = selectedProduct;
            //SessionStorageService.removeItem('product-transaction');
            return;
        }
        this.$router.replace({ name: 'Products' });
    }

    private checkRouteQuery() {
        const { tab } = this.$route.query;
        if (tab) {
            this.transactionStatusFilter = String(tab);
            return;
        }
        this.transactionStatusFilter = 'all-transactions';
    }

    private async makePreliminaryRequests() {
        await Promise.all([
            productModule.getProductTransactions(this.selectedProduct.productKey),
            productModule.getMeasurementTypes(),
        ]);
    }

    private async updateSelectedProduct() {
        await productModule.getAllProducts();
        const updatedProduct = this.products.find((product: Product) => {
            return product.productKey === this.selectedProduct.productKey;
        });
        if (updatedProduct) this.selectedProduct = updatedProduct;
    }

    private goToSalesDashboard() {
        this.$router.push({ name: 'Sales' });
    }

    private goToProductsDashboard() {
        this.$router.push({ name: 'Products' });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Product Transactions');
    }

    created() {
        productModule = getModule(ProductModule, this.$store);
        this.emitMobilePageTitle();
        this.getSelectedProduct();
        this.makePreliminaryRequests();
        this.checkRouteQuery();
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/general-module-dashboard';
@import 'src/styles/pages/product-management/product-transactions.scss';
</style>
