<template>
    <div>
        <Loader size="3" v-if="initalRequestsAreStillLoading" />
        <template v-else>
            <div class="new-donation__donor-section">
                <DonorListAndSearch
                    :donors="donors"
                    :requestStatus="donationRequestStatus.getDonors"
                    :resetFormInput="resetFormInput"
                    :preselectedDonor="selectedDonor"
                    @donor-selected="handleDonorSelection"
                />
            </div>

            <div class="new-donation__donation-section add-donation-form">
                <!-- Donation Scheme Section -->
                <b-row class="donor-form__field--row">
                    <!-- Item Type -->
                    <b-col class="donor-form__field--input">
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultSelectField="true"
                            defaultOptionText="-- Select Donation Scheme --"
                            keyProperty="donationSchemeKey"
                            valueProperty="donationSchemeKey"
                            textProperty="name"
                            floatingLabelText="Donation Scheme"
                            @input="setDonationSchemeProperties"
                            :value="addDonationForm.donationSchemeKey"
                            :options="donationSchemes"
                            :errors="addDonationFormError.donationSchemeKey"
                        />
                    </b-col>
                </b-row>

                <!-- Form of Donation -->
                <b-row class="donor-form__field--row">
                    <b-col class="donor-form__field--input">
                        <BaseSelectWithBorderAndFloatingLabel
                            defaultSelectField="true"
                            defaultOptionText="-- Select Form of Donation --"
                            keyProperty="key"
                            valueProperty="value"
                            textProperty="displayName"
                            floatingLabelText="Form of Donation"
                            :options="redemptionTypes"
                            @change="handleFormOfDonationSelection"
                            v-model="addDonationForm.donationForm"
                            :disabled="donationSchemeHasNotBeenSelected"
                        />
                    </b-col>
                </b-row>

                <template v-if="formOfDonationHasBeenSelected">
                    <!-- Item Donation Section -->
                    <template v-if="userSelectedItemDonationForm">
                        <b-row class="donor-form__field--row">
                            <!-- Item Type -->
                            <b-col class="donor-form__field--input">
                                <BaseSelectWithBorderAndFloatingLabel
                                    defaultSelectField="true"
                                    defaultOptionText="-- Select Item --"
                                    keyProperty="key"
                                    valueProperty="donationItemTypeKey"
                                    textProperty="name"
                                    floatingLabelText="Item Type"
                                    v-model="addDonationForm.donationItemTypeKey"
                                    :options="donationItemTypes"
                                    :errors="addDonationFormError.donationItemTypeKey"
                                    @input="validateDonationItemTypeKey(addDonationForm.donationItemTypeKey)"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col class="donor-form__field--input">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Quantity"
                                    :value="quantityText"
                                    :errors="addDonationFormError.quantity"
                                    @input="handleQuantityInput"
                                />
                            </b-col>
                        </b-row>
                    </template>

                    <!-- Item Value -->
                    <template v-if="userSelectedItemDonationForm || userSelectedServiceDonationForm">
                        <!-- Description -->
                        <b-row class="donor-form__field--row">
                            <b-col class="donor-form__field--input">
                                <BaseTextAreaWithBorderAndFloatingLabel
                                    floatingLabelText="Description"
                                    v-model="addDonationForm.description"
                                    @input="validateDonationDescription(addDonationForm.description)"
                                    :errors="addDonationFormError.description"
                                />
                            </b-col>
                        </b-row>

                        <b-row class="donor-form__field--row">
                            <b-col class="donor-form__field--input">
                                <BaseRadioGroupWithBorderAndFloatingLabel
                                    floatingLabelText="Do you know the Item Value?"
                                    :radioButtonOptions="itemValueRadioButtonOptions"
                                    :checkedValue="itemValueIsKnown"
                                    @change="setItemValueProperty"
                                />
                            </b-col>
                        </b-row>

                        <b-row v-if="userKnowsItemValue">
                            <!-- Amount -->
                            <b-col class="donor-form__field--input mr-2">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    :floatingLabelText="labelCurrencyText"
                                    :value="amountText"
                                    :errors="addDonationFormError.amount"
                                    @input="handleAmountInput"
                                />
                            </b-col>
                        </b-row>

                        <!-- Item Donation Section ends here-->
                    </template>

                    <!-- Redemption Type -->
                    <b-row class="donor-form__field--row">
                        <b-col class="donor-form__field--input">
                            <BaseRadioGroupWithBorderAndFloatingLabel
                                floatingLabelText="Redemption Type"
                                :radioButtonOptions="redemptionTypeRadioButtonOptions"
                                :checkedValue="addDonationForm.redemptionType"
                                @change="setRedemptionType"
                            />
                        </b-col>
                    </b-row>

                    <!-- Donation Details -->
                    <b-row class="donor-form__field--row">
                        <!-- Amount -->
                        <b-col class="donor-form__field--input mr-2" v-if="userSelectedFinancialDonationForm">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                :floatingLabelText="labelCurrencyText"
                                :value="amountText"
                                :errors="addDonationFormError.amount"
                                @input="handleAmountInput"
                            />
                        </b-col>

                        <!-- Fund Source -->
                        <b-col class="donor-form__field--input" v-if="showFundSourceInput">
                            <BaseSelectWithBorderAndFloatingLabel
                                floatingLabelText="Paid To"
                                keyProperty="paymentAccountKey"
                                valueProperty="paymentAccountKey"
                                textProperty="displayNameWithBalance"
                                defaultOptionText="-- Select Account --"
                                :errors="addDonationFormError.paymentAccountKey"
                                :options="updatedPaymentAccounts"
                                :value="addDonationForm.paymentAccountKey"
                                @change="handlePaymentAccountSelection"
                            />
                        </b-col>

                        <!-- Pledge Due Date -->
                        <b-col class="donor-form__field--input" v-if="userSelectedPledgeDonation">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="Pledge Due Date"
                                v-model="addDonationForm.pledgeDueDate"
                                :errors="addDonationFormError.pledgeDueDate"
                                @input="validatePledgeDueDate(addDonationForm.pledgeDueDate)"
                            />
                        </b-col>
                    </b-row>

                    <b-row>
                        <!-- Transaction Date -->
                        <b-col class="donor-form__field--input">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="Transaction Date"
                                v-model="addDonationForm.transactionDate"
                                :errors="addDonationFormError.transactionDate"
                                @input="validateTransactionDate(addDonationForm.transactionDate)"
                            />
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col>
                            <BaseFileInputWithBorderAndFloatingLabel floatingLabelText="Attachments" v-if="false" />
                        </b-col>
                    </b-row>

                    <!-- Submit Button -->
                    <b-row class="new-donation__footer donor-form__footer">
                        <BasePrimaryButton
                            :buttonText="submitButtonText"
                            className="donor-form__save-btn new-donation__primary-button"
                            @button-clicked="saveDonationAndClearForm"
                            :disabled="disableSubmitButton"
                            :status="saveDonationAndClearFormStatus"
                            :overRideButtonClass="true"
                        />

                        <BasePrimaryButton
                            v-if="isEditMode"
                            buttonText="Cancel"
                            className="donor-form__save-btn new-donation__secondary-button"
                            @button-clicked="goBackToPreviousPage"
                            :overRideButtonClass="true"
                        />

                        <BasePrimaryButton
                            v-else
                            buttonText="Save & Close"
                            className="donor-form__save-btn new-donation__secondary-button"
                            @button-clicked="saveDonationAndGoToDashboard"
                            :disabled="disableSubmitButton"
                            :overRideButtonClass="true"
                            :status="saveDonationAndGoToDashboardStatus"
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
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DonorListAndSearch from '@/pages/Donations/NewDonation/V2/DonorListAndSearch.vue';

