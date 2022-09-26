<template>
    <div>
        <!-- Table Rendered On Large Screens -->
        <div class="large-sales-table">
            <b-row class="sales-table__heading">
                <b-col class="pl-0">Date</b-col>
                <b-col>Customer / Ref.</b-col>
                <b-col cols="4">Products</b-col>
                <b-col>Amount</b-col>
                <b-col>Supply Status</b-col>
            </b-row>

            <b-row
                class="sales-table__content"
                v-for="(sale, index) in sales"
                :key="index"
                @click="manageSale(sale.saleKey, sale.transactionStatus)"
            >
                <font-awesome-icon
                    icon="ellipsis-h"
                    class="pointer mr-3"
                    @click="toggleShowOptions(index)"
                    @mousedown="preventBlurFromHappening"
                    v-if="false"
                />
                <b-col
                    cols="1"
                    v-if="selectedOptionIndex === index"
                    class="sales-table__options-actions"
                    tabindex="-1"
                    ref="tableOptions"
                    @blur="closeOptions"
                >
                    <div class="sales-table__options-anchor"></div>
                    <p
                        class="pointer d-flex sales-table__options-action"
                        @click.stop="navigateToEditSaleRecordRoute(sale.saleKey, sale.transactionStatus)"
                    >
                        <img class="mr-4" src="@/assets/img/pencil.svg" alt="Edit icon" />
                        {{ getEditText(sale.transactionStatus) }}
                    </p>
                    <p class="pointer d-flex sales-table__options-action">
                        <img class="mr-4" src="@/assets/img/trash-black.svg" alt="Delete Icon" />Cancel
                    </p>
                    <p
                        class="pointer d-flex sales-table__options-action"
                        @click.stop="navigateToDuplicateSaleRoute(sale.saleKey, sale.transactionStatus)"
                    >
                        <img class="mr-4" src="@/assets/img/copy.svg" alt="Add Payment" />Duplicate
                    </p>
                </b-col>
                <b-col class="pl-0">
                    <p class="content-text m-0">{{ sale.transactionDate | monthDateYearFormat }}</p>
                </b-col>
                <b-col>
                    <p class="content-text m-0">{{ sale.customerName }}</p>
                    <p class="content-text__meta">{{ sale.salesReferenceNumber }}</p>
                </b-col>
                <b-col cols="4">
                    <p class="content-text m-0">{{ truncateProductNames(sale.itemArray) }}</p>
                    <p class="content-text__meta" v-if="saleItemsExists(sale.itemArray)">
                        {{ saleItemsCount(sale.itemArray) | itemCountSuffix }}
                    </p>
                </b-col>
                <b-col>
                    <p class="content-text m-0">{{ sale.totalAmount | amountWithCurrency }}</p>
                    <p class="content-text__meta txt-red" v-if="sale.balanceOwed.amount !== 0">
                        {{ sale.balanceOwed | amountWithCurrency }} <i>Balance Due</i>
                    </p>
                </b-col>
                <b-col>
                    <p :class="[salesSupplyClass(sale.transactionStatus), 'm-0']">
                        {{ prettySupplyStatus(sale.transactionStatus) }}
                    </p>
                    <p class="content-text__meta--date dark-grey " v-if="shouldShowDueDate(sale.transactionStatus)">
                        {{ sale.supplyDueDate | monthDateYearFormat }}
                    </p>
                </b-col>
            </b-row>
        </div>

        <!-- Table Rendered On Medium Screens -->
        <div class="medium-sales-table">
            <b-row
                class="mobile-table"
                v-for="(sale, index) in sales"
                :key="index"
                @click="manageSale(sale.saleKey, sale.transactionStatus)"
            >
                <b-col class="mobile-table__content">
                    <div class="mobile-table__content--details">
                        <p class="mobile-content__meta">
                            {{ sale.transactionDate | monthDateYearFormat }} / {{ sale.salesReferenceNumber }}
                        </p>
                        <p class="mobile-content__text">{{ sale.customerName }}</p>

                        <p class="mobile-content__text">
                            {{ sale.totalAmount | amountWithCurrency }}
                            <span class="mobile-content__balance ml-2" v-if="sale.balanceOwed.amount !== 0">
                                ({{ sale.balanceOwed | amountWithCurrency }} Balance)
                            </span>
                        </p>

                        <p class="mobile-content__text" v-if="showSalesProductNames(index)">
                            {{ truncateProductNames(sale.itemArray) }}
                        </p>
                        <transition name="slide-up-fade" mode="out-in">
                            <span v-if="showExpenseDetails(index)">
                                <p :class="salesSupplyClass(sale.transactionStatus)">
                                    {{ prettySupplyStatus(sale.transactionStatus) }}
                                    <span class="dark-grey ml-3" v-if="shouldShowDueDate(sale.transactionStatus)">
                                        <i>Due {{ sale.supplyDueDate | monthDateYearFormat }}</i>
                                    </span>
                                </p>
                                <p class="mobile-content__text">
                                    {{ truncateProductNames(sale.itemArray) }}
                                    <span class="mobile-content__meta ml-5" v-if="saleItemsExists(sale.itemArray)">
                                        {{ saleItemsCount(sale.itemArray) | itemCountSuffix }}
                                    </span>
                                </p>
                                <p class="mt-3 mb-0">
                                    <span class="mr-5 pointer mobile-content__text">
                                        <font-awesome-icon icon="plus-circle" title="Add Payment" class="table-icon" />
                                        Add Payment
                                    </span>

                                    <span
                                        class="mr-5 pointer mobile-content__text"
                                        @click.stop="
                                            navigateToEditSaleRecordRoute(sale.saleKey, sale.transactionStatus)
                                        "
                                    >
                                        <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                        Edit
                                    </span>

                                    <span
                                        class="mr-5 pointer mobile-content__text"
                                        @click.stop="navigateToDuplicateSaleRoute(sale.saleKey, sale.transactionStatus)"
                                    >
                                        <font-awesome-icon icon="clone" title="Edit" class="table-icon" />
                                        Duplicate
                                    </span>

                                    <span class="mr-5 pointer mobile-content__text">
                                        <font-awesome-icon icon="times-circle" title="Edit" class="table-icon" />
                                        Cancel
                                    </span>
                                </p>
                            </span>
                        </transition>
                    </div>

                    <div class="mobile-content__right">
                        <p class="icon-box" v-if="caretShouldShow(index)">
                            <font-awesome-icon :icon="salesCardDetailsIcon(index)" title="Edit" class="card-icon" />
                        </p>

                        <div v-if="!showExpenseDetails(index)" class="mt-5">
                            <p :class="[salesSupplyClass(sale.transactionStatus), 'align-right mb-0']">
                                {{ prettySupplyStatus(sale.transactionStatus) }}
                            </p>
                            <p class="mobile-content__text align-right">
                                <span class="mobile-content__meta ml-5" v-if="saleItemsExists(sale.itemArray)">
                                    {{ saleItemsCount(sale.itemArray) | itemCountSuffix }}
                                </span>
                            </p>
                        </div>

                        <span v-if="showExpenseDetails(index)">
                            <p class="mobile-content__text align-right mt-0">
                                {{ sale.totalAmount | amountWithCurrency }}
                            </p>
                            <p class="mobile-content__balance ml-2" v-if="sale.balanceOwed.amount !== 0">
                                {{ sale.balanceOwed | amountWithCurrency }} Balance
                            </p>
                        </span>
                    </div>
                </b-col>
            </b-row>
        </div>

        <!-- Table Rendered On Small Screens -->
        <div class="small-sales-table">
            <b-row
                class="mobile-table"
                v-for="(sale, index) in sales"
                :key="index"
                @click="manageSale(sale.saleKey, sale.transactionStatus)"
            >
                <b-col class="mobile-table__content">
                    <div class="mobile-table__content--details">
                        <p class="mobile-content__meta">
                            {{ sale.transactionDate | monthDateYearFormat }}
                            <span class="dark-grey"> {{ `(${sale.salesReferenceNumber})` }} </span>
                        </p>
                        <p class="mobile-content__text">{{ sale.customerName }}</p>
                        <span v-if="showSalesProductNames(index)">
                            <p class="mobile-content__text">
                                {{ sale.totalAmount | amountWithCurrency }}
                                <span class="mobile-content__balance ml-2" v-if="sale.balanceOwed.amount !== 0">
                                    ({{ sale.balanceOwed | amountWithCurrency }} Balance)
                                </span>
                            </p>
                            <p class="mobile-content__text">
                                {{ truncateProductNames(sale.itemArray) }}
                            </p>
                        </span>
                        <transition name="slide-up-fade" mode="out-in">
                            <span v-if="showExpenseDetails(index)">
                                <p :class="salesSupplyClass(sale.transactionStatus)">
                                    {{ prettySupplyStatus(sale.transactionStatus) }}
                                    <span class="dark-grey ml-3" v-if="shouldShowDueDate(sale.transactionStatus)">
                                        <i>Due {{ sale.supplyDueDate | monthDateYearFormat }}</i>
                                    </span>
                                </p>
                                <p class="mobile-content__text">
                                    {{ truncateProductNames(sale.itemArray) }}
                                </p>
                                <p class="mobile-content__meta mt-2" v-if="saleItemsExists(sale.itemArray)">
                                    {{ saleItemsCount(sale.itemArray) | itemCountSuffix }}
                                </p>
                                <p class="mt-3 mb-0">
                                    <font-awesome-icon icon="plus-circle" title="Add Payment" class="table-icon" />
                                    <span class="mr-5 pointer mobile-content__text">Add Payment</span>
                                    <font-awesome-icon icon="pencil-alt" title="Edit" class="table-icon" />
                                    <span
                                        class="mr-5 pointer mobile-content__text"
                                        @click.stop="
                                            navigateToEditSaleRecordRoute(sale.saleKey, sale.transactionStatus)
                                        "
                                        >Edit</span
                                    >
                                </p>
                                <p class="mt-3 mb-0">
                                    <font-awesome-icon icon="clone" title="Duplicate" class="table-icon" />
                                    <span
                                        class="m-r pointer mobile-content__text"
                                        @click.stop="navigateToDuplicateSaleRoute(sale.saleKey, sale.transactionStatus)"
                                    >
                                        Duplicate
                                    </span>
                                    <font-awesome-icon icon="times-circle" title="Cancel" class="table-icon" />
                                    <span class="mr-5 pointer mobile-content__text">Cancel</span>
                                </p>
                            </span>
                        </transition>
                    </div>

                    <div class="mobile-content__right">
                        <p class="icon-box" v-if="caretShouldShow(index)">
                            <font-awesome-icon :icon="salesCardDetailsIcon(index)" title="Edit" class="card-icon" />
                        </p>

                        <span v-if="!showExpenseDetails(index)">
                            <p :class="[salesSupplyClass(sale.transactionStatus), 'align-right', 'm-t']">
                                {{ prettySupplyStatus(sale.transactionStatus) }}
                            </p>
                            <p class="mobile-content__meta align-right" v-if="saleItemsExists(sale.itemArray)">
                                {{ saleItemsCount(sale.itemArray) | itemCountSuffix }}
                            </p>
                        </span>

                        <span v-else>
                            <p class="mobile-content__text align-right mt-0">
                                {{ sale.totalAmount | amountWithCurrency }}
                            </p>
                            <p class="mobile-content__balance align-right" v-if="sale.balanceOwed.amount !== 0">
                                <span class="dark-grey">Balance:</span> {{ sale.balanceOwed | amountWithCurrency }}
                            </p>
                        </span>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Ref } from 'vue-property-decorator';

