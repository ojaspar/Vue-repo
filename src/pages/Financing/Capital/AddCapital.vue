<template>
    <b-container fluid class="p-0 add-capital-page">
        <div>
            <Loader size="3" v-if="initialRequestsAreStillLoading" />

            <div class="add-capital" v-else>
                <div class="add-capital__shareholder-section">
                    <ShareholdersListAndSearch
                        :shareholders="shareholders"
                        :requestStatus="financingRequestStatus.getAllShareholders"
                        :resetFormInput="resetFormInput"
                        :preselectedShareholder="selectedShareholder"
                        :inputFieldError="addCapitalFormError.shareHolderKey"
                        @shareholder-selected="handleShareholderSelection"
                    />
                </div>

                <div class="add-capital__capital-section add-capital-form">
                    <!-- Form of Donation -->
                    <b-row class="shareholder-form__field--row d-none">
                        <b-col class="shareholder-form__field--input">
                            <BaseSelectWithBorderAndFloatingLabel
                                defaultSelectField="true"
                                defaultOptionText="-- Select Form of Capital --"
                                keyProperty="formOfCapitalKey"
                                textProperty="name"
                                valueProperty="formOfCapitalKey"
                                floatingLabelText="Form of Capital"
                                :options="formsOfCapital"
                                v-model="addCapitalForm.formOfCapitalKey"
                            />
                        </b-col>
                    </b-row>

                    <template v-if="formOfCapitalHasBeenSelected">
                        <!-- Item Donation Section -->
                        <template v-if="userSelectedItemCapitalForm">
                            <b-row class="shareholder-form__field--row">
                                <!-- Item Type -->
                                <b-col class="shareholder-form__field--input">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        defaultSelectField="true"
                                        defaultOptionText="-- Select Item --"
                                        keyProperty="key"
                                        valueProperty="key"
                                        textProperty="name"
                                        floatingLabelText="Item Type"
                                        v-model="addCapitalForm.itemTypeKey"
                                        :options="capitalItemTypes"
                                        @input="validateItemTypeKey"
                                        :errors="addCapitalFormError.itemTypeKey"
                                    />
                                </b-col>
                            </b-row>

                            <b-row>
                                <b-col class="donor-form__field--input">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        floatingLabelText="Quantity"
                                        :value="addCapitalForm.quantity"
                                        :errors="addCapitalFormError.quantity"
                                        @input="handleQuantityInput"
                                    />
                                </b-col>
                            </b-row>
                        </template>

                        <!-- Item Value -->
                        <template v-if="userSelectedItemCapitalForm || userSelectedServiceCapitalForm">
                            <!-- Description -->
                            <b-row class="shareholder-form__field--row">
                                <b-col class="shareholder-form__field--input">
                                    <BaseTextAreaWithBorderAndFloatingLabel
                                        :floatingLabelText="descriptionFieldLabel"
                                        :errors="addCapitalFormError.description"
                                        :value="descriptionValue"
                                        @input="handleDescriptionInput"
                                    />
                                </b-col>
                            </b-row>

                            <b-row>
                                <!-- Amount -->
                                <b-col class="shareholder-form__field--input mr-2">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :floatingLabelText="amountFieldLabel"
                                        :value="convertFigureToCurrency(capitalValue)"
                                        :errors="addCapitalFormError.amount"
                                        @input="handleAmountInput"
                                    />
                                </b-col>
                            </b-row>
                        </template>

                        <!-- Financial Capital Details -->
                        <b-row class="shareholder-form__field--row" v-if="userSelectedFinancialCapitalForm">
                            <!-- Amount -->
                            <b-col class="shareholder-form__field--input mr-2">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    :floatingLabelText="amountFieldLabel"
                                    :value="convertFigureToCurrency(addCapitalForm.contributionValue.amount)"
                                    :errors="addCapitalFormError.amount"
                                    @input="handleAmountInput"
                                />
                            </b-col>

                            <!-- Fund Source -->
                            <b-col class="shareholder-form__field--input">
                                <BaseSelectWithBorderAndFloatingLabel
                                    floatingLabelText="Paid To"
                                    keyProperty="paymentAccountKey"
                                    valueProperty="paymentAccountKey"
                                    textProperty="displayNameWithBalance"
                                    defaultOptionText="-- Select Account --"
                                    :options="updatedPaymentAccounts"
                                    :value="addCapitalForm.paymentAccountKey"
                                    :errors="addCapitalFormError.paymentAccountKey"
                                    @change="handlePaymentAccountSelection"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <!-- Transaction Date -->
                            <b-col class="shareholder-form__field--input">
                                <BaseDateFieldWithBorderAndFloatingLabel
                                    :required="true"
                                    floatingLabelText="Transaction Date"
                                    className="mb-1 w-100"
                                    :errors="addCapitalFormError.transactionDate"
                                    @input="validateTransactionDateField"
                                    v-model="addCapitalForm.transactionDate"
                                />
                            </b-col>
                        </b-row>

                        <b-row v-if="false">
                            <b-col>
                                <BaseFileInputWithBorderAndFloatingLabel floatingLabelText="Attachments" />
                            </b-col>
                        </b-row>

                        <!-- Submit Button -->
                        <b-row class="add-capital__footer shareholder-form__footer">
                            <BasePrimaryButton
                                :buttonText="submitButtonText"
                                className="shareholder-form__save-btn add-capital__primary-button"
                                @button-clicked="saveAddCapitalForm"
                                :disabled="disableSubmitButton"
                                :status="saveAddCapitalFormStatus"
                                :overRideButtonClass="true"
                            />

                            <BasePrimaryButton
                                v-if="isEditMode"
                                buttonText="Cancel"
                                className="shareholder-form__save-btn add-capital__secondary-button"
                                @button-clicked="goBackToPreviousPage"
                                :overRideButtonClass="true"
                            />

                            <BasePrimaryButton
                                v-else
                                buttonText="Save And Close"
                                className="shareholder-form__save-btn add-capital__secondary-button"
                                @button-clicked="saveCapitalAndGoToDashboard"
                                :disabled="disableSubmitButton"
                                :overRideButtonClass="true"
                                :status="saveCapitalAndGoToDashboardStatus"
                            />
                        </b-row>
                    </template>
                    <Toaster
                        :title="toaster.title"
                        :messageBody="toaster.message"
                        :toaster="toaster.position"
                        :variant="toaster.type"
                        :id="toaster.id"
                    />
                </div>
            </div>
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ShareholdersListAndSearch from '@/pages/Financing/Capital/ShareholdersListAndSearch.vue';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import FinancingMixin from '@/pages/Financing/FinancingMixin';

