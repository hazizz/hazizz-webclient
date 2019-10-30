import React, {Component, ChangeEvent} from 'react';

import GoogleLogin from "react-google-login";
// @ts-ignore
import FacebookLogin, {ReactFacebookLoginInfo} from 'react-facebook-login/dist/facebook-login-render-props';

import {authInstance} from "../axios/instaces";

import {connect} from "react-redux";
import {saveToken} from "../store/actions";

import logo from '../assets/logo.png';

import {AuthDetails, Error} from "../types/types";

type Props = {
    saveToken: (token: string, refresh: string, expires_in: number) => void,
    location: any,
    history: any
}

type State = {
    consent: boolean,
    withoutConsent: boolean,
}

class Authenticate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            consent: false,
            withoutConsent: false,
        }
    }

    handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            consent: event.target.checked
        })
    };

    render() {
        let {from} = this.props.location.state || {from: {pathname: "/home"}};
        const consentClasses = ["consentLabel"];
        if (this.state.withoutConsent)
            consentClasses.push("text-red-500");

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
                    const respData: AuthDetails = resp.data;
                    this.props.saveToken(respData.token, respData.refresh, respData.expires_in);
                    this.props.history.replace(from);
                })
                .catch(resp => {
                    const respData: Error = resp.response.data;
                    if (respData.errorCode === 23){
                        authInstance({
                            url: "/account/googleregister",
                            method: "post",
                            data: {
                                "openIdToken": tokenId,
                                "consent": this.state.consent
                            }
                        })
                            .then(resp => {
                                const respData: AuthDetails = resp.data;
                                this.props.saveToken(respData.token, respData.refresh, respData.expires_in);
                                this.props.history.replace(from);
                            })
                            .catch(resp => {
                                const respData: Error = resp.response.data;
                                if (respData.errorCode === 35){
                                    this.setState({withoutConsent: true});
                                }
                            });
                    }
                })
        };

        const handleFacebookLogin = (resp: ReactFacebookLoginInfo) => {
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
                    const respData: AuthDetails = resp.data;
                    this.props.saveToken(respData.token, respData.refresh, respData.expires_in);
                    this.props.history.replace(from);
                });
        };

        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="max-w-md md:max-w-lg p-3 lg:max-w-4xl">
                    <img src={logo} alt="Házizz logo" className="w-5/6 md:w-3/5 m-auto"/>
                    <h1 className="text-center text-3xl font-bold text-hazizz_blue-200 md:text-5xl lg:text-6xl">Jelentkezz
                        be!</h1>
                    <p className="text-xs text-center text-gray-600 tracking-tight md:text-sm md:tracking-normal lg:text-xl">
                        (A bejelentkezést és a regisztációt ugyan azok a gombok végzik.)
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
                                        className={this.state.consent ? "btn bg-facebook cursor-pointer" : "btn bg-facebook cursor-default"}
                                        onClick={props.onClick}
                                        disabled={!this.state.consent}
                                        title={this.state.consent ? "" : "El kell fogadnod a feltételeket a folytatáshoz!"}>
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
                                        className={this.state.consent ? "btn bg-google cursor-pointer" : "btn bg-google cursor-default"}
                                        onClick={props.onClick}
                                        disabled={!this.state.consent}
                                        title={this.state.consent ? "" : "El kell fogadnod a feltételeket a folytatáshoz!"}>
                                        Bejelnetkezés Google használatával
                                    </button>
                                )}
                            />
                        </div>
                        <label className={consentClasses.join(" ")} htmlFor="consent">
                            <input className="absolute opacity-0 cursor-pointer h-0 w-0"
                                   onChange={this.handleCheckChange} checked={this.state.consent} type="checkbox"
                                   name="consent" id="consent"/>
                            <span className="consentCheckMark hover:bg-hazizz_blue-500 focus:shadow-outline"/>
                            A regisztrációval és/vagy bejelekezéssel elfogadom a Házizz&nbsp;
                            <a className="consentLink" rel="noopener noreferrer" target="_blank"
                               href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/privacy-hu.txt">adatvédelmi
                                nyilatkozatát</a>,&nbsp;
                            <a className="consentLink" rel="noopener noreferrer" target="_blank"
                               href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/tos-hu.txt">általános
                                szerződési feltételeti</a>,
                            és a&nbsp;
                            <a className="consentLink" rel="noopener noreferrer" target="_blank"
                               href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/guideline-hu.txt">házirendjét</a>!
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {saveToken})(Authenticate);
