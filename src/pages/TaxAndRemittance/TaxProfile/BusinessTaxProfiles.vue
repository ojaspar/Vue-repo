<template>
    <b-container class="p-0">
        <!-- Federal Tax Profile -->
        <div class="tax-page-container__tax-profile" v-for="(taxProfile, index) in renderedTaxProfiles" :key="index">
            <div class="tax-page-container__heading">
                <span>{{ taxProfile.taxProfileType }} Tax Profile</span>
                <span v-if="taxProfile.taxIdentity" class="pointer" @click="editTaxProfile(taxProfile.taxProfileType)"
                    ><img src="@/assets/img/pencil.svg"
                /></span>
            </div>

            <div class="tax-station" v-if="taxProfile.taxIdentity">
                <div class="tax-page-container__tax-station-name">
                    <BaseInputFieldWithBorderAndFloatingLabel
                        floatingLabelText="Tax Station"
                        className="tax-page-container__disabled-field"
                        :value="taxProfile.taxStation.name"
                        :disabled="true"
                    />

                    <span
                        :class="[
                            'tax-page-container__registration-status',
                            `tax-page-container__registration-status--${taxRegistrationStatus(taxProfile)}`,
                        ]"
                    >
                        {{ taxRegistrationStatus(taxProfile) | uppercaseFirst }}
                    </span>
                </div>

                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="TIN"
                    className="tax-page-container__disabled-field"
                    :value="taxProfile.taxIdentity"
                    :disabled="true"
                />

                <!-- CAC Forms -->
                <CaCFilePreview
                    :taxProfileForms="[taxProfile.cacForm101, taxProfile.cacForm102, taxProfile.cacForm103]"
                />
            </div>

            <div class="empty-tax-station" v-else>
                <p class="empty-tax-station__text">No Profile Set, Kindly add profile</p>
                <BaseSecondaryButton
                    buttonText="Add Profile"
                    :overRideButtonClass="true"
                    className="empty-tax-station__add-new"
                    @button-clicked="showAddTaxStationModal(taxProfile.taxProfileType)"
                />
            </div>
        </div>

        <BaseModal :modalId="modalId" :modalTitle="modalTitle" @hide-modal="hideModal">
            <AddTaxProfile
                :jurisdiction="activeTaxStationJurisdiction"
                :taxProfileForEdit="selectedTaxProfile"
                :editMode="editMode"
                :states="taxStates"
                :taxStations="taxStations"
                @state-selected="getTaxStationsForSelectedState"
                @hide-modal="hideModal"
            />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AddTaxProfile from '@/pages/TaxAndRemittance/TaxProfile/AddTaxProfile.vue';
import CaCFilePreview from '@/pages/TaxAndRemittance/TaxProfile/CACFilePreview.vue';

import TaxModule from '@/store/modules/tax';

import {
    TaxStation,
    TaxStationJurisdiction,
    defaultTaxRegistrationProfile,
    TaxProfile,
    defaultTaxProfile,
} from '@/pages/TaxAndRemittance/types';
import { CountryState } from '@/types';

const tax = namespace('tax');
let taxModule: TaxModule;

@Component({
    components: {
        AddTaxProfile,
        CaCFilePreview,
    },
})
export default class BusinessTaxProfiles extends Vue {
    private selectedTaxProfile: TaxProfile = {
        ...defaultTaxRegistrationProfile,
        taxStation: {
            stationKey: '',
            name: '',
            stateKey: '',
        },
        taxProfileType: TaxStationJurisdiction.FEDERAL,
        taxIdentity: '',
        taxProfileKey: '',
    };
    private editMode = false;
    private activeTaxStationJurisdiction: TaxStationJurisdiction = TaxStationJurisdiction.FEDERAL;

    @tax.State
    public taxStates!: Array<CountryState>;

    @tax.State
    public taxStations!: Array<TaxStation>;

    @tax.State
    public taxProfiles!: Array<TaxProfile>;

    get renderedTaxProfiles(): Array<TaxProfile> {
        return [this.federalTaxProfile, this.stateTaxProfile];
    }

    get federalTaxProfile(): TaxProfile {
        const federalTaxProfile = this.taxProfiles.find(
            (taxProfile: TaxProfile) => taxProfile.taxProfileType === TaxStationJurisdiction.FEDERAL,
        );

        return federalTaxProfile || defaultTaxProfile;
    }

    get stateTaxProfile(): TaxProfile {
        const federalTaxProfile = this.taxProfiles.find(
            (taxProfile: TaxProfile) => taxProfile.taxProfileType === TaxStationJurisdiction.STATE,
        );

        return federalTaxProfile || { ...defaultTaxProfile, taxProfileType: TaxStationJurisdiction.STATE };
    }

    get taxStationJurisdictionIsFederal(): boolean {
        return this.activeTaxStationJurisdiction === TaxStationJurisdiction.FEDERAL;
    }

    get taxStationJurisdictions() {
        return { federal: TaxStationJurisdiction.FEDERAL, state: TaxStationJurisdiction.STATE };
    }

    get federalTaxProfileIsEmpty(): boolean {
        return this.federalTaxProfile.taxIdentity === '';
    }

    get stateTaxProfileIsEmpty(): boolean {
        return this.stateTaxProfile.taxIdentity === '';
    }

    get modalId(): string {
        return 'add-tax-profile';
    }

    get modalTitle(): string {
        const preText = this.editMode ? 'Edit' : 'Add';

        return `${preText} ${this.activeTaxStationJurisdiction} Tax Profile`;
    }

    private showAddTaxStationModal(activeTaxStationJurisdiction: TaxStationJurisdiction) {
        this.activeTaxStationJurisdiction = activeTaxStationJurisdiction;

        this.showModal();
    }

    private showModal() {
        this.$bvModal.show(this.modalId);
    }

    private hideModal() {
        this.$bvModal.hide(this.modalId);
    }

    private taxRegistrationStatus(profile: TaxProfile) {
        return profile.status || 'pending';
    }

    private async getTaxStationsForSelectedState(stateKey: string) {
        await taxModule.getTaxStations(stateKey);
    }

    private editTaxProfile(activeTaxStationJurisdiction: TaxStationJurisdiction) {
        this.activeTaxStationJurisdiction = activeTaxStationJurisdiction;
        this.editMode = true;

        this.selectedTaxProfile =
            activeTaxStationJurisdiction === TaxStationJurisdiction.STATE
                ? this.stateTaxProfile
                : this.federalTaxProfile;

        this.showModal();
    }

    private async makeInitialRequests() {
        await Promise.all([taxModule.getTaxStates(), taxModule.getTaxProfiles()]);
    }

    created() {
        taxModule = getModule(TaxModule, this.$store);

        this.makeInitialRequests();
    }
}
</script>
