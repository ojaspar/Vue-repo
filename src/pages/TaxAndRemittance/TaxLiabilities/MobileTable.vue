<template>
    <div class="tax-table__mobile-and-medium mobile-tax-table-container">
        <div v-if="requestInProgress" cols="12" class="tax-table__content--loader">
            <Loader size="4" />
        </div>

        <div v-else-if="liabilitiesAreAvailable">
            <b-row class="pointer tax-table-grid" v-for="(liability, index) in liabilities" :key="index">
                <b-col class="tax-table-grid__grey tax-table-grid__period">{{ liability.period }}</b-col>
                <b-col class="tax-table-grid__tax-type">{{ liability.taxType }}</b-col>
                <b-col class="tax-table-grid__filing-deadline">
                    <span class="tax-table-grid__grey">Due on</span>
                    {{ liability.filingDeadline | monthDateYearFormat }}
                </b-col>
                <b-col class="tax-table-grid__tax-payable">{{ liability.taxPayable | amountWithCurrency }}</b-col>
                <b-col class="tax-table-grid__jurisdiction">{{ liability.jurisdiction }}</b-col>
                <b-col class="tax-table-grid__links">
                    <!-- <span class="tax-table-grid__links--link" @click="remitTax(liability)">Pay</span> -->

                    <span class="tax-table-grid__links--link" @click="viewTaxLiabilityDetails(liability)">View</span>
                </b-col>
            </b-row>
        </div>

        <div v-else cols="12" class="tax-table__content--empty">
            {{ emptyContentMessage }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { TaxLiability } from '@/pages/TaxAndRemittance/types';

@Component
export default class MobileScreenTable extends Vue {
    @Prop({ default: () => Array<TaxLiability>() }) readonly liabilities!: Array<TaxLiability>;
    @Prop({ default: false }) readonly requestInProgress!: boolean;
    @Prop({ default: false }) readonly liabilitiesAreAvailable!: boolean;
    @Prop({ default: false }) readonly emptyContentMessage!: string;

    private remitTax(taxLiability: TaxLiability) {
        this.$emit('remit-tax', taxLiability);
    }

    private viewTaxLiabilityDetails(taxLiability: TaxLiability) {
        this.$emit('view-liability-details', taxLiability);
    }
}
</script>
