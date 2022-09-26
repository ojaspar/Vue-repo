<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="handleNextButtonClick"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
        buttonText="Add New Debtor"
        SkipText="Next"
    >
        <div>
            <div class="setup-add-entity__entity-title-list-section">
                <h1
                    class="setup-add-entity__right-side-heading setup-add-entity__right-side-heading--grey setup-add-entity__add-bank-heading"
                >
                    {{ debtorText }}
                </h1>
                <div class="setup-add-entity__list-section" v-for="(debtor, index) in debtorList" :key="index">
                    <div @click="$emit('edit-add-debtor', { debtor, index })">
                        <p class="setup-add-entity__delete-edit-section">
                            <span class="setup-add-entity__list-name">
                                {{ debtor.name }}
                            </span>
                            <br />

                            <span class="setup-add-entity__list-amount"
                                >{{ getCurrencySymbolFromCurrencyKey(debtor.amountOwed.currencyKey.toString()) }}
                                {{ debtor.amountOwed.amount | formatMoney }}</span
                            >
                        </p>
                        <span class="setup-add-entity__debtor-type"> {{ debtor.debtorType }}</span>
                    </div>

                    <div @click="$emit('delete-debtor', index)">
                        <img src="@/assets/img/carbon_delete.svg" alt="delete" />
                    </div>
                </div>
                <!-- <div class="setup-add-entity__add-entity-button" v-if="!debtorList.length">
                    <AddNewEntityWithPlusIconButton
                        buttonText="Add Debtor"
                        @button-clicked="$emit('add-debtor-btn-clicked')"
                    />
                </div> -->
            </div>
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';
import { Debtor } from '@/pages/DataMigration/types';

import CurrencyMixins from '@/mixins/currency';

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddDebtor extends Mixins(CurrencyMixins) {
    @Prop({ default: () => [] }) readonly debtorList!: Array<Debtor>;
    private debtor: Debtor = {
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        debtorType: '',
        amountOwed: {
            currencyKey: '',
            amount: 0,
        },
        expectedPaymentDate: '',
    };

    get debtorText() {
        return this.debtorList.length > 0 ? 'List of Debtors' : 'Add your Debtors';
    }

    public handleNextButtonClick() {
        // override the previous value of debtorList
        this.$nextTick(() => {
            this.$emit('proceed-to-the-next-section', { key: 'debtorList', value: this.debtorList });
        });
    }
}
</script>

<style lang="scss">
@include data-migration-setup-add-entity;
</style>
