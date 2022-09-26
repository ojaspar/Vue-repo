<template>
    <div class="record-sale__mobile">
        <transition name="slide-up-fade" mode="out-in">
            <component
                :is="componentList[activeComponentIndex]"
                :selectedCustomer="selectedCustomer"
                :allowUnnamedCustomer="allowUnnamedCustomer"
                :showCustomerDetails="showCustomerDetails"
                :selectedItems="selectedItems"
                :itemIsEditing="itemIsEditing"
                :itemToBeEdited="itemToBeEdited"
                :updateItemsTaxOptions="updateItemsTaxOptions"
                :selectedItemsTaxOptions="selectedItemsTaxOptions"
                :selectedItemsTotalAmount="selectedItemsTotalAmount"
                :functionalCurrency="functionalCurrency"
                :transactionDate="transactionDate"
                :isEstimate="isEstimate"
                :isEstimateConversion="isEstimateConversion"
                :action="action"
                @customer-selected="handleCustomerSelection"
                @proceed-without-customer="handleCustomerSelection"
                @change-customer="displayCustomers"
                @convert-estimate-to-sale="convertEstimateToSale"
                @display-customer-list="displayCustomers"
                @add-item-to-list="handleItemListing"
                @edit-selected-item="handleItemEditing"
                @delete-item-from-list="displayDeleteModal"
                @add-another-item="displayItemSelectionPage"
                @update-tax-options="setSelectedItemsTaxOptions"
                @proceed-to-payment="displayPaymentSection"
                @back-to-item-list="goToItemSelectionPage"
                @update-transaction-date="$emit('update-transaction-date', $event)"
                @process-sale-submission="processSaleSubmission"
                @generate-estimate="generateEstimate"
                @generate-invoice="generateInvoice"
                @generate-no-payment-invoice="handleGenerateNoPaymentInvoice"
            >
            </component>
        </transition>

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

import CustomerList from '@/pages/Sales/RecordSale/v4/CustomerList.vue';
import ItemSelection from '@/pages/Sales/RecordSale/v4/MobileItemSelection.vue';
import PaymentSection from '@/pages/Sales/RecordSale/v4/PaymentSection.vue';

import { Customer, LeftIcon } from '@/types';
import { Product, defaultCustomer, SaleCustomer, TaxForms } from '@/pages/Sales/types';
import {
    SaleItemDetails,
    SelectedItemDetails,
    defaultSelectedItems,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    PaymentDetails,
} from '@/pages/Sales/RecordSale/v4/types';

import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import SalesValidations from '@/pages/Sales/RecordSale/v4/validations';
import GeneralModule from '@/store/modules/general';
import SalesMixin from '../../SalesMixin';
import SessionStorageService from '@/services/sessionStorage';

//const sales = namespace('sale');
const general = namespace('general');

//let saleModule: SaleModule;
let generalModule: GeneralModule;

