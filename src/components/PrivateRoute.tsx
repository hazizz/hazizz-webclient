import React, {ReactElement} from "react";
import {Route, Redirect} from 'react-router-dom'
import {connect} from "react-redux";

type PrivateRoute = {
    exact?: boolean,
    path: string,
    Component?: any,
    render?: () => null | ReactElement,
    authenticated: boolean
}

const PrivateRoute = ({
                          exact = false,
                          path,
                          Component,
                          render = () => null,
                          authenticated = false
                      }: PrivateRoute) => {
    let route = <Route exact={exact} path={path} component={Component} render={() => render()}/>;
    if (!authenticated)
        route = <Redirect to="/authenticate"/>;

    return route;
};

const mapStateToProps = (state: any) => {
    const {auth} = state;
    return {authenticated: auth.token.length > 0};
};

export default connect(mapStateToProps)(PrivateRoute);