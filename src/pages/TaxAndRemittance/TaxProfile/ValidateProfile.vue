<template>
    <div class="tax-page-container">
        <div class="tax-page-container__heading">Profile Validation</div>

        <b-row>
            <!-- Tax Jurisdiction -->
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    defaultSelectField="true"
                    defaultOptionText="-- Select Jurisdiction --"
                    floatingLabelText="Jurisdiction"
                    keyProperty="key"
                    valueProperty="key"
                    textProperty="name"
                    :options="jurisdictions"
                    @input="setJurisdiction"
                />
            </b-col>
        </b-row>

        <template v-if="userHasSelectedJurisdiction">
            <b-row v-if="jurisdictionIsState" key="state">
                <!-- Select State -->
                <b-col>
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultSelectField="true"
                        defaultOptionText="-- Select State --"
                        floatingLabelText="State"
                        keyProperty="key"
                        valueProperty="name"
                        textProperty="name"
                        :options="states"
                        @input="setRemittanceState"
                    />
                </b-col>
            </b-row>

            <b-row key="taxId" v-if="showTaxIdInput">
                <!-- Input TIN/TID -->
                <b-col>
                    <BaseInputFieldWithBorderAndFloatingLabel :floatingLabelText="taxIdFloatingLabel" v-model="taxId" />
                </b-col>
            </b-row>
        </template>

        <BasePrimaryButton
            className="tax-page-container__submit-button"
            buttonText="Validate"
            @button-clicked="validateTaxProfile"
            :disabled="!userHasProvidedTaxId"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { TaxStationJurisdiction } from '@/pages/TaxAndRemittance/types';

@Component
export default class ValidateProfile extends Vue {
    private jurisdictions = [
        { key: TaxStationJurisdiction.FEDERAL, name: 'FIRS' },
        { key: TaxStationJurisdiction.STATE, name: 'SIRS' },
    ];

    private states = [
        { key: 'ut-utjh-p', name: 'Lagos' },
        { key: 'utjhd-uiu54-8', name: 'Oyo' },
        { key: 'utlut-utjh-p', name: 'Kwara' },
        { key: 'uhd-iu54-8', name: 'Ondo' },
    ];
    private selectedJurisdiction: TaxStationJurisdiction = TaxStationJurisdiction.NONE;
    private selectedState = '';
    private taxId = '';

    get jurisdictionIsState(): boolean {
        return this.selectedJurisdiction === TaxStationJurisdiction.STATE;
    }

    get jurisdictionIsFederal(): boolean {
        return this.selectedJurisdiction === TaxStationJurisdiction.FEDERAL;
    }

    get taxIdFloatingLabel(): string {
        return this.jurisdictionIsState ? 'Enter TID' : 'Enter TIN';
    }

    get userHasSelectedJurisdiction(): boolean {
        return this.selectedJurisdiction !== TaxStationJurisdiction.NONE;
    }

    get userHasProvidedTaxId(): boolean {
        return this.taxId.length > 0;
    }

    get showTaxIdInput(): boolean {
        if (this.jurisdictionIsFederal) return true;

        if (this.jurisdictionIsState && this.selectedState) return true;

        return false;
    }

    @Watch('selectedJurisdiction')
    handler() {
        this.taxId = '';
    }

    private setJurisdiction(taxJurisdiction: TaxStationJurisdiction) {
        this.selectedJurisdiction = taxJurisdiction;
    }

    private setRemittanceState(remittanceState: string) {
        this.selectedState = remittanceState;
    }

    private validateTaxProfile() {
        // hit the endpoint to validate the tax id
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/tax/tax-page';
</style>
