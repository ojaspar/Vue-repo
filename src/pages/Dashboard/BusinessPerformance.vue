<template>
    <div class="dashboard-date-mobile" v-if="$root.isMobileScreenSize">
        <span>Business Performance</span>
        <span>
            <BaseSelect
                :options="businessPerformanceOptions"
                keyProperty="name"
                textProperty="name"
                valueProperty="value"
                :value="activeTab"
                @input="handleDateRangeSelection"
                className="dashboard-date__date-range-select"
                selectContainerClass="dashboard-date__date-range-select-container"
            />
        </span>
    </div>
    <b-row v-else class="dashboard-date">
        <b-col class="dashboard-date__business">
            Business Performance
        </b-col>
        <b-col
            class="dashboard-date__today"
            title="See business performance data for today"
            :class="{ 'active-tab': activeTab === 'today' }"
            @click="getBusinessPerformanceStats('today')"
        >
            <p class="dashboard-date__text">Today</p>
            <p class="dashboard-date__sub-text">{{ todaysDate | today }}</p>
        </b-col>

        <b-col
            class="dashboard-date__week"
            title="See business performance data for this week"
            :class="{ 'active-tab': activeTab === 'week' }"
            @click="getBusinessPerformanceStats('week')"
        >
            <p class="dashboard-date__text">This Week</p>
            <p class="dashboard-date__sub-text">{{ weeklyDateRange() }}</p>
        </b-col>

        <b-col
            class="dashboard-date__month"
            title="See business performance data for this month"
            :class="{ 'active-tab': activeTab === 'month' }"
            @click="getBusinessPerformanceStats('month')"
        >
            <p class="dashboard-date__text">This Month</p>
            <p class="dashboard-date__sub-text">{{ todaysDate | thisMonth }}</p>
        </b-col>

        <b-col
            class="dashboard-date__year"
            title="See business performance data for this year"
            :class="{ 'active-tab': activeTab === 'year' }"
            @click="getBusinessPerformanceStats('year')"
        >
            <p class="dashboard-date__text">This Year</p>
            <p class="dashboard-date__sub-text">{{ todaysDate | thisYear }}</p>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    filters: {
        today(todaysDate: string[]): string {
            const [day, month, date, year] = todaysDate;
            const formattedDate = `${day}, ${month} ${date}, ${year}`;
            return formattedDate;
        },

        thisMonth(todaysDate: string[]): string {
            const [, month, , year] = todaysDate;
            const formattedDate = `${month}, ${year}`;
            return formattedDate;
        },

        thisYear(todaysDate: string[]): string {
            const [, month, , year] = todaysDate;
            if (month === 'January') return `${month}, ${year}`;
            return `January to ${month}, ${year}`;
        },
    },
})
export default class BusinessPerformace extends Vue {
    @Prop() readonly arrayOfWeekDays!: Array<string>;
    @Prop() readonly arrayOfMonths!: Array<string>;

    private weekDays = this.arrayOfWeekDays;

    private months = this.arrayOfMonths;

    private businessPerformanceOptions = [
        {
            name: 'Today',
            value: 'today',
        },
        {
            name: 'Week',
            value: 'week',
        },
        {
            name: 'Month',
            value: 'month',
        },
        {
            name: 'Year',
            value: 'year',
        },
    ];

    private activeTab = 'today';

    get todaysDate() {
        const today = this.currentDate();
        const day = this.weekDays[today.getDay()];
        const month = this.months[today.getMonth()];
        const date = Number(today.getDate());
        const year = today.getFullYear();
        const todaysDate = [day, month, date, year];
        return todaysDate;
    }

    private weeklyDateRange(forPerformanceStats = false) {
        const currentDate = this.currentDate();
        const weekDay = this.weekDays[currentDate.getDay()];
        if (weekDay === 'Sunday') {
            if (forPerformanceStats) return this.datesForNewWeek(currentDate, true);
            return this.datesForNewWeek(currentDate);
        }
        if (forPerformanceStats) return this.datesForCurrentWeek(currentDate, true);
        return this.datesForCurrentWeek(currentDate);
    }

