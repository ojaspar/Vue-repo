<template>
    <div>
        <div v-if="$root.isMobileScreenSize">
            <!-- when the back button in the estimate preview mobile is clicked, the splitScreenPage should be reactivated
            so that if the orientation is changed-->
            <DocumentPreviewMobile
                @document-preview-back-button-clicked="$emit('document-preview-back-button-clicked')"
                @change-company-logo="openModal"
                :billToLabel="billToLabel"
                :previewText="previewText"
                :isEstimate="isEstimate"
                :businessProfile="businessProfile"
                :documentDetails="documentDetails"
                :totalExcludingVat="totalExcludingVat"
                :totalVat="totalVat"
                :subTotal="subTotal"
                :total="total"
                :balance="balance"
                :refNo="refNo"
            />
        </div>

        <div v-else>
            <DocumentPreviewMediumPlus
                @document-preview-back-button-clicked="$emit('document-preview-back-button-clicked')"
                @change-company-logo="openModal"
                :billToLabel="billToLabel"
                :previewText="previewText"
                :isEstimate="isEstimate"
                :businessProfile="businessProfile"
                :documentDetails="documentDetails"
                :totalExcludingVat="totalExcludingVat"
                :totalVat="totalVat"
                :subTotal="subTotal"
                :total="total"
                :balance="balance"
                :refNo="refNo"
            />
        </div>

        <BaseModal modalTitle="Upload Company Logo" :modalId="modalId" @hide-modal="closeModal">
            <LogoUpload @file-uploaded="setCompanyLogo" />
        </BaseModal>

        <div class="document-preview-button-div">
            <a :href="receiptPdfFile" :download="documentName" class="document-preview-download">Download</a>

            <BaseSecondaryButton
                v-if="showContinueButton"
                class="ml-5"
                buttonText="Continue Sale"
                @button-clicked="goToManageSale()"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import DocumentPreviewMediumPlus from '@/pages/Sales/DocumentPreviewMediumPlus.vue';
import DocumentPreviewMobile from '@/pages/Sales/DocumentPreviewMobile.vue';
import LogoUpload from '@/components/ui/LogoUpload.vue';

import { DocumentDetails, DocumentPreviewType, InvoiceBusinessProfile, ProductSummary } from '@/pages/Sales/types';
import { MoneyObject, VueExtension } from '@/types';

import SessionStorageService from '@/services/sessionStorage';

const sales = namespace('sale');

@Component({
    components: {
        DocumentPreviewMediumPlus,
        DocumentPreviewMobile,
        LogoUpload,
    },
})
export default class DocumentPreviewPage extends Vue {
    @Prop({ default: DocumentPreviewType.ESTIMATE }) readonly documentPreviewType!: DocumentPreviewType;
    @Prop({ required: true }) readonly documentDetails!: DocumentDetails;
    @Prop({ default: '' }) readonly saleKey!: string;

    private businessProfile: InvoiceBusinessProfile = {
        name: '',
        logo: '',
        address: '',
        phoneNumber: '',
        email: '',
    };
    private currencyKey = 0;
    private modalId = 'business-logo-modal';

    $root!: VueExtension;

    @sales.State
    private receiptPdfFile!: string;

    @sales.State
    private refNo!: string;

    get previewText(): string {
        if (this.documentPreviewType === DocumentPreviewType.ESTIMATE) {
            return 'ESTIMATE';
        }

        if (this.documentPreviewType === DocumentPreviewType.INVOICE) {
            return 'INVOICE';
        }

        return 'RECEIPT';
    }

    get billToLabel(): string {
        if (this.documentPreviewType === DocumentPreviewType.RECEIPT) return 'Received By: ';
        return 'Bill To: ';
    }

    get isEstimate(): boolean {
        return this.documentPreviewType === DocumentPreviewType.ESTIMATE;
    }

    get showContinueButton(): boolean {
        if (this.documentPreviewType === DocumentPreviewType.ESTIMATE) return true;

        return this.balance.amount > 0;
    }

    get subTotal(): MoneyObject {
        const total = this.documentDetails.products.reduce(
            (currentAmount: number, item: ProductSummary) => currentAmount + Number(item.subTotal.amount),
            0,
        );
        return {
            currencyKey: this.currencyKey,
            amount: total,
        };
    }

    get totalExcludingVat(): MoneyObject {
        const total = this.documentDetails.products.reduce(
            (currentAmount: number, item: ProductSummary) => currentAmount + Number(item.totalExclusiveVat.amount),
            0,
        );
        return {
            currencyKey: this.currencyKey,
            amount: total,
        };
    }

    get totalVat(): MoneyObject {
        const total = this.documentDetails.products.reduce(
            (currentAmount: number, item: ProductSummary) => currentAmount + Number(item.vatAmount.amount),
            0,
        );
        return {
            currencyKey: this.currencyKey,
            amount: total,
        };
    }

    get total(): MoneyObject {
        return {
            currencyKey: this.currencyKey,
            amount: this.totalVat.amount + this.totalExcludingVat.amount,
        };
    }

    get balance(): MoneyObject {
        return {
            currencyKey: this.currencyKey,
            amount: this.total.amount - Number(this.documentDetails.amountPaid.amount),
        };
    }

    get documentName(): string {
        const name = this.documentDetails?.customer?.name;

        const transactionId = this.refNo;

        if (name) return `${this.documentPreviewType}-${name}-${transactionId}.pdf`;

        return `${this.documentPreviewType}-${transactionId}.pdf`;
    }

    private goToManageSale() {
        this.$router.push({ name: 'ManageSales', params: { saleKey: this.saleKey } });
    }

    private setDefaultValues() {
        const {
            businessName,
            businessAddress,
            email,
            phoneNumber,
            businessLogoUrl,
        } = SessionStorageService.decodeToken();

        this.businessProfile = Object.assign({}, this.businessProfile, {
            name: businessName,
            address: businessAddress,
            email,
            phoneNumber,
            logo: businessLogoUrl,
        });

        this.currencyKey = Number(this.documentDetails.products[0]?.unitPrice?.currencyKey);
    }

    private openModal() {
        this.$bvModal.show(this.modalId);
    }

    private closeModal() {
        this.$bvModal.hide(this.modalId);
    }

    private setCompanyLogo(companyLogoUrl: string) {
        this.businessProfile.logo = companyLogoUrl;

        this.closeModal();
    }

    private async getBusinessLogoAndAddress() {
        // get business logo here
    }

    created() {
        this.getBusinessLogoAndAddress();

        this.setDefaultValues();
    }
}
</script>

<style lang="scss">
@import '@/styles/pages/sales/document-preview-page';
</style>
