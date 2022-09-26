<template>
    <div>
        <!-- <AddNewEntityWithPlusIconButton
            buttonText="Add Business"
            @button-clicked="$emit('add-business-button-clicked')"
            :icon="require('@/assets/img/plus-button-light-blue.svg')"
        /> -->
        <div v-for="(business, index) in businesses" :key="index" class="business__card-container">
            <div class="business__card pointer" @click="setBusinessDetails(business)">
                <h3 class="business__card-heading--primary">{{ business.name }}</h3>
                <span class="business__card-heading--secondary">{{ business.rc }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import { UserProfileBusiness, defalutBusinesssProfile } from '@/pages/Settings/types';

import BusinessModule from '@/store/modules/business.ts';

import { BusinessData, BusinessRequestStatus, CompanyInfo } from '@/types';

let businessModule: BusinessModule;
const business = namespace('business');

const companyDefault: CompanyInfo = {
    logo: '',
    address: '',
};

@Component
export default class ShowBusinessMobile extends Vue {
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    // @Prop({ default: () => Array<typeof userProfileBusinessDefault> }) readonly businesses!: Array<UserProfileBusiness>

    @business.State
    public businessInfo!: BusinessData;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    private businesses: Array<UserProfileBusiness> = [
        {
            ...defalutBusinesssProfile,
        },
    ];

    private setBusinessDetails(business: UserProfileBusiness) {
        this.$emit('set-business', business);
    }

    async mounted() {
        businessModule = getModule(BusinessModule, this.$store);

        await businessModule.getBusinessDetails();

        this.businesses = [
            {
                name: this.businessInfo.name,
                rc: this.businessInfo.rcNumber,
                phone: this.businessInfo.phoneNumber,
                type: this.businessInfo.businessRegistrationType,
                email: this.businessInfo.email,
                industry: this.businessInfo.businessVertical,
                country: this.businessInfo.country,
                state: this.businessInfo.state,
                council: this.businessInfo.lga,
                address: this.businessInfo.address,
                businessKey: this.businessInfo.businessKey,
            },
        ];
    }
}
</script>

<style lang="scss">
.business {
    &__card-container {
        margin-top: 10px;
    }
    &__card {
        border: 0.5px solid rgba(124, 124, 124, 0.4);
        border-radius: 4px;
        padding: 13px 8px;
        margin-top: 15px;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    &__card-heading {
        &--primary {
            color: #0ca2d9;
            font-weight: 600;
            font-size: 14px;
        }
        &--secondary {
            color: $dark-grey-1;
            font-size: 14px;
        }
    }
}
</style>
