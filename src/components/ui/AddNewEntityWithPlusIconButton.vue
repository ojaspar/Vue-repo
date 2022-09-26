<template>
    <BaseButton
        @button-clicked="$emit('button-clicked')"
        :buttonText="buttonText"
        :overRideButtonClass="true"
        :class="buttonTextClass"
    >
        <CircularPlusSign v-if="!icon" />
        <img class="alternative-icon" :src="icon" alt="alternative icon" v-else />
    </BaseButton>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class AddNewEntityWithPlusIconButton extends Vue {
    @Prop({ required: true }) readonly buttonText!: string;
    @Prop({ default: '' }) readonly icon!: string;
    @Prop({ default: 'default-button-text-class' }) readonly buttonTextClass!: string;
}
</script>

<style lang="scss">
@import 'src/styles/components/add-new-entity-with-plus-icon-button.scss';
</style>
