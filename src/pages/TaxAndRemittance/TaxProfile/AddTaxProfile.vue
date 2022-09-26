<template>
    <div class="add-tax-station">
        <b-row>
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    defaultSelectField="true"
                    defaultOptionText="Select State"
                    floatingLabelText="State"
                    :options="states"
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    v-model="taxProfile.taxStationStateKey"
                    @input="handleStateSelection"
                    :errors="taxProfileRegistrationFormError.taxStationStateKey"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseSelectWithBorderAndFloatingLabel
                    defaultSelectField="true"
                    defaultOptionText="Select Tax Station"
                    defaultText="-- Select Tax Station --"
                    floatingLabelText="Tax Station"
                    keyProperty="key"
                    textProperty="name"
                    valueProperty="key"
                    :options="taxStations"
                    v-model="taxProfile.taxStationKey"
                    @input="validateTaxStationKey(taxProfile.taxStationKey)"
                    :errors="taxProfileRegistrationFormError.taxStationKey"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseCheckboxWithBorderAndFloatingLabel
                    labelText="I have registered with this tax station"
                    :overRideContainerClass="true"
                    @change="setTaxStationRegistrationStatus"
                />
            </b-col>
        </b-row>

        <b-row>
            <b-col>
                <BaseInputFieldWithBorderAndFloatingLabel
                    :floatingLabelText="taxIdTypeLabel"
                    v-model="taxProfile.taxIdentity"
                    :errors="taxProfileRegistrationFormError.taxIdentity"
                    @input="validateTaxIdentity(taxProfile.taxIdentity)"
                />
            </b-col>
        </b-row>

        <transition-group name="slide-up-fade">
            <template v-if="!registeredWithTaxStation && !editMode">
                <p class="add-tax-station__text" key="get-tax-number">
                    I don't have a Tax Number?
                    <span class="add-tax-station__meta" @click="getNewTaxId">Click here</span> to register
                </p>

                <b-row key="form1">
                    <b-col>
                        <BaseFileInputWithBorderAndFloatingLabel
                            :fileUploadText="cacFiles.cacForm101"
                            :showFileUploadText="showFileUploadText"
                            :emitEventObject="true"
                            :value="taxProfile.cacForm101"
                            id="form101"
                            @input="processSelectedFile($event, 'cacForm101')"
                        />
                    </b-col>
                </b-row>

                <b-row key="form2">
                    <b-col>
                        <BaseFileInputWithBorderAndFloatingLabel
                            :fileUploadText="cacFiles.cacForm102"
                            :emitEventObject="true"
                            id="form102"
                            :value="taxProfile.cacForm102"
                            :showFileUploadText="showFileUploadText"
                            @input="processSelectedFile($event, 'cacForm102')"
                        />
                    </b-col>
                </b-row>

                <b-row key="form3">
                    <b-col>
                        <BaseFileInputWithBorderAndFloatingLabel
                            :fileUploadText="cacFiles.cacForm103"
                            id="form103"
                            :emitEventObject="true"
                            :value="taxProfile.cacForm103"
                            :showFileUploadText="showFileUploadText"
                            @input="processSelectedFile($event, 'cacForm103')"
                        />
                    </b-col>
                </b-row>

                <b-row key="progress-bar" v-if="currentUpload" class="tax-page-container__progress-bar-container">
                    <b-col>
                        <ProgressBar :progress="uploadCountAndProgress.progress" class="tax-forms-progress-bar" />
                        <p>Uploading {{ uploadCountAndProgress.count }}/3</p>
                    </b-col>
                </b-row>
            </template>
        </transition-group>

        <BlockErrorMessage :message="validationErrorMessage" v-if="validationErrorMessage" />
        <BlockErrorMessage :message="error" v-if="error" />

        <BasePrimaryButton
            buttonText="Save"
            className="tax-page-container__submit-button"
            @button-clicked="createTaxProfile"
            :status="requestLoadingStatus"
        />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import TaxMixin from '@/pages/TaxAndRemittance/TaxMixin';

import GeneralModule from '@/store/modules/general';

import {
    TaxStation,
    TaxStationJurisdiction,
    TaxProfile,
    defaultTaxRegistrationProfile,
    TaxProfileRegistrationForm,
    UploadedCacForm,
    TaxProfileUpload,
    CACForms,
} from '@/pages/TaxAndRemittance/types';
import { CountryState, Status, UploadedFile } from '@/types';

const general = namespace('general');
let generalModule: GeneralModule;

@Component
export default class AddTaxProfile extends Mixins(TaxMixin) {
    @Prop({ default: TaxStationJurisdiction.FEDERAL }) jurisdiction!: TaxStationJurisdiction;
    @Prop({ default: false }) editMode!: boolean;
    @Prop({ default: () => ({ ...defaultTaxRegistrationProfile }) })
    taxProfileForEdit!: TaxProfile;
    @Prop({ default: () => Array<CountryState>() }) readonly states!: Array<CountryState>;
    @Prop({ default: () => Array<TaxStation>() }) readonly taxStations!: Array<TaxStation>;

