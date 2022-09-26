<template>
    <b-container fluid>
        <!-- Financial Donation-->
        <template v-if="userSelectedFinancialDonationForm">
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Amount Pledged"
                        :value="pledge.pledgeValue | amountWithCurrency"
                        :disabled="true"
                    />
                </b-col>
            </b-row>

            <!-- Value of pledge -->
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Amount to be Redeemed"
                        :value="pledgeRedemptionForm.amountToBeRedeemed | amountWithCurrency"
                        @input="handleAmountInput"
                        :errors="pledgeRedemptionFormError.amountToBeRedeemed"
                        v-floating-number-only
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Paid To"
                        keyProperty="paymentAccountKey"
                        valueProperty="paymentAccountKey"
                        textProperty="displayName"
                        defaultOptionText="-- Select Account --"
                        v-model="pledgeRedemptionForm.paymentAccountKey"
                        @input="validatePaymentAccount"
                        :errors="pledgeRedemptionFormError.paymentAccountKey"
                        :options="paymentAccounts"
                    />
                </b-col>
            </b-row>

            <!-- Remaining Balance -->
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Remaining Balance"
                        :value="remainingAmount | amountWithCurrency"
                        :disabled="true"
                    />
                </b-col>
            </b-row>
        </template>

        <template v-else-if="userSelectedServiceDonationForm">
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Pledged Service"
                        :value="pledge.description | truncate(40)"
                        :disabled="true"
                    />
                </b-col>
            </b-row>

            <!-- Value of pledge -->
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Service Value"
                        :value="pledgeRedemptionForm.amountToBeRedeemed | amountWithCurrency"
                        @input="handleAmountInput"
                        v-floating-number-only
                    />
                </b-col>
            </b-row>

            <!-- Service Status -->
            <b-row>
                <b-col class="p-0">
                    <BaseRadioGroupWithBorderAndFloatingLabel
                        floatingLabelText="Service Status"
                        :radioButtonOptions="redemptionStatusRadioButtonOptions"
                        :checkedValue="pledgeRedemptionForm.redemptionStatus"
                        @change="setServiceRedemptionStatus"
                    />
                </b-col>
            </b-row>
        </template>

        <!-- Financial Donation -->
        <template v-else>
            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Pledge Item"
                        :disabled="true"
                        :value="itemDonationFieldText"
                    />
                </b-col>
            </b-row>

            <!-- Donor  -->
            <b-row v-if="pledge.donorName">
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Donor"
                        :disabled="true"
                        :value="pledge.donorName"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Quantity Redeemed"
                        @input="handleQuantityRedeemed"
                        :value="pledgeRedemptionForm.quantityRedeemed"
                        :errors="pledgeRedemptionFormError.quantityRedeemed"
                    />
                </b-col>

                <!-- Quantity Remaining -->
                <b-col class="p-0 ml-3">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Quantity Remaining"
                        :value="pledgedQuantityRemaining"
                        :disabled="true"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col class="p-0">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Value Of Redeemed Item (Optional)"
                        :value="pledgeRedemptionForm.amountToBeRedeemed | amountWithCurrency"
                        @input="handleAmountInput"
                        v-floating-number-only
                    />
                </b-col>
            </b-row>
        </template>

        <!-- New Pledge Due Date -->
        <b-row>
            <b-col class="p-0">
                <BaseDateFieldWithBorderAndFloatingLabel
                    floatingLabelText="New Due Date"
                    v-model="pledgeRedemptionForm.pledgeDueDate"
                    :errors="pledgeRedemptionFormError.pledgeDueDate"
                    @input="validatePledgeDueDate(pledgeRedemptionForm.pledgeDueDate)"
                />
            </b-col>
        </b-row>

        <b-row class="mt-5 mb-2 justify-content-center">
            <!-- //TODO where there API is ready to handle this request, this will be changed to submit the form -->
            <BasePrimaryButton
                buttonText="Save"
                :disabled="!addDonationFormIsReadyForSubmission"
                @button-clicked="$emit('pledge-redeemed')"
            />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { FormOfDonation, Pledge } from '@/pages/Donations/types';
import { PledgeRedemption, ServiceRedemptionStatus } from '@/pages/Donations/Pledges/types';
import { MoneyObject, PaymentAccount, RadioButtonOption } from '@/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';
import DonationMixin from '@/pages/Donations/DonationMixin';

import SalesModule from '@/store/modules/sale';

const sales = namespace('sale');
let salesModule: SalesModule;

