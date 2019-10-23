import React, {Component} from 'react';
import GoogleLogin from "react-google-login";
import axios from "axios";

class App extends Component {
    google = (resp: any) => {
        console.log(resp);
        axios({
            method: 'post',
            url: "https://hazizz.duckdns.org:9000/auth-server/auth",
            params: {
                grant_type: "google_openid",
                openid_token: resp.accessToken,
                client_id: "WEBCLIENT"
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(r => console.log(r));
    };
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        document.getElementById('googleButton');

        return (
            <div className="modal">
                <div className="modal-overlay"/>
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-title">
                            <p className="text-2x1 font-bold">Jelentkezz be!</p>
                            <GoogleLogin
                                clientId="425675787763-751dukg0oookea8tltaeboudlg0g555q.apps.googleusercontent.com"
                                onFailure={this.google}
                                onSuccess={this.google}
                                scope="openid email"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
