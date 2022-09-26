<template>
    <div>
        <!-- <b-container class="add-payment-container">
        <b-row class="justify-content-end">
            <b-col class="d-flex justify-content-end add-payment-container__button-container">
                <BaseButton
                    buttonText="Add Payment"
                    class="add-payment-container__button"
                    @button-clicked="toggleAddPaymentForm"
                    v-if="!showAddPaymentForm"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col cols="4" class="p-0 ml-5" v-if="showAddPaymentForm">
                <transition name="slide-right-fade" appear>
                    <AddPaymentForm
                        @toggle-payment-form="toggleAddPaymentForm"
                        :balance="balance"
                        @payment-added-successfully="handlePaymentSuccess"
                        class="mt-5"
                    />
                </transition>
            </b-col>
            <b-col>
                <div class="add-payment-container__table mr-0 ml-0 mt-5 d-flex flex-column">
        
                        :headers="expenseHeaders"
                        className="add-payment-container__dark-header"
                        headerContainerClass="p-0"
                    />


w                        v-if="expenseRequestStatus.getExpenseDetails === 'LOADING'"
                        class="d-flex justify-content-center"
                    >
                        <Loader size="4" />
                    </div>

                    <b-container v-else>
                        <transition-group name="fade" appear>
                            <ExpenseItemRow
                                v-for="(expense, index) in expenseItems"
                                :key="expense.name"
                                :expense="expense"
                                :itemIndex="index"
                            />
                        </transition-group>
                    </b-container> -->

        <!-- Payment Details -->
        <!-- <div class="mt-auto mb-5">
                        <PaymentDetails
                            :paymentHistory="paymentHistory"
                            :balance="balance"
                            :totalAmount="totalAmount"
                            :amountPaid="amountPaid"
                        />
                    </div>
                </div>
            </b-col> -->
        <!-- </b-row> -->
        <!-- <Toaster
            :title="toaster.title"
            :messageBody="toaster.message"
            :toaster="toaster.position"
            :variant="toaster.type"
            :id="toaster.id"
        /> -->
        <!-- </b-container> -->
    </div>
</template>

<script lang="ts">
// import { Component, Mixins } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { getModule } from 'vuex-module-decorators';

// import DashboardTableHeader from '@/components/ui/DashboardTableHeader.vue';
// import AddPaymentForm from '@/pages/Spending/Expense/Payment/AddPaymentForm.vue';
// import ExpenseItemRow from '@/pages/Spending/Expense/Payment/ExpenseItemRow.vue';
// import SuccessPageModal from '@/components/ui/SuccessPageModal.vue';

// import ExpenseModule from '@/store/modules/expense';

// import { DashboardHeader, Toaster } from '@/types';
// import { ExpenseDetails, ExpenseLineItem, ExpensePayment, ExpenseRequestStatus } from '@/pages/Spending/Expense/types';
// import UtilityMixins from '@/mixins/Utility';

// let expenseModule: ExpenseModule;
// const expense = namespace('expense');

// @Component({
//     components: {
//         DashboardTableHeader,
//         AddPaymentForm,
//         ExpenseItemRow,
//         SuccessPageModal,
//     },
// })
// export default class AddPayment extends Mixins(UtilityMixins) {
//     private readonly expenseHeaders: Array<DashboardHeader> = [
//         {
//             text: '',
//             numberOfColumns: 1,
//         },
//         {
//             text: 'Expense Item',
//             numberOfColumns: 3,
//         },
//         {
//             text: 'Unit Cost',
//         },
//         {
//             text: 'Quantity',
//         },
//         {
//             text: 'Amount',
//         },
//     ];

//     private showPaymentDetails = false;
//     private showAddPaymentForm = false;
//     public toaster: Toaster = {
//         title: '',
//         message: '',
//         type: '',
//         id: 'add-payment-toaster',
//     };

//     @expense.State
//     private expenseRequestStatus!: ExpenseRequestStatus;

//     @expense.State
//     private expenseDetails!: ExpenseDetails;

//     get expenseItems(): ExpenseLineItem[] {
//         return this.expenseDetails.expenseItems;
//     }

//     // get paymentHistory(): ExpensePayment[] {
//     //     return this.expenseDetails.;
//     // }

//     // get expenseKey(): string {
//     //     return this.$route.params.expenseKey;
//     // }

//     // get balance(): number {
//     //     return this.expenseDetails.balance;
//     // }
//     // get totalAmount(): number {
//     //     return this.expenseDetails.totalAmount;
//     // }
//     // get amountPaid(): number {
//     //     return this.expenseDetails.amountPaid;
//     // }

//     // private toggleAddPaymentForm() {
//     //     this.showAddPaymentForm = !this.showAddPaymentForm;
//     // }

//     // private handlePaymentSuccess(amountPaid: string) {
//     //     this.showToaster({
//     //         ...this.toaster,
//     //         title: 'Expense Payment',
//     //         type: 'success',
//     //         message: `₦${amountPaid} has been posted successfully`,
//     //     });
//     // }

//     // mounted() {
//     //     expenseModule = getModule(ExpenseModule, this.$store);
//     //     expenseModule.getExpenseDetails(this.expenseKey);
//     // }
// }
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/add-payment';
</style>
