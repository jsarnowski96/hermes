import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router';
import axios from 'axios';

import {getJwtDataFromSessionStorage, setJwtDataInSessionStorage} from '../../middleware/jwtSessionStorage';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                auth: {
                    userId: this.jwt.userId,
                    refreshToken: this.jwt.refreshToken
                },
                unauthorized: true,
                redirected: false,
                authenticated: false,
                fields: {},
                errors: {}
            }
        } else {
            this.state = {
                auth: {
                    userId: null,
                    refreshToken: null
                },
                unauthorized: true,
                redirected: false,
                authenticated: false,
                fields: {},
                errors: {}
            }
        }
    }

    componentDidMount() {
        if(this.props.location.state !== undefined && this.props.location.state !== null && this.props.location.state !== '') {
            if(this.props.location.state.unauthorized && this.props.location.state.redirected) {
                this.setState({
                    unauthorized: true,
                    redirected: true
                })
            } else if(!this.props.location.unauthorized) {
                this.setState({
                    unauthorized: false
                })
            }
        }

        if(this.jwt !== null && this.jwt !== undefined && this.jwt !== '') {
            this.setState({ unauthorized: false, authenticated: true });
        }
    }

    onChange(field, event) {
        let fields = this.state.fields;
        let errors = this.state.errors;
        fields[field] = event.target.value;       
        errors[field] = '';
        this.setState({fields, errors});
    }

    validateForm() {
        let fields = this.state.fields;
        let errors = this.state.errors;
        let isValid = true;
        const {t} = this.props;

        if(!fields['login']) {
            isValid = false;
            errors['login'] = t('misc.phrases.field') + ' \'' + t('content.login.login') + '\' ' + t('content.login.errorMessages.formValidation.requiredFieldIsEmpty');
        } else if(typeof fields['login'] !== undefined) {
            if(!fields['login'].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) && !fields['login'].match(/^[a-zA-Z0-9\-_.]+$/)) {
                isValid = false;
                errors['login'] = t('content.login.errorMessages.loginNotValid');
            }
        }

        if(!fields['password']) {
            isValid = false;
            errors['password'] = t('misc.phrases.field') + ' \'' + t('content.login.password') + '\' ' + t('content.login.errorMessages.formValidation.requiredFieldIsEmpty');
        }

        this.setState({errors: errors});

        return isValid;
    }

    onFormSubmit = (event, errors) => {
        event.preventDefault();
        const fields = this.state.fields;
        const {t} = this.props;

        if(this.validateForm()) {
            axios.post('http://localhost:3300/auth/login', 
                {
                    login: fields['login'],
                    password: fields['password'],
                }, 
                {
                    withCredentials: true,
                    auth: 
                    {
                        username: fields['login'],
                        password: fields['password']
                    }
            }).then((response) => {
                if((response.data.user._id !== undefined && response.data.user._id !== '' && response.data.user._id !== null) && (response.data.refreshToken !== undefined && response.data.refreshToken !== '' && response.data.refreshToken !== null)) {
                    setJwtDataInSessionStorage(response.data.user._id, response.data.refreshToken);
                    this.jwt = getJwtDataFromSessionStorage();
                    if(this.jwt !== null && this.jwt !== '' && this.jwt !== undefined) {
                        sessionStorage.setItem('renderLogoutBtn', true);
                        this.setState({ authenticated: true, unauthorized: false});
                    }
                };
            })
            .catch((error) => {
                let sr = document.querySelector('#serverResponse');
                if(error) {
                    if(error === 'usernameOrPasswordIncorrect') {
                        sr.innerHTML = t('content.login.errorMessages.usernameOrPasswordIncorrect');
                    } else {
                        sr.innerHTML = error;
                    }
                } else {
                    sr.innerHTML = 'Could not get server error message';
                }
                sr.style.display = 'block';
            });
        } else {
            let errors = document.querySelectorAll('.error-msg-span');
            for(var i = 0; i < errors.length; i++) {
                errors[i].style.display = 'block';
            }
        }
    }

    render() {
        const{t} = this.props;

        if(this.state.authenticated === true && this.jwt !== undefined) {
            return(
                <Redirect to=
                   {{ 
                        pathname: '/dashboard'
                   }} 
                />
            )
        }

        return(
            <div className="card">
                <p className="card-title">{t('content.login.title')}</p><hr className="card-hr" />
                <form className="card-form" onSubmit={this.onFormSubmit}>
                    <label htmlFor="login">{t('content.login.login')}</label>
                    <input onChange={this.onChange.bind(this, 'login')} value={this.state.fields['login']} type="login" className="" id="login" name="login" />
                    <span className="error-msg-span">{this.state.errors["login"]}</span>
                    <label htmlFor="password">{t('content.login.password')}</label>
                    <input onChange={this.onChange.bind(this, 'password')} value={this.state.fields['password']} type="password" className="" id="password" name="password" />
                    <span className="error-msg-span">{this.state.errors["password"]}</span>
                    <div class="card-form-divider">
                        <button type="submit" className="card-form-button">{t('content.login.submit')}</button>
                        <button type="button" className="card-form-button"><Link to="/" className="card-form-button-link">{t('content.login.cancel')}</Link></button>
                    </div>
                    {this.state.unauthorized && this.state.redirected ? (
                        <span className="error-msg-span" style={{display: "block"}} id="serverResponse">UNAUTHORIZED</span>
                    ) : (
                        <span className="error-msg-span" id="serverResponse"></span>
                    )}
                </form>
                <p className="card-form-reminder">{t('content.login.registerTip')} <Link to="/login">{t('content.login.registerLink')}</Link></p>
            </div>
        )
    }    
}

const LoginTranslation = withTranslation('common')(Login);

export default LoginTranslation;

// TODO 18.01 - FIX REACT ROUTER/REDIRECT ISSUE WITH LOGIN/DASHBOARD

