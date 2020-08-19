import {SAVE_TOKEN} from "./actionTypes";

interface SaveToken {
    type: typeof SAVE_TOKEN,
    payload: {
        token: string,
        refresh: string,
        expires_in: number
    }
}

export type AuthAction = SaveToken;

export const saveToken = (token: string, refresh: string, expires_in: number): AuthAction => ({
    type: SAVE_TOKEN,
    payload: {
        token,
        refresh,
        expires_in
    }
});