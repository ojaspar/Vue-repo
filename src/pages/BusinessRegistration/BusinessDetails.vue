<template>
    <div class="container-fluid ht-100p m-0 p-0 d-flex">
        <div class="col-lg-7 col-md-10 business-form-container">
            <div class="ht-100p d-flex flex-row justify-content-center">
                <form class="d-flex flex-column align-items-center business-form position-relative">
                    <Error :message="error" v-if="businessRequestStatus.getCountries === 'ERROR'" />
                    <div class="d-flex heading container-fluid align-items-center justify-content-center">
                        <div class="d-flex flex-column m-auto">
                            <p class="business-form__title mb-1">Business Registration</p>
                            <ProgressBar :progress="progress" />
                            <span class="business-form__sub-title text-center">
                                Register your business information</span
                            >
                        </div>
                    </div>
                    <div v-if="getCountriesRequestIsLoading" cols="12">
                        <Loader size="4" />
                    </div>

                    <template v-else>
                        <b-container>
                            <b-row>
                                <b-col sm="12" md="6">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :className="[
                                            hasError(errors.name) ? 'error' : '',
                                            'business-form__input--split-left',
                                        ]"
                                        floatingLabelText="Business Name"
                                        v-model="businessDetails.name"
                                        :errors="errors.name"
                                        :required="true"
                                        id="business-name"
                                        @input="validateEmptyInput('name', businessDetails.name, errors)"
                                    />
                                </b-col>
                                <b-col sm="12" md="6">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        v-model="businessDetails.country"
                                        :options="countries"
                                        floatingLabelText="Country"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Country"
                                        :className="[hasError(errors.country) ? 'error' : '', 'business-form__select']"
                                        :errors="errors.country"
                                        :emitEventObject="true"
                                        @input="handleStateChange"
                                    />
                                </b-col>
                            </b-row>

                            <div class="row form-input">
                                <div class="col-md-6" v-if="conditionForStateFieldToShow">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        v-model="businessDetails.state"
                                        :options="states"
                                        floatingLabelText="State"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Select State"
                                        v-if="conditionForStateFieldToShow"
                                        :className="[
                                            hasError(errors.state) ? 'error' : '',
                                            'business-form__select business-form__select--split-left',
                                        ]"
                                        :errors="errors.state"
                                        @input="validateEmptyInput('state', businessDetails.state, errors)"
                                    />
                                </div>
                                <div class="col-md-6" v-if="conditionForLGAFieldToShow">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        v-model="businessDetails.lga"
                                        :options="lgas"
                                        floatingLabelText="LGA"
                                        keyProperty="key"
                                        v-if="conditionForLGAFieldToShow"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Select LGA"
                                        :className="[
                                            hasError(errors.lga) ? 'error' : '',
                                            'business-form__select business-form__select--split-right',
                                        ]"
                                        :errors="errors.lga"
                                        @input="validateEmptyInput('lga', businessDetails.lga, errors)"
                                    />
                                </div>
                            </div>

                            <b-row>
                                <b-col cols="12">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :className="[hasError(errors.address) ? 'error' : '', 'business-form__input']"
                                        floatingLabelText="Business Address"
                                        v-model="businessDetails.address"
                                        :errors="errors.address"
                                        id="business-address"
                                        :required="true"
                                        @input="validateEmptyInput('address', businessDetails.address, errors)"
                                    />
                                </b-col>
                            </b-row>

                            <div class="row form-input">
                                <div class="col-md-6">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        type="tel"
                                        :className="[
                                            hasError(errors.phoneNumber) ? 'error' : '',
                                            'business-form__input--split-left',
                                        ]"
                                        floatingLabelText="Phone Number"
                                        labelClass="number-label"
                                        v-model="businessDetails.phoneNumber"
                                        :errors="errors.phoneNumber"
                                        :required="true"
                                        id="business-phone-number"
                                        @input="validatePhoneNumber(businessDetails.phoneNumber, errors)"
                                    />
                                </div>
                                <div class="col-md-6">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        type="email"
                                        :className="[
                                            hasError(errors.email) ? 'error' : '',
                                            'business-form__input--split-right',
                                        ]"
                                        floatingLabelText="E-mail"
                                        v-model="businessDetails.email"
                                        :errors="errors.email"
                                        id="buesiness-email"
                                        :required="true"
                                        @input="validateEmail(businessDetails.email, errors)"
                                    />
                                </div>
                            </div>

                            <div class="row form-input">
                                <div class="col-md-6">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        v-model="businessDetails.vertical"
                                        :options="businessVerticals"
                                        keyProperty="businessVerticalKey"
                                        floatingLabelText="Industry"
                                        textProperty="name"
                                        valueProperty="businessVerticalKey"
                                        defaultOptionText="Select Industry"
                                        :className="[hasError(errors.vertical) ? 'error' : '', 'business-form__select']"
                                        :errors="errors.vertical"
                                        :emitEventObject="true"
                                        @input="handleBusinessVerticalChange"
                                    />
                                </div>
                                <div class="col-md-6">
                                    <BaseSelectWithBorderAndFloatingLabel
                                        v-model="businessDetails.category"
                                        :options="businessRegistrationTypes"
                                        floatingLabelText="Registration Type"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        defaultOptionText="Select Registration Type"
                                        :className="[hasError(errors.category) ? 'error' : '', 'business-form__select']"
                                        :errors="errors.category"
                                        :emitEventObject="true"
                                        @input="handleBusinessCategoryChange"
                                    />
                                </div>
                            </div>
                            <div class="row form-input d-none">
                                <div class="col-md-6">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        v-model="businessDetails.tin"
                                        keyProperty="key"
                                        textProperty="name"
                                        valueProperty="key"
                                        floatingLabelText="TIN"
                                        :className="[
                                            hasError(errors.tin) ? 'error' : '',
                                            'business-form__input--split-right',
                                        ]"
                                        :errors="errors.tin"
                                    />
                                </div>
                                <div class="col-md-6" v-if="isValidRegistration">
                                    <BaseInputFieldWithBorderAndFloatingLabel
                                        :className="[
                                            hasError(errors.rcNumber) ? 'error' : '',
                                            'business-form__input--split-left',
                                        ]"
                                        :floatingLabelText="`${isBusinessName ? 'BN' : 'RC'} Number`"
                                        v-model="businessDetails.rcNumber"
                                        :errors="errors.rcNumber"
                                        v-if="isValidRegistration"
                                    />
                                </div>
                            </div>
                        </b-container>
                        <div class="business-form__form-footer">
                            <div class="business-form__button-container ml-auto">
                                <BaseButton
                                    className="uppercase business-form__btn done-btn"
                                    @button-clicked="submitForm"
                                    :disabled="conditionForBusinessDetailsButtonToBeDisabled"
                                    :status="businessDetailsButtonStatus"
                                    buttonText="Continue"
                                />
                            </div>
                        </div>
                    </template>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { getBusinessSetupErrors } from '@/utils/formValidator';
import ValidationMixin from '@/mixins/validation';

import BusinessModule from '@/store/modules/business';
import AuthModule from '@/store/modules/auth';

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
} from '@/types';

const business = namespace('business');
const auth = namespace('auth');
let businessModule: BusinessModule;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let authModule: AuthModule;

@Component
export default class BusinessDetails extends Mixins(ValidationMixin) {
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
                this.$router.push({ name: 'DataMigration' });
            }
        }
    }

    private preloadBusinessDetailsForm() {
        const { email, phoneNumber } = this.userCredentials;

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

<style lang="scss">
@import 'src/styles/pages/business-registration.scss';
</style>
