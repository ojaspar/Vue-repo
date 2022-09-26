<template>
    <transition name="fade" appear="">
        <div class="customer-alert" :style="containerStyle">
            <p class="customer-alert__message">
                Please
                <span class="customer-alert__message--action" @click="$emit('action-taken')">select a customer</span>
                to proceed
            </p>
        </div>
    </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CustomerAlert extends Vue {
    @Prop({ default: false }) readonly showAlert!: boolean;

    get containerStyle() {
        return { visibility: this.showAlert ? 'visible' : 'hidden' };
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/record-sale/v4/customer-alert';
</style>
