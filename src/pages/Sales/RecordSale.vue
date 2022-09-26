<template>
    <b-container fluid class="record-sale" :class="[documentPreviewMode && 'pr-0 pl-0']">
        <DocumentPreviewPage
            v-if="documentPreviewMode"
            :documentPreviewType="documentPreviewType"
            :documentDetails="documentDetails"
            @document-preview-back-button-clicked="handleDocumentPreviewBackButtonClick"
            @new-estimate-button-clicked="handleNewTransactionButtonClick"
        />

        <SuccessPage v-else-if="newSaleSuccess">
            <BaseButton
                v-if="showInvoiceDownloadButton"
                buttonText="Generate Invoice"
                :overRideButtonClass="true"
                @button-clicked="generateAndPreviewDocument(salesDocument.INVOICE)"
                :status="invoiceGenerationRequestStatus"
                className="success-page__btn success-page__btn--invoice success-page__btn--white"
                :disabled="salesDocumentIsBeingGenerated"
            />

            <BaseButton
                v-else
                buttonText="Generate Receipt"
                :overRideButtonClass="true"
                @button-clicked="generateAndPreviewDocument(salesDocument.RECEIPT)"
                :status="receiptGenerationRequestStatus"
                className="success-page__btn success-page__btn--receipt success-page__btn--white"
                :disabled="salesDocumentIsBeingGenerated"
            />

            <BasePrimaryButton
                buttonText="New Sale"
                @button-clicked="handleNewTransactionButtonClick"
                className="success-page__btn success-page__btn--blue"
                :disabled="salesDocumentIsBeingGenerated"
            />

            <template #new-row>
                <BlockErrorMessage :message="errorMessage" class="mt-5" />
            </template>
        </SuccessPage>

        <b-row class="add-sale-content p-0" v-else>
            <b-col sm="12" md="8" lg="7" xl="4" class="p-0 add-sale-content__left" v-if="splitPageIntoTwoSections">
                <TabletPlusNavigationHeader
                    :activeComponentIndex="activeComponentIndex"
                    :pageTitle="pageTitle"
                    :selectedItemsCount="selectedItemsCount"
                    :showCart="shouldShowCart"
                    showBackButton="false"
                    :leftIcon="leftIcon"
                    @cancel-button-clicked="handleGoBack"
                    @back-button-clicked="handleGoBack"
                    @cart-is-clicked="goToSalesSummaryPage"
                    v-if="!userIsOnMobile"
                />

                <MobileHeader
                    :class="proceedWithoutCustomer ? 'no-customer-class' : 'customer-class'"
                    :customerName="selectedCustomerName"
                    v-if="showCustomerCard"
                />

                <div class="customer-card-spacer" v-if="showCustomerCard"></div>

                <div class="add-sale-content__body" :class="cardClass">
                    <Loader size="4" v-if="preliminaryDetailsForSalesIsLoading" />
                    <transition name="slide-up-fade" mode="out-in" appear v-else>
                        <component
                            :key="activeComponentIndex"
                            :is="componentsList[activeComponentIndex]"
                            :isCustomerCompulsory="isCustomerCompulsory"
                            :isProductCompulsory="isProductCompulsory"
                            :searchedProduct="productSearchString"
                            :productIsEditing="productIsEditing"
                            :productToBeEdited="productToBeEdited"
                            :selectedProduct="selectedProduct"
                            :customerNameForPreload="customerNameFromSearchInput"
                            :productDetails="productDetails"
                            addOrEditCustomerFormButtonText="Next"
                            :productSummaries="productSummaries"
                            :paymentAccounts="paymentAccounts"
                            :isEstimate="isEstimate"
                            :editMode="editMode"
                            :itemToBeEdited="itemToBeEdited"
                            :transactionWithoutCustomer="proceedWithoutCustomer"
                            :selectedSalesCurrency="saleCurrencyKey"
                            :detailsForPreviousSalesEditIsReady="detailsForPreviousSalesEditIsReady"
                            :editSalesFormDetails="editSalesFormDetails"
                            :salesRequestLoadingStatus="salesRequestLoadingStatus"
                            :getPaymentAccountsStatus="salesRequestStatus.getPaymentAccounts"
                            :inputSalesSummary="salesSummary"
                            :inputEstimateSummary="estimateSummary"
                            :selectedProducts="selectedProducts"
                            :salesRequestStatus="salesRequestStatus"
                            @proceed-without-customer-text-clicked="proceedWithoutCustomerHandler"
                            @add-another-product-button-clicked="addAnotherProductFromFullSummaryPage"
                            @customer-selected="setCustomerForSale"
                            @convert-estimate-to-sale="convertEstimateToSale"
                            @customer-added="setCustomerForSale"
                            @product-selected="setProductForSale"
                            @new-product-added="setProductForSale"
                            @add-new-product="addNewProduct"
                            @existing-product-updated="handleProductUpdate"
                            @edit-existing-product="editExistingProduct"
                            @add-new-customer="showAddNewCustomerForm"
                            @edit-customer="showAddEditCustomerForm"
                            @edit-product-pricing="setProductDetailsAndShowProductPricingForm"
                            @set-transient-item="setTransientItem"
                            @update-product-pricing-details="updateProductPricingDetailsAndShowAddProductForm"
                            @add-product-to-cart="addProductToCart"
                            @add-product-to-summary="addProductToSummary"
                            @submit-sales-form="submitSalesForm"
                            @save-sales-form="saveSalesForm"
                            @save-estimate-form="saveEstimateForm"
                            @submit-estimate-form="submitEstimateForm"
                            @edit-sale-item="editSaleItem"
                            @delete-sale-item="deleteSaleItem"
                            @update-product-in-summary="updateProductInSummary"
                            @update-product-in-cart="updateProductInCart"
                            @resize-page-for-desktop="resizePageForDesktop"
                        />
                    </transition>
                </div>
            </b-col>

            <b-col
                class="add-sale-content__right"
                :class="[!isFullProductSummaryPage && 'add-sale-content__right--xl']"
            >
                <ProductSummaryPage
                    :isFullProductSummaryPage="isFullProductSummaryPage"
                    :productSummaries="productSummaries"
                    :paymentAccounts="paymentAccounts"
                    :selectedSalesCurrency="saleCurrencyKey"
                    :isEstimate="isEstimate"
                    :transactionWithoutCustomer="proceedWithoutCustomer"
                    :editSalesFormDetails="editSalesFormDetails"
                    :isEditingPreviousSale="isEditingPreviousSale"
                    :detailsForPreviousSalesEditIsReady="detailsForPreviousSalesEditIsReady"
                    :salesRequestLoadingStatus="salesRequestLoadingStatus"
                    :getPaymentAccountsStatus="salesRequestStatus.getPaymentAccounts"
                    :inputSalesSummary="salesSummary"
                    :inputEstimateSummary="estimateSummary"
                    :selectedProducts="selectedProducts"
                    :salesRequestStatus="salesRequestStatus"
                    @add-another-product-button-clicked="addAnotherProductFromFullSummaryPage"
                    @show-full-product-summary-page="goToSalesSummaryPage"
                    @submit-sales-form="submitSalesForm"
                    @save-sales-form="saveSalesForm"
                    @save-estimate-form="saveEstimateForm"
                    @submit-estimate-form="submitEstimateForm"
                    @edit-sale-item="editSaleItem"
                    @delete-sale-item="deleteSaleItem"
                    @resize-page-for-mobile="resizePageForMobile"
                />
            </b-col>
        </b-row>

        <AddOrEditCustomerModal :customerToBeEdited="customerToBeEdited" :isEditing="isEditingCustomer" />

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />

        <!-- Document Preview section -->
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import SelectCustomer from '@/pages/Sales/SelectCustomer.vue';
import SelectProduct from '@/pages/Sales/SelectProduct.vue';
import AddOrEditProductForm from '@/pages/Sales/AddOrEditProductForm.vue';
import AddOrEditCustomerForm from '@/pages/Sales/ManageCustomers/AddOrEditCustomerForm.vue';
import AddOrEditCustomerModal from '@/pages/Sales/ManageCustomers/AddOrEditCustomerModal.vue';
import EditProductPricing from '@/pages/Sales/EditProductPricing.vue';
import DocumentPreviewPage from '@/pages/Sales/DocumentPreviewPage.vue';
import ProductSummaryPage from '@/pages/Sales/ProductSummaryPage.vue';
import AddProductToSales from '@/pages/Sales/AddProductToSales.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import UtilityMixins from '@/mixins/Utility';

