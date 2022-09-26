<template>
    <div>
        <!-- Desktop Table -->
        <div class="desktop-product-transaction-table">
            <b-row class="product-transaction-table__heading">
                <b-col class="pl-0">Date</b-col>
                <b-col>Customer / Ref.</b-col>
                <b-col cols="4">Products</b-col>
                <b-col>Amount</b-col>
                <b-col>Supply Status</b-col>
            </b-row>

            <div v-if="transactionsAreAvailable">
                <b-row
                    class="product-transaction-table__content"
                    v-for="(transaction, index) in transactions"
                    :key="index"
                    @click="manageSale(transaction.saleKey)"
                >
                    <b-col class="pl-0">
                        <p class="content-text m-0">{{ transaction.transactionDate | monthDateYearFormat }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ transaction.customerName }}</p>
                        <p class="content-text__meta">{{ transaction.salesReferenceNumber }}</p>
                    </b-col>
                    <b-col cols="4">
                        <p class="content-text m-0">{{ truncateNames(transaction.products) }}</p>
                        <p class="content-text__meta" v-if="countItems(transaction.products) > 0">
                            {{ countItems(transaction.products) | itemCountSuffix }}
                        </p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ transaction.totalAmount | amountWithCurrency }}</p>
                        <p class="content-text__meta--balance" v-show="transaction.balanceDue.amount !== 0">
                            {{ transaction.balanceDue | amountWithCurrency }} <i>Balance Due</i>
                        </p>
                    </b-col>
                    <b-col>
                        <p :class="[supplyStatusClass(transaction.transactionStatus), 'm-0']">
                            {{ transaction.transactionStatus }}
                        </p>
                        <p class="content-text__meta--date" v-if="showDueDate(transaction.transactionStatus)">
                            {{ transaction.supplyDueDate | monthDateYearFormat }}
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="product-transaction-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="product-transaction-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Mobile Table-->
        <div class="mobile-product-transaction-table">
            <div v-if="transactionsAreAvailable">
                <b-row
                    class="product-transaction-mobile-table"
                    v-for="(transaction, index) in transactions"
                    :key="index"
                >
                    <b-col class="product-transaction-mobile-table__content" @click="manageSale(transaction.saleKey)">
                        <div class="product-transaction-mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ transaction.transactionDate | monthDateYearFormat }} /
                                {{ transaction.salesReferenceNumber }}
                            </p>
                            <p class="mobile-content__text">
                                {{ transaction.customerName }}
                            </p>
                            <span>
                                <p class="mobile-content__text">
                                    {{ transaction.totalAmount | amountWithCurrency }}
                                    <span
                                        class="mobile-content__balance ml-2"
                                        v-if="transaction.balanceDue.amount !== 0"
                                    >
                                        ( {{ transaction.balanceDue | amountWithCurrency }} Balance)
                                    </span>
                                </p>
                                <p class="mobile-content__text">
                                    {{ truncateNames(transaction.products) }}
                                </p>
                            </span>
                        </div>

                        <div class="mobile-content__right">
                            <span>
                                <p
                                    :class="[
                                        supplyStatusClass(transaction.transactionStatus),
                                        'align-right',
                                        'content-text__m-t',
                                    ]"
                                >
                                    {{ `${transaction.transactionStatus}` }}
                                </p>
                                <p class="mobile-content__meta align-right" v-if="countItems(transaction.products) > 0">
                                    {{ countItems(transaction.products) | itemCountSuffix }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="product-transaction-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="product-transaction-table__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { ProductTransaction } from '@/pages/Sales/ManageProducts/types';
import { VueExtension } from '@/types';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class VendorTransactionTable extends Vue {
    @Prop({ default: () => [] }) readonly transactions!: ProductTransaction[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly requestStatus!: string;

    public $root!: VueExtension;

    get transactionsAreAvailable(): boolean {
        return this.transactions.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.transactionsAreAvailable) {
            return 'There are no transactions available';
        }
        return '';
    }

    get requestIsLoading() {
        return this.requestStatus === 'LOADING';
    }

    private supplyStatusClass(supplyStatus: string) {
        if (supplyStatus.toLowerCase() === 'no supply') {
            return 'content-text__pending';
        }
        if (supplyStatus.toLowerCase() === 'estimate') {
            return 'content-text__estimate';
        }
        if (supplyStatus.toLowerCase() === 'partial supply') {
            return 'content-text__partial';
        }
        return 'content-text__completed';
    }

    private showDueDate(supplyStatus: string): boolean {
        return supplyStatus.toLowerCase() === 'not supplied';
    }

    private truncateNames(names: string[]): string {
        let maxLength = 80;
        if (this.$root.isMediumScreenSize) maxLength = 50;
        if (this.$root.isMobileScreenSize) maxLength = 35;

        const allNames = names.join(', ').substring(0, maxLength);

        if (allNames.length >= maxLength) {
            return `${allNames}...`;
        }
        return allNames;
    }

    private countItems(items: string[]): number {
        return items.length;
    }

    public manageSale(saleKey: string) {
        this.$router.push({ name: 'ManageSales', params: { saleKey } });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/product-transaction-table.scss';
</style>
