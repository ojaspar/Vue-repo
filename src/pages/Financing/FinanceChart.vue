<template>
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import 'chartjs-plugin-datalabels';

import DoughnutChart from '@/components/ui/DoughnutChart.vue';
import UtilityMixins from '@/mixins/Utility';

@Component({
    components: { DoughnutChart },
})
export default class FinanceChart extends Mixins(UtilityMixins) {
    @Prop({ required: true }) readonly totalCapital!: number;
    @Prop({ required: true }) readonly totalLoan!: number;

    private chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 60,
        animation: { animateRotate: false },
        legend: { display: false },
    };

    private plugins = {
        datalabels: {
            color: '#ffffff',
            textAlign: 'center',
            font: {
                weight: 'bold',
                size: this.fontSize,
            },
            formatter: (value: number) => {
                return value ? this.formatChartFigures(value) : '';
            },
        },
    };

    private setPluginOptions() {
        this.$set(this.chartOptions, 'plugins', this.plugins);
    }

    get chartData() {
        return {
            labels: ['Loans', 'Capital'],
            datasets: [
                {
                    backgroundColor: ['#FA8C16', '#0CA2D9'],
                    color: ['#ffffff', '#ffffff'],
                    data: [this.loanPercentage, this.capitalPercentage],
                },
            ],
        };
    }

    get fontSize() {
        const { isLargeScreenSize } = this.$root;
        return isLargeScreenSize ? '12' : '8';
    }

    get capitalPercentage() {
        const { totalCapital, totalLoan } = this;
        const totalAmount = totalCapital + totalLoan;
        const capitalPercentage = this.amountInPercentage(totalCapital, totalAmount, false);
        return Number(capitalPercentage) || '';
    }

    get loanPercentage() {
        const { totalCapital, totalLoan } = this;
        const totalAmount = totalCapital + totalLoan;
        const loanPercentage = this.amountInPercentage(totalLoan, totalAmount, false);
        return Number(loanPercentage) || '';
    }

    private formatChartFigures(value: number): string {
        if (!value) return '';
        if (value % 1 != 0) return `${value.toFixed(1)}%`;
        return `${value}%`;
    }

    mounted() {
        this.setPluginOptions();
    }
}
</script>
