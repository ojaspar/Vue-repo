/*eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import axiosInstance from '@/services/axios';
import { ErrorResponse } from '@/utils/errorCode';
import { Commit as VuexCommit } from 'vuex';

const errorHandler = (error: any) => {
    let code, message;

    //axios wraps the error into a response object
    if (!error.response) {
        //No Axios Response
        code = null;
        message = error.message;

        return { code, message };
    }

    code = error.response?.data?.code;
    //Return server error message if it exists
    message = error.response?.data?.message;

    if (!code) {
        code = 500;
    }

    if (!message) {
        message = ErrorResponse[code];

        return { code, message };
    }

    if (message) {
        const len = message.length;

        if (len === 3) {
            //it is an error code
            message = ErrorResponse[Number(message)];
        }

        return { code, message };
    }

    const requestStatus = error.response?.status;

    // this is a stop gap for validation errors until the errors are properly formatted by the backend team
    if (requestStatus === 422) {
        const { errors } = error.response.data;

        code = requestStatus;
        message = errors[0].code;

        return { code, message };
    }

    message = ErrorResponse[code];

    return { code, message };
};

const genericAPIRequest = async (commit: VuexCommit, actionTypes: Array<string>, axiosConfig: object) => {
    commit(actionTypes[0]);
    try {
        const response = await axiosInstance(axiosConfig);
        commit(actionTypes[1], response.data.data || response.data);
        return response;
    } catch (error) {
        commit(actionTypes[2], errorHandler(error));
        return errorHandler(error);
    }
};

/**
 * A function to make GET requests
 * @param commit Commit object from Vuex store
 * @param url The request url
 * @param actions All the actions to be commited
 */
export const genericGetRequest = (commit: VuexCommit, url: string, actions: Array<string>) =>
    genericAPIRequest(commit, actions, {
        method: 'GET',
        url,
    });

/**
 * A function to make POST requests
 * @param commit Commit object from Vuex store
 * @param url The request url
 * @param actions All the actions to be commited
 * @param requestBody The body of the request i.e request.body
 */
export const genericPostRequest = (commit: VuexCommit, url: string, actions: Array<string>, requestBody: object) =>
    genericAPIRequest(commit, actions, {
        method: 'POST',
        url,
        data: requestBody,
    });

/**
 * A function to make PUT requests
 * @param commit Commit object from Vuex store
 * @param url The request url
 * @param actions All the actions to be commited
 * @param requestBody The body of the request i.e request.body
 */
export const genericPutRequest = (commit: VuexCommit, url: string, actions: Array<string>, requestBody: object = {}) =>
    genericAPIRequest(commit, actions, {
        method: 'PUT',
        url,
        data: requestBody,
    });

/**
 * A function to make DELETE requests
 * @param commit Commit object from Vuex store
 * @param url The request url
 * @param actions All the actions to be commited
 * @param requestBody The body of the request i.e request.body
 */
export const genericDeleteRequest = (
    commit: VuexCommit,
    url: string,
    actions: Array<string>,
    requestBody: object = {},
) =>
    genericAPIRequest(commit, actions, {
        method: 'DELETE',
        url,
        data: requestBody,
    });