    private taxProfile: TaxProfileRegistrationForm = {
        ...defaultTaxRegistrationProfile,
        taxProfileType: this.jurisdiction,
    };
    private registeredWithTaxStation = false;
    private showFileUploadText = true;
    private cacFiles: TaxProfileUpload = {
        cacForm101: 'Upload CAC Form 101',
        cacForm102: 'Upload CAC Form 102',
        cacForm103: 'Upload CAC Form 103',
    };
    private formData = new FormData();
    private requestLoadingStatus: Status = Status.NORMAL;
    private currentUpload: CACForms = CACForms.empty;

    @general.State
    public uploadedFile!: UploadedFile;

    get taxIdTypeLabel(): string {
        const baseText = 'Enter Tax Number';

        return this.jurisdiction === TaxStationJurisdiction.FEDERAL ? `${baseText} (TIN)` : `${baseText} (TID)`;
    }

    get uploadCountAndProgress(): { count: number; progress: number } {
        if (!this.currentUpload)
            return {
                count: 0,
                progress: 0,
            };

        const uploads = {
            cacForm101: {
                count: 1,
                progress: 33,
            },
            cacForm102: {
                count: 2,
                progress: 66,
            },
            cacForm103: {
                count: 3,
                progress: 100,
            },
        };

        return uploads[this.currentUpload];
    }

    get jurisdictionIsFederal(): boolean {
        return this.jurisdiction === TaxStationJurisdiction.FEDERAL;
    }

    get validationErrorMessage(): string {
        const { cacForm101, cacForm102, cacForm103 } = this.taxProfileRegistrationFormError;

        return cacForm101 || cacForm102 || cacForm103;
    }

    private setTaxStationRegistrationStatus(registeredWithTaxStation: boolean) {
        this.registeredWithTaxStation = registeredWithTaxStation;
    }

    private async createTaxProfile() {
        this.validateTaxProfileRegistrationForm(this.taxProfile);

        if (this.taxProfileFormHasErrors) return;

        // set loader to true
        this.requestLoadingStatus = Status.LOADING;
        const files: Array<UploadedCacForm> = [];

        for (const file of this.formData.entries()) {
            const newFormData = new FormData();
            newFormData.append('fileTag', file[0]);
            newFormData.append('file', file[1]);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.$set(this, 'currentUpload', file[0]);

            const { status, data }: any = await generalModule.uploadFile(newFormData);

            if (status === 201) {
                files.push(data.data);
            }
        }

        const formToBeSubmitted: TaxProfileRegistrationForm = {
            ...this.taxProfile,
        };

        // put the items with their url into the form
        files.forEach((file: UploadedCacForm) => (formToBeSubmitted[file.fileTag] = file.fileUrl));

        await this.taxModule.createTaxProfile(formToBeSubmitted);

        if (this.taxRequestStatus.createTaxProfile === Status.SUCCESS) {
            this.requestLoadingStatus = Status.SUCCESS;
            this.$emit('hide-modal');
            return;
        }

        this.requestLoadingStatus = Status.ERROR;
    }

    private processSelectedFile(event: any, fieldName: keyof TaxProfileUpload) {
        const file = event.target.files;
        const fileName = event.target.value;
        this.taxProfile[fieldName] = fileName;
        const filenameArray = fileName.split('\\');
        if (file.length < 1) return;
        // validate filetype and size here

        const imageFile = file[0];

        this.formData.append(fieldName, imageFile);

        this.cacFiles[fieldName] = fileName ? filenameArray[filenameArray.length - 1] : '';
    }

    private handleStateSelection() {
        const { taxStationStateKey } = this.taxProfile;
        this.$emit('state-selected', this.taxProfile.taxStationStateKey);

        this.validateTaxProfileState(taxStationStateKey);
    }

    private getNewTaxId(): void {
        //TODO store the FIRS website in env
        if (this.jurisdictionIsFederal) {
            window.open('https://www.firs.gov.ng/', '_blank');
            return;
        }
        //TODO get the respective state website pairing them with each state
    }

    private preloadData() {
        if (this.editMode) {
            const { taxStation } = this.taxProfileForEdit;

            this.$emit('state-selected', taxStation.stateKey);

            this.taxProfile = Object.assign({}, this.taxProfile, {
                ...this.taxProfileForEdit,
                taxStationStateKey: taxStation.stateKey,
                taxStationKey: taxStation.stationKey,
                cacForm101: '',
                cacForm102: '',
                cacForm103: '',
            });
            return;
        }
    }

    created() {
        generalModule = getModule(GeneralModule, this.$store);

        this.preloadData();
    }
}
</script>

<style lang="scss">
.add-tax-station {
    &__text {
        font-size: 14px;
        margin-bottom: 0;
    }

    &__meta {
        color: $primary-color;
        border-bottom: 1px solid $primary-color;
        cursor: pointer;
    }
}
</style>
