<template>
    <b-container fluid class="financing-dashboard__main-wrapper">
        <div class="financing-dashboard">
            <div class="financing-dashboard__top-section">
                <div class="financing-dashboard__top-section--card">
                    <StatementCard :cardDetails="dashboardCardDetails" />
                </div>
                <div class="financing-dashboard__top-section--chart p-0">
                    <p class="financing-dashboard__chart--header">Loan / Capital Ratio</p>
                    <div class="financing-dashboard__chart--container">
                        <FinanceChart :totalCapital="totalAmount.capital" :totalLoan="totalAmount.loan" />
                    </div>
                    <div class="financing-dashboard__chart--text">
                        <p>
                            <font-awesome-icon icon="square" class="financing-dashboard__chart--capital-icon" />
                            Capital
                        </p>
                        <p>
                            <font-awesome-icon icon="square" class="financing-dashboard__chart--loan-icon" />
                            Loan
                        </p>
                    </div>
                </div>
            </div>
            <div class="financing-dashboard__tables">
                <div class="financing-dashboard__tables--loan">
                    <LoanTable :loans="allLoans" @edit-loan="editLoan" />
                </div>
                <div class="financing-dashboard__tables--capital">
                    <CapitalTable :shareholders="shareholders" @edit-shareholder="editShareholder" />
                </div>
            </div>

            <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="closeModal(modalId)">
                <component
                    :is="componentsList[activeComponentIndex]"
                    :shareholderIsBeingEdited="true"
                    :shareholderToBeEdited="selectedShareholder"
                    @shareholder-updated-successfully="closeModal(modalId)"
                />
            </BaseModal>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import StatementCard from '@/pages/Financing/StatementCard.vue';
import FinanceChart from '@/pages/Financing/FinanceChart.vue';
import AddEditShareholderForm from '@/pages/Financing/Capital/AddEditShareholder.vue';
import LoanTable from '@/pages/Financing/LoanTable.vue';
import CapitalTable from '@/pages/Financing/CapitalTable.vue';
import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';
import LoanForm from '@/pages/Financing/Loan/AddLoan/LoanForm.vue';

import { FinanceShareholder, FinanceDasbhboardCard } from '@/pages/Financing/types';
import { defaultShareholder, Shareholder } from '@/pages/Financing/Capital/types';
import { defaultLoan, Loan } from '@/pages/Financing/Loan/types';

import FinanceModule from '@/store/modules/finance';

import UtilityMixins from '@/mixins/Utility';
import DynamicComponentMixin from '@/mixins/dynamicComponents';

const finance = namespace('finance');
let financeModule: FinanceModule;

const shareholderModalTitle = 'Edit Shareholder';
const shareholderModalId = 'edit-sShareholder-modal';
const loanModalTitle = 'Edit Loan';
const loanModalId = 'edit-loan-modal';

@Component({
    components: {
        StatementCard,
        FinanceChart,
        CircularPlusSign,
        LoanTable,
        CapitalTable,
    },
})
export default class FinancingDashboard extends Mixins(UtilityMixins, DynamicComponentMixin) {
    @finance.State
    private dashboardCardDetails!: FinanceDasbhboardCard;

    @finance.State
    private allLoans!: Loan[];

    @finance.State
    private shareholders!: FinanceShareholder[];

    private selectedShareholder: Shareholder = { ...defaultShareholder };
    private selectedLoan: Loan = { ...defaultLoan };
    private componentsList: Array<object> = [AddEditShareholderForm, LoanForm];

    private modalId = '';
    private modalTitle = '';

    get totalAmount() {
        const { totalOutstandingLoan, totalCapitalAmount } = this.dashboardCardDetails;
        let loanAmount = 0;
        let capitalAmount = 0;
        if (totalOutstandingLoan) {
            loanAmount = totalOutstandingLoan.amount || 0;
        }
        if (totalCapitalAmount) {
            capitalAmount = totalCapitalAmount.amount || 0;
        }
        return { loan: loanAmount, capital: capitalAmount };
    }

    private editShareholder(shareholder: Shareholder) {
        this.selectedShareholder = shareholder;
        this.modalTitle = shareholderModalTitle;
        this.modalId = shareholderModalId;

        this.setActiveComponentIndex(0);

        this.$nextTick(() => {
            this.openModal(this.modalId);
        });
    }

    private editLoan(loan: Loan) {
        this.selectedLoan = loan;
        this.modalTitle = loanModalTitle;
        this.modalId = loanModalId;

        this.setActiveComponentIndex(1);

        this.$nextTick(() => {
            this.openModal(this.modalId);
        });
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Financing');
    }

    private async getAllFinanceData() {
        await Promise.all([
            financeModule.getDashboardCardDetails(),
            financeModule.getAllLoans(),
            financeModule.getAllShareholders(),
        ]);
    }

    mounted() {
        this.emitMobilePageTitle();
        financeModule = getModule(FinanceModule, this.$store);

        this.getAllFinanceData();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/dashboard';
</style>
