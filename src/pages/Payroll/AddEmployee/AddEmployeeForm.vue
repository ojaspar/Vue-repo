<template>
    <b-container fluid class="bio-data">
        <b-row>
            <b-col>
                <div class="bio-data__container">
                    <div class="bio-data__medium-plus-container">
                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="First Name"
                                    v-model="employee.firstName"
                                    :errors="addEmployeeBioDataError.firstName"
                                    @input="validateEmployeeFirstName(employee.firstName)"
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Last Name"
                                    v-model="employee.lastName"
                                    :errors="addEmployeeBioDataError.lastName"
                                    @input="validateEmployeeLastName(employee.lastName)"
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
                                    v-model="employee.phoneNumber"
                                    :errors="addEmployeeBioDataError.phoneNumber"
                                    @input="validateEmployeePhoneNumber(employee.phoneNumber)"
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Email"
                                    v-model="employee.email"
                                    :errors="addEmployeeBioDataError.email"
                                    @input="validateEmployeeEmail(employee.email)"
                                />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseSelectWithBorderAndFloatingLabel
                                    textProperty="displayName"
                                    defaultOptionText="-- Select Gender --"
                                    floatingLabelText="Gender"
                                    keyProperty="displayName"
                                    valueProperty="displayName"
                                    :options="gender"
                                    className="quick-expense-index__split-input"
                                    v-model="employee.gender"
                                    :errors="addEmployeeBioDataError.gender"
                                    @input="handleGender"
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseDateFieldWithBorderAndFloatingLabel
                                    floatingLabelText="Date of Birth"
                                    v-model="employee.dateOfBirth"
                                    :errors="addEmployeeBioDataError.dateOfBirth"
                                    @input="validateDateOfBirth(employee.dateOfBirth)"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col cols="12" class="pl-lg-0 pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="address"
                                    valueProperty="key"
                                    floatingLabelText="Residential Address"
                                    v-model="employee.address"
                                    :errors="addEmployeeBioDataError.address"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'address',
                                            employee.address,
                                            addEmployeeBioDataError,
                                        )
                                    "
                                />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseSelectWithBorderAndFloatingLabel
                                    defaultOptionText="-- Select State --"
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    :options="stateOfResidence"
                                    floatingLabelText="State of Residence"
                                    v-model="employee.stateOfResidence"
                                    :errors="addEmployeeBioDataError.stateOfResidence"
                                    @input="handleStateOfResidence"
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseSelectWithBorderAndFloatingLabel
                                    textProperty="displayName"
                                    defaultOptionText="-- Select Marital Status --"
                                    floatingLabelText="Marital Status"
                                    :options="maritalStatus"
                                    keyProperty="displayName"
                                    valueProperty="displayName"
                                    className="quick-expense-index__split-input"
                                    :errors="addEmployeeBioDataError.maritalStatus"
                                    @input="validateBioDataMaritalStatus"
                                    v-model="employee.maritalStatus"
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Next of Kin"
                                    v-model="employee.nextOfKin"
                                    :errors="addEmployeeBioDataError.nextOfKin"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'nextOfKin',
                                            employee.nextOfKin,
                                            addEmployeeBioDataError,
                                        )
                                    "
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    v-model="employee.nextOfKinRelationship"
                                    floatingLabelText="Next of Kin Relationship"
                                    :errors="addEmployeeBioDataError.nextOfKinRelationship"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'nextOfKinRelationship',
                                            employee.nextOfKinRelationship,
                                            addEmployeeBioDataError,
                                        )
                                    "
                                />
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col md="6" cols="12" class="pl-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="nextOfKinPhoneNumber"
                                    valueProperty="key"
                                    floatingLabelText="Next of Kin Phone Number"
                                    v-model="employee.nextOfKinPhoneNumber"
                                    :errors="addEmployeeBioDataError.nextOfKinPhoneNumber"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'nextOfKinPhoneNumber',
                                            employee.nextOfKinPhoneNumber,
                                            addEmployeeBioDataError,
                                        )
                                    "
                                />
                            </b-col>
                            <b-col md="6" cols="12" class="pr-lg-0">
                                <BaseInputFieldWithBorderAndFloatingLabel
                                    keyProperty="key"
                                    textProperty="name"
                                    valueProperty="key"
                                    floatingLabelText="Next of Kin Address"
                                    v-model="employee.nextOfKinAddress"
                                    :errors="addEmployeeBioDataError.nextOfKinAddress"
                                    @input="
                                        validateIfRequiredStringFieldIsEmpty(
                                            'nextOfKinAddress',
                                            employee.nextOfKinAddress,
                                            addEmployeeBioDataError,
                                        )
                                    "
                                />
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" class="pl-lg-0 pr-lg-0">
                                <BaseTextAreaWithBorderAndFloatingLabel
                                    floatingLabelText="Notes"
                                    v-model="employee.notes"
                                />
                            </b-col>
                        </b-row>
                        <b-row class="bio-data__footer">
                            <BaseButton
                                buttonText="Next"
                                className="bio-data__save-btn"
                                :overRideButtonClass="true"
                                @button-clicked="gotoGuarantorInformationPage"
                                :disabled="buttonShouldBeDisabled"
                            />
                        </b-row>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import DynamicComponentMixin from '@/mixins/dynamicComponents';
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import UtilityMixins from '@/mixins/Utility';
import { EmployeeBioData, defaultEmployeeBioData } from '@/pages/Payroll/AddEmployee/types';
import PayrollMixin from '@/pages/Payroll/payrollMixin';
@Component
export default class AddEmployeeForm extends Mixins(DynamicComponentMixin, PayrollMixin, UtilityMixins) {
    @Prop() readonly progress!: number;
    @Prop({}) readonly bioData!: EmployeeBioData;
    @Prop({ required: true }) readonly stateOfResidence!: Array<{ id: number; state: string }>;
    private employee: EmployeeBioData = { ...defaultEmployeeBioData };
    private gender: Array<{}> = [
        {
            displayName: `Male`,
            id: 1,
        },
        {
            displayName: `Female`,
            id: 2,
        },
    ];
    private maritalStatus: Array<{}> = [
        {
            displayName: `Single`,
        },
        {
            displayName: `Married`,
        },
    ];
    private gotoGuarantorInformationPage(): void {
        this.validateBioDataForm(this.employee);
        if (!this.addEmployeeBioDataFormIsReadyForSubmission) return;
        this.$emit('bio-data-entered', this.employee);
    }
    get buttonShouldBeDisabled(): boolean {
        return !this.addEmployeeBioDataFormIsReadyForSubmission;
    }
    private handleMaritalStatus(value: string) {
        this.employee.maritalStatus = value;
        this.$nextTick(() => {
            this.validateBioDataMaritalStatus(value);
        });
    }
    private handleGender(value: string) {
        this.employee.gender = value;
        this.$nextTick(() => {
            this.validateBioDataGender(value);
        });
    }
    private handleStateOfResidence(value: string) {
        this.employee.stateOfResidence = value;
        this.$nextTick(() => {
            this.validateStateOfResidence(value);
        });
    }
    @Watch('bioData', { deep: true, immediate: true })
    handleBioData(bioData: EmployeeBioData) {
        this.employee = bioData;
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/payroll/add-employee-form.scss';
</style>
