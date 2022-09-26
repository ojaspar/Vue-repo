<template>
    <b-container fluid class="p-0">
        <div class="sale-customer-list">
            <div class="sale-customer-list__header">
                <span>Customer List</span>
                <span class="pointer" @click="displayCustomerModal"><i>Add New</i></span>
            </div>

            <div class="sale-customer-list__search-section">
                <div class="sale-customer-list__links">
                    <transition name="fade">
                        <span
                            v-if="canProceedWithoutCustomer"
                            class="sale-customer-list__links--unnamed-customer"
                            @click="$emit('proceed-without-customer')"
                        >
                            Proceed with Unnamed Customer
                        </span>
                    </transition>
                    <span class="sale-customer-list__links--new-customer" @click="displayCustomerModal">
                        Add New
                    </span>
                </div>
                <div class="sale-customer-list__search-container">
                    <font-awesome-icon icon="search" class="sale-customer-list__search--icon" />

                    <div class="w-100">
                        <BaseInputField
                            placeholder="Search for customer"
                            inputContainerClass="sale-customer-list__search"
                            className="sale-customer-list__search--input"
                            v-model="searchString"
                        />
                    </div>
                </div>
            </div>

            <div class="sale-customer-list__body">
                <div v-if="customersAreAvailable">
                    <transition-group name="slide-up-fade">
                        <AvatarAndResource
                            class="sale-customer-list__avatar"
                            resourceNameClass="sale-customer-list__avatar--name"
                            v-for="customer in allCustomers"
                            :key="customer.customerKey"
                            :resourceName="customer.name"
                            :showChevronIcon="false"
                            :itemKey="customer.customerKey"
                            expandedItemKey=""
                            @resource-selected="handleCustomerSelection(customer)"
                        >
                            <template>
                                <span v-if="customer.lastActivity" class="sale-customer-list__avatar--text">
                                    {{ customer.lastActivity }}
                                    <i class="ml-1">{{ customer.lastActivityDate | humanReadableDateTime }}</i>
                                </span>
                            </template>
                        </AvatarAndResource>
                    </transition-group>
                </div>
                <div v-else-if="fetchingCustomers" class="sale-customer-list__body--loader">
                    <Loader size="2" />
                </div>
                <div v-show="contentIsEmpty" class="sale-customer-list__body--empty">
                    <span v-html="noContentMessage"></span>
                </div>
            </div>
        </div>

        <BaseModal
            :modalId="newCustomerModal"
            modalTitle="New Customer"
            :no-close-on-backdrop="!closeCustomerModalOnBackdrop"
            @hide-modal="hideCustomerModal"
        >
            <AddCustomerForm
                :searchedCustomer="searchString"
                :customerIsToBeEdited="customerIsToBeEdited"
                :selectedCustomerForEditing="selectedCustomerForEditing"
                @customer-added="handleCustomerCreation"
                @close-customer-modal-on-backdrop="setModalClosureOnBackdrop"
            />
        </BaseModal>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import AddCustomerForm from '@/pages/Sales/ManageCustomers/AddOrEditCustomerForm.vue';

import { Status, CustomerRequest } from '@/types';
import { defaultCustomer, SaleCustomer } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';
import CustomerModule from '@/store/modules/customer';

const customers = namespace('customer');

@Component({ components: { AddCustomerForm } })
export default class CustomerList extends Mixins(UtilityMixins) {
    @Prop({ default: false }) readonly customerIsToBeEdited!: boolean;
    @Prop({ default: true }) readonly allowUnnamedCustomer!: boolean;
    @Prop({ default: false }) readonly isEstimate!: boolean;
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomerForEditing!: SaleCustomer;

    private searchString = '';
    private newCustomerModal = 'new-customer-modal';
    private closeCustomerModalOnBackdrop = false;
    private selectedCustomer: SaleCustomer = { ...defaultCustomer };

    @customers.State
    private customers!: Array<SaleCustomer>;

    @customers.State
    private customerRequest!: CustomerRequest;

    get fetchingCustomers() {
        return this.customerRequest.getCustomers === Status.LOADING;
    }

    get customersAreAvailable() {
        return this.customers.length > 0;
    }

    get contentIsEmpty() {
        return !this.fetchingCustomers && this.noContentMessage != '';
    }

    get canProceedWithoutCustomer(): boolean {
        return this.allowUnnamedCustomer && !this.isEstimate;
    }

    get searchStringIsEmpty(): boolean {
        return this.searchString.length === 0;
    }

    get allCustomers(): Array<SaleCustomer> {
        const allCustomers = this.sortArrayByName(this.customers);
        if (this.searchStringIsEmpty) return allCustomers;
        return allCustomers.filter(customer => {
            const values = Object.values(customer);
            return values.find(value => {
                if (typeof value !== 'string') return;
                return value.toLowerCase().includes(this.searchString.toLowerCase());
            });
        });
    }

    get searchMatchFound() {
        if (this.searchStringIsEmpty) return true;
        if (!this.searchStringIsEmpty && !this.customersAreAvailable) return true;
        return this.customersAreAvailable && this.allCustomers.length > 0;
    }

    get noContentMessage(): string {
        if (!this.searchMatchFound) {
            return `<p>Looks like you haven't added this Customer to your list</p>
            <p>Click the "Add New" link above to add it</p>`;
        }
        if (!this.customersAreAvailable) {
            return `<p>Looks like you haven't added any Customer to your list</p>
            <p>Click the "Add New" link above to start</p>`;
        }
        return '';
    }

    private handleCustomerSelection(selectedCustomer: SaleCustomer) {
        this.$emit('customer-selected', selectedCustomer);
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeCustomerModalOnBackdrop = coseModal;
    }

    private displayCustomerModal() {
        this.displayModal(this.newCustomerModal);
    }

    private hideCustomerModal() {
        this.cancelModal(this.newCustomerModal);
    }

    private handleCustomerCreation(selectedCustomer: SaleCustomer) {
        this.hideCustomerModal();
        this.handleCustomerSelection(selectedCustomer);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/customer-list';
</style>
