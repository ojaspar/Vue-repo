import { Component, Mixins, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import { InputValidation } from '@/types';
import { PasswordError, UserProfile, UserProfileResponse, UserProfileStatus } from '@/pages/Settings/types';

import { isEmpty } from '@/utils/formValidator';

import {
    BusinessRegistrationType,
    CountryState,
    BusinessProfile,
    Status,
    LGA,
    BusinessRequestStatus,
    Country,
    BusinessVertical,
    AuthRequestStatus,
    NotificationType,
} from '@/types';
import { defalutBusinesssProfile } from '@/pages/Settings/types';

import { validateEmail } from '@/utils/formValidator.ts';

import ValidationMixin from '@/mixins/validation';
import UtilityMixins from '@/mixins/Utility';

const business = namespace('business');
const auth = namespace('auth');

@Component
class SettingsMixin extends Mixins(ValidationMixin, UtilityMixins) {
    @auth.State
    public userProfile!: UserProfileResponse;

    @auth.State
    public errorCode!: number;

    @auth.State
    public userProfileStatus!: UserProfileStatus;

    @auth.State
    public verifyUserProfileUpdateToken!: string;

    @auth.Action
    public fetchUserProfile!: (userKey: string) => void;

    @auth.Action
    public verifyUserProfileUpdate!: ({ userKey, token }: { userKey: string; token: string }) => void;

    @business.State
    public businessRequestStatus!: BusinessRequestStatus;

    @business.State
    public lgas!: () => Array<LGA>;

    @business.State
    public states!: Array<CountryState>;

    @business.State
    public countries!: Array<Country>;

    @business.State
    public businessVerticals!: Array<BusinessVertical>;

    @business.State
    public businessRegistrationTypes!: (payload: BusinessProfile) => void;

    @business.Action
    public getStates!: () => Array<CountryState>;

    @business.Action
    public getCountries!: () => void;

    @business.Action
    public getBusinessVerticals!: () => Array<BusinessVertical>;

    @business.Action
    public getBusinessRegistrationTypes!: () => Array<BusinessRegistrationType>;

    @business.Action
    public verifyBusinessProfileUpdate!: ({ businessKey, token }: { businessKey: string; token: string }) => void;

    @business.State
    public verifyBusinessUpdateToken!: string;

    public intialStateOfBusiness = {
        name: '',
        rc: '',
        phone: '',
        type: '',
        email: '',
        industry: '',
        country: '',
        state: '',
        council: '',
        address: '',
    };

    public initialStateOfUser: UserProfile = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    };

    public changePasswordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    public changePasswordErrors: PasswordError = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };

    public user = { ...this.initialStateOfUser };

    public business = { ...defalutBusinesssProfile };

    public addBusinessErrors = {
        name: '',
        rc: '',
        phoneNumber: '',
        type: '',
        email: '',
        industry: '',
        country: '',
        state: '',
        council: '',
        address: '',
    };

    public profileDetailsErrors = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    };

    get atLeastOneStatusIsLoading() {
        return Object.values(this.businessRequestStatus).some(status => status === Status.LOADING);
    }

    get businessDetailsButtonStatus() {
        if (this.atLeastOneStatusIsLoading) {
            return 'LOADING';
        }
        return 'NORMAL';
    }

    public validateEmptyBusinessDetailsInput = (field: string, input: string, errors: InputValidation) => {
        if (isEmpty(input)) {
            if (field === 'name') {
                errors.name = 'Please enter a business name';
            }
            if (field === 'address') {
                errors.address = 'Please enter an address';
            }
            if (field === 'type') {
                errors.type = 'Please enter a business type';
            }
            if (field === 'rc') {
                errors.rc = 'Please enter an RC number';
            }
            if (field === 'industry') {
                errors.industry = 'Please enter an industry';
            }
            if (field === 'country') {
                errors.country = 'Please enter a country';
            }
            if (field === 'state') {
                errors.state = 'Please enter a state';
            }
            if (field === 'council') {
                errors.council = 'Please enter a local government';
            }
            if (field === 'firstName') {
                errors.firstName = 'Please enter your first name';
            }
            if (field === 'lastName') {
                errors.lastName = 'Please enter your last name';
            }
        } else {
            errors[field] = '';
        }
    };

    public validateBusinessName() {
        this.validateEmptyBusinessDetailsInput('name', this.business.name, this.addBusinessErrors);
    }

    public validateBusinessType() {
        this.validateEmptyBusinessDetailsInput('type', this.business.type.key, this.addBusinessErrors);
    }

    public handleBusinessTypeChange(value: string) {
        this.business.type.key = value;
        this.validateBusinessType();
    }

    public validateRCNumber() {
        this.validateEmptyBusinessDetailsInput('rc', this.business.rc, this.addBusinessErrors);
    }

    public validateBusinessIndustry() {
        this.validateEmptyBusinessDetailsInput('industry', this.business.industry.key, this.addBusinessErrors);
    }

    public handleBusinessIndustryChange(value: string) {
        this.business.industry.key = value;
        this.validateBusinessIndustry();
    }

    public validateBusinessCountry() {
        this.validateEmptyBusinessDetailsInput('country', this.business.country.key, this.addBusinessErrors);
    }

    public handleBusinessCountryChange(value: string) {
        this.business.country.key = value;
        this.validateBusinessCountry();
    }

    public validateBusinessState() {
        this.validateEmptyBusinessDetailsInput('state', this.business.state.key, this.addBusinessErrors);
    }

    public handleBusinessStateChange(value: string) {
        this.business.state.key = value;
        this.validateBusinessState();
    }

    public validateBusinessEmail() {
        this.addBusinessErrors.email = validateEmail(this.business.email).email;
    }

    public validateBusinessPhoneNumber() {
        this.validatePhoneNumber(this.business.phone, this.addBusinessErrors);
    }

    public validateBusinessAddress() {
        this.validateEmptyBusinessDetailsInput('address', this.business.address, this.addBusinessErrors);
    }

    public validateBusinessLocalGovernment() {
        this.validateEmptyBusinessDetailsInput('council', this.business.council.key, this.addBusinessErrors);
    }

    public handleBusinessLocalGovernmentChange(value: string) {
        this.business.council.key = value;
        this.validateBusinessLocalGovernment();
    }

    public validateBusinessDetailsPage() {
        this.validateBusinessName();
        this.validateBusinessEmail();
        // this.validateRCNumber();
        this.validateBusinessIndustry();
        this.validateBusinessLocalGovernment();
        this.validateBusinessAddress();
        this.validateBusinessPhoneNumber();
        this.validateBusinessState();
        this.validateBusinessCountry();
        this.validateBusinessType();
    }

    get fullName() {
        return `${this.user.firstName.trim()} ${this.user.lastName.trim()}`;
    }

    get conditionsForButtonToBeDisabled() {
        return (
            this.userProfileStatus.fetchUserProfile === Status.LOADING ||
            this.atLeastOneErrorExists(this.profileDetailsErrors)
        );
    }

    public validateFirstName() {
        this.validateEmptyBusinessDetailsInput('firstName', this.user.firstName, this.profileDetailsErrors);
    }

    public validateLastName() {
        this.validateEmptyBusinessDetailsInput('lastName', this.user.lastName, this.profileDetailsErrors);
    }

    public validateUserEmail() {
        this.profileDetailsErrors.email = validateEmail(this.user.email).email;
    }

    public validateUserPhoneNumber() {
        this.validatePhoneNumber(this.user.phoneNumber, this.profileDetailsErrors);
    }

    public validateUserProfileDetailsPage() {
        this.validateFirstName();
        this.validateLastName();
        this.validateUserEmail();
        this.validateUserPhoneNumber();
    }

    public validateEmptyPassword(password: string, errorMessage: string, passwordType: keyof PasswordError): void {
        if (isEmpty(password)) {
            this.changePasswordErrors[passwordType] = errorMessage;
        } else {
            this.changePasswordErrors[passwordType] = '';
        }
    }

    public validateLengthOfPassword(password: string, passwordType: keyof PasswordError): void {
        if (password && password.length < 8) {
            this.changePasswordErrors[passwordType] = 'Password has to be at least 8 characters';
        } else {
            this.changePasswordErrors[passwordType] = '';
        }
    }

    public validatePasswordConfirmation() {
        if (this.changePasswordForm.newPassword?.trim() !== this.changePasswordForm.confirmPassword?.trim()) {
            this.changePasswordErrors.confirmPassword = 'Passwords do not match';
        }
    }

    get conditionsForChangePasswordButtonToBeDisabled() {
        return Object.values(this.changePasswordErrors).some(value => value.length > 0);
    }

    public validateOldPassword() {
        this.validateEmptyPassword(this.changePasswordForm.oldPassword, 'Please enter old password', 'oldPassword');
    }

    public validateNewPassword() {
        this.validateEmptyPassword(this.changePasswordForm.newPassword, 'Please enter new password', 'newPassword');
        if (this.changePasswordErrors.newPassword) {
            // this prevents this.changePasswordErrors.newPassword from being overwritten in the event that a previous error existed
            return;
        }
        this.validateLengthOfPassword(this.changePasswordForm.newPassword, 'newPassword');
    }

    public validateConfirmPassword() {
        this.validateEmptyPassword(
            this.changePasswordForm.confirmPassword,
            'Please confirm your password',
            'confirmPassword',
        );
        if (this.changePasswordErrors.confirmPassword) {
            // this prevents this.changePasswordErrors.confirmPassword from being overwritten in the event that a previous error existed
            return;
        }
        this.validatePasswordConfirmation();
    }

    public validateChangePasswordFields() {
        this.validateOldPassword();
        this.validateNewPassword();
        this.validateConfirmPassword();
    }

    public handlePasswordChangeSubmission() {
        this.validateChangePasswordFields();

        if (!Object.values(this.changePasswordErrors).some(key => key.length > 0)) {
            //this.$emit('otp-verification-is-required'); // if password fileds were validated successfully
            this.$emit('password-validated'); // if password fileds were validated successfully
        }
    }

    @Watch('changePasswordForm.newPassword')
    newPasswordHasChanged() {
        // check to see if the password confirmation matches when the new password is changed and there is already a value for
        // the password confirmation
        if (this.changePasswordForm.confirmPassword) {
            this.validateConfirmPassword();
        }
    }
}

export default SettingsMixin;
