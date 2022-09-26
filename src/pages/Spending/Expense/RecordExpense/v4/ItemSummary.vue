<template>
    <div>
        <div class="expense-item-summary">
            <div class="expense-item-summary__header">
                <span class="expense-item-summary__header--title">Item Summary</span>
                <span class="expense-item-summary__header--edit d-none" @click="goBackToItemList"><i>Edit</i></span>
            </div>

            <div class="expense-item-summary__body">
                <div v-for="(item, index) in selectedItems" :key="index" class="expense-item-summary__desktop">
                    <b-row class="expense-item-summary__item">
                        <b-col cols="4" class="pr-1 pl-1">
                            <p class="expense-item-summary__item--name">
                                {{ item.expenseItemDetails.name }}
                            </p>
                            <p class="expense-item-summary__item--txt-small">
                                <i>{{ item.expenseItemDetails.description }}</i>
                            </p>
                        </b-col>
                        <b-col cols="3" class="p-0">
                            <p class="expense-item-summary__item--amount">
                                {{ item.expenseItemDetails.amount | amountWithCurrency }}
                            </p>
                            <p class="expense-item-summary__item--txt-small">
                                {{ itemBreakdown(item) }}
                            </p>
                        </b-col>
                        <b-col class="p-0">
                            <i :class="[itemDeliveryClass(item)]">
                                {{ itemDeliveryStatus(item) }}
                            </i>
                        </b-col>
                        <b-col class="expense-item-summary__right">
                            <span class="expense-item-summary__item--edit">
                                <i
                                    class="pointer mr-3"
                                    title="Edit item"
                                    @click="$emit('edit-selected-item', index, item)"
                                >
                                    Edit
                                </i>
                                |
                            </span>
                            <span
                                class="expense-item-summary__item--delete"
                                title="Delete item"
                                @click="$emit('delete-item-from-list', index)"
                            >
                                <font-awesome-icon icon="trash-alt" />
                            </span>
                        </b-col>
                    </b-row>
                </div>

                <div class="expense-item-summary__mobile">
                    <div v-for="(item, index) in selectedItems" :key="index" class="expense-item-summary__item--mobile">
                        <div class="d-flex justify-content-between">
                            <p class="p-0 mb-1">
                                <span class="mr-2">
                                    {{ item.expenseItemDetails.name }} x {{ item.expenseItemDetails.quantity }}
                                </span>
                                |<span class="expense-item-summary__item--edit">
                                    <i class="ml-2" @click="$emit('edit-selected-item', index, item)">
                                        Edit
                                    </i>
                                </span>
                            </p>
                            <span
                                class="expense-item-summary__item--delete"
                                @click="$emit('delete-item-from-list', index)"
                            >
                                <font-awesome-icon icon="trash-alt" />
                            </span>
                        </div>

                        <div :class="[itemDeliveryClass(item), 'd-flex justify-content-between']">
                            <span class="expense-item-summary__item--amount">
                                {{ item.expenseItemDetails.amount | amountWithCurrency }}
                            </span>
                            <i class="expense-item-summary__mobile--status">
                                {{ itemDeliveryStatus(item) }}
                            </i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="expense-item-summary__footer" v-if="!hasPartPayment">
                <BaseSecondaryButton
                    class="expense-item-summary__footer--button"
                    buttonText="Add Another Item"
                    @button-clicked="$emit('add-another-item')"
                />
            </div>
        </div>

        <b-row class="expense-item-summary__bottom">
            <b-col v-if="!userIsOnMobile" cols="5" class="expense-item-summary__bottom--info">
                <span v-if="vendorSelected">
                    <p>5% Withholding tax applies to Companies</p>
                    <p>10% Withholding tax applies to Individuals / Partnerships</p>
                </span>

                <span v-else>
                    <p>Kindly select a vendor to enable part payment or deduction of withholding tax</p>
                </span>
            </b-col>

            <b-col class="expense-item-summary__bottom--total">
                <TaxAndTotal
                    :functionalCurrency="functionalCurrency"
                    :updateTaxOptions="updateTaxOptions"
                    :selectedItemsTaxOptions="selectedItemsTaxOptions"
                    :totalAmount="totalAmount"
                    :disableTaxOptions="!vendorSelected"
                    @update-tax-options="$emit('update-tax-options', $event)"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import TaxAndTotal from '@/pages/Spending/Expense/RecordExpense/v4/TaxAndTotal.vue';

import {
    SelectedItemDetails,
    SelectedItemsTotalAmount,
    ItemTaxOptions,
    defaultTaxOptions,
    ExpensePaymentDetails,
} from '@/pages/Spending/Expense/RecordExpense/v4/types';
import { Vendor, defaultVendor } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import ExpenseModule from '@/store/modules/expense';

const expenses = namespace('expense');

let expenseModule: ExpenseModule;

@Component({ components: { TaxAndTotal } })
export default class ItemSummary extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly functionalCurrency!: number;
    @Prop({ required: true }) readonly selectedItems!: SelectedItemDetails[];
    @Prop({ required: true }) readonly totalAmount!: SelectedItemsTotalAmount;
    @Prop({ default: () => defaultVendor }) readonly selectedVendor!: Vendor;
    @Prop({ default: false }) readonly updateTaxOptions!: boolean;
    @Prop({ default: () => defaultTaxOptions }) readonly selectedItemsTaxOptions!: ItemTaxOptions;

    @expenses.State
    private previousStateOfPaymentForm!: ExpensePaymentDetails;

    get hasPartPayment(): boolean {
        return this.previousStateOfPaymentForm?.hasPartialPayment;
    }

    get vendorSelected() {
        return this.selectedVendor.name.length > 0;
    }

    private itemDeliveryStatus(item: SelectedItemDetails): string {
        const { quantity, quantityReceived } = item.expenseItemDetails;
        if (quantity === quantityReceived) return 'Delivered';
        return quantityReceived > 0 ? 'Partial Delivery' : 'Not Delivered';
    }

    private itemDeliveryClass(item: SelectedItemDetails): string {
        const baseClass = 'expense-item-summary__item';
        const deliveryStatus = this.itemDeliveryStatus(item);
        if (deliveryStatus.toLowerCase() === 'delivered') return `${baseClass}--delivered`;
        if (deliveryStatus.toLowerCase() === 'partial delivery') return `${baseClass}--partial`;
        return `${baseClass}--pending`;
    }

    private itemBreakdown(item: SelectedItemDetails): string {
        const { quantity, amount, measurementType } = item.expenseItemDetails;
        const unitCost = amount.amount / quantity;
        const currencyKey = amount.currencyKey;
        const formattedAmount = this.$options.filters.amountWithCurrency({ currencyKey, amount: unitCost });
        return `${quantity} x ${formattedAmount} / ${measurementType}`;
    }

    private goBackToItemList() {
        this.$emit('back-to-item-list');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/item-summary-page';
</style>
