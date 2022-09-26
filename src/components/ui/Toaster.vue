<template>
    <div>
        <b-toast :id="id" :variant="variant" :toaster="toaster" :no-auto-hide="infoVariant" solid>
            <template v-slot:toast-title>
                <div class="d-flex flex-grow-1 align-items-baseline">
                    <ToasterIcon :iconName="iconProps.name" :class="[iconProps.class, 'toast__icon']" />
                    <h4 class="toast__title ml-2">{{ title }}</h4>
                </div>
            </template>
            <span class="toast__message"> {{ messageBody }} </span>
        </b-toast>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Toaster extends Vue {
    @Prop({ default: 'Notification' }) readonly title!: string;
    @Prop({ required: true }) readonly id!: string;
    @Prop({ default: '' }) readonly messageBody!: string;
    @Prop({ default: '' }) readonly variant!: string;
    @Prop({ default: 'b-toaster-top-center' }) readonly toaster!: string;
    @Prop({ default: true }) readonly static!: boolean;
    @Prop({ default: 5000 }) readonly autoHideDelay!: number;

    get infoVariant(): boolean {
        return this.variant === 'info';
    }

    get iconProps() {
        const iconProps = { name: '', class: 'icon mr-2' };
        if (this.variant === 'danger') iconProps.name = 'exclamation-triangle';
        if (this.variant === 'success') iconProps.name = 'check';
        if (this.variant === 'info') {
            iconProps.name = 'spinner';
            iconProps.class += ' fa-spin';
        }
        return iconProps;
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/toaster';
</style>
