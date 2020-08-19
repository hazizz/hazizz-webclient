import {combineReducers} from "redux";
import auth, {AuthState} from "./auth";

export interface RootState {
    auth: AuthState
}

export default combineReducers({auth});