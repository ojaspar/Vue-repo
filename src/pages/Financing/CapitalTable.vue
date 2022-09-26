<template>
    <div>
        <b-row class="finance-dashboard-tables__add-button">
            <div @click="goToAddCapitalPage">
                <CircularPlusSign class="finance-dashboard-tables__add-button--icon" />
                <span class="finance-dashboard-tables__add-button--text">
                    Add Capital
                </span>
            </div>
        </b-row>
        <div class="finance-dashboard-tables">
            <b-row class="finance-dashboard-tables__heading">
                <b-col cols="7" class="pl-0">Capital Contributor</b-col>
                <b-col>Amount</b-col>
            </b-row>
            <b-row class="finance-dashboard-tables__content" v-for="(shareholder, index) in shareholders" :key="index">
                <b-col cols="7" class="pl-0">{{ shareholder.shareHoldername }}</b-col>
                <b-col class="finance-dashboard-tables__content--with-icon">
                    <span>{{ shareholder.totalAmount | amountWithCurrency }}</span>
                    <font-awesome-icon
                        icon="pencil-alt"
                        title="Edit"
                        class="finance-dashboard-tables__edit-icon"
                        @click="$emit('edit-shareholder', shareholder)"
                    />
                </b-col>
            </b-row>
        </div>

        <b-row class="finance-dashboard-tables__mobile">
            <div class="finance-mobile-table__content" v-for="(shareholder, index) in shareholders" :key="index">
                <div class="finance-mobile-table__text--name">{{ shareholder.shareHoldername }}</div>
                <div class="finance-mobile-table__text--amount">
                    {{ shareholder.totalAmount | amountWithCurrency }}
                </div>
            </div>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { FinanceShareholder } from '@/pages/Financing/types';

@Component
export default class CapitalTable extends Vue {
    @Prop({ default: () => [] }) readonly shareholders!: Array<FinanceShareholder>;

    private goToAddCapitalPage() {
        this.$router.push({ name: 'AddCapital' });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/dashboard-tables';
</style>
