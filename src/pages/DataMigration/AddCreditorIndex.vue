<template>
    <div>
        <keep-alive>
            <transition name="fade" mode="out-in">
                <component
                    :is="componentList[activeComponentIndex]"
                    :activeComponentIndex="activeComponentIndex"
                    :creditorList="creditorList"
                    :creditorToBeEdited="creditorToBeEdited"
                    :isEditing="isEditing"
                    @added-creditor="handleCreditorAddition"
                    @edited-creditor="creditorHasBeenEdited"
                    @delete-creditor-details="deleteCreditorFromList"
                    @proceed-to-the-next-section="handleNextButtonClick"
                    @skip-text-has-been-clicked="handleSkip"
                    @edit-add-creditor="getCreatorDetails"
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

import DynamicComponentMixin from '@/mixins/dynamicComponents';
import AddCreditor from '@/pages/DataMigration/AddCreditor.vue';
import AddCreditorForm from '@/pages/DataMigration/AddCreditorForm.vue';
import { Creditor, CreditorDetails, CreditorList } from '@/pages/DataMigration/types';

@Component({ components: { AddCreditor, AddCreditorForm } })
export default class AddCreditorIndex extends Mixins(
    UtilityMixins,
    CurrencyMixin,
    ValidationMixin,
    DynamicComponentMixin,
) {
    @Prop({ default: () => [] }) readonly creditorList!: Array<Creditor>;
    @Prop({ default: false }) readonly isEditing!: boolean;
    @Prop({ required: true }) readonly creditorToBeEdited!: Creditor;

    //    private creditorToBeEdited!: Creditor;

    private componentList: object[] = [AddCreditorForm, AddCreditor];

    handleCreditorAddition(creditorDetails: CreditorList) {
        this.$emit('added-creditor', creditorDetails);
        this.setActiveComponentIndex(1);
    }
    creditorHasBeenEdited(editedCreditorDetails: CreditorList) {
        this.setActiveComponentIndex(1);
        this.$emit('edited-creditor', editedCreditorDetails);
    }
    deleteCreditorFromList(index: number) {
        this.$emit('delete-creditor', index);
    }
    getCreatorDetails(creditorDetails: CreditorDetails) {
        this.setActiveComponentIndex(0);
        this.$emit('edit-add-creditor-modal', creditorDetails);
    }

    handleNextButtonClick() {
        this.setActiveComponentIndex(0);
    }

    get skipText(): string {
        return this.creditorList.length >= 1 || this.isEditing ? 'Cancel' : 'Skip';
    }

    private handleSkip(skipText: string) {
        skipText === 'Cancel' ? this.setActiveComponentIndex(1) : this.$emit('skip-text-has-been-clicked');
    }

    beforeMount() {
        this.creditorList.length >= 1 && !this.isEditing
            ? this.setActiveComponentIndex(1)
            : this.setActiveComponentIndex(0);
    }
}
</script>
