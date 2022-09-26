<template>
    <b-container fluid class="delivery-form">
        <b-row>
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="New Delivery"
                    v-model="deliveryForm.newDelivery"
                    :errors="deliveryFormError.newDelivery"
                    @input="formatAndValidateNewDelivery"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    floatingLabelText="Outstanding Delivery"
                    :value="outstandingDeliveryQuantity"
                    disabled
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col class="p-0">
                <BaseDateFieldWithBorderAndFloatingLabel
                    floatingLabelText="Delivery Date"
                    :disableDatesFrom="new Date()"
                    v-model="deliveryForm.deliveryDate"
                    :errors="deliveryFormError.deliveryDate"
                    @input="validateExpenseDeliveryDate(deliveryForm.deliveryDate)"
                />
            </b-col>
        </b-row>

        <transition name="slide-up-fade">
            <b-row v-if="thereIsOutstandingDelivery">
                <b-col class="p-0">
                    <BaseDateFieldWithBorderAndFloatingLabel
                        floatingLabelText="Outstanding Due Date"
                        :disableDatesTo="new Date()"
                        v-model="deliveryForm.outstandingDeliveryDueDate"
                        :errors="deliveryFormError.outstandingDueDate"
                        @input="
                            validateOutstandingDeliveryDate(
                                deliveryForm.outstandingDeliveryDueDate,
                                outstandingDeliveryQuantity,
                            )
                        "
                    />
                </b-col>
            </b-row>
        </transition>

        <b-row class="delivery-form__footer">
            <GeneralFormError :message="generalFormError" />
            <BasePrimaryButton
                buttonText="Save"
                :status="expenseRequestStatus.updateExpenseSupply"
                :disabled="disableFormButton"
                @button-clicked="handleDeliveryForm"
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
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';
import debounce from 'lodash.debounce';

import { ExpenseDetails, ExpenseDeliveryForm } from '@/pages/Spending/Expense/types';

import UtilityMixins from '@/mixins/Utility';
import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';
import ExpenseModule from '@/store/modules/expense';
import { NotificationType, Status } from '@/types';

const expense = namespace('expense');
let expenseModule: ExpenseModule;

@Component
export default class UpdateDelivery extends Mixins(UtilityMixins, ExpenseMixin) {
    @Prop({ required: true }) readonly selectedProduct!: ExpenseDetails;

    @expense.State
    public expenseError!: string;

    private debounceTime = Number(process.env.VUE_APP_DEBOUNCE_TIME);

    private deliveryForm: ExpenseDeliveryForm = {
        newDelivery: '',
        deliveryDate: '',
        outstandingDeliveryDueDate: '',
    };

    get disableFormButton() {
        return !this.deliveryFormIsValidated;
    }

    get outstandingQuantity(): number {
        const { quantityReceived, quantity } = this.selectedProduct;
        return quantity - quantityReceived;
    }

    get outstandingDeliveryQuantity(): string {
        let currentOutstanding = this.outstandingQuantity;
        const { newDelivery } = this.deliveryForm;
        if (Number(newDelivery) > currentOutstanding) return '0';
        currentOutstanding = currentOutstanding - Number(newDelivery);
        return this.formatFiguresToCurrency(String(currentOutstanding));
    }

    get thereIsOutstandingDelivery(): boolean {
        const { outstandingDeliveryQuantity } = this;
        const outstandingDelivery = this.convertFormattedCurrencyToNumber(outstandingDeliveryQuantity);
        return outstandingDelivery > 0;
    }

    private formatAndValidateNewDelivery(newDelivery: string) {
        this.formatNewDeliveryInput(newDelivery);
        this.validateExpenseNewDelivery(newDelivery, this.outstandingQuantity);
        this.validateOustandingDelivery();
    }

    private formatNewDeliveryInput = debounce((quantity: string) => {
        const formatedQuantity = this.convertFigureToCurrency(quantity);
        if (formatedQuantity == 'NaN') {
            this.deliveryForm.newDelivery = '0';
            return;
        }
        this.deliveryForm.newDelivery = formatedQuantity;
    }, this.debounceTime);

    private handleDeliveryForm() {
        this.validateDeliveryForm();
        if (!this.deliveryFormIsValidated) return;
        this.updateExpenseDelivery();
    }

    private validateDeliveryForm() {
        const { outstandingQuantity } = this;
        const { newDelivery, deliveryDate } = this.deliveryForm;
        this.validateExpenseNewDelivery(newDelivery, outstandingQuantity);
        this.validateExpenseDeliveryDate(deliveryDate);
        this.validateOustandingDelivery();
    }

    private validateOustandingDelivery() {
        const { outstandingDeliveryQuantity } = this;
        const { outstandingDeliveryDueDate } = this.deliveryForm;
        const outstandingDelivery = this.convertFormattedCurrencyToNumber(outstandingDeliveryQuantity);
        this.validateOutstandingDeliveryDate(outstandingDeliveryDueDate, outstandingDeliveryQuantity);
        if (outstandingDelivery == 0) this.deliveryForm.outstandingDeliveryDueDate = '';
    }

    private showNotification(notificationType = NotificationType.SUCCESS, message: string) {
        if (notificationType === NotificationType.SUCCESS) {
            this.showToaster({
                type: 'success',
                title: 'Success!',
                message: message || 'Request Successful',
                id: 'expense-delivery-status',
            });
            return;
        }
    }

    private generateRequestBody() {
        const { newDelivery, deliveryDate, outstandingDeliveryDueDate } = this.deliveryForm;
        const quantity = this.convertFormattedCurrencyToNumber(newDelivery);
        const requestBody = {
            quantity,
            transactionDate: deliveryDate,
            outstandingBalanceDueDate: outstandingDeliveryDueDate,
        };
        return requestBody;
    }

    private async updateExpenseDelivery() {
        const expenseItemTypeKey = this.selectedProduct.expenseItemType.key;
        const supllyDetails = this.generateRequestBody();
        await expenseModule.updateExpenseSupply({ supllyDetails, expenseItemTypeKey });

        if (this.expenseRequestStatus.updateExpenseSupply === Status.SUCCESS) {
            this.$emit('hide-modal');
            this.showNotification(NotificationType.SUCCESS, 'Delivery status updated successfully!');
            return;
        }

        if (this.expenseRequestStatus.updateExpenseSupply === Status.ERROR) {
            this.setGeneralFormError(this.expenseError);
            return;
        }
    }

    mounted() {
        expenseModule = getModule(ExpenseModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-expense/update-delivery.scss';
</style>
