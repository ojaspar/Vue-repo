<template>
    <b-container>
        <!-- Customer Name -->
        <b-row>
            <b-col class="new-customer-form__input--col">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Customer Name"
                    v-model="customer.name"
                    :errors="addCustomerError.name"
                    @input="validateCustomerName(customer.name)"
                />
            </b-col>
        </b-row>
        <!-- Phone Number -->
        <b-row>
            <b-col class="new-customer-form__input--col">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Phone Number"
                    v-model="customer.phoneNumber"
                    :errors="addCustomerError.phoneNumber"
                    @input="validateCustomerPhoneNumber(customer.phoneNumber)"
                />
            </b-col>
        </b-row>
        <!-- Email Address -->
        <b-row>
            <b-col class="new-customer-form__input--col">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Email Address"
                    type="email"
                    v-model="customer.email"
                    :errors="addCustomerError.email"
                    @input="validateCustomerEmail(customer.email)"
                />
            </b-col>
        </b-row>
        <transition-group name="slide-up-fade" mode="out-in">
            <template v-if="showFullDetails">
                <!-- Delivery Address -->
                <b-row key="address">
                    <b-col class="new-customer-form__input--col">
                        <BaseTextAreaWithBorderAndFloatingLabel
                            floatingLabelText="Delivery Address"
                            v-model="customer.address"
                        />
                    </b-col>
                </b-row>
                <!-- Notes -->
                <b-row key="notes">
                    <b-col class="new-customer-form__input--col">
                        <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="customer.notes" />
                    </b-col>
                </b-row>
                <p @click="toggleFullDetails" class="new-customer-form__full-details-toggle" key="less">Less details</p>
            </template>
        </transition-group>
        <p v-if="!showFullDetails" @click="toggleFullDetails" class="new-customer-form__full-details-toggle">
            More details
        </p>

        <b-row class="new-customer-form__footer">
            <BasePrimaryButton
                :buttonText="addOrEditCustomerFormButtonText"
                className="new-customer-form__save-btn"
                :status="customerRequestStatus"
                :disabled="buttonShouldBeDisabled"
                @button-clicked="handleCustomerForm"
            />
        </b-row>
        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { Status, CustomerRequest } from '@/types';
import { CustomerBioData } from '@/pages/Sales/ManageCustomers/types';
import { SaleCustomer } from '@/pages/Sales/types';

import CustomerModule from '@/store/modules/customer.ts';
import ValidationMixin from '@/mixins/validation.ts';
import UtilityMixins from '@/mixins/Utility';

import { isEmpty, resetFormFields } from '@/utils/formValidator';

const customer = namespace('customer');
let customerModule: CustomerModule;

const defaultCustomer: CustomerBioData = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
};

@Component
export default class AddCustomerForm extends Mixins(ValidationMixin, UtilityMixins) {
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: () => defaultCustomer }) readonly customerToBeEdited!: SaleCustomer;
    @Prop({ default: 'Save' }) readonly addOrEditCustomerFormButtonText!: string;
    @Prop({ default: '' }) readonly customerNameForPreload!: string;

    private customer: CustomerBioData = { ...defaultCustomer };
    public toaster = {
        title: '',
        message: '',
        type: '',
        id: 'add-customer-form-modal-toaster',
        position: 'b-toaster-top-center',
    };

    private displayTextLabels = true;
    private showFullDetails = false;

    @customer.State
    private customerRequest!: CustomerRequest;

    @customer.Action
    private registerNewCustomer!: () => void;

    @customer.State
    public error!: string;

    @customer.State
    private errorCode!: number;

    @customer.State
    public newCustomer!: SaleCustomer;

    get buttonShouldBeDisabled() {
        return !this.addCustomerFormIsReadyForSubmission || this.customerRequestStatus === 'LOADING';
    }

    get customerRequestStatus() {
        return this.isEditing ? this.customerRequest.updateCustomer : this.customerRequest.addCutomer;
    }

    private toggleFullDetails() {
        this.showFullDetails = !this.showFullDetails;
    }

    private handleCustomerForm() {
        this.validateAddCustomerForm(this.customer);
        if (!this.addCustomerFormIsReadyForSubmission) return;
        if (!this.isEditing) {
            this.createcustomer();
            return;
        }

        this.updateCustomer();
    }

    private async createcustomer() {
        await customerModule.registerNewCustomer(this.customer);

        if (this.customerRequestStatus === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Customer added successfully',
            });
            this.emitSuccessEvent();
            this.$nextTick(() => {
                resetFormFields(this.customer);
            });
        }
        if (this.customerRequestStatus === Status.ERROR) {
            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: this.error,
            });
        }
    }

    private async updateCustomer() {
        await customerModule.updateCustomer({
            customerKey: this.customerToBeEdited.customerKey ?? '',
            customerDetails: this.customer,
        });

        if (this.customerRequest.updateCustomer === Status.SUCCESS) {
            this.showToaster({
                ...this.toaster,
                type: 'success',
                title: 'Success!',
                message: 'Customer updated successfully',
            });
            this.emitUpdateSuccessEvent();
            this.$nextTick(() => {
                resetFormFields(this.customer);
            });
        }
        if (this.customerRequest.updateCustomer === Status.ERROR) {
            if (this.errorCode == 680) {
                this.showToaster({
                    ...this.toaster,
                    type: 'danger',
                    title: 'Error!',
                    message: 'This customer already exists',
                });
                return;
            }

            this.showToaster({
                ...this.toaster,
                type: 'danger',
                title: 'Error!',
                message: 'There was an error adding this customer. please retry later',
            });
        }
    }

    private emitSuccessEvent() {
        this.$emit('customer-added', this.newCustomer);
    }

    private emitUpdateSuccessEvent() {
        this.$emit('customer-updated', this.customer);
    }

    private checkFormMode() {
        if (this.isEditing) {
            const { name, email, phoneNumber, address, notes } = this.customerToBeEdited;
            this.customer = { name, email, phoneNumber, address, notes };
            return;
        }

        // there are times the customer name can be pre-filled from some other component
        const { customerNameForPreload } = this;

        if (!isEmpty(customerNameForPreload)) {
            this.$set(this.customer, 'name', customerNameForPreload);
        }
    }

    //Close add customer modal on backdrop only when the form content is empty
    @Watch('customer', { immediate: true, deep: true })
    checkCustomerDetails() {
        const customerDetails = Object.values(this.customer);
        let allDetailsAreEmpty = true;
        customerDetails.forEach(detail => {
            if (detail !== '') {
                allDetailsAreEmpty = false;
            }
        });
        if (allDetailsAreEmpty) {
            this.$emit('close-customer-modal-on-backdrop', true);
            return;
        }
        this.$emit('close-customer-modal-on-backdrop', false);
    }

    mounted() {
        customerModule = getModule(CustomerModule, this.$store);
        this.checkFormMode();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/add-new-customer';
</style>
