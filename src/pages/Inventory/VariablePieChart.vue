<template>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import variablePie from 'highcharts/modules/variable-pie';

variablePie(Highcharts);

export interface VariablePieChartData {
    name: string;
    y: number;
    z: number;
}

@Component({
    components: {
        highcharts: Chart,
    },
})
export default class VariablePieChart extends Vue {
    @Prop({ required: true }) readonly chartName!: string;
    @Prop({ required: true }) readonly chartData!: Array<VariablePieChartData>;
    @Prop({ default: {} }) readonly chartConfiguration!: object;

    get chartOptions() {
        return {
            chart: {
                type: 'variablepie',
                width: '146',
                height: '142c',
            },

            title: {
                text: this.chartName,
                floating: true,
                align: 'right',
                x: -30,
                y: 30,
            },
            ...this.chartConfiguration,

            series: [
                {
                    minPointSize: 10,
                    innerSize: '20%',
                    zMin: 0,
                    name: this.chartName,
                    data: this.chartData,
                    dataLabels: [
                        {
                            enabled: true,
                        },
                    ],
                },
            ],
        };
    }
}
</script>
