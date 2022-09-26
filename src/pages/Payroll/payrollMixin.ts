import { Component, Mixins } from 'vue-property-decorator';
import { InputValidation } from '@/types';
import { isEmpty, isEmail, isPhoneNumber, isValidName, isValidNumberInput } from '@/utils/formValidator';
import ValidationMixin from '@/mixins/validation';
import {
    defaultEmployeeBioData,
    EmployeeBioData,
    defaultGuarantorData,
    GuarantorData,
    defaultEmployeeSalary,
    EmployeeSalary,
} from '@/pages/Payroll/AddEmployee/types';

@Component
export default class PayrollMixin extends Mixins(ValidationMixin) {
    // Add employee bioData
    private addEmployeeBioDataError = { ...defaultEmployeeBioData };

    public validateEmployeeFirstName(firstName: string) {
        if (isEmpty(firstName.trim())) {
            this.addEmployeeBioDataError['firstName'] = 'Please Provide Employee firstName';
            return;
        }

        if (firstName.trim().length > 25) {
            this.addEmployeeBioDataError['firstName'] = 'Please keep this between 1-25 characters';
            return;
        }

        if (firstName.trim().split(' ').length > 1) {
            this.addEmployeeBioDataError['firstName'] = 'Maximum of 1 name allowed';
            return;
        }

        this.addEmployeeBioDataError['firstName'] = '';
        return;
    }

    public validateEmployeeLastName(lastName: string) {
        if (isEmpty(lastName.trim())) {
            this.addEmployeeBioDataError['lastName'] = 'Please Provide Employee lastName';
            return;
        }

        if (lastName.trim().length > 25) {
            this.addEmployeeBioDataError['lastName'] = 'Please keep this between 1-25 characters';
            return;
        }

        if (lastName.trim().split(' ').length > 1) {
            this.addEmployeeBioDataError['lastName'] = 'Maximum of 1 name allowed';
            return;
        }

        this.addEmployeeBioDataError['lastName'] = '';
        return;
    }

    public validateEmployeePhoneNumber(phoneNumber: string) {
        if (phoneNumber.length === 0) {
            this.addEmployeeBioDataError['phoneNumber'] = 'Please provide customer phone number';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.addEmployeeBioDataError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }

        this.addEmployeeBioDataError['phoneNumber'] = '';
        return;
    }

    public validateEmployeeEmail(email: string) {
        if (email.length === 0) {
            this.addEmployeeBioDataError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.addEmployeeBioDataError['email'] = 'Please provide a valid email address';
            return;
        }

        this.addEmployeeBioDataError['email'] = '';
        return;
    }

    public validateIfRequiredStringFieldIsEmpty(field: string, value: string, error: InputValidation) {
        if (isEmpty(value)) {
            error[field] = 'This is a required field';
            return;
        }

        error[field] = '';
        return;
    }

    public validateDateOfBirth(dateOfBirth: string) {
        if (isEmpty(dateOfBirth)) {
            this.addEmployeeBioDataError['dateOfBirth'] = 'This is a required field';
            return;
        }

        this.addEmployeeBioDataError['dateOfBirth'] = '';
    }

