<template>
    <AuthFooterLayout>
        <div class="business-setup-success" v-if="showBusinessSetupSuccessPage">
            <div class="business-setup-success__container">
                <div class="business-setup-success__image">
                    <img src="@/assets/img/congratulations.svg" />
                </div>

                <p class="business-setup-success__header">Congratulations {{ authenticatedUser.firstName }}</p>
                <p class="business-setup-success__text">You have successfully created a profile on Mzuri.</p>
                <p class="business-setup-success__text">
                    You can now input your existing business records or defer it to a later time.
                </p>

                <BasePrimaryButton
                    :overRideButtonClass="true"
                    className="business-setup-success__button business-setup-success__button--primary"
                    buttonText="Enter Existing Records"
                    @button-clicked="goToBusinessMigrationPage"
                />
                <BasePrimaryButton
                    :overRideButtonClass="true"
                    className="business-setup-success__button business-setup-success__button--secondary"
                    buttonText="Remind me Later"
                    @button-clicked="goToBusinessDashboard"
                />
            </div>
        </div>

        <BusinessDetailsForm
            v-else
            :errors="errors"
            :error="error"
            :businessVerticals="businessVerticals"
            :businessRegistrationTypes="businessRegistrationTypes"
            @business-setup-successful="businessSetupSuccessfully"
        />
    </AuthFooterLayout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import BusinessModule from '@/store/modules/business';

import ValidationMixin from '@/mixins/validation';

import AuthFooterLayout from '@/pages/auth/layout/Footer.vue';
import BusinessDetailsForm from '@/pages/BusinessRegistration/NewBusinessDetails.vue';

import { BusinessVertical, BusinessRegistrationType, Status, Token } from '@/types';

const business = namespace('business');
const auth = namespace('auth');

let businessModule: BusinessModule;

@Component({
    components: {
        BusinessDetailsForm,
        AuthFooterLayout,
    },
})
export default class BusinessRegistrationIndex extends Mixins(ValidationMixin) {
    private currentComponent = 'BUSINESS-TYPE';
    private errors = {
        name: '',
        address: '',
        state: '',
        lga: '',
        email: '',
        phoneNumber: '',
        tin: '',
        category: '',
        businessRegistrationNumber: '',
    };

    private businessSelected = '';
    private showBusinessSetupSuccessPage = false;

    @auth.State
    public authenticatedUser!: Token;

    @business.State
    public businessRequestStatus!: Status;

    @business.State
    public error!: string;

    @business.State
    public businessVerticals!: BusinessVertical;

    @business.State
    public businessRegistrationTypes!: BusinessRegistrationType;

    @business.Action
    public getBusinessVerticals!: () => Array<BusinessVertical>;

    @business.Action
    public getBusinessRegistrationTypes!: () => Array<BusinessRegistrationType>;

    private goToBusinessMigrationPage() {
        this.$router.push({ name: 'DataMigration' });
    }

    private goToBusinessDashboard() {
        this.$router.push({ name: 'Dashboard' });
    }

    private businessSetupSuccessfully() {
        this.showBusinessSetupSuccessPage = true;
    }

    public mounted() {
        businessModule = getModule(BusinessModule, this.$store);

        Promise.all([businessModule.getBusinessVerticals(), businessModule.getBusinessRegistrationTypes()]);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/business-registration/business-registration';
</style>
