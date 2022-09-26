<template>
    <div>
        <div class="customer-table__desktop">
            <b-row class="customer-table__heading">
                <b-col class="pl-3">Name</b-col>
                <b-col v-if="userIsOnDesktop">Last Interaction</b-col>
                <b-col>Phone/E-mail</b-col>
                <b-col>Address/Notes</b-col>
            </b-row>

            <div v-if="customersAreAvailable">
                <b-row class="customer-table__content" v-for="(customer, index) in customers" :key="index">
                    <!-- More Options -->
                    <font-awesome-icon
                        icon="ellipsis-h"
                        class="pointer"
                        title="More options"
                        @click="toggleShowOptions(index)"
                        @mousedown="preventBlurFromHappening"
                    /><b-col
                        cols="1"
                        tabindex="-1"
                        class="customer-table__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p class="customer-table__content-action" @click="editCustomer(customer)">
                            Edit Customer
                        </p>
                        <p class="customer-table__content-action" @click="goToTransactionPage(customer)">
                            View Sales
                        </p>
                        <p class="customer-table__content-action" @click="goToRecordNewSale(customer)">
                            New Sale/Invoice
                        </p>
                    </b-col>

                    <b-col class="pl-3">{{ customer.name }}</b-col>
                    <b-col v-if="userIsOnDesktop">
                        <p class="m-0" v-if="customer.lastInteraction">
                            <i class="txt--bold">{{ customerLastInteraction(customer.lastInteraction) }}</i>
                            <span class="dark--grey" v-if="customer.lastInteractionDate">
                                , {{ customer.lastInteractionDate | monthDateYearFormat }}
                            </span>
                        </p>
                        <p
                            v-if="customer.totalBalanceDue.amount"
                            :class="[paymentStatusClass(customer.paymentStatus), 'm-0']"
                        >
                            {{ `${customer.amount} ${customer.paymentStatus}` }}
                        </p>
                        <p v-if="noCustomerInteraction(customer)" class="ml-5">-</p>
                    </b-col>
                    <b-col>
                        <p class="m-0">{{ customer.email | lowercase }}</p>
                        <p class="m-0">{{ customer.phoneNumber }}</p>
                    </b-col>
                    <b-col>
                        <p class="customer-table__content--ml" v-if="contentIsEmpty(customer)">-</p>
                        <span v-else>
                            <p class="m-0">{{ customer.address }}</p>
                            <p class="m-0">{{ customer.notes }}</p>
                        </span>
                    </b-col>
                </b-row>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="customer-table__content--loader mt-5">
                <Loader size="4" />
            </div>

            <div v-else cols="12" class="customer-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
        <div class="customer-table__mobile">
            <div v-if="customersAreAvailable">
                <div class="customer-table__mobile-content" v-for="(customer, index) in customers" :key="index">
                    <p>{{ customer.name }}</p>
                    <p>{{ customer.email | lowercase }}</p>
                    <p>{{ customer.phoneNumber }}</p>
                </div>
            </div>

            <div v-else-if="requestIsLoading" cols="12" class="customer-table__content--loader mt-5">
                <Loader size="2" />
            </div>

            <div v-else cols="12" class="customer-table__content--empty">
                {{ noContentMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Ref } from 'vue-property-decorator';

import CustomerList from '@/pages/Sales/ManageCustomers/Customers.vue';

import { CustomerDetails, defauldCustomerDetails } from '@/pages/Sales/ManageCustomers/types';
import { SaleCustomer } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import SessionStorageService from '@/services/sessionStorage';

@Component({
    components: {
        CustomerList,
    },
})
export default class CustomerTable extends Mixins(UtilityMixins) {
    @Prop({ default: () => defauldCustomerDetails }) readonly customers!: Array<CustomerDetails>;
    @Prop({ default: '' }) readonly customerSearchString!: string;
    @Prop({ default: 'NORMAL' }) readonly status!: string;
    @Prop({ default: true }) readonly searchMatchFound!: boolean;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    get showRecentCustomers(): boolean {
        return this.customerSearchString.length === 0;
    }

    get requestIsLoading() {
        return this.status === 'LOADING';
    }

    get vendorHeadlineText(): string {
        return this.customerSearchString.length > 0 ? 'Search Results' : 'All Customers';
    }

    get customersAreAvailable(): boolean {
        return this.customers.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return 'No match found';
        }
        if (!this.customersAreAvailable) {
            return 'There are no customers available';
        }
        return '';
    }

    get preparedCustomers(): SaleCustomer[] {
        return this.prepareCustomer(this.customers);
    }

    get recentCustomers(): SaleCustomer[] {
        const recentCustomers = this.sortByInteractionDate(this.preparedCustomers, 'lastInteractionDate');
        return recentCustomers.slice(0, 2);
    }

    get allCustomersToBeDisplayed(): SaleCustomer[] {
        const allCustomers = this.sortArrayByName(this.preparedCustomers);
        return allCustomers.filter(customer =>
            customer.name.toLowerCase().includes(this.customerSearchString.toLowerCase()),
        );
    }

    private noCustomerInteraction(customer: CustomerDetails): boolean {
        const { lastInteraction, lastInteractionDate, totalBalanceDue } = customer;
        if (lastInteraction && lastInteractionDate && totalBalanceDue.amount) {
            return lastInteraction == '' && lastInteractionDate == '' && totalBalanceDue.amount < 1;
        }
        if (!totalBalanceDue.amount && lastInteraction && lastInteractionDate) {
            return lastInteraction == '' && lastInteractionDate == '';
        }
        if (!totalBalanceDue.amount && !lastInteractionDate && lastInteraction) {
            return lastInteraction == '';
        }
        return true;
    }

    private customerLastInteraction(lastInteraction: string) {
        return lastInteraction.toLowerCase() === 'completed' ? 'Sale' : lastInteraction;
    }

    private contentIsEmpty(customer: CustomerDetails): boolean {
        const { address, notes } = customer;
        return address == '' && notes == '';
    }

    private paymentStatusClass(paymentStatus: string) {
        return paymentStatus === 'Prepayment' ? 'prepayment' : 'balance';
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }
        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private goToTransactionPage(customer: CustomerDetails) {
        SessionStorageService.setItem('selected-customer', JSON.stringify(customer));
        const { customerKey, name } = customer;
        const transactionPage = { name: 'CustomerTransactions', params: { customerKey, name } };
        this.$router.push(transactionPage);
    }

    private goToRecordNewSale(customer: CustomerDetails) {
        SessionStorageService.setItem('selected-customer', JSON.stringify(customer));

        this.$router.push({ name: 'RecordSale' });
    }

    private editCustomer(customerKey: string) {
        this.$emit('edit-existing-customer', customerKey);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/customer-table';
</style>
