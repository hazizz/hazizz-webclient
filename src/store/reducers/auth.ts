import {SAVE_TOKEN} from "../actionTypes";

const initialState = {
    token: "",
    refresh: "",
    expires_in: 0,
    expire_on: 0,
};

if (Number(localStorage.getItem("expire_on")) > Number(new Date())){
    initialState.token = localStorage.getItem("token") || "";
    initialState.refresh = localStorage.getItem("refresh") || "";
    initialState.expires_in = Number(new Date(Number(localStorage.getItem("expire_on")))) - Number(new Date());
    initialState.expire_on = Number(localStorage.getItem("expire_on"));
}

export default (state = initialState, action: any) => {
    switch (action.type) {
        case SAVE_TOKEN:
            const {token, refresh, expires_in} = action.payload;
            localStorage.setItem("token", token);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("expire_on", (new Date().setSeconds(new Date().getSeconds() + expires_in)).toString());
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