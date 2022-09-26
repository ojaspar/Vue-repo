<template>
    <div class="ms-tablet-plus-index">
        <!-- Header -->
        <div class="manage-expense__header">
            <div v-if="expenseDetails.vendor.name">
                <span class="manage-expense__header--vendor">
                    Vendor:
                </span>
                {{ expenseDetails.vendor.name }}
            </div>
            <div v-else class="manage-expense__header--vendor">
                Unnamed Vendor
            </div>
            <div class="manage-expense__header--date">
                {{ expenseDetails.transactionDate | fullDate }}
            </div>
        </div>

        <!-- Cards -->
        <div class="manage-expense__cards">
            <DashboardCard :item="item" v-for="(item, index) in dashboardStats" :key="index">
                <template v-if="index == 0" slot="card-bottom">
                    <p class="manage-expense__cards--bottom">1 Item</p>
                </template>

                <template v-if="index == 1" slot="card-bottom">
                    <p class="manage-expense__cards--bottom">
                        <span v-if="expenseDetails.vatAmount">
                            VAT :
                            <span class="text__black"> {{ expenseDetails.vatAmount | amountWithCurrency }} </span>
                        </span>
                        <span v-if="hasVatAndWht"> | </span> WHT:
                        <span class="text__black">
                            {{ expenseDetails.withholdingTaxAmount | amountWithCurrency }}
                        </span>
                    </p>
                </template>

                <template v-if="index == 2" slot="card-bottom">
                    <p class="manage-expense__cards--bottom">
                        Paid : <span class="text__green"> {{ expenseDetails.amountPaid | amountWithCurrency }} </span>
                        <span> | Balance: </span>
                        <span class="text__red">{{ expenseDetails.balance | amountWithCurrency }}</span>
                    </p>
                </template>
            </DashboardCard>
        </div>

        <div class="manage-expense__actions">
            <BasePrimaryButton
                class="mr-3"
                buttonText="Add Payment"
                :disabled="disableAddPaymentButton"
                @button-clicked="$emit('add-payment')"
            />

            <BaseActionButton
                buttonText="More"
                actionsContainerClass="manage-expense__actions--more"
                :actions="moreActions"
                :disabled="requestsInProgress"
                @duplicate-transaction="duplicateTransaction"
                @edit-initial-transaction="editInitialTransaction"
                @cancel-expense="$emit('cancel-expense')"
            />
        </div>

        <div class="manage-expense__transactions">
            <section class="ms-tablet-plus-index__mid-section">
                <ul class="ms-tablet-plus-index__mid-section-toggle-list" v-if="expenseHasVendor">
                    <li
                        @click="handleTabSwitch('items')"
                        :class="[
                            activeTab === 'items' ? 'highlight' : '',
                            'ms-tablet-plus-index__mid-section-item pointer',
                        ]"
                    >
                        Items
                    </li>
                    <template v-if="false">
                        <li
                            @click="handleTabSwitch('payments')"
                            :class="[
                                activeTab === 'payments' ? 'highlight' : '',
                                'ms-tablet-plus-index__mid-section-item pointer',
                            ]"
                        >
                            Payments
                        </li>
                        <li
                            @click="handleTabSwitch('supply')"
                            :class="[
                                activeTab === 'supply' ? 'highlight' : '',
                                'ms-tablet-plus-index__mid-section-item pointer',
                            ]"
                        >
                            Supply
                        </li>
                    </template>
                </ul>

                <transition name="fade" mode="out-in">
                    <component :is="componentsList[activeComponentIndex]" :expenseType="expenseType" />
                </transition>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import ProductsListTable from '@/pages/Spending/Expense/ManageExpense/TabletPlus/ProductsListTable.vue';
import PaymentsListTable from '@/pages/Spending/Expense/ManageExpense/TabletPlus/PaymentsListTable.vue';
import SupplyListTable from '@/pages/Spending/Expense/ManageExpense/TabletPlus/SupplyListTable.vue';
import EditProduct from '@/pages/Spending/Expense/ManageExpense/TabletPlus/EditProduct.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';
import UtilityMixins from '@/mixins/Utility';

@Component({
    components: {
        ProductsListTable,
        PaymentsListTable,
        SupplyListTable,
        EditProduct,
    },
})
export default class TabletPlusIndex extends Mixins(UtilityMixins, DynamicComponentMixin, ExpenseMixin) {
    @Prop({ default: 'general' }) expenseType!: string;

    private componentsList: Array<object> = [ProductsListTable, PaymentsListTable, SupplyListTable];
    private activeTab = 'items';

    get isSalary(): boolean {
        return this.expenseType == 'salary';
    }

    get dashboardStats() {
        return [
            {
                title: `Total Expense`,
                midSection: this.$options.filters.amountWithCurrency(this.expenseDetails.totalCost),
                icon: require('@/assets/img/carts.svg'),
                meta: {},
                cssClass: 'manage-expense__cards--total',
            },
            {
                title: 'Taxes',
                midSection: this.totalTax,
                icon: require('@/assets/img/payment-card.svg'),
                meta: {},
                cssClass: 'manage-expense__cards--taxes',
            },
            {
                title: 'Net Amount',
                midSection: this.netAmount,
                icon: require('@/assets/img/piggy-vest.svg'),
                meta: {},
                cssClass: 'manage-expense__cards--net',
            },
        ];
    }

    private handleTabSwitch(tab: string) {
        this.activeTab = tab;
        let index = 0;

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
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-expense/tablet-plus.scss';

.ms-tablet-plus-index {
    &__mid-section-table-header {
        background: #ebeff3;
        font-size: 14px;
        font-weight: 600;
        height: 34px;
        display: flex;
        align-items: center;
        @include media-breakpoint-down(md) {
            > * {
                padding: 0 5px;
            }
        }
    }
    &__mid-section-table-body {
        padding: 13px 0;
        font-size: 14px;
        border-bottom: 1px solid $faint-grey;
        @include media-breakpoint-down(md) {
            font-size: 13px;
            > * {
                padding: 0 5px;
            }
        }
    }
    &__mid-section-toggle-list {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $light-grey-5;
        margin-bottom: 20px;
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
}
</style>
