<template>
    <b-container class="add-new-expense-item" fluid>
        <!-- Item Name -->
        <b-row class="add-new-expense-item__input--row">
            <b-col class="p-0">
                <BaseInputFieldWithBorderAndFloatingLabel
                    required="true"
                    floatingLabelText="Item Name"
                    inputContainerClass="add-new-expense-item"
                    @input="validateExpenseName(form.name)"
                    :errors="addExpenseItemError.name"
                    v-model="form.name"
                    className="add-new-expense-item__input--field"
                />
            </b-col>
        </b-row>

        <b-row class="align-items-center" v-if="editMode">
            <BasePrimaryButton
                buttonText="Save"
                className="add-new-expense-item__button"
                :disabled="buttonIsDisabled(null, addExpenseItemError)"
                @button-clicked="handleEditExpenseSubmission"
                :status="expenseRequestStatus.updateExpenseItemType"
            />
        </b-row>

        <template v-else>
            <!-- Expense Category -->
            <b-row class="add-new-expense-item__input--row">
                <b-col class="p-0">
                    <BaseSelectWithBorderAndFloatingLabel
                        defaultOptionText="-- Select Expense Category --"
                        floatingLabelText="Expense Category"
                        className="add-new-expense-item__input--select"
                        selectContainerClass="add-expense-group-select"
                        :options="expenseGroups"
                        keyProperty="expenseGroupKey"
                        valueProperty="expenseGroupKey"
                        textProperty="displayName"
                        @input="validateExpenseGroupKey(form.expenseGroupKey)"
                        :errors="addExpenseItemError.expenseGroupKey"
                        v-model="form.expenseGroupKey"
                    />
                </b-col>
            </b-row>

            <b-row class="align-items-center">
                <BasePrimaryButton
                    buttonText="Next"
                    className="add-new-expense-item__button"
                    :disabled="buttonIsDisabled(null, addExpenseItemError)"
                    @button-clicked="handleClick"
                    :status="expenseRequestStatus.createExpenseItemType"
                />
            </b-row>
        </template>
    </b-container>
</template>

<script lang="ts">
/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ExpenseModule from '@/store/modules/expense';
import {
    EditExpenseItemTypeRequest,
    ExpenseGroup,
    ExpenseItemType,
    ExpenseItemTypeRequest,
    ExpenseRequestStatus,
} from '@/pages/Spending/Expense/types';
import { Currency, Status } from '@/types';

import ExpenseMixin from '@/pages/Spending/Expense/ExpenseMixin';

import { isEmpty } from '@/utils/formValidator';
import CurrencyMixins from '@/mixins/currency';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

const formItem: ExpenseItemTypeRequest = {
    name: '',
    description: '',
    expenseGroupKey: '',
    isMeasurable: false,
    expenseGroupName: '',
    estimatedCost: { amount: 0, currencyKey: 0 },
};

@Component
export default class AddExpenseItem extends Mixins(ExpenseMixin, CurrencyMixins) {
    private form = { ...formItem };

    @Prop({ default: '' }) newExpenseName!: string;
    @Prop({ default: () => ({ name: '', description: '' }) }) expenseForEdit!: EditExpenseItemTypeRequest;
    @Prop({ default: false }) editMode!: boolean;

    @expenses.State
    public expenseGroups!: ExpenseGroup[];

    @expenses.State
    public expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    public newExpenseItemType!: ExpenseItemType;

    @expenses.Action
    private getAllExpenseGroups!: () => ExpenseGroup[];

    @Watch('form.expenseGroupKey')
    updateExpenseGroupProperties(expenseGroupKey: string) {
        const expenseGroup: any = this.expenseGroups.find(
            expenseGroup => expenseGroup.expenseGroupKey === expenseGroupKey,
        );
        this.form.isMeasurable = expenseGroup.isMeasurable;
        this.form.expenseGroupName = expenseGroup.name;
    }

    private currencyChangeHandle(currencyChosen: Currency) {
        const currencyKey = currencyChosen.currencyKey;

        this.form.estimatedCost = Object.assign({}, this.form.estimatedCost, {
            ...this.form.estimatedCost,
            currencyKey,
        });
        this.validateExpenseCurrency(currencyKey.toString(), 'currencyKey', this.addExpenseItemError);
    }

    private async handleClick(): Promise<void> {
        if (!this.expenseItemFormIsReadyForSubmission) return;
        await expenseModule.createExpenseItemType(this.form);

        if (this.expenseRequestStatus.createExpenseItemType === Status.SUCCESS) {
            this.$emit('expense-item-created', this.newExpenseItemType);
        }
    }

    private async handleEditExpenseSubmission(): Promise<void> {
        this.validateAllExpenseItemFields(this.form, true);
        if (!this.expenseItemFormIsReadyForSubmission) return;

        const { name, description } = this.form;
        this.$emit('update-expense-item-type', { name, description });
    }

    private prefillFormWithExpenseName() {
        this.$set(this.form, 'name', this.newExpenseName);
    }

    private prefillFormForExpenseItemTypeEdit() {
        this.form = Object.assign({}, this.form, {
            ...this.expenseForEdit,
            estimatedCost: { amount: 0, currencyKey: this.defaultCurrency.currencyKey },
        });
    }

    mounted() {
        if (this.editMode) {
            this.prefillFormForExpenseItemTypeEdit();
            return;
        }

        expenseModule = getModule(ExpenseModule, this.$store);
        expenseModule.getAllExpenseGroups();

        this.form.estimatedCost = Object.assign({}, this.form.estimatedCost, {
            ...this.form.estimatedCost,
            currencyKey: this.defaultCurrency.currencyKey,
        });

        //if the user added a name from the select expense page, then let's set it in the form
        if (!isEmpty(this.newExpenseName)) {
            this.prefillFormWithExpenseName();
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/new-expense-item-form';
</style>
