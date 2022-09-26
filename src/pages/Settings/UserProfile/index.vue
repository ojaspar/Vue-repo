<template>
    <div>
        <UserProfileIndexMobile
            :authenticatedUser="authenticatedUser"
            :companyInfo="companyInfo"
            v-if="userIsOnMobile"
        />
        <UserProfileIndexMediumPlus :authenticatedUser="authenticatedUser" :companyInfo="companyInfo" v-else />
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import UserProfileIndexMobile from '@/pages/Settings/UserProfile/Mobile/index.vue';
import UserProfileIndexMediumPlus from '@/pages/Settings/UserProfile/MediumPlus/index.vue';

import GeneralModule from '@/store/modules/general';

import { Token, tokenDefaultValue } from '@/types';
import { CompanyLogoRequest, CompanyInfo } from '@/types';

import UtilityMixins from '@/mixins/Utility';

import SessionStorageService from '@/services/sessionStorage';

const general = namespace('general');
let generalModule: GeneralModule;

@Component({
    components: {
        UserProfileIndexMediumPlus,
        UserProfileIndexMobile,
    },
})
export default class UserProfileIndex extends Mixins(UtilityMixins) {
    @general.State
    private companyLogoRequest!: CompanyLogoRequest;

    @general.State
    private companyInfo!: CompanyInfo;

    @general.Action
    private getCompanyInfo!: () => CompanyInfo;

    get authenticatedUser(): Token {
        return SessionStorageService.decodeToken() || tokenDefaultValue;
    }

    created() {
        generalModule = getModule(GeneralModule, this.$store);
        generalModule.getCompanyInfo();
    }
}
</script>

<style lang="scss"></style>
