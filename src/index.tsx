import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Redirect,} from 'react-router-dom';
import App from './App';
import Auth from './Auth';
import './tailwind.css';
import * as serviceWorker from './serviceWorker';

let app =
    <>
        <Switch>
            <Route exact path="/authenticate" component={Auth}/>
            <Route exact path="/hazizz" component={App}/>
        </Switch>
        {!localStorage.getItem("token") ? <Redirect to="/authenticate"/> : ""}
    </>;


ReactDOM.render(<Router>{app}</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
