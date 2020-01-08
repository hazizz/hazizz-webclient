import React from 'react';
import GoogleButtonImage from "./btn_google_signin_dark_normal_web@2x.png";

const GoogleButton = (props: any) => {
    return (
        <button
            className="btn btn-login btn-google"
            onClick={props.onClick}
            style={{backgroundImage: "url(" + GoogleButtonImage + ")"}}
        >
        </button>
    );
};

export default GoogleButton;