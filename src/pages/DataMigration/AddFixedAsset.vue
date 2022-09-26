<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
        buttonText="Add New Asset"
        SkipText="Next"
    >
        <div>
            <div class="setup-add-entity__entity-title-list-section">
                <h1
                    class="setup-add-entity__right-side-heading setup-add-entity__right-side-heading--grey setup-add-entity__add-bank-heading"
                >
                    {{ headingText }}
                </h1>
                <div class="setup-add-entity__list-section" v-for="(asset, index) in assetList" :key="index">
                    <div @click="$emit('edit-add-fixed-asset', { asset, index })">
                        <p class="setup-add-entity__delete-edit-section">
                            <span class="setup-add-entity__list-name">
                                {{ asset.assetName }}
                            </span>
                            <br />
                            <span class="setup-add-entity__list-amount"
                                >{{ getCurrencySymbolFromCurrencyKey(asset.currentValue.currencyKey.toString()) }}
                                {{ asset.currentValue.amount | formatMoney }}</span
                            >
                        </p>
                        <span class="setup-add-entity__asset-type">
                            {{ asset.assetTypeText }}
                        </span>
                    </div>

                    <div @click="$emit('delete-asset', index)">
                        <img src="@/assets/img/carbon_delete.svg" alt="delete" />
                    </div>
                </div>
                <!-- <div class="setup-add-entity__add-entity-button" v-if="!assetList.length">
                    <AddNewEntityWithPlusIconButton
                        buttonText="Add Fixed Asset"
                        @button-clicked="$emit('add-fixed-asset-btn-clicked')"
                    />
                </div> -->
            </div>
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';

import { AssetList } from '@/pages/DataMigration/types';

import CurrencyMixins from '@/mixins/currency';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddFixedAsset extends Mixins(CurrencyMixins) {
    @Prop({ default: () => [] }) readonly assetList!: Array<AssetList>;

    get headingText() {
        return this.assetList.length === 0 ? 'Add your Fixed Assets' : 'List of Assets';
    }

    public handleNextButtonClick() {
        this.$nextTick(() => {
            this.$emit('proceed-to-the-next-section', { key: 'assetList', value: this.assetList });
        });
    }
}
</script>

<style lang="scss">
@include data-migration-setup-add-entity;
</style>
