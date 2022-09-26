/*eslint-disable @typescript-eslint/no-explicit-any */

import {
    SignupFormFields,
    LoginInfo,
    LoginEmailValidation,
    CreatePasswordFields,
    SecretQuestionValidationFields,
    BioDataFields,
    BusinessDetailsFormFields,
    InputValidation,
    CustomerProfile,
    Product,
} from '@/types';

const emailRegex = /\S+@\S+\.\S+/;
const phoneNumberRegex = /^[1-9]\d{9}|^\d{11}$/gm;
const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/gm;

const errors: SignupFormFields = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedQuestion: '',
    answer: '',
};

export const isEmail = (emailInput: string): boolean => {
    const valid = emailInput.trim().match(emailRegex);
    return valid ? true : false;
};

export const isPhoneNumber = (phoneNumber: string): boolean => {
    const valid = phoneNumber.trim().match(phoneNumberRegex);
    return valid ? true : false;
};

export const isValidName = (nameInput: string): boolean => {
    const valid = nameInput.trim().match(fullNameRegex);
    return valid ? true : false;
};

export const valueIsFinite = (value: string | number) => Number.isFinite(Number(value));

export const isEmpty = (field: string): boolean => field.trim().length === 0;

export function isValidNumberInput(value: any): boolean {
    const formattedInput = value.replace(/(\d)(?=(\d{3})+(?!\d))/g);
    return formattedInput === 'NaN' ? false : true;
}

export const validateFirstName = (firstName: string): void => {
    if (isEmpty(firstName)) {
        errors.firstName = 'Please enter your first name';
        return;
    }
    errors.firstName = '';
};

export const validateLastName = (lastName: string) => {
    if (isEmpty(lastName)) {
        errors.lastName = 'Please enter your last name';
        return;
    }
    errors.lastName = '';
};

export const validateEmail = (email: string): LoginEmailValidation => {
    if (isEmpty(email)) {
        errors.email = 'Please enter your email';
    } else if (!isEmail(email)) {
        errors.email = 'Please provide a valid email';
    } else {
        errors.email = '';
    }
    return errors;
};

