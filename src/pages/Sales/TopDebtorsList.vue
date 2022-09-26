<template>
    <b-container fluid class="mt-4 top-debtors-list">
        <b-row class="justify-content-between top-debtors-list__header m-0 pt-2 pb-3 top-debtors-list__row text--black">
            <b-col cols="8" class="txt--bold text-uppercase p-0">
                Top Debtors
            </b-col>
            <b-col class="pl-0 text-right top-debtors-list__header__view-all-section">
                <span class="top-debtors-list__header__view-all-text">View all</span>
                <img
                    src="@/assets/img/arrow-right.svg"
                    alt="arrowing pointing right"
                    class="top-debtors-list__header__view-all-icon"
                />
            </b-col>
        </b-row>
        <template v-if="status === 'LOADING'">
            <b-container class="text-center mt-5">
                <Loader size="2" />
            </b-container>
        </template>
        <template v-else>
            <b-row class="top-debtors-list__row m-0 mt-4">
                <ul
                    class="top-debtors-list__list-section"
                    v-for="(debtor, index) in outstandingOrders.outstandingCustomers"
                    :key="index"
                >
                    <li class="top-debtors-list__list-item mb-4">
                        <span class="top-debtors-list__list-item__name">{{ debtor.customerName }}</span>
                        <span class="top-debtors-list__list-item__amount-owing"
                            >₦{{ debtor.balance | formatAmount }}</span
                        >
                    </li>
                </ul>
                <div class="top-debtors-list__no-debtors-text" v-if="!outstandingOrders.outstandingCustomers.length">
                    No debtors
                </div>
            </b-row>
        </template>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import DashboardModule from '@/store/modules/dashboard';
import { SaleRequestStatus, Status } from '../../types';

const dashboard = namespace('dashboard');
let dashboardModule: DashboardModule;

@Component
export default class TopDebtorsList extends Vue {
    @dashboard.State
    public outstandingOrders!: SaleRequestStatus;

    @dashboard.State
    public status!: Status;

    mounted() {
        dashboardModule = getModule(DashboardModule, this.$store);
        dashboardModule.getOutstandingOrders();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/top-debtors-list';
</style>
