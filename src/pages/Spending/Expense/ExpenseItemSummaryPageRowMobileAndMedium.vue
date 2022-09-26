<template>
    <div class="expense-summary-page__card-container" @click="handleShowFullDetails(index)">
        <div class="expense-summary-page__vendor-item-section">
            <p v-if="expenseItem.vendorName.length > 0" class="expense-summary-page__vendor-text">
                {{ expenseItem.vendorName }}
            </p>
            <p class="expense-summary-page__item-name-text">{{ expenseItem.itemName }}</p>
            <div class="expense-summary-page__cost-delivered-section" v-if="expenseItem.isMeasurable">
                <p>
                    <span class="expense-summary-page__cost-amount">
                        {{ expenseItem.quantity }} x {{ expenseItem.expenseCurrency }}
                        {{ expenseItem.unitCost | formatMoney }} /
                        {{ expenseItem.isMeasurable && expenseItem.measurementUnit }}
                    </span>
                </p>
            </div>
            <div
                class="expense-summary-page__cost-delivered-section"
                v-if="expenseItem.isMeasurable && !expenseItem.withholdingTax"
            >
                <p>
                    <span class="expense-summary-page__cost-text">Cost:</span
                    ><span class="expense-summary-page__cost-amount-text">
                        {{ expenseItem.expenseCurrency }}
                        {{ (expenseItem.quantity * expenseItem.unitCost) | formatMoney }}
                    </span>
                </p>
                <p class="expense-summary-page__delivery-status" :class="deliveryStatus.class">
                    {{ deliveryStatus.text }}
                </p>
            </div>
            <div
                class="expense-summary-page__cost-delivered-section"
                v-if="!expenseItem.isMeasurable && !expenseItem.withholdingTax"
            >
                <p>
                    <span class="expense-summary-page__cost-text">Cost:</span
                    ><span class="expense-summary-page__cost-amount-text"
                        >{{ expenseItem.expenseCurrency }} {{ expenseItem.netCost | formatMoney }}</span
                    >
                </p>
                <p class="expense-summary-page__delivery-status" :class="deliveryStatus.class">
                    {{ deliveryStatus.text }}
                </p>
            </div>

            <div class="expense-summary-page__cost-delivered-section" v-if="expenseItem.withholdingTax">
                <p>
                    <span class="expense-summary-page__withholding-less-text">less:</span
                    ><span class="expense-summary-page__withholding-amount-text"
                        >{{ expenseItem.expenseCurrency }} {{ expenseItem.withholdingAmount | formatMoney }}</span
                    >
                    <span class="expense-summary-page__withholding-amount-text--grey"
                        >Withholding Tax ({{ expenseItem.withholdingTax | formatMoney }}%)</span
                    >
                </p>
            </div>

            <div class="expense-summary-page__cost-delivered-section" v-if="expenseItem.withholdingTax">
                <p>
                    <span class="expense-summary-page__cost-text">Net:</span
                    ><span class="expense-summary-page__cost-amount-text"
                        >{{ expenseItem.expenseCurrency }} {{ expenseItem.netCost | formatMoney }}</span
                    >
                </p>
                <p class="expense-summary-page__delivery-status" :class="deliveryStatus.class">
                    {{ deliveryStatus.text }}
                </p>
            </div>

            <div class="expense-summary-page__paid-balance-section">
                <p>
                    <span class="expense-summary-page__paid-text">Paid: </span
                    ><span class="expense-summary-page__paid-amount-text"
                        >{{ expenseItem.expenseCurrency }} {{ expenseItem.amountPaid | formatMoney }}</span
                    ><span class="expense-summary-page__cash-text">{{ expenseItem.bankName }}</span>
                </p>
                <p v-if="expenseItem.balance > 0">
                    <span class="expense-summary-page__balance-text">Balance:</span
                    ><span class="expense-summary-page__balance-amount-text"
                        >{{ expenseItem.expenseCurrency }} {{ expenseItem.balance | formatMoney }}</span
                    >
                </p>
            </div>
            <template v-if="showFullDetails">
                <p v-if="expenseItem.notes">
                    <span class="expense-summary-page__notes-text">Notes: </span
                    ><span class="expense-summary-page__notes-input-text">{{ expenseItem.notes }}</span>
                </p>
                <div class="expense-summary-page__icons-container">
                    <div class="expense-summary-page__edit-delete-icons-container">
                        <div class="expense-summary-page__edit-icon-container pointer">
                            <img src="@/assets/img/pencil.svg" />
                            <span
                                class="expense-summary-page__edit-text"
                                @click.stop="$emit('edit-expense-item', index)"
                                >Edit</span
                            >
                        </div>
                        <div
                            class="expense-summary-page__delete-icon-container pointer"
                            @click.stop="handleDeleteModal"
                        >
                            <img src="@/assets/img/trash-black-2.svg" />
                            <span class="expense-summary-page__delete-text">Delete</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

const expenseSummaryDefault = {
    itemName: '',
    unitCost: 0,
    isMeasurable: false,
    quantity: 0,
    withholdingTax: 0,
    amountPaid: 0,
    bankName: '',
    vendorName: '',
    measurementUnit: '',
    netCost: 0,
    balance: 0,
    expenseCurrency: '',
    withholdingAmount: 0,
};

@Component
export default class ExpenseItemSummaryPageRow extends Vue {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Prop({ default: expenseSummaryDefault }) readonly expenseItem!: any;
    @Prop({ default: 0 }) readonly index!: number;
    @Prop({ default: '' }) readonly indexOfItemBeingShown!: string;

    get showFullDetails(): boolean {
        return this.indexOfItemBeingShown !== '' && Number(this.indexOfItemBeingShown) === this.index;
    }

    get deliveryStatus(): object {
        const baseClass = 'expense-summary-page__delivery-status';
        const { quantity, quantityReceived } = this.expenseItem;

        if (quantity === quantityReceived) {
            return {
                class: `${baseClass}--delivered`,
                text: 'Delivered',
            };
        }

        if (quantityReceived === 0) {
            return {
                class: `${baseClass}--none`,
                text: 'Pending delivery',
            };
        }

        return {
            class: `${baseClass}--in-progress`,
            text: 'Delivery in progress',
        };
    }

    private handleShowFullDetails(index: number) {
        this.$emit('show-full-details', index);
    }

    private handleDeleteModal() {
        this.$bvModal
            .msgBoxConfirm('Are you sure you know want to remove this item?', {
                title: 'Remove Item',
                size: 'md',
                buttonSize: 'lg',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                cancelVariant: 'light',
                footerClass: 'p-2',
                hideHeaderClose: false,
            })
            .then((decision: boolean) => {
                if (decision) this.deleteExpenseItem();
            })
            .catch(err => err);
    }

    private deleteExpenseItem() {
        // show modal to tell user to confirm their action
        this.$emit('delete-expense-item', this.index);
    }
}
</script>

<style></style>
