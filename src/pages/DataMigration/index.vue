<template>
    <div class="setup">
        <p class="setup__mobile-page-numbering" v-if="$root.isMobileScreenSize && !isPreviewPage">
            {{ activeComponentIndex + 1 }} / 8
        </p>
        <img
            v-if="conditionForSetupBackButtonToShow"
            src="@/assets/img/back-button.svg"
            class="setup__mobile-back-button pointer"
            @click="handlePreviousSection"
        />
        <div class="setup__page-wrapper">
            <h1 class="setup__primary-heading">Setting up your Business</h1>
            <p class="setup__secondary-heading">
                To get started, you need to provide the current financial position of your business.
            </p>

            <BlockErrorMessage :message="error" />
            <div class="setup__loader-container" v-if="preliminaryRequestAreLoading">
                <Loader size="4" />
            </div>
            <div class="setup__preview-page" v-else>
                <div :class="toggleClassBasedOnIfPreviewPageOrNot" class="d-flex">
                    <div class="p-0 setup__list-container" v-if="!$root.isMobileScreenSize">
                        <div class="setup__list">
                            <div
                                v-for="(setupListItem, index) in setupListItems"
                                :key="index"
                                :class="[
                                    isActiveListItem(index) ? 'setup__selected-section' : '',
                                    `setup__list-item-container pointer ${classForDisablingButtons} `,
                                ]"
                            >
                                <div @click="handleClick(index)" class="setup__list-item">
                                    {{ setupListItem.name }}
                                </div>
                                <div class="setup__arrow-container">
                                    <div class="setup__arrow-overlap" v-if="isActiveListItem(index)"></div>
                                    <img
                                        src="@/assets/img/data-migration-arrow.svg"
                                        class="setup__section-pointer"
                                        v-if="isActiveListItem(index)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-0 setup__page-display" :class="toggleClassBasedOnIfComponentIsPreviewPageOrNot">
                        <img
                            src="../../assets/img/right-data-migration-image.png"
                            class="setup__page-display-image"
                            v-if="conditionForBackgroundImageToShow"
                        />
                        <transition name="slide-up-fade" mode="out-in" appear>
                            <!-- <keep-alive> -->
                            <component
                                :is="componentsList[activeComponentIndex]"
                                :existingCashBalance="cashBalance"
                                :bankAccountList="bankAccountList"
                                :debtorList="debtorList"
                                :creditorList="creditorList"
                                :assetList="assetList"
                                :totalYearExpenses="totalYearExpenses"
                                :totalYearSales="totalYearSales"
                                :previewData="businessMigrationData"
                                :bankAccountToBeEdited="bankAccountToBeEdited"
                                :isEditing="isEditing"
                                @back-link-is-clicked="handlePreviousSection"
                                @add-bank-account-btn-clicked="handleAddBankAccountButtonClick"
                                @add-debtor-btn-clicked="handleAddDebtorButtonClick"
                                @add-creditor-btn-clicked="handleAddCreditorButtonClick"
                                @add-fixed-asset-btn-clicked="handleAddFixedAssetButtonClick"
                                @proceed-to-the-next-section="handleSuccessfulClickOfTheNextButton"
                                @skip-text-has-been-clicked="handleSkip"
                                @edit-bank-account="handleEditOfBankAccount"
                                @edit-add-creditor-modal="handleEditOfAddCreditorModal"
                                @edit-add-debtor="handleEditOfAddDebtor"
                                @edit-add-fixed-asset="handleEditOfFixedAssetModal"
                                @update-financial-year-month-name="updateFinancialYearMonthName"
                                @business-data-has-been-migrated="dataHasBeenMigrated"
                                @failure-migrating-business-data="handlingDataMigrationFailure"
                                @set-business-migration-data-from-store="prepolutateExistingForms"
                                @delete-bank-details="handleDelete"
                                @new-added-bank-details="handleBankAddition"
                                @edit-bank-list="bankAccountHasBeenEdited"
                                @delete-bank-from-list="deleteBankFromList"
                                :creditorToBeEdited="creditorToBeEdited"
                                @edited-creditor="creditorHasBeenEdited"
                                @added-creditor="handleCreditorAddition"
                                @delete-creditor-details="deleteDebtorFromList"
                                @delete-creditor="handleCreditorDelete"
                                :debtorToBeEdited="debtorToBeEdited"
                                @added-debtor="handleDebtorAddition"
                                @hide-add-debtor-modal="hideDebtorModal"
                                @delete-debtor-from-list="deleteDebtorFromList"
                                @edited-debtor="debtorHasBeenEdited"
                                @delete-debtor="handleDeleteDebtors"
                                @added-fixed-asset="handleFixedAssetAddition"
                                @delete-asset="deleteFixedAsset"
                                :assetToBeEdited="assetToBeEdited"
                                :indexOfCreditorObjectToBeEdited="indexOfCreditorObjectToBeEdited"
                                @edited-fixed-asset="fixedAssetHasBeenEdited"
                            />
                            <!-- </keep-alive> -->
                        </transition>
                    </div>
                </div>
                <!-- <AddDebtorModal
                    id="setup__add-debtor-modal"
                    v-if="showAddDebtorModal"
                    :debtorToBeEdited="debtorToBeEdited"
                    :isEditing="isEditing"
                    @added-debtor="handleDebtorAddition"
                    @hide-add-debtor-modal="hideDebtorModal"
                    @delete-debtor-from-list="deleteDebtorFromList"
                    @edited-debtor="debtorHasBeenEdited"
                    :indexOfDebtorObjectToBeEdited="indexOfDebtorObjectToBeEdited"
                />
                <AddCreditorModal
                    id="setup__add-creditor-modal"
                    v-if="showAddCreditorModal"
                    :isEditing="isEditing"
                    @hide-add-creditor-modal="hideCreditorModal"
                    @delete-creditor-from-list="deleteCreditorFromList"
                    :indexOfCreditorObjectToBeEdited="indexOfCreditorObjectToBeEdited"
                />
                <AddFixedAssetModal
                    id="setup__add-fixed-asset-modal"
                    v-if="showAddFixedAssetModal"
                    :assetToBeEdited="assetToBeEdited"
                    :isEditing="isEditing"
                    @added-fixed-asset="handleFixedAssetAddition"
                    @hide-add-asset-modal="hideAddAssetModal"
                    @delete-asset-from-list="deleteAssetFromList"
                    @edited-fixed-asset="fixedAssetHasBeenEdited"
                    :indexOfAssetObjectToBeEdited="indexOfAssetObjectToBeEdited"
                /> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import BusinessModule from '@/store/modules/business';

