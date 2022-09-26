<template>
    <div class="ms-tablet-plus-index">
        <!-- Header -->
        <div class="ms-tablet-plus-index__header">
            <div v-if="saleDetails.customer">
                <span class="ms-tablet-plus-index__header--customer">
                    Customer:
                </span>
                {{ saleDetails.customer.name }}
            </div>
            <div v-else class="ms-tablet-plus-index__header--customer">
                Unnamed Customer
            </div>
            <div class="ms-tablet-plus-index__header--date">
                {{ saleDetails.transactionDate | fullDate }}
            </div>
        </div>

        <!-- Sales Info Cards -->
        <b-row class="m-0 cards">
            <b-col class="ms-tablet-plus-index__sales-info-card mr-4">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="ms-tablet-plus-index__sales-info-card--title">
                            Total Sale
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--body">
                            {{ saleDetails.totalAmount | amountWithCurrency }}
                        </p>
                        <p
                            class="ms-tablet-plus-index__sales-info-card--sub-text txt-grey-8"
                            v-if="userIsOnTabletPortrait"
                        >
                            <span v-if="hasVat">
                                VAT: <span class="txt-black bold ml-1">{{ vatMoney }}</span>
                            </span>
                            <span v-if="hasVatAndWht" class="mx-2"> | </span>
                            <span v-if="hasWht">
                                WHT: <span class="txt-black bold ml-1">({{ whtMoney }})</span>
                            </span>
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--sub-text" v-else>
                            <span class="txt-primary bold">{{ productCount }}</span>
                            <span class="txt-grey-8 ml-1">{{ productText }}</span>
                        </p>
                    </div>
                    <span class="ms-tablet-plus-index__sales-info-card--icon">
                        <img src="@/assets/img/carts.svg" />
                    </span>
                </div>
            </b-col>

            <b-col class="ms-tablet-plus-index__sales-info-card" v-if="!userIsOnTabletPortrait">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="ms-tablet-plus-index__sales-info-card--title">
                            Taxes
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--body">
                            {{ taxBalanceText }}
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--sub-text txt-grey-8">
                            <span v-if="hasVat">
                                VAT: <span class="txt-black bold ml-1">{{ vatMoney }}</span>
                            </span>
                            <span v-if="hasVatAndWht" class="mx-2"> | </span>
                            <span v-if="hasWht">
                                WHT: <span class="txt-black bold ml-1">({{ whtMoney }})</span>
                            </span>
                        </p>
                    </div>
                    <span class="ms-tablet-plus-index__sales-info-card--icon">
                        <img src="@/assets/img/tax-icon.svg" height="32px" />
                    </span>
                </div>
            </b-col>

            <b-col class="ms-tablet-plus-index__sales-info-card ml-4">
                <div class="d-flex justify-content-between">
                    <div>
                        <p class="ms-tablet-plus-index__sales-info-card--title">
                            Net Amount
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--body">
                            {{ netAmountText }}
                        </p>
                        <p class="ms-tablet-plus-index__sales-info-card--sub-text txt-grey-8">
                            <span v-if="hasAmountPaid">
                                Paid: <span class="txt-green bold ml-1">{{ amountPaidMoney }}</span>
                            </span>
                            <span v-if="hasPaymentAndBalance" class="mx-2"> | </span>
                            <span v-if="hasBalance">
                                Balance: <span class="txt-red bold ml-1">({{ balanceMoney }})</span>
                            </span>
                        </p>
                    </div>
                    <span class="ms-tablet-plus-index__sales-info-card--icon">
                        <img src="@/assets/img/piggy-vest.svg" />
                    </span>
                </div>
            </b-col>
        </b-row>

        <!-- Actions -->
        <div class="ms-tablet-plus-index__actions">
            <BasePrimaryButton
                class="mr-3"
                buttonText="Add Payment"
                :disabled="disableAddPaymentButton"
                @button-clicked="$emit('add-payment')"
            />

            <div class="ms-tablet-plus-index__actions--right">
                <BasePlainButton
                    buttonText="Generate Invoice"
                    class="ms-tablet-plus-index__actions--mr"
                    v-if="thereIsBalanceToBePaid"
                    :disabled="disableActionButtons"
                    :status="invoiceRequestStatus"
                    @button-clicked="generateDocument('INVOICE')"
                />
                <BasePlainButton
                    buttonText="Generate Receipt"
                    class="ms-tablet-plus-index__actions--mr"
                    :disabled="disableActionButtons"
                    :status="receiptRequestStatus"
                    @button-clicked="generateDocument('RECEIPT')"
                />
                <BaseActionButton
                    buttonText="More"
                    actionsContainerClass="ms-tablet-plus-index__actions--more"
                    :disabled="disableActionButtons"
                    :actions="moreActions"
                    @duplicate-transaction="$emit('duplicate-sale')"
                    @edit-initial-sale="editInitialTransaction"
                />
            </div>
        </div>

        <!-- The toggle section of items, payments and delivery -->
        <section class="ms-tablet-plus-index__mid-section">
            <ul class="ms-tablet-plus-index__mid-section-toggle-list">
                <li
                    @click="handleTabSwitch('products')"
                    :class="[
                        activeTab === 'products' ? 'highlight' : '',
                        'ms-tablet-plus-index__mid-section-item pointer',
                    ]"
                >
                    Products
                </li>
                <li
                    @click="handleTabSwitch('payments')"
                    :class="[
                        activeTab === 'payments' ? 'highlight' : '',
                        'ms-tablet-plus-index__mid-section-item pointer',
                    ]"
                >
                    Payments
                </li>
                <template v-if="false">
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

