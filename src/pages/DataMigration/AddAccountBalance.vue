<template>
    <NextButtonAndSkipText
        @next-button-has-been-clicked="$emit('add-bank-account-btn-clicked')"
        @skip-text-has-been-clicked="$emit('skip-text-has-been-clicked')"
        buttonText="Add New Bank"
        SkipText="Next"
    >
        <div>
            <div class="setup-add-entity__entity-title-list-section">
                <h1
                    class="setup-add-entity__right-side-heading setup-add-entity__right-side-heading--grey setup-add-entity__add-bank-heading"
                >
                    {{ headingText }}
                </h1>
                <div
                    class="setup-add-entity__list-section"
                    v-for="(bankAccount, index) in bankAccountList"
                    :key="index"
                >
                    <div @click="$emit('edit-bank-account-details', { bankAccount, index })">
                        <p class="setup-add-entity__bank-name">{{ bankAccount.bankName }}</p>
                        <p class="setup-add-entity__account-number">{{ bankAccount.accountNumber }}</p>
                        <p class="setup-add-entity__list-name">{{ bankAccount.accountName }}</p>
                        <p class="setup-add-entity__list-amount">
                            {{ getCurrencySymbolFromCurrencyKey(bankAccount.accountBalance.currencyKey.toString()) }}
                            {{ bankAccount.accountBalance.amount | formatMoney }}
                        </p>
                    </div>
                    <div @click="deleteBank(index)">
                        <img src="@/assets/img/carbon_delete.svg" alt="delete" />
                    </div>
                </div>
                <!-- <div class="setup-add-entity__add-entity-button">
                    <AddNewEntityWithPlusIconButton
                        buttonText="Add Bank Account"
                        @button-clicked="$emit('add-bank-account-btn-clicked')"
                    />
                </div> -->
            </div>
        </div>
    </NextButtonAndSkipText>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import NextButtonAndSkipText from '@/pages/DataMigration/NextButtonAndSkipText.vue';
import { BankAccountList } from '@/pages/DataMigration/types';

import CurrencyMixin from '@/mixins/currency';

const bankAccountListDefault: Array<BankAccountList> = [];

@Component({
    components: {
        NextButtonAndSkipText,
    },
})
export default class AddAccountBalance extends Mixins(CurrencyMixin) {
    @Prop({ default: bankAccountListDefault }) readonly bankAccountList!: Array<BankAccountList>;

    get headingText() {
        return this.bankAccountList.length === 0 ? 'Add your Bank Account' : 'List Of Banks';
    }

    public handleNextButtonClick() {
        this.$nextTick(() => {
            this.$emit('proceed-to-the-next-section', { key: 'bankAccountList', value: this.bankAccountList });
        });
    }
    deleteBank(index: number) {
        this.$emit('delete-bank-details', index);
    }
}
</script>

<style lang="scss">
@include data-migration-setup-add-entity;
</style>
