<template>
    <div class="document-preview-medium__top-div">
        <div class="document-preview-medium__document">
            <div class="document-preview-medium__no-logo" v-if="!companyLogoIsAvailable">
                Kindly click
                <span class="document-preview-medium__no-logo--link" @click="changeCompanyLogo">here</span>
                to upload your company logo
            </div>

            <div class="document-preview-medium__top-section">
                <div class="document-preview-medium__company-info">
                    <div>
                        <div class="document-preview-page__logo-wrapper" v-if="companyLogoIsAvailable">
                            <img
                                :src="businessProfile.logo"
                                alt="customer company logo"
                                class="document-preview-medium__logo"
                            />
                        </div>

                        <div class="document-preview-medium__side__company-name-section">
                            <h1 class="document-preview-medium__side__company-name-text">{{ businessProfile.name }}</h1>
                            <h1 class="document-preview-medium__side__company-contact-details-text">
                                {{ businessProfile.email }}
                            </h1>
                        </div>
                    </div>
                </div>

                <div class="document-preview-medium__customer-invoice-details-section">
                    <div>
                        <p class="document-preview-medium__customer-name-text">
                            <span class="text--grey">{{ billToLabel }} </span>
                            <span class="text--grey txt--bold">{{ documentDetails.customer.name }}</span>
                        </p>
                        <p class="document-preview-medium__customer-email-text" v-if="documentDetails.customer.email">
                            <span class="text--grey">Email: </span>
                            <span class="text--grey txt--bold">{{ documentDetails.customer.email }}</span>
                        </p>
                        <p class="document-preview-medium__date-issued">
                            <span class="text--grey">Date: </span>
                            <span class="text--grey txt--bold">{{ new Date(documentDate) | monthDateYearFormat }}</span>
                        </p>
                    </div>

                    <div class="document-preview-medium__side">
                        <p class="text-uppercase text-bold document-preview-medium__side__title">{{ previewText }}</p>

                        <p class="document-preview-medium__side__invoice-number" v-if="refNo">
                            Ref. Number: {{ refNo }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="document-preview-medium__table-header">
                <div class="document-preview-medium__col-SN">#</div>
                <div class="document-preview-medium__col-item">ITEM</div>
                <div class="document-preview-medium__col-price">PRICE</div>
                <div class="document-preview-medium__col-amount">AMOUNT</div>
            </div>
            <div class="document-preview-medium__bottom-div">
                <div class="document-preview-medium__row-section">
                    <div
                        class="document-preview-medium__item-row"
                        v-for="(item, index) in documentDetails.products"
                        :key="index"
                    >
                        <div class="document-preview-medium__col-SN">{{ index + 1 }}</div>
                        <div class="document-preview-medium__col-item">{{ item.productName }}</div>
                        <div class="document-preview-medium__col-price">
                            <p class="mb-0">
                                {{ itemSummaryBreakdown(item) }}
                            </p>
                            <p class="document-preview-medium__discount" v-if="showSummaryDiscountText(item)">
                                <i>Less</i> &nbsp;
                                <span class="txt-black"> {{ summaryDiscountText(item) }} </span> discount
                            </p>
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ item.subTotal | amountWithCurrency }}
                        </div>
                    </div>
                </div>

                <!-- amount breakdown section -->
                <div class="document-preview-medium__total-section">
                    <div class="document-preview-medium__item-row" v-if="showSubTotal">
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            Sub Total
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ subTotal | amountWithCurrency }}
                        </div>
                    </div>
                    <div
                        class="document-preview-medium__payment-row document-preview-medium__grey-text"
                        v-if="totalVat.amount > 0"
                    >
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            Total Excl. VAT
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ totalExcludingVat | amountWithCurrency }}
                        </div>
                    </div>

                    <div
                        class="document-preview-medium__payment-row document-preview-medium__grey-text"
                        v-if="totalVat.amount > 0"
                    >
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            VAT
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ totalVat | amountWithCurrency }}
                        </div>
                    </div>

                    <div class="document-preview-medium__payment-row">
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            Total
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ total | amountWithCurrency }}
                        </div>
                    </div>
                </div>

                <!-- amount paid / balance section -->
                <div class="document-preview-medium__payment-section" v-if="!isEstimate">
                    <div class="document-preview-medium__payment-row document-preview-medium__grey-text">
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            Amount Paid
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ documentDetails.amountPaid | amountWithCurrency }}
                        </div>
                    </div>

                    <div class="document-preview-medium__payment-row txt--bold">
                        <div class="document-preview-medium__col-SN"></div>
                        <div class="document-preview-medium__col-item"></div>
                        <div class="document-preview-medium__col-price">
                            Balance
                        </div>
                        <div class="document-preview-medium__col-amount">
                            {{ balance | amountWithCurrency }}
                        </div>
                    </div>
                </div>

                <p class="document-preview-medium__validity-text" v-if="isEstimate">*Valid for 6 months</p>

                <div class="document-preview-medium__footer-section">
                    <p class="document-preview-medium__footer-section--text">Powered by</p>
                    <MzuriLogo class="document-preview-medium__footer-section--logo" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import SalesMixin from '@/pages/Sales/SalesMixin';

import { DocumentDetails, InvoiceBusinessProfile, ProductSummary } from '@/pages/Sales/types';
import { MoneyObject } from '@/types';

@Component
export default class DocumentPreviewMediumPlus extends Mixins(SalesMixin) {
    private isDropdownShown = false;

    @Prop({ required: true }) readonly businessProfile!: InvoiceBusinessProfile;
    @Prop({ required: true }) readonly documentDetails!: DocumentDetails;
    @Prop({ default: 'NORMAL' }) readonly invoiceRequestStatus!: string;
    @Prop({ required: true }) readonly isEstimate!: boolean;
    @Prop({ required: true }) readonly previewText!: string;
    @Prop({ required: true }) readonly billToLabel!: string;
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

    get companyLogoIsAvailable(): boolean {
        return this.businessProfile.logo.length > 0;
    }

    private changeCompanyLogo() {
        this.$emit('change-company-logo');
    }

    private togglePreviewHeaderDropdown() {
        this.isDropdownShown = !this.isDropdownShown;

        if (this.isDropdownShown) {
            this.$nextTick(() => {
                this.$refs.headerDropdown.focus();
            });
        }
    }

    private closeShareDropdown() {
        this.isDropdownShown = false;
    }

    public $refs!: {
        headerDropdown: HTMLFormElement;
        shareButtonAndIconContainer: HTMLFormElement;
    };
}
</script>

<style scoped lang="scss">
@import 'src/styles/pages/sales/document-preview-medium-plus';
</style>
