<template>
    <div :class="inputContainerClass">
        <input
            type="checkbox"
            :id="id"
            :checked="value"
            @change="$emit('change', $event.target.checked)"
            :class="className"
            :disabled="disabled"
        />
        <label :class="labelClass" :for="id">{{ labelText }}</label>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseCheckbox extends Vue {
    @Prop({ default: '' }) readonly inputContainerClass!: string;
    @Prop({ required: true }) readonly id!: string;
    @Prop({ default: '' }) readonly labelText!: string;
    @Prop({ default: '' }) readonly labelClass!: string;
    @Prop({ default: '' }) readonly value!: string;
    @Prop({ default: '' }) readonly className!: string;
    @Prop({ default: false }) readonly disabled!: boolean;
}
</script>

<style lang="scss"></style>
