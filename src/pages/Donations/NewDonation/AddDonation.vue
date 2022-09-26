<template>
    <div class="new-donation__donation-section add-donation-form">
        <div class="add-donation-form__name">{{ selectedDonationScheme.name }}</div>

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
                />
            </b-col>
        </b-row>

        <template v-if="donationFormHasBeenSelected">
            <!-- Item Donation Section -->
            <b-row class="donor-form__field--row" v-if="userSelectedItemDonationForm">
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

            <!-- Description -->
            <b-row
                class="donor-form__field--row"
                v-if="userSelectedItemDonationForm || userSelectedServiceDonationForm"
            >
                <b-col class="donor-form__field--input">
                    <BaseTextAreaWithBorderAndFloatingLabel
                        floatingLabelText="Description"
                        v-model="addDonationForm.description"
                        @input="validateDonationDescription(addDonationForm.description)"
                        :errors="addDonationFormError.description"
                    />
                </b-col>
            </b-row>
            <!-- Item Donation Section ends here-->

            <!-- Redemption Type -->
            <b-row class="donor-form__field--row">
                <b-col class="donor-form__field--input">
                    <BaseRadioGroupWithBorderAndFloatingLabel
                        floatingLabelText="Redemption Type"
                        :radioButtonOptions="radioButtonOptions"
                        :checkedValue="addDonationForm.redemptionType"
                        @change="setRedemptionType"
                    />
                </b-col>
            </b-row>

            <!-- Donation Details -->
            <!-- [ep-] -->
            <b-row class="donor-form__field--row">
                <!-- Amount -->
                <b-col class="donor-form__field--input mr-2">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        :floatingLabelText="labelCurrencyText"
                        :value="convertFigureToCurrency(addDonationForm.amount.amount)"
                        :errors="addDonationFormError.amount"
                        required="true"
                        @input="handleAmountInput"
                        v-floating-number-only
                    />
                </b-col>

                <!-- Fund Source -->
                <b-col class="donor-form__field--input" v-if="showFundSourceInput">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Paid To"
                        keyProperty="paymentAccountKey"
                        valueProperty="paymentAccountKey"
                        textProperty="displayName"
                        defaultOptionText="-- Select Account --"
                        v-model="addDonationForm.paymentAccountKey"
                        :options="paymentAccounts"
                    />
                </b-col>

                <!-- Pledge Due Date -->
                <b-col class="donor-form__field--input" v-if="userSelectedPledgeDonation">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        required="true"
                        floatingLabelText="Pledge Due Date"
                        className="mb-1 w-100"
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
                        required="true"
                        floatingLabelText="Transaction Date"
                        className="mb-1 w-100"
                        v-model="addDonationForm.transactionDate"
                        :errors="addDonationFormError.transactionDate"
                        @input="validateTransactionDate(addDonationForm.transactionDate)"
                    />
                </b-col>
            </b-row>

            <!-- Submit Button -->
            <b-row class="donor-form__footer">
                <BasePrimaryButton
                    :buttonText="submitButtonText"
                    className="donor-form__save-btn"
                    @button-clicked="handleDonationFormSubmission"
                    :disabled="!addDonationFormIsReadyForSubmission"
                />
            </b-row>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import {
    Donation,
    DonationScheme,
    DonationSummary,
    RedemptionType,
    RedemptionTypeOption,
    FormOfDonation,
    DonationItemType,
    Donor,
} from '@/pages/Donations/types';
import { PaymentAccount, RadioButtonOption } from '@/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import DonationMixin from '@/pages/Donations/DonationMixin';

import SalesModule from '@/store/modules/sale';
import DonationModule from '@/store/modules/donation';

const sales = namespace('sale');
const donations = namespace('donation');

let salesModule: SalesModule;
let donationsModule: DonationModule;

@Component
export default class AddDonation extends Mixins(CurrencyMixins, DonationMixin, UtilityMixins) {
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
    private radioButtonOptions: RadioButtonOption = {
        name: 'redemptionType',
        values: [RedemptionTypeOption.INSTANT, RedemptionTypeOption.PLEDGE],
    };

    @Prop({ default: () => ({}) }) readonly selectedDonationScheme!: DonationScheme;
    @Prop({ default: () => ({}) }) readonly selectedDonor!: Donor;
    @Prop({ default: '' }) readonly indexOfDonationToBeEdited!: number | string;
    @Prop({ default: () => ({}) }) readonly donationBeingEdited!: DonationSummary;
    @Prop({ default: false }) readonly editMode!: boolean;

    @donations.State
    private donationItemTypes!: Array<DonationItemType>;

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

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

    get donationFormHasBeenSelected(): boolean {
        return this.addDonationForm.donationForm.length > 0;
    }

    get submitButtonText(): string {
        return this.editMode ? 'Save Changes' : 'Add Donation';
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

    private setRedemptionType(redemptionType: RedemptionTypeOption) {
        this.addDonationForm.redemptionType = redemptionType;

        if (redemptionType === RedemptionTypeOption.INSTANT) {
            this.addDonationFormError['pledgeDueDate'] = '';
            this.addDonationForm.pledgeDueDate = '';
        }
    }

    private handleFormOfDonationSelection(donationForm: FormOfDonation) {
        this.addDonationForm.donationForm = donationForm;

        this.$nextTick(() => {
            if (!this.userSelectedFinancialDonationForm) {
                this.addDonationFormError['amount'] = '';
                this.addDonationFormError['donationItemTypeKey'] = '';
                this.addDonationFormError['pledgeDueDate'] = '';
            }
        });
    }

    private handleAmountInput(amount: number) {
        const parsedAmount = this.convertFormattedCurrencyToNumber(amount.toString());

        this.addDonationForm.amount = Object.assign({}, this.addDonationForm.amount, {
            ...this.addDonationForm.amount,
            amount: parsedAmount,
        });

        if (this.userSelectedFinancialDonationForm) {
            this.validateDonationAmountForFinancialDonation(parsedAmount);
            return;
        }

        this.validateDonationAmountForOtherDonations(parsedAmount);
    }

    private handleDonationFormSubmission() {
        this.validateAddDonationForm(this.addDonationForm);

        if (this.addDonationFormIsReadyForSubmission) {
            this.submitAddDonationForm();
            return;
        }
    }

    private submitAddDonationForm() {
        if (this.editMode) {
            this.$emit('update-donation-summary-item', this.addDonationForm);
            return;
        }

        this.$emit('add-donation-to-summary', this.addDonationForm);
    }

    private preloadDefaultValues() {
        this.addDonationForm.amount.currencyKey = this.homeCurrencyKey;

        if (this.editMode) {
            this.addDonationForm = Object.assign({}, this.addDonationForm, { ...this.donationBeingEdited });
            return;
        }
    }

    async created() {
        salesModule = getModule(SalesModule, this.$store);
        donationsModule = getModule(DonationModule, this.$store);

        await Promise.all([salesModule.getPaymentAccounts(), donationsModule.getDonationItemTypes()]);

        this.addDonationForm.paymentAccountKey = this.paymentAccounts[0].paymentAccountKey;
        this.addDonationForm.donationSchemeKey = this.selectedDonationScheme.donationSchemeKey || '';
        this.addDonationForm.donorKey = this.selectedDonor.donorKey || '';
    }

    mounted() {
        this.preloadDefaultValues();
    }
}
</script>
