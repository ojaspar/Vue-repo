<template>
    <b-container fluid class="p-0 loan-details">
        <LoanDetailsCards :loanDetailsCard="loanDetailsCard" />

        <div class="loan-details__payment-btn-container">
            <BasePrimaryButton buttonText="Add Payment" @button-clicked="displayPaymentModal" />
        </div>

        <LoanDetailsTable :paymentHistory="loanRepayments" :requestStatus="financingRequestStatus.getLoanRepayments" />

        <div class="loan-details__payment-btn-container--bottom">
            <BasePrimaryButton buttonText="Add Payment" @button-clicked="displayPaymentModal" />
        </div>

        <BaseModal :modalId="paymentModal" modalTitle="Add Loan Payment" @hide-modal="hidePaymentModal">
            <LoanRepaymentForm :servicingLoan="loanKey" @loan-repayment-recorded="handleRepaymentSuccess" />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import LoanDetailsCards from '@/pages/Financing/Loan/LoanDetailsCards.vue';
import LoanDetailsTable from '@/pages/Financing/Loan/LoanDetailsTable.vue';
import LoanRepaymentForm from '@/pages/Financing/Loan/LoanRepaymentForm.vue';

import { LoanRepaymentHistory, LoanCardDetails } from '@/pages/Financing/Loan/types';
import { FinancingRequestStatus } from '@/pages/Financing/Capital/types';

import UtilityMixins from '@/mixins/Utility';
import FinanceModule from '@/store/modules/finance';

const finance = namespace('finance');
let financeModule: FinanceModule;

@Component({ components: { LoanDetailsCards, LoanDetailsTable, LoanRepaymentForm } })
export default class LoanDetailsPage extends Mixins(UtilityMixins) {
    private paymentModal = 'payment-modal';

    private loanKey = '';

    @finance.State
    private financingRequestStatus!: FinancingRequestStatus;

    @finance.State
    private loanDetailsCard!: LoanCardDetails;

    @finance.State
    private loanRepayments!: LoanRepaymentHistory;

    private displayPaymentModal() {
        this.displayModal(this.paymentModal);
    }

    private hidePaymentModal() {
        this.cancelModal(this.paymentModal);
    }

    private handleRepaymentSuccess() {
        this.getLoanHistory(this.loanKey);
        setTimeout(() => {
            this.hidePaymentModal();
        }, 1500);
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Loan Details - Payment History');
    }

    private getLoanKey() {
        const { loanKey } = this.$route.params;
        if (!loanKey) {
            this.$router.push({ name: 'Financing' });
            return;
        }
        this.loanKey = loanKey;
        this.getLoanHistory(loanKey);
    }

    private async getLoanHistory(loanKey: string) {
        await Promise.all([financeModule.getLoanDetailsCard(loanKey), financeModule.getLoanRepayments(loanKey)]);
    }

    mounted() {
        financeModule = getModule(FinanceModule, this.$store);
        this.emitMobilePageTitle();
        this.getLoanKey();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/loan-details';
</style>
