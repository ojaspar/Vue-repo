<template>
    <div class="new-expense__mobile">
        <transition name="slide-up-fade" mode="out-in">
            <component
                :is="componentList[activeComponentIndex]"
                :selectedVendor="selectedVendor"
                :allowUnnamedVendor="allowUnnamedVendor"
                :showVendorDetails="showVendorDetails"
                :selectedItems="selectedItems"
                :itemIsEditing="itemIsEditing"
                :itemToBeEdited="itemToBeEdited"
                :updateItemsTaxOptions="updateItemsTaxOptions"
                :selectedItemsTaxOptions="selectedItemsTaxOptions"
                :selectedItemsTotalAmount="selectedItemsTotalAmount"
                :functionalCurrency="functionalCurrency"
                :transactionDate="transactionDate"
                :action="action"
                @vendor-selected="handleVendorSelection"
                @proceed-without-vendor="handleVendorSelection"
                @change-vendor="displayVendors"
                @display-vendor-list="displayVendors"
                @add-item-to-list="handleItemListing"
                @edit-selected-item="handleItemEditing"
                @delete-item-from-list="displayDeleteModal"
                @add-another-item="displayItemSelctionPage"
                @update-tax-options="setSelectedItemsTaxOptions"
                @proceed-to-payment="displayPaymentSection"
                @back-to-item-list="goToItemSelectionPage"
                @update-transaction-date="$emit('update-transaction-date', $event)"
                @process-expense-submission="processExpenseSubission"
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

import VendorList from '@/pages/Spending/Expense/RecordExpense/v4/VendorList.vue';
import ItemSelection from '@/pages/Spending/Expense/RecordExpense/v4/MobileItemSelection.vue';
import PaymentSection from '@/pages/Spending/Expense/RecordExpense/v4/PaymentSection.vue';

import { Vendor, defaultVendor, LeftIcon } from '@/types';
import { ExpenseItemType, VendorType } from '@/pages/Spending/Expense/types';
import {
    ExpenseItemDetails,
    SelectedItemDetails,
    defaultSelectedItems,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    ExpensePaymentDetails,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';

import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import Validations from '@/pages/Spending/Expense/RecordExpense/v4/Validations';
import GeneralModule from '@/store/modules/general';

//const expenses = namespace('expense');
const general = namespace('general');

//let expenseModule: ExpenseModule;
let generalModule: GeneralModule;

@Component({ components: { VendorList, ItemSelection, PaymentSection } })
export default class MobileExpenseIndex extends Mixins(UtilityMixins, DynamicComponentMixin, Validations) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: '' }) readonly action!: string;

    private componentList = [VendorList, ItemSelection, PaymentSection];
    private selectedVendor: Vendor = { ...defaultVendor };
    private showVendorDetails = true;
    private allowUnnamedVendor = true;
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
        const pageTitles = ['Select Vendor', 'Item Details', 'Payment'];
        return pageTitles[this.activeComponentIndex];
    }

    get subTotalAmount(): number {
        return this.selectedItems.reduce((previousAmount: number, itemDetails: SelectedItemDetails) => {
            const items = itemDetails.expenseItemDetails;
            return previousAmount + items.amount.amount;
        }, 0);
    }

    get whtAmount(): number {
        const subTotal = this.subTotalAmount;
        const whtPercentage = this.selectedVendor.vendorType === VendorType.BUSINESS ? 0.05 : 0.1;
        return subTotal * whtPercentage;
    }

    get netAmount(): number {
        const subTotal = this.subTotalAmount;
        const whtAmount = this.selectedItemsTaxOptions.deductWht ? this.whtAmount : 0;
        return subTotal - whtAmount;
    }

    get selectedItemsTotalAmount(): SelectedItemsTotalAmount {
        return {
            subTotal: this.subTotalAmount,
            whtAmount: this.whtAmount,
            netAmount: this.netAmount,
        };
    }

    private displayVendors() {
        this.setActiveComponentIndex(0);
        this.updateItemsTaxOptions = false;
    }

    private displayItemSelctionPage() {
        this.setActiveComponentIndex(1);
        this.showVendorDetails = true;
        this.isPaymentSection = false;
        this.updateItemsTaxOptions = false;
    }

    private displayPaymentSection() {
        this.updateTaxOptions();
        this.setActiveComponentIndex(2);
        this.showVendorDetails = false;
        this.isPaymentSection = true;
    }

    private handleVendorSelection(selectedVendor: Vendor) {
        this.selectedVendor = selectedVendor || defaultVendor;
        if (this.isPaymentSection) {
            this.displayPaymentSection();
            return;
        }
        this.displayItemSelctionPage();
    }

    private handleItemListing(selectedExpenseItem: ExpenseItemType, expenseItemDetails: ExpenseItemDetails) {
        const item = { selectedExpenseItem, expenseItemDetails };
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
            this.displayItemSelctionPage();
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
        this.displayItemSelctionPage();
    }

    private processExpenseSubission(paymentDetails: ExpensePaymentDetails) {
        this.$emit(
            'process-expense-submission',
            this.selectedVendor,
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
                } else this.displayItemSelctionPage();
                break;
            case 2:
                this.displayItemSelctionPage();
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
            this.allowUnnamedVendor = false;
            return;
        }
        this.allowUnnamedVendor = true;
    }

    @Watch('selectedItemsTaxOptions', { deep: true })
    checkTaxOptions() {
        const { deductWht } = this.selectedItemsTaxOptions;
        if (this.itemsIncludeIncompleteDelivery(this.selectedItems)) return;
        this.allowUnnamedVendor = !deductWht;
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
            this.displayItemSelctionPage();
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
            this.displayItemSelctionPage();
        }
        this.setCartCount();
    }

    mounted() {
        this.assignModules();
        this.updatePageTitle();
        this.setCartVisibility();
        this.setCartCount();
        this.goToItemSelectionPage();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/index';
</style>