@Component
export default class RedeemPledge extends Mixins(DonationMixin, UtilityMixins, CurrencyMixins) {
    @Prop({ required: true }) pledge!: Pledge;

    private pledgeRedemptionForm: PledgeRedemption = {
        amountToBeRedeemed: { amount: 0, currencyKey: this.pledge.pledgeValue.currencyKey },
        pledgeDueDate: this.formatDateToFitCalendarFormat(this.pledge.pledgeDueDate || ''),
        redemptionStatus: ServiceRedemptionStatus.NOT_FUFILLED,
        quantityRedeemed: 1,
        paymentAccountKey: '',
    };

    private redemptionStatusRadioButtonOptions: RadioButtonOption = {
        name: 'redemptionStatus',
        values: [ServiceRedemptionStatus.NOT_FUFILLED, ServiceRedemptionStatus.FUFILLED],
    };

    @sales.State
    public paymentAccounts!: Array<PaymentAccount>;

    get itemDonationFieldText(): string {
        const { pledgeValue, description, quantityPledged } = this.pledge;
        const truncatedDescripion = this.$options.filters.truncate(description, 30);

        if (pledgeValue.amount && description) {
            const formattedAmount = this.$options.filters.amountWithCurrency(pledgeValue);
            const unitsText = Number(quantityPledged) <= 1 ? 'Unit' : 'Units';
            return `${truncatedDescripion} - ${quantityPledged} ${unitsText} (${formattedAmount})`;
        }

        return truncatedDescripion;
    }

    get userSelectedFinancialDonationForm(): boolean {
        return this.pledge.donationForm === FormOfDonation.FINANCIAL;
    }

    get userSelectedItemDonationForm(): boolean {
        return this.pledge.donationForm === FormOfDonation.ITEM;
    }

    get userSelectedServiceDonationForm(): boolean {
        return this.pledge.donationForm === FormOfDonation.SERVICE;
    }

    get remainingAmount(): MoneyObject {
        const { pledgeValue } = this.pledge;
        const { amountToBeRedeemed } = this.pledgeRedemptionForm;

        return {
            currencyKey: pledgeValue.currencyKey,
            amount: pledgeValue.amount - amountToBeRedeemed.amount,
        };
    }

    get pledgedQuantityRemaining(): number {
        return Number(this.pledge.quantityPledged || 50) - Number(this.pledgeRedemptionForm.quantityRedeemed);
    }

    private handleAmountInput(amount: string) {
        const parsedAmount = this.stripCurrencySymbolFromAmount(amount, this.pledge.pledgeValue.currencyKey.toString());

        this.validateRequiredAmountField(parsedAmount, this.pledgeRedemptionFormError, 'amountToBeRedeemed');

        this.pledgeRedemptionForm.amountToBeRedeemed = Object.assign({}, this.pledgeRedemptionForm.amountToBeRedeemed, {
            ...this.pledgeRedemptionForm.amountToBeRedeemed,
            amount: parsedAmount,
        });
    }

    private validatePaymentAccount() {
        this.validateIfRequiredStringFieldIsEmpty(
            'paymentAccountKey',
            this.pledgeRedemptionForm.paymentAccountKey,
            this.pledgeRedemptionFormError,
        );
    }

    private handleQuantityRedeemed(quantityInput: string) {
        const quantity = Number(this.pledge.quantityPledged || 50);
        const quantityRedeemed = Number(quantityInput);

        this.validateQuantityRedeemed(quantityRedeemed, quantity);

        if (this.hasError(this.pledgeRedemptionFormError.quantityRedeemed)) return;

        this.pledgeRedemptionForm.quantityRedeemed = quantityRedeemed;
    }

    private stripCurrencySymbolFromAmount(amount: string, currencyKey: string): number {
        const strippedAmount = amount
            .split(this.getCurrencySymbolFromCurrencyKey(currencyKey))
            .join('')
            .trim();
        const parsedAmount = this.convertFormattedCurrencyToNumber(strippedAmount.toString());

        return parsedAmount;
    }

    private setServiceRedemptionStatus(serviceRedemptionStatus: ServiceRedemptionStatus) {
        this.pledgeRedemptionForm.redemptionStatus = serviceRedemptionStatus;
    }

    private async getPaymentAccounts() {
        await salesModule.getPaymentAccounts();
    }

    created() {
        salesModule = getModule(SalesModule, this.$store);

        if (this.userSelectedFinancialDonationForm) {
            this.getPaymentAccounts();
        }
    }
}
</script>
