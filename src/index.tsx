import React from 'react';
import ReactDOM from 'react-dom';

import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
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

serviceWorker.unregister();
