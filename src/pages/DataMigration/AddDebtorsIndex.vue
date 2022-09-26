<template>
    <div>
        <keep-alive>
            <transition name="fade" mode="out-in">
                <!-- @edited-creditor="creditorHasBeenEdited" -->

                <component
                    :is="componentList[activeComponentIndex]"
                    :activeComponentIndex="activeComponentIndex"
                    :isEditing="isEditing"
                    :debtorToBeEdited="debtorToBeEdited"
                    @added-debtor="handleDebtorAddition"
                    @delete-debtor="deleteDebtorFromList"
                    @edited-debtor="debtorHasBeenEdited"
                    :debtorList="debtorList"
                    @skip-text-has-been-clicked="handleSkip"
                    @proceed-to-the-next-section="handleNextButtonClick"
                    @edit-add-debtor="handleEditAddDebtor"
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
import { Debtor, DebtorList } from '@/pages/DataMigration/types';
import AddDebtorForm from '@/pages/DataMigration/AddDebtorForm.vue';
import AddDebtor from '@/pages/DataMigration/AddDebtor.vue';

@Component
export default class AddDebtorIndex extends Mixins(
    UtilityMixins,
    CurrencyMixin,
    ValidationMixin,
    DynamicComponentMixin,
) {
    @Prop({ required: true }) readonly debtorToBeEdited!: Debtor;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ default: () => [] }) readonly debtorList!: Array<Debtor>;

    private componentList: object[] = [AddDebtorForm, AddDebtor];

    debtorHasBeenEdited(editedDebtorDetails: DebtorList) {
        this.$emit('edited-debtor', editedDebtorDetails);
        this.setActiveComponentIndex(1);
    }
    deleteDebtorFromList(index: number) {
        this.$emit('delete-debtor', index);
    }
    handleDebtorAddition(debtorDetails: DebtorList) {
        this.$emit('added-debtor', debtorDetails);
        this.setActiveComponentIndex(1);
    }
    handleNextButtonClick() {
        this.setActiveComponentIndex(0);
    }

    handleEditAddDebtor(editedDebtorDetails: DebtorList) {
        this.setActiveComponentIndex(0);
        this.$emit('edit-add-debtor', editedDebtorDetails);
    }

    get skipText(): string {
        return this.debtorList.length >= 1 || this.isEditing ? 'Cancel' : 'Skip';
    }

    private handleSkip(skipText: string) {
        skipText === 'Cancel' ? this.setActiveComponentIndex(1) : this.$emit('skip-text-has-been-clicked');
    }

    beforeMount() {
        this.debtorList.length >= 1 && !this.isEditing
            ? this.setActiveComponentIndex(1)
            : this.setActiveComponentIndex(0);
    }
}
</script>
