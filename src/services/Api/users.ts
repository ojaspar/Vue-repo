import axiosInstance from '../axios';

import { User, Secret, LoginInfo } from '@/types';

export const validateBVNService = (bvn: string) => axiosInstance.post('/validate-bvn', bvn);
export const validateNubanService = (nuban: string) => axiosInstance.post('/validate-nuban', nuban);
export const signupService = (userObject: User) => axiosInstance.post('/signup', userObject);
export const loginService = (loginObject: LoginInfo) => axiosInstance.post('/login', loginObject);
export const getSecretQuestionsService = () => axiosInstance.get('/secret');
export const submitSecretQuestionService = (secretObject: Secret) => axiosInstance.post('/secret', secretObject);
export const createPasswordService = (password: object) => axiosInstance.post('/choose-password', password);
