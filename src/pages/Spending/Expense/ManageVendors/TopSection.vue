<template>
    <div>
        <b-row class="manage-vendors-top-section">
            <div class="manage-vendors-top-section__search">
                <b-col class="manage-vendors-top-section__search--container">
                    <font-awesome-icon icon="search" class="manage-vendors-top-section__search--icon" />
                    <BaseInputField
                        placeholder="Search"
                        class="search-input"
                        :value="searchStringValue"
                        @input="handleSearchInput"
                    />
                </b-col>
                <b-col class="manage-vendors-top-section__add-vendor-btn-mobile" @click="$emit('add-new-vendor')">
                    <PlusSign class="mr-1 pointer" />
                    <span class="manage-vendors-top-section__add-vendor-btn-mobile--text">
                        Add New
                    </span>
                </b-col>
            </div>

            <div class="manage-vendors-top-section__add-vendor-btn">
                <BaseButton
                    :overRideButtonClass="true"
                    className="add-vendor-btn"
                    buttonText="Add Vendor"
                    @button-clicked="$emit('add-new-vendor')"
                />
            </div>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import PlusSign from '@/components/ui/PlusSign.vue';

@Component({
    components: {
        PlusSign,
    },
})
export default class VendorTopSection extends Vue {
    @Prop({ default: '' }) readonly searchStringValue!: string;

    private handleSearchInput(searchStringInput: string) {
        this.$emit('search-string-changed', searchStringInput);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/spending/expenses/manage-vendors/top-section';
</style>
