<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-customer-transaction">
            <b-row class="customer-transaction__heading">
                <b-col class="pl-0">Date</b-col>
                <b-col cols="5">Products</b-col>
                <b-col>Amount</b-col>
                <b-col>Suppy Status</b-col>
            </b-row>

            <div v-if="transactionsAreAvailable">
                <b-row class="customer-transaction__content" v-for="(transaction, index) in transactions" :key="index">
                    <font-awesome-icon icon="ellipsis-h" class="pointer mr-3" />
                    <b-col class="pl-0">
                        <p class="content-text m-0">{{ transaction.transactionDate | monthDateYearFormat }}</p>
                    </b-col>
                    <b-col cols="5">
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
                        <p
                            class="content-text__meta--date dark-grey"
                            v-if="showDeliveryDate(transaction.transactionStatus)"
                        >
                            Due: {{ transaction.supplyDueDate | monthDateYearFormat }}
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="customer-transaction__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="customer-transaction__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="medium-customer-transaction">
            <div v-if="transactionsAreAvailable">
                <b-row class="transaction-mobile-table" v-for="(transaction, index) in transactions" :key="index">
                    <b-col class="transaction-mobile-table__content" @click="toggleTransactionDetailsCard(index)">
                        <div class="transaction-mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ transaction.transactionDate }}
                            </p>
                            <p class="mobile-content__text">
                                {{ transaction.totalAmount | amountWithCurrency }}
                                <span class="mobile-content__balance ml-2" v-if="transaction.balanceDue.amount !== 0">
                                    ( {{ transaction.balanceDue | amountWithCurrency }} Balance)
                                </span>
                            </p>
                            <p class="mobile-content__text" v-show="showNames(index)">
                                {{ truncateNames(transaction.products) }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showTransactionDetails(index)">
                                    <p :class="supplyStatusClass(transaction.transactionStatus)">
                                        {{ `${transaction.transactionStatus}  ` }}
                                        <span
                                            class="dark-grey ml-3"
                                            v-if="showDeliveryDate(transaction.transactionStatus)"
                                        >
                                            <i>Due: {{ transaction.supplyDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ truncateNames(transaction.products) }}
                                    </p>
                                    <p class="mt-3 mb-0">
                                        <font-awesome-icon icon="plus-circle" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Add Payment</span>
                                        <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Edit</span>
                                        <font-awesome-icon icon="clone" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Duplicate</span>
                                        <font-awesome-icon icon="times-circle" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Cancel</span>
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon
                                    :icon="transactionCardDetailsIcon(index)"
                                    title="Edit"
                                    class="card-icon"
                                />
                            </p>

                            <span v-show="!showTransactionDetails(index)">
                                <p :class="[supplyStatusClass(transaction.transactionStatus), 'align-right', 'mt-4']">
                                    {{ `${transaction.transactionStatus}  ` }}
                                </p>
                                <p class="mobile-content__meta ml-5" v-if="countItems(transaction.products) > 0">
                                    {{ countItems(transaction.products) | itemCountSuffix }}
                                </p>
                            </span>

                            <span v-show="showTransactionDetails(index)">
                                <p class="mobile-content__meta ml-5 mt-5" v-if="countItems(transaction.products) > 0">
                                    {{ countItems(transaction.products) | itemCountSuffix }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="customer-transaction__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="customer-transaction__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="small-customer-transaction">
            <div v-if="transactionsAreAvailable">
                <b-row class="transaction-mobile-table" v-for="(transaction, index) in transactions" :key="index">
                    <b-col class="transaction-mobile-table__content" @click="toggleTransactionDetailsCard(index)">
                        <div class="transaction-mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ transaction.transactionDate }}
                            </p>
                            <span v-show="showNames(index)">
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
                            <transition name="slide-up-fade">
                                <span v-show="showTransactionDetails(index)">
                                    <p :class="supplyStatusClass(transaction.transactionStatus)">
                                        {{ `${transaction.transactionStatus}  ` }}
                                        <span
                                            class="dark-grey ml-3"
                                            v-if="showDeliveryDate(transaction.transactionStatus)"
                                        >
                                            <i>Due: {{ transaction.supplyDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ truncateNames(transaction.products) }}
                                    </p>
                                    <p class="mobile-content__meta mt-2" v-if="countItems(transaction.products) > 0">
                                        {{ countItems(transaction.products) | itemCountSuffix }}
                                    </p>
                                    <p class="mt-3 mb-0">
                                        <font-awesome-icon icon="plus-circle" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Add Payment</span>
                                        <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Edit</span>
                                    </p>
                                    <p class="mt-3 mb-0">
                                        <font-awesome-icon icon="clone" title="Edit" class="table-icon" />
                                        <span class="m-r pointer mobile-content__text">Duplicate</span>
                                        <font-awesome-icon icon="times-circle" title="Edit" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__text">Cancel</span>
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon
                                    :icon="transactionCardDetailsIcon(index)"
                                    title="Edit"
                                    class="card-icon"
                                />
                            </p>

                            <span v-show="!showTransactionDetails(index)">
                                <p :class="[supplyStatusClass(transaction.transactionStatus), 'align-right', 'm-t']">
                                    {{ `${transaction.transactionStatus}  ` }}
                                </p>
                                <p class="mobile-content__meta align-right" v-if="countItems(transaction.products) > 0">
                                    {{ countItems(transaction.products) | itemCountSuffix }}
                                </p>
                            </span>

                            <span v-show="showTransactionDetails(index)">
                                <p class="mobile-content__text align-right mt-0">
                                    {{ transaction.totalAmount | amountWithCurrency }}
                                </p>
                                <p
                                    class="mobile-content__balance align-right"
                                    v-if="transaction.balanceDue.amount !== 0"
                                >
                                    <span class="dark-grey">Balance:</span>
                                    {{ transaction.balanceDue | amountWithCurrency }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="customer-transaction__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="customer-transaction__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { CustomerTransaction } from '@/pages/Sales/ManageCustomers/types';
import { VueExtension } from '@/types';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Products` : `${itemsCount} Product`;
        },
    },
})
export default class VendorTransactionTable extends Vue {
    @Prop({ default: () => [] }) readonly transactions!: CustomerTransaction[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly requestStatus!: string;

    public $root!: VueExtension;

    private selectedTransactionCardIndex = '';

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

    get transactionsRequestIsLoading() {
        return this.requestStatus === 'LOADING';
    }

    private supplyStatusClass(supplyStatus: string) {
        if (supplyStatus.toLowerCase() === 'not supplied') {
            return 'content-text__pending';
        }
        if (supplyStatus.toLowerCase() === 'estimate') {
            return 'content-text__estimate';
        }
        return 'content-text__completed';
    }

    private showDeliveryDate(supplyStatus: string) {
        return supplyStatus.toLowerCase() === 'not supplied';
    }

    private transactionCardDetailsIcon(cardIndexNumber: string) {
        return this.selectedTransactionCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private showTransactionDetails(cardIndexNumber: string) {
        return this.selectedTransactionCardIndex === cardIndexNumber;
    }

    private showNames(cardIndexNumber: string) {
        return this.selectedTransactionCardIndex !== cardIndexNumber;
    }

    private caretShouldShow(cardIndexNumber: string): boolean {
        return this.transactionCardDetailsIcon(cardIndexNumber) === 'chevron-up';
    }

    private toggleTransactionDetailsCard(cardIndexNumber: string) {
        if (this.selectedTransactionCardIndex === cardIndexNumber) {
            this.selectedTransactionCardIndex = '';
            return;
        }
        this.selectedTransactionCardIndex = cardIndexNumber;
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
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/customer-transaction-table.scss';
</style>
