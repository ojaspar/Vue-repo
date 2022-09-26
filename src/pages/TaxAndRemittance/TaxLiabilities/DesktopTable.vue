<template>
    <div class="tax-table__desktop">
        <h3 class="tax-table__page-title">
            Pending Tax Liabilities
        </h3>
        <b-row class="tax-table__heading">
            <b-col>Period</b-col>
            <b-col>Tax Type</b-col>
            <b-col>Jurisdiction</b-col>
            <b-col>Tax Amount</b-col>
            <!-- <b-col>Amount Paid</b-col>
            <b-col>Balance</b-col> -->
            <b-col>Filing Deadline</b-col>
        </b-row>

        <div v-if="requestInProgress" cols="12" class="tax-table__content--loader mt-5">
            <Loader size="4" />
        </div>

        <div v-else-if="liabilitiesAreAvailable">
            <b-row
                class="tax-table__content pointer"
                v-for="(liability, index) in liabilities"
                :key="index"
                @click="$emit('view-liability-details', liability)"
            >
                <b-col>
                    {{ liability.period }}
                </b-col>

                <b-col>
                    {{ liability.taxType }}
                </b-col>

                <b-col>
                    {{ liability.jurisdiction }}
                </b-col>

                <b-col>
                    {{ liability.taxPayable | amountWithCurrency }}
                </b-col>

                <!-- <b-col>
                    {{ liability.amountPaid | amountWithCurrency }}
                </b-col>

                <b-col>
                    {{ liability.balance | amountWithCurrency }}
                </b-col> -->

                <b-col>
                    <p class="m-0">{{ liability.filingDeadline | monthDateYearFormat }}</p>
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
export default class DesktopTable extends Vue {
    @Prop({ default: () => Array<TaxLiability>() }) readonly liabilities!: Array<TaxLiability>;
    @Prop({ default: false }) readonly requestInProgress!: boolean;
    @Prop({ default: false }) readonly liabilitiesAreAvailable!: boolean;
    @Prop({ default: false }) readonly emptyContentMessage!: string;
}
</script>
