<template>
    <div>
        <div class="product-summary-page__section--xl">
            <!-- Desktop screen -->
            <template v-if="userIsOnDesktop">
                <div class="product-summary-page__table">
                    <ProductSummaryHeader
                        :isFullProductSummaryPage="isFullProductSummaryPage"
                        :isEstimate="isEstimate"
                    />
                    <div class="product-summary-page__row-container">
                        <ProductSummaryRow
                            :isFullProductSummaryPage="isFullProductSummaryPage"
                            v-for="(productSummary, index) in productSummaries"
                            :key="index"
                            :index="index"
                            :productSummary="productSummary"
                            :isEstimate="isEstimate"
                            @edit-sale-item="handleEditSale"
                            @delete-sale-item="handleDeleteModal"
                        />
                    </div>
                    <BaseButton
                        buttonText="Add Another Product"
                        class="product-summary-page__add-new-item-btn product-summary-page__add-new-item-btn--xl"
                        @button-clicked="$emit('add-another-product-button-clicked')"
                        :overRideButtonClass="true"
                        v-if="isFullProductSummaryPage"
                    >
                        <CircularPlusSign />
                    </BaseButton>
                </div>

                <!-- Product Summary Form Estimate Desktop -->
                <b-row
                    class="product-summary-page__summary-details-form-section"
                    v-if="isFullProductSummaryPage && isEstimate"
                >
                    <b-col class="col-xl-4"
                        ><BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Date Issued"
                            v-model="estimateForm.dateIssued"
                    /></b-col>

                    <b-col>
                        <BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Notes"
                            v-model="estimateForm.notes"
                        />
                    </b-col>
                </b-row>

                <!-- Sales Section -->
                <b-row
                    class="product-summary-page__summary-details-form-section"
                    v-if="isFullProductSummaryPage && !isEstimate"
                >
                    <b-col
                        ><BaseInputFieldWithBorderAndFloatingLabel
                            floatingLabelText="Amount Paid"
                            :value="amountPaidText"
                            :disabled="transactionWithoutCustomer"
                            :errors="salesFormError.amountPaid"
                            @input="formatAndValidateAmountPaid"
                    /></b-col>
                    <b-col
                        ><BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Transaction Date"
                            :value="salesForm.transactionDate"
                            :errors="salesFormError.transactionDate"
                            @change="handleTransactionDateField"
                    /></b-col>
                    <b-col
                        ><BaseSelectWithBorderAndFloatingLabel
                            floatingLabelText="Paid To"
                            keyProperty="paymentAccountKey"
                            valueProperty="paymentAccountKey"
                            defaultOptionText="-- Select Account --"
                            textProperty="displayNameWithBalance"
                            :options="updatedPaymentAccounts"
                            :errors="salesFormError.paymentAccountKey"
                            @change="handlePaymentAccountSelection"
                            v-model="salesForm.paymentAccountKey"
                    /></b-col>
                    <b-col
                        ><BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="Balance Due Date"
                            :value="salesForm.balanceDueDate"
                            :errors="salesFormError.balanceDueDate"
                            :disabled="disableBalanceDueDate"
                            @change="handleBalanceDueDateField"
                    /></b-col>
                </b-row>
            </template>

            <!-- Product Summary Form Mobile-->
            <template v-else>
                <!-- Mobile screen -->
                <ProductSummaryRowMobileAndMedium
                    v-for="(productSummary, index) in productSummaries"
                    :key="index"
                    :index="index"
                    :productSummary="productSummary"
                    :clickedProductSummaryIndex="clickedProductSummaryIndex"
                    :isEstimate="isEstimate"
                    @toggle-visibility="handleProductSummaryVisibility"
                    @edit-sale-item="handleEditSale"
                    @delete-sale-item="handleDeleteModal"
                />
                <BaseButton
                    buttonText="Add Another Product"
                    class="product-summary-page__add-new-item-btn"
                    :overRideButtonClass="true"
                    @button-clicked="$emit('add-another-product-button-clicked')"
                >
                    <CircularPlusSign />
                </BaseButton>
                <div class="product-summary-page__summary-details-form-section">
                    <b-row>
                        <b-col
                            ><BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="
                                    wrapFloatingLabelTextWithCurrencySymbol('Total', productSummaryPageCurrencyKey)
                                "
                                disabled="true"
                                :value="convertFigureToCurrency(totalAmount)"
                        /></b-col>
                    </b-row>

                    <template v-if="isEstimate">
                        <b-row>
                            <b-col
                                ><BaseDateFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Date Issued"
                                    v-model="estimateForm.dateIssued"
                                    :errors="salesFormError.dateIssued"
                            /></b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <BaseTextAreaWithBorderAndFloatingLabel
                                    floatingLabelText="Notes"
                                    v-model="estimateForm.notes"
                                />
                            </b-col>
                        </b-row>
                    </template>

                    <!-- Sales Section -->
                    <template v-else>
                        <b-row>
                            <b-col>
                                <BaseDateFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Transaction Date"
                                    :value="salesForm.transactionDate"
                                    :errors="salesFormError.transactionDate"
                                    @input="handleTransactionDateField"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    :floatingLabelText="
                                        wrapFloatingLabelTextWithCurrencySymbol(
                                            'Amount Paid',
                                            productSummaryPageCurrencyKey,
                                        )
                                    "
                                    :value="amountPaidText"
                                    :disabled="transactionWithoutCustomer"
                                    :errors="salesFormError.amountPaid"
                                    @input="formatAndValidateAmountPaid"
                                />
                            </b-col>
                            <b-col>
                                <BaseSelectWithBorderAndFloatingLabel
                                    floatingLabelText="Paid To"
                                    keyProperty="paymentAccountKey"
                                    valueProperty="paymentAccountKey"
                                    textProperty="displayNameWithBalance"
                                    defaultOptionText="-- Select Account --"
                                    :options="updatedPaymentAccounts"
                                    :errors="salesFormError.paymentAccountKey"
                                    @change="handlePaymentAccountSelection"
                                    v-model="salesForm.paymentAccountKey"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col
                                ><BaseInputFieldWithBorderAndFloatingLabel
                                    :floatingLabelText="
                                        wrapFloatingLabelTextWithCurrencySymbol(
                                            'Balance',
                                            productSummaryPageCurrencyKey,
                                        )
                                    "
                                    disabled="true"
                                    :value="mobileBalanceText"
                            /></b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <BaseDateFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Balance Due Date"
                                    :value="salesForm.balanceDueDate"
                                    :errors="salesFormError.balanceDueDate"
                                    @input="handleBalanceDueDateField"
                                    :disabled="disableBalanceDueDate"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <BaseButton
                                buttonText="Preview"
                                class="product-summary-page__submit-btn ml-auto mr-auto"
                                :overRideButtonClass="true"
                                v-if="isEstimate"
                                @button-clicked="handleEstimatePreview"
                            />
                            <BaseButton
                                buttonText="Submit"
                                class="product-summary-page__submit-btn ml-auto mr-auto"
                                :overRideButtonClass="true"
                                :status="salesRequestLoadingStatus"
                                :disabled="!salesFormIsValidated"
                                v-if="!isEstimate"
                                @button-clicked="handleSalesSubmission"
                            />
                        </b-row>
                    </template>
                </div>
            </template>

            <template v-if="isEstimate && productSummariesIsNotEmpty && isFullProductSummaryPage">
                <div class="product-summary-page__total-section--xl d-flex justify-content-end">
                    <div class="product-summary-page__total-estimate-section pull-right">
                        <span>Total:</span>
                        <span class="product-summary-page__text--pull-right">{{
                            totalAmountMoney | amountWithCurrency
                        }}</span>
                    </div>
                </div>
            </template>

            <!-- Sales Summary Details Section -->
            <template v-else>
                <div class="product-summary-page__total-section--xl" v-if="userIsOnDesktop && isFullProductSummaryPage">
                    <div class="product-summary-page__total-amount-section--xl">
                        <span>Total:</span>
                        <span class="product-summary-page__text--pull-right">{{
                            totalAmountMoney | amountWithCurrency
                        }}</span>
                    </div>

                    <div class="product-summary-page__balance-amount-section--xl">
                        <span>Balance:</span>
                        <span class="product-summary-page__text--pull-right" v-if="!hasAmountPaidError">{{
                            balanceMoney | amountWithCurrency
                        }}</span>
                    </div>
                </div>
            </template>

            <div class="d-flex w-50 mr-auto ml-auto justify-content-center" v-if="productSummariesIsNotEmpty">
                <BaseButton
                    v-if="desktopUserIsNotViewingFullSummary"
                    buttonText="Proceed"
                    class="product-summary-page__view-summary-btn"
                    @button-clicked="$emit('show-full-product-summary-page')"
                    :overRideButtonClass="true"
                />

                <BasePrimaryButton
                    v-if="!desktopUserIsNotViewingFullSummary && isEstimate"
                    buttonText="Preview"
                    class="product-summary-page__submit-btn"
                    :status="estimateRequestStatus"
                    @button-clicked="handleEstimatePreview"
                />

                <BaseButton
                    buttonText="Submit"
                    class="product-summary-page__submit-btn"
                    :overRideButtonClass="true"
                    :status="salesRequestLoadingStatus"
                    :disabled="!salesFormIsValidated"
                    v-if="isFullProductSummaryPage && !isEstimate"
                    @button-clicked="handleSalesSubmission"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import ProductSummaryRowMobileAndMedium from '@/pages/Sales/ProductSummaryRowMobileAndMedium.vue';
