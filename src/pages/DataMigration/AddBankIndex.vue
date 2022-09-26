<template>
    <div>
        <keep-alive>
            <transition name="fade" mode="out-in">
                <component
                    :is="componentList[activeComponentIndex]"
                    :activeComponentIndex="activeComponentIndex"
                    :bankAccountToBeEdited="bankAccountToBeEdited"
                    :isEditing="isEditing"
                    :indexOfBankAccountObjectToBeEdited="indexOfBankAccountObjectToBeEdited"
                    :bankAccountList="bankAccountList"
                    @add-bank-account-btn-clicked="handleAddBankAccountClick"
                    @skip-text-has-been-clicked="handleSkip"
                    @added-bank-list="handleBankAddition"
                    @proceed-to-the-next-section="handleSuccessfulClickOfTheNextButton"
                    @edit-bank-account-details="handleEditOfBankAccount"
                    @edit-bank-list="bankAccountHasBeenEdited"
                    @delete-bank-from-list="deleteBankFromList"
                    @delete-bank-details="deleteBank"
                    :skipText="skipText"
                />
            </transition>
        </keep-alive>
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import UtilityMixins from '@/mixins/Utility';
import ValidationMixin from '@/mixins/validation';
import CurrencyMixin from '@/mixins/currency';
import AddAccountBalance from '@/pages/DataMigration/AddAccountBalance.vue';
import AddBankForm from '@/pages/DataMigration/AddBankForm.vue';
import { BankAccount, BankAccountDetails, BankAccountList } from '@/pages/DataMigration/types';
import DynamicComponentMixin from '@/mixins/dynamicComponents';

const bankAccountListDefault: Array<BankAccountList> = [];

@Component({ components: { AddAccountBalance, AddBankForm } })
export default class AddBankIndex extends Mixins(UtilityMixins, CurrencyMixin, ValidationMixin, DynamicComponentMixin) {
    // @Prop({ required: true }) readonly id!: string;
    @Prop({ required: true }) readonly bankAccountToBeEdited!: BankAccount;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: 0 }) readonly indexOfBankAccountObjectToBeEdited!: number;
    @Prop({ default: bankAccountListDefault }) readonly bankAccountList!: Array<BankAccountList>;
    // private activeComponentIndex = 0;

    private componentList: object[] = [AddBankForm, AddAccountBalance];

    handleAddBankAccountClick() {
        this.setActiveComponentIndex(0);
    }

    public handleBankAddition(bankAccountDetails: BankAccountList) {
        this.setActiveComponentIndex(1);
        this.$emit('new-added-bank-details', bankAccountDetails);
    }
    private handleSuccessfulClickOfTheNextButton({ key, value }: { key: string; value: string | object | number }) {
        this.$nextTick(() => {
            this.$emit('proceed-to-the-next-section', { key: 'bankAccountList', value: this.bankAccountList });
        });
    }
    private bankAccountHasBeenEdited(editedAccountDetails: BankAccountList) {
        this.$emit('edit-bank-list', editedAccountDetails);
        this.setActiveComponentIndex(1);
    }

    private handleEditOfBankAccount(bankAccountDetails: BankAccountDetails) {
        this.$emit('edit-bank-account', bankAccountDetails);
        this.setActiveComponentIndex(0);
    }

    private deleteBankFromList(index: number) {
        this.$emit('delete-bank-from-list', index);
    }
    private deleteBank(index: number) {
        this.$emit('delete-bank-details', index);
    }

    get skipText(): string {
        return this.bankAccountList.length >= 1 || this.isEditing ? 'Cancel' : 'Skip';
    }
    private handleSkip(skipText: string) {
        skipText === 'Cancel' ? this.setActiveComponentIndex(1) : this.$emit('skip-text-has-been-clicked');
    }
    beforeMount() {
        this.bankAccountList.length >= 1 && !this.isEditing
            ? this.setActiveComponentIndex(1)
            : this.setActiveComponentIndex(0);
    }
}
</script>

<style></style>
