import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Login.module.css';
import Logo from '../../../assets/logo.png';
import { Button, Form } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";

import * as acionCreators from '../../../store/actions/index';

class Login extends Component {
    state = {
        username: "",
        password: "",
        rememberMe: false,
        loading: false,
    };

    inputChangeHandler = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    checkChangeHandler = event => {
        this.setState({rememberMe: event.target.checked});
    };

    onFormSubmit = event => {
        event.preventDefault();
        this.setState({loading: true});
        this.props.onClickLogin(
            this.state.username,
            this.state.password,
            this.state.rememberMe,
        )
    };

    render() {
        let buttonText = "Bejelentkezés!";
        if (this.state.loading) {
            buttonText = (<React.Fragment><span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true" /> Folyamatban...</React.Fragment>)
        }

        return (
            <div className={styles.wrapper}>
                {this.props.isAuth ? <Redirect to="/" /> : null}
                <form
                    className={styles.formSignIn} onSubmit={this.state.loading ? null : this.onFormSubmit}>
                    <div className="text-center mb-4">
                        <img src={Logo} alt="Házizz" className={styles.logo} />
                        <h3 className={styles.text}>Diákoktól, diákoknak!</h3>
                    </div>
                    <div className={styles.formLabelGroup}>
                        <input
                            name="username"
                            id="inputUsername"
                            type="text"
                            className="form-control"
                            placeholder="Felhasználónév"
                            autoFocus
                            onChange={this.inputChangeHandler}
                            value={this.state.username} />
                        <label htmlFor="inputUsername">Felhasználónév</label>
                    </div>
                    <div className={styles.formLabelGroup}>
                        <input
                            name="password"
                            id="inputPassword"
                            type="password"
                            className="form-control"
                            placeholder="Jelszó"
                            onChange={this.inputChangeHandler}
                            value={this.state.password} />
                        <label htmlFor="inputPassword">Jelszó</label>
                    </div>
                    <Form.Check
                        checked={this.state.rememberMe}
                        type="checkbox"
                        label="Maradjak bejelentkezve!"
                        onChange={this.checkChangeHandler} />
                    <div style={{margin: "5px 0"}}>
                        <Button
                            type="submit"
                            variant="hazizz-blue"
                            size="lg"
                            block
                            disabled={this.state.loading}>
                            {buttonText}
                        </Button>
                    </div>
                    <Link to="/register">
                        <Button variant="transparent" block>Regisztráció!</Button>
                    </Link>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClickLogin: ( username, password, remember ) => dispatch(acionCreators.authClickLogin(
            username,
            password,
            remember,
        )),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);