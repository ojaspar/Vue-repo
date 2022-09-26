<template>
    <b-container fluid class="business-details">
        <b-row>
            <b-col>
                <div class="business-details__container">
                    <img src="@/assets/img/mzuri-logo.svg" class="business-details__logo" />

                    <ProgressTracker v-if="!$root.isMobileScreenSize" :activeComponentIndex="3" />

                    <div class="business-details__medium-plus-container">
                        <h1 class="business-details__heading-primary">Business Details</h1>
                        <p class="business-details__heading-secondary">Kindly enter your business details</p>

                        <div class="business-details__block-message-container">
                            <BlockErrorMessage :message="error" />
                        </div>

                        <div class="business-details__input-field-container-medium-plus">
                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Company Name"
                                :className="[hasError(errors.name) ? 'error' : '', 'business-details__input-field']"
                                v-model="businessDetails.name"
                                :errors="errors.name"
                                :required="true"
                                @input="validateEmptyInput('name', businessDetails.name, errors)"
                            />

                            <BaseSelectWithBorderAndFloatingLabel
                                floatingLabelText="Country"
                                v-model="businessDetails.country"
                                :options="countries"
                                keyProperty="key"
                                textProperty="name"
                                valueProperty="key"
                                defaultOptionText="Country"
                                :className="[hasError(errors.country) ? 'error' : '', 'business-details__input-field']"
                                :errors="errors.country"
                                :emitEventObject="true"
                                @input="handleStateChange"
                            />

                            <b-row>
                                <b-col>
                                    <BaseSelectWithBorderAndFloatingLabel
                                        floatingLabelText="State"
                                        v-model="businessDetails.state"
                                        :options="states"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Select State"
                                        v-if="conditionForStateFieldToShow"
                                        :className="[
                                            hasError(errors.state) ? 'error' : '',
                                            'business-details__input-field',
                                        ]"
                                        :errors="errors.state"
                                        @input="validateEmptyInput('state', businessDetails.state, errors)"
                                    />
                                </b-col>
                                <b-col>
                                    <BaseSelectWithBorderAndFloatingLabel
                                        floatingLabelText="Town"
                                        v-model="businessDetails.lga"
                                        :options="lgas"
                                        keyProperty="key"
                                        v-if="conditionForLGAFieldToShow"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Select LGA"
                                        :className="[
                                            hasError(errors.lga) ? 'error' : '',
                                            'business-details__input-field',
                                        ]"
                                        :errors="errors.lga"
                                        @input="validateEmptyInput('lga', businessDetails.lga, errors)"
                                    />
                                </b-col>
                            </b-row>

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Address"
                                :className="[hasError(errors.address) ? 'error' : '', 'business-details__input-field']"
                                v-model="businessDetails.address"
                                :errors="errors.address"
                                id="business-address"
                                :required="true"
                                @input="validateEmptyInput('address', businessDetails.address, errors)"
                            />

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Phone Number"
                                type="tel"
                                :className="[
                                    hasError(errors.phoneNumber) ? 'error' : '',
                                    'business-details__input-field',
                                ]"
                                labelClass="number-label"
                                v-model="businessDetails.phoneNumber"
                                :errors="errors.phoneNumber"
                                :required="true"
                                id="business-phone-number"
                                @input="validatePhoneNumber(businessDetails.phoneNumber, errors)"
                            />

                            <BaseInputFieldWithBorderAndFloatingLabel
                                floatingLabelText="Email Address"
                                type="email"
                                :className="[hasError(errors.email) ? 'error' : '', 'business-details__input-field']"
                                v-model="businessDetails.email"
                                :errors="errors.email"
                                id="buesiness-email"
                                :required="true"
                                @input="validateEmail(businessDetails.email, errors)"
                            />

                            <BaseSelectWithBorderAndFloatingLabel
                                floatingLabelText="Industry"
                                v-model="businessDetails.vertical"
                                :options="businessVerticals"
                                keyProperty="businessVerticalKey"
                                textProperty="name"
                                valueProperty="businessVerticalKey"
                                defaultOptionText="Select Industry"
                                :className="[hasError(errors.vertical) ? 'error' : '', 'business-details__input-field']"
                                :errors="errors.vertical"
                                :emitEventObject="true"
                                @input="handleBusinessVerticalChange"
                            />

                            <BaseSelectWithBorderAndFloatingLabel
                                floatingLabelText="Business Category"
                                v-model="businessDetails.category"
                                :options="businessRegistrationTypes"
                                keyProperty="key"
                                textProperty="name"
                                valueProperty="key"
                                defaultOptionText="Select Registration Type"
                                :className="[hasError(errors.category) ? 'error' : '', 'business-details__input-field']"
                                :errors="errors.category"
                                :emitEventObject="true"
                                @input="handleBusinessCategoryChange"
                            />

                            <b-row v-if="false">
                                <b-col>
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        floatingLabelText="TIN"
                                        v-model="businessDetails.tin"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        :className="[
                                            hasError(errors.tin) ? 'error' : '',
                                            'business-details__input-field',
                                        ]"
                                        @input="validateEmptyInput('tin', businessDetails.tin, errors)"
                                        :errors="errors.tin"
                                    />
                                </b-col>
                                <b-col>
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :floatingLabelText="`${isBusinessName ? 'BN' : 'RC'} Number`"
                                        :className="[
                                            hasError(errors.rcNumber) ? 'error' : '',
                                            'business-details__input-field',
                                        ]"
                                        v-model="businessDetails.rcNumber"
                                        :errors="errors.rcNumber"
                                        :required="true"
                                        v-if="isValidRegistration"
                                        @input="validateEmptyInput('rcNumber', businessDetails.rcNumber, errors)"
                                    />
                                </b-col>
                            </b-row>
                        </div>

                        <BasePrimaryButton
                            buttonText="Next"
                            :overRideButtonClass="true"
                            className="business-details__button"
                            @button-clicked="submitForm"
                            :disabled="conditionForBusinessDetailsButtonToBeDisabled"
                            :status="businessDetailsButtonStatus"
                        />
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Watch, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ProgressTracker from '@/components/ui/ProgressTracker.vue';

