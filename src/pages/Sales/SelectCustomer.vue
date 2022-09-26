<template>
    <div class="select-customer-sales">
        <div
            v-if="!isCustomerCompulsory && !isEstimate"
            class="select-customer-sales__proceed-without-customer-section"
        >
            <h2
                @click="$emit('proceed-without-customer-text-clicked')"
                class="select-customer-sales__proceed-without-customer-text pointer"
            >
                Proceed Without Customer Name
            </h2>
            <img class="select-customer-sales__proceed-without-customer-icon" src="@/assets/img/info-icon-white.svg" />
        </div>
        <ListSearchAndAddBar
            buttonText="Add New"
            placeholder="Search for Customers"
            @search-input-changed="updateSearchString"
            @add-new-resource="addNewCustomer"
        />

        <div class="select-customer__loader" v-if="getCustomerRequestIsLoading">
            <Loader size="4" />
        </div>

        <template v-else>
            <!-- recent customers -->
            <template v-if="showrecentCustomers">
                <p class="select-customer-sales__headline">Recent Customers</p>
                <div :class="avatarContainerClass">
                    <AvatarAndResource
                        v-for="customer in recentCustomers"
                        :item="customer"
                        :key="customer.customerKey"
                        :resource-name="customer.name"
                        externalControl="true"
                        :itemKey="customer.customerKey"
                        :expandedItemKey="expandedRecentCustomerKey"
                        @full-details-toggled="toggleRecentCustomer"
                        @resource-selected="customerSelectedForSale(customer)"
                    >
                        <span class="select-customer-sales__item--amount" key="amount"></span>
                        <i class="select-customer-sales__item--date" key="date" v-if="customer.lastInteraction"
                            ><span class="select-customer-sales__interaction-text--italic">{{
                                customer.lastInteraction
                            }}</span
                            >, <span>{{ customer.lastInteractionAge }}</span></i
                        >
                        <!-- drop-down content -->
                        <template v-slot:drop-down>
                            <p class="select-customer-sales__phone-email-text" key="phoneEmail">
                                {{ customer.phoneNumber }}, {{ customer.email }}
                            </p>
                            <p
                                class="select-customer-sales__interaction-text"
                                key="interaction"
                                v-if="customer.lastInteraction"
                            >
                                <span class="select-customer-sales__interaction-text--italic">
                                    {{ customer.lastInteraction }} </span
                                >, <span>{{ customer.lastInteractionDate | monthDateYearFormat }}</span>
                                <span
                                    class="select-customer-sales__enter-sales-text"
                                    v-if="hasOpenEstimate(customer.lastInteraction)"
                                    @click="convertEstimateToSale(customer.lastSaleKey)"
                                >
                                    Enter Sales
                                </span>
                            </p>
                            <p
                                class="select-customer-sales__interaction-date-text"
                                key="interactionDate"
                                v-if="customer.totalFinancialYearSale.amount > 0"
                            >
                                {{ customer.totalFinancialYearSale | amountWithCurrency }} total sales since
                                {{ customer.financialYearStartDate }}
                            </p>
                            <p
                                class="select-customer-sales__balance-pending-text"
                                v-if="customer.totalBalanceDue.amount > 0"
                            >
                                {{ customer.totalBalanceDue | amountWithCurrency }} Balance Pending
                            </p>
                            <p
                                class="select-customer-sales__total-prepayment-text"
                                v-if="customer.totalPrepayment.amount > 0"
                            >
                                {{ customer.totalPrepayment | amountWithCurrency }} Prepayment
                            </p>
                            <div class="d-flex avatar-and-resource__actions-container">
                                <p
                                    class="avatar-and-resource__action select-customer__select mr-3"
                                    @click.stop="customerSelectedForSale(customer)"
                                >
                                    <img
                                        src="@/assets/img/select-resource.svg"
                                        class="select-customer__select--icon mr-3"
                                    />Select Customer
                                </p>

                                <p class="avatar-and-resource__action" @click.stop="editCustomer(customer)">
                                    <img
                                        src="@/assets/img/pencil.svg"
                                        class="select-customer-sales__edit-expanded-details-icon"
                                    />
                                    <span class="select-customer-sales__edit-expanded-details-text">Edit Details</span>
                                </p>
                            </div>
                        </template>
                    </AvatarAndResource>
                </div>
            </template>

            <!-- All customers -->
            <p class="select-customer-sales__headline">{{ headlineText }}</p>
            <div :class="avatarContainerClass">
                <AvatarAndResource
                    v-for="customer in customerListToBePickedFrom"
                    :key="customer.customerKey"
                    :resourceName="customer.name"
                    externalControl="true"
                    :itemKey="customer.customerKey"
                    :expandedItemKey="expandedCustomerKey"
                    @full-details-toggled="toggleCustomer"
                    @resource-selected="customerSelectedForSale(customer)"
                >
                    <span class="select-customer-sales__item--amount" key="amount"></span>
                    <i class="select-customer-sales__item--date" key="date" v-if="customer.lastInteraction"
                        ><span class="select-customer-sales__interaction-text--italic">{{
                            customer.lastInteraction
                        }}</span
                        >, <span>{{ customer.lastInteractionAge }}</span></i
                    >
                    <!-- drop-down content -->
                    <template v-slot:drop-down>
                        <p class="select-customer-sales__phone-email-text" key="phoneEmail">
                            {{ customer.phoneNumber }}, {{ customer.email }}
                        </p>
                        <p
                            class="select-customer-sales__interaction-text"
                            key="interaction"
                            v-if="customer.lastInteraction"
                        >
                            <span class="select-customer-sales__interaction-text--italic">
                                {{ customer.lastInteraction }} </span
                            >, <span>{{ customer.lastInteractionDate | monthDateYearFormat }}</span>
                            <span
                                class="select-customer-sales__enter-sales-text"
                                v-if="hasOpenEstimate(customer.lastInteraction)"
                                @click="convertEstimateToSale(customer.lastSaleKey)"
                            >
                                Enter Sales
                            </span>
                        </p>
                        <p
                            class="select-customer-sales__interaction-date-text"
                            key="interactionDate"
                            v-if="customer.totalFinancialYearSale.amount > 0"
                        >
                            {{ customer.totalFinancialYearSale | amountWithCurrency }} total sales since
                            {{ customer.financialYearStartDate }}
                        </p>
                        <p
                            class="select-customer-sales__balance-pending-text"
                            v-if="customer.totalBalanceDue.amount > 0"
                        >
                            {{ customer.totalBalanceDue | amountWithCurrency }} Balance Pending
                        </p>

                        <p
                            class="select-customer-sales__total-prepayment-text"
                            v-if="customer.totalPrepayment.amount > 0"
                        >
                            {{ customer.totalPrepayment | amountWithCurrency }} Prepayment
                        </p>
                        <div class="d-flex avatar-and-resource__actions-container">
                            <p
                                class="select-customer__select mr-3 avatar-and-resource__action"
                                @click.stop="customerSelectedForSale(customer)"
                            >
                                <img
                                    src="@/assets/img/select-resource.svg"
                                    class="select-customer__select--icon mr-3"
                                />Select Customer
                            </p>
                            <p @click.stop="editCustomer(customer)" class="avatar-and-resource__action">
                                <img
                                    src="@/assets/img/pencil.svg"
                                    class="select-customer-sales__edit-expanded-details-icon"
                                />
                                <span class="select-customer-sales__edit-expanded-details-text">Edit Details</span>
                            </p>
                        </div>
                    </template>
                </AvatarAndResource>
            </div>

            <div class="select-customer-sales__no-item-found" v-if="customerListIsEmpty">
                <p>Looks like you haven't added any customer to your list</p>
                <p>Click the Add New link above to add a Customer</p>
            </div>
            <div class="select-customer-sales__no-item-found" v-else-if="noSearchMatchFound">
                <p>Looks like you haven't added this customer to your list</p>
                <p>Click the Add New link above to add this Customer</p>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import CustomerModule from '@/store/modules/customer';

