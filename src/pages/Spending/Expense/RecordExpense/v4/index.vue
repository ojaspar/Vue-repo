<template>
    <div v-if="!dataLoading">
        <b-row v-if="userIsOnMobile">
            <ExpenseSuccessPage
                v-if="showSuccessPage"
                @view-expenses="goToExpenseDashboard"
                @record-new-expense="restartExpenseProcess"
            />

            <MobileExpense
                v-else
                :functionalCurrency="functionalCurrency"
                :transactionDate="transactionDate"
                :action="action"
                @update-page-title="updatePageTitle"
                @set-cart-visibility="setCartVisibility"
                @set-cart-count="setCartCount"
                @set-left-icon="setLeftIcon"
                @update-transaction-date="updateTransactionDate"
                @process-expense-submission="updateAndProcessExpenseDetails"
            />
        </b-row>

        <div v-else>
            <ExpenseSuccessPage
                v-if="showSuccessPage"
                @view-expenses="goToExpenseDashboard"
                @record-new-expense="restartExpenseProcess"
            />
            <div v-else class="new-expense">
                <transition-group
                    name="slide-up-fade"
                    mode="in-out"
                    :class="
                        isOnPayment ? 'new-expense__desktop--payment-section' : 'new-expense__desktop--item-section'
                    "
                >
                    <!-- Expense Item Details -->
                    <div v-if="showItemDetailsForm" class="new-expense__item-details" key="item-details">
                        <ItemDetailsForm
                            :transactionDate="transactionDate"
                            :functionalCurrency="functionalCurrency"
                            :selectedVendor="selectedVendor"
                            :itemIsEditing="itemIsEditing"
                            :itemToBeEdited="itemToBeEdited"
                            :cartCount="selectedItems.length"
                            @update-transaction-date="updateTransactionDate"
                            @display-vendor-list="displayVendorList"
                            @add-item-to-list="handleItemListing"
                        />
                    </div>

                    <!-- Item List -->
                    <div v-if="showItemList" class="new-expense__item-list" key="item-list">
                        <ItemList
                            :selectedVendor="selectedVendor"
                            :selectedItems="selectedItems"
                            :functionalCurrency="functionalCurrency"
                            :totalAmount="selectedItemsTotalAmount"
                            @change-vendor="displayVendorList"
                            @edit-selected-item="startItemEdit"
                            @delete-item-from-list="displayDeleteModal"
                            @proceed-to-payment="proceedToPaymentPage"
                            @selected-vendor-updated="handleVendorUpdate"
                        />
                    </div>

                    <!-- Summary Section -->
                    <div v-if="showItemSummary" class="new-expense__item-summary" key="item-summary">
                        <!-- Transaction Date -->
                        <FormattedDatePicker
                            v-if="!userIsOnMobile"
                            :defaultDate="transactionDate"
                            @date-selected="updateTransactionDate"
                        />

                        <!-- Expense Item Summary -->
                        <ItemSummary
                            :selectedItems="selectedItems"
                            :selectedVendor="selectedVendor"
                            :totalAmount="selectedItemsTotalAmount"
                            :functionalCurrency="functionalCurrency"
                            :updateTaxOptions="updateItemsTaxOptions"
                            :selectedItemsTaxOptions="selectedItemsTaxOptions"
                            @update-tax-options="setSelectedItemsTaxOtions"
                            @back-to-item-list="returnToItemSelectionPage"
                            @edit-selected-item="startItemEdit"
                            @add-another-item="displayItemSection"
                            @delete-item-from-list="displayDeleteModal"
                        />
                    </div>

                    <!-- Vendor List -->
                    <div
                        v-if="showVendorList"
                        :class="isOnPayment ? 'new-expense__vendorsP' : 'new-expense__vendors'"
                        key="vendors"
                    >
                        <VendorList
                            :allowUnnamedVendor="allowUnnamedVendor"
                            @vendor-selected="handleVendorSelection"
                            @proceed-without-vendor="handleVendorSelection"
                        />
                    </div>

                    <!-- Payment Form -->
                    <div v-if="showPaymentForm" class="new-expense__payment-form" key="payment-form">
                        <PaymentForm
                            :selectedItemCount="selectedItemCount"
                            :transactionDate="transactionDate"
                            :functionalCurrency="functionalCurrency"
                            :totalAmount="selectedItemsTotalAmount"
                            :selectedVendor="selectedVendor"
                            :action="action"
                            @change-vendor="displayVendorList"
                            @process-expense-submission="processExpenseSubmission"
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
import { RouteRecord } from 'node_modules/vue-router/types/router';

