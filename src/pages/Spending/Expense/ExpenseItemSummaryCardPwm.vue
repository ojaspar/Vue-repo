<template>
    <b-container fluid class="expense-item-card-pwm" v-if="itemName">
        <b-row class="expense-item-card-pwm__item-details-container">
            <b-col cols="12" class="p-0">
                <div class="expense-item-card-pwm__item-name-container">
                    <span
                        class="expense-item-card-pwm__item-details-icon pointer expense-item-card-pwm__item-name-icon"
                    >
                        <img src="@/assets/img/swap-icon.svg" @click="goToExpenseSelectionPage" />
                    </span>
                    <p class="expense-item-card-pwm__item-name-text">{{ itemName }}</p>
                </div>

                <!-- cost section -->
                <div class="expense-item-card-pwm__item-cost-payment-section" v-if="unitCost">
                    <p class="expense-item-card-pwm__item-cost-payment-section--edit-payment">
                        <img
                            class="expense-item-card-pwm__pencil-icon pointer"
                            src="@/assets/img/pencil-icon.svg"
                            @click="goToAddExpensePage"
                        />
                    </p>
                    <div class="expense-item-card-pwm__item-cost-payment-container">
                        <p v-if="conditionForMeasurableCostToAppear" class="expense-item-card-pwm__item-payment-text">
                            {{ quantity }} X {{ expenseCurrency }} {{ unitCost | formatMoney }} /
                            {{ measurementUnit }}
                        </p>
                        <p v-if="!conditionForMeasurableCostToAppear" class="expense-item-card-pwm__item-cost-text">
                            <span class="expense-item-card-pwm__cost-text expense-item-card-pwm__text--grey"
                                >Cost: </span
                            ><span class="expense-item-card-pwm__item-cost-amount expense-item-card-pwm__amount"
                                >{{ expenseCurrency }} {{ unitCost | formatMoney }}</span
                            >
                        </p>
                        <p class="expense-item-card-pwm__item-cost-text" v-if="withholdingTaxEffect">
                            <span class="expense-item-card-pwm__less-text expense-item-card-pwm__text--grey">
                                {{ withholdingTaxEffect }} </span
                            ><span class="expense-item-card-pwm__item-less-amount expense-item-card-pwm__amount"
                                >{{ expenseCurrency }} {{ withholdingAmount | formatMoney }}</span
                            ><span
                                class="expense-item-card-pwm__wht-percentage expense-item-card-pwm__amount expense-item-card-pwm__text--grey"
                                >Withholding Tax ({{ withholdingTaxPercentage | formatMoney }}%)</span
                            >
                        </p>
                        <p class="expense-item-card-pwm__item-cost-text">
                            <span class="expense-item-card-pwm__net-text expense-item-card-pwm__text--grey">Net: </span
                            ><span class="expense-item-card-pwm__net-amount expense-item-card-pwm__amount"
                                >{{ expenseCurrency }} {{ netCost | formatMoney }}</span
                            >
                        </p>

                        <!-- Amount Paid Section -->
                        <p v-if="amountPaid" class="expense-item-card-pwm__item-payment-text">
                            <span class="expense-item-card-pwm__item-paid-text expense-item-card-pwm__text--grey"
                                >Paid: </span
                            ><span class="expense-item-card-pwm__item-paid-amount expense-item-card-pwm__amount"
                                >{{ bankDetails.accountCurrencySymbol }} {{ amountPaid | formatMoney }}</span
                            ><span v-if="bankDetails.accountName" class="expense-item-card-pwm__bank-text">{{
                                bankDetails.accountName
                            }}</span>
                        </p>
                        <p class="expense-item-card-pwm__item-payment-text">
                            <span class="expense-item-card-pwm__balance-text expense-item-card-pwm__text--grey"
                                >Balance: </span
                            ><span
                                :class="[
                                    balance > 0
                                        ? 'expense-item-card-pwm__balance-amount expense-item-card-pwm__balance-amount--deficit'
                                        : 'expense-item-card-pwm__balance-amount expense-item-card-pwm__amount',
                                ]"
                                >{{ expenseCurrency }} {{ balance | formatMoney }}</span
                            >
                        </p>
                    </div>
                </div>

                <!-- Vendor Section after vendor has been selected -->
                <div v-if="conditionForVendorToAppear" class="expense-item-card-pwm__vendor-section">
                    <img
                        v-if="conditionForOptionalVendor"
                        class="expense-item-card-pwm__item-details-icon pointer"
                        src="@/assets/img/red-cancel-icon.svg"
                        @click="removeSelectedVendor"
                    />
                    <img
                        v-if="conditionForCompulsoryVendor"
                        class="expense-item-card-pwm__item-details-icon pointer"
                        src="@/assets/img/swap-icon.svg"
                        @click="goToVendorSelectionPage"
                    />
                    <p class="expense-item-card-pwm__vendor-text">{{ vendorName }}</p>
                </div>

                <div v-if="unitCost > 0 && !vendorSelectionComponentIsActive && !conditionForVendorToAppear">
                    <BaseButton
                        className="expense-item-card-pwm__add-new-vendor-btn"
                        buttonText="Add Vendor"
                        :overRideButtonClass="true"
                        @button-clicked="goToVendorSelectionPage"
                    >
                        <CircularPlusSign />
                    </BaseButton>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import CircularPlusSign from '@/components/ui/CircularPlusSign.vue';

