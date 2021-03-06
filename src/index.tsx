import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import {Provider} from "react-redux";
import store from "./store/store";

import Home from "./components/Home";
import Authenticate from './containers/Authenticate';
import Register from './containers/Register';
import './tailwind.css';

import * as serviceWorker from './serviceWorker';

const render =
    <Provider store={store}>
        <Router>
            <Redirect to="/home"/>
            <Switch>
                <PrivateRoute path="/home" Component={Home}/>
                <Route exact path="/authenticate" component={Authenticate}/>
                <Route path="/authenticate/consent" component={Register}/>
            </Switch>
        </Router>
    </Provider>;

ReactDOM.render(render, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