import { getBusinessSetupErrors } from '@/utils/formValidator';

import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';

import BusinessModule from '@/store/modules/business';
import AuthModule from '@/store/modules/auth';

import SessionStorageService from '@/services/sessionStorage';

import {
    BusinessRegistrationType,
    CountryState,
    BusinessProfile,
    TargetObject,
    InputValidation,
    Status,
    LGA,
    BusinessRequestStatus,
    Country,
    UserAccountInfo,
    BusinessVertical,
    Toaster,
} from '@/types';

const business = namespace('business');
const auth = namespace('auth');
let businessModule: BusinessModule;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let authModule: AuthModule;

@Component({
    components: {
        ProgressTracker,
    },
})
export default class BusinessDetails extends Mixins(ValidationMixin, UtilityMixins) {
    private businessDetails = {
        name: '',
        address: '',
        state: '',
        lga: '',
        country: '',
        email: '',
        phoneNumber: '',
        tin: '',
        category: '',
        rcNumber: '',
        vertical: '',
    };
    private errors: InputValidation = {
        name: '',
        address: '',
        state: '',
        lga: '',
        tin: '',
        country: '',
        email: '',
        phoneNumber: '',
        category: '',
        rcNumber: '',
        vertical: '',
    };

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'business-details-toaster',
    };

    public businessCategoryText = '';
    public countryText = '';

    @Prop() readonly error!: string;
    @Prop() readonly progress!: number;
    @Prop() readonly businessRegistrationTypes!: Array<BusinessRegistrationType>;
    @Prop() readonly businessVerticals!: Array<BusinessVertical>;

    @auth.State
    public userCredentials!: UserAccountInfo;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    @business.State
    public lgas!: () => Array<LGA>;

    @business.State
    public states!: Array<CountryState>;

    @business.State
    public countries!: Array<Country>;

    @business.Action
    public registerBusiness!: (payload: BusinessProfile) => void;

    @business.Action
    public getStates!: () => Array<CountryState>;

    @business.Action
    public getCountries!: () => void;

    get getCountriesRequestIsLoading(): boolean {
        return this.businessRequestStatus.getCountries === Status.LOADING;
    }

    get isBusinessName(): boolean {
        return this.businessCategoryText.toLowerCase() !== 'limited liability (ltd)';
    }

    get isValidRegistration(): boolean {
        return this.businessDetails.category.length > 0;
    }

    get selectedCountryIsNigeria() {
        return this.countryText === 'Nigeria';
    }

    get conditionForLGAFieldToShow() {
        return this.selectedCountryIsNigeria;
    }

    get conditionForStateFieldToShow() {
        return this.selectedCountryIsNigeria;
    }

    get atLeastOneStatusIsLoading() {
        return Object.values(this.businessRequestStatus).some(status => status === Status.LOADING);
    }

    get conditionForBusinessDetailsButtonToBeDisabled() {
        return this.atLeastOneStatusIsLoading || this.atLeastOneErrorExists(this.errors);
    }

    get businessDetailsButtonStatus() {
        if (this.atLeastOneStatusIsLoading) {
            return 'LOADING';
        }
        return 'NORMAL';
    }

    @Watch('businessDetails.state')
    stateChanged() {
        businessModule.getLGAs(this.businessDetails.state);
    }

    @Watch('isBusinessName')
    isBusinessNameChanged() {
        this.errors.rcNumber = '';
    }

    @Watch('businessRequestStatus.getCountries')
    setDefaultCountryToNigeria() {
        if (this.businessRequestStatus.getCountries === Status.SUCCESS) {
            const defaultCountry = this.countries.find((country: Country) =>
                country.name.toLowerCase().match('nigeria'),
            );

            if (!defaultCountry) return;

            this.businessDetails.country = defaultCountry.key;
            this.countryText = defaultCountry.name;
        }
    }

    public handleBusinessCategoryChange(e: TargetObject) {
        this.businessDetails.category = e.target.value;
        this.validateEmptyInput('category', this.businessDetails.category, this.errors);
        this.businessCategoryText = e.target.options[e.target.selectedIndex].text;
    }

    public handleBusinessVerticalChange(e: TargetObject) {
        this.businessDetails.vertical = e.target.value;
    }

    public handleStateChange(e: TargetObject) {
        this.businessDetails.country = e.target.value;
        this.countryText = e.target.options[e.target.selectedIndex].text;
        this.validateEmptyInput('country', this.businessDetails.country, this.errors);
    }

    public async submitForm() {
        this.errors = getBusinessSetupErrors(this.businessDetails);
        if (!this.formHasError(this.errors)) {
            const payload: BusinessProfile = {
                name: this.businessDetails.name,
                address: this.businessDetails.address,
                email: this.businessDetails.email,
                phoneNumber: this.businessDetails.phoneNumber,
                lgaKey: this.businessDetails.lga,
                rcNumber: this.businessDetails.rcNumber,
                countryKey: this.businessDetails.country,
                businessVerticalKey: this.businessDetails.vertical,
                businessRegistrationTypeKey: this.businessDetails.category,
            };

            await businessModule.registerBusiness(payload);

            if (this.businessRequestStatus.registerBusiness === Status.SUCCESS) {
                this.$emit('business-setup-successful');
            }
        }
    }

    private preloadBusinessDetailsForm() {
        const { email, phoneNumber } = SessionStorageService.decodeToken();

        this.businessDetails = Object.assign({}, this.businessDetails, { ...this.businessDetails, email, phoneNumber });
    }

    created() {
        businessModule = getModule(BusinessModule, this.$store);
        authModule = getModule(AuthModule, this.$store);

        Promise.all([businessModule.getCountries(), businessModule.getStates()]);

        this.preloadBusinessDetailsForm();
    }
}
</script>
