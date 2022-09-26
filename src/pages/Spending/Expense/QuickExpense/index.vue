<template>
    <div>
        <transition name="fade" mode="out-in">
            <QuickExpenseForm
                :newExpenseItemCreated="newExpenseItemCreated"
                :createdExpenseItem="createdExpenseItemType"
                :addingNewVendor="addingNewVendor"
                :newVendorCreated="newVendorCreated"
                @expense-search-string-changed="updateExpenseSearchString"
                @add-entity-button-clicked="displayExpenseItemModal"
                @vendor-search-string-changed="updateVendorSearchString"
                @add-vendor-button-clicked="displayVendorModal"
            />
        </transition>

        <BaseModal :modalId="newExpenseItemModal" modalTitle="New Expense Item" @hide-modal="hideExpenseItemModal">
            <AddExpenseItem
                :newExpenseName="expenseItemSearchString"
                @expense-item-created="handleExpenseItemCreation"
            />
        </BaseModal>

        <BaseModal
            :modalId="newVendorModal"
            modalTitle="New Vendor"
            :no-close-on-backdrop="!closeVendorModalOnBackdrop"
            @hide-modal="hideVendorModal"
        >
            <AddVendorForm
                :searchedVendor="vendorSearchString"
                @new-vendor-created="handleVendorCreation"
                @close-vendor-modal-on-backdrop="setModalClosureOnBackdrop"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator';

import QuickExpenseForm from '@/pages/Spending/Expense/QuickExpense/QuickExpenseForm.vue';
import AddExpenseItem from '@/pages/Spending/Expense/AddExpenseItem.vue';
import AddVendorForm from '@/pages/Spending/Expense/ManageVendors/AddOrEditVendorForm.vue';

import { ExpenseItemType, expenseItemTypeInitialState } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';

@Component({ components: { QuickExpenseForm, AddExpenseItem, AddVendorForm } })
export default class QuickExpenseIndex extends Mixins(UtilityMixins) {
    private expenseItemSearchString = '';
    private newExpenseItemCreated = false;
    private createdExpenseItemType: ExpenseItemType = { ...expenseItemTypeInitialState };
    private newExpenseItemModal = 'new-exense-item-modal';
    private newVendorModal = 'new-vendor-modal';

    private vendorSearchString = '';
    private addingNewVendor = false;
    private newVendorCreated = false;
    private closeVendorModalOnBackdrop = false;

    private displayExpenseItemModal() {
        this.displayModal(this.newExpenseItemModal);
    }

    private hideExpenseItemModal() {
        this.cancelModal(this.newExpenseItemModal);
    }

    private updateExpenseSearchString(searchString: string) {
        this.expenseItemSearchString = searchString;
    }

    private handleExpenseItemCreation(newExpenseItemType: ExpenseItemType) {
        this.newExpenseItemCreated = true;
        this.createdExpenseItemType = newExpenseItemType;
        this.hideExpenseItemModal();
        this.updateExpenseSearchString('');
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeVendorModalOnBackdrop = coseModal;
    }

    private displayVendorModal() {
        this.addingNewVendor = true;
        this.displayModal(this.newVendorModal);
    }

    private hideVendorModal() {
        this.addingNewVendor = false;
        this.cancelModal(this.newVendorModal);
    }

    private updateVendorSearchString(searchString: string) {
        this.vendorSearchString = searchString;
    }

    private handleVendorCreation() {
        this.newVendorCreated = true;
        this.hideVendorModal();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense';
</style>
