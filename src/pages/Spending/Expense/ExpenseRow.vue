<template>
    <b-row class="add-expense-content__table mt-3 ml-auto mr-auto align-items-center mb-2">
        <b-col cols="1" class="pr-0 d-flex align-items-center">
            <div class="mr-3">
                <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
                <font-awesome-icon icon="ellipsis-v"></font-awesome-icon>
            </div>
            {{ index + 1 }}
        </b-col>
        <b-col cols="4" class="pl-0">{{ name }}</b-col>
        <b-col>{{ quantity }}</b-col>
        <b-col>₦ {{ totalCost }}</b-col>
        <b-col class="d-flex justify-content-between align-items-center">
            <span :class="{ 'add-expense-content__table--danger': balanceOwed > 0 }"
                >₦ {{ balanceOwed | formatMoney }}
            </span>
            <p class="mb-0 d-flex">
                <span class="ml-3 action-icon" @click="$emit('edit', index)">
                    <font-awesome-icon icon="pencil-alt" class="action-icon--delete"></font-awesome-icon>
                </span>
                <span class="ml-3 action-icon" @click="handleDeleteModal">
                    <font-awesome-icon icon="trash-alt" class="action-icon--edit"></font-awesome-icon>
                </span>
            </p>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ExpenseRow extends Vue {
    @Prop({ required: true }) readonly index!: number;
    @Prop({ required: true }) readonly name!: string;
    @Prop({ required: true }) readonly quantity!: string;
    @Prop({ required: true }) readonly totalCost!: number;
    @Prop({ required: true }) readonly balanceOwed!: number;
    @Prop({ default: false }) readonly isDelete!: boolean;

    private handleDeleteModal(index: number) {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Delete Expense',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true,
            })
            .then((decision: boolean) => {
                if (decision) this.$emit('delete', index);
            })
            .catch(err => err);
    }
}
</script>