import ProductSummaryRow from '@/pages/Sales/ProductSummaryRow.vue';
import ProductSummaryHeader from '@/pages/Sales/ProductSummaryHeader.vue';

import {
    AddProductToSalesForm,
    EstimateSummaryDetails,
    ProductSummary,
    ProductSummaryDetails,
} from '@/pages/Sales/types';
import { MoneyObject, PaymentAccount, Status, SaleRequestStatus } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import SalesServiceMixin from '@/mixins/SalesService';

@Component({
    components: {
        ProductSummaryRowMobileAndMedium,
        ProductSummaryHeader,
        ProductSummaryRow,
    },
})
export default class ProductSummaryPage extends Mixins(UtilityMixins, CurrencyMixins, SalesServiceMixin) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private clickedProductSummaryIndex: any = '';
    @Prop({ default: () => Array<ProductSummary>() }) readonly productSummaries!: Array<ProductSummary>;
    @Prop({ default: () => Array<AddProductToSalesForm>() }) readonly selectedProducts!: Array<AddProductToSalesForm>;
    @Prop({ default: false }) readonly isFullProductSummaryPage!: boolean;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: () => Array<PaymentAccount>() }) readonly paymentAccounts!: Array<PaymentAccount>;
    @Prop({ default: false }) readonly transactionWithoutCustomer!: boolean;
    @Prop({}) readonly selectedSalesCurrency!: string | number;
    @Prop({ default: false }) readonly isEditingPreviousSale!: boolean;
    @Prop({ default: false }) readonly detailsForPreviousSalesEditIsReady!: boolean;
    @Prop({}) readonly editSalesFormDetails!: ProductSummaryDetails;
    @Prop({}) readonly inputSalesSummary!: ProductSummaryDetails;
    @Prop({}) readonly inputEstimateSummary!: EstimateSummaryDetails;
    @Prop({ default: Status.NORMAL }) readonly salesRequestLoadingStatus!: string;
    @Prop({ default: Status.NORMAL }) readonly getPaymentAccountsStatus!: Status;
    @Prop({}) readonly salesRequestStatus!: SaleRequestStatus;

    private salesForm: ProductSummaryDetails = { ...this.inputSalesSummary };

    private estimateForm: EstimateSummaryDetails = { ...this.inputEstimateSummary };

    private salesCurrencyKey = 0;
    private amountPaidText = '';

    get hasPreviousSummaryData(): boolean {
        return this.isEstimate ? this.hasInputEstimateSummary : this.hasInputSalesSummary;
    }

    get hasInputEstimateSummary(): boolean {
        if (this.inputEstimateSummary.dateIssued) return true;
        if (this.inputEstimateSummary.notes) return true;
        return false;
    }

    get hasInputSalesSummary(): boolean {
        if (this.inputSalesSummary.transactionDate) return true;
        if (this.inputSalesSummary.paymentAccountKey) return true;
        if (this.inputSalesSummary.balanceDueDate) return true;
        if (this.inputSalesSummary.amountPaid.amount > 0) return true;
        return false;
    }

    get productSummaryPageCurrencyKey() {
        let firstProductSummaryCurrencyKey = '';
        // you will set the product summary currency key by finding the first product summary with a functional currency key (with unit price)
        const firstProductSummaryCurrencyKeyObject = this.productSummaries.find(
            productSummary => productSummary.unitPrice.currencyKey > 0,
        );

        if (firstProductSummaryCurrencyKeyObject) {
            firstProductSummaryCurrencyKey = firstProductSummaryCurrencyKeyObject?.unitPrice?.currencyKey.toString();
        }
        // get the currency symbol from the list of currencies using the first product summary currency key in the product summaries array
        return firstProductSummaryCurrencyKey;
    }

    get totalAmount(): number {
        return this.productSummaries.reduce(
            (previousValue: number, productSummary: ProductSummary) =>
                previousValue +
                (Number(productSummary.totalExclusiveVat.amount) + Number(productSummary.vatAmount.amount)),
            0,
        );
    }

    get totalAmountMoney(): MoneyObject {
        return {
            amount: this.totalAmount,
            currencyKey: this.salesForm.amountPaid.currencyKey,
        };
    }

    get balance() {
        const { totalAmount, salesForm } = this;

        return totalAmount - Number(salesForm.amountPaid.amount);
    }

    get hasAmountPaidError(): boolean {
        if (this.salesFormError.amountPaid) return true;
        return false;
    }

    get mobileBalanceText() {
        if (this.hasAmountPaidError) return '';

        const balText = this.convertFigureToCurrency(this.balance);

        if (balText) return balText;

        return '0';
    }

    get balanceMoney(): MoneyObject {
        return {
            amount: this.balance,
            currencyKey: this.salesForm.amountPaid.currencyKey,
        };
    }

    get productSummariesIsNotEmpty(): boolean {
        return this.productSummaries.length > 0;
    }

    get disableBalanceDueDate(): boolean {
        return this.balance <= 0;
    }

    get desktopUserIsNotViewingFullSummary(): boolean {
        return this.userIsOnDesktop && !this.isFullProductSummaryPage;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get estimateRequestStatus() {
        const { salesRequestStatus } = this;
        if (salesRequestStatus.recordEstimate === Status.LOADING) {
            return this.salesRequestStatus.recordEstimate;
        }
        return this.salesRequestStatus.generatePdf;
    }

    private handleEditSale(productIndex: number) {
        this.$emit('edit-sale-item', productIndex);
        this.$emit('save-sales-form', this.salesForm);
        this.$emit('save-estimate-form', this.estimateForm);
    }

    private handleProductSummaryVisibility(indexOfClickedProductSummary: number) {
        if (parseInt(this.clickedProductSummaryIndex) === null) {
            this.clickedProductSummaryIndex = indexOfClickedProductSummary;
            return;
        }

        if (this.clickedProductSummaryIndex === indexOfClickedProductSummary) {
            this.clickedProductSummaryIndex = '';
            return;
        }

        this.clickedProductSummaryIndex = indexOfClickedProductSummary;
    }

    private handlePaymentAccountSelection(paymentAccountKey: string) {
        this.salesForm.paymentAccountKey = paymentAccountKey;
        this.validatePaymentAccount();
    }

    private formatAndValidateAmountPaid(amountPaidInput: string) {
        const amountPaidNum = this.convertFormattedFiguresToNumber(amountPaidInput);

        if (this.isValidAmountPaid(amountPaidInput, this.totalAmount)) {
            this.salesForm.amountPaid = Object.assign({}, this.salesForm.amountPaid, {
                amount: amountPaidNum,
                currencyKey: this.salesCurrencyKey,
            });

            if (amountPaidNum == this.totalAmount) {
                if (this.salesFormError.balanceDueDate) {
                    this.salesForm.balanceDueDate = '';
                    this.validateBalanceDueDate('', 0, this.salesForm.transactionDate); //balance is 0
                }
            } else {
                if (!this.salesForm.balanceDueDate) {
                    this.salesForm.balanceDueDate = this.todayAsDefaultDate();
                }
            }

            this.amountPaidText = this.convertFigureToCurrency(amountPaidInput);

            this.validatePaymentAccount();
            this.validateBalanceDueDateValue();
        } else {
            if (amountPaidNum) this.amountPaidText = this.convertFigureToCurrency(amountPaidNum);
            else this.amountPaidText = amountPaidInput;
        }
    }

    private saveState() {
        this.$emit('save-sales-form', this.salesForm);
        this.$emit('save-estimate-form', this.estimateForm);
    }

    private handleBalanceDueDateField(balanceDueDate: string) {
        this.salesForm.balanceDueDate = balanceDueDate;

        this.validateBalanceDueDate(balanceDueDate, this.balance, this.salesForm.transactionDate);
    }

    private validateBalanceDueDateValue() {
        const { transactionDate, balanceDueDate } = this.salesForm;
        this.validateBalanceDueDate(balanceDueDate, this.balance, transactionDate);
    }

    private handleTransactionDateField(transactionDate: string) {
        this.salesForm.transactionDate = transactionDate;

        // this.validateTransactionDate(transactionDate);
    }

    private validatePaymentAccount() {
        if (this.salesForm.amountPaid.amount > 0) {
            this.validateEmptyField(
                'paymentAccountKey',
                this.salesForm.paymentAccountKey,
                this.salesFormError,
                'This is a required field',
            );
            return;
        }

        this.salesFormError['paymentAccountKey'] = '';
    }

    private handleSalesSubmission() {
        this.formatAndValidateAmountPaid(this.amountPaidText);
        this.validateTransactionDate(this.salesForm.transactionDate);

        if (this.salesForm.amountPaid.amount === 0) {
            this.salesForm.paymentAccountKey = '';
        }

        if (this.disableBalanceDueDate) {
            this.salesForm.balanceDueDate = '';
        }

        if (this.salesFormIsValidated) {
            this.$emit('submit-sales-form', { sales: this.salesForm, balance: this.balance });
        }
    }

    private handleEstimatePreview() {
        this.$emit('submit-estimate-form', this.estimateForm);
    }

    @Watch('currentWindowWidth')
    handlePageResize() {
        if (this.userIsOnDesktop) {
            if (!this.isFullProductSummaryPage) this.saveState();
            this.$emit('resize-page-for-desktop');
        } else {
            if (this.isFullProductSummaryPage) this.saveState();
            this.$emit('resize-page-for-mobile');
        }
    }

    @Watch('selectedSalesCurrency')
    selectedCurrencyChanged() {
        this.initializePayment();
    }

    @Watch('detailsForPreviousSalesEditIsReady')
    setInitialStateForSalesEdit() {
        if (this.detailsForPreviousSalesEditIsReady) {
            this.$nextTick(() => {
                this.salesForm = this.editSalesFormDetails;
                this.amountPaidText = this.convertFigureToCurrency(this.editSalesFormDetails.amountPaid.amount);
            });

            this.initializePayment();
        }
    }

    @Watch('productSummaries')
    private prefillAmountPaid() {
        this.salesForm.amountPaid.amount = this.totalAmount;
        this.amountPaidText = this.convertFigureToCurrency(this.totalAmount);
    }

    @Watch('inputSalesSummary')
    private prefillInputSales() {
        const { amountPaid } = this.inputSalesSummary;

        this.salesForm = { ...this.inputSalesSummary };
        this.amountPaidText = this.convertFigureToCurrency(amountPaid.amount);
    }

    @Watch('inputEstimateSummary')
    private prefillInputEstimate() {
        this.estimateForm = { ...this.inputEstimateSummary };
    }

    @Watch('salesForm.transactionDate')
    checkBalanceDueDateAgainstTransactionDueDate(transactionDate: string) {
        this.validateBalanceDueDate(this.salesForm.balanceDueDate, this.balance, transactionDate);

        // get the supplyDueDate of each item being sold
        const allItemsWithSupplyDueDates = this.selectedProducts.map(
            ({ name, supplyDueDate }: AddProductToSalesForm) => ({
                name,
                supplyDueDate,
            }),
        );

        let itemWithDefectiveSupplyDueDate = { name: '', supplyDueDate: '' };

        for (const item of allItemsWithSupplyDueDates) {
            if (transactionDate > item.supplyDueDate) {
                itemWithDefectiveSupplyDueDate = item;
            }
        }

        if (itemWithDefectiveSupplyDueDate.supplyDueDate) {
            this.salesFormError[
                'transactionDate'
            ] = `The supply due date for ${itemWithDefectiveSupplyDueDate.name} should be greater than this transaction date`;
            return;
        }

        this.salesFormError['transactionDate'] = '';

        // the dates must always be greater than the transaction date
    }

    private initializePayment() {
        let currencyKey = this.selectedSalesCurrency;

        if (currencyKey === 0) {
            if (this.productSummaries.length > 0) {
                currencyKey = this.productSummaries[0].unitPrice.currencyKey;
            } else {
                currencyKey = this.defaultCurrency.currencyKey;
            }
        }

        this.salesCurrencyKey = Number(currencyKey);
        this.salesForm.amountPaid.currencyKey = currencyKey;

        // if (!this.amountPaidText && !this.isEditingPreviousSale) {
        //     this.salesForm.amountPaid.amount = this.totalAmount;
        //     this.amountPaidText = this.convertFigureToCurrency(this.totalAmount);
        // }

        if (!this.isEditingPreviousSale && !this.hasPreviousSummaryData) {
            this.prefillAmountPaid();
        }

        if (this.hasInputSalesSummary) {
            const { amount } = this.salesForm.amountPaid;

            if (amount > 0) this.amountPaidText = this.convertFigureToCurrency(amount);
        }
    }

    private handleDeleteModal(indexOfItemToBeDeleted: number) {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Remove Item',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.deleteProduct(indexOfItemToBeDeleted);
            })
            .catch(err => err);
    }

    private deleteProduct(indexOfItemToBeDeleted: number) {
        // show modal to tell user to confirm their action
        this.$emit('delete-sale-item', indexOfItemToBeDeleted);
    }

    updated() {
        if (this.transactionWithoutCustomer) {
            this.salesForm.amountPaid.amount = this.totalAmount;
            this.amountPaidText = this.convertFigureToCurrency(this.totalAmount);
        }
    }

    mounted() {
        if (!this.userIsOnDesktop) {
            this.initializePayment();
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/product-summary-page';
</style>
