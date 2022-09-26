<template>
    <div class="manage-expense-mobile">
        <div class="manage-expense-mobile__top-section">
            <div class="manage-expense-mobile__vendor">
                <CustomerHeader :customerName="vendorName" />
            </div>

            <div class="manage-expense-mobile__tx-date">
                {{ expenseDetails.transactionDate | fullDate }}
            </div>

            <div class="manage-expense-mobile__stats">
                <div class="manage-expense-mobile__split-between">
                    <div class="manage-expense-mobile__space-bottom">
                        <p>Total Expense</p>
                        <p class="txt-grey-8 txt-12" v-if="expenseDetails.vatAmount">VAT</p>
                        <p class="txt-grey-8 txt-12" v-if="expenseDetails.withholdingTaxAmount">WHT</p>
                        <p>Net Amount</p>
                    </div>
                    <div class="manage-expense-mobile__stats--right manage-expense-mobile__space-bottom">
                        <p>{{ expenseDetails.totalCost | amountWithCurrency2 }}</p>
                        <p class="txt-grey-8 txt-14" v-if="expenseDetails.vatAmount">
                            {{ expenseDetails.vatAmount | amountWithCurrency }}
                        </p>
                        <p class="txt-grey-8 txt-14" v-if="expenseDetails.withholdingTaxAmount">
                            {{ expenseDetails.withholdingTaxAmount | amountWithCurrency }}
                        </p>
                        <p>{{ netAmount }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="manage-expense-mobile__split-between mb-4">
            <BasePrimaryButton
                class="mr-3"
                buttonText="Add Payment"
                :disabled="disableAddPaymentButton"
                @button-clicked="$emit('add-payment')"
            />

            <BaseActionButton
                buttonText="More"
                actionsContainerClass="manage-expense-mobile__more-actions"
                :actions="moreActions"
                :disabled="requestsInProgress"
                @duplicate-transaction="duplicateTransaction"
                @edit-initial-transaction="editInitialTransaction"
                @cancel-expense="$emit('cancel-expense')"
            />
        </div>

        <!-- The toggle section of items, payments and delivery -->
        <section class="manage-expense-index__mid-section">
            <ul class="manage-expense-index__mid-section-toggle-list" v-if="false">
                <li
                    @click="handleTabSwitch('products')"
                    :class="[activeTab === 'products' ? 'highlight' : '', 'manage-expense-index__mid-section-item']"
                >
                    Products
                </li>
                <li
                    @click="handleTabSwitch('payments')"
                    :class="[activeTab === 'payments' ? 'highlight' : '', 'manage-expense-index__mid-section-item']"
                >
                    Payments
                </li>
                <li
                    @click="handleTabSwitch('supply')"
                    :class="[activeTab === 'supply' ? 'highlight' : '', 'manage-expense-index__mid-section-item']"
                >
                    Supply
                </li>
            </ul>
            <transition name="fade" mode="out-in">
                <component
                    :is="componentsList[activeComponentIndex]"
                    :expenseType="expenseType"
                    @go-to-update-supply-page="goToUpdateSupplyPage"
                />
            </transition>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import CustomerHeader from '@/components/ui/CustomerHeader.vue';
import ProductsList from '@/pages/Spending/Expense/ManageExpense/Mobile/ProductsList.vue';
import PaymentsList from '@/pages/Spending/Expense/ManageExpense/Mobile/PaymentsList.vue';
import SupplyList from '@/pages/Spending/Expense/ManageExpense/Mobile/SupplyList.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

@Component({
    components: {
        CustomerHeader,
    },
})
export default class ManageExpenseMobileIndex extends Mixins(ExpenseMixin, DynamicComponentMixin) {
    @Prop({ default: 'general' }) expenseType!: string;

    private optionsToggleIsClicked = false;
    private activeTab = 'products';

    private componentsList = [ProductsList, PaymentsList, SupplyList];

    get isSalary(): boolean {
        return this.expenseType == 'salary';
    }

    private handleTabSwitch(tab: string) {
        this.activeTab = tab;
        let index = 0;
        if (tab === 'products') {
            index = 0;
        }
        if (tab === 'payments') {
            index = 1;
        }
        if (tab === 'supply') {
            index = 2;
        }
        this.$nextTick(() => {
            this.setActiveComponentIndex(index);
        });
    }

    private goToUpdateSupplyPage() {
        this.$nextTick(() => {
            this.setActiveComponentIndex(1);
        });
    }

    private toggleOptions() {
        this.optionsToggleIsClicked = !this.optionsToggleIsClicked;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-expense/mobile.scss';

.manage-expense-index {
    &__top-section {
        margin: -55px -15px 15px;
        padding: 53px 15px 14px;
        background-color: $primary-white;
    }
    &__update-supply-item-name {
        color: $primary-color;
        font-size: 14px;
        margin-bottom: 15px;
    }
    &__date-section {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    &__calendar-icon {
        margin-right: 5px;
    }
    &__split-between {
        display: flex;
        justify-content: space-between;
    }
    &__text {
        &--grey {
            color: $dark-grey-1;
            font-size: 12px;
        }
        &--black {
            color: $primary-black;
            font-size: 14px;
        }
    }
    &__balance-text {
        font-weight: 700;
    }
    &__button-container {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;
    }
    &__options-toggle-section {
        position: relative;
    }
    &__toggle-options-container {
        position: absolute;
        right: 0;
        top: -10px;
        z-index: 2;
    }
    &__toggle-option {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
    }
    &__toggle-option-text {
        font-size: 14px;
        line-height: 17px;
        color: $primary-color;
        background-color: $primary-white;
        box-shadow: $box-shadow-2;
        border-radius: 3px;
        padding: 5px 12px;
        text-align: center;
        flex-basis: 80%;
    }
    &__toggle-option-icon {
        box-shadow: $box-shadow-2;
        background-color: $primary-white;
        border-radius: 50%;
        padding: 10px;
        flex: 1;
        margin-left: 13px;
    }
    &__options-toggle {
        position: fixed;
        top: 50%;
        transform: translateY(50%);
        right: 7px;
        z-index: 2;
    }
    &__mid-section-toggle-list {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $light-grey-5;
        margin-bottom: 0;
    }
    &__mid-section-item {
        font-size: 16px;
        position: relative;
        width: 33.333%;
        text-align: center;
        padding: 7px;
        &.highlight {
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                background-color: $primary-color;
                width: 100%;
                height: 2px;
                left: 0;
            }
        }
    }
    &__mid-section-text {
        &--black {
            color: $primary-black;
        }
        &--blue {
            color: $primary-color;
            font-size: 12px;
        }
        &--grey {
            &::after {
                background-color: $primary-green;
            }
        }
        &--red {
            &::after {
                background-color: $notification-red;
            }
        }
        &--yellow {
            &::after {
                background-color: $primary-yellow;
            }
        }
        &--grey,
        &--yellow,
        &--red {
            color: $dark-grey-1;
            position: relative;
            &::after {
                content: '';
                width: 9px;
                height: 9px;
                border-radius: 50%;
                position: absolute;
                right: -13px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        &--black,
        &--grey {
            font-size: 14px;
        }
    }
    &__status-text {
        &--yellow,
        &--red,
        &--green {
            font-size: 14px;
            text-align: right;
        }
        &--yellow {
            color: $primary-yellow;
        }
        &--red {
            color: $notification-red;
        }
        &--green {
            color: $primary-green;
        }
    }
}
</style>
