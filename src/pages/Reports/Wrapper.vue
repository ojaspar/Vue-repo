<template>
    <b-container class="reports">
        <ReportTitle :companyName="companyName" :reportType="reportType" :companyAddress="companyInfo.address" />

        <!-- Reports Period Selection-->
        <div class="d-flex justify-content-center">
            <b-row>
                <b-col class="reports__period d-flex flex-row">
                    <p class="reports__period__text">{{ reportTitle }} as at {{ lastMonth }}</p>
                    <!-- as at
                    <BaseSelect
                        :options="periodOptions"
                        keyProperty="period"
                        textProperty="period"
                        valueProperty="period"
                        defaultText="This Month"
                        selectContainerClass="reports__period__selection"
                        :disableDefaultOption="false"
                        @input="specifiedPeriodChanged"
                    /> -->
                </b-col>
            </b-row>
        </div>

        <slot name="report-items" />
    </b-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import ReportTitle from '@/pages/Reports/Heading.vue';

import { PeriodicOptions, PeriodicRange } from '@/pages/Reports/types';
import { CompanyInfo } from '@/types';

import SessionStorageService from '@/services/sessionStorage';

import GeneralModule from '@/store/modules/general';

import UtilityMixins from '@/mixins/Utility';

const general = namespace('general');
let generalModule: GeneralModule;

@Component({
    components: {
        ReportTitle,
    },
})
export default class Report extends Mixins(UtilityMixins) {
    @Prop({ default: '' }) readonly reportTitle!: string;
    @Prop({ default: '' }) readonly reportType!: string;

    private companyName = '';

    private specifiedPeriod = 'This Month';

    private readonly periodOptions: Array<PeriodicOptions> = [
        { period: 'Last Month' },
        { period: 'This Quarter' },
        { period: 'Last Quarter' },
        { period: 'This Year' },
        { period: 'Last Year' },
    ];

    @general.State
    private companyInfo!: CompanyInfo;

    @general.Action
    private getCompanyInfo!: () => CompanyInfo;

    //get the last day of the month instead of hardcoded 31
    get lastMonth(): string {
        return `${this.monthsOfTheYear[this.currentMonth - 1]} 31, ${this.currentYear}`;
    }

    private specifiedPeriodChanged(selectedPeriod: string) {
        if (selectedPeriod !== '') this.specifiedPeriod = selectedPeriod;
        else this.specifiedPeriod = 'This Month';
        const periodicRange = this.getPeriodicRange(this.specifiedPeriod);
        this.$emit('specifiedPeriodChanged', this.specifiedPeriod, periodicRange);
    }

    private getPeriodicRange(selectedPeriod: string): PeriodicRange {
        const currentDate = new Date();
        const thisQuarter = this.getCurrentQuarter(currentDate);
        const lastQuarter = this.getPreviousQuarter(thisQuarter);
        const thisYear = currentDate.getFullYear();
        const lastYear = thisYear - 1;

        if (selectedPeriod === 'Last Month') {
            return this.periodicRangeForLastMonth(currentDate);
        }
        if (selectedPeriod === 'This Quarter') {
            return this.periodicRangeForThisQuarter(thisQuarter, lastQuarter);
        }
        if (selectedPeriod === 'Last Quarter') {
            return this.periodicRangeForLastQuarter(lastQuarter);
        }
        if (selectedPeriod === 'This Year') {
            return this.periodicRangeForThisYear(thisYear, lastYear);
        }
        if (selectedPeriod === 'Last Year') {
            return this.periodicRangeForLastYear(lastYear);
        }
        return this.periodicRangeForThisMonth(currentDate);
    }

    private periodicRangeForThisMonth(currentDate: Date): PeriodicRange {
        const thisMonth = new Date(currentDate);
        const lastMonth = this.getPreviousMonth(currentDate, thisMonth);
        return ['This Month', 'Last Month', thisMonth, lastMonth];
    }

    private periodicRangeForLastMonth(currentDate: Date): PeriodicRange {
        const lastMonth = this.getPreviousMonth(currentDate, currentDate);
        const previousMonth = this.getPreviousMonth(currentDate, lastMonth);
        return ['Last Month', 'Prev. Month', lastMonth, previousMonth];
    }

    private periodicRangeForThisQuarter(thisQuarter: number[], lastQuarter: number[]): PeriodicRange {
        return [
            'This Quarter',
            'Last Quarter',
            this.getYearlyQuarterMonths(thisQuarter),
            this.getYearlyQuarterMonths(lastQuarter),
        ];
    }

    private periodicRangeForLastQuarter(lastQuarter: number[]): PeriodicRange {
        const previousQuarter = this.getPreviousQuarter(lastQuarter);
        return [
            'Last Quarter',
            'Prev. Quarter',
            this.getYearlyQuarterMonths(lastQuarter),
            this.getYearlyQuarterMonths(previousQuarter),
        ];
    }

    private periodicRangeForThisYear(thisYear: number, lastYear: number): PeriodicRange {
        return ['This Year', 'Last Year', thisYear, lastYear];
    }

    private periodicRangeForLastYear(lastYear: number): PeriodicRange {
        const previousYear = lastYear - 1;
        return ['Last Year', 'Prev. Year', lastYear, previousYear];
    }

    private getPreviousMonth(date: Date, currentMonth: Date): Date {
        return new Date(date.setMonth(currentMonth.getMonth() - 1));
    }

    private getCurrentQuarter(date: Date): number[] {
        const month = date.getMonth();
        const year = date.getFullYear();
        const quarter = Math.floor(month / 3) + 1;
        return [quarter, year];
    }

    private getPreviousQuarter(yearlyQuarter: number[]): number[] {
        const [currentQuarter, year] = yearlyQuarter;
        if (currentQuarter === 1) return [4, year - 1];
        return [currentQuarter - 1, year];
    }

    private getYearlyQuarterMonths(yearlyQuarter: number[]): string {
        const [quarter, year] = yearlyQuarter;
        if (quarter === 1) return `Jan - Mar, ${year}`;
        if (quarter === 2) return `Apr - Jun, ${year}`;
        if (quarter === 3) return `Jul - Sep, ${year}`;
        return `Oct - Dec, ${year}`;
    }

    private getUserCompanyName() {
        const authenticatedUser = SessionStorageService.decodeToken();
        const { businessName } = authenticatedUser;
        this.companyName = businessName;
    }

    private async fetchCompanyInfo() {
        await generalModule.getCompanyInfo();
    }

    mounted() {
        this.$emit('specifiedPeriodChanged', this.specifiedPeriod, this.getPeriodicRange(this.specifiedPeriod));
        generalModule = getModule(GeneralModule, this.$store);

        this.getUserCompanyName();
        this.fetchCompanyInfo();
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/reports/dashboard';
</style>
