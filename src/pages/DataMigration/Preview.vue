<template>
    <div class="preview">
        <div class="preview__section">
            <p class="preview__heading">Financial year starts:</p>
            <p class="preview__secondary-heading">{{ previewData.financialYearMonthName }}</p>
        </div>
        <div class="preview__section">
            <p class="preview__heading">Cash Balance:</p>
            <p class="preview__secondary-heading">
                {{ getCurrencySymbolFromCurrencyKey(homeCurrencyKey.toString()) }}
                {{ previewData.cashBalance.amount | formatMoney }}
            </p>
        </div>
        <div class="preview__section">
            <p class="preview__heading">Bank Balances:</p>

            <div
                class="preview__bank-name-balance-section"
                v-for="(bankAccount, index) in previewData.bankAccountList"
                :key="index"
            >
                <span class="preview__bank-name preview__secondary-heading"
                    >{{ bankAccount.displayName }}({{
                        defaultCurrencySymbolFromCurrencyKey(bankAccount.accountBalance.currencyKey.toString())
                    }})</span
                >
                <span class="preview__bank-name preview__secondary-heading"
                    >{{ bankAccount.accountBalance.amount | formatMoney }}({{
                        defaultCurrencySymbolFromCurrencyKey(bankAccount.accountBalance.currencyKey.toString())
                    }})</span
                >
            </div>
        </div>
        <!-- <div class="preview__section">
            <p class="preview__heading">Debt:</p>
            <p class="preview__secondary-heading">
                ₦ {{ totalDebt | formatMoney
                }}<span class="preview__extra-information">({{ calculateNumberOfDebtors }} debtors)</span>
            </p>
        </div>
        <div class="preview__section">
            <p class="preview__heading">Credit:</p>
            <p class="preview__secondary-heading">
                ₦ {{ calculateTotalCredit | formatMoney }}
                <span class="preview__extra-information">({{ calculateNumberOfCreditors }} creditors)</span>
            </p>
        </div>
        <div class="preview__section">
            <p class="preview__heading">Fixed Assets</p>
            <p class="preview__secondary-heading">
                ₦ {{ calculateFixedAssetValue | formatMoney
                }}<span class="preview__extra-information"
                    >({{ calculateNumberOfFixedAssets | formatMoney }} Assets)</span
                >
            </p>
        </div> -->
        <!-- <div class="preview__section">
            <p class="preview__heading">Total Sales:</p>
            <p class="preview__secondary-heading">
                {{ getCurrencySymbolFromCurrencyKey(homeCurrencyKey.toString()) }}
                {{ previewData.totalYearSales.amount | formatMoney }}
            </p>
        </div>
        <div class="preview__section">
            <p class="preview__heading">Total Expenses:</p>
            <p class="preview__secondary-heading">
                {{ getCurrencySymbolFromCurrencyKey(homeCurrencyKey.toString()) }}
                {{ previewData.totalYearExpenses.amount | formatMoney }}
            </p>
        </div> -->
        <BasePrimaryButton
            buttonText="Submit"
            className="preview__save-btn"
            @button-clicked="submitBusinessMigrationData"
            :status="businessRequestStatus.migrateBusinessData"
        />
        <p v-if="!$root.isMobileScreenSize" class="preview__back-link linkify" @click="$emit('back-link-is-clicked')">
            Back
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import BusinessModule from '@/store/modules/business';

import { Asset, BusinessMigrationData, Creditor, Debtor } from '@/pages/DataMigration/types';
import { BusinessRequestStatus, Status } from '@/types';

import CurrencyMixin from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

const business = namespace('business');
let businessModule: BusinessModule;

@Component
export default class Preview extends Mixins(CurrencyMixin, UtilityMixins) {
    @Prop({ required: true }) readonly previewData!: BusinessMigrationData;

    @business.State
    public error!: string;

    @business.State
    private businessRequestStatus!: BusinessRequestStatus;

    @business.Action
    public migrateBusinessData!: () => void;

    get totalDebt(): number {
        return this.previewData.debtorList.reduce(
            (previousAmount: number, debtorObject: Debtor) =>
                previousAmount + this.convertFormattedFiguresToNumber(debtorObject.amountOwed.amount.toString()),
            0,
        );
    }

    get calculateNumberOfDebtors() {
        return this.previewData.debtorList.length;
    }

    get calculateTotalCredit(): number {
        return this.previewData.creditorList.reduce(
            (previousAmount: number, creditorObject: Creditor) =>
                previousAmount + this.convertFormattedFiguresToNumber(creditorObject.amountOwed.amount.toString()),
            0,
        );
    }

    get calculateNumberOfCreditors() {
        return this.previewData.creditorList.length;
    }

    get calculateFixedAssetValue() {
        let sumOfFixedAssetValue = 0;
        this.previewData.assetList.forEach((fixedAssetObject: Asset) => {
            sumOfFixedAssetValue += this.convertFormattedFiguresToNumber(
                fixedAssetObject.currentValue.amount.toString(),
            );
        });
        return sumOfFixedAssetValue;
    }

    get calculateNumberOfFixedAssets() {
        return this.previewData.assetList.length;
    }

    public async submitBusinessMigrationData() {
        await businessModule.migrateBusinessData(this.previewData);

        if (this.businessRequestStatus.migrateBusinessData === Status.SUCCESS) {
            this.$emit('business-data-has-been-migrated');
        } else {
            this.$emit('failure-migrating-business-data', this.error);
        }
    }

    mounted() {
        businessModule = getModule(BusinessModule, this.$store);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/data-migration/preview.scss';
</style>
