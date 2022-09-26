<template>
    <div v-if="!dataLoading">
        <DocumentPreviewPage
            v-if="documentPreviewMode"
            :documentPreviewType="documentPreviewType"
            :documentDetails="documentDetails"
            :saleKey="transactionKey"
            @document-preview-back-button-clicked="handleDocumentPreviewBackButtonClick"
            @new-estimate-button-clicked="handleNewTransactionButtonClick"
        />

        <SuccessPage v-else-if="showSuccessPage">
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
                v-if="showReceiptDownloadButton"
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
        <div v-else>
            <b-row v-if="userIsOnMobile && !showCustomerList">
                <div class="w-100">
                    <FormattedDatePicker
                        :defaultDate="transactionDate"
                        @date-selected="updateTransactionDate"
                        :disabled="isEditingPreviousSale"
                    />

                    <div class="record-sale__mobile-customer-card">
                        <CustomerCard
                            :selectedCustomer="selectedCustomer"
                            :showCustomerDetails="!showPaymentForm"
                            :isEstimate="isEstimate"
                            @convert-estimate-to-sale="convertEstimateToSale"
                            @selected-customer-updated="handleCustomerUpdate"
                            @change-customer="displayCustomerList"
                        />
                    </div>
                </div>
            </b-row>

            <div class="record-sale">
                <transition-group
                    name="slide-up-fade"
                    mode="out-in"
                    :class="
                        isOnPayment ? 'record-sale__desktop--payment-section' : 'record-sale__desktop--item-section'
                    "
                >
                    <!-- Expense Item Details -->
                    <div v-if="showItemEntryForm" class="record-sale__item-details" key="item-details">
                        <ItemDetailsForm
                            :transactionDate="transactionDate"
                            :selectedCurrencyKey="selectedCurrencyKey"
                            :selectedCustomer="selectedCustomer"
                            :itemIsEditing="itemIsEditing"
                            :itemToBeEdited="itemToBeEdited"
                            :cartCount="selectedItems.length"
                            :isEstimate="isEstimate"
                            :redirectedFrom="redirectedFrom"
                            @update-transaction-date="updateTransactionDate"
                            @display-customer-list="displayCustomerList"
                            @add-item-to-list="handleItemListing"
                            @supply-status-change="handleSupplyStatusChange"
                        />
                    </div>

                    <!-- Item List -->
                    <div v-if="showItemList && !userIsOnMobile" class="record-sale__item-list" key="item-list">
                        <ItemList
                            :selectedCustomer="selectedCustomer"
                            :selectedItems="selectedItems"
                            :selectedCurrencyKey="selectedCurrencyKey"
                            :totalAmount="selectedItemsTotalAmount"
                            :isEstimate="isEstimate"
                            :editMode="isEditingPreviousSale"
                            @change-customer="displayCustomerList"
                            @convert-estimate-to-sale="convertEstimateToSale"
                            @edit-selected-item="startItemEdit"
                            @delete-item-from-list="displayDeleteModal"
                            @proceed-to-payment="proceedToPaymentPage"
                            @selected-customer-updated="handleCustomerUpdate"
                            @generate-no-payment-invoice="handleGenerateNoPaymentInvoice"
                        />
                    </div>

                    <!-- Summary Section -->
                    <div v-if="showSummaryComponent" class="record-sale__item-summary" key="item-summary">
                        <!-- Transaction Date -->
                        <FormattedDatePicker
                            v-if="!userIsOnMobile"
                            :defaultDate="transactionDate"
                            :disabled="isEditingPreviousSale"
                            @date-selected="updateTransactionDate"
                        />

                        <!-- Expense Item Summary -->
                        <ItemSummary
                            :selectedItems="selectedItems"
                            :selectedCustomer="selectedCustomer"
                            :totalAmount="selectedItemsTotalAmount"
                            :selectedCurrencyKey="selectedCurrencyKey"
                            :updateTaxOptions="updateItemsTaxOptions"
                            :isEstimate="isEstimate"
                            :editMode="isEditingPreviousSale"
                            :selectedItemsTaxOptions="selectedItemsTaxOptions"
                            @change-customer="displayCustomerList"
                            @update-tax-options="setSelectedItemsTaxOtions"
                            @back-to-item-list="returnToItemSelectionPage"
                            @edit-selected-item="startItemEdit"
                            @add-another-item="displayItemSection"
                            @delete-item-from-list="displayDeleteModal"
                        />
                    </div>

                    <!-- Customer List -->
                    <div
                        v-if="showCustomerList"
                        :class="isOnPayment ? 'record-sale__customersP' : 'record-sale__customers'"
                        key="vendors"
                    >
                        <CustomerList
                            :allowUnnamedCustomer="allowUnnamedCustomer"
                            :isEstimate="isEstimate"
                            @customer-selected="handleCustomerSelection"
                            @proceed-without-customer="handleCustomerSelection"
                        />
                    </div>

                    <!-- Payment Form -->
                    <div v-if="showPaymentForm" class="record-sale__payment-form" key="payment-form">
                        <PaymentForm
                            :transactionDate="transactionDate"
                            :selectedCurrencyKey="selectedCurrencyKey"
                            :totalAmount="selectedItemsTotalAmount"
                            :selectedCustomer="selectedCustomer"
                            :action="action"
                            :isEstimate="isEstimate"
                            :isEstimateConversion="isEstimateConversion"
                            @change-customer="displayCustomerList"
                            @process-sale-submission="processSaleSubmission"
                            @generate-estimate="generateEstimate"
                            @generate-invoice="generateInvoice"
                            @generate-no-payment-invoice="handleGenerateNoPaymentInvoice"
                        />
                    </div>
                </transition-group>
            </div>
        </div>

        <!-- Toaster -->
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />

        <!-- Delete Modal -->
        <DeleteModal
            v-if="showDeleteModal"
            :index="deletingItemIndex"
            @delete-action-confirmed="deleteItemFromList"
            @modal-hidden="hideDeleteModal"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';
