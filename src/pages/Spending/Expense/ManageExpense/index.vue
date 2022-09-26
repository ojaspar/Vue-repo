<template>
    <div>
        <MobileIndex
            v-if="userIsOnMobile"
            :expenseType="expenseType"
            @update-supply="updateSupply"
            @add-payment="addPaymentToExpense"
            @cancel-expense="cancelExpense"
        />

        <TabletPlusIndex
            v-else
            :expenseType="expenseType"
            @update-supply="updateSupply"
            @add-payment="addPaymentToExpense"
            @duplicate-expense="duplicateExpense"
            @edit-transaction="editTransaction"
            @go-to-expense-dashboard="goToExpenseDashboard"
            @cancel-expense="cancelExpense"
        />

        <BaseModal :modalId="activeComponent.id" :modalTitle="activeComponent.title" @hide-modal="closeOpenModal">
            <component :is="activeComponent.component" :selectedProduct="selectedItem" @hide-modal="closeOpenModal" />
        </BaseModal>

        <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import MobileIndex from '@/pages/Spending/Expense/ManageExpense/Mobile/index.vue';
import TabletPlusIndex from '@/pages/Spending/Expense/ManageExpense/TabletPlus/index.vue';
import UpdatePayment from '@/pages/Spending/Expense/ManageExpense/UpdatePayment.vue';
import UpdateDelivery from '@/pages/Spending/Expense/ManageExpense/UpdateDelivery.vue';

import { ExpenseDetails } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';
import { Status, Toaster } from '@/types';

@Component({
    components: {
        MobileIndex,
        TabletPlusIndex,
    },
})
export default class ManageExpensePage extends Mixins(UtilityMixins, ExpenseMixin) {
    @Prop({ default: 'general' }) expenseType!: string;

    private activeComponent = {
        id: '',
        title: '',
        component: {},
    };
    private selectedItem = {};
    public toaster: Toaster = {
        title: '',
        message: '',
        type: '',
        id: 'manage-expense-toaster',
    };

    get expenseWasCancelledSuccessfully(): boolean {
        return this.expenseRequestStatus.cancelExpense === Status.SUCCESS;
    }

    private addPaymentToExpense() {
        this.activeComponent = {
            id: 'payment-modal',
            title: 'Add Payment',
            component: UpdatePayment,
        };

        this.$nextTick(() => {
            this.openModal('payment-modal');
        });
    }

    private updateSupply(selectedItem: ExpenseDetails) {
        this.selectedItem = selectedItem;

        this.activeComponent = {
            id: 'supply-modal',
            title: `Update Delivery`,
            component: UpdateDelivery,
        };

        this.$nextTick(() => {
            this.openModal('supply-modal');
        });
    }

    private closeOpenModal() {
        this.closeModal(this.activeComponent.id);
        this.selectedItem = {}; //{ ...defaultProductDetailsForm };
    }

    private duplicateExpense() {
        this.$router.push({
            name: 'Duplicate-Expense',
            params: { expenseKey: this.$route.params.expenseKey },
        });
    }

    private goToExpenseDashboard() {
        this.$router.push({ name: 'Expenses' });
    }

    private editTransaction(expenseKey: string) {
        this.$router.push({ name: 'Edit-Previous-Expense', params: { expenseKey } });
    }

    private async cancelExpense() {
        const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to Cancel this expense?', {
            title: 'Please Confirm',
            size: 'md',
            buttonSize: 'lg',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2 w-100',
            hideHeaderClose: false,
        });

        if (confirmed) {
            await this.expensesModule.cancelExpense(this.expenseDetails.expenseItemKey);

            if (this.expenseWasCancelledSuccessfully) {
                this.showToaster({
                    ...this.toaster,
                    type: 'success',
                    title: 'Success!',
                    message: 'Expense has been cancelled successfully',
                });

                setTimeout(() => {
                    this.$router.replace({ name: 'Expenses' });
                }, 900);

                return;
            }

            this.showToaster({
                ...this.toaster,
                type: 'error',
                title: 'Error!',
                message: this.errorMessage || 'Request failed!',
            });
        }

        return confirmed;
    }

    async mounted() {
        const expenseKey = this.$route.params.expenseKey;

        await Promise.all([
            this.expensesModule.getExpenseDetails(expenseKey),
            this.expensesModule.getPaymentAccounts(),
        ]);
    }
}
</script>

<style lang="scss"></style>