import {
    Donation,
    DonationScheme,
    RedemptionType,
    RedemptionTypeOption,
    FormOfDonation,
    DonationItemType,
    DonationRequestStatus,
    defaultDonor,
    Donor,
} from '@/pages/Donations/types';
import { NotificationType, PaymentAccount, RadioButtonOption, SaleRequestStatus, Status } from '@/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

import DonationMixin from '@/pages/Donations/DonationMixin';

import SalesModule from '@/store/modules/sale';
import DonationModule from '@/store/modules/donation';

import SessionStorageService from '@/services/sessionStorage';

const sales = namespace('sale');
const donations = namespace('donation');

let salesModule: SalesModule;
let donationsModule: DonationModule;

@Component({
    components: {
        DonorListAndSearch,
    },
})
export default class AddDonation extends Mixins(CurrencyMixins, DonationMixin, UtilityMixins) {
    @Prop({ default: '' }) action!: string;

    private addDonationForm: Donation = {
        donationForm: FormOfDonation.NONE,
        redemptionType: RedemptionTypeOption.INSTANT,
        amount: { amount: 0, currencyKey: 0 },
        paymentAccountKey: '',
        pledgeDueDate: '',
        itemType: '',
        description: '',
        donationItemTypeKey: '',
        donationSchemeKey: '',
        donorKey: '',
        transactionDate: this.todayAsDefaultDate(),
        quantity: '1',
        schemeName: '',
    };
    private redemptionTypes: Array<RedemptionType> = [
        {
            key: '8984984-18948984-89849-jfjhhf',
            displayName: 'Financial Donation',
            value: 'Financial',
        },
        {
            key: '099984-18948984-89849-jfjhhf',
            displayName: 'Item Donation',
            value: 'Item',
        },
        {
            key: '874684-18984-8849-jfjhhf',
            displayName: 'Service Donation',
            value: 'Service',
        },
    ];

