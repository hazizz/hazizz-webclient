import React from 'react';
import ReactDOM from 'react-dom';

import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import {Provider} from "react-redux";
import store from "./store/store";

import Authenticate from './Authenticate';
import './tailwind.css';

import * as serviceWorker from './serviceWorker';

const render =
    <Provider store={store}>
        <Router>
            <Redirect to="/home"/>
            <Switch>
                <PrivateRoute path="/home" render={() => <p>Home</p>}/>
                <Route path="/authenticate" component={Authenticate}/>
            </Switch>
        </Router>
    </Provider>;

ReactDOM.render(render, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
