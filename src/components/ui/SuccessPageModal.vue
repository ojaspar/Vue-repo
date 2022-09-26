<template>
    <b-modal id="success-page-modal" size="lg" no-close-on-backdrop @hidden="handleCloseOfSuccessPageModal">
        <template v-slot:modal-header>
            <div></div>
        </template>
        <div class="success">
            <div class="success__icon-container">
                <img class="success__icon" src="@/assets/img/success-icon.svg" alt="Mzuri success icon" />
            </div>
            <p class="success__message">{{ successPageMessage }}</p>
            <div class="success__button-container">
                <div
                    class="success__btn pointer"
                    v-if="navigationPathOnSuccess !== ''"
                    @click="handleCloseOfSuccessPageModal"
                >
                    {{ successPageButtonText }}
                </div>
            </div>
        </div>
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class SuccessPageModal extends Vue {
    @Prop({ required: true }) readonly successPageButtonText!: string;
    @Prop({ required: true }) readonly successPageMessage!: string;
    @Prop({ default: '' }) readonly navigationPathOnSuccess!: string;

    public mounted() {
        this.$bvModal.show('success-page-modal');
    }

    public handleCloseOfSuccessPageModal() {
        this.$emit('success-modal-button-clicked');
        if (this.navigationPathOnSuccess !== '') this.$router.push({ path: this.navigationPathOnSuccess });
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/success-page-modal';
</style>
