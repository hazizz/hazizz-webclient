import *  as actionTypes from './actionTypes';
import { axiosAuth } from '../../axios';
import { sha256 } from "js-sha256";
import moment from "moment";

export const authLogout = () => ({
    type: actionTypes.AUTH_LOGOUT,
});

export const authTryAutoLogin = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            const expirationDate = moment(localStorage.getItem('token_expiration'));
            if (expirationDate.isAfter(moment())) {
                dispatch(authLogin(token, null));
            }
        }
    }
};

export const authClickLogin = ( username, password, remember ) => {
    return dispatch => {
        axiosAuth.post('/auth/accesstoken', {
            username,
            password: sha256(password),
        }).then(response => {
            let shouldSave = null;
            if (remember) {
                shouldSave = {refresh: response.data.refresh, username};
            }
            dispatch(authLogin(response.data.token, shouldSave));
        }).catch(err => {
            console.log(err);
        })
    }
};

export const authLogin = ( token, shouldSave ) => (
    {
        type: actionTypes.AUTH_LOGIN,
        token,
        shouldSave,
    }
);