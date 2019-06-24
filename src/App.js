import React, { Component } from 'react';
import classes from './App.module.css';
import { Route, Switch } from 'react-router-dom';
import Login from './containers/Auth/Login/Login';
import { connect } from "react-redux";

import { authTryAutoLogin } from './store/actions/index';
import Logout from "./components/Auth/Logout/Logout";

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignIn();
    }

    render() {
        return (
            <Switch>
                <Route
                    path="/thera" render={() => (
                    <React.Fragment>
                        <p>Théra</p>
                        <div className={classes.loader}>WIP</div>
                    </React.Fragment>
                )} />
                <Route
                    path="/register" render={() => (
                    <React.Fragment>
                        <p>Register</p>
                        <div className={classes.loader}>WIP</div>
                    </React.Fragment>
                )} />
                <Route path="/logout" component={Logout} />
                <Route path="/login" component={Login} />
                <Route
                    path="/" render={() => (
                    <React.Fragment>
                        <p>Házizz főoldal</p>
                        <div className={classes.loader}>WIP</div>
                    </React.Fragment>
                )} />
            </Switch>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(authTryAutoLogin()),
    }
};

export default connect(null, mapDispatchToProps)(App);