export const validatePhoneNumber = (phoneNumber: string): void => {
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

export const validatePassword = (password: string) => {
    if (isEmpty(password)) {
        errors.password = 'Please enter your password';
    } else if (password.length < 8) {
        errors.password = 'The minimum characters is 8';
    } else {
        errors.password = '';
    }
    return errors.password;
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (isEmpty(confirmPassword)) {
        errors.confirmPassword = 'Please enter your password again';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = `Passwords don't match`;
    } else {
        errors.confirmPassword = '';
    }
    return errors.confirmPassword;
};

export const validateCreatePasswordSection = (form: CreatePasswordFields) => {
    validatePassword(form.password);
    validateConfirmPassword(form.password, form.confirmPassword);
    return errors;
};

export const validateBiodataSection = (form: BioDataFields) => {
    validateFirstName(form.firstName);
    validateLastName(form.lastName);
    validateEmail(form.email);
    validateCreatePasswordSection(form);
    return errors;
};

export const validateSecretQuestion = (selectedQuestion: string) => {
    if (isEmpty(selectedQuestion)) {
        errors.selectedQuestion = 'Please select a question first';
    } else {
        errors.selectedQuestion = '';
    }
    return errors.selectedQuestion;
};

export const validateAnswerToSecretQuestion = (answer: string) => {
    if (isEmpty(answer)) {
        errors.answer = 'Please provide your answer';
    } else {
        errors.answer = '';
    }
    return errors.answer;
};

export const validateSecretQuestionSection = (form: SecretQuestionValidationFields) => {
    validateSecretQuestion(form.selectedQuestion);
    validateAnswerToSecretQuestion(form.answer);
    return errors;
};

export const getBusinessSetupErrors = (form: BusinessDetailsFormFields) => {
    const errors: InputValidation = {
        name: '',
        address: '',
        state: '',
        city: '',
        email: '',
        phoneNumber: '',
        type: '',
        businessRegistrationNumber: '',
    };
    Object.keys(form).forEach(key => {
        if (key === 'name') {
            if (isEmpty(form[key])) {
                errors['name'] = 'Please provide your business name';
            } else {
                errors['name'] = '';
            }
        }

        if (key === 'address') {
            if (isEmpty(form[key])) {
                errors['address'] = 'Please provide an address';
            } else {
                errors['address'] = '';
            }
        }
        if (key === 'country') {
            if (isEmpty(form[key])) {
                errors['country'] = 'Please enter a country';
            } else {
                errors['country'] = '';
            }
        }
        if (key === 'state') {
            if (isEmpty(form[key])) {
                errors['state'] = 'Please provide a state';
            } else {
                errors['state'] = '';
            }
        }
        if (key === 'lga') {
            if (isEmpty(form[key])) {
                errors['lga'] = 'Please enter a city';
            } else {
                errors['lga'] = '';
            }
        }
        if (key === 'phoneNumber') {
            if (isEmpty(form[key])) {
                errors['phoneNumber'] = 'Please provide a phone number';
            } else {
                errors['phoneNumber'] = '';
            }
        }
        if (key === 'category') {
            if (isEmpty(form[key])) {
                errors['category'] = 'Please provide a type';
            } else {
                errors['category'] = '';
            }
        }
        // if (key === 'tin') {
        //     if (isEmpty(form[key])) {
        //         errors['tin'] = 'Please provide a TIN';
        //     } else {
        //         errors['tin'] = '';
        //     }
        // }
        if (key === 'email') {
            if (isEmpty(form[key])) {
                errors['email'] = 'Please provide a email';
            } else if (!isEmail(form[key])) {
                errors['email'] = 'Please provide a valid email';
            } else {
                errors['email'] = '';
            }
        }
        // if (key === 'rcNumber') {
        //     if (isEmpty(form[key])) {
        //         errors['rcNumber'] = 'Please provide a business registration number';
        //     } else {
        //         errors['rcNumber'] = '';
        //     }
        // }
    });
    return errors;
};

export const getLoginErrors = (form: LoginInfo): LoginInfo => {
    Object.keys(form).forEach(key => {
        if (key === 'email') {
            validateEmail(form.email);
        }

        if (key === 'password') {
            if (isEmpty(form.password)) {
                errors.password = 'Please enter your password';
                return;
            }
            errors.password = '';
        }
    });
    return errors;
};

export const getAddCustomerErrors = (form: CustomerProfile) => {
    const errors: InputValidation = {
        name: '',
        email: '',
        phoneNumber: '',
    };
    Object.keys(form).forEach(key => {
        if (key === 'name') {
            if (isEmpty(form[key])) {
                errors['name'] = 'Please provide a customer name';
            } else if (!isValidName(form[key])) {
                errors['name'] = 'Please provide a valid name';
            } else if (form[key].split(' ').length > 3) {
                errors['name'] = 'maximum of 3 names allowed';
            } else {
                errors['name'] = '';
            }
        }
        if (key === 'phoneNumber') {
            if (isEmpty(form[key])) {
                errors['phoneNumber'] = 'Please provide a phone number';
            } else if (!isPhoneNumber(form[key])) {
                errors['phoneNumber'] = 'Please provide a valid phone number';
            } else {
                errors['phoneNumber'] = '';
            }
        }
        if (key === 'email') {
            if (!isEmpty(form[key])) {
                if (!isEmail(form[key])) {
                    errors['email'] = 'Please provide a valid email';
                } else {
                    errors['email'] = '';
                }
            }
        }
    });
    return errors;
};

export const resetFormFields = (form: any) => {
    Object.keys(form).forEach(key => {
        form[key] = '';
    });
};

export const validateProductPrice = (price: string): boolean => price.charAt(0) !== '0';

export const getAddProductErrors = (form: Product) => {
    const errors: InputValidation = {
        name: '',
        description: '',
        incomeType: '',
        price: '',
    };

    Object.keys(form).forEach(key => {
        if (key === 'name') {
            if (isEmpty(form[key])) {
                errors['name'] = `Please provide product's name`;
            } else {
                errors['name'] = '';
            }
        }
        if (key === 'incomeType') {
            if (isEmpty(form[key])) {
                errors['incomeType'] = 'Please select income type';
            } else {
                errors['incomeType'] = '';
            }
        }
        if (key === 'price') {
            if (isEmpty(form[key])) {
                errors['price'] = `Please provide product's price`;
            } else if (!validateProductPrice(form[key])) {
                errors['price'] = `A valid price is required`;
            } else {
                errors['price'] = '';
            }
        }
    });
    return errors;
};

export function formHasError(errors: object): boolean {
    return Object.values(errors).some(value => value.length > 0);
}

export function hasError(error: string): boolean {
    return error.length > 0;
}
