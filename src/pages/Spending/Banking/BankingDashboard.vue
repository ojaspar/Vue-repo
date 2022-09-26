<template>
    <div>
        <!-- Desktop Dashboard-->
        <div class="banking-dashboard">
            <div class="banking-dashboard__header-buttons">
                <!-- Add New Bank Button -->
                <div>
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        :buttonText="'Add Bank Account'"
                        className="banking-dashboard__add-bank-account-btn"
                        @button-clicked="displayBankFormModal"
                    />
                </div>

                <!-- Move Fund Button -->
                <div>
                    <BasePrimaryButton
                        :overRideButtonClass="true"
                        :buttonText="'Move Funds'"
                        className="banking-dashboard__move-funds-btn"
                        @button-clicked="displayFundTransferModal"
                    >
                        <template>
                            <img class="mr-2" src="@/assets/img/transfer-white.svg" />
                        </template>
                    </BasePrimaryButton>
                </div>
            </div>

            <!-- Cash, Bank Table -->
            <div>
                <BankingTable
                    :cashAccount="cashAccount"
                    :bankAccounts="bankAccounts"
                    :fetchBanksRequestIsLoading="fetchBanksRequestIsLoading"
                    @go-to-cash-details-page="goToCashDetailsPage"
                    @go-to-bank-details-page="goToBankDetailsPage"
                    @fund-transfer-icon-clicked="preSelectSourceAccountForTransfer"
                    @add-bank-button-clicked="displayBankFormModal"
                    @fund-transfer-button-clicked="displayFundTransferModal"
                />
            </div>
        </div>

        <!-- Add or Update Bank Account -->
        <BankFormModal
            v-if="showBankFormModal"
            :modalId="bankFormModalId"
            :closeModalOnBackdrop="closeBankModalOnBackdrop"
            @bank-modal-hidden="hideBankFormModal"
            @account-added="$emit('refresh-bank-list')"
            @close-bank-modal-on-backdrop="handleModalBackdrop"
        />

        <!-- Fund Transfer Modal -->
        <FundTransferModal
            v-if="showFundTransferModal"
            :modalId="fundTransferModalId"
            :isSourceAccountSelected="isSourceAccountSelected"
            :selectedSourceAccount="selectedSourceAccount"
            @refresh-bank-list="$emit('refresh-bank-list')"
            @fund-transfer-modal-hidden="hideFundTransferModal"
            @reset-selected-source-account="resetSelectedSourceAccount"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import BankFormModal from '@/pages/Spending/Banking/AddOrEditBankModal.vue';
import BankingTable from '@/pages/Spending/Banking/BankingDashboardTable.vue';
import FundTransferModal from '@/pages/Spending/Banking/FundTransferModal.vue';
import MobileDashboard from '@/pages/Spending/Banking/MobileBankingDashboard.vue';
import DynamicComponentMixin from '@/mixins/dynamicComponents.ts';
import UtilityMixins from '@/mixins/Utility';

import { BankAccount } from '@/pages/Spending/Banking/types';

const defaultBankAccount: BankAccount = {
    bankAccountKey: '',
    bankName: '',
    displayName: '',
    accountName: '',
    accountNumber: '',
    accountBalance: {
        currencyKey: 0,
        amount: 0,
    },
};

@Component({
    components: {
        BankFormModal,
        BankingTable,
        FundTransferModal,
        MobileDashboard,
    },
})
export default class BankingDashboard extends Mixins(UtilityMixins, DynamicComponentMixin) {
    @Prop({ default: () => defaultBankAccount }) readonly cashAccount!: BankAccount;
    @Prop({ default: () => defaultBankAccount }) readonly bankAccounts!: BankAccount[];
    @Prop({ default: false }) readonly fetchBanksRequestIsLoading!: boolean;
    @Prop({ default: false }) readonly closeBankModalOnBackdrop!: boolean;

    pageTitleList = ['Banking', 'Cash Details', 'BankDetails'];

    private showBankFormModal = false;
    private bankFormModalId = 'bank-form-modal-for-adding';
    private showFundTransferModal = false;
    private fundTransferModalId = 'first-transfer-modal';

    private isSourceAccountSelected = false;
    private selectedSourceAccount = '';

    private redirectedFromSumMenu = false;

    get pageTitle() {
        return this.pageTitleList[this.activeComponentIndex];
    }

    get routeName() {
        const { name } = this.$route;
        return name?.toLowerCase() != 'banking' ? name : '';
    }

    private displayBankFormModal() {
        this.showBankFormModal = true;
        this.$nextTick(() => {
            this.$bvModal.show(this.bankFormModalId);
        });
    }

    private hideBankFormModal() {
        this.showBankFormModal = false;
        this.$nextTick(() => {
            this.$bvModal.hide(this.bankFormModalId);
        });
        if (this.redirectedFromSumMenu) {
            this.redirectToDashboard();
        }
    }

    private displayFundTransferModal() {
        this.showFundTransferModal = true;
        this.$nextTick(() => {
            this.$bvModal.show(this.fundTransferModalId);
        });
    }

    private hideFundTransferModal() {
        this.showFundTransferModal = false;
        this.$nextTick(() => {
            this.$bvModal.hide(this.fundTransferModalId);
        });
        if (this.redirectedFromSumMenu) {
            this.redirectToDashboard();
        }
    }

    private cashAccountIsAvailable(cashAccount: BankAccount) {
        return cashAccount.displayName !== '';
    }

    private preSelectSourceAccountForTransfer(selectedAccount: string) {
        this.isSourceAccountSelected = true;
        this.selectedSourceAccount = selectedAccount;
        this.displayFundTransferModal();
    }

    private resetSelectedSourceAccount() {
        this.isSourceAccountSelected = false;
        this.selectedSourceAccount = '';
    }

    private goToCashDetailsPage() {
        this.$emit('go-to-cash-details-page', this.cashAccount, 'Cash');
    }

    private goToBankDetailsPage(accountDetails: BankAccount, accountType: string) {
        this.$emit('go-to-bank-details-page', accountDetails, accountType);
    }

    private handleModalBackdrop(closeModal: boolean) {
        this.$emit('close-bank-modal-on-backdrop', closeModal);
    }

    private redirectToDashboard() {
        this.$router.push({ name: 'Banking' });
        this.redirectedFromSumMenu = false;
    }

    private handleRouteNavigation(routeName: string) {
        if (routeName.toLowerCase() == 'addbank') {
            this.redirectedFromSumMenu = true;
            this.displayBankFormModal();
            return;
        }
        if (routeName.toLowerCase() === 'fundtransfer') {
            this.redirectedFromSumMenu = true;
            this.displayFundTransferModal();
            return;
        }
    }

    @Watch('cashAccount')
    checkCashAccount(cashAccount: BankAccount) {
        if (this.cashAccountIsAvailable(cashAccount)) {
            this.$emit('reset-fetch-banks-request-status');
        }
    }

    @Watch('routeName', { immediate: true })
    watchRouteProp(routeName: string) {
        if (!routeName) return;
        this.handleRouteNavigation(routeName);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/banking-dashboard';
</style>
