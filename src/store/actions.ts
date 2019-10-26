import {SAVE_TOKEN} from "./actionTypes";

export const saveToken = (token: string, refresh: string, expires_in: number) => ({
    type: SAVE_TOKEN,
    payload: {
        token,
        refresh,
        expires_in
    }
});