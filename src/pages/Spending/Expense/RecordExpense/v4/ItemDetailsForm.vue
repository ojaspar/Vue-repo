<template>
    <div class="item-details-form">
        <!-- Transaction Date -->
        <FormattedDatePicker
            v-if="!userIsOnMobile"
            :defaultDate="transactionDate"
            @date-selected="handleDateSelection"
        />

        <!-- Form Header -->
        <div class="item-details-form__header">{{ headerText }}</div>

        <div class="item-details-form__body">
            <!-- Expense Item Selection-->
            <b-row class="m-0">
                <b-col class="p-0 mt-3" v-if="expenseListShouldShow">
                    <ListDropdownAndAddBar
                        addEntityText="Add New"
                        placeholder="Select Expense Item"
                        :entityList="expenseItemTypes"
                        entityKey="expenseItemTypeKey"
                        dateKey="lastTransactionDate"
                        entityNameKey="name"
                        :newEntityCreated="newExpenseItemCreated"
                        :createdEntity="createdExpenseItem"
                        :requestIsLoading="expenseItemTypeRequestIsLoading"
                        :autoFocus="true"
                        @add-entity-button-clicked="showExpenseItemModal"
                        @resource-selected="handleExpenseSelection"
                        @search-string-changed="updateSearchString"
                        @entity-list-hidden="handleExpenseListDismissal"
                    />
                </b-col>

                <b-col class="item-details-form__expense-items-container p-0" v-else>
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Expense Name"
                        :value="selectedExpenseName"
                        :errors="itemDetailsError.name"
                        @change="validateSelectedItem(selectedExpenseName)"
                        @focus="showExpenseList"
                    />

                    <Loader
                        size="2"
                        class="item-details-form__expense-items-loader"
                        v-if="expenseItemTypeRequestIsLoading"
                    />
                </b-col>
            </b-row>

            <b-row class="m-0">
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Item Description"
                        v-model="itemDetailsForm.description"
                    />
                </b-col>
            </b-row>

            <div class="item-details-form__row">
                <div class="item-details-form__col">
                    <!-- Amount -->
                    <div class="item-details-form__col--amount">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            v-if="!userIsOnDesktop"
                            :floatingLabelText="
                                wrapFloatingLabelTextWithCurrencySymbol('Total Cost', functionalCurrency)
                            "
                            :value="unformattedAmount"
                            :errors="itemDetailsError.amount"
                            @input="formatAndValidateAmount"
                        />
                        <BaseInputFieldWithBorderAndFloatingLabel
                            v-else
                            :floatingLabelText="
                                wrapFloatingLabelTextWithCurrencySymbol('Total Cost', functionalCurrency)
                            "
                            :value="formattedAmount"
                            :errors="itemDetailsError.amount"
                            @input="formatAndValidateAmount"
                        />
                        <p v-if="!userIsOnDesktop" class="item-details-form__amount-text">
                            <span v-if="formattedAmount">
                                Amount: {{ itemDetailsForm.amount | amountWithCurrency }}
                            </span>
                        </p>
                    </div>

                    <div class="item-details-form__col--currency">
                        <!-- Currency -->
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultOptionText="Select Currency"
                            keyProperty="currencyKey"
                            valueProperty="currencyKey"
                            textProperty="currencyName"
                            :options="availableCurrencies"
                            v-model="itemDetailsForm.amount.currencyKey"
                        />
                    </div>
                </div>

                <div class="item-details-form__col">
                    <!-- Quantity -->
                    <div class="item-details-form__col--quantity">
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Quantity"
                            :value="formattedQuantity"
                            :errors="itemDetailsError.quantity"
                            @input="formatAndValidateQuantity"
                        />

                        <!-- Item Delivery Status -->
                        <BaseCheckbox
                            v-if="showItemDeliveryStatusChecker"
                            inputContainerClass="item-details-form__checkbox--input"
                            labelText="Delivery Complete"
                            labelClass="item-details-form__checkbox--label"
                            id="delivery-status"
                            v-model="itemDeliveryCompleted"
                            @change="toggleItemDeliveryStatus"
                        />
                    </div>

                    <!-- Measurement Type -->
                    <div class="item-details-form__col--unit">
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultOptionText="Measurement Type"
                            keyProperty="name"
                            valueProperty="name"
                            textProperty="name"
                            :options="measurementTypes"
                            v-model="itemDetailsForm.measurementType"
                        />
                    </div>
                </div>
            </div>

            <transition name="slide-up-fade" mode="out-in">
                <div v-if="!itemDeliveryCompleted" class="item-details-form__row">
                    <div class="item-details-form__col">
                        <div class="d-flex w-100">
                            <!-- Quantity Received-->
                            <div class="item-details-form__col--received">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Quantity Received"
                                    :value="formattedQuantityReceived"
                                    :errors="itemDetailsError.quantityReceived"
                                    @input="formatAndValidateQuantityReceived"
                                />
                            </div>

                            <!-- Quantity Remaining -->
                            <div class="item-details-form__col--remaining">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Quantity Remaining"
                                    :disabled="true"
                                    :value="balanceQuantity"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Supply Due Date -->
                    <div class="item-details-form__col--supply-due-date">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Supply Due Date"
                            :disableDatesTo="transactionDate"
                            :disabled="disableSupplyDueDate"
                            :errors="itemDetailsError.supplyDueDate"
                            v-model="itemDetailsForm.supplyDueDate"
                            @input="performValidateSupplyDueDate"
                        />
                    </div>
                </div>
            </transition>

            <!-- Donation Scheme" -->
            <b-row class="m-0" v-if="$root.businessIsANgo">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultSelectField="true"
                        defaultOptionText="-- Select Donation Scheme --"
                        keyProperty="donationSchemeKey"
                        valueProperty="donationSchemeKey"
                        textProperty="name"
                        floatingLabelText="Donation Scheme"
                        :options="donationSchemes"
                        :errors="itemDetailsError.donationScheme"
                        v-model="itemDetailsForm.donationSchemeKey"
                        @input="validateExpenseDonationScheme(itemDetailsForm.donationSchemeKey)"
                    />
                </b-col>
            </b-row>

            <!-- Notes -->
            <b-row class="m-0">
                <b-col class="p-0">
                    <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="itemDetailsForm.notes" />
                </b-col>
            </b-row>

            <b-row class="item-details-form__footer">
                <GeneralFormError :message="generalFormError" />

                <!--Vendor Error -->
                <VendorAlert :showAlert="showVendorAlert" @action-taken="$emit('display-vendor-list')" />

                <!-- Form Button -->
                <BaseSecondaryButton
                    :buttonText="buttonText"
                    :disabled="disableFormButton"
                    @button-clicked="handleItemDetailsForm"
                />
            </b-row>
        </div>

        <!-- New Expesne Item -->
        <BaseModal :modalId="newExpenseItemModal" modalTitle="Add Item" @hide-modal="hideExpenseItemModal">
            <NewExpenseItemForm
                :newExpenseName="expenseSearchString"
                @expense-item-created="handleNewExpenseItemCreation"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import NewExpenseItemForm from '@/pages/Spending/Expense/AddExpenseItem.vue';
