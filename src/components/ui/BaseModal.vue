<template>
    <b-container>
        <b-modal
            :id="modalId"
            @hide="closeModal"
            :no-close-on-backdrop="noCloseOnBackdrop"
            :footer-class="hideDefaultFooterClass"
            :modal-class="modalClass"
            :dialog-class="dialogClass"
            :header-class="headerClass"
        >
            <template v-slot:modal-header>
                <h2 class="base-modal__heading-title ">{{ modalTitle }}</h2>
                <span class="base-modal__close-btn pointer" title="Close" @click="closeModal">
                    &times;
                </span>
            </template>
            <slot />
            <slot name="modal-footer"></slot>
        </b-modal>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseModal extends Vue {
    @Prop({ required: true }) modalTitle!: string;
    @Prop({ required: true }) modalId!: string;
    @Prop({ default: true }) noCloseOnBackdrop!: string;
    @Prop({ default: true }) hideDefaultFooter!: string;
    @Prop({ default: false }) fullScreen!: boolean;

    get dialogClass(): string {
        return this.fullScreen ? 'full-screen-modal-dialog' : '';
    }

    get modalClass(): string {
        return this.fullScreen ? 'full-screen-modal' : '';
    }

    get headerClass(): string {
        return this.fullScreen ? 'd-none' : '';
    }

    get hideDefaultFooterClass(): string {
        return this.hideDefaultFooter ? 'd-none' : '';
    }

    private closeModal() {
        this.$emit('hide-modal', this.modalId);
    }
}
</script>

<style lang="scss">
@import 'src/styles/components/base-modal';
</style>