import { RouteRecord } from 'node_modules/vue-router/types';

import CustomerCard from '@/pages/Sales/RecordSale/v4/CustomerCard.vue';
import CustomerList from '@/pages/Sales/RecordSale/v4/CustomerList.vue';
import ItemDetailsForm from '@/pages/Sales/RecordSale/v4/ItemDetailsForm.vue';
import ItemList from '@/pages/Sales/RecordSale/v4/ItemList.vue';
import ItemSummary from '@/pages/Sales/RecordSale/v4/ItemSummary.vue';
import PaymentForm from '@/pages/Sales/RecordSale/v4/PaymentForm.vue';
import MobileSale from '@/pages/Sales/RecordSale/v4/MobileSale.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    PaymentDetails,
    defaultPaymentDetails,
    defaultSelectedItems,
    SaleItemDetails,
} from '@/pages/Sales/RecordSale/v4/types';
import {
    Product,
    SaleRequest,
    defaultCustomer,
    initialStateOfProduct,
    SaleDetails,
    SaleCustomer,
    TaxForms,
    AddProductToSalesForm,
    ProductInProductDetailsForm,
    DocumentPreviewType,
    DocumentDetails,
    ProductSummary,
    SalesDocumentType,
    RecordEstimateRequest,
} from '@/pages/Sales/types';
import {
    CustomerRequest,
    MeasurementType,
    PaymentAccount,
    SaleRequestStatus,
    Status,
    VatOption,
    LeftIcon,
} from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SalesValidations from '@/pages/Sales/RecordSale/v4/validations';
import DocumentPreviewPage from '@/pages/Sales/DocumentPreviewPage.vue';

import ProductModule from '@/store/modules/product';
import SalesModule from '@/store/modules/sale';
import CustomerModule from '@/store/modules/customer';
import GeneralModule from '@/store/modules/general';

import SessionStorageService from '@/services/sessionStorage';
import DynamicComponentMixin from '@/mixins/dynamicComponents';

const products = namespace('product');
const sales = namespace('sale');

let productModule: ProductModule;
let salesModule: SalesModule;

const customers = namespace('customer');
let customerModule: CustomerModule;

const general = namespace('general');
let generalModule: GeneralModule;