import { VueExtension } from '@/types';

import { SalesTableDetails } from '@/pages/Sales/types';

import UtilityMixins from '@/mixins/Utility';

@Component({
    filters: {
        itemCountSuffix(itemsCount: number): string {
            return itemsCount > 1 ? `${itemsCount} Items` : `${itemsCount} Item`;
        },
    },
})
export default class SalesTable extends Mixins(UtilityMixins) {
    @Prop({ default: [] }) readonly sales!: SalesTableDetails[];

    @Ref() readonly tableOptions!: HTMLFormElement;

    public $root!: VueExtension;

    private selectedOptionIndex = '';

    private selectedSaleCardIndex = '';

    private salesSupplyClass(supplyStatus: string) {
        const baseClass = `content-text__`;

        if (supplyStatus.toLowerCase().match('no supply')) {
            return `${baseClass}pending`;
        }
        if (supplyStatus.toLowerCase().match('pending sale') || supplyStatus.toLowerCase().match('estimate')) {
            return `${baseClass}pending-sale`;
        }
        if (supplyStatus.toLowerCase().match('partial')) {
            return `${baseClass}partial`;
        }
        if (supplyStatus.toLowerCase().match('cancelled')) {
            return `${baseClass}cancelled`;
        }

        return `${baseClass}completed`;
    }

