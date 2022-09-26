<template>
    <div>
        <div class="product-management-top-section">
            <div class="product-management-top-section__search">
                <span class="product-management-top-section__search--container">
                    <font-awesome-icon
                        icon="search"
                        class="product-management-top-section__search--icon left-search-icon"
                    />
                    <BaseInputField placeholder="Search" class="search-input" @input="handleSearchInput" />
                </span>
                <span class="right-search-icon">
                    <font-awesome-icon icon="search" class="product-management-top-section__search--icon" />
                </span>
            </div>

            <div class="product-management-top-section__add-product-btn">
                <BasePrimaryButton buttonText="Add Product" @button-clicked="$emit('add-new-product')" />
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
export default class ProductTopSection extends Vue {
    private handleSearchInput(searchStringInput: string) {
        this.$emit('search-string-changed', searchStringInput);
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/top-section';
</style>
