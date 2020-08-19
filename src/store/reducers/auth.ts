import {SAVE_TOKEN} from "../actionTypes";
import {AuthAction} from "../actions";

export interface AuthState {
    token?: string,
    refresh?: string,
    expires_in: number,
}

const initialState: AuthState = {
    token: undefined,
    refresh: undefined,
    expires_in: 0,
};

if (Number(localStorage.getItem("expire_on")) > Number(new Date())){
    initialState.token = localStorage.getItem("token") || undefined;
    initialState.refresh = localStorage.getItem("refresh") || undefined;
    initialState.expires_in = Number(new Date(Number(localStorage.getItem("expire_on")))) - Number(new Date());
}

export default (state = initialState, action: AuthAction) => {
    switch (action.type) {
        case SAVE_TOKEN:
            const {token, refresh, expires_in} = action.payload;
            localStorage.setItem("token", token);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("expires_in", (new Date().setSeconds(new Date().getSeconds() + expires_in)).toString());
            return {
                ...state,
                token,
                refresh,
                expires_in
            };
        default:
            return state;
    }
};