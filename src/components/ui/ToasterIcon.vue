<template>
    <font-awesome-icon :icon="iconName" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Toaster extends Vue {
    @Prop({ default: '' }) readonly iconName!: string;
}
</script>
