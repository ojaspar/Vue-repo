<template>
    <div>
        <VueApexCharts v-if="showChart" type="bar" height="259" :options="chartOptions" :series="chatSeries" />
        <div v-else :style="loaderContainer">
            <Loader size="3" />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import VueApexCharts from 'vue-apexcharts';

import UtilityMixins from '@/mixins/Utility';

export interface ChartData {
    labels: string[];
    sales: number[];
    expenses: number[];
    currencyKey: number;
}

@Component({ components: { VueApexCharts } })
export default class BarChart extends Mixins(UtilityMixins) {
    @Prop({ required: true }) chartData!: ChartData;

    private showChart = true;

    private chartOptions = {
        chart: {
            type: 'bar',
            height: 300,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories: this.chartData.labels,
        },
        yaxis: {
            showAlways: false,
            tickAmount: 4,
            labels: {
                formatter: (value: number) => {
                    const formattedValue = this.yAxisFormatter(value);
                    return value ? formattedValue : value;
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: (val: number) => {
                    return `₦ ${val}`;
                },
            },
        },
    };

    private chatSeries = [
        {
            name: 'Sales',
            data: this.chartData.sales,
            color: '#0CA2D9',
        },
        {
            name: 'Expenses',
            data: this.chartData.expenses,
            color: '#FF9254',
        },
    ];

    private loaderContainer = {
        height: '274px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7c7c7c',
    };

    get totalSale() {
        return this.chartData.sales.reduce((currentSum: number, saleAmount: number) => currentSum + saleAmount, 0);
    }

    get totalExpense() {
        return this.chartData.expenses.reduce(
            (currentSum: number, expenseAmount: number) => currentSum + expenseAmount,
            0,
        );
    }

    private yAxisFormatter(value: number) {
        let amount = value / 1000000;
        if (amount >= 1) {
            return `${amount}M`;
        }
        amount = value / 1000;
        if (amount >= 1) {
            return `${amount}K`;
        }
        return value;
    }

    private updateChartData() {
        setTimeout(() => {
            const { totalSale, totalExpense } = this;
            const { sales, expenses, labels } = this.chartData;
            this.chartOptions.xaxis.categories = labels;
            this.chatSeries[0].data = totalSale > 0 ? sales : [];
            this.chatSeries[1].data = totalExpense > 0 ? expenses : [];
            this.showChart = true;
        }, 800);
    }

    @Watch('chartData', { immediate: true, deep: true })
    updateChart() {
        this.showChart = false;
        this.updateChartData();
    }
}
</script>
