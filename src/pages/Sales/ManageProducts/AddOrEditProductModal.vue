<template>
    <b-container>
        <b-modal id="new-product-form" no-close-on-backdrop @hide="$emit('reset-product-form-modal')">
            <template v-slot:modal-header>
                <div class="new-product-form__heading">
                    <h2 class="new-product-form__heading--text ">{{ ModalTitle }}</h2>
                    <span class="close-btn pointer" title="Cancel" @click="hideModal">
                        &times;
                    </span>
                </div>
            </template>

            <AddOrEditProductForm
                :searchedProduct="searchedProduct"
                :productIsEditing="productIsEditing"
                :productToBeEdited="productToBeEdited"
                @new-product-added="dismissModal"
                @existing-product-updated="handleProductUpdateCompletion"
            />
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import AddOrEditProductForm from '@/pages/Sales/AddOrEditProductForm.vue';

import { Product, defaultProduct } from '@/pages/Sales/types';

@Component({
    components: {
        AddOrEditProductForm,
    },
})
export default class NewProductForm extends Vue {
    @Prop({ default: '' }) readonly searchedProduct!: string;
    @Prop({ default: false }) readonly productIsEditing!: boolean;
    @Prop({ default: () => defaultProduct }) readonly productToBeEdited!: Product;

    get ModalTitle() {
        return this.productIsEditing ? 'Edit Product' : 'Add Product';
    }

    private hideModal() {
        this.$bvModal.hide('new-product-form');
    }

    private dismissModal() {
        setTimeout(() => {
            this.hideModal();
        }, 1500);
    }

    private handleProductUpdateCompletion() {
        this.dismissModal();
        this.$emit('update-product-list');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/product-management/add-new-product-form';
</style>