import FinancialYear from '@/pages/DataMigration/FinancialYear.vue';
import CashBalance from '@/pages/DataMigration/CashBalance.vue';
import AddAccountBalance from '@/pages/DataMigration/AddAccountBalance.vue';
import AddBankIndex from '@/pages/DataMigration/AddBankIndex.vue';
import AddDebtor from '@/pages/DataMigration/AddDebtor.vue';
import AddCreditor from '@/pages/DataMigration/AddCreditor.vue';
import AddFixedAsset from '@/pages/DataMigration/AddFixedAsset.vue';
import EnterTotalSales from '@/pages/DataMigration/EnterTotalSales.vue';
import EnterTotalExpenses from '@/pages/DataMigration/EnterTotalExpenses.vue';
import Preview from '@/pages/DataMigration/Preview.vue';

import AddBankModal from '@/pages/DataMigration/AddBankModal.vue';
import AddDebtorModal from '@/pages/DataMigration/AddDebtorModal.vue';
import AddCreditorModal from '@/pages/DataMigration/AddCreditorModal.vue';
import AddFixedAssetModal from '@/pages/DataMigration/AddFixedAssetModal.vue';
import AddAssetIndex from '@/pages/DataMigration/AddFixedAssetIndex.vue';
import AddCreditorIndex from '@/pages/DataMigration/AddCreditorIndex.vue';

import DynamicComponentMixin from '@/mixins/dynamicComponents';

import { BusinessRequestStatus, Status, VueExtension } from '@/types';
import {
    AssetList,
    BankAccount,
    BankAccountList,
    CreditorList,
    DebtorList,
    BusinessMigrationData,
    BankAccountDetails,
    CreditorDetails,
    Creditor,
    Debtor,
    DebtorDetails,
    Asset,
    AssetDetails,
    CurrencyKeyListData,
} from '@/pages/DataMigration/types';
import { MoneyObject } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import AddDebtorIndex from '@/pages/DataMigration/AddDebtorsIndex.vue';

const business = namespace('business');
let businessModule: BusinessModule;

