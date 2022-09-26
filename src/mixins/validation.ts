import { Component, Vue } from 'vue-property-decorator';

import { SignupFormFields, SignupFields, InputValidation, ErrorIndexSignature } from '@/types';

import { isEmail, isEmpty, isPhoneNumber, isValidName } from '@/utils/formValidator';

const addCustomerForm: InputValidation = {
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: '',
};

@Component
class ValidationMixin extends Vue {
    public buttonIsDisabled(status = '', errors: object = {}) {
        return status === 'LOADING' || Object.values(errors).some(error => error.length > 0);
    }

    public hasError(field: string): boolean {
        if (field && field.trim().length > 0) {
            return true;
        }
        return false;
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }

    public validateEmail = (email: string, errors: InputValidation, isOptional = false): InputValidation => {
        if (isOptional) {
            if (isEmpty(email)) {
                errors.email = '';
                return errors;
            }
            if (!isEmail(email)) {
                errors.email = 'Please provide a valid email';
                return errors;
            }
        }
        if (isEmpty(email)) {
            errors.email = 'Please enter your email';
            return errors;
        }
        if (!isEmail(email)) {
            errors.email = 'Please provide a valid email';
            return errors;
        }
        errors.email = '';
        return errors;
    };

    public validateLoginPassword = (password: string, errors: SignupFormFields) => {
        if (isEmpty(password)) {
            errors.password = 'Please enter your password';
            return errors;
        }
        errors.password = '';
        return errors;
    };

    public validatePhoneNumber = (phoneNumber: string, errors: SignupFields): void => {
        if (isEmpty(phoneNumber)) {
            errors.phoneNumber = 'Please enter your phone number';
            return;
        }
        if (!isPhoneNumber(phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid phone number with 11 digits';
            return;
        }
        errors.phoneNumber = '';
    };

    public validateEmptyInput = (field: string, input: string, errors: InputValidation) => {
        if (isEmpty(input)) {
            if (field === 'name') {
                errors.name = 'Please enter a business name';
            }
            if (field === 'address') {
                errors.address = 'Please enter an address';
            }
            if (field === 'businessRegistrationNumber') {
                errors.businessRegistrationNumber = 'Please enter a registration number';
            }
            if (field === 'firstName') {
                errors.firstName = 'Please enter your first name';
            }
            if (field === 'lastName') {
                errors.lastName = 'Please enter your last name';
            }
            if (field === 'password') {
                errors.password = 'Please enter your password';
            }
        } else {
            errors[field] = '';
        }
    };

    public validateFullName = (fullName: string, errors: InputValidation) => {
        if (isEmpty(fullName)) {
            errors.name = 'Please provide a  name';
            return errors.name;
        }
        if (!isValidName(fullName)) {
            errors.name = 'Please provide a valid name';
            return errors.name;
        }
        if (fullName.split(' ').length > 3) {
            errors.name = 'maximum of 3 names allowed';
            return errors.name;
        }
        errors.name = '';
        return errors.name;
    };

    public validateEmptyField = (field: string, input: string, errors: InputValidation, errorMessage: string) => {
        if (isEmpty(input)) errors[field] = errorMessage;
        else errors[field] = '';
    };

    public atLeastOneErrorExists(errors: ErrorIndexSignature): boolean {
        return Object.keys(errors).some(key => errors[key]);
    }

    //Add new customer form validation
    private addCustomerError = { ...addCustomerForm };

    public validateCustomerName(name: string) {
        if (isEmpty(name)) {
            this.addCustomerError['name'] = 'Please provide customer name';
            return;
        }

        if (name.length > 25) {
            this.addCustomerError['name'] = 'Please keep this between 1-25 characters';
            return;
        }

        if (name.split(' ').length > 3) {
            this.addCustomerError['name'] = 'Maximum of 3 names allowed';
            return;
        }

        this.addCustomerError['name'] = '';
        return;
    }

    public validateCustomerPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length === 0) {
            this.addCustomerError['phoneNumber'] = 'Please provide customer phone number';
            return;
        }

        if (!isPhoneNumber(phoneNumber)) {
            this.addCustomerError['phoneNumber'] = 'Please provide a valid phone number';
            return;
        }

        this.addCustomerError['phoneNumber'] = '';
        return;
    }

    public validateCustomerEmail(email: string) {
        if (email.length === 0) {
            this.addCustomerError['email'] = '';
            return;
        }

        if (!isEmail(email)) {
            this.addCustomerError['email'] = 'Please provide a valid email address';
            return;
        }

        this.addCustomerError['email'] = '';
        return;
    }

    public validateAddCustomerForm(form: {
        name: string;
        phoneNumber: string;
        email: string;
        address: string;
        notes: string;
    }) {
        const { name, email, phoneNumber } = form;

        this.validateCustomerName(name);
        this.validateCustomerEmail(email);
        this.validateCustomerPhoneNumber(phoneNumber);
    }

    public get addCustomerFormIsReadyForSubmission(): boolean {
        return !this.formHasError(this.addCustomerError);
    }

    public validateTextFieldUsedForAFormattedNumber(
        formattedNumberFromTextField: number | string,
        convertedNumber: number,
    ) {
        let controlVariable = '';
        // formattedNumber from textField is the currency like figure with commas e.g 4,000,000
        //convertedNumber is the number without commas
        //if convertedNumber is greater than zero, it means the number in the textbox is a valid number
        //if convertedNumber is zero and the string input is not zero then it is
        if (isEmpty(formattedNumberFromTextField.toString())) {
            controlVariable = '';
        } //the controlVariable is used for assigning strings based on different situations
        else {
            controlVariable = this.validateFormattedNumberWhenItIsNotEmpty(
                controlVariable,
                formattedNumberFromTextField,
                convertedNumber,
            );
        }
        return controlVariable;
    }

    public validateFormattedNumberWhenItIsNotEmpty(
        controlVariable: string,
        formattedNumberFromTextField: string | number,
        convertedNumber: number,
    ) {
        // if inputToNumber is greater than zero, it means that the string passed to it is not an empty string
        // an empty string will return 0
        if (convertedNumber > 0) {
            controlVariable = convertedNumber.toString();
        } else if (formattedNumberFromTextField == '0') {
            // if the input is zero, allow it. Zero is a valid number
            controlVariable = formattedNumberFromTextField;
        } else {
            // input is a string with mutlple letters here, or an empty string
            controlVariable = '';
        }
        return controlVariable;
    }
}

export default ValidationMixin;
