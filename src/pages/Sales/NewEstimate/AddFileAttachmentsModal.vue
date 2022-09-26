<template>
    <b-modal :id="id" no-close-on-backdrop class="add-file-attachments-modal">
        <template v-slot:modal-header="{ cancel }">
            <div class="add-file-attachments-modal__header">
                <h1 class="add-file-attachments-modal__header-text">
                    <span class="add-file-attachments-modal__header-text--grey"> File Attachments </span>- Ankara Wear
                </h1>
                <span @click="cancel()" class="add-file-attachments-modal__cancel-btn">X</span>
            </div>
        </template>
        <b-container>
            <b-row class="add-file-attachments-modal__table-header">
                <b-col cols="5" class="add-file-attachments-modal__table-heading-text">
                    File Name
                </b-col>

                <b-col cols="4" class="add-file-attachments-modal__table-heading-text">
                    Type
                </b-col>

                <b-col cols="2" class="add-file-attachments-modal__table-heading-text">
                    Size(KB)
                </b-col>
            </b-row>
            <b-row class="add-file-attachments-modal__table-body">
                <b-col cols="5" class="add-file-attachments-modal__table-body-text">
                    Further Descriptions.txt
                </b-col>

                <b-col cols="4" class="add-file-attachments-modal__table-body-text">
                    Text File
                </b-col>

                <b-col cols="2" class="add-file-attachments-modal__table-body-text">
                    500
                </b-col>
                <b-col cols="1" class="add-file-attachments-modal__table-body-text">
                    <img src="@/assets/img/download-icon.svg" class="add-file-attachments-modal__download-icon" />
                </b-col>
            </b-row>
        </b-container>
        <template v-slot:modal-footer>
            <div></div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class AddFileAttachmentModal extends Vue {
    @Prop({ required: true }) readonly id!: string;
}
</script>

<style lang="scss">
.add-file-attachments-modal {
    width: 600px;
    &__header-text {
        font-size: 16px;
        color: $primary-black;
        &--grey {
            color: $dark-grey-1;
        }
    }
    &__cancel-btn {
        position: absolute;
        right: 13px;
        font-size: 12px;
        top: 6%;
        cursor: pointer;
        color: $dark-grey-1;
    }
    &__table-header {
        background: rgba(190, 188, 188, 0.47);
        border-radius: 4px;
        padding: 8px;
    }
    &__table-body {
        padding: 20px 8px 10px 8px;
        border-bottom: 1px solid $faint-grey;
    }
    &__table-heading-text {
        font-weight: 500;
    }
    &__table-heading-text,
    &__table-body-text {
        font-size: 14px;
    }
    &__download-icon {
        cursor: pointer;
    }
}
</style>