    private prettySupplyStatus(supplyStatus: string) {
        if (supplyStatus === 'No Supply') {
            return 'Not Supplied';
        }

        return supplyStatus;
    }

    private shouldShowDueDate(supplyStatus: string): boolean {
        if (supplyStatus === 'Supplied' || supplyStatus === 'Estimate') {
            return false;
        }
        return true;
    }

    private getEditText(supplyStatus: string): string {
        return 'Edit ' + (supplyStatus === 'Estimate' ? 'Estimate' : 'Sale');
    }

    public closeOptions() {
        this.selectedOptionIndex = '';
    }

    public isSelectedOption(index: string) {
        return this.selectedOptionIndex === index;
    }

    public setSelectedOption(index: string) {
        this.selectedOptionIndex = index;
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

    public navigateToAddSalePaymentRoute(saleKey: string) {
        this.$router.push({ name: 'Add-Sale-Payment', params: { saleKey } });
    }

    public manageSale(saleKey: string, transactionStatus: string) {
        if (transactionStatus.toLowerCase() === 'estimate') {
            this.$router.push({ name: 'ManageEstimates', params: { saleKey } });
            return;
        }
        this.$router.push({ name: 'ManageSales', params: { saleKey } });
    }

    public navigateToDuplicateSaleRoute(saleKey: string, saleStatus: string) {
        if (saleStatus === 'Estimate') this.$router.push({ name: 'Duplicate-Estimate', params: { saleKey } });
        else this.$router.push({ name: 'Duplicate-Sale', params: { saleKey } });
    }

    public navigateToEditSaleRecordRoute(saleKey: string, saleStatus: string) {
        if (saleStatus === 'Estimate') this.$router.push({ name: 'Edit-Estimate', params: { saleKey } });
        else this.$router.push({ name: 'Edit-Sale-Record', params: { saleKey } });
    }

    private salesCardDetailsIcon(cardIndexNumber: string) {
        return this.selectedSaleCardIndex === cardIndexNumber ? 'chevron-up' : 'chevron-down';
    }

    private showExpenseDetails(cardIndexNumber: string) {
        return this.selectedSaleCardIndex === cardIndexNumber;
    }

    private showSalesProductNames(cardIndexNumber: string) {
        return this.selectedSaleCardIndex !== cardIndexNumber;
    }

    private caretShouldShow(cardIndexNumber: string): boolean {
        return this.salesCardDetailsIcon(cardIndexNumber) === 'chevron-up';
    }

    private toggleSaleDetailsCard(cardIndexNumber: string) {
        if (this.selectedSaleCardIndex === cardIndexNumber) {
            this.selectedSaleCardIndex = '';
            return;
        }
        this.selectedSaleCardIndex = cardIndexNumber;
    }

    private truncateProductNames(names: string[]): string {
        let maxLength = 80;
        if (this.$root.isMediumScreenSize) maxLength = 50;
        if (this.$root.isMobileScreenSize) maxLength = 35;

        const allNames = names.join(', ').substring(0, maxLength);

        if (allNames.length >= maxLength) {
            return `${allNames}...`;
        }

        return allNames;
    }

    private saleItemsCount(saleItems: string[]): number {
        return saleItems.length;
    }

    private saleItemsExists(saleItems: string[]): boolean {
        return saleItems.length > 0;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/sales-table';
</style>
