<template>
    <div :class="['business-stat-card', businessStat.class]">
        <div class="d-flex justify-content-between h-100">
            <div>
                <p class="business-stat-card__title">{{ businessStat.name }}</p>
                <p class="business-stat-card__total">
                    {{ businessStat.total }}
                </p>
                <p class="business-stat-card__text">
                    <span v-if="showCashAmount">
                        Cash :
                        <span class="business-stat-card__text--cash">
                            {{ businessStat.cash | amountWithCurrency }}
                        </span>
                    </span>
                    <span v-if="showDivider"> | </span>
                    <span v-if="showCreditAmount">
                        Credit :
                        <span class="business-stat-card__text--credit">
                            {{ businessStat.credit | amountWithCurrency }}
                        </span>
                    </span>
                </p>
            </div>
            <div class="business-stat-card__icon">
                <img v-if="businessStat.icon" :src="businessStat.icon" height="30" alt="image" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { MoneyObject } from '@/types';

export interface BusinessStats {
    name: string;
    icon: string;
    total: string;
    cash: MoneyObject;
    credit: MoneyObject;
    class: string;
}

@Component
export default class BusinessStatCard extends Vue {
    @Prop({ required: true }) readonly businessStat!: BusinessStats;

    get showCashAmount() {
        return this.businessStat.cash.amount > 0;
    }

    get showCreditAmount() {
        return this.businessStat.credit.amount > 0;
    }

    get showDivider() {
        return this.showCashAmount && this.showCreditAmount;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/main/business-stat-card';
</style>
