<template>
    <div>
        <b-row>
            <b-col>
                <BaseFileInputWithBorderAndFloatingLabel
                    :fileUploadText="fileUploadText"
                    id="companyLogo"
                    :emitEventObject="true"
                    :showFileUploadText="true"
                    @input="processSelectedFile($event)"
                />
            </b-col>
        </b-row>

        <BlockErrorMessage :message="logoUploadError" />

        <b-row>
            <b-col>
                <BasePrimaryButton
                    buttonText="Upload"
                    class="mr-auto ml-auto"
                    @button-clicked="uploadFileToServer"
                    :status="companyLogoRequest.uploadLogo"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import GeneralModule from '@/store/modules/general';

import ImageFileMixin from '@/mixins/ImageFile';

import { Status, CompanyLogoRequest, CompanyInfo } from '@/types';
const general = namespace('general');
let generalModule: GeneralModule;

const defaultFileUploadText = 'kindly upload your company logo here';

@Component
export default class LogoUpload extends Mixins(ImageFileMixin) {
    private fileUploadText = defaultFileUploadText;
    private selectedLogoFile = {};
    private maxFileSize = 2048 * 2048;
    private logoUploadError = '';

    @general.State
    private companyLogoRequest!: CompanyLogoRequest;

    @general.State
    private companyInfo!: CompanyInfo;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processSelectedFile(event: any) {
        const file = event.target.files;
        this.fileUploadText = event.target.value;

        if (file.length < 1) return;
        const imageFile = file[0];

        if (!this.isValidImageFile(imageFile)) {
            this.companyInfo.logo = '';
            return;
        }

        this.selectedLogoFile = imageFile;
    }

    private isValidImageFile(imageFile: File): boolean {
        this.logoUploadError = this.validateImageFile(imageFile, this.maxFileSize);

        return this.logoUploadError.length === 0;
    }

    private uploadFileToServer() {
        // if the text hasn't changed, then the user hasn't uploaded a file yet
        if (this.fileUploadText === defaultFileUploadText) {
            this.logoUploadError = 'Please select a file first';
            return;
        }

        this.logoUploadError = '';

        const formDatalogoFile = this.convertImageFileToFormData(this.selectedLogoFile);

        this.uploadCompanyLogo(formDatalogoFile);
    }

    private async uploadCompanyLogo(formDatalogoFile: object) {
        await generalModule.uploadLogo(formDatalogoFile);

        if (this.companyLogoRequest.uploadLogo === Status.SUCCESS) {
            this.$emit('file-uploaded', this.companyInfo.logo);

            this.fileUploadText = defaultFileUploadText;
            return;
        }

        if (this.companyLogoRequest.uploadLogo === Status.ERROR) {
            this.logoUploadError = 'Error  uploading logo';
        }
    }

    created() {
        generalModule = getModule(GeneralModule, this.$store);
    }
}
</script>
