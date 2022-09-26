<template>
    <b-container fluid class="customer-dashboard">
        <h3 class="customer-dashboard__title">Customers</h3>

        <b-row>
            <BasePrimaryButton
                buttonText="Add Customer"
                :overRideButtonClass="true"
                className="customer-dashboard__mobile-add-customer-btn"
                @button-clicked="showNewCustomerForm"
            />
        </b-row>

        <div class="customer-dashboard__content">
            <TopSection @add-new-customer="showNewCustomerForm" @search-string-changed="updateSearchString" />

            <CustomerTable
                :customers="customersToBeDisplayed"
                :customerSearchString="customerSearchString"
                :status="customerRequest.getCustomers"
                :searchMatchFound="searchMatchFound"
                @edit-existing-customer="editCustomer"
            />
        </div>

        <NewCustomerForm
            :isEditing="customerSelectedForEditing"
            :customerToBeEdited="customerToBeEdited"
            :closeModalOnBackdrop="closeModalOnBackdrop"
            @customer-added="refreshCustomerList"
            @reset-customer-form-mode="resetCustomerFormMode"
            @close-customer-modal-on-backdrop="setModalClosureOnBackdrop"
        />
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TopSection from '@/pages/Sales/ManageCustomers/TopSection.vue';
import CustomerTable from '@/pages/Sales/ManageCustomers/CustomerTable.vue';
import NewCustomerForm from '@/pages/Sales/ManageCustomers/AddOrEditCustomerModal.vue';

import CustomerModule from '@/store/modules/customer';

import { CustomerRequest } from '@/types';
import { CustomerDetails } from '@/pages/Sales/ManageCustomers/types';

const customers = namespace('customer');
let customerModule: CustomerModule;

@Component({
    components: {
        TopSection,
        CustomerTable,
        NewCustomerForm,
    },
})
export default class CustomerDashboard extends Vue {
    private customerSearchString = '';

    private customerSelectedForEditing = false;
    private customerToBeEdited = {};
    private closeModalOnBackdrop = false;

    @customers.State
    private customers!: CustomerDetails[];

    @customers.State
    private customerRequest!: CustomerRequest;

    get searchMatchFound() {
        if (this.customerSearchString.length == 0) return true;
        if (this.customerSearchString.length > 0 && this.customers.length < 1) return true;
        return this.customers.length > 0 && this.customersToBeDisplayed.length > 0;
    }

    get customersToBeDisplayed(): CustomerDetails[] {
        return this.customers.filter(customer => {
            const values = Object.values(customer);
            return values.find(value => {
                if ((typeof value).toString() !== 'string') return;
                return value.toLowerCase().includes(this.customerSearchString.toLowerCase());
            });
        });
    }

    private showNewCustomerForm() {
        this.$bvModal.show('new-customer-form');
    }

    private updateSearchString(searchString: string) {
        this.customerSearchString = searchString;
    }

    private editCustomer(customerToBeEdited: string) {
        this.customerSelectedForEditing = true;
        this.customerToBeEdited = customerToBeEdited;
        this.showNewCustomerForm();
    }

    private refreshCustomerList() {
        customerModule.getCustomers();
    }

    private resetCustomerFormMode() {
        this.customerSelectedForEditing = false;
        this.customerToBeEdited = {};
    }

    private emitMobilePageTitle() {
        this.$parent.$emit('update-page-title', 'Customers');
    }

    private goToSalesDashboard() {
        this.$router.push({ name: 'Sales' });
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeModalOnBackdrop = coseModal;
    }

    mounted() {
        customerModule = getModule(CustomerModule, this.$store);
        customerModule.getCustomers();
        this.emitMobilePageTitle();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/customer-dashboard';
</style>
