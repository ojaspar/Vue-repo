<template>
    <div>
        <b-row class="finance-dashboard-tables__add-button">
            <div @click="goToAddLoanPage">
                <CircularPlusSign class="finance-dashboard-tables__add-button--icon" />
                <span class="finance-dashboard-tables__add-button--text">
                    Add Loan
                </span>
            </div>
        </b-row>

        <div class="finance-dashboard-tables mr-3">
            <b-row class="finance-dashboard-tables__heading">
                <b-col class="pl-3">Lender</b-col>
                <b-col>Principal</b-col>
                <b-col>Interest</b-col>
                <b-col cols="4">Next Due Date</b-col>
            </b-row>

            <div v-if="loansAreAvailable">
                <b-row class="finance-dashboard-tables__content pl-3" v-for="(loan, index) in loans" :key="index">
                    <!-- More Options -->
                    <font-awesome-icon
                        icon="ellipsis-v"
                        class="pointer mt-2"
                        title="More options"
                        @click="toggleShowOptions(index)"
                        @mousedown="preventBlurFromHappening"
                    /><b-col
                        cols="1"
                        tabindex="-1"
                        class="finance-dashboard-tables__more-options"
                        ref="tableOptions"
                        v-if="isSelectedOption(index)"
                        @blur="closeOptions"
                    >
                        <p class="finance-dashboard-tables__content-action">
                            Edit Loan
                        </p>
                        <p class="finance-dashboard-tables__content-action" @click.stop="goToLoanDetailsPage(loan)">
                            View Transaction
                        </p>
                    </b-col>
                    <b-col class="pl-4">{{ loan.lenderName }}</b-col>
                    <b-col>{{ loan.totalPrincipal | amountWithCurrency }}</b-col>
                    <b-col>{{ loan.totalInterest | amountWithCurrency }}</b-col>
                    <b-col cols="4">{{ loan.nextRepaymentDate | monthDateYearFormat }}</b-col>
                </b-row>
            </div>
        </div>

        <b-row class="finance-dashboard-tables__mobile" v-for="(loan, index) in loans" :key="index">
            <div class="finance-mobile-table__content">
                <div class="finance-mobile-table__text--name">{{ loan.lenderName }}</div>
                <div>
                    <span v-show="!showLoanDetails(index)" class="finance-mobile-table__text--amount">
                        {{ loan.totalPrincipal | amountWithCurrency }}
                    </span>
                    <font-awesome-icon
                        class="finance-dashboard-tables__chevron-icon"
                        :icon="loanCardDetailsIcon(index)"
                        @click="toggleLoanDetailsCard(index)"
                    />
                </div>
            </div>
            <transition name="slide-up-fade">
                <div class="finance-mobile-table__details" v-if="showLoanDetails(index)">
                    <div class="finance-mobile-table__details--content" key="details">
                        <div>
                            <p>Principal:</p>
                            <p>Interest:</p>
                            <p>Next Due Date:</p>
                        </div>
                        <div class="finance-mobile-table__text--left">
                            <p>{{ loan.totalPrincipal | amountWithCurrency }}</p>
                            <p>{{ loan.totalInterest | amountWithCurrency }}</p>
                            <p>{{ loan.nextRepaymentDate | monthDateYearFormat }}</p>
                        </div>
                    </div>
                    <p class="finance-mobile-table__edit-details" key="edit-details">
                        <span>
                            <font-awesome-icon icon="pencil-alt" class="mr-2" />
                            Edit
                        </span>
                        <span class="ml-5" @click.stop="goToLoanDetailsPage(loan)">
                            <font-awesome-icon icon="eye" class="mr-2" />
                            View Details
                        </span>
                    </p>
                </div>
            </transition>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Ref } from 'vue-property-decorator';

import { Loan, LoanDetails } from '@/pages/Financing/Loan/types';

import UtilityMixins from '@/mixins/Utility';

@Component
export default class LoanTable extends Mixins(UtilityMixins) {
    @Prop({ default: () => [] }) readonly loans!: LoanDetails[];
    @Prop({ default: 'NORMAL' }) readonly requestStatus!: string;

    @Ref() readonly tableOptions!: HTMLFormElement;

    private selectedTableOptionsIndex = '';

    private selectedLoanCardIndex = '';

    get loansAreAvailable() {
        return this.loans.length > 0;
    }

    get requestIsLoading() {
        return this.requestStatus === 'LOADING';
    }

    private showLoanDetails(cardIndexNumber: string) {
        return this.selectedLoanCardIndex === cardIndexNumber;
    }

    private loanCardDetailsIcon(cardIndexNumber: string) {
        return this.selectedLoanCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private toggleLoanDetailsCard(cardIndexNumber: string) {
        if (this.selectedLoanCardIndex === cardIndexNumber) {
            this.selectedLoanCardIndex = '';
            return;
        }

        this.selectedLoanCardIndex = cardIndexNumber;
    }

    public isSelectedOption(index: string) {
        return this.selectedTableOptionsIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedTableOptionsIndex = index;
    }

    private closeOptions() {
        this.selectedTableOptionsIndex = '';
    }

    public toggleShowOptions(index: string) {
        if (this.isSelectedOption(index)) {
            this.closeOptions();
            return;
        }

        this.setSelectedOption(index);
        this.$nextTick(() => {
            this.focusOnElement(this.tableOptions);
        });
    }

    private goToAddLoanPage() {
        this.$router.push({ name: 'AddLoan' });
    }

    private goToLoanDetailsPage(loan: LoanDetails) {
        const { loanKey } = loan;
        const loanDetailsPage = { name: 'LoanDetails', params: { loanKey } };

        this.$router.push(loanDetailsPage);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/dashboard-tables';
</style>
