<template>
    <div>
        <keep-alive v-if="!$root.isMobileScreenSize">
            <transition name="fade" mode="out-in">
                <component
                    :is="componentList[activeComponentIndex]"
                    :selectedAccount="accountDetails"
                    :accountType="accountType"
                    :cashAccount="cashAccount"
                    :bankAccounts="bankAccounts"
                    :fetchBanksRequestIsLoading="fetchBanksRequestIsLoading"
                    :closeBankModalOnBackdrop="closeBankModalOnBackdrop"
                    :componentKey="componentKey"
                    @go-to-cash-details-page="goToCashDetailsPage"
                    @go-to-bank-details-page="goToBankDetailsPage"
                    @section-tab-clicked="goBackToDashboard"
                    @refresh-bank-list="refreshBankList"
                    @edit-bank-details="handleBankDetailsEditing"
                    @reset-fetch-banks-request-status="resetFetchBanksRequestStatus"
                    @close-bank-modal-on-backdrop="setModalClosureOnBackdrop"
                ></component>
            </transition>
        </keep-alive>

        <!--Banking flow for xs screens-->
        <keep-alive v-else>
            <transition name="fade" mode="out-in">
                <component
                    :is="mobileComponentList[activeComponentIndex]"
                    :selectedAccount="accountDetails"
                    :accountType="accountType"
                    :cashAccount="cashAccount"
                    :bankAccounts="bankAccounts"
                    :fetchBanksRequestIsLoading="fetchBanksRequestIsLoading"
                    :bankDetailsAreBeingEdited="bankDetailsAreBeingEdited"
                    :bankToBeEdited="bankToBeEdited"
                    :isMobileScreen="isMobileScreen"
                    :sourceAccount="sourceAccount"
                    :destinationAccount="destinationAccount"
                    :transferAmount="transferAmount"
                    :isSourceAccountSelected="isSourceAccountSelected"
                    :selectedSourceAccount="selectedSourceAccount"
                    :componentKey="componentKey"
                    @go-to-cash-details-page="goToCashDetailsPage"
                    @go-to-bank-details-page="goToBankDetailsPage"
                    @refresh-bank-list="refreshBankList"
                    @edit-bank-details="handleBankDetailsEditing"
                    @bank-added="handleBankAdditionOnMobile"
                    @bank-updated="handleBankUpdateOnMobile"
                    @preselect-account-for-fund-transfer="preSelectSourceAccountForTransfer"
                    @go-to-preview-page="previewFundTransfer"
                    @fund-transfer-successful="handleMobileTransferSuccess"
                    @reset-fetch-banks-request-status="resetFetchBanksRequestStatus"
                ></component>
            </transition>
        </keep-alive>

        <BankFormModal
            v-if="showBankFormModal"
            :modalId="bankFormModalId"
            :bankDetailsAreBeingEdited="bankDetailsAreBeingEdited"
            :bankToBeEdited="bankToBeEdited"
            @bank-modal-hidden="hideBankFormModal"
            @reset-conditions-for-bank-editing="resetConditionForBankEditing"
            @update-bank-details="updateBankDetails"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import BankingDashboard from '@/pages/Spending/Banking/BankingDashboard.vue';
import MobileDashboard from '@/pages/Spending/Banking/MobileBankingDashboard.vue';
import BankFormModal from '@/pages/Spending/Banking/AddOrEditBankModal.vue';
import MobileBankForm from '@/pages/Spending/Banking/AddOrEditBankForm.vue';
import MobileTransferForm from '@/pages/Spending/Banking/FundTransferForm.vue';
import MobileTransferPreviewPage from '@/pages/Spending/Banking/FundTransferPreviewPage.vue';
import AccountDetailsPage from '@/pages/Spending/Banking/AccountDetailsPage.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

import BankModule from '@/store/modules/bank';
import GeneralModule from '@/store/modules/general';

import { BankAccount, BankDetails, BankRequest, MoneyObject } from '@/pages/Spending/Banking/types';
import { Status, VueExtension } from '@/types';

const bank = namespace('bank');
let bankModule: BankModule;

const general = namespace('general');
let generalModule: GeneralModule;

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
    transactionDate: '',
};

const defaultBankToBeEdited: BankAccount = {
    bankAccountKey: '',
    bankName: '',
    displayName: '',
    accountName: '',
    accountNumber: '',
    accountBalance: {
        currencyKey: 0,
        amount: 0,
    },
    sourcePaymentAccountKey: '',
    transactionDate: '',
};

