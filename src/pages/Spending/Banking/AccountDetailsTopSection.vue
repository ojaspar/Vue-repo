<template>
    <div>
        <!-- Desktop View -->
        <div class="account-details-top-section" v-if="$root.isLargeScreenSize">
            <b-row class="account-details-top-section__first-row" v-if="isBankAccount">
                <div class="bank-details">
                    <span class="bank-details__name">
                        {{ `${selectedAccount.displayName}` }}
                    </span>
                    <div
                        class="d-flex align-items-center"
                        @click="$emit('edit-bank-details', selectedAccount.bankAccountKey)"
                    >
                        <img src="@/assets/img/edit-bank-details.svg" class="ml-5 pointer" alt="" />
                        <span class="bank-details__edit">Edit Bank Details</span>
                    </div>
                </div>
                <h4 class="bank-details__currency-name">
                    {{ selectedAccountCurrencyname }}
                </h4>
            </b-row>
            <b-row class="account-details-top-section__second-row">
                <b-col cols="3" class="balance">
                    <span class="balance__amount">{{ selectedAccountBalance | amountWithCurrency }}</span>
                    <span class="balance__text">Balance</span>
                </b-col>

                <b-col class="search-and-dates p-0">
                    <div class="search__container">
                        <font-awesome-icon icon="search" class="search__icon" />
                        <BaseInputField placeholder="Search" @input="handleSearchInput" class="search__input" />
                    </div>
                    <div class="dates">
                        <div class="dates__from">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="From"
                                :overRideInputContainerClass="true"
                                inputContainerClass="dates__container"
                                @change="handleFromDateChange"
                            />
                        </div>
                        <div class="dates__to">
                            <BaseDateFieldWithBorderAndFloatingLabel
                                floatingLabelText="To"
                                :overRideInputContainerClass="true"
                                inputContainerClass="dates__container"
                                @change="handleToDateChange"
                            />
                        </div>
                    </div>
                </b-col>
                <b-col cols="2" class="account-details-top-section__transfer-btn">
                    <BasePrimaryButton
                        buttonText="Transfer Funds"
                        className="fund-transfer-btn"
                        :overRideButtonClass="true"
                        @button-clicked="displayFundTransferModal"
                    />
                </b-col>
            </b-row>
        </div>

        <!-- Mobile View -->
        <div class="mobile-top-section" v-else>
            <!-- Card -->
            <div class="mobile-card">
                <h3 class="mobile-card__text">{{ (isBankAccount && selectedAccount.displayName) || 'Cash' }}</h3>
                <h3 class="mobile-card__balance">{{ selectedAccountBalance | amountWithCurrency }}</h3>
                <div class="mobile-card__other-info" v-if="isBankAccount">
                    <h3 class="mobile-card__text mt-4">{{ selectedAccountCurrencyname }}</h3>
                    <div
                        class="d-flex align-items-center"
                        @click="$emit('edit-bank-details', selectedAccount.bankAccountKey)"
                    >
                        <img src="@/assets/img/edit-bank-details.svg" class="ml-5 pointer" alt="" />
                        <span class="bank-details__edit">Edit Bank Details</span>
                    </div>
                </div>
            </div>

            <b-row class="btn-container">
                <BasePrimaryButton
                    buttonText="Transfer Funds"
                    className="mobile-transfer-btn"
                    :overRideButtonClass="true"
                    @button-clicked="displayFundTransferModal"
                />
            </b-row>

            <!-- Search and dates for medium screens -->
            <b-row class="mobile-search-and-dates medium-screen m-0">
                <!-- Search -->
                <div class="mobile-search__container">
                    <font-awesome-icon icon="search" class="search__icon" />
                    <BaseInputField placeholder="Search" @input="handleSearchInput" class="mobile-search__input" />
                </div>
                <!-- Dates -->
                <div class="mobile-dates">
                    <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="From" @change="handleFromDateChange" />
                    <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="To" @change="handleToDateChange" />
                </div>
            </b-row>

            <!-- Search and dates for xs screens -->
            <div class="xs-screen">
                <!-- Search -->
                <b-row class="mobile-search-and-dates m-0">
                    <b-col class="mobile-search__container">
                        <font-awesome-icon icon="search" class="search__icon" />
                        <BaseInputField placeholder="Search" @input="handleSearchInput" class="mobile-search__input" />
                    </b-col>
                </b-row>

                <!-- Dates -->
                <b-row class="xs-dates-container m-0">
                    <div class="mobile-dates">
                        <BaseDateFieldWithBorderAndFloatingLabel
                            floatingLabelText="From"
                            @change="handleFromDateChange"
                        />
                    </div>
                    <div class="mobile-dates">
                        <BaseDateFieldWithBorderAndFloatingLabel floatingLabelText="To" @change="handleToDateChange" />
                    </div>
                </b-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import { BankAccount } from '@/pages/Spending/Banking/types';
import { VueExtension } from '@/types';

import BankingMixin from '@/pages/Spending/Banking/BankingMixin';

@Component
export default class AccountDetailsTopSection extends Mixins(BankingMixin) {
    @Prop({ default: '' }) readonly accountType!: string;
    @Prop({ default: () => ({}) }) readonly selectedAccount!: BankAccount;

    public $root!: VueExtension;

    private selectedAccountCurrencyname = '';

    private selectedAccountBalance = {};

    get isBankAccount() {
        return this.accountType.toLowerCase() === 'bank';
    }

    get currencyName() {
        const { currencyKey } = this.selectedAccount.accountBalance;
        const { currencyName } = this.getSelectedCurrency(Number(currencyKey));
        return currencyName;
    }

    private handleSearchInput(searchString: string) {
        this.$emit('search-input-changed', searchString);
    }

    private handleFromDateChange(date: string) {
        this.$emit('from-date-filter-has-changed', date);
    }

    private handleToDateChange(date: string) {
        this.$emit('to-date-filter-has-changed', date);
    }

    private displayFundTransferModal() {
        this.$emit('transfer-funds-from-account-details', this.selectedAccount.bankAccountKey);
    }

    private setSelectedAccountBalance() {
        const { amount, currencyKey } = this.selectedAccount.accountBalance;
        this.$set(this.selectedAccountBalance, 'amount', amount);
        this.$set(this.selectedAccountBalance, 'currencyKey', currencyKey);
    }

    mounted() {
        this.selectedAccountCurrencyname = this.currencyName;
        this.setSelectedAccountBalance();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/banking/account-details-top-section';
</style>
