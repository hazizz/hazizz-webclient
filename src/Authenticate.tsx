import React from 'react';

import GoogleLogin from "react-google-login";
import FacebookLogin, {ReactFacebookLoginInfo} from 'react-facebook-login';

import {authInstance} from "./axios/instaces";

import {connect} from "react-redux";
import {saveToken} from "./store/actions";

import {useHistory, useLocation} from "react-router-dom";

import logo from './assets/logo.png';

type tokenSave = {
    saveToken: Function
}

type authRequestResponseData = {
    token: string,
    refresh: string,
    scopes: null,
    expires_in: number,
    refresh_token: string,
    access_token: string,
}

function Authenticate(props: tokenSave) {
    let history = useHistory();
    let location = useLocation();

    let {from} = location.state || {from: {pathname: "/home"}};

    const handleGoogleAuth = (resp: any) => {
        authInstance({
            url: "/auth",
            method: "post",
            params: {
                "grant_type": "google_openid",
                "openid_token": resp.tokenId,
                "client_id": "H_MINDENHOL"
            }
        })
            .then(resp => {
                const respData: authRequestResponseData = resp.data;
                props.saveToken(respData.token, respData.refresh, respData.expires_in);
                history.replace(from);
            })
    };

    const handleFacebookLogin = (resp: ReactFacebookLoginInfo) => {
        console.log(JSON.stringify(resp));
        authInstance({
            url: "/auth",
            method: "post",
            params: {
                "grant_type": "facebook_token",
                "facebook_token": resp.accessToken,
                "client_id": "H_MINDENHOL"
            }
        })
            .then(resp => {
                const respData: authRequestResponseData = resp.data;
                props.saveToken(respData.token, respData.refresh, respData.expires_in);
                history.replace(from);
            });
    };

    return (
        <div className="authPage">
            <div>
                <img src={logo} alt="Házizz logo" className="logo"/>
                <p>Jelentkezz be!</p>
                <div>
                    <FacebookLogin
                        appId="737993926628989"
                        fields="email"
                        callback={handleFacebookLogin}
                        size="small"
                    />
                    <GoogleLogin
                        clientId="425675787763-751dukg0oookea8tltaeboudlg0g555q.apps.googleusercontent.com"
                        onSuccess={handleGoogleAuth}
                        onFailure={handleGoogleAuth}
                        scope="openid"
                    />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = null;

export default connect(mapStateToProps, {saveToken})(Authenticate);
