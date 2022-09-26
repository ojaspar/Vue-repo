<script lang="ts">
import Vue from 'vue';
import { Bar } from 'vue-chartjs';
import { Prop, Component, Watch } from 'vue-property-decorator';

@Component({
    extends: Bar,
})
export default class BarChart extends Vue<Bar> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(props: any) {
        super(props);
    }
    @Prop({
        required: true,
        default: null,
    })
    chartdata!: object;

    @Prop({
        required: true,
        default: null,
    })
    options!: object;

    @Watch('chartdata')
    updateChart() {
        this.renderChart(this.chartdata, this.options);
    }

    mounted() {
        this.renderChart(this.chartdata, this.options);
    }
}
</script>
