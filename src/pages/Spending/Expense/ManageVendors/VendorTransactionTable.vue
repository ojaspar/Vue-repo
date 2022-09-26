<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-vendor-transaction">
            <b-row class="vendor-transaction__heading">
                <b-col class="pl-0">Date / ID</b-col>
                <b-col>Transaction</b-col>
                <b-col cols="4">Items</b-col>
                <b-col>Amount</b-col>
                <b-col>Delivery Status</b-col>
            </b-row>

            <div v-if="transactionsAreAvailable">
                <b-row class="vendor-transaction__content" v-for="(transaction, index) in transactions" :key="index">
                    <font-awesome-icon icon="ellipsis-h" class="pointer mr-3" />
                    <b-col class="pl-0">
                        <p class="content-text m-0">{{ transaction.transactionDate | monthDateYearFormat }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ transaction.expenseType || '-' }}</p>
                    </b-col>
                    <b-col cols="4">
                        <p class="content-text m-0">{{ transaction.itemName }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ transaction.totalAmountExclusiveOfTax | amountWithCurrency }}</p>
                        <p class="content-text__meta--balance" v-show="transaction.balance.amount !== 0">
                            {{ transaction.balance | amountWithCurrency }} <i>Balance Due</i>
                        </p>
                    </b-col>
                    <b-col>
                        <p :class="[deliveryStatusClass(transaction.supplyStatus), 'm-0']">
                            {{ transaction.supplyStatus }}
                        </p>
                        <p
                            class="content-text__meta--date dark-grey"
                            v-if="!isCompletedStatus(transaction.supplyStatus)"
                        >
                            {{ transaction.supplyDueDate | monthDateYearFormat }}
                        </p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="vendor-transaction__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="vendor-transaction__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="medium-vendor-transaction">
            <div v-if="transactionsAreAvailable">
                <b-row class="mobile-table" v-for="(transaction, index) in transactions" :key="index">
                    <b-col class="mobile-table__content" @click="toggleTransactionDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ transaction.transactionDate }}
                                <span class="dark-grey"> {{ `(${transaction.expenseType})` }} </span>
                            </p>
                            <p class="mobile-content__text">
                                {{ transaction.itemName }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showTransactionDetails(index)">
                                    <p :class="deliveryStatusClass(transaction.supplyStatus)">
                                        {{ `${transaction.supplyStatus} Delivery` }}
                                        <span
                                            class="dark-grey ml-3"
                                            v-if="!isCompletedStatus(transaction.supplyStatus)"
                                        >
                                            <i>Due {{ transaction.supplyDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ transaction.itemName }}
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
                                <p class="mobile-content__text align-right">
                                    {{ transaction.totalAmountExclusiveOfTax | amountWithCurrency }}
                                    <span class="mobile-content__balance ml-2" v-if="transaction.balance.amount !== 0">
                                        ( {{ transaction.balance | amountWithCurrency }} Balance)
                                    </span>
                                </p>
                                <p :class="[deliveryStatusClass(transaction.supplyStatus), 'align-right']">
                                    {{ `${transaction.supplyStatus} Delivery` }}
                                </p>
                            </span>

                            <span v-show="showTransactionDetails(index)">
                                <p class="mobile-content__text align-right mt-0">
                                    {{ transaction.totalAmountExclusiveOfTax | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__balance ml-2" v-if="transaction.balance.amount !== 0">
                                    {{ transaction.balance | amountWithCurrency }} Balance
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="vendor-transaction__content--loader">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="vendor-transaction__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="small-vendor-transaction">
            <div v-if="transactionsAreAvailable">
                <b-row class="mobile-table" v-for="(transaction, index) in transactions" :key="index">
                    <b-col class="mobile-table__content" @click="toggleTransactionDetailsCard(index)">
                        <div class="mobile-table__content--details">
                            <p class="mobile-content__meta">
                                {{ transaction.transactionDate }}
                                <span class="dark-grey"> {{ `(${transaction.expenseType})` }} </span>
                            </p>
                            <span>
                                <p class="mobile-content__text">
                                    {{ transaction.totalAmountExclusiveOfTax | amountWithCurrency }}
                                    <span class="mobile-content__balance ml-2" v-if="transaction.balance.amount !== 0">
                                        ( {{ transaction.balance | amountWithCurrency }} Balance)
                                    </span>
                                </p>
                                <p class="mobile-content__text">
                                    {{ transaction.itemName }}
                                </p>
                            </span>
                            <transition name="slide-up-fade">
                                <span v-show="showTransactionDetails(index)">
                                    <p :class="deliveryStatusClass(transaction.supplyStatus)">
                                        {{ `${transaction.supplyStatus} Delivery` }}
                                        <span
                                            class="dark-grey ml-3"
                                            v-if="!isCompletedStatus(transaction.supplyStatus)"
                                        >
                                            <i>Due {{ transaction.supplyDueDate | monthDateYearFormat }}</i>
                                        </span>
                                    </p>
                                    <p class="mobile-content__text">
                                        {{ transaction.itemName }}
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
                                <p :class="[deliveryStatusClass(transaction.supplyStatus), 'align-right', 'm-t']">
                                    {{ `${transaction.supplyStatus} Delivery` }}
                                </p>
                            </span>

                            <span v-show="showTransactionDetails(index)">
                                <p class="mobile-content__text align-right mt-0">
                                    {{ transaction.totalAmountExclusiveOfTax | amountWithCurrency }}
                                </p>
                                <p class="mobile-content__balance align-right" v-if="transaction.balance.amount !== 0">
                                    <span class="dark-grey">Balance:</span>
                                    {{ transaction.balance | amountWithCurrency }}
                                </p>
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="transactionsRequestIsLoading" cols="12" class="vendor-transaction__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="vendor-transaction__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { VendorTransaction } from '@/pages/Spending/Expense/ManageVendors/types';
import { VueExtension } from '@/types';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class VendorTransactionTable extends Vue {
    @Prop({ default: () => [] }) readonly transactions!: VendorTransaction[];
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

    private deliveryStatusClass(deliveryStatus: string) {
        if (deliveryStatus === 'Pending') {
            return 'content-text__pending';
        }
        if (deliveryStatus === 'Partial') {
            return 'content-text__partial';
        }
        return 'content-text__completed';
    }

    private isCompletedStatus(deliveryStatus: string): boolean {
        return deliveryStatus.toLowerCase() === 'completed';
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
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/vendor-transaction-table.scss';
</style>
