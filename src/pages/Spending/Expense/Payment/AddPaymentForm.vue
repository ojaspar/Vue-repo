<template>
    <b-container fluid>
        <b-row>
            <b-col class="add-payment-form mr-3">
                <div class="d-flex align-items-center justify-content-between add-payment-form__header">
                    <p class="m-0">Add Payment</p>
                    <font-awesome-icon icon="times" class="mb-0 pointer" @click="toggleAddPaymentForm" />
                </div>

                <div class="add-payment-form__input-section d-flex flex-column justify-content-between">
                    <div>
                        <BaseInputField
                            placeholder="Balance Due"
                            floatingLabelText="Balance Due (₦)"
                            className="mb-1 w-100"
                            inputContainerClass="add-payment-form__input-section--item"
                            readOnly="true"
                            :value="totalAmountOwed"
                        />

                        <b-row class="mt-4 align-items-end">
                            <b-col cols="6" class="pr-0">
                                <BaseInputField
                                    required="true"
                                    placeholder="Amount You paid"
                                    floatingLabelText="Amount You paid (₦)"
                                    className="mb-1 w-100"
                                    inputContainerClass="add-payment-form__input-section--item"
                                    v-model="form.amount"
                                    @input="handleAmountInput"
                                    :disabled="expenseIsFullyPaidFor"
                                />
                            </b-col>

                            <b-col>
                                <BaseSelect
                                    defaultText="Payment Method"
                                    :options="paymentTypes"
                                    keyProperty="name"
                                    valueProperty="name"
                                    textProperty="name"
                                    selectContainerClass="add-payment-form__input-section--item"
                                    className="add-payment-form__input-section--item"
                                    v-model="form.paymentTypeName"
                                    @input="handlePaymentTypeSelection"
                                    :disabled="expenseIsFullyPaidFor"
                                />
                            </b-col>
                        </b-row>

                        <b-row class="mt-4">
                            <b-col>
                                <BaseInputField
                                    required="true"
                                    type="date"
                                    placeholder="Date Recieved"
                                    floatingLabelText="Date Recieved"
                                    className="mb-1 w-100"
                                    inputContainerClass="add-payment-form__input-section--item"
                                    v-model="form.datePaid"
                                    :disabled="expenseIsFullyPaidFor"
                                />
                            </b-col>
                        </b-row>
                    </div>

                    <div>
                        <b-row>
                            <b-col>
                                <BaseButton
                                    buttonText="Add"
                                    class="add-payment-container__button"
                                    @button-clicked="handleSubmit"
                                    :disabled="paymentButtonIsDisabled"
                                    :status="expenseRequestStatus.addPayment"
                                />
                            </b-col>
                            <b-col>
                                <BaseButton
                                    buttonText="Cancel"
                                    class="add-payment-container__button"
                                    @button-clicked="toggleAddPaymentForm"
                                    overRideButtonClass="true"
                                />
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import GeneralModule from '@/store/modules/general';
import ExpenseModule from '@/store/modules/expense';

import { PaymentType, Status } from '@/types';
import { ExpenseRequestStatus } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

const general = namespace('general');
const expense = namespace('expense');

let generalModule: GeneralModule;
let expenseModule: ExpenseModule;

@Component
export default class AddPaymentForm extends Mixins(ExpenseMixin, UtilityMixins) {
    private form = {
        amount: '0',
        paymentTypeName: '',
        datePaid: this.todayAsDefaultDate(),
    };

    @Prop({ required: true }) readonly balance!: string;

    @general.State
    public paymentTypes!: PaymentType[];

    @expense.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    get totalAmountOwed(): string {
        return this.formatFiguresToCurrency(this.balance);
    }

    get expenseIsFullyPaidFor(): boolean {
        return Number(this.totalAmountOwed) === 0;
    }

    get paymentButtonIsDisabled(): boolean {
        // const { expenseIsFullyPaidFor, formHasError } = this;
        // return expenseIsFullyPaidFor || formHasError();
        return false;
    }

    handleAmountInput(newValue: string) {
        const [numberFormat, totalAmountOwed] = this.convertFormattedCurrencyToNumber([newValue, this.totalAmountOwed]);
        const currencyformat = this.convertFigureToCurrency(newValue);
        this.$nextTick(() => {
            if (Number(numberFormat) !== 0) {
                this.form.amount = currencyformat;
                return;
            }
            this.form.amount = '0';
        });

        // this.validatePaymentAmount(Number(numberFormat), totalAmountOwed);
    }

    private toggleAddPaymentForm() {
        this.$emit('toggle-payment-form');
    }

    private handlePaymentTypeSelection(paymentTypeName: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paymentTypeObject: any = this.paymentTypes.find(paymentType => paymentType.name === paymentTypeName);
        // this.form.paymentTypeKey = paymentTypeObject.paymentTypeKey;
        // this.validatePaymentMethod(this.form.paymentTypeName);
    }

    private async handleSubmit() {
        // this.validateAllPaymentField(this.form, this.convertFormattedFiguresToNumber(this.totalAmountOwed));
        // if (this.addPaymentFormIsReadyForSubmission) {
        //     const { amount, paymentTypeName, datePaid, paymentTypeKey } = this.form;
        //     const expenseKey: string = this.$route.params.expenseKey;
        //     // find the paymentType key temporarily until they decide on what best to do
        //     const amountStringToNumber = this.convertFormattedFiguresToNumber(amount);
        //     await expenseModule.addPayment({
        //         amount: amountStringToNumber,
        //         paymentTypeName,
        //         datePaid,
        //         paymentTypeKey,
        //         expenseKey,
        //     });
        //     const { addPayment } = this.expenseRequestStatus;
        //     if (addPayment === Status.SUCCESS) {
        //         this.$emit('payment-added-successfully', this.form.amount);
        //         this.$nextTick(() => {
        //             this.form = {
        //                 amount: '0',
        //                 paymentTypeName: '',
        //                 datePaid: this.todayAsDefaultDate(),
        //                 paymentTypeKey: '',
        //             };
        //         });
        //     }
        // }
    }

    mounted() {
        generalModule = getModule(GeneralModule, this.$store);
        expenseModule = getModule(ExpenseModule, this.$store);

        generalModule.getPaymentTypes();
    }
}
</script>

<style lang="scss"></style>