@Component({ components: { CustomerList, ItemSelection, PaymentSection } })
export default class MobileSaleIndex extends Mixins(
    UtilityMixins,
    DynamicComponentMixin,
    SalesMixin,
    SalesValidations,
) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly whtPercent!: number;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: false }) readonly isEstimateConversion!: boolean;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ required: true }) readonly vatType!: string;
    @Prop({ default: '' }) readonly action!: string;
    @Prop({ default: false }) readonly showPaymentForm!: boolean;

    private componentList = [CustomerList, ItemSelection, PaymentSection];
    private selectedCustomer: SaleCustomer = { ...defaultCustomer };
    private showCustomerDetails = true;
    private allowUnnamedCustomer = true;
    private selectedItems: SelectedItemDetails[] = [];
    private itemIsEditing = false;
    private editingItemIndex = 0;
    private itemToBeEdited: SelectedItemDetails = { ...defaultSelectedItems };
    private updateItemsTaxOptions = false;
    private selectedItemsTaxOptions: ItemTaxOptions = { ...defaultTaxOptions };
    private isPaymentSection = false;
    private showDeleteModal = false;
    private deletingItemIndex = 0;
    private leftIcon = LeftIcon.Hamburger;

    @general.State
    private mobileBackButtonClicked!: boolean;

    @general.State
    private mobileCartButtonClicked!: boolean;

    get selectedItemCount() {
        return this.selectedItems.length;
    }

    get itemListIsEmpty() {
        return this.selectedItemCount < 1;
    }

    get pageTitle() {
        const newPageTitles = ['Select Customer', 'Record Sale', 'Enter Sale Payment'];
        const pageTitles = ['Select Customer', 'Add Item to Sale', 'Enter Sale Payment'];

        if (this.selectedItems.length > 0) return pageTitles[this.activeComponentIndex];
        else return newPageTitles[this.activeComponentIndex];
    }

    get subTotalAmount(): number {
        return this.selectedItems.reduce((previousAmount: number, itemDetails: SelectedItemDetails) => {
            const { unitPrice, quantity, discount } = itemDetails.saleItemDetails;
            return previousAmount + this.lineAmount(unitPrice.amount, quantity, discount);
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

    get selectedItemsTotalAmount(): SelectedItemsTotalAmount {
        return {
            subTotal: this.subTotalAmount,
            totalExclVAT: this.getTotalExclusiveOfVAT(this.vatType, this.vatAmount, this.subTotalAmount),
            vatAmount: this.vatAmount,
            whtAmount: this.whtAmount,
            netAmount: this.netAmount,
        };
    }

    private displayCustomers() {
        this.setActiveComponentIndex(0);
        this.updateItemsTaxOptions = false;
    }

    private displayItemSelectionPage() {
        this.setActiveComponentIndex(1);
        this.showCustomerDetails = true;
        this.isPaymentSection = false;
        this.updateItemsTaxOptions = false;
    }

    private displayPaymentSection() {
        this.updateTaxOptions();
        this.setActiveComponentIndex(2);
        this.showCustomerDetails = false;
        this.isPaymentSection = true;
    }

    private convertEstimateToSale(lastSaleKey: string) {
        if (!this.userIsOnMobile) return;

        this.$emit('convert-estimate-to-sale', lastSaleKey);
    }

    private handleCustomerUpdate(updatedCustomer: SaleCustomer) {
        if (!this.userIsOnMobile) return;

        this.$emit('selected-customer-updated', updatedCustomer);
    }

    private handleGenerateNoPaymentInvoice() {
        if (!this.userIsOnMobile) return;

        this.$emit('generate-no-payment-invoice');
    }

    private handleCustomerSelection(selectedCustomer: SaleCustomer) {
        this.selectedCustomer = selectedCustomer || defaultCustomer;
        if (this.isPaymentSection) {
            this.displayPaymentSection();
            return;
        }
        this.displayItemSelectionPage();
    }

    private handleItemListing(selectedProduct: Product, saleItemDetails: SaleItemDetails) {
        const item = { selectedProduct, saleItemDetails };
        if (!this.itemIsEditing) {
            this.addNewItemToList(item);
            return;
        }
        this.updateItemOnList(this.editingItemIndex, item);
        this.stopItemEdit();
        this.displayPaymentSection();
    }

    private addNewItemToList(newItem: SelectedItemDetails) {
        this.selectedItems.push(newItem);
        this.displayPaymentSection();
    }

    private updateItemOnList(itemIndex: number, item: SelectedItemDetails) {
        this.selectedItems.splice(itemIndex, 1, item);
    }

    private startItemEdit(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        this.itemToBeEdited = itemToBeEdited;
        this.editingItemIndex = itemIndex;
        this.itemIsEditing = true;
    }

    private stopItemEdit() {
        this.itemIsEditing = false;
        this.editingItemIndex = 0;
        this.itemToBeEdited = { ...defaultSelectedItems };
    }

    private handleItemEditing(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        if (this.isPaymentSection) {
            this.startItemEdit(itemIndex, itemToBeEdited);
            this.displayItemSelectionPage();
            return;
        }
        this.startItemEdit(itemIndex, itemToBeEdited);
    }

    private displayDeleteModal(itemIndex: number) {
        this.deletingItemIndex = itemIndex;
        this.showDeleteModal = true;
    }

    private hideDeleteModal() {
        this.showDeleteModal = false;
    }

    private deleteItemFromList(itemIndex: number) {
        this.selectedItems.splice(itemIndex, 1);
        this.hideDeleteModal();
    }

    private updateTaxOptions() {
        this.updateItemsTaxOptions = true;
    }

    private setSelectedItemsTaxOptions(selectedItemsTaxOptions: ItemTaxOptions) {
        this.selectedItemsTaxOptions = selectedItemsTaxOptions;
    }

    private goToItemSelectionPage() {
        this.displayItemSelectionPage();
    }

    private generateEstimate() {
        if (!this.userIsOnMobile) return;

        this.$emit('generate-estimate', this.selectedCustomer, this.selectedItems, this.selectedItemsTaxOptions);
    }

    private generateInvoice(paymentDetails: PaymentDetails) {
        if (!this.userIsOnMobile) return;

        this.$emit(
            'generate-invoice',
            this.selectedCustomer,
            this.selectedItems,
            this.selectedItemsTaxOptions,
            paymentDetails,
        );
    }

    private generateNoPaymentInvoice() {
        if (!this.userIsOnMobile) return;

        this.$emit('generate-no-payment-invoice');
    }

    private setupDataForEdit() {
        if (this.action) {
            this.retreiveSavedEstimateItems();
            this.displayPaymentSection();
            return;
        }
        this.displayItemSelectionPage();
    }

    private retreiveSavedEstimateItems() {
        const customer = SessionStorageService.getItem('selected-customer-for-estimate');
        this.selectedCustomer = JSON.parse(customer);
        const selectedItems = SessionStorageService.getItem('selected-items-for-estimate');
        this.selectedItems = JSON.parse(selectedItems);
        const taxOptions = SessionStorageService.getItem('selected-tax-for-estimate');
        this.selectedItemsTaxOptions = JSON.parse(taxOptions);
        this.clearSavedEstimateItems();
    }

    private processSaleSubmission(paymentDetails: PaymentDetails) {
        if (!this.userIsOnMobile) return;

        this.$emit(
            'process-sale-submission',
            this.selectedCustomer,
            this.selectedItems,
            this.selectedItemsTaxOptions,
            paymentDetails,
        );
    }

    private setCartVisibility(showCart = true) {
        this.$emit('set-cart-visibility', showCart);
    }

    private setCartCount() {
        this.$emit('set-cart-count', this.selectedItemCount);
    }

    private navigateBackwards() {
        switch (this.activeComponentIndex) {
            case 0:
                if (this.isPaymentSection) {
                    this.displayPaymentSection();
                } else this.displayItemSelectionPage();
                break;
            case 2:
                this.displayItemSelectionPage();
        }
    }

    private resetBackButtonState() {
        generalModule.setMobileBackButtonState(false);
    }

    private resetCartButtonState() {
        generalModule.setMobileCartButtonState(false);
    }

    private assignModules() {
        generalModule = getModule(GeneralModule, this.$store);
    }

    @Watch('selectedItems', { deep: true })
    checkDeliveryStatus() {
        if (this.itemsIncludeIncompleteDelivery(this.selectedItems)) {
            this.allowUnnamedCustomer = false;
            return;
        }
        this.allowUnnamedCustomer = true;
    }

    @Watch('selectedItemsTaxOptions', { deep: true })
    checkTaxOptions() {
        const { deductWht } = this.selectedItemsTaxOptions;
        if (this.itemsIncludeIncompleteDelivery(this.selectedItems)) return;
        this.allowUnnamedCustomer = !deductWht;
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
            this.displayItemSelectionPage();
            this.displayPaymentSection();
        }
        this.resetCartButtonState();
    }

    @Watch('activeComponentIndex')
    activeComponentChanged() {
        switch (this.activeComponentIndex) {
            case 0:
                this.leftIcon = LeftIcon.Back;
                break;
            case 1:
                this.leftIcon = LeftIcon.Hamburger;
                break;
            case 2:
                this.leftIcon = LeftIcon.Back;
                break;
        }
    }

    @Watch('leftIcon', { immediate: true })
    leftIconChanged() {
        this.$emit('set-left-icon', this.leftIcon);
    }

    @Watch('pageTitle')
    updatePageTitle() {
        this.$emit('update-page-title', this.pageTitle);
    }

    @Watch('selectedItemCount')
    checkItemList(selectedItems: number) {
        if (selectedItems < 1) {
            this.displayItemSelectionPage();
        }
        this.setCartCount();
    }

    mounted() {
        this.assignModules();
        this.updatePageTitle();
        this.setCartVisibility();
        this.setCartCount();
        this.setupDataForEdit();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/index';
</style>
