<template>
    <transition name="fade" appear="">
        <div class="vendor-alert" :style="containerStyle">
            <p class="vendor-alert__message">
                Please
                <span class="vendor-alert__message--action" @click="$emit('action-taken')">select a vendor</span>
                to proceed
            </p>
        </div>
    </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class VendorAlert extends Vue {
    @Prop({ default: false }) readonly showAlert!: boolean;

    get containerStyle() {
        return { visibility: this.showAlert ? 'visible' : 'hidden' };
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/record-expense/v4/vendor-alert';
</style>
