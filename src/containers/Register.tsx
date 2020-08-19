import React, {Component, ChangeEvent} from 'react';

import {connect} from "react-redux";
import {saveToken} from "../store/actions";

import logo from '../assets/logo.png';

import {RouteComponentProps} from "react-router-dom";
import queryString from "querystring";
import {authInstance} from "../axios/instaces";
import {AuthResponse} from "../types/types";

interface Props extends RouteComponentProps<{}, any, {from: {pathname: string}}> {
    saveToken: (token: string, refresh: string, expires_in: number) => void,
}

type State = {
    authType: string,
    token: string,
    consent: boolean
}

class Register extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            authType: "",
            token: "",
            consent: false
        }
    }

    componentDidMount(): void {
        const queryParams = queryString.parse(this.props.location.search.substr(1));
        this.setState(()=>({
            authType: queryParams.type as string,
            token: queryParams.token as string,
        }))
    }

    handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            consent: event.target.checked
        })
    };

    handleRegister = () => {
        let registerUrlParameter = "";
        let registerBodyParameter = "";
        let loginValue = "";
        let loginParameter = "";
        switch (this.state.authType) {
            case "google":
                registerUrlParameter = "googleregister";
                registerBodyParameter = "openIdToken";
                loginValue = "google_openid";
                loginParameter = "openid_token";
                break;
            case "facebook":
                registerUrlParameter = "facebookregister";
                registerBodyParameter = "facebookToken";
                loginValue = "facebook_token";
                loginParameter = "facebook_token";
                break;
        }
        authInstance({
            url: "/account/" + registerUrlParameter,
            method: "post",
            data: {
                [registerBodyParameter]: this.state.token,
                consent: this.state.consent
            }
        })
            .then(resp=>{
                if (resp.status === 201){
                    authInstance({
                        url: "/auth",
                        method: "post",
                        params: {
                            "grant_type": loginValue,
                            [loginParameter]: this.state.token,
                            "client_id": "H_MINDENHOL"
                        }
                    })
                        .then(resp => {
                            this.handleTokenSave(resp.data);
                        })
                }
            })
    };

    handleTokenSave = (respData: AuthResponse) => {
        let {from} = this.props.location.state || {from: {pathname: "/home"}};

        this.props.saveToken(respData.token, respData.refresh, respData.expires_in);
        this.props.history.replace(from);
    };

    render() {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="max-w-md md:max-w-lg p-3 lg:max-w-4xl">
                    <img src={logo} alt="Házizz logo" className="w-5/6 md:w-3/5 m-auto"/>
                    <h1 className="text-center text-3xl font-bold text-hazizz_blue-200 md:text-5xl lg:text-6xl">
                        Regisztáció!
                    </h1>
                    <div className="flex flex-col items-center justify-center">
                        <label className="consentLabel" htmlFor="consent">
                            <input className="absolute opacity-0 cursor-pointer h-0 w-0"
                                   onChange={this.handleCheckChange} checked={this.state.consent} type="checkbox"
                                   name="consent" id="consent"/>
                            <span className="consentCheckMark hover:bg-hazizz_blue-500 focus:shadow-outline"/>
                            A regisztrációval elfogadom a Házizz:
                            <ul className="ml-3">
                                <li>
                                    <a className="consentLink" rel="noopener noreferrer" target="_blank"
                                       href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/privacy-hu.txt">adatvédelmi
                                        nyilatkozatát</a>,

                                </li>
                                <li>
                                    <a className="consentLink" rel="noopener noreferrer" target="_blank"
                                       href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/tos-hu.txt">általános
                                        szerződési feltételeti</a>,

                                </li>
                                <li>
                                    <a className="consentLink" rel="noopener noreferrer" target="_blank"
                                       href="https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/guideline-hu.txt">házirendjét</a>!
                                </li>
                            </ul>
                        </label>
                        <button onClick={this.handleRegister} className="btn btn-green">Tovább &raquo;</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {saveToken})(Register);