import VendorAlert from '@/pages/Spending/Expense/RecordExpense/v4/VendorAlert.vue';

import {
    ExpenseItemDetails,
    SelectedItemDetails,
    defaultSelectedItems,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';
import { DonationScheme, DonationRequestStatus } from '@/pages/Donations/types';
import { Status, MeasurementType, PaymentAccount, Vendor, defaultVendor, VueExtension } from '@/types';
import { ExpenseItemType, ExpenseRequestStatus, expenseItemTypeInitialState } from '@/pages/Spending/Expense/types';

import ExpenseModule from '@/store/modules/expense';
import BankModule from '@/store/modules/bank';
import DonationModule from '@/store/modules/donation';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import Validations from '@/pages/Spending/Expense/RecordExpense/v4/Validations';

import SessionStorageService from '@/services/sessionStorage';

const expenses = namespace('expense');
const bank = namespace('bank');
const donations = namespace('donation');

let expenseModule: ExpenseModule;
let bankModule: BankModule;
let donationModule: DonationModule;

@Component({ components: { VendorAlert, NewExpenseItemForm } })
export default class ExpenseItemDetailsForm extends Mixins(UtilityMixins, CurrencyMixins, Validations) {
    @Prop({ default: 0 }) readonly functionalCurrency!: number;
    @Prop({ default: 0 }) readonly cartCount!: number;
    @Prop({ required: true }) readonly transactionDate!: string;
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: false }) readonly itemIsEditing!: boolean;
    @Prop({ default: () => defaultSelectedItems }) readonly itemToBeEdited!: SelectedItemDetails;

    private expenseSearchString = '';
    private addingNewExpenseItem = false;
    private newExpenseItemCreated = false;
    private selectedExpenseItem: ExpenseItemType = { ...expenseItemTypeInitialState };
    private createdExpenseItem: ExpenseItemType = { ...expenseItemTypeInitialState };
    private clearSearchString = false;
    private expenseListShouldShow = false;
    private itemDeliveryCompleted = true;

    private formattedAmount = '';
    private unformattedAmount = '';
    private formattedQuantity = '1';
    private formattedQuantityReceived = '1';

    private newExpenseItemModal = 'expense-item-modal';

    private defaultItemDetails: ExpenseItemDetails = {
        name: this.selectedExpenseName,
        description: '',
        amount: { amount: 0, currencyKey: this.functionalCurrency },
        quantity: 1,
        measurementType: 'Unit',
        measurementTypeKey: '',
        quantityReceived: 1,
        donationSchemeKey: '',
        notes: '',
        transactionDate: this.transactionDate,
        supplyDueDate: '',
    };

    private itemDetailsForm: ExpenseItemDetails = { ...this.defaultItemDetails };

    public $root!: VueExtension;

    @expenses.State
    private measurementTypes!: MeasurementType[];

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    private expenseItemTypes!: ExpenseItemType[];

    @bank.State
    private paymentAccounts!: Array<PaymentAccount>;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @donations.State
    private donationSchemes!: DonationScheme[];

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get expenseItemTypeRequestIsLoading(): boolean {
        return this.expenseRequestStatus.getExpenseItemsTypes === Status.LOADING;
    }

    get disableFormButton(): boolean {
        return !this.itemDetailsFormIsValidated;
    }

    get disableSupplyDueDate(): boolean {
        const { quantity, quantityReceived } = this.itemDetailsForm;
        return quantity == quantityReceived;
    }

    get buttonText() {
        return this.itemIsEditing ? 'Update' : this.cartCount > 0 ? 'Add to List' : 'Next';
    }

    get headerText() {
        return this.itemIsEditing ? 'Edit Expense' : this.cartCount > 0 ? 'Add Another Expense' : 'Add Expense';
    }

    get vendorIsSelected() {
        return this.selectedVendor.name.length > 0;
    }

    get showVendowError() {
        return !this.vendorIsSelected && this.currentWindowWidth > 995;
    }

    get selectedExpenseName(): string {
        return this.selectedExpenseItem.name;
    }

    get balanceQuantity(): string {
        const { quantity, quantityReceived } = this.itemDetailsForm;
        const balanceQuantity = quantity - quantityReceived;
        if (this.quantityReceivedInputFieldHasError || this.quantityInputFieldHasError) return '0';
        return this.convertFigureToCurrency(balanceQuantity) || '0';
    }

    get quantityInputFieldHasError(): boolean {
        const quantityInputError = this.itemDetailsError.quantity;
        return this.hasError(quantityInputError);
    }

    get quantityReceivedInputFieldHasError(): boolean {
        const quantityReceivedInputError = this.itemDetailsError.quantityReceived;
        return this.hasError(quantityReceivedInputError);
    }

    get showItemDeliveryStatusChecker() {
        return !this.quantityInputFieldHasError;
    }

    get showVendorAlert() {
        return !this.itemDeliveryCompleted && !this.vendorIsSelected;
    }

    private getMeasurementTypeFromKey(key: string) {
        return this.measurementTypes.find((measurementType: MeasurementType) => measurementType.key === key);
    }

    private getMeasurementTypeFromName(name: string) {
        return this.measurementTypes.find((measurementType: MeasurementType) => measurementType.name === name);
    }

    private getMeasurementTypeKey(name: string) {
        const measurementTypeChosen = this.getMeasurementTypeFromName(name);
        if (measurementTypeChosen) {
            return measurementTypeChosen.key;
        }
        return '';
    }

    private getMeasurementTypeName(key: string) {
        const measurementTypeChosen = this.getMeasurementTypeFromKey(key);
        if (measurementTypeChosen) {
            return measurementTypeChosen.name;
        }
        return '';
    }

    private handleDateSelection(selectedDate: string) {
        this.$emit('update-transaction-date', selectedDate);
    }

    private updateSearchString(searchString: string, clearValue = false) {
        this.expenseSearchString = searchString;
        this.clearSearchString = clearValue;
    }

    private toggleItemDeliveryStatus() {
        this.itemDeliveryCompleted = !this.itemDeliveryCompleted;
        if (this.itemDeliveryCompleted) {
            const { quantity } = this.itemDetailsForm;
            this.setItemQuantityReceived(quantity);
        }
    }

    private showExpenseList() {
        this.expenseListShouldShow = true;
    }

    private hideExpenseList() {
        this.updateSearchString('', true);
        this.expenseListShouldShow = false;
    }

    private showExpenseItemModal() {
        this.displayModal(this.newExpenseItemModal);
        this.addingNewExpenseItem = true;
    }

    private hideExpenseItemModal() {
        this.cancelModal(this.newExpenseItemModal);
        this.addingNewExpenseItem = false;
    }

    private handleNewExpenseItemCreation(newExpenseItem: ExpenseItemType) {
        this.hideExpenseItemModal();
        this.itemDetailsForm.name = newExpenseItem.name;
        this.setSelectedExpenseItem(newExpenseItem);
        this.handleExpenseListDismissal();
    }

    private handleExpenseSelection(expenseItem: ExpenseItemType) {
        this.itemDetailsForm.name = expenseItem.name;
        this.setSelectedExpenseItem(expenseItem);
        this.hideExpenseList();
    }

    private setSelectedExpenseItem(selectedExpenseItem: ExpenseItemType) {
        this.selectedExpenseItem = selectedExpenseItem;
    }

    private handleExpenseListDismissal() {
        if (this.addingNewExpenseItem) return;
        this.hideExpenseList();
        this.validateSelectedItem(this.itemDetailsForm.name);
    }

    private formatAndValidateAmount(amountPaid: string) {
        this.unformattedAmount = amountPaid;
        const amount = this.convertFormattedFiguresToNumber(amountPaid);
        if (this.validateExpenseAmount(String(amount))) {
            this.formattedAmount = this.convertFigureToCurrency(amount);
            const currencyKey = Number(this.functionalCurrency);
            this.$set(this.itemDetailsForm, 'amount', { amount, currencyKey });
            return;
        }
        this.formattedAmount = '';
        this.itemDetailsForm.amount.amount = 0;
    }

    private formatAndValidateQuantity(quantity: string) {
        const quantityAmount = this.convertFormattedFiguresToNumber(quantity);
        const quantityReceived = this.itemDetailsForm.quantityReceived;
        if (
            this.validateExpenseQuantity(String(quantityAmount), String(quantityReceived), this.itemDeliveryCompleted)
        ) {
            this.$set(this.itemDetailsForm, 'quantity', quantityAmount);
            this.formattedQuantity = this.convertFigureToCurrency(quantityAmount);
            return;
        }
        this.formattedQuantity = '';
        this.itemDetailsForm.quantity = 1;
    }

    private formatAndValidateQuantityReceived(quantityReceived: string) {
        const quantityReceivedAmount = this.convertFormattedFiguresToNumber(quantityReceived);
        this.formattedQuantityReceived = this.convertFigureToCurrency(quantityReceivedAmount);
        const quantity = this.itemDetailsForm.quantity;
        this.validateQuantityReceived(String(quantityReceivedAmount), String(quantity));
        this.setItemQuantityReceived(quantityReceivedAmount);
    }

    private setItemQuantityReceived(quantityReceived: number) {
        this.$set(this.itemDetailsForm, 'quantityReceived', quantityReceived);
        this.formattedQuantityReceived = this.convertFigureToCurrency(quantityReceived);
    }

    private performValidateSupplyDueDate() {
        const { quantity, quantityReceived, supplyDueDate } = this.itemDetailsForm;

        this.validateSupplyDueDate(quantity - quantityReceived, supplyDueDate, this.transactionDate);
    }

    private handleItemDetailsForm() {
        this.validateItemDetailsForm(this.itemDetailsForm, this.itemDeliveryCompleted, this.$root.businessIsANgo);
        if (!this.itemDetailsFormIsValidated || this.showVendorAlert) return;
        this.addItemToList();
        this.reseItemForm();
    }

    private addItemToList() {
        const modifiedDetails = {
            ...this.itemDetailsForm,
            measurementTypeKey: this.getMeasurementTypeKey(this.itemDetailsForm.measurementType),
        };
        this.$emit('add-item-to-list', this.selectedExpenseItem, modifiedDetails);
    }

    private reseItemForm() {
        this.selectedExpenseItem = { ...expenseItemTypeInitialState };
        this.itemDetailsForm = { ...this.defaultItemDetails };
        this.formattedAmount = '';
        this.formattedQuantity = '1';
        this.formattedQuantityReceived = '1';
        this.itemDeliveryCompleted = true;
    }

    private setEditingItemDetails(expenseItemDetails: ExpenseItemDetails) {
        const {
            name,
            description,
            amount,
            quantity,
            quantityReceived,
            measurementType,
            measurementTypeKey,
            donationSchemeKey,
            notes,
            transactionDate,
            supplyDueDate,
        } = expenseItemDetails;
        this.itemDetailsForm.name = name;
        this.itemDetailsForm.description = description;
        this.itemDetailsForm.amount = amount;
        this.itemDetailsForm.quantity = quantity;
        this.itemDetailsForm.quantityReceived = quantityReceived;
        this.itemDetailsForm.measurementType = measurementType;
        this.itemDetailsForm.measurementTypeKey = measurementTypeKey;
        this.itemDetailsForm.donationSchemeKey = donationSchemeKey;
        this.itemDetailsForm.notes = notes;
        this.itemDetailsForm.transactionDate = transactionDate;
        this.itemDetailsForm.supplyDueDate = supplyDueDate;
        this.formattedAmount = this.convertFigureToCurrency(amount.amount);
        this.formattedQuantity = this.convertFigureToCurrency(quantity);
        this.formattedQuantityReceived = this.convertFigureToCurrency(quantityReceived);
        this.itemDeliveryCompleted = quantity === quantityReceived;
    }

    private prefillFormWithItemDetails() {
        const { selectedExpenseItem, expenseItemDetails } = this.itemToBeEdited;
        this.setSelectedExpenseItem(selectedExpenseItem);
        this.setEditingItemDetails(expenseItemDetails);
    }

    private assignModules() {
        expenseModule = getModule(ExpenseModule, this.$store);
        bankModule = getModule(BankModule, this.$store);
        donationModule = getModule(DonationModule, this.$store);
    }

    private async makePreliminaryRequests() {
        if (this.$root.businessIsANgo) {
            await donationModule.getDonationSchemes();
        }
        Promise.all([
            expenseModule.getMeasurementTypes(),
            expenseModule.getExpenseItemTypes(),
            bankModule.getPaymentAccounts(),
        ]);
    }

    @Watch('itemDetailsForm.quantity')
    updateQuatityReceived(quantity: number) {
        if (!this.itemDeliveryCompleted) return;
        this.setItemQuantityReceived(quantity);
    }

    @Watch('itemDetailsForm.quantityReceived')
    checkQuantityReceived(quantityReceived: number) {
        const { quantity } = this.itemDetailsForm;
        if (quantity == quantityReceived) {
            this.itemDeliveryCompleted = true;
            this.clearSupplyDueDateError();
        }
    }

    @Watch('itemToBeEdited', { immediate: true, deep: true })
    hadleItemEditing() {
        if (!this.itemIsEditing) return;
        this.resetItemDetailsFormErrors();
        this.prefillFormWithItemDetails();
    }

    @Watch('expenseItemTypes', { deep: true })
    checkIfItemShouldBePreselected() {
        const { query } = this.$route;

        if (query.redirectedFrom !== 'stockitem') return;

        let selectedItem = SessionStorageService.getItem('stock-item');

        if (!selectedItem) return;
        selectedItem = JSON.parse(selectedItem);

        const selectedExpenseItem = this.expenseItemTypes.find((expenseItem: ExpenseItemType) =>
            expenseItem.name.match(selectedItem?.name),
        );

        if (!selectedExpenseItem) return;

        this.handleExpenseSelection(selectedExpenseItem);
    }

    mounted() {
        this.assignModules();
        this.makePreliminaryRequests();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/item-details-form';
</style>
