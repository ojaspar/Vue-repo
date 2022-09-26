<template>
    <div>
        <keep-alive>
            <transition name="fade" mode="out-in">
                <!-- @edited-creditor="creditorHasBeenEdited" -->

                <component
                    :is="componentList[activeComponentIndex]"
                    :activeComponentIndex="activeComponentIndex"
                    :isEditing="isEditing"
                    @added-fixed-asset="handleAssetAddition"
                    @delete-asset="deleteAssetFromList"
                    :assetList="assetList"
                    @skip-text-has-been-clicked="handleSkip"
                    @proceed-to-the-next-section="handleNextButtonClick"
                    :assetToBeEdited="assetToBeEdited"
                    @edit-add-fixed-asset="handledEditFixedAsset"
                    @edited-fixed-asset="handleEditedFixedAsset"
                    :skipText="skipText"
                />
            </transition>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';
import CurrencyMixin from '@/mixins/currency';

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import { Asset, AssetDetails, AssetList } from '@/pages/DataMigration/types';

import AddFixedAssetForm from '@/pages/DataMigration/AddFixedAssetForm.vue';
import AddFixedAsset from '@/pages/DataMigration/AddFixedAsset.vue';

@Component
export default class AddAssetIndex extends Mixins(
    UtilityMixins,
    CurrencyMixin,
    ValidationMixin,
    DynamicComponentMixin,
) {
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: () => [] }) readonly assetList!: Array<AssetList>;
    @Prop({ required: true }) readonly assetToBeEdited!: Asset;

    private componentList: object[] = [AddFixedAssetForm, AddFixedAsset];
    deleteAssetFromList(index: number) {
        this.$emit('delete-asset', index);
    }
    handleAssetAddition(assetDetails: AssetList) {
        this.$emit('added-fixed-asset', assetDetails);
        this.setActiveComponentIndex(1);
    }
    handleNextButtonClick() {
        this.setActiveComponentIndex(0);
    }
    handledEditFixedAsset(assetDetails: AssetDetails) {
        this.setActiveComponentIndex(0);
        this.$emit('edit-add-fixed-asset', assetDetails);
    }
    handleEditedFixedAsset(editedAssetDetails: AssetList) {
        this.setActiveComponentIndex(1);
        this.$emit('edited-fixed-asset', editedAssetDetails);
    }

    get skipText(): string {
        return this.assetList.length >= 1 || this.isEditing ? 'Cancel' : 'Skip';
    }

    private handleSkip(skipText: string) {
        skipText === 'Cancel' ? this.setActiveComponentIndex(1) : this.$emit('skip-text-has-been-clicked');
    }

    beforeMount() {
        this.assetList.length >= 1 && !this.isEditing
            ? this.setActiveComponentIndex(1)
            : this.setActiveComponentIndex(0);
    }
}
</script>