import ProductModule from '@/store/modules/product';
import SalesModule from '@/store/modules/sale';
import GeneralModule from '@/store/modules/general';

import {
    ProductDetails,
    Product,
    SalesItemSummary,
    ProductSummary,
    AddProductToSalesForm,
    ProductSummaryDetails,
    SaleRequest,
    EstimateSummaryDetails,
    RecordEstimateRequest,
    DocumentPreviewType,
    DocumentDetails,
    SaleDetails,
    ProductInProductDetailsForm,
    initialStateOfCustomer,
    initialStateOfProduct,
    TaxForms,
    SalesDocumentType,
} from '@/pages/Sales/types';
import { LeftIcon, MeasurementType, PaymentAccount, SaleRequestStatus, Status } from '@/types';
import { CustomerDetails } from '@/pages/Sales/ManageCustomers/types';
import SessionStorageService from '@/services/sessionStorage';

const products = namespace('product');
const sales = namespace('sale');
const general = namespace('general');

let productModule: ProductModule;
let salesModule: SalesModule;
let generalModule: GeneralModule;

@Component({
    components: {
        SelectCustomer,
        AddOrEditCustomerForm,
        AddOrEditCustomerModal,
        SelectProduct,
        AddOrEditProductForm,
        AddProductToSales,
        EditProductPricing,
        ProductSummaryPage,
        DocumentPreviewPage,
    },
})
export default class RecordSale extends Mixins(DynamicComponentMixin, UtilityMixins) {
    private componentsList: object[] = [
        SelectCustomer,
        AddOrEditCustomerForm,
        AddOrEditCustomerModal,
        SelectProduct,
        AddOrEditProductForm,
        ProductSummaryPage,
        EditProductPricing,
        AddProductToSales,
    ];
    private newSaleSuccess = false;
    private isFullProductSummaryPage = false;
    private isCustomerCompulsory = false;
    private splitPageIntoTwoSections = true;
    private selectedCustomer: CustomerDetails = {
        ...initialStateOfCustomer,
    };
    private customerNameFromSearchInput = '';
    private customerToBeEdited: CustomerDetails = {
        ...initialStateOfCustomer,
    };
    private selectedProduct = { ...initialStateOfProduct };
    private isEditingCustomer = false;
    private isProductCompulsory = true;
    private productSearchString = '';
    private productIsEditing = false;
    private pageTitle = 'Select Customer';
    private leftIcon = LeftIcon.None;
    private saleCurrencyKey: string | number = 0;
    private productToBeEdited: ProductDetails = {
        productKey: '',
        name: '',
        description: '',
        incomeGroupKey: '',
        estimatedPrice: {
            currencyKey: 0,
            amount: 0,
        },
        measurementTypeKey: '',
    };
    private proceedWithoutCustomer = false;
    private productDetails: SalesItemSummary = {
        name: '',
        unitPrice: { amount: 0, currencyKey: 0 },
        measurementType: '',
        quantity: 1,
        discount: { amount: 0, currencyKey: 0 },
    };
    private productSummaries: Array<ProductSummary> = [];
    private selectedProducts: Array<AddProductToSalesForm> = [];
    private indexOfActiveProductSummary: number | string = '';
    private blankItem: AddProductToSalesForm = {
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
    private itemToBeEdited: AddProductToSalesForm = { ...this.blankItem };
    private editMode = false;
    private documentPreviewMode = false;
    private documentPreviewType = DocumentPreviewType.RECEIPT;
    private documentDetails: DocumentDetails = {
        customer: { name: '', email: '', phoneNumber: '' },
        amountPaid: { currencyKey: 0, amount: 0 },
        transactionDate: '',
        dateIssued: '',
        notes: '',
        products: [],
    };

    private editSalesFormDetails: ProductSummaryDetails = {
        amountPaid: { amount: 0, currencyKey: 0 },
        transactionDate: '',
        paymentAccountKey: '',
        balanceDueDate: '',
    };
    private detailsForPreviousSalesEditIsReady = false;
    private salesSummary: ProductSummaryDetails = {
        amountPaid: { currencyKey: 0, amount: 0 },
        balanceDueDate: this.todayAsDefaultDate(),
        transactionDate: this.todayAsDefaultDate(),
        paymentAccountKey: '',
    };

    private estimateSummary: EstimateSummaryDetails = {
        dateIssued: this.todayAsDefaultDate(),
        notes: '',
    };

    private showInvoiceDownloadButton = false;
    private showReceiptDownloadButton = false;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'record-sale-toaster',
        position: 'b-toaster-top-right',
    };

    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: '' }) action!: string;

    @products.State
    private measurementTypes!: Array<MeasurementType>;

    @products.State
    private products!: Array<Product>;

    @sales.State
    private paymentAccounts!: Array<PaymentAccount>;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    @sales.State
    private saleDetails!: SaleDetails;

    @sales.State
    private errorMessage!: string;

    @sales.State
    private errorCode!: string;

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCancelButtonClicked!: boolean;

    @general.State
    private mobileCartButtonClicked!: boolean;

    @sales.State
    private saleKey!: string;

    get salesDocument(): SalesDocumentType {
        return {
            ESTIMATE: DocumentPreviewType.ESTIMATE,
            INVOICE: DocumentPreviewType.INVOICE,
            RECEIPT: DocumentPreviewType.RECEIPT,
        };
    }

    get isEditingPreviousSale(): boolean {
        return this.action === 'edit';
    }

    get cardClass(): string {
        return this.$root.isLargeScreenSize ? 'add-sale-content__body--xl' : '';
    }

    get showCustomerCard(): boolean {
        return (this.proceedWithoutCustomer || this.customerNameIsNotEmpty) && this.userIsOnMobile;
    }

    get customerNameIsNotEmpty(): boolean {
        return this.selectedCustomer.name.length > 1;
    }

    get selectedCustomerName(): string {
        if (this.proceedWithoutCustomer) {
            return 'Unnamed Customer';
        }

        if (this.customerNameIsNotEmpty) {
            return this.selectedCustomer.name;
        }

        return '';
    }

    get selectedItemsCount(): number {
        return this.selectedProducts.length;
    }

    get shouldShowCart(): boolean {
        return this.hasItemsInCart && !this.$root.isLargeScreenSize;
    }

    get hasItemsInCart() {
        return this.selectedProducts.length > 0;
    }

    get preliminaryDetailsForSalesIsLoading(): boolean {
        // extend this expression as the need grows
        return this.salesRequestStatus.getSaleDetails === Status.LOADING;
    }

    get salesRequestLoadingStatus(): Status {
        if (this.isEditingPreviousSale) return this.salesRequestStatus.updateSale;

        return this.salesRequestStatus.createSale;
    }

    get invoiceGenerationRequestStatus(): Status {
        if (this.documentPreviewType === DocumentPreviewType.INVOICE) return this.salesRequestStatus.generatePdf;

        return Status.NORMAL;
    }

    get receiptGenerationRequestStatus(): Status {
        if (this.documentPreviewType === DocumentPreviewType.RECEIPT) return this.salesRequestStatus.generatePdf;

        return Status.NORMAL;
    }

    get salesDocumentIsBeingGenerated(): boolean {
        return this.salesRequestStatus.generatePdf === Status.LOADING;
    }

    private setTransientItem(addProductToSalesForm: AddProductToSalesForm) {
        this.itemToBeEdited = addProductToSalesForm;
    }

    private addProductToCart(addProductToSalesForm: AddProductToSalesForm) {
        this.selectedProducts.push(addProductToSalesForm);
        this.itemToBeEdited = { ...this.blankItem };

        this.setCartCount();

        if (this.saleCurrencyKey === 0) {
            this.saleCurrencyKey = addProductToSalesForm.unitPrice.currencyKey;
        }

        // if (this.$root.isLargeScreenSize) {
        //     this.goToProductSelectionPage();
        // }

        this.goToSalesSummaryPage();
    }

    private updateProductInSummary(productSummary: ProductSummary) {
        this.productSummaries.splice(Number(this.indexOfActiveProductSummary), 1, productSummary);
    }

    private updateProductInCart(addProductToSalesForm: AddProductToSalesForm) {
        this.selectedProducts.splice(Number(this.indexOfActiveProductSummary), 1, addProductToSalesForm);

        this.setCartCount();

        this.editMode = false;
        if (this.$root.isLargeScreenSize) {
            this.goToProductSelectionPage();
        } else {
            this.goToSalesSummaryPage();
        }
    }

    private addProductToSummary(productSummary: ProductSummary) {
        this.productSummaries.push(productSummary);
    }

    private setCustomerForSale(customer: CustomerDetails) {
        this.selectedCustomer = customer;
        this.proceedWithoutCustomer = false;
        this.$nextTick(() => {
            this.goToProductSelectionPage();
        });
    }

    public goToProductSelectionPage() {
        this.$nextTick(() => {
            this.setActiveComponentIndex(3);
        });
    }

    public goToCustomerSelectionPage() {
        this.$nextTick(() => {
            this.selectedCustomer = initialStateOfCustomer;
            this.proceedWithoutCustomer = false;
            this.setActiveComponentIndex(0);
        });
    }

    public addAnotherProductFromFullSummaryPage() {
        this.isFullProductSummaryPage = false;
        this.splitPageIntoTwoSections = true;
        this.editMode = false;
        this.goToProductSelectionPage();
    }

    private proceedWithoutCustomerHandler() {
        this.proceedWithoutCustomer = true;
        this.$nextTick(() => {
            this.goToProductSelectionPage();
        });
    }

    private addNewProduct(searchedProduct: string) {
        this.productSearchString = searchedProduct;
        this.productIsEditing = false;
        this.setActiveComponentIndex(4);
    }

    private editExistingProduct(existingProduct: ProductDetails) {
        Object.assign(this.productToBeEdited, existingProduct);
        this.productIsEditing = true;
        this.setActiveComponentIndex(4);
    }

    private showAddNewCustomerForm(customerName: string) {
        this.customerNameFromSearchInput = customerName;
        this.$nextTick(() => {
            this.setActiveComponentIndex(1);
        });
    }

    private showAddEditCustomerForm(customerForEdit: CustomerDetails) {
        this.customerToBeEdited = Object.assign({}, this.customerToBeEdited, customerForEdit);

        this.isEditingCustomer = true;
        this.$bvModal.show('new-customer-form');
    }

    private goToSalesSummaryPage() {
        if (this.userIsOnDesktop) {
            this.splitPageIntoTwoSections = false;
            this.isFullProductSummaryPage = true;
        }

        this.$nextTick(() => {
            this.setActiveComponentIndex(5);
        });
    }

    private showDocumentPreviewPage(newDocumentPreviewType: DocumentPreviewType) {
        this.$nextTick(() => {
            this.documentPreviewMode = true;
            this.documentPreviewType = newDocumentPreviewType;
        });
    }

    private setProductForSale(product: Product) {
        this.selectedProduct = product;
        const { estimatedPrice, lastSalePrice, name } = product;

        let currencyKey = lastSalePrice.currencyKey;
        let unitPriceAmount = lastSalePrice.amount;

        if (unitPriceAmount <= 0 && estimatedPrice.amount > 0) {
            unitPriceAmount = estimatedPrice.amount;
            currencyKey = estimatedPrice.currencyKey;
        }

        const measurementTypeIndex = this.measurementTypes.findIndex(
            (measurementType: MeasurementType) => measurementType.key === this.selectedProduct.measurementTypeKey,
        );

        this.productDetails = {
            name,
            unitPrice: { currencyKey: currencyKey, amount: unitPriceAmount },
            measurementType: measurementTypeIndex ? this.measurementTypes[measurementTypeIndex].name : '',
            quantity: 1,
            discount: { amount: 0, currencyKey: 0 },
        };

        this.$nextTick(() => {
            this.goToAddProductToSalePage();
        });
    }

    private goToAddProductToSalePage() {
        this.setActiveComponentIndex(7);
    }

    private showEditProductPricingForm() {
        this.setActiveComponentIndex(6);
    }

    private setProductDetailsAndShowProductPricingForm(productDetails: SalesItemSummary) {
        this.productDetails = productDetails;

        this.$nextTick(() => {
            this.showEditProductPricingForm();
        });
    }

    private updateProductPricingDetailsAndShowAddProductForm(productDetails: SalesItemSummary) {
        this.productDetails = productDetails;

        this.itemToBeEdited.unitPrice.amount = productDetails.unitPrice.amount;
        this.itemToBeEdited.unitPrice.currencyKey = productDetails.unitPrice.currencyKey;

        if (this.itemToBeEdited.quantity == this.itemToBeEdited.quantitySupplied)
            this.itemToBeEdited.quantitySupplied = productDetails.quantity;

        this.itemToBeEdited.quantity = productDetails.quantity;

        this.$nextTick(() => {
            this.goToAddProductToSalePage();
        });
    }

    private setItemForSaleEdit(product: Product) {
        this.selectedProduct = product;
        const { estimatedPrice, name } = product;

        const measurementTypeIndex = this.measurementTypes.findIndex(
            (measurementType: MeasurementType) => measurementType.key === this.selectedProduct.measurementTypeKey,
        );

        this.productDetails = {
            name,
            unitPrice: { currencyKey: estimatedPrice.currencyKey, amount: estimatedPrice.amount },
            measurementType: measurementTypeIndex ? this.measurementTypes[measurementTypeIndex].name : '',
            quantity: 1,
            discount: { amount: 0, currencyKey: 0 },
        };

        this.$nextTick(() => {
            this.goToAddProductToSalePage();
        });
    }

    private editSaleItem(indexOfItem: number) {
        this.indexOfActiveProductSummary = indexOfItem;
        const itemToBeEdited: AddProductToSalesForm = this.selectedProducts[indexOfItem];
        const { measurementUnit }: ProductSummary = this.productSummaries[indexOfItem];
        this.itemToBeEdited = itemToBeEdited;

        this.productDetails = {
            name: itemToBeEdited.name,
            unitPrice: itemToBeEdited.unitPrice,
            measurementType: measurementUnit,
            quantity: itemToBeEdited.quantity,
            discount: itemToBeEdited.discount,
        };
        this.isFullProductSummaryPage = false;
        this.splitPageIntoTwoSections = true;
        this.editMode = true;
        const selectedProductObject = this.products.find(
            (product: Product) => product.productKey === itemToBeEdited.productKey,
        );

        if (selectedProductObject) {
            this.selectedProduct = selectedProductObject;
            this.$nextTick(() => {
                this.goToAddProductToSalePage();
            });
        }
    }

    private deleteSaleItem(indexOfItemToRemove: number) {
        this.selectedProduct = initialStateOfProduct;
        this.productDetails = {
            name: '',
            unitPrice: { currencyKey: 0, amount: 0 },
            measurementType: '',
            quantity: 0,
            discount: { amount: 0, currencyKey: 0 },
        };
        this.productSummaries.splice(Number(indexOfItemToRemove), 1);
        this.selectedProducts.splice(Number(indexOfItemToRemove), 1);
        this.indexOfActiveProductSummary = '';

        this.setCartCount();

        this.$nextTick(() => {
            if (this.selectedProducts.length === 0) {
                this.splitPageIntoTwoSections = true;
                this.isFullProductSummaryPage = false;
                this.goToProductSelectionPage();
            }
        });
    }

    private handleNotification(productSummaryDetails: ProductSummaryDetails) {
        if (
            this.salesRequestStatus.createSale === Status.SUCCESS ||
            this.salesRequestStatus.updateSale === Status.SUCCESS
        ) {
            this.newSaleSuccess = true;

            const { name, email, phoneNumber } = this.selectedCustomer;
            const documentDetails = {
                customer: {
                    name,
                    email,
                    phoneNumber,
                },
                ...productSummaryDetails,
                dateIssued: '',
                notes: '',
                products: this.productSummaries,
            };

            this.documentDetails = documentDetails;
            return;
        }

        this.showErrorNotification();
    }

    private showErrorNotification() {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: this.errorMessage || 'Something went wrong, please try again in a few minutes!',
        });
    }

    private saveSalesForm(salesSummaryDetails: ProductSummaryDetails) {
        this.salesSummary = { ...salesSummaryDetails };
    }

    private async submitSalesForm({ sales, balance }: { sales: ProductSummaryDetails; balance: number }) {
        const saleRequest: SaleRequest = {
            ...sales,
            customerKey: this.selectedCustomer.customerKey,
            products: this.selectedProducts,
            saleKey: this.$route.params.saleKey,
        };

        if (this.isEditingPreviousSale) {
            await salesModule.updateSale(saleRequest);
        } else {
            await salesModule.recordSale(saleRequest);
        }

        if (balance === 0 || this.proceedWithoutCustomer) {
            this.showReceiptDownloadButton = true;
        } else {
            this.showInvoiceDownloadButton = true;
        }

        this.handleNotification(sales);
    }

    public async handleNewTransactionButtonClick() {
        if (this.isEditingPreviousSale) {
            this.$router.push({ name: 'RecordSale' });
            return;
        }

        window.location.reload();
    }

    public handleDocumentPreviewBackButtonClick() {
        this.documentPreviewMode = false;
    }

    public async generateAndPreviewDocument(documentType: DocumentPreviewType) {
        this.documentPreviewType = documentType;

        const saleKey = this.isEditingPreviousSale ? this.$route.params.saleKey : this.saleKey;

        await salesModule.generatePdf({
            saleKey: saleKey,
            documentType,
        });

        if (this.salesRequestStatus.generatePdf === Status.SUCCESS) {
            this.showDocumentPreviewPage(documentType);
            return;
        }
    }

    private handleProductUpdate() {
        //trigger a product refresh...
        productModule.getAllProducts();
        this.goToProductSelectionPage();
    }

    private clearAllData() {
        this.selectedProduct = initialStateOfProduct;
        this.productDetails = {
            name: '',
            unitPrice: { currencyKey: 0, amount: 0 },
            measurementType: '',
            quantity: 0,
            discount: { amount: 0, currencyKey: 0 },
        };
        this.selectedCustomer = initialStateOfCustomer;
        this.customerToBeEdited = initialStateOfCustomer;

        this.productToBeEdited = {
            productKey: '',
            name: '',
            description: '',
            incomeGroupKey: '',
            estimatedPrice: {
                currencyKey: 0,
                amount: 0,
            },
            measurementTypeKey: '',
        };
        this.productDetails = {
            name: '',
            unitPrice: { amount: 0, currencyKey: 0 },
            measurementType: '',
            quantity: 1,
            discount: { amount: 0, currencyKey: 0 },
        };
        this.productSummaries = [];
        this.selectedProducts = [];
    }

    private saveEstimateForm(estimateSummaryDetails: EstimateSummaryDetails) {
        this.estimateSummary = { ...estimateSummaryDetails };
    }

    private async submitEstimateForm(estimateSummaryDetails: EstimateSummaryDetails) {
        const estimateRequest: RecordEstimateRequest = {
            ...estimateSummaryDetails,
            customerKey: this.selectedCustomer.customerKey,
            products: this.selectedProducts,
            saleKey: this.$route.params.saleKey,
        };

        if (this.isEditingPreviousSale) {
            await salesModule.updateEstimate(estimateRequest);
        } else {
            await salesModule.recordEstimate(estimateRequest);
        }

        if (this.salesRequestStatus.recordEstimate === Status.ERROR) {
            this.showErrorNotification();
            return;
        }

        const saleKey = this.isEditingPreviousSale ? estimateRequest.saleKey : this.saleKey;

        await salesModule.generatePdf({ saleKey: saleKey || '', documentType: DocumentPreviewType.ESTIMATE });

        // after successful submission
        const { name, email, phoneNumber } = this.selectedCustomer;
        const documentDetails = {
            customer: {
                name,
                email,
                phoneNumber,
            },
            amountPaid: { amount: 0, currencyKey: 0 },
            ...estimateSummaryDetails,
            transactionDate: '',
            products: this.productSummaries,
        };

        this.documentDetails = documentDetails;

        // this.clearAllData();

        if (this.salesRequestStatus.generatePdf === Status.ERROR) {
            this.showErrorNotification();
            return;
        }

        this.$nextTick(() => {
            // pending when we build out the success page
            this.showReceiptDownloadButton = false;
            this.documentPreviewMode = true;
            this.documentPreviewType = DocumentPreviewType.ESTIMATE;
        });

        // show the success notification
        // show the error notification
        // redirect to the success page
    }

    private setProductSummaries(isEstimateConversion?: boolean) {
        const { products } = this.saleDetails;

        this.productSummaries = products.map((product: ProductInProductDetailsForm) => {
            const subTotal = Number(product.unitPrice.amount) * product.quantity - Number(product.discount.amount);

            let totalExclusiveVat = subTotal;

            if (product.vatTypeName === TaxForms.INCLUSIVE) {
                totalExclusiveVat = subTotal - product.vat;
            }

            // const totalExclusiveVat = total - product.vat;
            const currencyKey = product.unitPrice.currencyKey;

            const supplyStatus = (): string => {
                const { quantitySupplied, quantity } = product;

                if (quantitySupplied === quantity) {
                    return 'Supplied';
                }

                if (quantitySupplied === 0) {
                    return 'Not Supplied';
                }

                return 'Pending Supply';
            };

            return {
                productName: product.productName,
                productKey: product.productKey,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                measurementTypeKey: product.measurementTypeKey,
                measurementUnit: product.measurementTypeName,
                notes: product.notes,
                files: product.attachments,
                supplyStatus: isEstimateConversion ? 'Supplied' : supplyStatus(),
                discount: product.discount,
                vatAmount: { amount: product.vat, currencyKey },
                totalExclusiveVat: {
                    amount: totalExclusiveVat,
                    currencyKey,
                },
                vatType: product.vatTypeName,
                subTotal: { amount: subTotal, currencyKey },
            };
        });
    }

    private setSelectedProductItems(isEstimateConversion?: boolean) {
        const { products } = this.saleDetails;

        this.selectedProducts = products.map((product: ProductInProductDetailsForm) => ({
            productKey: product.productKey,
            name: product.productName,
            unitPrice: product.unitPrice,
            measurementTypeKey: product.measurementTypeKey,
            quantity: product.quantity,
            discount: product.discount,
            vatTypeKey: product.vatTypeKey,
            quantitySupplied: isEstimateConversion ? product.quantity : product.quantitySupplied,
            supplyDueDate: this.formatDateToFitCalendarFormat(product.supplyDueDate),
            attachmentArray: product.attachments,
            notes: product.notes,
        }));
    }

    public prepareStatesForEditingPreviousSale() {
        if (this.salesRequestStatus.getSaleDetails === Status.SUCCESS) {
            this.detailsForPreviousSalesEditIsReady = true;

            const {
                customer: { name },
                customerKey,
                amountPaid,
                balanceDueDate,
                transactionDate,
                paymentAccountKey,
            } = this.saleDetails;

            //TODO remove this line when this bug has fixed at the backend - this line was added when the customer key was coming as '0000-0000'
            if (!customerKey.match('0000-0000')) {
                this.selectedCustomer = { ...initialStateOfCustomer, name, customerKey };
            } else {
                this.proceedWithoutCustomer = true;
            }

            this.setProductSummaries();
            this.setSelectedProductItems();

            const editSalesFormDetails = {
                amountPaid,
                balanceDueDate: this.formatDateToFitCalendarFormat(balanceDueDate),
                transactionDate: this.formatDateToFitCalendarFormat(transactionDate),
                paymentAccountKey,
            };

            this.editSalesFormDetails = editSalesFormDetails;
        }
    }

    @Watch('activeComponentIndex')
    activeComponentIndexHasChanged(newValue: number) {
        this.$parent.$emit('active-component-index', newValue);
        // this watcher would help for situations whereby the section is handled without the pageTitle being set
        // that is, when this.handlePreviousSection and this.handleNextSection methods are used
        // it helps set the appropriate pageTitle for the appriopriate activeComponentIndex
        switch (newValue) {
            case 0:
                this.pageTitle = 'Select Customer';
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(false);
                break;
            case 1:
                this.pageTitle = 'New Customer';
                this.leftIcon = LeftIcon.Cancel;
                this.setCartVisibility(false);
                break;
            case 2:
                this.pageTitle = 'Edit Customer';
                this.leftIcon = LeftIcon.Cancel;
                this.setCartVisibility(false);
                break;
            case 3:
                this.pageTitle = 'Select Product';
                this.leftIcon = this.hasItemsInCart ? LeftIcon.None : LeftIcon.Back;
                this.setCartVisibility(true);
                break;
            case 4:
                this.pageTitle = this.productIsEditing ? 'Edit Product Details' : 'New Product';
                this.leftIcon = LeftIcon.Cancel;
                break;
            case 5:
                this.pageTitle = this.isEstimate ? 'Quotation Summary' : 'Sales Summary';
                this.leftIcon = LeftIcon.None;
                this.setCartVisibility(true);
                break;
            case 6:
                this.pageTitle = 'Edit Item Price';
                this.leftIcon = LeftIcon.Back;
                break;
            case 7:
                this.pageTitle = this.editMode ? 'Update Item' : 'Add Item';
                this.leftIcon = this.editMode ? LeftIcon.Cancel : LeftIcon.Back;
                this.setCartVisibility(true);
                break;
            default:
                this.pageTitle = 'Select Customer';
                this.leftIcon = LeftIcon.Hamburger;
                this.setCartVisibility(false);
        }
    }

    @Watch('pageTitle')
    pageTitleChanged() {
        this.$parent.$emit('update-page-title', this.pageTitle);
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileBackButtonState(false);
    }

    @Watch('mobileCancelButtonClicked')
    watchMobileCancelButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.handleGoBack();
        }
        generalModule.setMobileCancelButtonState(false);
    }

    @Watch('mobileCartButtonClicked')
    watchMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked && this.hasItemsInCart) {
            this.goToSalesSummaryPage();
        }
        generalModule.setMobileCartButtonState(false);
    }

    private handleGoBack() {
        switch (this.activeComponentIndex) {
            case 1: //New Customer
            case 2: //Edit Customer
            case 3: //Select Product
                this.goToCustomerSelectionPage();
                break;
            case 4: //Add or Edit Product
                this.goToProductSelectionPage();
                break;
            case 6: //Edit Item Price
                this.goToAddProductToSalePage();
                break;
            case 7: //Add or Update Item
                this.editMode ? this.goToSalesSummaryPage() : this.goToProductSelectionPage();
                break;
            default:
                break;
        }
    }

    private resizePageForMobile() {
        this.splitPageIntoTwoSections = true;
    }

    private resizePageForDesktop() {
        if (this.activeComponentIndex == 5) {
            this.isFullProductSummaryPage = true;
            this.splitPageIntoTwoSections = false;
        }
    }

    @Watch('newSaleSuccess')
    newSaleSuccessChanged() {
        if (this.newSaleSuccess) {
            this.leftIcon = LeftIcon.Hamburger;
            this.setCartVisibility(false);
        }
    }

    @Watch('leftIcon')
    leftIconChanged() {
        this.$parent.$emit('set-left-icon', this.leftIcon);
    }

    private showCart(shouldShow: boolean) {
        this.setCartVisibility(shouldShow);
        this.setCartCount();
    }

    private setCartCount() {
        this.$parent.$emit('set-cart-count', this.selectedProducts.length);
    }

    private setCartVisibility(shouldShow: boolean) {
        this.$parent.$emit('set-show-cart', shouldShow);
    }

    private async convertEstimateToSale(saleKey: string) {
        this.$router.push({
            name: 'Convert-Estimate',
            params: {
                saleKey,
            },
        });
    }

    private goToSalesDashboard() {
        this.$router.push({ name: 'Sales' });
    }

    beforeRouteEnter(to: object, from: object, next: Function) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next(async (vm: any) => {
            productModule = getModule(ProductModule, vm.$store);
            salesModule = getModule(SalesModule, vm.$store);

            vm.fetchPreliminaryData({ salesModule, productModule });

            let preselectedCustomer = SessionStorageService.getItem('selected-customer');
            if (preselectedCustomer) {
                preselectedCustomer = JSON.parse(preselectedCustomer);

                vm.setCustomerForSale(preselectedCustomer);

                SessionStorageService.removeItem('selected-customer');
            }
            if (!vm.action) return;

            const saleKey = vm.$route.params.saleKey;
            if (!saleKey) return;

            await salesModule.getSaleDetails(saleKey);

            vm.prepareStatesForEditingPreviousSale();

            vm.goToSalesSummaryPage();
        });
    }

    private async fetchPreliminaryData({
        salesModule,
        productModule,
    }: {
        salesModule: SalesModule;
        productModule: ProductModule;
    }) {
        await Promise.all([
            productModule.getMeasurementTypes(),
            productModule.getAllProducts(),
            salesModule.getPaymentAccounts(),
        ]);
    }

    mounted() {
        generalModule = getModule(GeneralModule, this.$store);
        salesModule = getModule(SalesModule, this.$store);
        productModule = getModule(ProductModule, this.$store);

        if (this.userIsOnMobile) this.pageTitle = this.isEstimate ? 'Price Quotation' : 'New Sale';
        else this.pageTitle = 'Select Customer';
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale';
</style>