    private getBusinessPerformanceStats(selectedPeriod: string) {
        if (selectedPeriod === this.activeTab) return;
        this.activeTab = selectedPeriod;
        const currentDate = this.currentDate();
        let startingDate = this.formatDateToISOString(currentDate);
        let endingDate = '';
        if (selectedPeriod === 'week') {
            const weekDates = this.weeklyDateRange(true);
            startingDate = this.formatDateToISOString(weekDates[0]);
            endingDate = this.formatDateToISOString(weekDates[1]);
        }
        if (selectedPeriod === 'month') {
            startingDate = this.formatDateToISOString(currentDate);
            startingDate = `${startingDate.slice(0, -2)}01`;
            endingDate = '';
        }
        if (selectedPeriod === 'year') {
            const curretYear = currentDate.getFullYear();
            startingDate = `${curretYear}-01-01`;
            endingDate = '';
        }

        this.$router.push({ name: 'Dashboard', query: { tab: selectedPeriod } });

        this.$nextTick(() => {
            this.$emit('getBusinessPerformanceStats', startingDate, endingDate);
        });
    }

    private currentDate() {
        return new Date();
    }

    private datesForNewWeek(date: Date, forPerformanceStats = false) {
        const startingDate = new Date(date);
        const endingDate = new Date(date.setDate(date.getDate() + 6));
        if (forPerformanceStats) return [startingDate, endingDate];
        return this.generateWeeklyDateRange(startingDate, endingDate);
    }

    private datesForCurrentWeek(date: Date, forPerformanceStats = false) {
        const currentDate = new Date(date);
        const currentDay = this.weekDays[date.getDay()];
        const startingDate = new Date(date.setDate(currentDate.getDate() - this.weekDays.indexOf(currentDay)));
        const endingDate = new Date(date.setDate(startingDate.getDate() + 6));
        if (forPerformanceStats) return [startingDate, endingDate];
        return this.generateWeeklyDateRange(startingDate, endingDate);
    }

    private generateWeeklyDateRange(startingDateObject: Date, endingDateObject: Date) {
        const [, , startingDate] = startingDateObject.toDateString().split(' ');
        const [, , endingDate] = endingDateObject.toDateString().split(' ');
        const startingMonth = this.months[startingDateObject.getMonth()];
        const endingMonth = this.months[endingDateObject.getMonth()];

        const startingDateWithOrdinalSuffix = this.getDateWithSuffix(Number(startingDate));
        const endingDateWithOrdinalSuffix = this.getDateWithSuffix(Number(endingDate));

        if (startingMonth !== endingMonth)
            return `${startingDateWithOrdinalSuffix} ${startingMonth} to ${endingDateWithOrdinalSuffix} ${endingMonth}`;
        return `${startingDateWithOrdinalSuffix} to ${endingDateWithOrdinalSuffix} ${startingMonth}`;
    }

    private getDateWithSuffix(date: number): string {
        const lastFigure = date % 10;
        const figures = date % 100;

        if (lastFigure == 1 && figures != 11) {
            return `${date}st`;
        }
        if (lastFigure == 2 && figures != 12) {
            return `${date}nd`;
        }
        if (lastFigure == 3 && figures != 13) {
            return `${date}rd`;
        }
        return `${date}th`;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private formatDateToISOString(dateObject: any) {
        const formatedDate = dateObject.toISOString().replace(/T.*/, '');
        return formatedDate;
    }

    private mounted() {
        const today = this.formatDateToISOString(this.currentDate());
        this.$emit('getBusinessPerformanceStats', today, '');
    }

    private handleDateRangeSelection(dateRangeText: string) {
        this.getBusinessPerformanceStats(dateRangeText);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/dashboard/business-performance';
</style>
