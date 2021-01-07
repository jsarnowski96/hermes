import {GRANT_ACCESS_TOKEN, SET_LANGUAGE, USER_LOGIN} from '../constants/action-types';

export function userLogin(payload) {
    return {
        type: USER_LOGIN,
        payload
    }
}

export function grantAccessToken(payload) {
    return {
        type: GRANT_ACCESS_TOKEN,
        payload
    }
}

export function setLanguage(payload) {
    return {
        type: SET_LANGUAGE,
        payload
    }
}