<template>
    <div>
        <div :class="showCustomerDetails ? 'sale-customer-card' : 'sale-customer-card--no-details'">
            <div
                :class="showCustomerDetails ? 'sale-customer-card__header' : 'sale-customer-card__header--no-customer'"
            >
                <span class="sale-customer-card__header--name">{{ customerName }}</span>
                <span v-if="customerSelected">
                    <span v-if="showEditButton" class="pointer" @click="handleCustomerEditing"><i>Edit</i></span>
                    <span v-else class="sale-customer-card__header--mobile-button" @click="$emit('change-customer')">
                        <i>Change Customer</i>
                    </span>
                </span>

                <!-- Add New Customer Button on Mobile -->
                <span v-else class="sale-customer-card__header--mobile-button" @click="$emit('change-customer')">
                    Add Customer
                </span>
            </div>
            <div
                v-if="showCustomerDetails"
                :class="customerSelected ? 'sale-customer-card__details' : 'sale-customer-card__details--empty'"
            >
                <span v-if="customerSelected">
                    <p v-if="customerHasBalance">
                        <span class="mr-1">Pending payment</span>
                        {{ selectedCustomer.totalBalanceDue | amountWithCurrency }}
                    </p>
                    <p>{{ selectedCustomer.phoneNumber }}</p>
                    <p>{{ selectedCustomer.email }}</p>
                    <p v-if="selectedCustomer.lastInteraction">
                        {{ selectedCustomer.lastInteraction }}, {{ lastInteractionAge }}

                        <span
                            class="sale-customer-card__enter-sales-text"
                            v-if="hasOpenEstimate()"
                            @click="convertEstimateToSale()"
                        >
                            Enter Sales
                        </span>
                    </p>
                </span>
                <span v-else>
                    <i>No customer details</i>
                </span>
            </div>
            <div v-if="showCustomerButton" class="sale-customer-card__button" @click="$emit('change-customer')">
                {{ buttonName }}
            </div>
        </div>

        <BaseModal
            :modalId="editCustomerModal"
            modalTitle="Edit Customer"
            :no-close-on-backdrop="!closeCustomerModalOnBackdrop"
            @hide-modal="hideCustomerModal"
        >
            <AddCustomerForm
                :isEditing="customerIsToBeEdited"
                :customerToBeEdited="selectedCustomer"
                @customer-updated="handleCustomerUpdateSuccess"
                @close-customer-modal-on-backdrop="setModalClosureOnBackdrop"
            />
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import AddCustomerForm from '@/pages/Sales/ManageCustomers/AddOrEditCustomerForm.vue';

import UtilityMixins from '@/mixins/Utility';
import { SaleCustomer, defaultCustomer } from '@/pages/Sales/types';

@Component({ components: { AddCustomerForm } })
export default class CustomerCard extends Mixins(UtilityMixins) {
    @Prop({ default: () => defaultCustomer }) readonly selectedCustomer!: SaleCustomer;
    @Prop({ default: true }) readonly showCustomerDetails!: boolean;

    private customerIsToBeEdited = false;
    private closeCustomerModalOnBackdrop = false;
    private editCustomerModal = 'edit-customer-modal';

    get lastInteractionAge(): string {
        const { lastInteractionDate } = this.selectedCustomer;
        return lastInteractionDate ? this.$options.filters.humanReadableDateTime(lastInteractionDate) : '';
    }

    private hasOpenEstimate() {
        return this.selectedCustomer.lastInteraction === 'Estimate';
    }

    get customerHasBalance(): boolean {
        return this.selectedCustomer?.totalBalanceDue.amount > 0;
    }

    get customerSelected() {
        return this.selectedCustomer.name.length > 0;
    }

    get customerName() {
        const { name } = this.selectedCustomer;
        return this.customerSelected ? name : 'Unnamed Customer';
    }

    get showCustomerButton() {
        if (this.userIsOnMobile) {
            return this.showCustomerDetails && this.customerSelected;
        }
        return true;
    }

    get buttonName() {
        return this.customerSelected ? 'Change Customer' : 'Add Customer';
    }

    get showEditButton() {
        if (this.userIsOnMobile) return this.showCustomerDetails;
        return this.customerSelected;
    }

    private setCustomerEditingCondition() {
        this.customerIsToBeEdited = true;
    }

    private resetCustomerEditingCondition() {
        this.customerIsToBeEdited = false;
    }

    private setModalClosureOnBackdrop(coseModal: boolean) {
        this.closeCustomerModalOnBackdrop = coseModal;
    }

    private displayCustomerModal() {
        this.displayModal(this.editCustomerModal);
    }

    private hideCustomerModal() {
        this.resetCustomerEditingCondition();
        this.cancelModal(this.editCustomerModal);
    }

    private handleCustomerEditing() {
        this.setCustomerEditingCondition();
        this.displayCustomerModal();
    }

    private convertEstimateToSale() {
        this.$emit('convert-estimate-to-sale', this.selectedCustomer.lastSaleKey);
    }

    private handleCustomerUpdateSuccess(updatedCustomer: SaleCustomer) {
        this.$emit('selected-customer-updated', updatedCustomer);
        setTimeout(() => {
            this.hideCustomerModal();
        }, 500);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/customer-card';
</style>
