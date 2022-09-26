<template>
    <div>
        <template v-if="documentPreviewMode">
            <DocumentPreviewPage :documentPreviewType="documentPreviewType" :documentDetails="documentDetails" />
        </template>

        <template v-else>
            <MobileIndex
                v-if="userIsOnMobile"
                @update-supply="updateSupply"
                @add-payment="addPayment"
                @generate-document="generateDocumentDetails"
                @duplicate-sale="duplicateSale"
            />

            <TabletPlusIndex
                v-else
                @update-supply="updateSupply"
                @add-payment="addPayment"
                @duplicate-sale="duplicateSale"
                @generate-document="generateDocumentDetails"
            />

            <BaseModal :modalId="activeComponent.id" :modalTitle="activeComponent.title" @hide-modal="closeOpenModal">
                <component
                    :is="activeComponent.component"
                    :selectedProduct="selectedProduct"
                    @hide-modal="closeOpenModal"
                />
            </BaseModal>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import MobileIndex from '@/pages/Sales/ManageSales/Mobile/index.vue';
import TabletPlusIndex from '@/pages/Sales/ManageSales/TabletPlus/index.vue';
import UpdatePayment from '@/pages/Sales/ManageSales/UpdatePayment.vue';
import UpdateSupply from '@/pages/Sales/ManageSales/UpdateSupply.vue';
import DocumentPreviewPage from '@/pages/Sales/DocumentPreviewPage.vue';

import UtilityMixins from '@/mixins/Utility';
import SalesMixin from '@/pages/Sales/SalesMixin';

import {
    defaultCustomer,
    defaultProductDetailsForm,
    DocumentDetails,
    DocumentPreviewType,
    ProductInProductDetailsForm,
    ProductSummary,
} from '@/pages/Sales/types';
import { MoneyObject } from '@/types';
import SalesValidations from '@/pages/Sales/RecordSale/v4/validations';

@Component({
    components: {
        MobileIndex,
        TabletPlusIndex,
        DocumentPreviewPage,
    },
})
export default class ManageSalesIndex extends Mixins(UtilityMixins, SalesMixin, SalesValidations) {
    private activeComponent = {
        id: '',
        title: '',
        component: {},
    };
    private selectedProduct: ProductInProductDetailsForm = { ...defaultProductDetailsForm };

    private documentPreviewMode = false;
    private documentPreviewType = DocumentPreviewType.INVOICE;
    private documentDetails: DocumentDetails = {
        customer: {
            name: '',
            phoneNumber: '',
            email: '',
        },
        amountPaid: { currencyKey: 0, amount: 0 },
        dateIssued: '',
        notes: '',
        transactionDate: '',
        products: [],
    };

    private addPayment() {
        this.activeComponent = {
            id: 'payment-modal',
            title: 'Add Payment',
            component: UpdatePayment,
        };

        this.$nextTick(() => {
            this.openModal('payment-modal');
        });
    }

    private updateSupply(product: ProductInProductDetailsForm) {
        this.selectedProduct = product;

        this.activeComponent = {
            id: 'supply-modal',
            title: `Add Supply (${product.productName})`,
            component: UpdateSupply,
        };

        this.$nextTick(() => {
            this.openModal('supply-modal');
        });
    }

    private closeOpenModal() {
        this.closeModal(this.activeComponent.id);
        this.selectedProduct = { ...defaultProductDetailsForm };
    }

    private setDocumentDetails() {
        const { customer, products, amountPaid, transactionDate } = this.saleDetails;
        const thisCustomer = customer ? customer : defaultCustomer;

        this.documentDetails = {
            customer: { ...thisCustomer },
            amountPaid,
            dateIssued: '',
            notes: '',
            transactionDate,
            products: products.map((product: ProductInProductDetailsForm) => {
                return this.getProductSummary(product);
            }),
        };
    }

    private getProductSummary(product: ProductInProductDetailsForm): ProductSummary {
        const { unitPrice, discount, quantity, vatTypeName } = product;
        const subTotalAmount = this.lineAmount(Number(unitPrice.amount), quantity, Number(discount.amount));
        const currencyKey = Number(unitPrice.currencyKey);
        const vatAmount = this.getVATAmount(vatTypeName, subTotalAmount);

        const item = {
            productName: product.productName,
            productKey: product.productKey,
            unitPrice: { ...unitPrice, currencyKey },
            quantity: quantity,
            measurementTypeKey: product.measurementTypeKey,
            measurementUnit: product.measurementTypeName,
            notes: product.notes,
            files: product.attachments,
            supplyStatus: this.getSupplyStatus(quantity, product.quantitySupplied),
            discount: { amount: discount.amount, currencyKey },
            vatType: vatTypeName,
            vatAmount: { amount: vatAmount, currencyKey },
            totalExclusiveVat: {
                amount: this.getTotalExclusiveOfVAT(vatTypeName, vatAmount, subTotalAmount),
                currencyKey,
            },
            subTotal: { amount: subTotalAmount, currencyKey },
        };

        return item;
    }

    private getSubTotal(product: ProductInProductDetailsForm): MoneyObject {
        const { unitPrice, discount, quantity } = product;
        const amount = this.lineAmount(Number(unitPrice.amount), quantity, Number(discount.amount));

        return { amount, currencyKey: unitPrice.currencyKey };
    }

    private duplicateSale() {
        this.$router.push({ name: 'Duplicate-Sale', params: { saleKey: this.saleDetails.saleKey } });
    }

    private async generateDocument(documentType: DocumentPreviewType = DocumentPreviewType.RECEIPT) {
        await this.salesModule.generatePdf({ saleKey: this.saleDetails.saleKey, documentType });
    }

    private async generateDocumentDetails(documentType: DocumentPreviewType = DocumentPreviewType.RECEIPT) {
        this.setDocumentDetails();
        this.documentPreviewType = documentType;

        await this.generateDocument(documentType);

        this.documentPreviewMode = true;
    }

    async mounted() {
        const saleKey = this.$route.params.saleKey;

        await Promise.all([this.salesModule.getSaleDetails(saleKey), this.salesModule.getPaymentAccounts()]);

        // this.generateDocumentDetails();
    }
}
</script>

<style lang="scss"></style>