import VendorList from '@/pages/Spending/Expense/RecordExpense/v4/VendorList.vue';
import ItemDetailsForm from '@/pages/Spending/Expense/RecordExpense/v4/ItemDetailsForm.vue';
import ItemList from '@/pages/Spending/Expense/RecordExpense/v4/ItemList.vue';
import ItemSummary from '@/pages/Spending/Expense/RecordExpense/v4/ItemSummary.vue';
import PaymentForm from '@/pages/Spending/Expense/RecordExpense/v4/PaymentForm.vue';
import MobileExpense from '@/pages/Spending/Expense/RecordExpense/v4/MobileExpense.vue';
import ExpenseSuccessPage from '@/pages/Spending/Expense/RecordExpense/v4/SuccessPage.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    ExpensePaymentDetails,
    defaultPaymentDetails,
    defaultSelectedItems,
    ExpenseItemDetails,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';
import {
    ExpenseItemType,
    ExpenseRequest,
    ExpenseRequestStatus,
    VendorRequestStatus,
    VendorType,
    ExpenseLineItem,
} from '@/pages/Spending/Expense/types';
import { Vendor, defaultVendor, Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import Validations from '@/pages/Spending/Expense/RecordExpense/v4/Validations';

import SessionStorageService from '@/services/sessionStorage';
import ExpenseModule from '@/store/modules/expense';
import VendorModule from '@/store/modules/vendor';
import { TaxForms } from '@/pages/Sales/types';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

const vendors = namespace('vendor');
let vendorModule: VendorModule;

@Component({
    components: { VendorList, ItemDetailsForm, ItemList, ItemSummary, PaymentForm, MobileExpense, ExpenseSuccessPage },
})
export default class RecordExpenseIndex extends Mixins(UtilityMixins, Validations) {
    private transactionDate = '';

    private dataLoading = false;

    //arrangement => It is either the user is working with the item or with the payment
    private isOnPayment = false;

    //vendors
    private selectedVendor: Vendor = { ...defaultVendor };
    private showVendorList = false;
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
    private allowUnnamedVendor = true;

    private updateItemsTaxOptions = false;
    private selectedItemsTaxOptions: ItemTaxOptions = { ...defaultTaxOptions };
    private isPreviousSection = false;

    private paymentDetails: ExpensePaymentDetails = { ...defaultPaymentDetails };
    private showSuccessPage = false;

    private showItemSummary = false;
    private showPaymentForm = false;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'new-expense-toaster',
        position: 'b-toaster-top-right',
    };

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    private expenseError!: string;

    @vendors.State
    private vendorRequestStatus!: VendorRequestStatus;

    @vendors.State
    private vendors!: Array<Vendor>;

    @expenses.State
    private expenseItemDetails!: ExpenseLineItem;

    @Prop({ default: '' }) action!: string;

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
            const items = itemDetails.expenseItemDetails;
            return previousAmount + items.amount.amount;
        }, 0);
    }

    get whtAmount(): number {
        return this.calculateWHT(this.selectedVendor.vendorType, this.subTotalAmount);
    }

    private calculateWHT(vendorType: string, subTotal: number): number {
        const whtPercentage = vendorType === VendorType.BUSINESS ? 0.05 : 0.1;
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

    private hideAllComponents() {
        this.showItemSummary = false;
        this.showPaymentForm = false;
        this.showVendorList = false;
        this.showItemDetailsForm = false;
        this.showItemList = false;
    }

    private displayVendorList() {
        if (this.isOnPayment) {
            this.showPaymentForm = false;
            setTimeout(() => {
                this.showVendorList = true;
            }, 400);
            return;
        }

        this.showItemList = false;
        setTimeout(() => {
            this.showItemDetailsForm = true;
            this.showVendorList = true;
        }, 400);
    }

    private hideVendorList() {
        if (this.isOnPayment) {
            this.showVendorList = false;
            setTimeout(() => {
                this.showPaymentForm = true;
            }, 400);
            return;
        }

        this.showVendorList = false;
        setTimeout(() => {
            this.showItemDetailsForm = true;
            this.showItemList = true;
        }, 400);
    }

    private displayItemSection() {
        this.showVendorList = false;
        this.showItemSummary = false;
        this.showPaymentForm = false;
        setTimeout(() => {
            this.isOnPayment = false;
            this.showItemDetailsForm = true;
            this.showItemList = true;
        }, 400);
    }

    private handleVendorSelection(selectedVendor: Vendor) {
        const thisVendor: Vendor = {
            ...defaultVendor,
            ...selectedVendor,
        };

        this.selectedVendor = thisVendor;
        this.hideVendorList();
    }

    private handleVendorUpdate(selectedVendor: Vendor) {
        this.handleVendorSelection(selectedVendor);
    }

    private handleItemListing(selectedExpenseItem: ExpenseItemType, expenseItemDetails: ExpenseItemDetails) {
        const item = { selectedExpenseItem, expenseItemDetails };
        const setCurrencyKey = this.itemIsEditing ? this.selectedItemCount < 2 : this.selectedItemCount < 1;

        if (setCurrencyKey) this.selectedCurrencyKey = Number(expenseItemDetails.amount.currencyKey);

        if (!this.itemIsEditing) {
            this.addNewItemToList(item);
            return;
        }
        this.updateItemOnList(this.editingItemIndex, item);
        this.stopItemEdit();
    }

    private addNewItemToList(newItem: SelectedItemDetails) {
        this.selectedItems.push(newItem);

        if (this.selectedItemCount == 1) {
            this.proceedToPaymentPage();
        }
    }

    private updateItemOnList(itemIndex: number, item: SelectedItemDetails) {
        this.selectedItems.splice(itemIndex, 1, item);

        if (this.selectedItemCount == 1) {
            this.proceedToPaymentPage();
        }
    }

    private startItemEdit(itemIndex: number, itemToBeEdited: SelectedItemDetails) {
        this.itemIsEditing = true;
        this.itemToBeEdited = itemToBeEdited;
        this.editingItemIndex = itemIndex;
        if (this.isOnPayment) {
            this.showVendorList = false;
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
        this.stopItemEdit();
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

    private processExpenseSubmission(paymentDetails: ExpensePaymentDetails) {
        this.paymentDetails = paymentDetails;

        const expenseRequest = this.selectedItems.map(selectedItem => {
            return this.generateExpenseRequest(selectedItem);
        });

        if (this.action == 'edit') this.updateExpense(expenseRequest);
        else this.createNewExpense(expenseRequest);
    }

    private async createNewExpense(expensebody: ExpenseRequest[]) {
        await expenseModule.createExpense(expensebody);
        if (this.expenseRequestStatus.createExpense === Status.SUCCESS) {
            this.showSuccessPage = true;
            return;
        }
        this.showErrorNotification(this.expenseError);
    }

    private async updateExpense(expensebody: ExpenseRequest[]) {
        const { params } = this.$route;
        await expenseModule.updateExpense({ expenseKey: params.expenseKey, expenseBody: expensebody[0] });

        if (this.expenseRequestStatus.updateExpense === Status.SUCCESS) {
            this.showSuccessPage = true;
            return;
        }
        this.showErrorNotification(this.expenseError);
    }

    private generateExpenseRequest(selectedItem: SelectedItemDetails): ExpenseRequest {
        const { selectedExpenseItem, expenseItemDetails } = selectedItem;
        const { deductWht } = this.selectedItemsTaxOptions;
        const unitCost = this.getItemUnitCOst(selectedItem);
        const { paymentDetails } = this;
        const { vendorKey } = this.selectedVendor;

        const balance = this.getBalanceAmount();
        const supplyBalance = expenseItemDetails.quantity - expenseItemDetails.quantityReceived;

        const pAmount =
            this.selectedItemCount > 1 ? expenseItemDetails.amount.amount : paymentDetails.amountPaid.amount;

        const expenseRequest = {
            name: selectedExpenseItem.name,
            expenseItemTypeKey: selectedExpenseItem.expenseItemTypeKey,
            amountPaidInOfferCurrency: {
                amount: pAmount,
                currencyKey: this.selectedCurrencyKey,
            },
            amountPaid: {
                amount: pAmount,
                currencyKey: Number(paymentDetails.amountPaid.currencyKey),
            },
            unitCost: { amount: unitCost, currencyKey: this.selectedCurrencyKey },
            totalCost: { amount: expenseItemDetails.amount.amount, currencyKey: this.selectedCurrencyKey },
            discount: 0,
            quantity: expenseItemDetails.quantity,
            vendorKey: vendorKey,
            measurementTypeKey: expenseItemDetails.measurementTypeKey,
            notes: expenseItemDetails.notes,
            description: expenseItemDetails.description,
            amountOwed: balance,
            withHoldingTaxType: vendorKey ? (deductWht ? 'Inclusive' : 'None') : 'None',
            paymentAccountKey: paymentDetails.accountPaidFrom,
            paymentDueDate: balance > 0 ? paymentDetails.balanceDueDate : '',
            quantityReceived: expenseItemDetails.quantityReceived,
            transactionDate: this.transactionDate,
            supplyDueDate: supplyBalance > 0 ? expenseItemDetails.supplyDueDate : '',
            attachments: [],
            donationSchemeKey: expenseItemDetails.donationSchemeKey,
        };
        return expenseRequest;
    }

    private setExpensePaymentDetails(paymentDetails: ExpensePaymentDetails) {
        this.paymentDetails = paymentDetails;
    }

    private updateTransactionDate(transactionDate: string) {
        this.transactionDate = transactionDate;
    }

    private getItemUnitCOst(item: SelectedItemDetails): number {
        const { quantity, amount } = item.expenseItemDetails;
        const unitCost = amount.amount / quantity;
        return unitCost;
    }

    private getBalanceAmount(): number {
        const amountPaid = this.paymentDetails.amountPaid;
        const totalAmount = this.selectedItemsTotalAmount.netAmount;
        return totalAmount - amountPaid.amount;
    }

    private showErrorNotification(message = 'An Error Occured') {
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message,
        });
    }

    private updateAndProcessExpenseDetails(
        selectedVendor: Vendor,
        selectedItems: SelectedItemDetails[],
        taxOptions: ItemTaxOptions,
        paymentDetails: ExpensePaymentDetails,
    ) {
        this.selectedVendor = selectedVendor;
        this.selectedItems = selectedItems;
        this.selectedItemsTaxOptions = taxOptions;
        this.processExpenseSubmission(paymentDetails);
    }

    private restartExpenseProcess() {
        this.selectedVendor = { ...defaultVendor };
        this.selectedItems = [];
        this.selectedItemsTaxOptions = { ...defaultTaxOptions };
        this.paymentDetails = { ...defaultPaymentDetails };
        this.showSuccessPage = false;
    }

    private updatePageTitle(pageTitle: string) {
        this.$parent.$emit('update-page-title', pageTitle);
    }

    private setLeftIcon(leftIcon: string) {
        this.$parent.$emit('set-left-icon', leftIcon);
    }

    private setCartVisibility(showCart: boolean) {
        this.$parent.$emit('set-show-cart', showCart);
    }

    private setCartCount(cartCount: number) {
        this.$parent.$emit('set-cart-count', cartCount);
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private assignModule() {
        expenseModule = getModule(ExpenseModule, this.$store);
        vendorModule = getModule(VendorModule, this.$store);
    }

    @Watch('selectedItemCount')
    checkItemCount(itemCount: number) {
        if (itemCount === 0 && this.isOnPayment) {
            this.displayItemSection();
        }
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

    private checkForPreloads() {
        let vendor = SessionStorageService.getItem('selected-vendor');

        if (vendor) {
            vendor = JSON.parse(vendor);

            this.selectedVendor = Object.assign({}, this.selectedVendor, vendor);

            SessionStorageService.removeItem('selected-vendor');
        }
    }

    private shouldDeductWht(whtName: string | undefined): boolean {
        if (!whtName) return false;

        return whtName != TaxForms.NONE;
    }

    private setupDataForEdit(action: string) {
        const item = this.expenseItemDetails;

        const vendorKey = item.vendor?.key || '';

        if (vendorKey) {
            const vendor = this.vendors.find((vendor: Vendor) => vendor.vendorKey === vendorKey);

            if (vendor) this.selectedVendor = vendor;
        }

        const subTotal = item.unitCost.amount * item.quantity;
        const isPartialPayment = item.paymentDueDate ? true : false;

        const transactionDate =
            action == 'edit' ? this.formatDateToFitCalendarFormat(item.transactionDate) : this.transactionDate;

        const supplyDueDate =
            action == 'edit'
                ? this.formatDateToFitCalendarFormat(item.supplyDueDate)
                : this.moveDate(item.transactionDate, item.supplyDueDate, transactionDate);

        const expenseItemDetails: ExpenseItemDetails = {
            name: item.expenseItemType.name,
            description: '',
            amount: { amount: subTotal, currencyKey: item.unitCost.currencyKey },
            quantity: item.quantity,
            measurementType: item.measurementType?.name || 'Unit',
            measurementTypeKey: item.measurementType?.key || 'Unit',
            quantityReceived: item.quantityReceived,
            donationSchemeKey: item.donationSchemeKey || '',
            notes: item.notes || '',
            transactionDate,
            supplyDueDate,
        };

        const selectedExpenseItem: ExpenseItemType = {
            name: item.expenseItemType.name,
            expenseItemTypeKey: item.expenseItemType.key,
            lastTransactionAmount: { amount: 0, currencyKey: item.unitCost.currencyKey },
            lastTransactionDate: '',
            totalFinancialYearAmount: { amount: 0, currencyKey: item.unitCost.currencyKey },
            notes: '',
            isMeasurable: true,
            description: '',
            financialYearStartDate: '',
        };

        this.selectedItems.push({ selectedExpenseItem, expenseItemDetails });

        this.selectedItemsTaxOptions = {
            addVat: false,
            deductWht: this.shouldDeductWht(item.withholdingTax?.name),
            whtIsTenPercent: this.selectedVendor?.vendorType == VendorType.INDIVIDUAL,
        };

        this.transactionDate = transactionDate;

        const paymentDetails = {
            accountPaidFrom: item.paymentAccountKey,
            amountPaid: item.amountPaid,
            transactionDate: transactionDate,
            balanceDueDate: item.paymentDueDate,
            hasPartialPayment: isPartialPayment,
        };

        this.paymentDetails = paymentDetails;
        expenseModule.setPaymentFormState(paymentDetails);
    }

    beforeRouteEnter(to: object, from: RouteRecord, next: Function) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next(async (vm: any) => {
            expenseModule = getModule(ExpenseModule, vm.$store);
            vendorModule = getModule(VendorModule, vm.$store);

            vm.checkForPreloads();

            if (!vm.action) return;

            const { params } = vm.$route;

            vm.dataLoading = true;

            await Promise.all([expenseModule.getExpenseItemDetails(params.expenseKey), vendorModule.getVendors()]);

            vm.dataLoading = false;

            vm.setupDataForEdit(vm.action);

            vm.proceedToPaymentPage();
        });
    }

    mounted() {
        this.assignModule();
        this.updateTransactionDate(this.todayAsDefaultDate());
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/index';
</style>