const customers = namespace('customer');
let customerModule: CustomerModule;

import { SaleCustomer } from '@/pages/Sales/types';
import UtilityMixins from '@/mixins/Utility';
import { CustomerRequest, Status } from '@/types';

@Component
export default class SelectCustomer extends Mixins(UtilityMixins) {
    private searchString = '';
    private inputVariable = [];
    private expandedRecentCustomerKey = '';
    private expandedCustomerKey = '';

    @customers.State
    private customers!: Array<SaleCustomer>;

    @customers.State
    private customerRequest!: CustomerRequest;

    @Prop({ required: true }) readonly isCustomerCompulsory!: boolean;
    @Prop({ default: false }) readonly isEstimate!: boolean;

    get showrecentCustomers(): boolean {
        return this.searchString.length === 0;
    }

    get headlineText(): string {
        return this.searchString.length > 0 ? 'Search Results' : 'All Customers';
    }

    get preparedCustomers(): SaleCustomer[] {
        return this.prepareCustomer(this.customers);
    }

    get recentCustomers(): SaleCustomer[] {
        const recentCustomers = this.sortByInteractionDate(this.preparedCustomers, 'lastInteractionDate');
        return recentCustomers.slice(0, 2);
    }

    get customerListToBePickedFrom(): Array<SaleCustomer> {
        const customers = this.sortArrayByName(this.preparedCustomers);
        return customers.filter(customer => {
            const values = Object.values(customer);
            return values.find(value => {
                if (typeof value !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get customerListIsEmpty(): boolean {
        return this.customerListToBePickedFrom.length === 0 && this.searchString.length === 0;
    }

    get noSearchMatchFound(): boolean {
        return this.customerListToBePickedFrom.length === 0 && this.searchString.length > 0;
    }

    get avatarContainerClass(): string {
        // return !this.userIsOnTablet ? 'avatar-and-resource__container' : '';
        return 'avatar-and-resource__container';
    }

    get getCustomerRequestIsLoading(): boolean {
        return this.customerRequest.getCustomers === Status.LOADING;
    }

    private hasOpenEstimate(lastInteraction: string) {
        return lastInteraction === 'Estimate';
    }

    private updateSearchString(searchString: string) {
        this.searchString = searchString;
    }

    private toggleRecentCustomer(key: string) {
        if (this.expandedRecentCustomerKey == key) {
            this.expandedRecentCustomerKey = '';
            return;
        }
        this.expandedRecentCustomerKey = key;
    }

    private toggleCustomer(key: string) {
        this.expandedRecentCustomerKey = '';

        if (this.expandedCustomerKey == key) {
            this.expandedCustomerKey = '';
            return;
        }
        this.expandedCustomerKey = key;
    }

    private customerSelectedForSale(selectedCustomer: SaleCustomer) {
        this.$emit('customer-selected', selectedCustomer);
    }

    private addNewCustomer() {
        this.$emit('add-new-customer', this.searchString);
    }

    private editCustomer(customerForEdit: SaleCustomer) {
        this.$emit('edit-customer', customerForEdit);
    }

    private convertEstimateToSale(saleKey: string) {
        this.$emit('convert-estimate-to-sale', saleKey);
    }

    mounted() {
        customerModule = getModule(CustomerModule, this.$store);
        customerModule.getCustomers();
    }
}
</script>

<style lang="scss">
.select-customer-sales {
    &__proceed-without-customer-search-bar-section {
        @include media-breakpoint-up(md) {
            padding: 0 13px;
        }
    }
    &__proceed-without-customer-section {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
    }
    &__proceed-without-customer-text {
        font-size: 14px;
        font-weight: normal;
        color: $primary-color;
        margin: 0;
        text-decoration: underline;
    }
    &__proceed-without-customer-icon {
        margin-left: 5px;
    }

    &__headline {
        font-size: 12px;
        padding: 0 13px 0 0;
        border-bottom: 1px solid $light-grey-7;
        color: $dark-grey-1;
        margin: 0;
    }
    &__phone-email-text,
    &__interaction-date-text {
        font-size: 11px;
        margin-bottom: 6px;
    }
    &__interaction-text,
    &__balance-pending-text {
        font-size: 12px;
        margin-bottom: 6px;
    }
    &__interaction-text {
        &--italic {
            font-style: italic;
        }
    }
    &__interaction-date-text {
        font-style: italic;
    }

    &__enter-sales-text {
        margin-left: 10px;
        color: $primary-color;
        text-decoration: underline;
    }
    &__balance-pending-text {
        color: #ef3434;
        margin-bottom: 13px;
    }
    &__edit-expanded-details-text {
        margin-left: 6px;
        color: $primary-black;
    }
    &__no-item-found {
        font-size: 14px;
        color: $dark-grey-1;
    }
    &__info {
        font-size: 12px;
        color: $dark-grey-1;
    }

    &__total-prepayment-text {
        color: $primary-color;
        margin-bottom: 13px;
    }
}
</style>
