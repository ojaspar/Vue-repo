<template>
    <b-modal :id="id" size="xl" no-close-on-backdrop>
        <template v-slot:modal-header="{ cancel }">
            <div class="expense-dashboard__expense-selection-modal-header-container">
                <h3 class="expense-dashboard__expense-selection-modal-header-text">Select Expenses</h3>
                <span @click="cancel()" class="expense-dashboard__expense-selection-modal-cancel-btn">X</span>
            </div>
        </template>
        <DualEntitySelection
            :topEntityPictureSelectOptions="selectedExpenses"
            :bottomEntityPictureSelectOptions="allExpenses"
            :dualEntityHeaderPresent="false"
            :conditionForDualEntitySectionToNotShow="!allExpenses.length"
            noEntityMainHeading="You don't have any expense"
            noEntitySubHeading="Looks like you haven't added any expenses"
            noEntityButtonText="Add New Expense"
            entitySearchPlaceholder="Click to select multiple expenses below or enter expense name to search"
            :entitySearchIcon="require('@/assets/img/shopping-cart.svg')"
            entitySearchAddText="Add New Expense"
            :conditionForTopEntitySectionToNotShow="selectedExpenses.length > 0"
            topEntitySectionHeading="Selected Expenses"
            topEntityImageProperty="imageUrl"
            bottomEntityImageProperty="imageUrl"
            :removeMultipleItems="true"
            :numberOfTopEntitySectionItems="selectedExpenses.length"
            @picture-selected="handleExpenseSelection"
            @picture-removed="handleExpenseRemoval"
            @button-clicked="handleExpenseSelectionButtonClick"
            bottomEntitySectionHeading="All Expenses"
            :numberOfBottomEntitySectionItems="allExpenses.length"
            :conditionForButtonToBeDisabled="!selectedExpenses.length"
        />
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import DualEntitySelection from '@/components/ui/DualEntitySelection.vue';

import PlusSign from '@/components/ui/PlusSign.vue';

import sewingMachine from '@/assets/img/sewing-machine.jpg';
import lawmaBills from '@/assets/img/LAWMA-bills.jpg';
import RepairsAndServicing from '@/assets/img/Repairs-and-servicing.png';
import StaffPayment from '@/assets/img/staff-payment.png';
import BillPaymentAndTaxes from '@/assets/img/tax.jpg';
import fuelDiesel from '@/assets/img/fuel-diesel.jpg';
import Buttons from '@/assets/img/buttons.jpeg';
import AdvertisingMarketing from '@/assets/img/advertising.jpg';
import Miscellaneous from '@/assets/img/miscellaneous-expenses.jpg';
import OfficeMaintenance from '@/assets/img/office-repair-maintenance.png';
import GeneratorRepairs from '@/assets/img/generator-repairs.jpeg';
import OfficeFurniture from '@/assets/img/office-furniture.jpg';

import PictureSelect from '@/components/ui/PictureSelect.vue';

import { PictureSelectOptions } from '@/types';

@Component({
    components: {
        PlusSign,
        PictureSelect,
        DualEntitySelection,
    },
})
export default class SelectExpenseItemModal extends Vue {
    private allExpenses = [
        {
            name: 'Buttons',
            imageUrl: Buttons,
        },
        {
            name: 'Advertising & Marketing',
            imageUrl: AdvertisingMarketing,
        },
        {
            name: 'Miscellaneous Expenses',
            imageUrl: Miscellaneous,
        },
        {
            name: 'Office Expenses',
            imageUrl: OfficeMaintenance,
        },
        {
            name: 'Generator Repairs',
            imageUrl: GeneratorRepairs,
        },
        {
            name: 'Office Furniture',
            imageUrl: OfficeFurniture,
        },
        {
            name: 'Sewing Machine',
            imageUrl: sewingMachine,
        },
        {
            name: 'LAWMA Bills',
            imageUrl: lawmaBills,
        },
        {
            name: 'Repairs & Servicing',
            imageUrl: RepairsAndServicing,
        },
        {
            name: 'Staff Payment',
            imageUrl: StaffPayment,
        },
        {
            name: 'Bill Payment & Taxes',
            imageUrl: BillPaymentAndTaxes,
        },
        {
            name: 'Fuel/Diesel',
            imageUrl: fuelDiesel,
        },
    ];

    public handleExpenseRemoval(index: number) {
        this.$emit('expense-removed', index);
    }

    public handleExpenseSelection(selectedExpense: PictureSelectOptions, indexSelected: number) {
        this.$emit('expense-selected', selectedExpense, indexSelected);
    }

    public handleExpenseSelectionButtonClick() {
        this.$emit('add-new-expense-modal-btn-clicked');
    }

    @Prop({ default: () => ({}) }) readonly selectedExpenses!: Array<PictureSelectOptions>;
    @Prop() readonly id!: string;
}
</script>

<style lang="scss"></style>
