<template>
    <b-row class="single-transaction-stats">
        <b-col xl="6" lg="6" sm="6" cols="12" class="single-transaction-stats__container">
            <div class="single-transaction-stats__card">
                <h3 class="single-transaction-stats__card-header">{{ header }}</h3>
                <h3 class="single-transaction-stats__card-body">{{ body }}</h3>
            </div>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SingleTransactionStatsCard extends Vue {
    @Prop({ default: '' }) readonly header!: string;
    @Prop({ default: '' }) readonly body!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/single-transaction-stats-card.scss';
</style>
