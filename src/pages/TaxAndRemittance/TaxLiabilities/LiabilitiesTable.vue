<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <DesktopTable
            :liabilities="liabilities"
            :requestInProgress="requestInProgress"
            :emptyContentMessage="emptyContentMessage"
            :liabilitiesAreAvailable="liabilitiesAreAvailable"
            @view-liability-details="viewTaxLiabilityDetails"
        />

        <!-- Responsive Table -->
        <MobileTable
            :liabilities="liabilities"
            :requestInProgress="requestInProgress"
            :emptyContentMessage="emptyContentMessage"
            :liabilitiesAreAvailable="liabilitiesAreAvailable"
            @view-liability-details="viewTaxLiabilityDetails"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import DesktopTable from '@/pages/TaxAndRemittance/TaxLiabilities/DesktopTable.vue';
import MobileTable from '@/pages/TaxAndRemittance/TaxLiabilities/MobileTable.vue';

import { TaxLiability } from '@/pages/TaxAndRemittance/types';

import UtilityMixins from '@/mixins/Utility';
import CurrencyMixins from '@/mixins/currency';

import SessionStorageService from '@/services/sessionStorage';

@Component({
    components: {
        DesktopTable,
        MobileTable,
    },
})
export default class LiabilitiesTable extends Mixins(UtilityMixins, CurrencyMixins) {
    @Prop({ default: () => Array<TaxLiability>() }) readonly liabilities!: Array<TaxLiability>;
    @Prop({ default: '' }) readonly searchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private functionalCurrency = '';

    get showRecentDonors(): boolean {
        return this.searchString.length === 0;
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Pledges';
    }

    get liabilitiesAreAvailable(): boolean {
        return this.liabilities.length > 0;
    }

    get emptyContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.liabilitiesAreAvailable) {
            return 'There are no tax liabilities yet';
        }
        return '';
    }

    get requestInProgress() {
        return this.status === 'LOADING';
    }

    private getFunctionalCurrency() {
        const accessToken = SessionStorageService.decodeToken();
        const { currencyKey } = accessToken;
        this.functionalCurrency = this.getCurrencySymbolFromCurrencyKey(currencyKey);
    }

    private viewTaxLiabilityDetails(taxLiability: TaxLiability) {
        SessionStorageService.setItem('tax-liability', JSON.stringify(taxLiability));

        this.$router.push({ name: 'ManageTaxLiability' });
    }

    mounted() {
        this.getFunctionalCurrency();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/tax/tax-table';
@import 'src/styles/pages/tax/tax-liabilities';

.item-controls {
    display: flex;
    flex-wrap: wrap;
}

.action-button {
    margin-right: 25px;
    margin-bottom: 7px;
}
</style>
