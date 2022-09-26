<template>
    <div>
        <section class="tax-liability-details">
            <div class="tax-liability-details__card">
                <div class="tax-liability-details__card--top">Tax Payable</div>
                <div class="tax-liability-details__card--middle">
                    <p class="tax-liability-details__card--middle-text">
                        {{ selectedLiability.taxPayable | amountWithCurrency }}
                    </p>
                    <img
                        :src="require('@/assets/img/liability-payable.svg')"
                        class="tax-liability-details__card--middle-icon"
                    />
                </div>
                <div class="tax-liability-details__card--bottom">
                    <div class="tax-liability-details__card--bottom-text">
                        <p class="tax-liability-details__card--bottom-value">{{ selectedLiability.period }}</p>
                        <p class="tax-liability-details__card--bottom-name">
                            Period
                        </p>
                    </div>
                    <div class="tax-liability-details__card--bottom-text">
                        <p class="tax-liability-details__card--bottom-value">{{ selectedLiability.jurisdiction }}</p>
                        <p class="tax-liability-details__card--bottom-name">Jurisdiction</p>
                    </div>
                    <div class="tax-liability-details__card--bottom-text">
                        <p class="tax-liability-details__card--bottom-value">
                            {{ selectedLiability.filingDeadline | monthDateYearFormat }}
                        </p>
                        <p class="tax-liability-details__card--bottom-name">Filing Deadline</p>
                    </div>
                </div>
            </div>

            <div class="tax-liability-details__card">
                <div class="tax-liability-details__card--top">Payments</div>
                <div class="tax-liability-details__card--middle">
                    <p class="tax-liability-details__card--middle-text">
                        {{ selectedLiability.amountPaid | amountWithCurrency }}
                    </p>

                    <img
                        :src="require('@/assets/img/tax-liability-payment.svg')"
                        class="tax-liability-details__card--middle-icon"
                    />
                </div>
                <div class="tax-liability-details__card--bottom">
                    <div class="tax-liability-details__card--bottom-text">
                        <p class="tax-liability-details__card--bottom-value">
                            {{ selectedLiability.balance | amountWithCurrency }}
                        </p>
                        <p class="tax-liability-details__card--bottom-name">Balance Remaining</p>
                    </div>

                    <div class="tax-liability-details__card--bottom-text">
                        <p class="tax-liability-details__card--bottom-value">July 21, 2020</p>
                        <p class="tax-liability-details__card--bottom-name">Payment Date</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="tax-liability-details tax-liability-actions">
            <div
                class="tax-liability-details__card pointer tax-liability-actions__bottom-section"
                @click="handleModalOpen(0)"
            >
                <img
                    class="tax-liability-details__card--icon"
                    alt="Record Payment Icon"
                    src="@/assets/img/tax/record-payment.svg"
                />
                <p class="tax-liability-details__card--payment-text">Record Payment</p>
            </div>

            <div
                class="tax-liability-details__card pointer tax-liability-actions__bottom-section"
                @click="handleModalOpen(1)"
            >
                <img
                    class="tax-liability-details__card--icon"
                    alt="Upload Filing Document Icon"
                    src="@/assets/img/tax/upload-filing-document.svg"
                />
                <p class="tax-liability-details__card--payment-text">Upload Filing Document</p>
            </div>
        </section>

        <section class="tax-liability-details-contents">
            <header class="tax-liability-documents-section__header">Filing Records</header>

            <aside class="tax-liability-documents-section">
                <section class="tax-liability-documents-section__empty" v-if="noPaymentsMadeYet">
                    No Payments Yet
                </section>

                <ul class="tax-liability-payments" v-else>
                    <li
                        class="tax-liability-payments__row"
                        v-for="payment in taxLiabilityPayments"
                        :key="payment.transactionDate"
                    >
                        <div>
                            <p>{{ payment.transactionDate | monthDateYearFormat }}</p>
                            <p class="tax-liability-payments__row--amount">
                                {{ payment.amountPaid | amountWithCurrency }}
                            </p>
                        </div>

                        <div class="tax-liability-payments__row--documents">
                            <article
                                class="tax-liability-documents-section__document"
                                v-for="({ title }, index) in payment.documents"
                                :key="index"
                            >
                                <img
                                    src="@/assets/img/tax/document-attach.svg"
                                    alt="Attach a document"
                                    class="tax-liability-documents-section__document--attach-icon"
                                />
                                <div>
                                    <p class="tax-liability-documents-section__document--title">{{ title }}</p>
                                </div>

                                <img src="@/assets/img/tax/download.svg" alt="Download button" />

                                <img src="@/assets/img/tax/delete-document.svg" alt="Delete button" />
                            </article>
                        </div>
                    </li>
                </ul>
            </aside>

            <header class="tax-liability-documents-section__header mt-4">Transactions</header>

            <TaxLiabilityDetails :taxType="taxType" :transactions="filteredTaxLiabilities" />
        </section>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="hideModal">
            <component
                :is="componentsList[activeComponentIndex]"
                @tax-remitted="hideModal"
                :liability="selectedLiability"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import TaxLiabilityDetails from '@/pages/TaxAndRemittance/TaxLiabilities/TaxLiabilitiesDetails/TaxLiabilityDetails.vue';
