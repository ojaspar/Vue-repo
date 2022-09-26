<template>
    <div class="manage-sale-mobile">
        <div class="manage-sale-mobile__customer-header-container">
            <CustomerHeader :customerName="customerName" />
        </div>

        <div class="manage-sale-mobile__tx-date">
            {{ saleDetails.transactionDate | fullDate }}
        </div>

        <div class="manage-sale-mobile__sales-stats">
            <div class="manage-sale-mobile__split-between">
                <div class="manage-sale-mobile__space-bottom">
                    <p>Total Sale</p>
                    <p class="txt-grey-8 txt-12" v-if="hasVat">VAT</p>
                    <p class="txt-grey-8 txt-12" v-if="hasWht">WHT</p>
                    <p>Net Amount</p>
                    <p class="txt-grey-8 txt-12" v-if="hasAmountPaid">Amount Paid</p>
                    <p class="txt-grey-8 txt-12" v-if="hasBalance">Balance Remaining</p>
                </div>
                <div class="manage-sale-mobile__sales-stats--right manage-sale-mobile__space-bottom">
                    <p>{{ saleDetails.totalAmount | amountWithCurrency2 }}</p>
                    <p class="txt-grey-8 txt-14" v-if="hasVat">{{ vatMoney }}</p>
                    <p class="txt-grey-8 txt-14" v-if="hasWht">{{ whtMoney }}</p>
                    <p>{{ netAmountText }}</p>
                    <p class="txt-green txt-14" v-if="hasAmountPaid">
                        {{ saleDetails.amountPaid | amountWithCurrency2 }}
                    </p>
                    <p class="txt-red txt-14" v-if="hasBalance">{{ saleDetails.balance | amountWithCurrency2 }}</p>
                </div>
            </div>
        </div>

        <div class="manage-sale-mobile__split-between mt-4 mb-4">
            <BasePrimaryButton
                :disabled="disableAddPaymentButton"
                buttonText="Add Payment"
                className="manage-sale-mobile__button"
                @button-clicked="$emit('add-payment')"
            />
            <BaseActionButton
                buttonText="Actions"
                actionsContainerClass="manage-sale-mobile__actions"
                :status="salesRequestStatus.generatePdf"
                :actions="moreActions"
                :showLoaderIcon="true"
                @generate-invoice="$emit('generate-document', 'INVOICE')"
                @generate-receipt="$emit('generate-document', 'RECEIPT')"
                @duplicate-transaction="$emit('duplicate-sale')"
                @edit-initial-sale="editInitialTransaction"
            />
        </div>

        <!-- The toggle section of items, payments and delivery -->
        <section class="manage-sale-mobile__mid-section">
            <ul class="manage-sale-mobile__mid-section-toggle-list" v-if="false">
                <li
                    @click="handleTabSwitch('products')"
                    :class="[activeTab === 'products' ? 'highlight' : '', 'manage-sale-mobile__mid-section-item']"
                >
                    Products
                </li>
                <li
                    @click="handleTabSwitch('payments')"
                    :class="[activeTab === 'payments' ? 'highlight' : '', 'manage-sale-mobile__mid-section-item']"
                >
                    Payments
                </li>
                <li
                    @click="handleTabSwitch('supply')"
                    :class="[activeTab === 'supply' ? 'highlight' : '', 'manage-sale-mobile__mid-section-item']"
                >
                    Supply
                </li>
            </ul>
            <transition name="fade" mode="out-in">
                <component
                    :is="componentsList[activeComponentIndex]"
                    @go-to-update-supply-page="goToUpdateSupplyPage"
                />
            </transition>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import CustomerHeader from '@/components/ui/CustomerHeader.vue';
import ProductsList from '@/pages/Sales/ManageSales/Mobile/ProductsList.vue';
import PaymentsList from '@/pages/Sales/ManageSales/Mobile/PaymentsList.vue';
import SupplyList from '@/pages/Sales/ManageSales/Mobile/SupplyList.vue';

import SaleModule from '@/store/modules/sale';

import SalesMixin from '@/pages/Sales/SalesMixin';
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import { Status } from '@/types';
import { TaxForms } from '@/pages/Sales/types';

let saleModule: SaleModule;

@Component({
    components: {
        CustomerHeader,
    },
})
export default class ManageSalesMobileIndex extends Mixins(SalesMixin, DynamicComponentMixin) {
    private optionsToggleIsClicked = false;
    private whtPercent = 0.1;

    private componentsList = [ProductsList, PaymentsList, SupplyList];

    get customerName() {
        const customerName = this.saleDetails.customer?.name;
        return customerName ? customerName : 'Unnamed Customer';
    }

    get disableAddPaymentButton(): boolean {
        return !this.thereIsBalanceToBePaid || this.salesRequestStatus.generatePdf === Status.LOADING;
    }

    get moreActions() {
        const moreActions = [
            { name: 'Generate Invoice', event: 'generate-invoice' },
            { name: 'Generate Receipt', event: 'generate-receipt' },
            { name: 'Duplicate Transaction', event: 'duplicate-transaction' },
            { name: 'Edit Initial Sale', event: 'edit-initial-sale' },
            { name: 'Cancel Sale', event: 'cancel-sale' },
        ];
        if (this.thereIsBalanceToBePaid) {
            return moreActions;
        }
        moreActions.splice(0, 1);
        return moreActions;
    }

    get vatAmount(): number {
        return this.saleDetails.products.reduce((sum, current) => sum + current.vat, 0);
    }

    get vatMoney(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency2({ amount: this.vatAmount, currencyKey });
    }

    get whtAmount(): number {
        if (!this.hasWht) return 0;
        return Number(this.saleDetails.totalAmount.amount) * this.whtPercent;
    }

    get whtMoney(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency2({ amount: this.whtAmount, currencyKey });
    }

    get hasVat(): boolean {
        return this.vatAmount > 0;
    }

    get hasWht(): boolean {
        const { withholdingTax } = this.saleDetails;
        if (!withholdingTax) return false;

        return withholdingTax.name != TaxForms.NONE;
    }

    get netAmount(): number {
        const { amount } = this.saleDetails.totalAmount;
        return Number(amount) + this.vatAmount - this.whtAmount;
    }

    get netAmountText(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency2({ amount: this.netAmount, currencyKey });
    }

    get amountPaid(): number {
        return Number(this.saleDetails.amountPaid.amount);
    }

    get hasAmountPaid(): boolean {
        return this.amountPaid > 0;
    }

    get amountPaidMoney(): string {
        return this.$options.filters.amountWithCurrency(this.saleDetails.amountPaid);
    }

    get balanceAmount(): number {
        return this.netAmount - this.amountPaid;
    }

    get hasBalance(): boolean {
        return this.balanceAmount > 0;
    }

    get balanceMoney(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency({ amount: this.balanceAmount, currencyKey });
    }

    get hasPaymentAndBalance(): boolean {
        return this.hasAmountPaid && this.hasBalance;
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

    private editInitialTransaction() {
        const { saleKey } = this.$route.params;
        this.$router.push({ name: 'Edit-Sale-Record', params: { saleKey } });
    }

    async mounted() {
        const saleKey = this.$route.params.saleKey;
        saleModule = getModule(SaleModule, this.$store);

        await saleModule.getSaleDetails(saleKey);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/manage-sales/mobile.scss';
</style>
