<template>
    <b-row>
        <b-col
            sm="12"
            md="4"
            class="tax-page-container__uploaded-file"
            v-for="(cacForm, index) in taxProfileForms"
            :key="cacForm"
            @click="openFile(cacForm)"
        >
            <div class="tax-page-container__uploaded-file--thumbnail">
                <img
                    src="@/assets/img/pdf-icon.svg"
                    class="tax-page-container__uploaded-file--icon tax-page-container__uploaded-file--pdf-icon"
                />
            </div>
            <div class="tax-page-container__uploaded-file--text-area">
                {{ cacFormTitles[index] }}
                <img src="@/assets/img/download-icon.svg" class="tax-page-container__uploaded-file--icon" />
            </div>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CACFilePreview extends Vue {
    @Prop({ required: true }) taxProfileForms!: Array<string>;

    private cacFormTitles = ['CAC Form 101', 'CAC Form 102', 'CAC Form 103'];

    private openFile(fileUrl: string) {
        window.open(fileUrl);
    }
}
</script>
