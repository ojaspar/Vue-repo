<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
        buttonText="Add New Creditor"
        SkipText="Next"
    >
        <div>
            <div class="setup-add-entity__add-entity-button--entity-added" v-if="creditorList.length > 0">
                <!-- <AddNewEntityWithPlusIconButton
                    buttonText="Add Creditor"
                    @button-clicked="$emit('add-creditor-btn-clicked')"
                    buttonTextClass="setup-add-entity__add-entity-btn"
                /> -->
            </div>

            <div class="setup-add-entity__entity-title-list-section">
                <h1
                    class="setup-add-entity__right-side-heading setup-add-entity__right-side-heading--grey setup-add-entity__add-bank-heading"
                >
                    {{ headingText }}
                </h1>
                <div class="setup-add-entity__list-section" v-for="(creditor, index) in creditorList" :key="index">
                    <div @click="$emit('edit-add-creditor', { creditor, index })">
                        <p class="setup-add-entity__delete-edit-section">
                            <span class="setup-add-entity__list-name">
                                {{ creditor.name }}
                            </span>
                            <br />
                            <span class="setup-add-entity__list-amount"
                                >{{ getCurrencySymbolFromCurrencyKey(creditor.amountOwed.currencyKey.toString()) }}
                                {{ creditor.amountOwed.amount | formatMoney }}</span
                            >
                        </p>
                        <span class="setup-add-entity__creditor-type"> {{ creditor.creditorType }}</span>
                    </div>

                    <div @click="deleteCreditorFromList(index)">
                        <img src="@/assets/img/carbon_delete.svg" alt="delete" />
                    </div>
                </div>
                <!-- <div class="setup-add-entity__add-entity-button" v-if="!creditorList.length">
                    <AddNewEntityWithPlusIconButton
                        buttonText="Add Creditor"
                        @button-clicked="$emit('add-creditor-btn-clicked')"
                    />
                </div> -->
            </div>
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';
import { Creditor } from '@/pages/DataMigration/types';

import CurrencyMixins from '@/mixins/currency';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddCreditor extends Mixins(CurrencyMixins) {
    @Prop({ default: () => [] }) readonly creditorList!: Array<Creditor>;

    get headingText() {
        return !this.creditorList.length ? 'Add your Creditors' : 'List of Creditors';
    }

    public handleNextButtonClick() {
        // override the previous value of creditorList
        this.$nextTick(() => {
            this.$emit('proceed-to-the-next-section', { key: 'creditorList', value: this.creditorList });
        });
    }
    deleteCreditorFromList(index: number) {
        this.$emit('delete-creditor-details', index);
    }
}
</script>

<style lang="scss">
@include data-migration-setup-add-entity;
</style>
