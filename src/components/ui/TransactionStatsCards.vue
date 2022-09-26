<template>
    <b-row class="transaction-stats">
        <b-col xl="6" lg="6" sm="6" cols="12" :class="[firstStatsClass, 'transaction-stats__first-stats']">
            <div class="transaction-stats__card">
                <h3 class="transaction-stats__card-header">{{ firstStats.firstCardHeader }}</h3>
                <h3 class="transaction-stats__card-body--first-card">{{ firstStats.firstCardBody }}</h3>
            </div>
            <div class="transaction-stats__card">
                <h3 class="transaction-stats__card-header">{{ firstStats.secondCardHeader }}</h3>
                <h3 class="transaction-stats__card-body--second-card">{{ firstStats.secondCardBody }}</h3>
            </div>
        </b-col>
        <b-col xl="6" lg="6" sm="6" cols="12" class="transaction-stats__second-stats" v-if="showSecondStats">
            <div class="transaction-stats__card">
                <h3 class="transaction-stats__card-header">{{ secondStats.firstCardHeader }}</h3>
                <h3 class="transaction-stats__card-body--first-card">{{ secondStats.firstCardBody }}</h3>
            </div>
            <div class="transaction-stats__card">
                <h3 class="transaction-stats__card-header">{{ secondStats.secondCardHeader }}</h3>
                <h3 class="transaction-stats__card-body--second-card">{{ secondStats.secondCardBody }}</h3>
            </div>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { TransactionStatsCard } from '@/types';
import { defaultStats } from '@/pages/Sales/ManageCustomers/types';

@Component
export default class TransactionStatsCards extends Vue {
    @Prop({ default: () => defaultStats }) readonly firstStats!: TransactionStatsCard;
    @Prop({ default: () => defaultStats }) readonly secondStats!: TransactionStatsCard;
    @Prop({ default: false }) readonly showSecondStats!: boolean;

    get firstStatsClass(): string {
        const baseClass = 'transaction-stats__first-stats';
        return this.showSecondStats ? `${baseClass}--include-border` : '';
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/transaction-stats-card.scss';
</style>