import SalesModule from '@/store/modules/sale';
import FinanceModule from '@/store/modules/finance';

import {
    AddCapitalForm,
    addCapitalFormStub,
    CapitalItemType,
    defaultShareholder,
    FinancingRequestStatus,
    FormOfCapital,
    FormOfCapitalOptions,
    Shareholder,
} from '@/pages/Financing/Capital/types';
import { NotificationType, PaymentAccount, SaleRequestStatus, Status } from '@/types';

const sales = namespace('sale');
const finance = namespace('finance');

let salesModule: SalesModule;
let financeModule: FinanceModule;

@Component({
    components: {
        ShareholdersListAndSearch,
    },
})
export default class AddCapital extends Mixins(CurrencyMixins, UtilityMixins, FinancingMixin) {
    private addCapitalForm: AddCapitalForm = {
        ...addCapitalFormStub,
        transactionDate: this.todayAsDefaultDate(),
    };

    private addSubsequentCapital = false;
    private selectedShareholder: Shareholder = {
        ...defaultShareholder,
    };
    private resetFormInput = false;
    private saveAddCapitalFormStatus = Status.NORMAL;
    private saveCapitalAndGoToDashboardStatus = Status.NORMAL;

    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-capital-toaster',
        position: 'b-toaster-top-right',
    };

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    @finance.State
    private financingRequestStatus!: FinancingRequestStatus;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    @finance.State
    private shareholders!: Array<Shareholder>;

    @finance.State
    private formsOfCapital!: Array<FormOfCapital>;

    @finance.State
    private capitalItemTypes!: Array<CapitalItemType>;

    @finance.State
    private error!: string;

    get pageTitle(): string {
        return 'Add Capital';
    }

    get isEditMode(): boolean {
        return false;
    }

    get amountFieldLabel(): string {
        const { userSelectedItemCapitalForm, userSelectedServiceCapitalForm } = this;
        let text = 'Amount';
        if (userSelectedItemCapitalForm) {
            text = 'Item Value';
        }
        if (userSelectedServiceCapitalForm) {
            text = 'Service Value';
        }
        return `${text} (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }

    get descriptionFieldLabel(): string {
        const { userSelectedItemCapitalForm } = this;

        return userSelectedItemCapitalForm ? 'Item Description' : 'Service Description';
    }

    get capitalValue(): number {
        return this.userSelectedItemCapitalForm
            ? this.addCapitalForm.itemValue.amount
            : this.addCapitalForm.serviceValue.amount;
    }

    get formOfCapitalHasBeenSelected(): boolean {
        return this.addCapitalForm.formOfCapitalKey.length > 0;
    }

    get shareholderHasNotBeenSelected(): boolean {
        return this.addCapitalForm.shareHolderKey.length === 0;
    }

    get submitButtonText(): string {
        return this.isEditMode ? 'Save Changes' : 'Save';
    }

    get userSelectedFinancialCapitalForm(): boolean {
        return this.selectedFormOfCapital === FormOfCapitalOptions.FINANCIAL;
    }

    get userSelectedItemCapitalForm(): boolean {
        return this.selectedFormOfCapital === FormOfCapitalOptions.ITEM;
    }

    get userSelectedServiceCapitalForm(): boolean {
        return this.selectedFormOfCapital === FormOfCapitalOptions.SERVICE;
    }

    get capitalCreationStatus(): string {
        return this.financingRequestStatus.addCapital;
    }

    get capitalUpdateStatus(): string {
        return this.financingRequestStatus.getAllShareholders;
    }

    get capitalIsBeingCreated(): boolean {
        return this.capitalCreationStatus === Status.LOADING;
    }

    get initialRequestsAreStillLoading(): boolean {
        const { getAllShareholders, getCapitalItemTypes } = this.financingRequestStatus;
        const { getPaymentAccounts } = this.salesRequestStatus;

        return (
            getCapitalItemTypes === Status.LOADING ||
            getPaymentAccounts === Status.LOADING ||
            getAllShareholders === Status.LOADING
        );
    }

    get disableSubmitButton(): boolean {
        return false;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    get descriptionValue(): string {
        return this.userSelectedItemCapitalForm
            ? this.addCapitalForm.itemDescription
            : this.addCapitalForm.serviceDescription;
    }

    get selectedFormOfCapital() {
        const { formOfCapitalKey } = this.addCapitalForm;

        const selectedFormOfCapital: FormOfCapital = this.formsOfCapital.filter(
            (formOfCapital: FormOfCapital) => formOfCapital.formOfCapitalKey === formOfCapitalKey,
        )[0];

        return selectedFormOfCapital?.name;
    }

    private handleShareholderSelection(selectedShareholder: Shareholder) {
        this.selectedShareholder = selectedShareholder;
        this.addCapitalForm.shareHolderKey = selectedShareholder?.shareHolderKey ?? '';

        this.$nextTick(() => {
            this.validateShareholderKeyField(this.addCapitalForm.shareHolderKey);
        });
    }

    private handleAmountInput(amountInput: string) {
        const parsedAmount = this.convertFormattedCurrencyToNumber(amountInput);

        let field = 'contribution';

        if (this.userSelectedItemCapitalForm) {
            field = 'item';
        } else if (this.userSelectedServiceCapitalForm) {
            field = 'service';
        }

        field = `${field}Value`;

        this.validateRequiredAmountField(parsedAmount, this.addCapitalFormError, 'amount');

        this.$set(this.addCapitalForm, field, { currency: this.homeCurrencyKey, amount: parsedAmount });
    }

    private validateItemTypeKey() {
        this.validateIfRequiredStringFieldIsEmpty(
            'itemTypeKey',
            this.addCapitalForm.itemTypeKey || '',
            this.addCapitalFormError,
        );
    }

    private handleDescriptionInput(description: string) {
        this.validateCapitalDescriptionField(description);

        if (this.userSelectedItemCapitalForm) {
            this.addCapitalForm.itemDescription = description;
            return;
        }

        this.addCapitalForm.serviceDescription = description;
    }

    private handleQuantityInput(quantity: string) {
        const parsedQuantity = this.convertFormattedCurrencyToNumber(quantity);

        this.addCapitalForm.quantity = parsedQuantity;
        this.validateItemQuantityField(quantity);
    }

    private handlePaymentAccountSelection(paymentAccountKey: string) {
        this.validatePaymentAccountField(paymentAccountKey);

        const paymentAccount = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );
        if (!paymentAccount) {
            return;
        }

        this.addCapitalForm.contributionValue.currencyKey = paymentAccount.currencyKey;
        this.addCapitalForm.paymentAccountKey = paymentAccount.paymentAccountKey;
    }

    private saveCapitalAndGoToDashboard() {
        if (this.addSubsequentCapital) {
            this.addSubsequentCapital = false;
        }

        this.handleAddCapitalFormSubmission();
    }

    private saveAddCapitalForm() {
        if (!this.addSubsequentCapital) {
            this.addSubsequentCapital = true;
        }

        this.handleAddCapitalFormSubmission();
    }

    private async handleAddCapitalFormSubmission() {
        this.validateAddCapitalForm(this.addCapitalForm, this.selectedFormOfCapital);

        if (!this.addCapitalFormIsValidated) return;

        this.turnOnLoader();

        if (this.isEditMode) {
            this.handleCapitalUpdate();
            return;
        }

        this.handleCapitalCreation();
    }

    private async handleCapitalCreation() {
        await financeModule.addCapital(this.addCapitalForm);

        if (this.capitalCreationStatus === Status.SUCCESS) {
            this.turnOffLoader();
            this.showNotification(NotificationType.SUCCESS, 'Capital has been added successfully!');

            if (this.addSubsequentCapital) {
                setTimeout(() => {
                    this.getPaymentAccounts();
                    this.clearAllFormData();
                }, 1200);
                return;
            }

            setTimeout(() => {
                this.goToFinancingDashboard();
            }, 800);
            return;
        }

        this.turnOffLoader();

        this.showNotification(NotificationType.ERROR, this.error);
    }

    private handleCapitalUpdate() {
        if (this.capitalUpdateStatus === Status.SUCCESS) {
            this.turnOffLoader();
            this.showNotification(NotificationType.SUCCESS, 'Capital has been updated!');

            setTimeout(() => {
                this.goToFinancingDashboard();
            }, 800);
            return;
        }

        this.turnOffLoader();
        this.showNotification(NotificationType.ERROR, this.error);
    }

    private turnOnLoader() {
        if (this.addSubsequentCapital) {
            this.saveAddCapitalFormStatus = Status.LOADING;
            return;
        }

        this.saveCapitalAndGoToDashboardStatus = Status.LOADING;
    }

    private turnOffLoader() {
        if (this.addSubsequentCapital) {
            this.saveAddCapitalFormStatus = Status.SUCCESS;
            return;
        }

        this.saveCapitalAndGoToDashboardStatus = Status.SUCCESS;
    }

    private resetAddCapitalForm() {
        this.addCapitalForm = { ...addCapitalFormStub };
        this.selectedShareholder = { ...defaultShareholder };
    }

    private goToFinancingDashboard() {
        this.$router.push({ name: 'Financing' });
    }

    private goBackToPreviousPage() {
        this.$router.back();
    }

    private clearAllFormData() {
        this.resetAddCapitalForm();
        this.resetFormInput = true;
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
            });
            return;
        }
        this.showToaster({
            ...this.toaster,
            type: 'danger',
            title: 'Error!',
            message: message || 'An Error Occured',
        });
    }

    private async makeInitialRequests() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requests: Array<any> = [
            this.getPaymentAccounts(),
            financeModule.getCapitalItemTypes(),
            financeModule.getAllShareholders(),
            financeModule.getFormsOfCapital(),
        ];

        await Promise.all(requests);
    }

    private setDefaultValues() {
        this.addCapitalForm.contributionValue.currencyKey = this.homeCurrencyKey;
    }

    private getPaymentAccounts() {
        return salesModule.getPaymentAccounts();
    }

    created() {
        salesModule = getModule(SalesModule, this.$store);
        financeModule = getModule(FinanceModule, this.$store);

        this.setDefaultValues();
        this.makeInitialRequests();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/add-capital';
</style>
