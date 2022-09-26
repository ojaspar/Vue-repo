<template>
    <div class="mobile-home">
        <div class="mobile-home__logo-section">
            <div class="mobile-home__logo-container">
                <img :src="companyInfo.logo" alt="company logo" v-if="false" />
                <span v-else class="logo-initials-container">{{ authenticatedUser.businessName | initials }}</span>
                <span class="mobile-home__business-name">{{ authenticatedUser.businessName }}</span>
            </div>
        </div>
        <div class="mobile-section">
            <div class="sub-menu" @click="$emit('home-submenu-clicked', 1)">
                <p>My Profile</p>
                <img src="@/assets/img/Vector.png" alt="arrow icon" />
            </div>
            <div class="sub-menu" @click="$emit('home-submenu-clicked', 2)">
                <p>Change Password</p>
                <img src="@/assets/img/Vector.png" alt="arrow icon" />
            </div>
            <div class="sub-menu" @click="$emit('home-submenu-clicked', 3)">
                <p>Business Details</p>
                <img src="@/assets/img/Vector.png" alt="arrow icon" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { CompanyInfo, User } from '@/types';

const companyDefault: CompanyInfo = {
    logo: '',
    address: '',
};

const authenticatedUserDefault: User = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    currencyKey: '',
};

@Component
export default class UserProfileMobileHome extends Vue {
    @Prop({ default: () => companyDefault }) readonly companyInfo!: CompanyInfo;
    @Prop({ default: () => authenticatedUserDefault }) readonly authenticatedUser!: User;
}
</script>

<style lang="scss">
.mobile-home {
    &__logo-section {
        height: 170px;
        display: flex;
        align-content: center;
        margin: -20px -15px 0;
        justify-content: center;
        background: $primary-white;
    }
    &__logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    &__business-name {
        color: $primary-color;
        font-family: Lato;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        margin-top: 20px;
    }
}
.mobile-section {
    padding: 0 15px;
}
.sub-menu {
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 50px;
}
.sub-menu p {
    color: #4f4f4f;
    font-size: 16px;
    font-family: 'Lato';
}
svg {
    font-weight: 200;
}
</style>