import ProductsListTable from '@/pages/Sales/ManageSales/TabletPlus/ProductsListTable.vue';
import PaymentsListTable from '@/pages/Sales/ManageSales/TabletPlus/PaymentsListTable.vue';
import SupplyListTable from '@/pages/Sales/ManageSales/TabletPlus/SupplyListTable.vue';
import EditProduct from '@/pages/Sales/ManageSales/TabletPlus/EditProduct.vue';
import ProductSummaryPage from '@/pages/Sales/ProductSummaryPage.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import SalesMixin from '@/pages/Sales/SalesMixin';
import UtilityMixins from '@/mixins/Utility';

import { DocumentPreviewType, TaxForms } from '@/pages/Sales/types';
import { Status } from '@/types';

@Component({
    components: {
        ProductsListTable,
        PaymentsListTable,
        SupplyListTable,
        EditProduct,
        ProductSummaryPage,
    },
})
export default class TabletPlusIndex extends Mixins(UtilityMixins, DynamicComponentMixin, SalesMixin) {
    private componentsList = [ProductsListTable, PaymentsListTable, SupplyListTable];

    private moreActions = [
        { name: 'Duplicate Transaction', event: 'duplicate-transaction' },
        { name: 'Edit Initial Sale', event: 'edit-initial-sale' },
        { name: 'Cancel Sale', event: 'cancel-sale' },
    ];

    private whtPercent = 0.1;

    private documentBeingGenerated = '';

    get disableActionButtons(): boolean {
        return this.salesRequestStatus.generatePdf === Status.LOADING;
    }

    get customerName() {
        const customerName = this.saleDetails.customer?.name;
        return customerName ? customerName : 'Unnamed Customer';
    }

    get productCount() {
        return this.saleDetails.products.length;
    }

    get productText() {
        return this.productCount == 1 ? 'Product' : 'Products';
    }

    get vatAmount(): number {
        return this.saleDetails.products.reduce((sum, current) => sum + current.vat, 0);
    }

    get vatMoney(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency({ amount: this.vatAmount, currencyKey });
    }

    get whtAmount(): number {
        if (!this.hasWht) return 0;
        return Number(this.saleDetails.totalAmount.amount) * this.whtPercent;
    }

    get whtMoney(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency({ amount: this.whtAmount, currencyKey });
    }

    get hasVat(): boolean {
        return this.vatAmount > 0;
    }

    get hasWht(): boolean {
        const { withholdingTax } = this.saleDetails;
        if (!withholdingTax) return false;

        return withholdingTax.name != TaxForms.NONE;
    }

    get hasVatAndWht(): boolean {
        return this.hasVat && this.hasWht;
    }

    get taxBalanceText(): string {
        const balance = this.vatAmount - this.whtAmount;
        const amount = Math.abs(balance);
        const { currencyKey } = this.saleDetails.totalAmount;
        const formattedBalance = this.$options.filters.amountWithCurrency({ amount, currencyKey });

        if (balance > 0) return formattedBalance;

        return '(' + formattedBalance + ')';
    }

    get netAmount(): number {
        const { amount } = this.saleDetails.totalAmount;
        return Number(amount) + this.vatAmount - this.whtAmount;
    }

    get netAmountText(): string {
        const { currencyKey } = this.saleDetails.totalAmount;
        return this.$options.filters.amountWithCurrency({ amount: this.netAmount, currencyKey });
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

    get thereIsBalanceToBePaid(): boolean {
        return this.saleDetails.balance.amount > 0;
    }

    get salesBalance(): number {
        return Number(this.saleDetails.balance.amount);
    }

    get documentType(): string {
        if (!this.thereIsBalanceToBePaid) {
            return DocumentPreviewType.RECEIPT;
        }

        if (this.saleDetails.amountPaid.amount > 0) {
            return DocumentPreviewType.INVOICE;
        }

        return DocumentPreviewType.ESTIMATE;
    }

    get disableAddPaymentButton(): boolean {
        return !this.thereIsBalanceToBePaid || this.salesRequestStatus.generatePdf === Status.LOADING;
    }

    get invoiceRequestStatus() {
        return this.documentBeingGenerated === DocumentPreviewType.INVOICE ? this.salesRequestStatus.generatePdf : '';
    }

    get receiptRequestStatus() {
        return this.documentBeingGenerated === DocumentPreviewType.RECEIPT ? this.salesRequestStatus.generatePdf : '';
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

    private editInitialTransaction() {
        const { saleKey } = this.$route.params;

        this.$router.push({ name: 'Edit-Sale-Record', params: { saleKey } });
    }

    private generateDocument(documentType: DocumentPreviewType) {
        this.documentBeingGenerated = documentType;
        this.$emit('generate-document', documentType);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/manage-sales/tablet-plus.scss';
</style>