    public get addEmployeeBioDataFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addEmployeeBioDataError);
    }

    public validateBioDataGender(gender: string) {
        if (isEmpty(gender)) {
            this.addEmployeeBioDataError['gender'] = 'Please, select an item from the list';
            return;
        }

        this.addEmployeeBioDataError['gender'] = '';
    }

    public validateStateOfResidence(stateOfResidence: string) {
        if (isEmpty(stateOfResidence)) {
            this.addEmployeeBioDataError['stateOfResidence'] = 'Please, select an item from the list';
            return;
        }

        this.addEmployeeBioDataError['stateOfResidence'] = '';
    }

    public validateBioDataMaritalStatus(maritalStatus: string) {
        if (isEmpty(maritalStatus)) {
            this.addEmployeeBioDataError['maritalStatus'] = 'Please, select an item from the list';
            return;
        }

        this.addEmployeeBioDataError['maritalStatus'] = '';
    }

    public validateBioDataForm(addEmployeeForm: EmployeeBioData) {
        const { firstName, lastName, email, phoneNumber, gender, dateOfBirth, maritalStatus } = addEmployeeForm;

        this.validateEmployeeFirstName(firstName);
        this.validateBioDataGender(gender);
        this.validateEmployeeLastName(lastName);
        this.validateEmployeeEmail(email);
        this.validateEmployeePhoneNumber(phoneNumber);
        this.validateBioDataMaritalStatus(maritalStatus);
        this.validateDateOfBirth(dateOfBirth);
    }

    // Guarantor information
    private addGuaratorDataError = { ...defaultGuarantorData };

    validateGuarantorFullName = (fullName: string) => {
        if (isEmpty(fullName.trim())) {
            this.addGuaratorDataError['fullName'] = 'Please Provide Guarantor fullname';
            return this.addGuaratorDataError['fullName'];
        }
        if (!isValidName(fullName.trim())) {
            this.addGuaratorDataError['fullName'] = 'Please provide a valid name';
            return this.addGuaratorDataError['fullName'];
        }
        if (fullName.trim().split(' ').length > 3) {
            this.addGuaratorDataError['fullName'] = 'maximum of 3 names allowed';
            return this.addGuaratorDataError['fullName'];
        }
        this.addGuaratorDataError['fullName'] = '';
        return this.addGuaratorDataError['fullName'];
    };

    public validateGuarantorPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length === 0) {
            this.addGuaratorDataError['phoneNumber'] = 'Please provide customer phone number';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.addGuaratorDataError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }

        this.addGuaratorDataError['phoneNumber'] = '';
        return;
    }

    public validateGuarantorEmail(email: string) {
        if (email.length === 0) {
            this.addGuaratorDataError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.addGuaratorDataError['email'] = 'Please provide a valid email address';
            return;
        }

        this.addGuaratorDataError['email'] = '';
        return;
    }

    public validateGuarantorForm(addGuarantorForm: GuarantorData) {
        const { fullName, email, phoneNumber } = addGuarantorForm;

        this.validateGuarantorFullName(fullName);
        this.validateGuarantorEmail(email);
        this.validateGuarantorPhoneNumber(phoneNumber);
    }

    public get addGuarantorDataFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addGuaratorDataError);
    }

    // Employee salary
    private addEmployeeSalaryError = { ...defaultEmployeeSalary };
    public validateStructure(paymentStructure: string) {
        if (isEmpty(paymentStructure)) {
            this.addEmployeeSalaryError['paymentStructure'] = 'Please, select an item from the list';
            return;
        }

        this.addEmployeeSalaryError['paymentStructure'] = '';
    }

    public validateNegotiationPattern(salaryNegotiationPattern: string) {
        if (isEmpty(salaryNegotiationPattern)) {
            this.addEmployeeSalaryError['salaryNegotiationPattern'] = 'Please, select an item from the list';
            return;
        }
        this.addEmployeeSalaryError['salaryNegotiationPattern'] = '';
    }

    public validateEmployeeSalary(salary: string) {
        const figure = this.removeCommaFromString(salary);
        if (!Number(figure)) {
            this.addEmployeeSalaryError['salary'] = 'Only digits required';
            return;
        }
        if (!(Number(figure) >= 0)) {
            this.addEmployeeSalaryError['salary'] = 'The minimum amount is 0';
            return;
        }

        this.addEmployeeSalaryError['salary'] = '';
        return;
    }

    public validateEmployeeSalaryForm(basicEmployeeDetails: EmployeeSalary) {
        const { paymentStructure, salary, salaryNegotiationPattern } = basicEmployeeDetails;
        this.validateStructure(paymentStructure);
        this.validateEmployeeSalary(salary);
        this.validateNegotiationPattern(salaryNegotiationPattern);
    }

    public get employeeSalaryCalculation(): boolean {
        return !this.formHasError(this.addEmployeeSalaryError);
    }
    public removeCommaFromString(value: string): number {
        return Number(value.replace(/,/g, ''));
    }
}
