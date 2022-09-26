<template>
    <div :class="pictureWrapperClass">
        <div
            :class="[option.isSelected ? 'selected' : '', 'text-center picture-wrapper']"
            v-for="(option, index) in pictureSelectOptions"
            :key="option[optionKeyProperty] || index"
        >
            <div class="avatar avatar-xxl">
                <span v-if="removeMultipleItems" @click="handlePictureRemoval(index)" class="avatar-cancel-btn">X</span>
                <img
                    :src="option[imageProperty] || 'https://via.placeholder.com/500'"
                    :class="[
                        option[isActiveProperty] === undefined || option[isActiveProperty]
                            ? 'pointer'
                            : 'pointer-non-event',
                        'rounded-circle',
                    ]"
                    :alt="altProperty"
                    @click="handlePictureSelect(option)"
                />
            </div>
            <p class="text-center" v-text="option[nameProperty]" :class="textDisplayClass"></p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import { PictureSelectOptions } from '@/types';

@Component
export default class PictureSelect extends Vue {
    private disabled = false;
    private selectedItem: PictureSelectOptions = {};
    private selectedIndex = 0;

    @Prop({ default: '' }) readonly pictureWrapperClass!: string;
    @Prop({ default: '' }) readonly isActiveProperty!: string;
    @Prop({ default: '' }) readonly optionKeyProperty!: string;
    @Prop({ default: [] }) readonly pictureSelectOptions!: [PictureSelectOptions];
    @Prop({ default: undefined }) readonly keyProperty!: string;
    @Prop({ default: 'Mzuri Picture Select' }) readonly altProperty!: string;
    @Prop({ default: '' }) readonly nameProperty!: string;
    @Prop({ default: '' }) readonly imageProperty!: string;
    @Prop({ default: '' }) readonly textDisplayClass!: string;
    @Prop({ default: false }) readonly removeMultipleItems!: boolean;

    public handlePictureSelect(value: PictureSelectOptions) {
        this.$emit('picture-selected', value);
    }

    public handlePictureRemoval(value: PictureSelectOptions) {
        this.$emit('picture-removed', value);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/picture-select.scss';
</style>
