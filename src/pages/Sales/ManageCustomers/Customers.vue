<template>
    <div class="customers__details">
        <b-row
            class="m-2 pb-4"
            v-for="(customer, index) in customers"
            :key="index"
            @click="toggleItemDetailsCard(index)"
        >
            <b-col class="customers__avatar">
                <span class="avatar-text">{{ customer.name | initials }}</span>
            </b-col>
            <b-col class="customers__info-container">
                <b-col class="customers__info p-0">
                    <div class="info">
                        <p class="info__name">{{ customer.name }}</p>
                        <p v-if="customer.lastInteraction" class="info__text" v-show="showItemAmountAndDate(index)">
                            <i>
                                {{ customerLastInteraction(customer.lastInteraction) }}
                                <span v-if="customer.lastInteractionDate"
                                    >, {{ customer.lastInteractionDate | humanReadableDateTime }}
                                </span>
                            </i>
                        </p>
                        <transition-group name="slide-up-fade">
                            <div v-if="showItemDetails(index)" class="customers__dropdown" key="dropdown">
                                <p class="info__text" key="type">
                                    <i>{{ `${customer.phoneNumber}, ${customer.email}` }}</i>
                                </p>
                                <p class="info__text" key="amount" v-if="customer.lastInteraction">
                                    <i>
                                        <b>{{ customerLastInteraction(customer.lastInteraction) }} </b>
                                        <span v-if="customer.lastInteractionDate">
                                            , {{ customer.lastInteractionDate | monthDateYearFormat }}
                                        </span>
                                    </i>
                                    <span
                                        class="info__enter-sales-text"
                                        v-if="hasOpenEstimate(customer.lastInteraction)"
                                        @click="convertEstimateToSale(customer.lastSaleKey)"
                                    >
                                        Enter Sales
                                    </span>
                                </p>
                                <p class="info__text" key="date" v-if="customer.totalFinancialYearSale.amount > 0">
                                    <i>
                                        {{ customer.totalFinancialYearSale | amountWithCurrency }} total sales since
                                        {{ customer.financialYearStartDate }}
                                    </i>
                                </p>
                                <p class="info__text--balance" key="balance" v-if="customer.totalBalanceDue.amount">
                                    <span>{{ customer.totalBalanceDue | amountWithCurrency }}</span>
                                    <i class="ml-2">Pending Balance</i>
                                </p>
                                <p key="edit-icon">
                                    <font-awesome-icon icon="pencil-alt" class="info__icon" />
                                    <span class="icon-text mr-2" @click="$emit('edit-existing-customer', customer)">
                                        Edit Customer
                                    </span>
                                    <font-awesome-icon icon="eye" class="info__icon ml-5" />
                                    <span class="icon-text" @click="$emit('view-transactions', customer.customerKey)">
                                        View Sales
                                    </span>
                                </p>
                                <p key="sale-icon">
                                    <font-awesome-icon icon="plus" class="info__icon" />
                                    <span class="icon-text" @click="$emit('go-to-record-sale', customer)">
                                        New Sale / Invoice
                                    </span>
                                </p>
                            </div>
                        </transition-group>
                    </div>
                    <div class="info__icon-box"><font-awesome-icon :icon="chevronIcon(index)" /></div>
                </b-col>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { CustomerDetails, defauldCustomerDetails } from '@/pages/Sales/ManageCustomers/types';

@Component
export default class CustomerList extends Vue {
    @Prop({ default: () => defauldCustomerDetails }) readonly customers!: Array<CustomerDetails>;
    @Prop({ default: false }) readonly getProductsRequestIsLoading!: boolean;

    private selectedItemCardIndex = '';

    private convertEstimateToSale(saleKey: string) {
        this.$router.push({ name: 'RecordSale', params: { convertEstimateKey: saleKey } });
    }

    private hasOpenEstimate(lastInteraction: string) {
        return lastInteraction === 'Estimate';
    }

    private showItemDetails(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber;
    }

    private showItemAmountAndDate(cardIndexNumber: string) {
        return this.selectedItemCardIndex !== cardIndexNumber;
    }

    private chevronIcon(cardIndexNumber: string) {
        return this.selectedItemCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private toggleItemDetailsCard(cardIndexNumber: string) {
        if (this.selectedItemCardIndex === cardIndexNumber) {
            this.selectedItemCardIndex = '';
            return;
        }
        this.selectedItemCardIndex = cardIndexNumber;
    }

    private customerLastInteraction(lastInteraction: string) {
        return lastInteraction.toLowerCase() === 'completed' ? 'Sale' : lastInteraction;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/customer-list';
</style>
