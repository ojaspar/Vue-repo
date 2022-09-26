<template>
    <div class="document-preview">
        <div class="document-preview__company-icon-name-section">
            <h1 class="document-preview__initials-container">{{ businessProfile.name | initials }}</h1>
            <h1 class="document-preview__company-name">{{ businessProfile.name }}</h1>
            <p class="document-preview__contact-details">{{ businessContact }}</p>

            <img
                src="@/assets/img/back-button.svg"
                class="document-preview__back-icon"
                @click="$emit('document-preview-back-button-clicked')"
                v-if="false"
            />
        </div>

        <div class="document-preview__estimate-details-section">
            <h1 class="document-preview__preview-text">{{ previewText }}</h1>
            <div class="document-preview__estimate-details-subsection">
                <p class="document-preview__estimate-details-subtext">Ref. Number: {{ refNo }}</p>

                <p class="document-preview__estimate-details-subtext">
                    {{ billToLabel }}
                    <span class="document-preview__estimate-details-subtext--bold">{{
                        documentDetails.customer.name
                    }}</span>
                </p>

                <p class="document-preview__estimate-details-subtext" v-if="documentDetails.customer.email">
                    Email:
                    <span class="document-preview__estimate-details-subtext--bold">{{
                        documentDetails.customer.email
                    }}</span>
                </p>

                <p class="document-preview__estimate-details-subtext">
                    Date: {{ new Date(documentDate) | monthDateYearFormat }}
                </p>
            </div>
        </div>

        <div class="document-preview__items-heading-section">
            <h3 class="document-preview__items-heading">items</h3>
            <h3 class="document-preview__items-heading amount-col">Amount</h3>
        </div>

        <div class="document-preview__items-list-section-container">
            <div
                class="document-preview__items-list-section"
                v-for="(item, index) in documentDetails.products"
                :key="index"
            >
                <div>
                    <p class="document-preview__item-name-text">{{ item.productName }}</p>
                    <p class="mb-0">
                        {{ itemSummaryBreakdown(item) }}
                    </p>
                    <p class="document-preview__discount" v-if="showSummaryDiscountText(item)">
                        <i>Less</i> &nbsp; <span class="txt-black"> {{ summaryDiscountText(item) }} </span> discount
                    </p>
                </div>
                <div class="document-preview__items-list-subsection amount-col">
                    <p>{{ item.subTotal | amountWithCurrency }}</p>
                </div>
            </div>
        </div>

        <div class="document-preview__total-vat-section">
            <div class="document-preview__total-vat-subsection" v-if="totalVat.amount > 0">
                <span class="document-preview__total-excluding-vat-text document-preview__total-text--grey"
                    >Total Excl. VAT</span
                >
                <span
                    class="document-preview__total-excluding-vat-amount document-preview__total-text--grey amount-col"
                    >{{ totalExcludingVat | amountWithCurrency }}</span
                >
            </div>
            <div class="document-preview__total-vat-subsection" v-if="totalVat.amount > 0">
                <span class="document-preview__vat-text document-preview__total-text--grey">VAT</span>
                <span class="document-preview__vat-amount document-preview__total-text--grey amount-col">{{
                    totalVat | amountWithCurrency
                }}</span>
            </div>
            <div class="document-preview__total-subsection">
                <span class="document-preview__total-text">Total</span>
                <span class="document-preview__total-amount amount-col">{{ total | amountWithCurrency }}</span>
            </div>
        </div>

        <div class="document-preview__total-vat-section document-preview__amount-paid-section" v-if="!isEstimate">
            <div class="document-preview__total-vat-subsection">
                <span class="document-preview__total-excluding-vat-text document-preview__total-text--grey"
                    >Amount Paid</span
                >
                <span
                    class="document-preview__total-excluding-vat-amount document-preview__total-text--grey amount-col"
                >
                    {{ documentDetails.amountPaid | amountWithCurrency }}
                </span>
            </div>
            <div class="document-preview__total-vat-subsection">
                <span class="document-preview__vat-text document-preview__total-text--bold">Balance</span>
                <span class="document-preview__vat-amount  document-preview__total-text--bold amount-col">{{
                    balance | amountWithCurrency
                }}</span>
            </div>
        </div>

        <p class="document-preview__validity-period-text" v-if="isEstimate">Valid for 6 months</p>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import SalesMixin from '@/pages/Sales/SalesMixin';

import { MoneyObject } from '@/types';
import { DocumentDetails, InvoiceBusinessProfile, ProductSummary } from '@/pages/Sales/types';

@Component
export default class DocumentPreviewMobile extends Mixins(SalesMixin) {
    @Prop({ required: true }) readonly isEstimate!: boolean;
    @Prop({ required: true }) readonly billToLabel!: string;
    @Prop({ required: true }) readonly previewText!: string;
    @Prop({ required: true }) readonly businessProfile!: InvoiceBusinessProfile;
    @Prop({ required: true }) readonly documentDetails!: DocumentDetails;
    @Prop({ default: 'NORMAL' }) readonly invoiceRequestStatus!: string;
    @Prop({ default: () => ({ amount: 0, currencyKey: 0 }) }) readonly totalExcludingVat!: MoneyObject;
    @Prop({ default: () => ({ amount: 0, currencyKey: 0 }) }) readonly totalVat!: MoneyObject;
    @Prop({ default: () => ({ amount: 0, currencyKey: 0 }) }) readonly total!: MoneyObject;
    @Prop({ default: () => ({ amount: 0, currencyKey: 0 }) }) readonly subTotal!: MoneyObject;
    @Prop({ default: () => ({ amount: 0, currencyKey: 0 }) }) readonly balance!: MoneyObject;
    @Prop({ default: '' }) readonly refNo!: string;

    get documentDate(): string {
        if (this.isEstimate) {
            return this.documentDetails.dateIssued;
        }
        return this.documentDetails.transactionDate;
    }

    get showSubTotal(): boolean {
        return this.totalVat.amount > 0 && this.subTotal.amount == this.total.amount;
    }

    get businessContact() {
        const { email } = this.businessProfile;

        return email;

        // if (phoneNumber && email) {
        //     return phoneNumber + ', ' + email;
        // }

        // return phoneNumber + email;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/document-preview-mobile';
</style>
