export interface UserError {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface UserProfileBusiness {
    name: string;
    rc: string;
    phone: string;
    type: { name: string; key: string };
    email: string;
    industry: { name: string; key: string };
    country: { name: string; key: string };
    state: { name: string; key: string };
    council: { name: string; key: string };
    address: string;
    businessKey: string;
    industryName?: string;
}

export const defalutBusinesssProfile: UserProfileBusiness = {
    name: '',
    rc: '',
    phone: '',
    type: { name: '', key: '' },
    email: '',
    industry: { name: '', key: '' },
    country: { name: '', key: '' },
    state: { name: '', key: '' },
    council: { name: '', key: '' },
    address: '',
    businessKey: '',
};

export interface PasswordError {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface UserProfile {
    firstName: '';
    lastName: '';
    email: '';
    phoneNumber: '';
}

export interface UserProfileResponse {
    firstName: '';
    lastName: '';
    email: '';
    phoneNumber: '';
}

export interface UserProfileStatus {
    fetchUserProfile: string;
}

export interface AddBusinessUserPayload {
    firstName: '';
    lastName: '';
    email: '';
    phoneNumber: '';
    password: '';
}

export interface BusinessUserResponse {
    firstName: '';
    lastName: '';
    email: '';
    phoneNumber: '';
    userKey: '';
}
