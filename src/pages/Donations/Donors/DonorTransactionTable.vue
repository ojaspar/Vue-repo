<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-donor-transaction-table">
            <b-row class="donor-transaction-table__heading">
                <b-col class="pl-0">Donation Scheme</b-col>
                <b-col>Form of Donation</b-col>
                <b-col cols="4">Description</b-col>
                <b-col>Value</b-col>
                <b-col>Type of Donation</b-col>
            </b-row>

            <div v-if="transactionsAreAvailable">
                <b-row
                    class="donor-transaction-table__content"
                    v-for="(transaction, index) in transactions"
                    :key="index"
                >
                    <font-awesome-icon icon="ellipsis-h" class="pointer mr-3" />
                    <b-col class="pl-0">
                        <p class="content-text m-0">{{ transaction.donationScheme }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ transaction.donationForm }}</p>
                    </b-col>
                    <b-col cols="4">
                        <p class="content-text m-0">{{ transaction.description || 'None' }}</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0" v-if="transaction.amount.amount > 0">
                            {{ transaction.amount | amountWithCurrency }}
                        </p>
                        <p class="content-text m-0" v-else>None</p>
                    </b-col>
                    <b-col>
                        <p class="content-text m-0">{{ donationType(transaction.redemptionType) }}</p>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="donor-transaction-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donor-transaction-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="small-donor-transaction-table">
            <div v-if="transactionsAreAvailable">
                <b-row
                    class="product-transaction-mobile-table"
                    v-for="(transaction, index) in transactions"
                    :key="index"
                >
                    <b-col
                        class="product-transaction-mobile-table__content"
                        @click="toggleTransactionDetailsCard(index)"
                    >
                        <div class="product-transaction-mobile-table__content--details">
                            <p class="mobile-content__text">
                                {{ transaction.donationScheme }}
                            </p>
                            <p class="mobile-content__text">{{ transaction.donationForm }} Donation</p>
                            <p class="mobile-content__text" v-if="transaction.amount.amount > 0">
                                {{ transaction.amount | amountWithCurrency }}
                            </p>
                            <p class="mobile-content__text">
                                {{ transaction.description }}
                            </p>
                            <transition name="slide-up-fade">
                                <span v-show="showTransactionDetails(index)">
                                    <p class="mt-3 mb-0">
                                        <span
                                            class="content-text__m-r mobile-content__icon-text"
                                            @click.stop="goToEditDonationPage(transaction.donationKey)"
                                        >
                                            <font-awesome-icon icon="pencil-alt" class="table-icon" /> Edit</span
                                        >
                                        <font-awesome-icon icon="times-circle" class="table-icon" />
                                        <span class="mr-5 pointer mobile-content__icon-text">Cancel</span>
                                    </p>
                                </span>
                            </transition>
                        </div>

                        <div class="mobile-content__right">
                            <p class="icon-box" v-if="caretShouldShow(index)">
                                <font-awesome-icon :icon="transactionCardDetailsIcon(index)" class="card-icon" />
                            </p>

                            <p
                                :class="[
                                    donationTypeClass(transaction.redemptionType),
                                    'align-right',
                                    'content-text mt-4',
                                ]"
                            >
                                {{ donationType(transaction.redemptionType) }}
                            </p>
                        </div>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="donor-transaction-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="donor-transaction-table__content--empty mt-5">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { DonorDonation, FormOfDonation, RedemptionTypeOption } from '@/pages/Donations/types';
import { VueExtension } from '@/types';

const defaultTransaction: DonorDonation = {
    transactionDate: '',
    donationScheme: '',
    donationForm: FormOfDonation.FINANCIAL,
    description: '',
    amount: { currencyKey: 0, amount: 0 },
    redemptionType: RedemptionTypeOption.INSTANT,
    donorName: '',
    pledgeDueDate: '',
    donationKey: '',
};

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class DonorTransactionTable extends Vue {
    @Prop({ default: () => defaultTransaction }) readonly transactions!: DonorDonation[];
    @Prop({ default: true }) readonly searchMatchFound!: boolean;
    @Prop({ default: 'NORMAL' }) readonly status!: string;

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

    get requestIsLoading() {
        return this.status === 'LOADING';
    }

    private donationTypeClass(donationType: string): string {
        if (donationType.toLowerCase() === 'pledge') {
            return 'content-text__pledge';
        }
        return 'content-text__instant';
    }

    private donationType(donationType: string): string {
        return donationType.toLowerCase().includes('instant') ? `Instant Donation` : donationType;
    }

    private transactionCardDetailsIcon(cardIndexNumber: string): string {
        return this.selectedTransactionCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private showTransactionDetails(cardIndexNumber: string) {
        return this.selectedTransactionCardIndex === cardIndexNumber;
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

    private goToEditDonationPage(donationKey: string) {
        this.$router.push({
            name: 'EditDonation',
            params: {
                donationKey,
            },
        });
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/donations/donation-transaction-table.scss';
</style>
