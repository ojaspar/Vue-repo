<template>
    <div class="jobs__container">
        <div class="d-flex flex-column">
            <div class="jobs__outstanding-orders-section">
                <div class="jobs__outstanding-orders-primary-heading d-flex justify-content-between">
                    <p class="jobs__outstanding-orders-text">Outstanding Orders</p>
                    <p @click="navigateToSupplyStatusOfSalesDashboard" class="jobs__view-details-text pointer">
                        View details<font-awesome-icon icon="caret-right" class="ml-2" />
                    </p>
                </div>
                <div class="jobs__outstanding-orders-container" v-for="(job, index) in jobs" :key="index">
                    <div class="jobs__outstanding-orders-customer-section">
                        <h3 class="jobs__outstanding-orders-customer-text">{{ job.customerName }}</h3>
                        <p class="jobs__outstanding-orders-products-text">
                            {{
                                itemsInArrayConvertedToCommaSeparatedStrings(job.itemArray)
                                    | truncate(maximumLengthOfTruncatedItems)
                            }}
                        </p>
                    </div>
                    <div class="jobs__outstanding-orders-update-section">
                        <span class="jobs__outstanding-orders-update-text" @click="goToManageSalesPage(job)"
                            >Update <font-awesome-icon icon="caret-right" class="ml-2"
                        /></span>
                        <p class="jobs__outstanding-orders-number-of-orders-text">
                            {{ itemText(job.itemArray.length) }}
                        </p>
                    </div>
                </div>
                <div class="jobs__no-outstanding-orders-section" v-if="jobs.length === 0">
                    <p class="jobs__no-outstanding-orders-text">No outstanding orders</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

import { VueExtension } from '@/types';
import { SalesTableDetails } from '@/pages/Sales/types';

@Component
export default class Debtors extends Vue {
    @Prop({ default: () => [] }) readonly jobs!: Array<SalesTableDetails>;
    public $root!: VueExtension;
    get maximumLengthOfTruncatedItems() {
        let maxLength = 80;
        if (this.$root.isMediumScreenSize) maxLength = 50;
        if (this.$root.isMobileScreenSize) maxLength = 25;
        return maxLength;
    }

    private goToManageSalesPage(job: SalesTableDetails) {
        this.$router.push({ name: 'ManageSales', params: { saleKey: job.saleKey } });
    }

    private itemText(itemCount: number): string {
        return itemCount.toString() + ' Item' + (itemCount != 1 ? 's' : '');
    }
    private itemsInArrayConvertedToCommaSeparatedStrings(itemArray: Array<string>) {
        return itemArray.join(', ');
    }
    private navigateToSupplyStatusOfSalesDashboard() {
        this.$router.push({ name: 'Sales', query: { tab: 'pending-supply' } });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/jobs';
</style>
