<template>
    <section>
        <b-row class="tax-liability-filter-section" v-if="!thereAreNoTransactions">
            <b-col sm="12" md="5" class="tax-liability-details__search p-0">
                <img src="@/assets/img/search.svg" class="tax-liability-details__search--icon" />

                <BaseInputField
                    type="search"
                    placeholder="Search"
                    inputContainerClass="tax-liability-details__search-input-container"
                    className="tax-liability-details__search-input"
                    v-model="searchInput"
                />
            </b-col>

            <b-col class="tax-liability-filter-section__from-date">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :overRideInputContainerClass="true"
                    inputContainerClass="date-input"
                    floatingLabelText="From"
                    v-model="fromDate"
                />
            </b-col>

            <b-col class="tax-liability-filter-section__to-date">
                <BaseDateFieldWithBorderAndFloatingLabel
                    :overRideInputContainerClass="true"
                    inputContainerClass="date-input"
                    floatingLabelText="To"
                    v-model="toDate"
                />
            </b-col>
        </b-row>

        <ul class="tax-liability-details-mobile">
            <p v-if="thereAreNoTransactions" class="tax-liability-details-mobile__no-transaction">No Transaction</p>

            <template v-else>
                <li
                    class="tax-liability-details-mobile__row"
                    v-for="(transaction, index) in filteredTransactions"
                    :key="index"
                >
                    <p class="tax-liability-details-mobile__customer">{{ transaction.person || '-' }}</p>

                    <p class="tax-liability-details-mobile__transaction-date">
                        {{ transaction.transactionDate | monthDateYearFormat }}
                    </p>

                    <p class="tax-liability-details-mobile__transaction-details">
                        {{ transaction.transactionDetail || '-' }}
                    </p>

                    <p class="tax-liability-details-mobile__transaction-amount">
                        {{ transaction.totalAmount | amountWithCurrency }}
                        <span class="tax-liability-details-mobile__meta">
                            Transaction Amount
                        </span>
                    </p>

                    <p class="tax-liability-details-mobile__tax-amount">
                        {{ transaction.tax | amountWithCurrency }}
                        <span class="tax-liability-details-mobile__meta">
                            Tax Amount
                        </span>
                    </p>
                </li>
            </template>
        </ul>

        <div class="tax-table__medium">
            <b-row class="tax-table__heading">
                <b-col v-for="{ title, size, cssClass } in headings" :key="title" :cols="size" :class="cssClass">{{
                    title
                }}</b-col>
            </b-row>

            <b-row class="tax-table__content" v-for="(transaction, index) in filteredTransactions" :key="index">
                <b-col cols="3">
                    {{ transaction.transactionDate | monthDateYearFormat }}
                </b-col>

                <b-col cols="2" class="d-flex flex-column">
                    {{ transaction.transactionDetail || '-' }}
                </b-col>

                <b-col>
                    {{ transaction.totalAmount | amountWithCurrency }}
                </b-col>

                <b-col>
                    {{ transaction.tax | amountWithCurrency }}
                </b-col>
            </b-row>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { TaxLiabilityTransaction, TaxTypes } from '@/pages/TaxAndRemittance/types';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number, text: string): string {
            return itemsCount > 1 ? `${itemsCount} ${text}s` : `${itemsCount} ${text}`;
        },
    },
})
export default class TaxLiabilityDetails extends Vue {
    @Prop({ default: TaxTypes.CIT }) readonly taxType!: TaxTypes;
    @Prop({ default: Array<TaxLiabilityTransaction>() }) readonly transactions!: Array<TaxLiabilityTransaction>;

    private searchInput = '';
    private fromDate = '';
    private toDate = '';

    get headings(): Array<{ title: string; size?: number; cssClass?: string }> {
        return [
            { title: 'Date', size: 3 },
            { title: 'Details', size: 2 },
            { title: 'Transaction Amount' },
            { title: 'Tax Amount' },
        ];
    }

    get filteredTransactions(): Array<TaxLiabilityTransaction> {
        if (this.searchInput && (!this.fromDate || !this.toDate)) {
            return this.searchFilteredOnly;
        }

        return this.searchFilteredOnly.filter(transaction => {
            if (this.fromDate && !this.toDate) {
                return new Date(transaction.transactionDate) >= new Date(this.fromDate);
            }

            if (this.toDate && !this.fromDate) {
                return new Date(transaction.transactionDate) <= new Date(this.toDate);
            }

            if (this.fromDate && this.toDate) {
                return (
                    new Date(transaction.transactionDate) >= new Date(this.fromDate) &&
                    new Date(transaction.transactionDate) <= new Date(this.toDate)
                );
            }
            return transaction;
        });
    }

    get searchFilteredOnly(): Array<TaxLiabilityTransaction> {
        return this.transactions.filter((transaction: TaxLiabilityTransaction) =>
            Object.values(transaction).some(
                value => typeof value == 'string' && value.toLowerCase().includes(this.searchInput.toLowerCase()),
            ),
        );
    }

    get thereAreNoTransactions(): boolean {
        return this.transactions.length === 0;
    }
}
</script>
