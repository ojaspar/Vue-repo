<template>
    <div class="view-user">
        <div class="view-user__container">
            <div class="view-user__loader-container" v-if="authRequestStatus.fetchBusinessUsers === 'LOADING'">
                <Loader size="4" />
            </div>
            <div
                class="view-user__card pointer"
                v-else
                v-for="businessUser in businessUsers"
                :key="businessUser.userKey"
                @click="handleEditBusinessUser(businessUser.userKey)"
            >
                <div class="view-user__card-inner-container">
                    <!-- add user image when it becomes available in the endpoint -->
                    <!-- <img src="@/assets/img/person-1.jpg" alt="user photo" class="view-user__user-photo" /> -->
                    <p class="view-user__initials-container">{{ businessUserFullName(businessUser) | initials }}</p>
                    <p class="view-user__name">{{ businessUserFullName(businessUser) }}</p>
                    <p class="view-user__email">{{ businessUser.email }}</p>
                    <p class="view-user__phone-number">{{ businessUser.phoneNumber }}</p>
                </div>
            </div>
            <div class="view-user__add-user-container" @click="goToAddUserPage">
                <img
                    src="@/assets/img/plus-icon-with-blue-border.svg"
                    class="view-user__add-user-icon"
                    alt="Plus icon"
                />
                <p class="view-user__add-user-text">Add User</p>
            </div>
        </div>
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import UtilityMixins from '@/mixins/Utility';

import AuthModule from '@/store/modules/auth';

import { AuthRequestStatus, Status, Toaster, Token, tokenDefaultValue } from '@/types';
import { BusinessUserResponse } from '@/pages/Settings/types';

const auth = namespace('auth');
let authModule: AuthModule;

@Component
export default class ViewUsers extends Mixins(UtilityMixins) {
    @auth.State
    private authRequestStatus!: AuthRequestStatus;

    @auth.State
    private error!: string;

    @auth.State
    private errorCode!: number;

    @auth.Action
    public fetchBusinessUsers!: () => void;

    @auth.State
    private businessUsers!: Array<BusinessUserResponse>;

    private authenticatedUser: Token = tokenDefaultValue;

    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        position: 'b-toaster-top-center',
        id: 'fetch-business-user-toaster',
    };

    private businessUserFullName(businessUser: BusinessUserResponse) {
        return `${businessUser.firstName.trim()} ${businessUser.lastName.trim()}`;
    }

    private handleEditBusinessUser(userKey: string) {
        this.goToEditUserPage(userKey);
    }

    private goToAddUserPage() {
        this.$router.push({ name: 'AddUser' });
    }

    private goToEditUserPage(userKey: string) {
        this.$router.push({ name: 'EditUser', params: { userKey } });
    }

    async mounted() {
        authModule = getModule(AuthModule, this.$store);
        await authModule.fetchBusinessUsers();
        if (this.authRequestStatus.fetchBusinessUsers === Status.ERROR) {
            this.businessUsers = [];
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error',
                message: 'There was an error fetching business users. Please try again',
            });
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/settings/view-users.scss';
</style>