    private redemptionTypeRadioButtonOptions: RadioButtonOption = {
        name: 'redemptionType',
        values: [RedemptionTypeOption.INSTANT, RedemptionTypeOption.PLEDGE],
    };

    private itemValueRadioButtonOptions: RadioButtonOption = {
        name: 'itemValue',
        values: ['Yes', 'No'],
    };

    private itemValueIsKnown = 'No';
    private addSubsequentDonation = false;
    private selectedDonor: Donor = {
        ...defaultDonor,
    };
    private amountText = '';
    private quantityText = '';
    private resetFormInput = false;
    private saveDonationAndClearFormStatus = Status.NORMAL;
    private saveDonationAndGoToDashboardStatus = Status.NORMAL;
    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-donation-toaster',
        position: 'b-toaster-top-right',
    };

    @donations.State
    private donationItemTypes!: Array<DonationItemType>;

    @donations.State
    private donationSchemes!: Array<DonationScheme>;

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    @donations.State
    private donationRequestStatus!: DonationRequestStatus;

    @sales.State
    private salesRequestStatus!: SaleRequestStatus;

    @donations.State
    private donors!: Array<Donor>;

    @donations.State
    private donation!: Donation;

    get isEditMode(): boolean {
        return this.action === 'edit';
    }

    get labelCurrencyText(): string {
        const { userSelectedItemDonationForm, userSelectedServiceDonationForm } = this;
        let text = 'Amount';
        if (userSelectedItemDonationForm) {
            text = 'Current Value';
        }
        if (userSelectedServiceDonationForm) {
            text = 'Value';
        }
        return `${text} (${this.getCurrencySymbolFromCurrencyKey(this.homeCurrencyKey.toString())})`;
    }

    get formOfDonationHasBeenSelected(): boolean {
        return this.addDonationForm.donationForm.length > 0;
    }

    get submitButtonText(): string {
        return this.isEditMode ? 'Save Changes' : 'Save';
    }

    get donationSchemeHasNotBeenSelected(): boolean {
        return this.addDonationForm.donationSchemeKey.length === 0;
    }

    get userSelectedFinancialDonationForm(): boolean {
        return this.addDonationForm.donationForm === FormOfDonation.FINANCIAL;
    }

    get userSelectedItemDonationForm(): boolean {
        return this.addDonationForm.donationForm === FormOfDonation.ITEM;
    }

    get userSelectedServiceDonationForm(): boolean {
        return this.addDonationForm.donationForm === FormOfDonation.SERVICE;
    }

    get userSelectedInstantDonation(): boolean {
        return this.addDonationForm.redemptionType === RedemptionTypeOption.INSTANT;
    }

    get userSelectedPledgeDonation(): boolean {
        return this.addDonationForm.redemptionType === RedemptionTypeOption.PLEDGE;
    }

    get showFundSourceInput(): boolean {
        const { userSelectedFinancialDonationForm, userSelectedInstantDonation } = this;
        return userSelectedFinancialDonationForm && userSelectedInstantDonation;
    }

    get userKnowsItemValue(): boolean {
        return this.itemValueIsKnown === 'Yes';
    }

    get donationsCreationStatus(): string {
        return this.donationRequestStatus.createDonation;
    }

    get donationsUpdateStatus(): string {
        return this.donationRequestStatus.updateDonation;
    }

    get donationIsBeingCreated(): boolean {
        return this.donationsCreationStatus === Status.LOADING;
    }

    get initalRequestsAreStillLoading(): boolean {
        const { getDonors, getDonationItemTypes, getDonationSchemes, getDonationDetails } = this.donationRequestStatus;

        return (
            getDonors === Status.LOADING ||
            getDonationItemTypes === Status.LOADING ||
            getDonationSchemes === Status.LOADING ||
            getDonationDetails === Status.LOADING ||
            this.salesRequestStatus.getPaymentAccounts === Status.LOADING
        );
    }

    get disableSubmitButton(): boolean {
        return !this.addDonationFormIsReadyForSubmission || this.donationIsBeingCreated;
    }

    get updatedPaymentAccounts(): PaymentAccount[] {
        return this.updatePaymentAccounts(this.paymentAccounts);
    }

    private handleDonorSelection(selectedDonor: Donor) {
        this.selectedDonor = selectedDonor;
        this.addDonationForm.donorKey = selectedDonor.donorKey || '';
    }

    private setDonationSchemeProperties(donationSchemeKey: string) {
        const selectedDonationScheme = this.donationSchemes.find(
            (donationScheme: DonationScheme) => donationScheme.donationSchemeKey === donationSchemeKey,
        );

        if (selectedDonationScheme) {
            this.addDonationForm.donationSchemeKey = selectedDonationScheme.donationSchemeKey || '';
            this.addDonationForm.schemeName = selectedDonationScheme.name;
        }
    }

    private setRedemptionType(redemptionType: RedemptionTypeOption) {
        this.addDonationForm.redemptionType = redemptionType;

        if (redemptionType === RedemptionTypeOption.INSTANT) {
            this.addDonationFormError['pledgeDueDate'] = '';
            this.addDonationForm.pledgeDueDate = '';
            return;
        }

        this.addDonationForm.paymentAccountKey = '';
    }

    private setItemValueProperty(itemValueKnown: string) {
        this.itemValueIsKnown = itemValueKnown;

        if (itemValueKnown === 'No') {
            this.addDonationFormError['amount'] = '';
            this.addDonationForm.amount.amount = 0;
        }
    }

    private handleFormOfDonationSelection(donationForm: FormOfDonation) {
        this.addDonationForm.donationForm = donationForm;

        this.$nextTick(() => {
            if (this.userSelectedItemDonationForm) {
                if (!this.quantityText) this.quantityText = '1';
            } else {
                this.addDonationFormError['donationItemTypeKey'] = '';
                this.addDonationFormError['quantity'] = '';
                if (this.userSelectedFinancialDonationForm) {
                    this.addDonationFormError['description'] = '';
                }
            }

            if (!this.userSelectedFinancialDonationForm) {
                this.addDonationFormError['paymentAccountKey'] = '';
                this.addDonationForm.paymentAccountKey = '';
            }
        });
    }

    private handleAmountInput(amountInput: string) {
        const parsedAmount = this.convertFormattedCurrencyToNumber(amountInput);
        if (this.isValidAmount(amountInput)) {
            this.addDonationForm.amount = Object.assign({}, this.addDonationForm.amount, {
                ...this.addDonationForm.amount,
                amount: parsedAmount,
            });
            if (this.userSelectedFinancialDonationForm) {
                this.validateDonationAmountForFinancialDonation(parsedAmount);
            } else {
                this.validateDonationAmountForOtherDonations(parsedAmount);
            }
            this.amountText = this.convertFigureToCurrency(parsedAmount);
        } else {
            if (parsedAmount) this.amountText = this.convertFigureToCurrency(parsedAmount);
            else this.amountText = amountInput;
        }
    }

    private handlePaymentAccountSelection(paymentAccountKey: string) {
        // we need the payment account key and the payment account currency key
        const paymentAccount = this.updatedPaymentAccounts.find(
            (paymentAccount: PaymentAccount) => paymentAccount.paymentAccountKey === paymentAccountKey,
        );
        if (!paymentAccount) {
            this.addDonationFormError['paymentAccountKey'] = 'Invalid';
            return;
        }
        this.$nextTick(() => {
            this.validateIfRequiredStringFieldIsEmpty(
                'paymentAccountKey',
                paymentAccountKey,
                this.addDonationFormError,
            );
        });
        this.addDonationForm.amount.currencyKey = paymentAccount.currencyKey;
        this.addDonationForm.paymentAccountKey = paymentAccount.paymentAccountKey;
    }

    private handleQuantityInput(newValue: string) {
        if (this.validateQuantity(newValue)) {
            const qtyNum = this.convertFormattedFiguresToNumber(newValue);
            this.addDonationForm.quantity = qtyNum.toString();
            this.quantityText = this.convertFigureToCurrency(qtyNum);
        } else {
            this.quantityText = newValue;
        }
    }

    private saveDonationAndGoToDashboard() {
        if (this.addSubsequentDonation) {
            this.addSubsequentDonation = false;
        }

        this.handleDonationFormSubmission();
    }

    private saveDonationAndClearForm() {
        if (!this.addSubsequentDonation) {
            this.addSubsequentDonation = true;
        }

        this.handleDonationFormSubmission();
    }

    private async handleDonationFormSubmission() {
        this.validateAddDonationForm(this.addDonationForm);

        if (!this.addDonationFormIsReadyForSubmission) return;

        this.turnOnLoader();

        const formForSubmission = this.getFormForSubmission();

        if (this.isEditMode) {
            await donationsModule.updateDonation(formForSubmission);
            this.handleDonationUpdate();
            return;
        }

        await donationsModule.createDonation(formForSubmission);
        this.handleDonationCreation();
    }

    private getFormForSubmission() {
        const nullifyAmount = !this.userKnowsItemValue && !this.userSelectedFinancialDonationForm;
        const isItemDonation = this.addDonationForm.donationForm === FormOfDonation.ITEM;

        return {
            ...this.addDonationForm,
            quantity: isItemDonation ? Number(this.addDonationForm.quantity) : null,
            amount: nullifyAmount ? null : this.addDonationForm.amount,
        };
    }

    private handleDonationCreation() {
        if (this.donationsCreationStatus === Status.SUCCESS) {
            this.turnOffLoader();
            this.showNotification(NotificationType.SUCCESS, 'Donation recorded!');
            this.reloadPaymentAccounts();

            if (this.addSubsequentDonation) {
                if (this.action === 'duplicate') {
                    this.$router.push({ name: 'NewDonation' });
                }

                this.clearAllDonationData();
                return;
            }

            setTimeout(() => {
                this.goToDonationsDashboard();
            }, 800);
            return;
        }

        this.turnOffLoader();

        this.showNotification(NotificationType.ERROR, 'An error occured, please try again !');
    }

    private handleDonationUpdate() {
        if (this.donationsUpdateStatus === Status.SUCCESS) {
            this.turnOffLoader();

            this.showNotification(NotificationType.SUCCESS, 'Donation updated!');

            setTimeout(() => {
                this.goToDonationsDashboard();
            }, 800);
            return;
        }

        this.turnOffLoader();
        this.showNotification(NotificationType.ERROR, 'An error occured, please try again !');
    }

    private turnOnLoader() {
        if (this.addSubsequentDonation) {
            this.saveDonationAndClearFormStatus = Status.LOADING;
            return;
        }

        this.saveDonationAndGoToDashboardStatus = Status.LOADING;
    }

    private turnOffLoader() {
        if (this.addSubsequentDonation) {
            this.saveDonationAndClearFormStatus = Status.SUCCESS;
            return;
        }

        this.saveDonationAndGoToDashboardStatus = Status.SUCCESS;
    }

    private resetAddDonationForm() {
        this.addDonationForm = {
            donationForm: FormOfDonation.NONE,
            redemptionType: RedemptionTypeOption.INSTANT,
            amount: { amount: 0, currencyKey: this.homeCurrencyKey },
            paymentAccountKey: '',
            pledgeDueDate: '',
            itemType: '',
            description: '',
            donationItemTypeKey: '',
            donationSchemeKey: '',
            donorKey: '',
            transactionDate: this.todayAsDefaultDate(),
            quantity: '1',
            schemeName: '',
        };
    }

    private goToDonationsDashboard() {
        this.$router.push({ name: 'Donations' });
    }

    private goBackToPreviousPage() {
        this.$router.back();
    }

    private clearAllDonationData() {
        this.resetAddDonationForm();
        this.resetFormInput = true;
        SessionStorageService.removeItem('donation-scheme');
        SessionStorageService.removeItem('donor');
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

    private preloadDefaultValues() {
        if (this.action) {
            const { donorKey, transactionDate, amount, pledgeDueDate = '' } = this.donation;
            const donor = this.donors.find((donor: Donor) => donor.donorKey === donorKey);
            if (donor) {
                this.handleDonorSelection(donor);
            }
            let effectiveTransactionDate = this.todayAsDefaultDate();
            if (this.isEditMode) effectiveTransactionDate = this.formatDateToFitCalendarFormat(transactionDate);

            this.addDonationForm = Object.assign({}, this.addDonationForm, {
                ...this.donation,
                transactionDate: effectiveTransactionDate,
                pledgeDueDate: this.formatDateToFitCalendarFormat(pledgeDueDate),
            });
            this.amountText = this.convertFigureToCurrency(amount.amount);
            if (this.userSelectedItemDonationForm) {
                if (amount.amount) {
                    this.itemValueIsKnown = 'Yes';
                }
            }
            return;
        }
        this.addDonationForm.amount.currencyKey = this.homeCurrencyKey;
        // this.addDonationForm.paymentAccountKey = this.paymentAccounts[0].paymentAccountKey;
        const preselectedDonor = SessionStorageService.getItem('donor');
        if (preselectedDonor) {
            this.handleDonorSelection(JSON.parse(preselectedDonor));
        }
        let preselectedDonationScheme = SessionStorageService.getItem('donation-scheme');
        if (preselectedDonationScheme) {
            preselectedDonationScheme = JSON.parse(preselectedDonationScheme);
            this.$set(this.addDonationForm, 'donationSchemeKey', preselectedDonationScheme.donationSchemeKey);
        }
    }

    private async reloadPaymentAccounts() {
        await salesModule.getPaymentAccounts();
    }

    private assignModules() {
        salesModule = getModule(SalesModule, this.$store);
        donationsModule = getModule(DonationModule, this.$store);
    }

    private async makeInitialRequests() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requests: Array<any> = [
            donationsModule.getDonors(),
            donationsModule.getDonationItemTypes(),
            donationsModule.getDonationSchemes(),
            salesModule.getPaymentAccounts(),
        ];

        const { params } = this.$route;

        if (this.action) {
            requests.push(donationsModule.getDonationDetails(params.donationKey));
        }

        await Promise.all(requests);
        this.preloadDefaultValues();
    }

    created() {
        this.assignModules();
        this.makeInitialRequests();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/new-donation/index.scss';
</style>