@Component({
    components: {
        AddBankModal,
        AddDebtorModal,
        AddDebtor,
        AddCreditorModal,
        AddFixedAssetModal,
        EnterTotalSales,
        EnterTotalExpenses,
        Preview,
    },
})
export default class DataMigrationIndex extends Mixins(DynamicComponentMixin, UtilityMixins, CurrencyMixins) {
    private componentsList = [
        FinancialYear,
        CashBalance,
        // AddAccountBalance,
        // AddAccountBalance,
        AddBankIndex,
        // AddDebtor,
        // AddDebtorIndex,
        // AddCreditorIndex,

        // AddCreditor,
        // AddFixedAsset,
        // AddAssetIndex,
        // EnterTotalSales,
        // EnterTotalExpenses,
        Preview,
    ];
    private error = '';
    private initialStateOfBankAccount: BankAccount = {
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountBalance: {
            currencyKey: '',
            amount: '',
        },
        displayName: '',
    };
    private bankAccountToBeEdited = { ...this.initialStateOfBankAccount };
    private financialYearStartMonth = 0;
    private showAddBankModal = false;
    private showAddCreditorModal = false;
    private showAddDebtorModal = false;
    private showAddFixedAssetModal = false;
    private indexOfCreditorObjectToBeEdited = 0;
    private indexOfDebtorObjectToBeEdited = 0;
    private indexOfAssetObjectToBeEdited = 0;
    private cashBalance: MoneyObject = {
        currencyKey: '',
        amount: 0,
    };
    private isEditing = false;
    private indexOfBankAccountObjectToBeEdited = 0;
    private initialStateOfCreditor: Creditor = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        creditorType: '',
        amountOwed: {
            currencyKey: '',
            amount: 0,
        },
        expectedPaymentDate: '',
    };
    private initialStateOfDebtor: Debtor = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        debtorType: '',
        amountOwed: {
            currencyKey: '',
            amount: 0,
        },
        expectedPaymentDate: '',
    };
    private initialStateOfAsset: Asset = {
        assetName: '',
        description: '',
        assetTypeKey: '',
        assetTypeText: '',
        currentValue: {
            currencyKey: '',
            amount: '',
        },
        usefulMonthLife: '48',
    };
    private debtor = { ...this.initialStateOfDebtor };
    private creditorToBeEdited = { ...this.initialStateOfCreditor };
    private debtorToBeEdited = { ...this.initialStateOfDebtor };
    private assetToBeEdited = { ...this.initialStateOfAsset };
    private bankAccountList: Array<BankAccount> = [];
    private debtorList: Array<Debtor> = [];
    private creditorList: Array<Creditor> = [];
    private assetList: Array<Asset> = [];
    private totalYearSales: MoneyObject = {
        currencyKey: this.homeCurrencyKey,
        amount: 0,
    };
    private totalYearExpenses: MoneyObject = {
        currencyKey: this.homeCurrencyKey,
        amount: 0,
    };
    private parentBankAccount: BankAccount = {
        bankName: '',
        accountNumber: '0',
        accountName: '',
        accountBalance: {
            currencyKey: '',
            amount: 0,
        },
        displayName: '',
    };

    handleClick(index: number) {
        if (this.isEditing) {
            this.isEditing = false;
        }
        this.setActiveComponentIndex(index);
    }

    public businessMigrationData: BusinessMigrationData = {
        financialYearStartMonth: 0,
        financialYearMonthName: '',
        cashBalance: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearSales: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearExpenses: {
            currencyKey: 0,
            amount: 0,
        },
        creditorList: [],
        debtorList: [],
        bankAccountList: [],
        assetList: [],
    };
    private handleSkip() {
        if (this.isEditing) {
            this.isEditing = false;
        }
        this.handleNextSection();
    }

    private isPreviewPage = false;
    private isConfirmed = false;
    private setupListItems = [
        {
            name: 'Confirm your Financial Year',
        },
        {
            name: 'Enter your Cash Balance',
        },
        {
            name: 'Add Bank Account',
        },
        // {
        //     name: 'Add Debtors',
        // },
        // {
        //     name: 'Add Creditors',
        // },
        // {
        //     name: 'Add Fixed Assets',
        // },
        // {
        //     name: 'Enter your Total Sales',
        // },
        // {
        //     name: 'Enter your Total Expenses',
        // },
        {
            name: 'Preview',
        },
    ];
    public $root!: VueExtension;

    @business.State
    public currencyKeyList!: Array<CurrencyKeyListData>;

    @business.State
    public businessData!: BusinessMigrationData;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    get preliminaryRequestAreLoading(): boolean {
        return this.businessRequestStatus.getPaymentCurrentKeyList === Status.LOADING;
    }

    get toggleClassBasedOnIfComponentIsPreviewPageOrNot() {
        if (this.isPreviewPage && !this.$root.isMobileScreenSize) {
            // only return this class if the component is the preview page and not a mobile screen
            return 'setup__preview';
        }
        return '';
    }

    get conditonForOtherButtonsToBeDisabled() {
        return !this.businessMigrationData.financialYearStartMonth;
    }

    get classForDisablingButtons() {
        return this.conditonForOtherButtonsToBeDisabled && 'disabled';
    }

    get conditionForSetupBackButtonToShow() {
        return this.activeComponentIndex > 0 && this.$root.isMobileScreenSize;
    }

    get toggleClassBasedOnIfPreviewPageOrNot() {
        if (this.isPreviewPage) {
            return 'setup__list-section-preview';
        }
        return 'setup__list-section-medium-plus';
    }

    get conditionForBackgroundImageToShow() {
        return !this.userIsOnMobile;
    }

    private isActiveListItem(index: number) {
        return this.activeComponentIndex === index;
    }

    public updateFinancialYearMonthName(value: string) {
        this.businessMigrationData.financialYearMonthName = value;
    }

    public handleAddBankAccountButtonClick() {
        this.handleNextSection();
    }

    public handleAddDebtorButtonClick() {
        this.showAddDebtorModal = true;
    }

    public handleAddCreditorButtonClick() {
        this.showAddCreditorModal = true;
    }

    public handleAddFixedAssetButtonClick() {
        this.showAddFixedAssetModal = true;
    }

    public handleBankAddition(bankAccountDetails: BankAccountList) {
        this.bankAccountList.push({ ...bankAccountDetails });
        this.$nextTick(() => {
            this.$set(this.businessMigrationData, 'bankAccountList', this.bankAccountList);
        });
    }

    public handleDelete(index: number) {
        this.bankAccountList.splice(index, 1);
    }

    public handleCreditorDelete(index: number) {
        this.creditorList.splice(index, 1);
    }
    public handleDeleteDebtors(index: number) {
        this.debtorList.splice(index, 1);
    }

    public deleteFixedAsset(index: number) {
        this.assetList.splice(index, 1);
    }

    public async deleteElementFromList(
        indexOfElementToBeDeleted: number,
        listToBeDeletedFrom: Array<BankAccount> | Array<Creditor> | Array<Debtor> | Array<Asset>,
    ) {
        const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to delete?', {
            title: 'Please Confirm',
            size: 'md',
            buttonSize: 'lg',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2 w-100',
            hideHeaderClose: false,
        });

        if (confirmed) {
            // if the user clicks yes
            listToBeDeletedFrom.splice(indexOfElementToBeDeleted, 1);
        }

        return confirmed;
    }

    public async deleteBankFromList(indexOfBankToBeDeleted: number) {
        const isConfirmed = await this.deleteElementFromList(indexOfBankToBeDeleted, this.bankAccountList);
        if (isConfirmed) {
            this.hideBankModal();
        }
    }

    public async deleteCreditorFromList(indexOfCreditorToBeDeleted: number) {
        const isConfirmed = await this.deleteElementFromList(indexOfCreditorToBeDeleted, this.creditorList);
        if (isConfirmed) {
            this.hideCreditorModal();
        }
    }

    public async deleteDebtorFromList(indexOfDebtorToBeDeleted: number) {
        const isConfirmed = this.deleteElementFromList(indexOfDebtorToBeDeleted, this.debtorList);
        if (isConfirmed) {
            this.hideDebtorModal();
        }
    }

    public async deleteAssetFromList(indexOfAssetToBeDeleted: number) {
        const isConfirmed = this.deleteElementFromList(indexOfAssetToBeDeleted, this.assetList);
        if (isConfirmed) {
            this.hideAddAssetModal();
        }
    }

    public handleDebtorAddition(debtorDetails: DebtorList) {
        this.debtorList.push({ ...debtorDetails });
        this.$nextTick(() => {
            this.$set(this.businessMigrationData, 'debtorList', this.debtorList);
        });
    }

    public handleCreditorAddition(creditorDetails: CreditorList) {
        this.creditorList.push({ ...creditorDetails });
        this.$nextTick(() => {
            this.$set(this.businessMigrationData, 'creditorList', this.creditorList);
        });
    }

    public handleFixedAssetAddition(assetDetails: AssetList) {
        this.assetList.push({ ...assetDetails });
        this.$nextTick(() => {
            this.$set(this.businessMigrationData, 'assetList', this.assetList);
        });
    }

    public handleSuccessfulClickOfTheNextButton({ key, value }: { key: string; value: string | object | number }) {
        this.$set(this.businessMigrationData, key, value);
        this.$nextTick(() => {
            this.handleNextSection();
        });
    }

    public handleEditOfBankAccount(bankAccountDetails: BankAccountDetails) {
        this.bankAccountToBeEdited = bankAccountDetails.bankAccount;
        this.isEditing = true;
        this.indexOfBankAccountObjectToBeEdited = bankAccountDetails.index;
    }

    public handleEditOfAddCreditorModal(creditorDetails: CreditorDetails) {
        this.creditorToBeEdited = creditorDetails.creditor;
        this.isEditing = true;
        this.indexOfCreditorObjectToBeEdited = creditorDetails.index;
    }

    public handleEditOfAddDebtor(debtorDetails: DebtorDetails) {
        this.debtorToBeEdited = debtorDetails.debtor;
        this.isEditing = true;
        this.indexOfDebtorObjectToBeEdited = debtorDetails.index;
    }

    public handleEditOfFixedAssetModal(assetDetails: AssetDetails) {
        this.assetToBeEdited = assetDetails.asset;
        this.isEditing = true;
        this.indexOfAssetObjectToBeEdited = assetDetails.index;
    }

    public bankAccountHasBeenEdited(editedAccountDetails: BankAccountList) {
        this.isEditing = false;
        this.bankAccountList.splice(this.indexOfBankAccountObjectToBeEdited, 1, editedAccountDetails);
    }

    public creditorHasBeenEdited(editedCreditorDetails: CreditorList) {
        this.creditorList.splice(this.indexOfCreditorObjectToBeEdited, 1, editedCreditorDetails);
        this.isEditing = false;
        // this.$bvModal.hide('setup__add-creditor-modal');
    }

    public debtorHasBeenEdited(editedDebtorDetails: DebtorList) {
        this.debtorList.splice(this.indexOfDebtorObjectToBeEdited, 1, editedDebtorDetails);
        this.isEditing = false;
        // this.$bvModal.hide('setup__add-debtor-modal');
    }

    public fixedAssetHasBeenEdited(editedAssetDetails: AssetList) {
        this.assetList.splice(this.indexOfAssetObjectToBeEdited, 1, editedAssetDetails);
        // this.$bvModal.hide('setup__add-fixed-asset-modal');
        this.isEditing = false;
    }

    public hideBankModal() {
        this.isEditing = false;
        this.showAddBankModal = false;
    }

    public hideCreditorModal() {
        this.isEditing = false;
        this.showAddCreditorModal = false;
    }

    public hideDebtorModal() {
        this.isEditing = false;
        this.showAddDebtorModal = false;
    }

    public hideAddAssetModal() {
        this.isEditing = false;
        this.showAddFixedAssetModal = false;
    }

    public dataHasBeenMigrated() {
        this.$nextTick(() => {
            this.$router.push({ name: 'Dashboard' });
        });
    }

    public handlingDataMigrationFailure(error: string) {
        this.error = error;
    }

    private prepolutateExistingForms() {
        this.businessMigrationData = this.businessData;

        this.$nextTick(() => {
            const {
                cashBalance,
                debtorList,
                creditorList,
                assetList,
                bankAccountList,
                totalYearSales,
                totalYearExpenses,
            } = this.businessMigrationData;
            //cash balance
            this.cashBalance = cashBalance;
            this.debtorList = debtorList;
            this.creditorList = creditorList;
            this.assetList = assetList;
            this.bankAccountList = bankAccountList;
            this.totalYearSales = totalYearSales;
            this.totalYearExpenses = totalYearExpenses;
        });
    }
    @Watch('activeComponentIndex') // watch the activeComponentIndex so that if the isPreview page boolean is turned to true
    activeComponentIndexChanged(newValue: number, oldValue: number) {
        if (newValue === 8) {
            // when the activeComponentIndex is at the preview page
            this.isPreviewPage = true;
        }
        if (oldValue === 8) {
            // if the page moves away from the preview page, change isPreview page boolean to false
            this.isPreviewPage = false;
        }
    }

    created() {
        businessModule = getModule(BusinessModule, this.$store);
        businessModule.getPaymentCurrencyKeyList();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/data-migration/index.scss';
</style>