@Component({
    components: {
        CustomerCard,
        CustomerList,
        ItemDetailsForm,
        ItemList,
        ItemSummary,
        PaymentForm,
        MobileSale,
        DocumentPreviewPage,
    },
})
export default class RecordSaleIndex extends Mixins(
    UtilityMixins,
    CurrencyMixins,
    DynamicComponentMixin,
    SalesValidations,
) {
    private transactionDate = '';

    private dataLoading = false;

    //arrangement => It is either the user is working with the item or with the payment
    private isOnPayment = false;

    //customers
    private selectedCustomer: SaleCustomer = { ...defaultCustomer };
    private showCustomerList = false;
    private selectedCurrencyKey = this.functionalCurrency;

    //items
    private selectedItems: SelectedItemDetails[] = [];
    private showItemDetailsForm = true;
    private showItemList = true;
    private itemIsEditing = false;
    private editingItemIndex = 0;
    private itemToBeEdited: SelectedItemDetails = { ...defaultSelectedItems };
    private showDeleteModal = false;
    private deletingItemIndex = 0;
    private allowUnnamedCustomer = true;
    private whtPercent = 0.1;
    private vatType = TaxForms.EXCLUSIVE;

    private updateItemsTaxOptions = false;
    private selectedItemsTaxOptions: ItemTaxOptions = { ...defaultTaxOptions };
    private isPreviousSection = false;

    private paymentDetails: PaymentDetails = { ...defaultPaymentDetails };
    private showSuccessPage = false;

    private showItemSummary = false;
    private showPaymentForm = false;

    private documentPreviewMode = false;
    private documentPreviewType = DocumentPreviewType.ESTIMATE;
    private documentDetails: DocumentDetails = {
        customer: {
            name: '',
            phoneNumber: '',
            email: '',
        },
        amountPaid: { currencyKey: 0, amount: 0 },
        dateIssued: '',
        notes: '',
        transactionDate: '',
        products: [],
    };

    private showInvoiceDownloadButton = false;
    private showReceiptDownloadButton = false;

    private leftIcon = LeftIcon.Hamburger;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'new-expense-toaster',
        position: 'b-toaster-top-right',
    };

    private redirectedFrom = '';

    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: '' }) action!: string;

    @products.State
    private measurementTypes!: Array<MeasurementType>;

    @products.State
    private products!: Array<Product>;

    @products.State
    private vatOptions!: Array<VatOption>;

    @sales.State
    public errorMessage!: string;

    @sales.State
    private salesError!: string;

    @sales.State
    public saleDetails!: SaleDetails;

    @sales.State
    private saleKey!: string;

    @sales.State
    public salesRequestStatus!: SaleRequestStatus;

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    @customers.State
    private customers!: Array<SaleCustomer>;

    @customers.State
    private customerRequest!: CustomerRequest;

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCartButtonClicked!: boolean;

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

    get transactionKey(): string {
        return this.action ? this.$route.params.saleKey : this.saleKey;
    }

    get isEstimateConversion(): boolean {
        return this.action === 'convert';
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

    get itemListIsEmpty() {
        return this.selectedItemCount < 1;
    }

    get pageTitle() {
        if (this.documentPreviewMode) {
            return this.documentPreviewType;
        }

        if (this.showCustomerList) return 'Select Customer';

        if (this.showPaymentForm) return 'Enter Sale Payment';

        if (this.selectedItems.length > 0) return 'Record Sale';
        else return 'Add Item to Sale';
    }

    get functionalCurrency(): number {
        const accessToken = SessionStorageService.decodeToken();
        const { currencyKey } = accessToken;
        return Number(currencyKey);
    }

    get selectedItemCount(): number {
        return this.selectedItems.length;
    }

    get subTotalAmount(): number {
        return this.selectedItems.reduce((previousAmount: number, itemDetails: SelectedItemDetails) => {
            const line = itemDetails.saleItemDetails;
            return previousAmount + this.lineAmount(line.unitPrice.amount, line.quantity, line.discount);
        }, 0);
    }

    get vatAmount(): number {
        const { vatType, subTotalAmount } = this;

        return this.getVATAmount(vatType, subTotalAmount);
    }

    get whtAmount(): number {
        return this.subTotalAmount * this.whtPercent;
    }

    get netAmount(): number {
        const { addVat, deductWht } = this.selectedItemsTaxOptions;

        const whtAmount = deductWht ? this.whtAmount : 0;

        const isExclusiveVat = this.vatType == TaxForms.EXCLUSIVE;
        const vatAdded = addVat && isExclusiveVat ? this.vatAmount : 0;

        return this.subTotalAmount + vatAdded - whtAmount;
    }

    get showItemEntryForm() {
        if (this.userIsOnMobile) {
            return this.showItemDetailsForm && !this.showCustomerList;
        }

        return this.showItemDetailsForm;
    }

    get showSummaryComponent() {
        if (this.userIsOnMobile) {
            return this.showItemSummary && !this.showCustomerList;
        }

        return this.showItemSummary;
    }

    get selectedItemsTotalAmount(): SelectedItemsTotalAmount {
        return {
            subTotal: this.subTotalAmount,
            totalExclVAT: this.getTotalExclusiveOfVAT(this.vatType, this.vatAmount, this.subTotalAmount),
            vatAmount: this.vatAmount,
            whtAmount: this.whtAmount,
            netAmount: this.netAmount,
        };
    }

    get hasIncompleteSupply(): boolean {
        const incompleteSupplyItem = this.selectedItems.find(
            (p: SelectedItemDetails) => p.saleItemDetails.quantity != p.saleItemDetails.quantitySupplied,
        );

        if (incompleteSupplyItem) return true;
        return false;
    }

    private hideAllComponents() {
        this.showItemSummary = false;
        this.showPaymentForm = false;
        this.showCustomerList = false;
        this.showItemDetailsForm = false;
        this.showItemList = false;
    }

    private displayCustomerList() {
        // this.updateItemsTaxOptions = false;

        if (this.userIsOnMobile) this.hideAllComponents();

        if (this.isOnPayment) {
            this.showPaymentForm = false;
            setTimeout(() => {
                this.showCustomerList = true;
            }, 400);
            return;
        }

        this.showItemList = false;
        setTimeout(() => {
            this.showItemDetailsForm = true;
            this.showCustomerList = true;
        }, 400);
    }

    private hideCustomerList() {
        if (this.isOnPayment) {
            this.proceedToPaymentPage();
            this.showCustomerList = false;
            setTimeout(() => {
                this.showPaymentForm = true;
            }, 400);
            return;
        }

        this.showCustomerList = false;
        setTimeout(() => {
            this.showItemDetailsForm = true;
            this.showItemList = true;
        }, 400);
    }

    private displayItemSection() {
        this.showCustomerList = false;
        this.showItemSummary = false;
        this.showPaymentForm = false;
        setTimeout(() => {
            this.isOnPayment = false;
            this.showItemDetailsForm = true;
            this.showItemList = true;
        }, 400);
    }

    private handleSupplyStatusChange(isCompleteSupply: boolean) {
        if (!this.hasIncompleteSupply) {
            this.allowUnnamedCustomer = isCompleteSupply;
        }
    }

    private handleCustomerSelection(selectedCustomer: SaleCustomer) {
        this.selectedCustomer = selectedCustomer || defaultCustomer;
        this.hideCustomerList();
    }

    private handleCustomerUpdate(updatedCustomer: SaleCustomer) {
        const thisCustomer: SaleCustomer = {
            ...defaultCustomer,
            ...updatedCustomer,
        };

        this.selectedCustomer = thisCustomer;
    }

    private handleItemListing(selectedProduct: Product, saleItemDetails: SaleItemDetails) {
        const item = { selectedProduct, saleItemDetails };

        const setCurrencyKey = this.itemIsEditing ? this.selectedItemCount < 2 : this.selectedItemCount < 1;

        if (setCurrencyKey) this.selectedCurrencyKey = Number(saleItemDetails.unitPrice.currencyKey);

        if (!this.itemIsEditing) {
            this.addNewItemToList(item);
            return;
        }
        this.updateItemOnList(this.editingItemIndex, item);
        this.stopItemEdit();
    }

    private addNewItemToList(newItem: SelectedItemDetails) {
        this.selectedItems.push(newItem);

        if (this.selectedItemCount == 1 || this.userIsOnMobile) {
            this.proceedToPaymentPage();
        }
    }

    private updateItemOnList(itemIndex: number, item: SelectedItemDetails) {
        this.selectedItems.splice(itemIndex, 1, item);

        if (this.selectedItemCount == 1 || this.userIsOnMobile) {
            this.proceedToPaymentPage();
        }
    }

    private startItemEdit(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        this.itemToBeEdited = itemToBeEdited;
        this.editingItemIndex = itemIndex;
        this.itemIsEditing = true;
        if (this.isOnPayment) {
            this.showCustomerList = false;
            this.displayItemSection();
        }
    }

    private stopItemEdit() {
        this.itemIsEditing = false;
        this.editingItemIndex = 0;
        this.itemToBeEdited = { ...defaultSelectedItems };
    }

    private displayDeleteModal(itemIndex: number) {
        this.showDeleteModal = true;
        this.deletingItemIndex = itemIndex;
    }

    private hideDeleteModal() {
        this.showDeleteModal = false;
    }

    private deleteItemFromList(itemIndex: number) {
        this.selectedItems.splice(itemIndex, 1);
        this.hideDeleteModal();
    }

    private proceedToPaymentPage() {
        this.hideAllComponents();
        this.isPreviousSection = false;
        this.updateItemsTaxOptions = true;

        // display payment section...
        setTimeout(() => {
            this.isOnPayment = true;
            this.showItemSummary = true;
            this.showPaymentForm = true;
        }, 400);
    }

    private returnToItemSelectionPage() {
        this.hideAllComponents();

        // conditions to set previous state...
        this.isPreviousSection = true;
        this.updateItemsTaxOptions = true;

        // display item section...
        setTimeout(() => {
            this.isOnPayment = false;
            this.showItemDetailsForm = true;
            this.showItemList = true;
        }, 400);
    }

    private setSelectedItemsTaxOtions(selectedItemsTaxOptions: ItemTaxOptions) {
        this.selectedItemsTaxOptions = selectedItemsTaxOptions;
    }

    private async convertEstimateToSale(saleKey: string) {
        this.$router.push({
            name: 'Convert-Estimate',
            params: {
                saleKey,
            },
        });
    }

    private async processSaleSubmission(paymentDetails: PaymentDetails, isEstimate = false) {
        if (!isEstimate) this.setPaymentDetails(paymentDetails);

        const vatTypeKey = this.selectedItemsTaxOptions.addVat ? this.vatTypeKey : this.vatTypeKeyForNone;
        const whtType = this.selectedItemsTaxOptions.deductWht ? 'Inclusive' : TaxForms.NONE;

        const products = this.selectedItems.map(selectedItem => {
            return this.generateSaleRequestItem(selectedItem, vatTypeKey, isEstimate);
        });

        const productSummaries = this.selectedItems.map(selectedItem => {
            return this.generateSaleItemSummary(selectedItem);
        });

        const { name, email, phoneNumber, customerKey } = this.selectedCustomer;

        const currencyKey = this.selectedCurrencyKey;
        const documentDetails = {
            customer: {
                name,
                email,
                phoneNumber,
            },
            amountPaid: { ...paymentDetails.amountPaid, currencyKey },
            transactionDate: paymentDetails.transactionDate,
            balanceDueDate: paymentDetails.balanceDueDate,
            paymentAccountKey: paymentDetails.paymentAccountKey,
            dateIssued: paymentDetails.transactionDate,
            notes: '',
            products: productSummaries,
        };

        this.documentDetails = documentDetails;

        const saleRequest = {
            amountPaid: { ...paymentDetails.amountPaid, currencyKey },
            transactionDate: this.transactionDate,
            balanceDueDate: paymentDetails.balanceDueDate,
            paymentAccountKey: paymentDetails.paymentAccountKey,
            customerKey: customerKey || '',
            products: products,
            withHoldingTaxType: whtType,
            saleKey: this.$route.params.saleKey,
        };

        if (isEstimate) {
            await this.submitEstimateForm(saleRequest, products);
        } else {
            if (this.action == 'edit') await this.updateSale(saleRequest);
            else await this.recordSale(saleRequest);
        }
    }

    private async recordSale(saleRequest: SaleRequest) {
        await salesModule.recordSale(saleRequest);

        this.setDocumentDownloadButtons(saleRequest);

        if (this.salesRequestStatus.createSale === Status.SUCCESS) {
            this.showSuccessPage = true;
            return;
        }
        this.showErrorNotification(this.salesError);
    }

    private async updateSale(saleRequest: SaleRequest) {
        await salesModule.updateSale(saleRequest);

        this.setDocumentDownloadButtons(saleRequest);

        if (this.salesRequestStatus.updateSale === Status.SUCCESS) {
            this.showSuccessPage = true;
            return;
        }
        this.showErrorNotification(this.salesError);
    }

    private async submitEstimateForm(saleRequest: SaleRequest, products: AddProductToSalesForm[]) {
        const customerKey = this.selectedCustomer.customerKey || '';

        if (!customerKey) return;

        const estimateRequest: RecordEstimateRequest = {
            dateIssued: this.transactionDate,
            notes: '',
            customerKey,
            products,
            saleKey: saleRequest.saleKey,
        };

        const isEdit = this.action == 'edit';

        if (isEdit) {
            await salesModule.updateEstimate(estimateRequest);
        } else {
            await salesModule.recordEstimate(estimateRequest);
        }

        if (
            (!isEdit && this.salesRequestStatus.recordEstimate === Status.ERROR) ||
            (isEdit && this.salesRequestStatus.updateEstimate === Status.ERROR)
        ) {
            this.showErrorNotification();
            return;
        }

        const saleKey = isEdit ? estimateRequest.saleKey : this.saleKey;

        await salesModule.generatePdf({ saleKey: saleKey || '', documentType: DocumentPreviewType.ESTIMATE });

        if (this.salesRequestStatus.generatePdf === Status.ERROR) {
            this.showErrorNotification();
            return;
        }

        this.$nextTick(() => {
            this.showReceiptDownloadButton = false;
            this.documentPreviewMode = true;
            this.documentPreviewType = DocumentPreviewType.ESTIMATE;
            if (!this.userIsOnMobile) return;

            this.resetMobileNavbarElements();
        });
    }

    private setDocumentDownloadButtons(saleRequest: SaleRequest) {
        const { amount } = saleRequest.amountPaid;

        if (amount > 0) this.showReceiptDownloadButton = true;

        if (this.selectedCustomer.customerKey) this.showInvoiceDownloadButton = true;

        // if (saleRequest.amountPaid.amount < this.netAmount || !this.selectedCustomer.customerKey) {
        //     this.showReceiptDownloadButton = true;
        // } else {
        //     this.showInvoiceDownloadButton = true;
        // }
    }

    get vatTypeKey(): string {
        const vatObject = this.vatOptions.find((o: VatOption) => o.name === this.vatType);

        if (vatObject) return vatObject.saleProductVatKey;

        return '';
    }

    get vatTypeKeyForNone(): string {
        const vatObject = this.vatOptions.find((o: VatOption) => o.name == TaxForms.NONE);

        if (vatObject) return vatObject.saleProductVatKey;

        return '';
    }

    private generateSaleItemSummary(selectedItem: SelectedItemDetails): ProductSummary {
        const { selectedProduct, saleItemDetails } = selectedItem;
        const { unitPrice, quantity, quantitySupplied, discount } = saleItemDetails;
        const currencyKey = this.selectedCurrencyKey;

        const vatChosen = this.selectedItemsTaxOptions.addVat ? this.vatType : TaxForms.NONE;

        const subTotalAmount = this.lineAmount(unitPrice.amount, quantity, discount);
        const vatType = selectedProduct.isVATExempt ? TaxForms.NONE : vatChosen;
        const vatAmount = this.getVATAmount(vatType, subTotalAmount);
        const item = {
            productName: selectedProduct.name,
            productKey: selectedProduct.productKey,
            unitPrice: { ...unitPrice, currencyKey },
            quantity: quantity,
            measurementTypeKey: saleItemDetails.measurementTypeKey,
            measurementUnit: saleItemDetails.measurementType,
            notes: saleItemDetails.notes,
            files: [],
            supplyStatus: this.getSupplyStatus(quantity, quantitySupplied),
            discount: { amount: discount, currencyKey },
            vatType: vatType,
            vatAmount: { amount: vatAmount, currencyKey },
            totalExclusiveVat: {
                amount: this.getTotalExclusiveOfVAT(vatType, vatAmount, subTotalAmount),
                currencyKey,
            },
            subTotal: { amount: subTotalAmount, currencyKey },
        };

        return item;
    }

    private generateSaleRequestItem(
        selectedItem: SelectedItemDetails,
        vatTypeKey: string,
        isEstimate = false,
    ): AddProductToSalesForm {
        const { selectedProduct, saleItemDetails } = selectedItem;
        const currencyKey = this.selectedCurrencyKey;

        const supplyBalance = saleItemDetails.quantity - saleItemDetails.quantitySupplied;

        const item = {
            productKey: selectedProduct.productKey,
            name: selectedProduct.name,
            unitPrice: { ...saleItemDetails.unitPrice, currencyKey },
            measurementTypeKey: saleItemDetails.measurementTypeKey,
            quantity: saleItemDetails.quantity,
            discount: { amount: saleItemDetails.discount, currencyKey },
            vatTypeKey: selectedProduct.isVATExempt ? this.vatTypeKeyForNone : vatTypeKey,
            quantitySupplied: isEstimate ? 0 : saleItemDetails.quantitySupplied,
            supplyDueDate: isEstimate || supplyBalance > 0 ? saleItemDetails.supplyDueDate : '',
            attachmentArray: [],
            notes: saleItemDetails.notes,
        };

        return item;
    }

    private setPaymentDetails(paymentDetails: PaymentDetails) {
        this.paymentDetails = paymentDetails;
    }

    private updateTransactionDate(transactionDate: string) {
        this.transactionDate = transactionDate;
    }

    private showErrorNotification(message = 'An Error Occured') {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message,
        });
    }

    private async generateEstimate() {
        await this.processSaleSubmission(defaultPaymentDetails, true);
    }

    private async updateAndGenerateEstimate(
        selectedCustomer: SaleCustomer,
        selectedItems: SelectedItemDetails[],
        taxOptions: ItemTaxOptions,
    ) {
        this.selectedCustomer = selectedCustomer;
        this.selectedItems = selectedItems;
        this.selectedItemsTaxOptions = taxOptions;
        await this.generateEstimate();
    }

    private async generateInvoice(paymentDetails: PaymentDetails = defaultPaymentDetails) {
        await this.processSaleSubmission(paymentDetails);
        this.showSuccessPage = false;

        if (this.salesRequestStatus.createSale === Status.SUCCESS)
            await this.generateAndPreviewDocument(DocumentPreviewType.INVOICE);
    }

    private async handleGenerateNoPaymentInvoice() {
        const paymentDetails: PaymentDetails = {
            paymentAccountKey: this.paymentAccounts[0].paymentAccountKey, // to bypass backend validation
            amountPaid: { amount: 0, currencyKey: this.selectedCurrencyKey },
            transactionDate: this.transactionDate,
            balanceDueDate: this.transactionDate,
            hasPartialPayment: false,
        };
        await this.generateInvoice(paymentDetails);
    }

    private async updateAndGenerateInvoice(
        selectedCustomer: SaleCustomer,
        selectedItems: SelectedItemDetails[],
        taxOptions: ItemTaxOptions,
        paymentDetails: PaymentDetails,
    ) {
        this.selectedCustomer = selectedCustomer;
        this.selectedItems = selectedItems;
        this.selectedItemsTaxOptions = taxOptions;

        await this.generateInvoice(paymentDetails);
    }

    private async updateAndProcessSaleDetails(
        selectedCustomer: SaleCustomer,
        selectedItems: SelectedItemDetails[],
        taxOptions: ItemTaxOptions,
        paymentDetails: PaymentDetails,
    ) {
        this.selectedCustomer = selectedCustomer;
        this.selectedItems = selectedItems;
        this.selectedItemsTaxOptions = taxOptions;
        await this.processSaleSubmission(paymentDetails);
    }

    private restartRecordSale() {
        this.selectedCustomer = { ...defaultCustomer };
        this.selectedItems = [];
        this.selectedItemsTaxOptions = { ...defaultTaxOptions };
        this.paymentDetails = { ...defaultPaymentDetails };
        this.showSuccessPage = false;
    }

    public async handleNewTransactionButtonClick() {
        if (this.isEditingPreviousSale) {
            this.$router.push({ name: 'RecordSale' });
            return;
        }

        this.restartRecordSale();
    }

    public handleDocumentPreviewBackButtonClick() {
        this.documentPreviewMode = false;
    }

    private showDocumentPreviewPage(newDocumentPreviewType: DocumentPreviewType) {
        this.$nextTick(() => {
            // pending when we build out the success page
            this.documentPreviewMode = true;
            this.documentPreviewType = newDocumentPreviewType;
        });
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
            if (!this.userIsOnMobile) return;

            this.resetMobileNavbarElements();
            return;
        }
    }

    private setLeftIcon(leftIcon: string) {
        this.$parent.$emit('set-left-icon', leftIcon);
    }

    private setCartVisibility(showCart: boolean) {
        this.$parent.$emit('set-show-cart', showCart);
    }

    private setCartCount() {
        this.$parent.$emit('set-cart-count', this.selectedItemCount);
    }

    private resetBackButtonState() {
        generalModule.setMobileBackButtonState(false);
    }

    private resetCartButtonState() {
        generalModule.setMobileCartButtonState(false);
    }

    private resetMobileNavbarElements() {
        this.setLeftIcon(LeftIcon.Hamburger);
        this.setCartCount();
        this.setCartVisibility(false);
    }

    private assignModule() {
        salesModule = getModule(SalesModule, this.$store);
        customerModule = getModule(CustomerModule, this.$store);
        generalModule = getModule(GeneralModule, this.$store);
    }

    private navigateBackwards() {
        if (this.showCustomerList) {
            if (this.isOnPayment) this.proceedToPaymentPage();
            else this.displayItemSection();
        }
    }

    @Watch('selectedItemCount')
    checkItemCount(itemCount: number) {
        if (itemCount === 0 && this.isOnPayment) {
            this.displayItemSection();
        }
    }

    @Watch('selectedItems', { deep: true })
    checkDeliveryStatus() {
        if (this.hasIncompleteSupply) {
            this.allowUnnamedCustomer = false;
            return;
        }
        this.allowUnnamedCustomer = true;
    }

    @Watch('selectedItemsTaxOptions', { deep: true })
    checkTaxOptions() {
        const { deductWht } = this.selectedItemsTaxOptions;
        if (this.hasIncompleteSupply) return;

        if (deductWht) this.allowUnnamedCustomer = false;
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.navigateBackwards();
        }
        this.resetBackButtonState();
    }

    @Watch('mobileCartButtonClicked')
    watchMobileCartButtonState(buttonClicked: boolean) {
        if (buttonClicked && !this.itemListIsEmpty) {
            this.proceedToPaymentPage();
        }
        this.resetCartButtonState();
    }

    @Watch('leftIcon', { immediate: true })
    leftIconChanged() {
        this.$parent.$emit('set-left-icon', this.leftIcon);
    }

    @Watch('selectedItemCount')
    checkItemList(selectedItems: number) {
        if (selectedItems < 1) {
            this.displayItemSection();
        }
        this.setCartCount();
    }

    @Watch('showCustomerList')
    showCustomerListChanged() {
        if (this.showCustomerList) this.leftIcon = LeftIcon.Back;
        else this.leftIcon = LeftIcon.Hamburger;
    }

    @Watch('pageTitle')
    updatePageTitle() {
        this.$emit('update-page-title', this.pageTitle);
    }

    private checkForPreloads() {
        let customer = SessionStorageService.getItem('selected-customer');

        if (customer) {
            customer = JSON.parse(customer);

            this.selectedCustomer = Object.assign({}, this.selectedCustomer, customer);

            SessionStorageService.removeItem('selected-customer');
        }
    }

    private setupDataForEdit(action: string) {
        const item = this.saleDetails;

        const customerKey = item.customer?.customerKey || '';

        if (customerKey) {
            const customer = this.customers.find((customer: SaleCustomer) => customer.customerKey === customerKey);

            if (customer) {
                this.selectedCustomer = customer;
                if (this.userIsOnMobile) {
                    this.clearSavedEstimateItems();
                    this.saveSelectedCustomerForMobile();
                }
            } else {
                const thisCustomer: SaleCustomer = {
                    ...defaultCustomer,
                    ...item.customer,
                };
                this.selectedCustomer = thisCustomer;
            }
        }

        const isPartialPayment = item.balanceDueDate ? true : false;

        const transactionDate =
            action == 'edit' ? this.formatDateToFitCalendarFormat(item.transactionDate) : this.transactionDate;

        this.selectedItems = item.products.map(product => {
            return this.getSaleItemForEdit(product, transactionDate, item.transactionDate, action);
        });

        if (this.userIsOnMobile) {
            this.saveSelectedItemsForMobile();
        }

        const productWithVAT = item.products.find(
            (p: ProductInProductDetailsForm) => p.vatTypeKey !== this.vatTypeKeyForNone,
        );

        let addVat = false;
        if (productWithVAT) addVat = true;

        this.selectedItemsTaxOptions = {
            isInclusiveVAT: this.vatType == TaxForms.INCLUSIVE,
            addVat: addVat,
            deductWht: this.shouldDeductWht(item.withholdingTax?.name),
            whtIsTenPercent: true,
        };

        if (this.userIsOnMobile) {
            this.saveTaxOptionsForMobile();
        }

        const balanceDueDate =
            action == 'edit'
                ? this.formatDateToFitCalendarFormat(item.balanceDueDate)
                : this.moveDate(item.transactionDate, item.balanceDueDate, transactionDate);

        const paymentDetails = {
            paymentAccountKey: item.paymentAccountKey,
            amountPaid: { ...item.amountPaid, amount: Number(item.amountPaid.amount) },
            transactionDate,
            balanceDueDate: balanceDueDate,
            hasPartialPayment: isPartialPayment,
        };

        this.transactionDate = transactionDate;

        this.paymentDetails = paymentDetails;
        salesModule.setPaymentFormState(paymentDetails);
    }

    private shouldDeductWht(whtName: string | undefined): boolean {
        if (!whtName) return false;

        return whtName != TaxForms.NONE;
    }

    private getSaleItemForEdit(
        savedItem: ProductInProductDetailsForm,
        transactionDate: string,
        itemTransactionDate: string,
        action: string,
    ): SelectedItemDetails {
        const thisProduct = this.products.find((p: Product) => p.productKey == savedItem.productKey);

        let selectedProduct: Product = {
            ...initialStateOfProduct,
            name: savedItem.productName,
            productKey: savedItem.productKey,
        };

        if (thisProduct) selectedProduct = thisProduct;

        const { unitPrice, quantity, quantitySupplied, discount } = savedItem;

        const supplyDueDate =
            action == 'edit'
                ? this.formatDateToFitCalendarFormat(savedItem.supplyDueDate)
                : this.moveDate(itemTransactionDate, savedItem.supplyDueDate, transactionDate);

        const saleItemDetails: SaleItemDetails = {
            ...savedItem,
            supplyDueDate,
            unitPrice: { ...unitPrice, amount: Number(unitPrice.amount) },
            discount: Number(discount.amount),
            quantitySupplied: action === 'convert' ? quantity : quantitySupplied,
            transactionDate,
            name: selectedProduct?.name || '',
            measurementType: savedItem.measurementTypeName,
        };

        return { selectedProduct, saleItemDetails };
    }

    private doEstimateCheck() {
        if (this.isEstimate && !this.action) {
            this.displayCustomerList();
        }
    }

    private saveSelectedCustomerForMobile() {
        SessionStorageService.setItem('selected-customer-for-estimate', JSON.stringify(this.selectedCustomer));
    }

    private saveSelectedItemsForMobile() {
        SessionStorageService.setItem('selected-items-for-estimate', JSON.stringify(this.selectedItems));
    }

    private saveTaxOptionsForMobile() {
        SessionStorageService.setItem('selected-tax-for-estimate', JSON.stringify(this.selectedItemsTaxOptions));
    }

    beforeRouteEnter(_to: object, from: RouteRecord, next: Function) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next(async (vm: any) => {
            salesModule = getModule(SalesModule, vm.$store);
            customerModule = getModule(CustomerModule, vm.$store);
            productModule = getModule(ProductModule, vm.$store);

            vm.checkForPreloads();

            vm.fetchPreliminaryData({ salesModule, productModule, customerModule });

            if (!vm.action) return;

            // this block should only run for sales transaction edit

            const saleKey = vm.$route.params.saleKey;
            if (!saleKey) return;

            vm.dataLoading = true;

            await salesModule.getSaleDetails(saleKey);

            vm.dataLoading = false;

            vm.setupDataForEdit(vm.action);

            vm.proceedToPaymentPage();
        });
    }

    private async fetchPreliminaryData({
        salesModule,
        productModule,
        customerModule,
    }: {
        salesModule: SalesModule;
        productModule: ProductModule;
        customerModule: CustomerModule;
    }) {
        await Promise.all([
            productModule.getMeasurementTypes(),
            productModule.getAllProducts(),
            productModule.getVatOption(),
            customerModule.getCustomers(),
            salesModule.getPaymentAccounts(),
        ]);
    }

    mounted() {
        this.assignModule();
        this.updateTransactionDate(this.todayAsDefaultDate());

        this.doEstimateCheck();

        this.updatePageTitle();
        this.setCartVisibility(false);
        this.setCartCount();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/index';
</style>
