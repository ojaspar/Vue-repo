<template>
    <b-modal :id="id" size="xl" no-close-on-backdrop>
        <template v-slot:modal-header="{ cancel }">
            <div class="expense-dashboard__vendor-selection-modal-header-container">
                <h3 class="expense-dashboard__vendor-selection-modal-header-text">
                    Select Vendor -
                    <span class="expense-dashboard__vendor-selection-modal-expense-text">{{ expenseItem.name }}</span
                    ><span class="expense-dashboard__vendor-selection-modal-vendor-name" v-if="expenseItem.vendor"
                        >[{{ expenseItem.vendor }}]</span
                    >
                </h3>
                <span @click="cancel()" class="expense-dashboard__vendor-selection-modal-cancel-btn">X</span>
            </div>
        </template>
        <DualEntitySelection
            :topEntityPictureSelectOptions="recentVendors"
            :bottomEntityPictureSelectOptions="allVendors"
            :dualEntityHeaderPresent="false"
            :conditionForDualEntitySectionToNotShow="!allVendors.length"
            noEntityMainHeading="You don't have any vendors"
            noEntitySubHeading="Looks like you haven't added any vendors"
            noEntityButtonText="Add New Vendor"
            entitySearchPlaceholder="Click to select a vendor below or enter vendor name to search"
            :entitySearchIcon="require('@/assets/img/customer-avatar.svg')"
            entitySearchAddText="Add New Vendor"
            topEntityImageProperty="imageUrl"
            bottomEntityImageProperty="imageUrl"
            :conditionForTopEntitySectionToNotShow="recentVendors.length > 0"
            topEntitySectionHeading="Recent Vendors"
            :numberOfTopEntitySectionItems="recentVendors.length"
            @picture-selected="handleVendorSelection"
            @button-clicked="handleVendorSelectionButtonClick"
            bottomEntitySectionHeading="All Vendors"
            :numberOfBottomEntitySectionItems="allVendors.length"
            :conditionForButtonToBeDisabled="!selectedVendor.name"
            :vendorSelectionModal="true"
            @select-vendor-for-all-expenses-changed="handleSelectVendorForAllExpenses"
        />
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

import DualEntitySelection from '@/components/ui/DualEntitySelection.vue';

import PlusSign from '@/components/ui/PlusSign.vue';

import twoPieceSuit from '@/assets/img/person-1.jpg';
import threePieceSuit from '@/assets/img/person-2.jpg';
import blueOrangesShirt from '@/assets/img/person-3.jpg';
import fluffyEyedMonsterShirt from '@/assets/img/person-4.jpg';
import burgundyShirt from '@/assets/img/person-5.jpg';
import mountainTShirt from '@/assets/img/person-6.jpg';
import QuickSilverTShirt from '@/assets/img/person-7.jpg';
import SummerTShirt from '@/assets/img/person-8.jpg';
import TrendyTShirt from '@/assets/img/person-9.jpg';
import Trouser from '@/assets/img/person-10.jpg';
import PinkTShirt from '@/assets/img/person-11.jpg';
import secondPinkTShirt from '@/assets/img/person-12.jpg';

import PictureSelect from '@/components/ui/PictureSelect.vue';

import { PictureSelectOptions } from '@/types';

@Component({
    components: {
        PlusSign,
        PictureSelect,
        DualEntitySelection,
    },
})
export default class VendorSelectionModal extends Vue {
    private recentVendors = [];
    private selectedVendor = {};
    private allVendors = [
        {
            name: 'Scott McTominay & Sons Ltd',
            imageUrl: QuickSilverTShirt,
        },
        {
            name: 'Abigail Murray & daughter Ltd',
            imageUrl: SummerTShirt,
        },
        {
            name: 'Wendy Scott & daughters Ltd',
            imageUrl: TrendyTShirt,
        },
        {
            name: 'Jennifer Lawrence Ltd',
            imageUrl: Trouser,
        },
        {
            name: 'Vera Keetel Ltd',
            imageUrl: PinkTShirt,
        },
        {
            name: 'Leogratious Price Ltd',
            imageUrl: secondPinkTShirt,
        },
        {
            name: 'Adam Lallana',
            imageUrl: twoPieceSuit,
        },
        {
            name: 'Katie Holmes',
            imageUrl: threePieceSuit,
        },
        {
            name: 'Tom Cruise Inc.',
            imageUrl: blueOrangesShirt,
        },
        {
            name: 'Kay Rodriguez co',
            imageUrl: fluffyEyedMonsterShirt,
        },
        {
            name: 'Jim Prescott Ltd',
            imageUrl: burgundyShirt,
        },
        {
            name: 'Jake Gallagher & co',
            imageUrl: mountainTShirt,
        },
    ];

    public handleVendorSelection(selectedVendor: PictureSelectOptions) {
        this.selectedVendor = selectedVendor;
        this.$emit('vendor-selected', selectedVendor);
    }

    public handleVendorSelectionButtonClick() {
        this.$emit('add-vendor-modal-btn-clicked');
    }

    public handleSelectVendorForAllExpenses(value: boolean) {
        this.$emit('select-vendor-for-all-expenses-changed', value);
    }

    @Prop({ default: { key: '' } }) readonly expenseItem!: PictureSelectOptions;
    @Prop() readonly id!: string;
}
</script>

<style lang="scss"></style>
