<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import { Doughnut } from 'vue-chartjs';

@Component({
    extends: Doughnut,
})
export default class DoughnutChart extends Mixins(Doughnut) {
    @Prop({ required: true }) chartData!: object;
    @Prop({ required: true }) chartOptions!: object;

    private loadChat() {
        this.renderChart(this.chartData, this.chartOptions);
    }

    @Watch('chartData', { deep: true })
    @Watch('chartOptions', { deep: true })
    updateChart() {
        this.loadChat();
    }

    mounted() {
        this.loadChat();
    }
}
</script>
