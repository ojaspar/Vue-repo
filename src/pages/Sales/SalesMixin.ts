import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { DashboardHeader, SaleRequestStatus, PaymentAccount } from '@/types';
import {
    SaleDetails,
    ProductInProductDetailsForm,
    AdditionalPayment,
    TaxForms,
    ProductSummary,
} from '@/pages/Sales/types';

import SaleModule from '@/store/modules/sale';

import CurrencyMixins from '@/mixins/currency';
import SalesValidationMixin from '@/pages/Sales/ManageSales/ManageSaleValidationMixin';

const sale = namespace('sale');
let saleModule: SaleModule;

@Component
class SalesMixin extends Mixins(CurrencyMixins, SalesValidationMixin) {
    @sale.State
    public saleDetails!: SaleDetails;

    @sale.State
    public salesRequestStatus!: SaleRequestStatus;

    @sale.State
    public paymentAccounts!: Array<PaymentAccount>;

    @sale.State
    public errorMessage!: string;

    public activeTab = 'products';

    private readonly paymentDetailsHeaders: Array<DashboardHeader> = [
        {
            text: 'Amount',
        },
        {
            text: 'Payment Type',
        },
        {
            text: 'Date',
        },
    ];

    private arePaymentDetailsShowing = false;

    get icon() {
        const icon = this.arePaymentDetailsShowing ? 'chevron-up' : 'chevron-down';
        return icon;
    }

    get salesModule() {
        return saleModule;
    }

    get thereIsBalanceToBePaid(): boolean {
        return this.saleDetails.balance.amount > 0;
    }

    get customerName(): string {
        return this.saleDetails?.customer?.name || '';
    }

    get additionalPayments(): Array<AdditionalPayment> {
        return this.saleDetails.additionalPayments;
    }

    public togglePaymentDetails() {
        this.arePaymentDetailsShowing = !this.arePaymentDetailsShowing;
    }

    public conditionForPartialSupply(quantity: number, quantitySupplied: number) {
        return quantitySupplied < quantity;
    }

    public conditionForNotSupplied(quantitySupplied: number) {
        return quantitySupplied === 0;
    }

    public conditionForSupplied(quantity: number, quantitySupplied: number) {
        return quantitySupplied === quantity;
    }

    public supplyStatus(product: ProductInProductDetailsForm) {
        return this.getSupplyStatus(product.quantity, product.quantitySupplied);
    }

    public getSupplyStatus(quantity: number, quantitySupplied: number) {
        if (this.conditionForNotSupplied(quantitySupplied)) {
            return 'Not Supplied';
        }
        if (this.conditionForPartialSupply(quantity, quantitySupplied)) {
            return 'Partial Supply';
        }
        return 'Supplied';
    }

    public itemSummaryBreakdown(item: ProductSummary): string {
        const { quantity, unitPrice, measurementUnit } = item;

        if (!quantity) return '-';

        const currencyKey = unitPrice.currencyKey;
        const formattedAmount = this.$options.filters.amountWithCurrency({ currencyKey, amount: unitPrice.amount });

        return `${quantity} x ${formattedAmount} / ${measurementUnit}`;
    }

    public showSummaryDiscountText(item: ProductSummary): string {
        const { discount } = item;

        if (!discount?.amount) return '';

        return this.$options.filters.amountWithCurrency(discount);
    }

    public summaryDiscountText(item: ProductSummary): string {
        const { discount } = item;

        if (!discount) return '';

        return this.$options.filters.amountWithCurrency(discount);
    }

    public lineAmount(unitPrice: number, quantity: number, discount: number): number {
        return unitPrice * quantity - discount;
    }

    public calculateSupplyStatusTextClass(baseClass: string, product: ProductInProductDetailsForm) {
        let supplyStatusTextClass = '';

        if (this.conditionForNotSupplied(product.quantitySupplied)) {
            supplyStatusTextClass = `${baseClass}--red`;
        }
        if (this.conditionForSupplied(product.quantity, product.quantitySupplied)) {
            supplyStatusTextClass = `${baseClass}--green`;
        }
        if (this.conditionForPartialSupply(product.quantity, product.quantitySupplied)) {
            supplyStatusTextClass = `${baseClass}--yellow`;
        }
        return supplyStatusTextClass;
    }

    public totalExcludingDiscount(product: ProductInProductDetailsForm) {
        return Number(product.unitPrice.amount) * Number(product.quantity);
    }

    public productNetAmount(product: ProductInProductDetailsForm) {
        const { unitPrice, quantity, discount } = product;
        return Number(unitPrice.amount) * quantity - Number(discount.amount);
    }

    public currencySymbol(product: ProductInProductDetailsForm) {
        return this.getCurrencySymbolFromCurrencyKey(product.unitPrice.currencyKey.toString());
    }

    public goToSalesDashboard() {
        this.$router.push({ name: 'Sales' });
    }

    created() {
        saleModule = getModule(SaleModule, this.$store);
    }
}

export default SalesMixin;
