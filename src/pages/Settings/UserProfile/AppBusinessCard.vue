<template>
    <div>
        <div class="__card pointer" @click="openAddBusinessModal(businessDetail)">
            <h3 class="card-h3">{{ businessDetail.name }}</h3>
            <span class="card-span">{{ businessDetail.industryName }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { UserProfileBusiness } from '@/pages/Settings/types';

@Component
export default class AppBusinessCard extends Vue {
    private display = false;
    private action = 'Edit';

    @Prop({ required: true }) readonly businessDetail!: UserProfileBusiness;

    public openAddBusinessModal(business: UserProfileBusiness) {
        this.$emit('open-business-profile-page', { ...business });
    }
}
</script>

<style>
.white {
    color: white;
}
.__card {
    border: 0.5px solid rgba(124, 124, 124, 0.4);
    box-sizing: border-box;
    border-radius: 4px;
    height: 60px;
    padding: 10px;
    margin-top: 10px;
}

.card-h3 {
    font-family: Lato;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #0ca2d9;
}
.card-span {
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #7c7c7c;
    margin-top: 10px;
}
.white {
    color: white;
    margin-left: 10px;
    margin-top: 10px;
}
</style>
