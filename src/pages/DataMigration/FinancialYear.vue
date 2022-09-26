<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        :isSkipTextToShow="false"
        :errorExists="atLeastOneErrorExists(errors)"
    >
        <div class="w-100">
            <h1 class="setup__right-side-heading">Confirm that your Financial year starts in :</h1>
            <BaseSelectWithBorderAndFloatingLabel
                floatingLabelText="Month"
                inputContainerClass="setup__select-container"
                :overRideContainerClass="true"
                :options="monthsOfTheYear"
                textProperty="name"
                valueProperty="key"
                :emitEventObject="true"
                keyProperty="key"
                :errors="errors.financialYearStartMonth"
                errorLabelClass="setup__error-label-select"
                errorContainerClass="setup__error-label-container"
                v-model="financialYearStartMonth"
                @input="handleMonthChange"
            />
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

import { BusinessRequestStatus, Status, TargetObject } from '@/types';
import { BusinessMigrationData } from '@/pages/DataMigration/types';

import BusinessModule from '@/store/modules/business';

import ValidationMixin from '@/mixins/validation';
import deepCloneFunction from '@/utils/deepCloneFunction';

const business = namespace('business');
let businessModule: BusinessModule;

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class BusinessSetup extends Mixins(ValidationMixin) {
    private monthsOfTheYear = [
        {
            name: 'January',
            key: 1,
        },
        {
            name: 'February',
            key: 2,
        },
        {
            name: 'March',
            key: 3,
        },
        {
            name: 'April',
            key: 4,
        },
        {
            name: 'May',
            key: 5,
        },
        {
            name: 'June',
            key: 6,
        },
        {
            name: 'July',
            key: 7,
        },
        {
            name: 'August',
            key: 8,
        },
        {
            name: 'September',
            key: 9,
        },
        {
            name: 'October',
            key: 10,
        },
        {
            name: 'November',
            key: 11,
        },
        {
            name: 'December',
            key: 12,
        },
    ];
    private financialYearStartMonth: string | number = '1';
    private financialYearMonthName = 'January';
    private businessMigrationData: BusinessMigrationData = {
        financialYearStartMonth: 1,
        financialYearMonthName: 'January',
        cashBalance: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearSales: {
            currencyKey: 0,
            amount: 0,
        },
        totalYearExpenses: {
            currencyKey: 0,
            amount: 0,
        },
        creditorList: [],
        debtorList: [],
        bankAccountList: [],
        assetList: [],
    };

    private errors = {
        financialYearStartMonth: '',
    };

    @business.State
    public businessData!: BusinessMigrationData;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    get preliminaryRequestHaveBeenLoaded(): boolean {
        return this.businessRequestStatus.getBusinessData === Status.SUCCESS;
    }

    public handleMonthChange(event: TargetObject) {
        // convert financial start month to number
        this.financialYearStartMonth = Number(event.target.value);
        this.financialYearMonthName = event.target.options[event.target.selectedIndex].text;

        this.validateEmptyField(
            'financialYearStartMonth',
            this.financialYearStartMonth.toString(),
            this.errors,
            'Please choose a month',
        );
    }

    public handleNextButtonClick() {
        // validate financialYearStartMonth field when next button is clicked
        this.validateEmptyField(
            'financialYearStartMonth',
            this.financialYearStartMonth.toString(),
            this.errors,
            'Please choose a month',
        );
        if (!this.errors.financialYearStartMonth) {
            this.$nextTick(() => {
                this.$emit('proceed-to-the-next-section', {
                    key: 'financialYearStartMonth',
                    value: Number(this.financialYearStartMonth),
                });
                this.$emit('update-financial-year-month-name', this.financialYearMonthName);
            });
        }
    }

    private async fetchPrelimaryData() {
        await businessModule.getBusinessData();

        if (this.preliminaryRequestHaveBeenLoaded) {
            const { financialYearStartMonth } = this.businessData;

            if (!financialYearStartMonth) {
                this.$parent.$emit('skip-text-is-not-required');
            }

            this.$nextTick(() => {
                this.businessMigrationData = deepCloneFunction(this.businessData);
                this.prepolutateExistingForms();
                this.$emit('set-business-migration-data-from-store');
            });
            return;
        }

        this.$emit('fetching-migration-data-failed');
    }

    private prepolutateExistingForms() {
        const { financialYearStartMonth } = this.businessMigrationData;
        this.financialYearStartMonth = Number(financialYearStartMonth);

        this.financialYearMonthName = this.monthsOfTheYear[Number(this.financialYearStartMonth)].name;
    }

    created() {
        businessModule = getModule(BusinessModule, this.$store);
        // emit to the NextButtonAndSkipText slot that
        // there is no need for the skip text
    }

    mounted() {
        this.fetchPrelimaryData();
    }
}
</script>