const defaultMoneyObject: MoneyObject = {
    currencyKey: 0,
    amount: 0,
};

@Component({
    components: {
        BankingDashboard,
        MobileDashboard,
        AccountDetailsPage,
        BankFormModal,
        MobileBankForm,
        MobileTransferForm,
        MobileTransferPreviewPage,
    },
})
export default class BankingIndex extends Mixins(DynamicComponentMixin, BankingMixin) {
    public $root!: VueExtension;

    private componentList = [BankingDashboard, AccountDetailsPage];
    private mobileComponentList = [
        MobileDashboard,
        AccountDetailsPage,
        MobileBankForm,
        MobileTransferForm,
        MobileTransferPreviewPage,
    ];

    private accountType = '';
    private accountDetails = { ...defaultBankAccount };
    private aBankhasBeenSelectedForEditing = false;
    private bankDetailsAreBeingEdited = false;
    private bankToBeEdited = { ...defaultBankToBeEdited };
    private componentKey = 0;
    private isMobileScreen = false;
    private sourceAccount = { ...defaultBankAccount };
    private destinationAccount = { ...defaultBankAccount };
    private transferAmount = { ...defaultMoneyObject };
    private fetchBanksRequestIsLoading = false;

    private isSourceAccountSelected = true;
    private selectedSourceAccount = '';

    private showBankFormModal = false;
    private bankFormModalId = 'bank-form-modal-for-editing';
    private closeBankModalOnBackdrop = true;

    @bank.State
    public error!: string;

    @bank.State
    public bankRequest!: BankRequest;

    @bank.State
    private paymentAccounts!: Array<BankAccount>;

    @bank.State
    private paymentAccountDetails!: BankDetails;

    @bank.Action
    public getPaymentAccounts!: () => Array<BankAccount>;

    @general.State
    private mobileBackButtonClicked!: boolean;

    get fetchBanksRequest() {
        return this.bankRequest.getPaymentAccounts;
    }

    get accountDetailsRequest() {
        return this.bankRequest.getAccountDetails;
    }

    get cashAccount(): BankAccount {
        return this.getCashAccount(this.paymentAccounts);
    }

    get bankAccounts() {
        return this.getBankAccounts(this.paymentAccounts);
    }

    get mobilePageTitle() {
        switch (this.activeComponentIndex) {
            case 1:
                return `${this.accountType} Details`;
            case 2:
                return this.bankDetailsAreBeingEdited ? 'Edit Bank Details' : 'New Bank';
            case 3:
            case 4:
                return 'Bank Transfer';
            default:
                return 'Banking';
        }
    }

    private goToCashDetailsPage(accountDetails: BankAccount, accountType: string) {
        this.accountDetails = Object.assign(this.accountDetails, accountDetails);
        this.accountType = accountType;
        this.componentKey += 1;
        this.setActiveComponentIndex(1);
    }

    private goToBankDetailsPage(accountDetails: BankAccount, accountType: string) {
        this.accountDetails = Object.assign(this.accountDetails, accountDetails);
        this.accountType = accountType;
        this.componentKey += 1;
        this.setActiveComponentIndex(1);
    }

    private goBackToDashboard() {
        this.refreshBankList();
        this.setActiveComponentIndex(0);
    }

    private handleBankDetailsEditing(bankAccountKey: string) {
        this.getPaymentAccountDetails(bankAccountKey);
    }

    private processBankModalForEditing() {
        this.bankToBeEdited = Object.assign(this.bankToBeEdited, this.paymentAccountDetails);
        this.bankDetailsAreBeingEdited = true;
        this.aBankhasBeenSelectedForEditing = true;
        if (this.$root.isMobileScreenSize) {
            this.displayMobileBankForm();
            return;
        }
        this.displayBankFormModal();
        this.closeBankModalOnBackdrop = false;
    }

    private resetConditionForBankEditing() {
        this.bankToBeEdited = { ...defaultBankToBeEdited };
        this.bankDetailsAreBeingEdited = false;
        this.aBankhasBeenSelectedForEditing = false;
        this.closeBankModalOnBackdrop = true;
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
    }

    private refreshBankList() {
        this.fetchBanksRequestIsLoading = true;
        this.$nextTick(() => {
            this.getAllAccounts();
        });
    }

    private resetFetchBanksRequestStatus() {
        this.fetchBanksRequestIsLoading = false;
    }

