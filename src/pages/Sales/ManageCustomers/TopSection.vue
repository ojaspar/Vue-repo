<template>
    <div>
        <div class="manage-customer-top-section">
            <div class="manage-customer-top-section__search">
                <span class="manage-customer-top-section__search--container">
                    <font-awesome-icon
                        icon="search"
                        class="manage-customer-top-section__search--icon left-search-icon"
                    />
                    <BaseInputField placeholder="Search" class="search-input" @input="handleSearchInput" />
                </span>
                <span class="right-search-icon">
                    <font-awesome-icon icon="search" class="manage-customer-top-section__search--icon" />
                </span>
            </div>

            <div class="manage-customer-top-section__add-customer-btn">
                <BasePrimaryButton buttonText="Add Customer" @button-clicked="$emit('add-new-customer')" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import PlusSign from '@/components/ui/PlusSign.vue';

@Component({
    components: {
        PlusSign,
    },
})
export default class CustomerTopSection extends Vue {
    private handleSearchInput(searchStringInput: string) {
        this.$emit('search-string-changed', searchStringInput);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/sales/customer-management/top-section';
</style>
