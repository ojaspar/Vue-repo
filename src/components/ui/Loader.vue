<template>
    <font-awesome-icon icon="spinner" :class="spinnerClass" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: true }) readonly isInline!: boolean;

    get spinnerClass(): string {
        return `${this.isInline ? '' : 'd-flex ml-auto mr-auto'} fa-spin mb-0 fa-${this.size}x`;
    }
}
</script>
