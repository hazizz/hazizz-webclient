import React, {Component} from 'react';

import GoogleLogin from "react-google-login";
// @ts-ignore
import FacebookLogin, {ReactFacebookLoginInfo} from 'react-facebook-login/dist/facebook-login-render-props';

import {authInstance} from "../axios/instaces";

import {connect} from "react-redux";
import {saveToken} from "../store/actions";

import logo from '../assets/logo.png';

import {AuthDetails, Error} from "../types/types";

import {RouteComponentProps} from "react-router-dom";

interface Props extends RouteComponentProps {
    saveToken: (token: string, refresh: string, expires_in: number) => void,
}

class Authenticate extends Component<Props> {
    render() {
        let {from} = this.props.location.state || {from: {pathname: "/home"}};

        const handleTokenSave = (respData: AuthDetails) => {
            this.props.saveToken(respData.token, respData.refresh, respData.expires_in);
            this.props.history.replace(from);
        };

        const handleRegister = (respData: Error, type: string, token: string) => {
            if (respData.errorCode === 23)
                this.props.history.replace({
                    pathname: this.props.location.pathname + "/consent",
                    search: "?type=" + type + "&token=" + token
                });
        };

        const handleGoogleAuth = (resp: any) => {
            const tokenId:string = resp.tokenId;
            authInstance({
                url: "/auth",
                method: "post",
                params: {
                    "grant_type": "google_openid",
                    "openid_token": tokenId,
                    "client_id": "H_MINDENHOL"
                }
            })
                .then(resp => {
                    handleTokenSave(resp.data);
                })
                .catch(resp => {
                    handleRegister(resp.response.data, "google", tokenId);
                });
        };

        const handleFacebookLogin = (resp: ReactFacebookLoginInfo) => {
            const accessToken = resp.accessToken;
            authInstance({
                url: "/auth",
                method: "post",
                params: {
                    "grant_type": "facebook_token",
                    "facebook_token": accessToken,
                    "client_id": "H_MINDENHOL"
                }
            })
                .then(resp => {
                    handleTokenSave(resp.data);
                })
                .catch(resp => {
                    handleRegister(resp.response.data, "facebook", accessToken);
                });
        };

        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="max-w-md md:max-w-lg p-3 lg:max-w-4xl">
                    <img src={logo} alt="Házizz logo" className="w-5/6 md:w-3/5 m-auto"/>
                    <h1 className="text-center text-3xl font-bold text-hazizz_blue-200 md:text-5xl lg:text-6xl">Jelentkezz
                        be!</h1>
                    <p className="text-xs text-center text-gray-600 tracking-tight md:text-sm md:tracking-normal lg:text-xl">
                        (Amennyiben nincs felhasználód a rendszer készít neked egyet.)
                    </p>
                    <p className="text-center text-hazizz_blue-200 text-xl font-semibold md:text-3xl lg:text-4xl">
                        Használd a közösségi bejelentkezések egyikét:
                    </p>
                    <div>
                        <div className="flex flex-col lg:flex-row">
                            <FacebookLogin
                                appId="737993926628989"
                                fields="email"
                                callback={handleFacebookLogin}
                                size="small"
                                render={(props: { onClick: () => React.MouseEvent }) => (
                                    <button
                                        className="btn btn-login bg-facebook"
                                        onClick={props.onClick}
                                    >
                                        Bejelentkezés Facebook használatával
                                    </button>
                                )}
                            />
                            <GoogleLogin
                                clientId="425675787763-751dukg0oookea8tltaeboudlg0g555q.apps.googleusercontent.com"
                                onSuccess={handleGoogleAuth}
                                onFailure={handleGoogleAuth}
                                scope="openid"
                                className="google_login_button"
                                render={props => (
                                    <button
                                        className="btn btn-login bg-google"
                                        onClick={props.onClick}
                                    >
                                        Bejelnetkezés Google használatával
                                    </button>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {saveToken})(Authenticate);
