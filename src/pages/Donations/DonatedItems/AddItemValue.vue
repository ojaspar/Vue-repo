<template>
    <b-container fluid>
        <!-- Value of pledge -->
        <b-row>
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    :floatingLabelText="labelPerItemType"
                    :value="form.itemValue | amountWithCurrency"
                    @input="handleAmountInput"
                />
            </b-col>
        </b-row>

        <template v-if="donationIsItemType">
            <b-row>
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        floatingLabelText="Item Usage"
                        keyProperty="key"
                        valueProperty="value"
                        textProperty="displayName"
                        defaultOptionText="Select..."
                        :options="itemUsages"
                        v-model="form.usage"
                    />
                </b-col>
            </b-row>

            <b-row v-if="itemUsageIsProjectOrScheme">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultSelectField="true"
                        defaultOptionText="-- Select Project / Scheme --"
                        keyProperty="donationSchemeKey"
                        valueProperty="donationSchemeKey"
                        textProperty="name"
                        floatingLabelText="Project / Scheme"
                        :options="donationSchemes"
                        v-model="form.donationSchemeKey"
                    />
                </b-col>
            </b-row>
        </template>

        <b-row class="mt-5 mb-2 justify-content-center">
            <BasePrimaryButton buttonText="Save" @button-clicked="$emit('add-item-value', form)" />
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import {
    DonatedItemUsage,
    Donation,
    DonationRequestStatus,
    DonationScheme,
    FormOfDonation,
    ItemValuation,
} from '@/pages/Donations/types';

import DonationModule from '@/store/modules/donation';
import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

const donation = namespace('donation');
let donationModule: DonationModule;

@Component
export default class AddItemValue extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ required: true }) donatedItem!: Donation;

    private form: ItemValuation = {
        itemValue: { amount: 0, currencyKey: 0 },
        usage: DonatedItemUsage.DEFAULT,
        donationSchemeKey: '',
    };

    private itemUsages = [
        { value: 'sale', displayName: 'For Sale', key: 9885 },
        { value: 'project-scheme', displayName: 'For Projects / Schemes', key: 9894 },
        { value: 'undecided', displayName: 'Undecided', key: 9834 },
    ];

    @donation.State
    private donationRequestStatus!: DonationRequestStatus;

    @donation.State
    private donationSchemes!: Array<DonationScheme>;

    get donationIsItemType(): boolean {
        return this.donatedItem.donationForm === FormOfDonation.ITEM;
    }

    get labelPerItemType(): string {
        return this.donationIsItemType ? 'Item Value' : 'Service Value';
    }

    get itemUsageIsProjectOrScheme(): boolean {
        return this.form.usage === DonatedItemUsage.PROJECT_SCHEME;
    }

    private stripCurrencySymbolFromAmount(amount: string, currencyKey: string): number {
        const strippedAmount = amount
            .split(this.getCurrencySymbolFromCurrencyKey(currencyKey))
            .join('')
            .trim();
        const parsedAmount = this.convertFormattedCurrencyToNumber(strippedAmount.toString());

        return parsedAmount;
    }

    private handleAmountInput(amount: string) {
        const parsedAmount = this.stripCurrencySymbolFromAmount(amount, this.form.itemValue.currencyKey.toString());

        this.form.itemValue = Object.assign({}, this.form.itemValue, {
            ...this.form.itemValue,
            amount: parsedAmount,
        });
    }

    private setInitialValues() {
        const { amount } = this.donatedItem;

        this.form.itemValue = { ...amount };
    }

    private async fetchAllProjectSchemes() {
        await donationModule.getDonationSchemes();
    }

    created() {
        donationModule = getModule(DonationModule, this.$store);

        this.fetchAllProjectSchemes();
        this.setInitialValues();
    }
}
</script>
