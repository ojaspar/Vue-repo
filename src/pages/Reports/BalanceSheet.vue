<template>
    <div>
        <ReportWrapper
            reportTitle="Statement of Financial Position"
            reportType="balancesheet"
            @specifiedPeriodChanged="fetchReportsForSpecifiedPeriod"
        >
            <template v-slot:report-items>
                <!-- Non Current Assets -->
                <section class="reports__section">
                    <b-row class="table-row">
                        <b-col cols="8" />
                        <!-- <b-col class="reports__section-header m-0 mr-2 p-0 amount-col">
                            {{ `${defaultCurrency.currencyCode} (${defaultCurrency.currencySymbol})` }}
                        </b-col> -->
                        <b-col class="amount-col d-flex ml-0 justify-content-end">
                            {{ `${defaultCurrency.currencyCode} (${defaultCurrency.currencySymbol})` }}
                        </b-col>
                    </b-row>

                    <!-- <b-row class="table-row mb-4">
                        <b-col class="reports__section-header m-0 mr-2 p-0 amount-col">{{ currentYear - 1 }}</b-col>
                        <b-col class="reports__section-header m-0 amount-col p-0">{{ currentYear }} </b-col>
                        <b-col class="reports__section-header amount-col">Variation (%)</b-col>
                    </b-row> -->

                    <p class="reports__section-header uppercase">Non-current Assets</p>
                    <TableRow :row="item" v-for="(item, index) in nonCurrentAssetsPpe" :key="`ppe-${index}`" />
                    <TableFooter
                        title="NET VALUE OF PPE"
                        :previousAmount="previousNetValueOfPpe"
                        :currentAmount="currentNetValueOfPpe"
                    />

                    <TableRow :row="item" v-for="(item, index) in otherNonCurrentAssets" :key="`others-${index}`" />
                    <TableFooter
                        title="TOTAL NON-CURRENT ASSETS"
                        :previousAmount="previousTotalNonCurrentAssets"
                        :currentAmount="currentTotalNonCurrentAssets"
                    />
                </section>

                <!-- Current Assets -->
                <section class="reports__section">
                    <p class="reports__section-header uppercase">Current Assets</p>
                    <TableRow :row="item" v-for="(item, index) in currentAssets" :key="`current-assets-${index}`" />
                    <TableFooter
                        title="TOTAL CURRENT ASSETS"
                        :previousAmount="previousTotalCurrentAssets"
                        :currentAmount="currentTotalCurrentAssets"
                    />
                    <TableFooter
                        title="TOTAL ASSETS"
                        :previousAmount="previousTotalAssets"
                        :currentAmount="currentTotalAssets"
                    />
                </section>

                <!-- Liabilities -->
                <section class="reports__section">
                    <p class="reports__section-header uppercase">Liabilities</p>

                    <TableRow :row="item" v-for="(item, index) in liabilities" :key="`liabilities-${index}`" />
                    <TableFooter
                        title="TOTAL LIABILITIES"
                        :previousAmount="previousTotalLiabilities"
                        :currentAmount="currentTotalLiabilities"
                    />
                    <TableFooter
                        title="NET ASSETS"
                        :previousAmount="previousNetAssets"
                        :currentAmount="currentNetAssets"
                    />
                </section>

                <!-- Financing -->
                <section class="reports__section">
                    <p class="reports__section-header uppercase">Financed by</p>

                    <TableRow :row="item" v-for="(item, index) in funding" :key="`funding-${index}`" />
                    <TableFooter
                        title="EQUITY"
                        :previousAmount="previousShareholdersFund"
                        :currentAmount="currentShareholdersFund"
                    />
                </section>
            </template>
        </ReportWrapper>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import ReportWrapper from '@/pages/Reports/Wrapper.vue';
import TableRow from '@/pages/Reports/TableRow.vue';
import TableFooter from '@/pages/Reports/TableFooter.vue';

import { PeriodicRange } from '@/pages/Reports/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import ReportsMixin from '@/pages/Reports/ReportsMixin';

@Component({
    components: {
        ReportWrapper,
        TableRow,
        TableFooter,
    },
})
export default class BalanceSheetReport extends Mixins(CurrencyMixins, UtilityMixins, ReportsMixin) {
    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Balance Sheet');
    }

    private fetchReportsForSpecifiedPeriod(specifiedPeriod: string, periodicRange: PeriodicRange[]) {
        this.specifiedPeriod = specifiedPeriod;
        this.periodicRange = periodicRange;
    }

    async created() {
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/reports/dashboard';
</style>
