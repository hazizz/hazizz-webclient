import React from 'react';
import GoogleLogoImage from "./btn_google_dark_normal_ios.svg";

const GoogleButton = (props: any) => {
    return (
        <button
            className="btn btn-login btn-google bg-google flex items-center"
            onClick={props.onClick}
        >
            <img src={GoogleLogoImage} alt="Google Logo" className="float-left"/>
            Bejelnetkezés Google használatával
        </button>
    );
};

export default GoogleButton;