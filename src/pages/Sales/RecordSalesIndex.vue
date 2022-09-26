<template>
    <b-container class="record-sales" ref="topOfPage">
        <b-row>
            <b-col>
                <div class="record-sales__header-wrapper">
                    <h3 class="record-sales__header d-flex header__text--black-light">
                        {{ (isEditing && 'Edit Sale') || 'Record Sale' }}
                    </h3>
                </div>
            </b-col>
        </b-row>

        <b-row class="record-sales__bottom-section">
            <b-col cols="12" class="col-sm-4">
                <transition name="slide-right-fade" appear>
                    <div v-if="shouldAddPaymentFormShowInRecordSalesComponent">
                        <AddPaymentForm
                            @cancel-payment-clicked="hideAddPaymentFormInEditSalesSection"
                            :saleDetails="saleDetails"
                            :salesRequestStatus="salesRequestStatus"
                            :paymentTypes="paymentTypes"
                            @add-sales-payment="addSalesPaymentInEditSaleSection"
                        />
                    </div>
                    <transition name="fade">
                        <div v-if="shouldRecordSalesEditFormShow">
                            <RecordSalesEditForm
                                @delete-item-being-edited="setAnItemToBeEdited(false)"
                                @item-has-finished-being-edited="addEditedItemToRecordSalesTable"
                                :products="productsWithAdditionalReactiveProperties"
                                @errors="handleSalesItemEditFormErrors"
                                @sales-item-has-been-selected-initally="setASalesItemHasBeenSelectedInitially"
                                :itemToBeEdited="itemToBeEdited"
                                @nairaDiscount="setNairaDiscount"
                                @measurement-type-key-changed="setMeasurementTypeKey"
                                @open-create-new-product-modal="openCreateNewProductModal"
                                @open-create-new-customer-modal="openCreateNewCustomerModal"
                                :indexOfItemToBeEdited="indexOfItemToBeEdited"
                                :measurementTypes="measurementTypes"
                                :anItemIsToBeEdited="anItemIsToBeEdited"
                                @add-item-to-sales-table="addItemToSalesTable"
                                :customers="customers"
                                :aSaleItemHasBeenSelectedInitially="aSaleItemHasBeenSelectedInitially"
                                :itemToBeDeleted="itemToBeDeleted"
                                :paymentTypes="paymentTypes"
                                :isEditing="isEditing"
                                :vatOfItemToBeEdited="vatOfItemToBeEdited"
                                :itemToBeEditedVatIsRequired="itemToBeEditedVatIsRequired"
                                @resetVatOfItemToBeEdited="resetVatOfItemToBeEdited"
                            />
                        </div>
                    </transition>
                </transition>
            </b-col>
            <b-col cols="12" class="col-sm-12 col-md-8">
                <RecordSalesTable
                    @edit-sales-item="editSalesItem"
                    @delete-sales-item="deleteSelectedSaleItem"
                    :itemToBeEdited="itemToBeEdited"
                    :errorsFromRecordSalesItemEditForm="errorsFromSalesItemEditForm"
                    :selectedProducts="selectedProducts"
                    :anItemIsToBeEdited="anItemIsToBeEdited"
                    :isEditing="isEditing"
                    :paymentIsBeingUpdated="paymentIsBeingUpdated"
                    @edit-sale-success="addSuccessMessageOnEdit"
                />
                <div
                    class="record-sales__add-payment__payment-details-section"
                    tabindex="0"
                    @click="togglePaymentDetails"
                    v-if="isEditing"
                >
                    <div class="record-sales__add-payment__payment-details-text">
                        Payment Details
                    </div>
                    <font-awesome-icon
                        :icon="icon"
                        aria-hidden="true"
                        class="record-sales__add-payment__payment-details-arrow"
                    />
                </div>
                <transition name="fade">
                    <div
                        class="record-sales__add-payment__payment-details"
                        v-if="isEditing && arePaymentDetailsShowing"
                    >
                        <DashboardTableHeader
                            v-if="saleDetails.payments.length > 0"
                            :headers="paymentDetailsHeaders"
                            className="record-sales__add-payment__payment-details-section__table-heading"
                            headerContainerClass="record-sales__add-payment__payment-details-section__table-heading-container"
                        />
                        <div
                            v-if="salesRequestStatus.getSaleDetails === 'LOADING'"
                            class="record-sales__add-payment__loader-container"
                        >
                            <Loader size="5" />
                        </div>
                        <div v-if="salesRequestStatus.getSaleDetails !== 'LOADING'">
                            <PaymentDetailsItem
                                v-for="(paymentDetailsItem, index) in saleDetails.payments"
                                :key="index"
                                :salesRequestStatus="salesRequestStatus"
                                :paymentDetailsItem="paymentDetailsItem"
                            />
                        </div>
                        <div
                            class="record-sales__add-payment__no-payment-text"
                            v-if="conditionsForNoPaymentsTextToShow"
                        >
                            There are no payments
                        </div>
                        <div class="record-sales__add-payment__amount-due-balance-section">
                            <div class="record-sales__add-payment__amount-due-section">
                                <span class="record-sales__add-payment__amount-due-text mr-2">Amount Due:</span>
                                <span class="record-sales__add-payment__amount-due"
                                    >₦{{ saleDetails.totalAmount | formatAmount }}</span
                                >
                            </div>
                            <div class="record-sales__add-payment__amount-received-section">
                                <span class="record-sales__add-payment__amount-received-text mr-2"
                                    >Amount Received:</span
                                >
                                <span class="record-sales__add-payment__amount-received"
                                    >₦{{ saleDetails.amountPaid | formatAmount }}</span
                                >
                            </div>
                            <div class="record-sales__add-payment__balance-section">
                                <span class="record-sales__add-payment__balance-text mr-2">Balance:</span>
                                <span class="record-sales__add-payment__balance">{{
                                    saleDetails.balance | formatAmount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </transition>
                <BaseButton
                    v-if="shouldAddPaymentButtonShow"
                    className="record-sales__add-payment__btn"
                    buttonText="Add payment"
                    :overRideButtonClass="true"
                    @button-clicked="handleAddPaymentToRecordSalesClick"
                />
            </b-col>
        </b-row>
        <AddProductFormModal />
        <AddCustomerFormModal />
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-container>
</template>

<script lang="ts">
// /*eslint-disable @typescript-eslint/no-explicit-any */
// import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { getModule } from 'vuex-module-decorators';

// import SalesServiceMixin from '@/mixins/SalesService.ts';
// import UtilityMixins from '@/mixins/Utility.ts';
// import SalesMixin from '@/pages/Sales/SalesMixin';

// import {
//     InvoiceCreationResponse,
//     ProductResponse,
//     SalesItemObject,
//     ErrorObject,
//     ErrorIndexSignature,
//     User,
//     SalesProduct,
//     MeasurementType,
//     CustomerResponse,
//     SaleRequestStatus,
//     SaleDetails,
//     Status,
//     AddSalesPaymentPayload,
// } from '@/types';

// import ProductModule from '@/store/modules/product.ts';
// import GeneralModule from '@/store/modules/general.ts';
// import CustomerModule from '@/store/modules/customer.ts';
// import SaleModule from '@/store/modules/sale.ts';

// import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';
// import InvoiceHeader from '@/pages/Invoice/InvoiceHeader.vue';
// import RecordSalesEditForm from '@/pages/Sales/RecordSalesEditForm.vue';
// import RecordSalesTable from '@/pages/Sales/RecordSalesTable.vue';
// import AddProductFormModal from '@/pages/Invoice/AddProductFormModal.vue';
// import AddCustomerFormModal from '@/pages/Invoice/AddCustomerFormModal.vue';
// import DashboardTableHeader from '@/components/ui/DashboardTableHeader.vue';
// import PaymentDetailsItem from '@/pages/Sales/Payment/PaymentDetailsItem.vue';
// import AddPaymentForm from '@/pages/Sales/Payment/AddPaymentForm.vue';

// const invoice = namespace('invoice');
// const product = namespace('product');
// const general = namespace('general');
// const customer = namespace('customer');
// const sales = namespace('sale');

// let productModule: ProductModule;
// let generalModule: GeneralModule;
// let customerModule: CustomerModule;
// let saleModule: SaleModule;

// import sessionStorage from '@/services/sessionStorage';

// @Component({
//     components: {
//         RecordSalesEditForm,
//         RecordSalesTable,
//         AddProductFormModal,
//         AddCustomerFormModal,
//         CircularPlusSign,
//         InvoiceHeader,
//         DashboardTableHeader,
//         PaymentDetailsItem,
//         AddPaymentForm,
//     },
// })
// export default class RecordSalesIndex extends Mixins(SalesServiceMixin, UtilityMixins, SalesMixin) {
//     private paymentType = '';
//     private discount = 0;
//     private indexOfItemToBeEdited = 0;
//     private anItemIsToBeEdited = false;
//     private invoiceDate = '';
//     private addPaymentFormShouldShow = false;
//     private saleKey = '';
//     private saleItemsFromDatabase: Array<SalesProduct> = [];
//     private authenticatedUser: User = {
//         firstName: '',
//         email: '',
//         lastName: '',
//         phoneNumber: '',
//         businessName: '',
//         currencyKey: '',
//     };
//     private initialStateOfItem: SalesProduct = {
//         productName: '',
//         productKey: '',
//         description: '',
//         unitPrice: 0,
//         price: 0,
//         quantity: 0,
//         discount: 0,
//         productVatKey: '',
//         vat: 0,
//         note: '',
//         measurementTypeKey: '',
//         saleDate: '',
//         paymentTypeName: '',
//         paymentTypeKey: '',
//         isOutstandingOrder: null,
//         //productAmount now represents the inital totalAmount
//         productAmount: 0,
//         amountPaid: 0,
//         customerKey: '',
//     };

//     private itemToBeDeleted = { ...this.initialStateOfItem };
//     private aSaleItemHasBeenSelectedInitially = false;
//     private paymentIsBeingUpdated = false;
//     private measurementKeyForUnit = '';

//     private errorsFromSalesItemEditForm: ErrorIndexSignature = {};
//     private itemToBeEdited = { ...this.initialStateOfItem };
//     private editIndexOfItemToBeEdited = 0;
//     private itemToBeEditedVatIsRequired = false;
//     private vatOfItemToBeEdited = 0;

//     private errors: ErrorObject = {
//         price: '',
//         quantity: '',
//         discount: '',
//         amountPaid: '',
//         measurementType: '',
//         customer: '',
//         saleDate: '',
//         orderQuestion: '',
//     };

//     public toaster = {
//         title: '',
//         message: '',
//         type: '',
//         position: 'b-toaster-top-center',
//         id: 'record-sales-toaster',
//     };

//     private selectedProducts: Array<SalesProduct> = [];

//     private displayedModal = 'customer';

//     @product.State
//     public status!: string;

//     @product.State
//     public products!: ProductResponse;

//     @product.State
//     public error!: string;

//     @product.State
//     public measurementTypes!: Array<MeasurementType>;

//     @general.State
//     public paymentTypes!: string;

//     @invoice.State
//     public invoiceStatus!: string;

//     @invoice.State
//     public invoiceError!: string;

//     @invoice.Action
//     public createInvoice!: () => InvoiceCreationResponse;

//     @customer.State
//     public customerError!: string;

//     @customer.State
//     public customerStatus!: string;

//     @customer.State
//     public customers!: Array<CustomerResponse>;

//     @customer.Action
//     public getCustomers!: () => InvoiceCreationResponse;

//     @sales.State
//     public saleDetails!: SaleDetails;

//     @sales.State
//     public salesRequestStatus!: SaleRequestStatus;

//     @Prop({ default: false }) readonly isEditing!: boolean;

//     get getMeasurementTypeKeyForUnit() {
//         // method is required as key for measurement type changes when a database migration is made
//         this.measurementTypes.forEach(measurement => {
//             if (measurement.name.toLowerCase() === 'unit') {
//                 this.measurementKeyForUnit = measurement.key;
//             }
//         });
//         return this.measurementKeyForUnit;
//     }

//     get total(): number {
//         let totalAmount = 0;
//         let totalDiscount = 0;
//         this.selectedProducts.forEach((item: SalesProduct) => {
//             totalAmount += Number(item.quantity) * Number(item.unitPrice);

//             if (!item.discount) item.discount = 0;
//             totalDiscount += Number(item.discount);
//         });
//         this.discount = totalDiscount;
//         return totalAmount - totalDiscount;
//     }

//     get productsWithAdditionalReactiveProperties() {
//         this.products.items.forEach(product => {
//             this.addReactivePropertiesToProductsList(product);
//         });
//         return this.products;
//     }

//     get shouldAddPaymentButtonShow() {
//         return this.isEditing && !this.addPaymentFormShouldShow;
//     }

//     get shouldAddPaymentFormShowInRecordSalesComponent() {
//         return this.isEditing && this.addPaymentFormShouldShow;
//     }

//     get shouldRecordSalesEditFormShow() {
//         const AddPaymentFormShouldNotShow = !this.shouldAddPaymentFormShowInRecordSalesComponent;
//         return AddPaymentFormShouldNotShow;
//     }

//     get conditionsForNoPaymentsTextToShow() {
//         return !this.saleDetails.payments.length && this.salesRequestStatus.getSaleDetails !== 'LOADING';
//     }

//     public addSuccessMessageOnEdit() {
//         this.toaster.type = 'success';
//         this.toaster.title = 'Success!';
//         this.toaster.message = 'Sale edited successfully';
//         this.$bvToast.show(this.toaster.id);
//     }

//     public handleAddPaymentToRecordSalesClick() {
//         this.addPaymentFormShouldShow = true;
//     }

//     public created() {
//         productModule = getModule(ProductModule, this.$store);
//         generalModule = getModule(GeneralModule, this.$store);
//         customerModule = getModule(CustomerModule, this.$store);

//         Promise.all([
//             productModule.getMeasurementTypes(),
//             generalModule.getPaymentTypes(),
//             productModule.getAllProducts(),
//             customerModule.getCustomers(),
//         ]);
//     }

//     public openCreateNewProductModal() {
//         this.displayedModal = 'product';
//         this.$bvModal.show('add-product-form-modal');
//     }

//     public setAnItemToBeEdited(value: boolean) {
//         this.anItemIsToBeEdited = value;
//     }

//     public addReactivePropertiesToProductsList(selectedProduct: any) {
//         // the keys being added are required for invoice creation
//         this.$set(selectedProduct, 'quantity', 1);
//         this.$set(selectedProduct, 'discount', 0);
//         this.$set(selectedProduct, 'unitPrice', selectedProduct.price);
//         this.$set(selectedProduct, 'productName', selectedProduct.name);
//         this.$set(selectedProduct, 'productKey', selectedProduct.key);
//         this.$set(selectedProduct, 'measurementTypeKey', this.getMeasurementTypeKeyForUnit);
//         this.$set(selectedProduct, 'paymentTypeKey', '');
//         this.$set(selectedProduct, 'note', selectedProduct.description);
//         this.$set(selectedProduct, 'paymentTypeName', '');
//         this.$set(selectedProduct, 'totalAmount', 0);
//         this.$set(selectedProduct, 'saleDate', this.formatDateToFitCalendarFormat(new Date().toString()));
//         this.$set(selectedProduct, 'amountPaid', 0);
//         this.$set(selectedProduct, 'customerKey', '');
//         this.$set(selectedProduct, 'isOutstandingOrder', null);
//     }

//     public openCreateNewCustomerModal() {
//         this.displayedModal = 'customer';
//         this.$bvModal.show('add-customer-form-modal');
//     }

//     public emitAmountClientPaidToIndex(amountClientPaid: number) {
//         this.$emit('amount-client-paid-from-bottom-section', amountClientPaid);
//     }

//     public setNairaDiscount(nairaDiscount: number) {
//         this.itemToBeEdited.discount = Number(nairaDiscount);
//     }

//     public setMeasurementTypeKey(measurementTypeKey: string) {
//         this.itemToBeEdited.measurementTypeKey = measurementTypeKey;
//     }
//     public setASalesItemHasBeenSelectedInitially() {
//         this.aSaleItemHasBeenSelectedInitially = true;
//     }

//     public handleSalesItemEditFormErrors(errors: ErrorIndexSignature) {
//         this.errorsFromSalesItemEditForm = errors;
//     }

//     public removeItemThatIsNotInDatabaseFromSelectedProducts(itemObject: SalesItemObject) {
//         const indexOfSaleItemNotInDatabaseToBeRemoved = this.selectedProducts.findIndex(
//             selectedProduct => selectedProduct.editIndex === itemObject.item.editIndex,
//         );
//         this.selectedProducts.splice(indexOfSaleItemNotInDatabaseToBeRemoved, 1);
//     }

//     public setIsDeletedPropertyToTrueForSalesItemsInDatabase(itemObject: SalesItemObject) {
//         this.saleItemsFromDatabase.splice(itemObject.index, 1);
//         this.$set(itemObject.item, 'isDelete', true);
//     }

//     public checkIfOneOfTheSalesItemsFromTheDatabaseHasBeenDeleted(itemObject: SalesItemObject) {
//         const isSaleItemToBeDeletedFromDatabase = this.saleItemsFromDatabase.some(saleItem => {
//             return saleItem.editIndex === itemObject.item.editIndex;
//         });

//         if (isSaleItemToBeDeletedFromDatabase) {
//             this.setIsDeletedPropertyToTrueForSalesItemsInDatabase(itemObject);
//         }

//         if (!isSaleItemToBeDeletedFromDatabase) {
//             this.removeItemThatIsNotInDatabaseFromSelectedProducts(itemObject);
//         }
//     }

//     public deleteSelectedSaleItem(itemObject: SalesItemObject) {
//         if (this.isEditing) {
//             this.checkIfOneOfTheSalesItemsFromTheDatabaseHasBeenDeleted(itemObject);
//         } else {
//             this.removeProductFromSelectedProducts(this.selectedProducts, itemObject.index);
//         }
//         this.itemToBeDeleted = { ...itemObject.item };
//     }

//     public addEditedItemToRecordSalesTable(editedProduct: SalesProduct, indexOfEditedProductInSaleTable: number) {
//         const cloneOfSalesItemOnSaleTable = [...this.selectedProducts];
//         // remove edited item from sales table so that it can be checked for duplicate entries
//         cloneOfSalesItemOnSaleTable.splice(this.indexOfItemToBeEdited, 1);

//         if (this.isDuplicateSalesEntry(cloneOfSalesItemOnSaleTable, editedProduct)) {
//             this.showToaster({
//                 ...this.toaster,
//                 type: 'warning',
//                 title: 'Warning!',
//                 message: 'Duplicate entries detected',
//             });
//         }
//         this.$set(this.selectedProducts, indexOfEditedProductInSaleTable, { ...editedProduct });
//         this.setAnItemToBeEdited(false);
//         this.itemToBeEdited = { ...this.initialStateOfItem };
//         this.scrollToTop();
//     }

//     public editSalesItem(itemObject: SalesItemObject) {
//         if (this.isEditing) {
//             this.addPaymentFormShouldShow = false;
//             this.aSaleItemHasBeenSelectedInitially = true;
//             this.checkItemToBeEditedForVat(itemObject);
//         }
//         // this.$nextTick in this case is necessary for when editing of record sales is taking place
//         // it allows for the dom to update before retrieving the items to edit
//         this.$nextTick(() => {
//             this.itemToBeEdited = { ...itemObject.item };
//             this.indexOfItemToBeEdited = itemObject.index;
//             this.anItemIsToBeEdited = true;
//         });
//     }

//     public checkItemToBeEditedForVat(itemObject: SalesItemObject) {
//         const { productVatKey } = itemObject.item;
//         if (productVatKey && productVatKey === this.vatAdditionKey) {
//             this.retrieveVatFromItemToBeEdited(itemObject);
//         }
//     }

//     public retrieveVatFromItemToBeEdited(itemObject: SalesItemObject) {
//         const { unitPrice, quantity, discount, productAmount } = itemObject.item;
//         const subTotal: number = Number(unitPrice) * Number(quantity) - Number(discount);
//         const vat: number = productAmount - subTotal;
//         this.vatOfItemToBeEdited = vat;
//         this.itemToBeEditedVatIsRequired = true;
//     }

//     public resetVatOfItemToBeEdited() {
//         this.itemToBeEditedVatIsRequired = false;
//         this.vatOfItemToBeEdited = 0;
//     }

//     public handleProductsSelectionButtonClick() {
//         this.$bvModal.hide('add-another-product-modal');
//     }

//     public isDuplicateSalesEntry(itemsOnSalesTable: Array<SalesProduct>, selectedProduct: SalesProduct): boolean {
//         let duplicateCount = 0;
//         itemsOnSalesTable.forEach(productInSalesTable => {
//             if (this.isEditing) {
//                 productInSalesTable.saleDate = this.formatDateToFitCalendarFormat(productInSalesTable.saleDate);
//             }
//             const sameCustomer = productInSalesTable.customerKey === selectedProduct.customerKey;
//             const sameSaleDate = productInSalesTable.saleDate === selectedProduct.saleDate;
//             const sameProduct = productInSalesTable.productKey === selectedProduct.productKey;
//             if (sameCustomer && sameSaleDate && sameProduct) {
//                 duplicateCount += 1;
//             }
//         });
//         return duplicateCount >= 1;
//     }

//     public addItemToSalesTable(selectedSalesItem: SalesProduct) {
//         if (this.isDuplicateSalesEntry(this.selectedProducts, selectedSalesItem)) {
//             this.showToaster({
//                 ...this.toaster,
//                 type: 'warning',
//                 title: 'Warning!',
//                 message: 'Duplicate entries detected',
//             });
//         }
//         this.selectedProducts.push({ ...selectedSalesItem });
//         this.scrollToTop();
//     }

//     public formattedEditIndexAddedToSaleItemToBeEdited() {
//         this.editIndexOfItemToBeEdited += 1;
//         return `E${this.editIndexOfItemToBeEdited}`;
//     }

//     public hideAddPaymentFormInEditSalesSection() {
//         this.addPaymentFormShouldShow = false;
//     }

//     public async addSalesPaymentInEditSaleSection(payload: AddSalesPaymentPayload) {
//         await saleModule.addSalePayment(payload);
//         this.paymentIsBeingUpdated = true;
//         if (this.salesRequestStatus.addSalePayment === Status.SUCCESS) {
//             this.toaster.type = 'success';
//             this.toaster.title = 'Success!';
//             this.toaster.message = 'Payment added successfully';
//             this.$bvToast.show(this.toaster.id);
//             await saleModule.getSaleDetails(this.saleKey);
//         }
//         if (this.salesRequestStatus.getSaleDetails === Status.SUCCESS) {
//             this.paymentIsBeingUpdated = false;
//         }
//     }

//     public $refs!: {
//         topOfPage: HTMLFormElement;
//     };

//     public scrollToTop() {
//         this.$refs.topOfPage.scrollIntoView({ behavior: 'smooth' });
//     }

//     public async mounted() {
//         this.authenticatedUser = sessionStorage.decodeToken();
//         saleModule = getModule(SaleModule, this.$store);
//         this.saleKey = this.$route.params.saleKey;

//         if (this.isEditing) {
//             await saleModule.getSaleDetails(this.saleKey);
//             this.saleDetails.saleProducts.forEach(product => {
//                 this.$set(product, 'editIndex', this.formattedEditIndexAddedToSaleItemToBeEdited());
//                 this.$set(product, 'isDelete', false);
//                 product.saleDate = this.formatDateToFitCalendarFormat(product.saleDate);
//             });
//             this.selectedProducts = [...this.saleDetails.saleProducts];
//             this.saleItemsFromDatabase = [...this.saleDetails.saleProducts];
//         }
//     }

//     @Watch('addPaymentFormShouldShow')
//     addPaymentFormShouldShowStatusHasChanged(newValue: boolean) {
//         if (newValue) {
//             this.setAnItemToBeEdited(false);
//         }
//     }

//     @Watch('itemToBeEdited')
//     itemToBeEditedHasChanged(newValue: SalesProduct) {
//         if (newValue.saleDate) {
//             this.itemToBeEdited.saleDate = this.formatDateToFitCalendarFormat(newValue.saleDate);
//         }
//     }
// }
//
</script>

//
<style lang="scss">
// @import 'src/styles/main.scss';
// @import 'src/styles/pages/sales/record-sales.scss';
//
</style>