import RemitTax from '@/pages/TaxAndRemittance/TaxLiabilities/RemitTax.vue';

import {
    TaxLiability,
    TaxLiabilityPayment,
    taxLiabilityStub,
    TaxLiabilityTransaction,
} from '@/pages/TaxAndRemittance/types';
import { TaxTypes } from '@/pages/TaxAndRemittance/types';

import SessionStorageService from '@/services/sessionStorage';

import TaxMixin from '@/pages/TaxAndRemittance/TaxMixin';
import DynamicComponentMixin from '@/mixins/dynamicComponents';

@Component({
    components: {
        TaxLiabilityDetails,
    },
})
export default class TaxLiabilitiesDetail extends Mixins(TaxMixin, DynamicComponentMixin) {
    @Prop({ default: TaxTypes.VAT }) readonly taxType!: TaxTypes;

    private selectedLiability: TaxLiability = { ...taxLiabilityStub };
    private componentsList: Array<object> = [RemitTax];

    private modalId = 'tax-liability-modal';

    get modalTitle(): string {
        if (this.activeComponentIndex === 0) {
            const { taxType, period } = this.selectedLiability;

            return `Tax Payment (${taxType} - ${period})`;
        }

        return 'Upload Filing Document';
    }

    get thereAreNoPaymentAccounts(): boolean {
        return this.updatePaymentAccounts.length === 0;
    }

    get filteredTaxLiabilities() {
        return this.taxLiabilityTransactions.filter((item: TaxLiabilityTransaction) => item.tax.amount > 0);
    }

    get taxLiabilityPayments(): Array<TaxLiabilityPayment> {
        return [];
    }

    get noPaymentsMadeYet(): boolean {
        return this.taxLiabilityPayments.length === 0;
    }

    private showModal() {
        this.$bvModal.show(this.modalId);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private async makeInitialRequests(taxLiabilitySumKey: string) {
        const { getTaxLiabilityTransactions } = this.taxModule;
        const { getPaymentAccounts } = this.expenseModule;

        await Promise.all([getTaxLiabilityTransactions(taxLiabilitySumKey), getPaymentAccounts()]);
    }

    private handleModalOpen(activeComponentIndex: number) {
        if (activeComponentIndex > 0) return;
        this.setActiveComponentIndex(activeComponentIndex);

        this.$nextTick(() => {
            this.showModal();
        });
    }

    created() {
        let taxLiability = SessionStorageService.getItem('tax-liability');
        if (!taxLiability) return;

        taxLiability = JSON.parse(taxLiability);

        this.makeInitialRequests(taxLiability.taxLiabilitySumKey);

        this.selectedLiability = taxLiability;
    }
}
</script>

<style lang="scss">
@import '@/styles/pages/tax/tax-table';
@import '@/styles/pages/tax/tax-liability-details';
</style>
