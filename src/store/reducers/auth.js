import * as actonTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/updateObject';
import { setAuthorizationTokenByDefault } from '../../axios';
import moment from 'moment';

const initialState = {
    token: null,
};

const authLogout = (state) => {
    localStorage.clear();
    return updateObject(state, {token: null});
};

const authLogin = ( state, action ) => {
    setAuthorizationTokenByDefault(action.token);
    localStorage.setItem("token", action.token);

    if (!localStorage.getItem('token_expiration')){
        const expirationDate = moment().add(1, 'd');
        localStorage.setItem("token_expiration", expirationDate.toISOString());
    }

    if (action.shouldSave){
        localStorage.setItem("username", action.shouldSave.username);
        localStorage.setItem("refresh", action.shouldSave.refresh);
    }
    return updateObject(state, {token: action.token})
};

const reducer = ( state = initialState, action ) => {
    switch (action.type) {
        case actonTypes.AUTH_LOGIN:
            return authLogin(state, action);
        case actonTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        default:
            return state;
    }
};

export default reducer;