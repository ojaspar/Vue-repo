<template>
    <b-container fluid class="guarantor-information">
        <b-row>
            <b-col>
                <div class="guarantor-information__container">
                    <div class="guarantor-information__medium-plus-container">
                        <b-row>
                            <b-col class="pl-lg-0 pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Guarantor Name"
                                    v-model="form.fullName"
                                    :errors="addGuaratorDataError.fullName"
                                    @input="validateGuarantorFullName(form.fullName)"
                                />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Phone Number"
                                    v-model="form.phoneNumber"
                                    :errors="addGuaratorDataError.phoneNumber"
                                    @input="validateGuarantorPhoneNumber(form.phoneNumber)"
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Email"
                                    v-model="form.email"
                                    :errors="addGuaratorDataError.email"
                                    @input="validateGuarantorEmail(form.email)"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col class="pl-lg-0 pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Address"
                                    v-model="form.address"
                                    :errors="addGuaratorDataError.address"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'address',
                                            form.address,
                                            addGuaratorDataError,
                                        )
                                    "
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col class="pl-lg-0 pr-lg-0">
                                <BaseTextAreaWithBorderAndFloatingLabel floatingLabelText="Notes" v-model="form.note" />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="pl-lg-0 pr-lg-0">
                                <BaseFileInputWithBorderAndFloatingLabel
                                    :showFileUploadText="showFileUploadText"
                                    :fileUploadText="fileUploadText"
                                    :id="id"
                                    v-model="form.file"
                                />
                            </b-col>
                        </b-row>
                        <b-row class="guarantor-information__plus-button-container">
                            <b-col class="pl-lg-0">
                                <AddNewEntityWithPlusIconButton
                                    buttonText="Add Another File"
                                    :icon="require('@/assets/img/plus-button-light-blue.svg')"
                                />
                            </b-col>
                        </b-row>
                        <b-row class="guarantor-information__footer">
                            <div class="guarantor-information__buttons-container">
                                <BasePrimaryButton
                                    buttonText="Back"
                                    className="guarantor-information__button--save"
                                    @button-clicked="goBackToAddEmployeeFormPage"
                                />
                                <BaseButton
                                    buttonText="Next"
                                    :overRideButtonClass="true"
                                    className="guarantor-information__button--save-and-close"
                                    @button-clicked="gotoEmployeeSalaryFormPage"
                                    :disabled="buttonShouldBeDisabled"
                                />
                            </div>
                        </b-row>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import PayrollMixin from '@/pages/Payroll/payrollMixin';
import { GuarantorData, defaultGuarantorData } from '@/pages/Payroll/AddEmployee/types';

@Component
export default class GuarantorInformationForm extends Mixins(DynamicComponentMixin, PayrollMixin) {
    @Prop({ required: true }) readonly fileUploadText!: string;
    @Prop({}) readonly guarantorData!: GuarantorData;

    @Prop() readonly fileName!: string;
    private fileClassName = 'hide-default-file-input-text';
    private showFileUploadText = true;
    private id = 'files';
    private form: GuarantorData = { ...defaultGuarantorData };

    private goBackToAddEmployeeFormPage() {
        this.$emit('back-to-add-employee-page', 0);
    }
    private gotoEmployeeSalaryFormPage() {
        this.validateGuarantorForm(this.form);
        if (!this.addGuarantorDataFormIsReadyForSubmission) return;
        this.$emit('guarantor-data-entered', this.form);
    }

    get buttonShouldBeDisabled(): boolean {
        return !this.addGuarantorDataFormIsReadyForSubmission;
    }

    @Watch('guarantorData', { deep: true, immediate: true })
    handleBioData(guarantorData: GuarantorData) {
        this.form = guarantorData;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/payroll/guarantor-information.scss';
</style>
