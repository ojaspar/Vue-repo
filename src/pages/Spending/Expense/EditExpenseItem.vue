<template>
    <b-container>
        <b-modal id="edit-expense" @hide="hideModal" no-close-on-backdrop>
            <template v-slot:modal-header>
                <p class="edit-expense__heading--text mb-0">Edit Item</p>
                <span class="close-btn pointer" title="Cancel" @click.stop="hideModal">
                    &times;
                </span>
            </template>

            <div class="edit-expense__modal-body">
                <EditExpense
                    :expenseForEdit="expenseNameAndDescription"
                    :editMode="editMode"
                    @update-expense-item-type="submitUpdateExpenseItemTypeForm"
                />
            </div>
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import EditExpense from '@/pages/Spending/Expense/AddExpenseItem.vue';

import ExpenseModule from '@/store/modules/expense';

import { EditExpenseItemTypeRequest, ExpenseRequestStatus } from '@/pages/Spending/Expense/types';
import { Status } from '@/types';

import UtilityMixins from '@/mixins/Utility';

const expenses = namespace('expense');
let expenseModule: ExpenseModule;

@Component({
    components: { EditExpense },
})
export default class EditExpenseItem extends Mixins(UtilityMixins) {
    @Prop({ required: true }) name!: string;
    @Prop({ required: true }) description!: string;
    @Prop({ required: true }) expenseItemTypeKey!: string;
    @Prop({ required: true }) editMode!: boolean;

    @expenses.State
    private expenseRequestStatus!: ExpenseRequestStatus;

    @expenses.State
    private error!: string;

    get expenseNameAndDescription() {
        const { name, description } = this;
        return { name, description };
    }

    get updateExpenseItemTypeRequest(): string {
        return this.expenseRequestStatus.updateExpenseItemType;
    }

    private hideModal() {
        this.$nextTick(() => {
            this.$emit('close-edit-modal', false);
            this.$bvModal.hide('edit-expense');
        });
    }

    private async submitUpdateExpenseItemTypeForm(editExpenseItemTypeForm: EditExpenseItemTypeRequest) {
        await expenseModule.updateExpenseItemType({
            editForm: editExpenseItemTypeForm,
            expenseItemTypeKey: this.expenseItemTypeKey,
        });

        if (this.updateExpenseItemTypeRequest === Status.SUCCESS) {
            this.hideModal();
            this.$emit('show-success-notification', 'Expense Updated');
        }
        if (this.updateExpenseItemTypeRequest === Status.ERROR) {
            this.hideModal();
            this.$nextTick(() => {
                this.$emit('show-error-notification', this.error);
            });
        }
    }

    mounted() {
        this.$bvModal.show('edit-expense');
        expenseModule = getModule(ExpenseModule, this.$store);
    }
}
</script>