    private updateBankDetails(newUpdate: BankAccount) {
        const {
            accountBalance,
            accountNumber,
            bankName,
            sourcePaymentAccountKey,
            displayName,
            transactionDate,
        } = newUpdate;

        this.accountDetails.accountNumber = accountNumber;
        this.accountDetails.bankName = bankName;
        this.accountDetails.sourcePaymentAccountKey = sourcePaymentAccountKey;
        this.accountDetails.accountBalance = accountBalance;
        this.accountDetails.displayName = displayName;
        this.accountDetails.transactionDate = transactionDate;

        this.componentKey += 1;
    }

    private async getAllAccounts() {
        this.fetchBanksRequestIsLoading = true;
        await bankModule.getPaymentAccounts();
    }

    private async getPaymentAccountDetails(bankAccountKey: string) {
        await bankModule.getPaymentAccountDetails(bankAccountKey);
        if (this.accountDetailsRequest === Status.SUCCESS) {
            this.processBankModalForEditing();
        }
    }

    private displayMobileBankForm() {
        this.setActiveComponentIndex(2);
    }

    private handleBankAdditionOnMobile() {
        this.setActiveComponentIndex(0);
        this.refreshBankList();
    }

    private handleBankUpdateOnMobile() {
        this.resetConditionForBankEditing();
        this.setActiveComponentIndex(0);
        this.refreshBankList();
    }

    private preSelectSourceAccountForTransfer(selectedAccount: string) {
        this.isSourceAccountSelected = true;
        this.selectedSourceAccount = selectedAccount;
        this.displayMobileFundTransferForm();
    }

    private resetSelectedSourceAccount() {
        this.isSourceAccountSelected = false;
        this.selectedSourceAccount = '';
    }

    private displayMobileFundTransferForm() {
        this.isMobileScreen = true;
        this.setActiveComponentIndex(3);
    }

    private previewFundTransfer(
        sourceAccountDetails: BankAccount,
        destinationAccountDetails: BankAccount,
        sourceAmount: MoneyObject,
    ) {
        this.sourceAccount = Object.assign(this.sourceAccount, sourceAccountDetails);
        this.destinationAccount = Object.assign(this.destinationAccount, destinationAccountDetails);
        this.transferAmount = Object.assign(this.transferAmount, sourceAmount);
        this.componentKey += 1;
        this.setActiveComponentIndex(4);
    }

    private handleMobileTransferSuccess() {
        this.resetFundTransferPreviewItems();
        this.setActiveComponentIndex(0);
    }

    private resetFundTransferPreviewItems() {
        this.sourceAccount = { ...defaultBankAccount };
        this.destinationAccount = { ...defaultBankAccount };
        this.transferAmount = { ...defaultMoneyObject };
    }

    private returnToInitialState() {
        this.resetConditionForBankEditing();
        this.resetSelectedSourceAccount();
        this.resetFundTransferPreviewItems();
    }

    private updateParentNavbar() {
        this.$parent.$emit('is-back-button-to-be-shown-in-this-route', true);
        this.$parent.$emit('update-page-title', this.mobilePageTitle);
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeBankModalOnBackdrop = coseModal;
    }

    @Watch('activeComponentIndex')
    activeComponentChanged(componentIndex: number) {
        if (componentIndex === 0) {
            this.returnToInitialState();
            this.$parent.$emit('set-left-icon', 'HAMBURGER');
        } else {
            this.$parent.$emit('set-left-icon', 'BACK');
        }
        this.$parent.$emit('active-component-index', componentIndex);
    }

    @Watch('mobilePageTitle')
    pageTitleChanged() {
        this.$parent.$emit('update-page-title', this.mobilePageTitle);
    }

    @Watch('mobileBackButtonClicked')
    watchMobileBackButtonState(buttonClicked: boolean) {
        if (buttonClicked) {
            this.goBack();
        }
        generalModule.setMobileBackButtonState(false);
    }

    private handleChildComponentsEvents() {
        this.$on('mobile-add-bank-button-clciked', this.displayMobileBankForm);
        this.$on('mobile-fund-transfer-button-clicked', this.displayMobileFundTransferForm);
    }

    created() {
        this.handleChildComponentsEvents();
        this.updateParentNavbar();
    }

    mounted() {
        bankModule = getModule(BankModule, this.$store);
        generalModule = getModule(GeneralModule, this.$store);
        this.getAllAccounts();
    }
}
</script>