import { ExpenseWitholdingTaxTypes, BankDetails } from '@/pages/Spending/Expense/types';

@Component({
    components: {
        CircularPlusSign,
    },
})
export default class ExpenseItemSummaryCardPwm extends Vue {
    @Prop({ required: true }) itemName!: string;
    @Prop({ required: true }) unitCost!: number;
    @Prop({ required: true }) isMeasurable!: boolean;
    @Prop({ required: true }) quantity!: number;
    @Prop({ required: true }) withholdingTaxPercentage!: 0;
    @Prop({ required: true }) amountPaid!: number;
    @Prop({ required: true }) bankDetails!: BankDetails;
    @Prop({ required: true }) vendorName!: string;
    @Prop({ required: true }) withholdingTaxType!: string;
    @Prop({ required: true }) balance!: number;
    @Prop({ required: true }) netCost!: number;
    @Prop({ required: true }) withholdingAmount!: number;
    @Prop({ required: true }) measurementUnit!: string;
    @Prop({ required: true }) expenseCurrency!: string;
    @Prop({ required: true }) indexOfCurrentComponent!: number;
    @Prop({ required: true }) quantityReceived!: number;

    get vendorSelectionComponentIsActive(): boolean {
        return this.indexOfCurrentComponent === 3 || this.indexOfCurrentComponent === 4;
    }

    get conditionForVendorToAppear(): boolean {
        return this.vendorName.length > 0;
    }

    get withholdingTaxEffect(): string {
        switch (this.withholdingTaxType) {
            case ExpenseWitholdingTaxTypes.INCLUSIVE:
                return 'less';
            case ExpenseWitholdingTaxTypes.EXCLUSIVE:
                return 'Excl.';

            default:
                return '';
        }
    }

    get conditionForCompulsoryVendor(): boolean {
        return this.withholdingTaxPercentage > 0 || this.balance > 0 || this.quantityReceived < this.quantity;
    }

    get conditionForOptionalVendor(): boolean {
        return this.conditionForVendorToAppear && !this.conditionForCompulsoryVendor;
    }

    get conditionForMeasurableCostToAppear(): boolean {
        return this.isMeasurable;
    }

    private handleIsMeasurableCheckboxOutput() {
        this.isMeasurable = !this.isMeasurable;
    }

    private goToVendorSelectionPage() {
        this.$emit('show-vendor-selection-page');
    }

    private goToExpenseSelectionPage() {
        this.$emit('show-expense-selection-page');
    }

    private goToAddExpensePage() {
        this.$emit('show-add-expense-page');
    }

    private removeSelectedVendor() {
        this.$emit('remove-selected-vendor');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/expense-summary-card';
</style>
